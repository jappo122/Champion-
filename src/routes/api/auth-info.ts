import { createAPIFileRoute } from "@tanstack/react-start/api";
import { sql } from "~/db";
import { createHash } from "node:crypto";
import { getSubscriptionState } from "~/lib/subscription-server";

// ── JWT verification (matches my-progress.ts / webinar-url.ts) ─────────────
function getSecret() {
  return process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
}
function verifyToken(token: string): { userId: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, bodyB64, sig] = parts;
    const expectedSig = createHash("sha256")
      .update(`${headerB64}.${bodyB64}.${getSecret()}`)
      .digest("hex");
    if (sig !== expectedSig) return null;
    const body = JSON.parse(Buffer.from(bodyB64, "base64url").toString());
    if (body.exp && body.exp < Date.now()) return null;
    return { userId: body.userId };
  } catch {
    return null;
  }
}

// ── POST /api/auth-info ────────────────────────────────────────────────────
// Owner rule (2026-10): the server reports the truth about training access.
// `subscribed` is explicit and `tier` is the REAL tier from an ACTIVE
// subscription row (or null) — a logged-in user with no subscription is never
// reported as "basic", which previously unlocked the whole catalog.
// Mirrors the same endpoint in serve.ts (Bun) and api/ssr.mjs (Vercel).
export const POST = createAPIFileRoute("/api/auth-info")({
  handler: async ({ request }) => {
    try {
      const body = (await request.json().catch(() => ({}))) as { token?: string };
      const token = body?.token;
      if (!token) {
        return new Response(JSON.stringify({ authenticated: false, user: null }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      const payload = verifyToken(token);
      if (!payload) {
        return new Response(JSON.stringify({ authenticated: false, user: null }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      const db = sql();
      const users = (await db`
        SELECT id, email, name, role FROM users WHERE id = ${payload.userId}
      `) as Array<{ id: number; email: string; name: string | null; role: string }>;
      if (users.length === 0) {
        return new Response(JSON.stringify({ authenticated: false, user: null }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      const user = users[0];
      const sub = await getSubscriptionState(user);
      return new Response(
        JSON.stringify({
          authenticated: true,
          subscribed: sub.subscribed,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tier: sub.tier,
            subscribed: sub.subscribed,
          },
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.error("[auth-info POST] Error:", err);
      return new Response(JSON.stringify({ authenticated: false, user: null }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
