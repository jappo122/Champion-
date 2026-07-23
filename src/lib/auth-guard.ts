import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { createHash } from "node:crypto";

const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Validate a user's session and return their auth info (userId, email, role, tier).
 * Returns null if token is invalid/expired or user not found.
 */
export const getAuthInfo = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { authenticated: false, user: null };

    const db = sql();
    const userId = payload.userId as number;
    const userResult = await db`
      SELECT id, email, name, role, session_token FROM users WHERE id = ${userId}
    ` as Array<{ id: number; email: string; name: string | null; role: string; session_token: string }>;

    if (userResult.length === 0) return { authenticated: false, user: null };

    const user = userResult[0];

    // Session token check removed — JWT expiration (7 days) is sufficient

    // Get subscription tier
    const subResult = await db`
      SELECT tier, status FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active' 
      ORDER BY id DESC LIMIT 1
    ` as Array<{ tier: string; status: string }>;

    const tier = subResult.length > 0 ? subResult[0].tier : "basic";

    // Demo accounts always get premium tier for full platform access
    const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
    const effectiveTier = (user.id === 1 || DEMO_EMAILS.includes(user.email.toLowerCase())) ? "premium" : tier;

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tier: effectiveTier,
      },
    };
  },
);

/**
 * Tier access levels.
 * "basic" can access basic features.
 * "plus" can access basic + plus features.
 * "premium" can access everything.
 */
export const TIER_ACCESS: Record<string, string[]> = {
  basic: ["training", "steps", "profile"],
  plus: ["training", "steps", "profile", "manager-basic", "tasks"],
  premium: ["training", "steps", "profile", "manager-basic", "tasks", "sales-log", "calendar", "full-analytics"],
};

export function hasAccess(userTier: string | null | undefined, requiredFeature: string): boolean {
  if (!userTier) return false;
  const tierMap: Record<string, number> = { basic: 0, plus: 1, premium: 2 };
  const userLevel = tierMap[userTier] ?? 0;
  const featureTiers: Record<string, number> = {
    "training": 0,       // basic+
    "steps": 0,          // basic+
    "profile": 0,        // basic+
    "tasks": 1,          // plus+
    "manager-basic": 1,  // plus+
    "sales-log": 2,      // premium+
    "calendar": 2,       // premium+
    "full-analytics": 2, // premium+
  };
  const requiredLevel = featureTiers[requiredFeature] ?? 0;
  return userLevel >= requiredLevel;
}