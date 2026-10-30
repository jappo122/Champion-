// Server-side subscription truth for the TanStack API file routes
// (src/routes/api/*.ts) — the handlers that run under `vite dev` and the
// platform's working/live site.
//
// Keep this in step with the copy in api/handlers.mjs (the Bun/Vercel API layer):
// same demo accounts, same rule — training access requires a row in
// `subscriptions` with status = 'active', demo/owner accounts always pass.
import { sql } from "~/db";

export const DEMO_EMAILS = [
  "owner@champion.com",
  "jappo122@gmail.com",
  "floydsandersjr@yahoo.com",
];
export const DEMO_USER_IDS = [1];

export function isDemoAccount(user: { id?: number | string | null; email?: string | null } | null) {
  if (!user) return false;
  const id = Number(user.id);
  const email = String(user.email || "").trim().toLowerCase();
  return DEMO_USER_IDS.includes(id) || DEMO_EMAILS.includes(email);
}

/**
 * Real entitlement for a user: `subscribed` is explicit and `tier` is the tier
 * from an ACTIVE subscription row, or null when there is none (never a
 * defaulted "basic").
 */
export async function getSubscriptionState(user: {
  id?: number | string | null;
  email?: string | null;
} | null): Promise<{ subscribed: boolean; tier: string | null; demo: boolean }> {
  if (!user) return { subscribed: false, tier: null, demo: false };
  if (isDemoAccount(user)) return { subscribed: true, tier: "premium", demo: true };
  const db = sql();
  const rows = (await db`
    SELECT tier FROM subscriptions
    WHERE user_id = ${Number(user.id)} AND status = 'active'
    ORDER BY id DESC LIMIT 1
  `) as Array<{ tier: string }>;
  if (rows.length === 0) return { subscribed: false, tier: null, demo: false };
  return { subscribed: true, tier: rows[0].tier, demo: false };
}

export const SUBSCRIPTION_REQUIRED_ERROR =
  "An active subscription is required to access training.";

/** Standard 403 body for training endpoints. */
export function subscriptionRequiredResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      error: SUBSCRIPTION_REQUIRED_ERROR,
      subscriptionRequired: true,
    }),
    { status: 403, headers: { "Content-Type": "application/json" } },
  );
}
