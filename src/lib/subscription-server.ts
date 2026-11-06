// Server-side subscription truth for the TanStack API file routes
// (src/routes/api/*.ts) — the handlers that run under `vite dev` and the
// platform's working/live site.
//
// Keep this in step with the copy in api/handlers.mjs (the Bun/Vercel API layer):
// same demo accounts, same rule — training access requires a row in
// `subscriptions` with status = 'active' AND an unexpired paid term, and
// demo/owner accounts always pass.
//
// ACCESS MODEL (owner decision, 2026-10-30): ONE-TIME 90-DAY TERMS.
// `expires_at` is the instant the paid term ends. A row is live only when
//   status = 'active' AND (expires_at IS NULL OR expires_at > now()).
// A NULL expiry is only legitimate for the pre-existing owner/demo accounts;
// every purchase path writes an explicit expires_at (see api/handlers.mjs).
// Anything expired — or any row we cannot positively identify as live — is
// unsubscribed, so the gate fails closed.
import { sql } from "~/db";

// Owner/demo accounts: always subscribed, never subject to a term expiry.
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

export interface SubscriptionState {
  subscribed: boolean;
  tier: string | null;
  demo: boolean;
  /** ISO timestamp the paid term ends, or null for a no-expiry (demo) account. */
  expiresAt: string | null;
  /**
   * True when this account HAD a paid term that has since ended. A lapsed
   * customer is told their term ended (and offered their tier's renewal link);
   * an account that never bought keeps the "no subscription yet" copy.
   */
  expired: boolean;
  /** The tier of the lapsed term, for the renewal link. Null when not expired. */
  expiredTier: string | null;
}

/**
 * Statuses that entitle a user to training. `active` is written by every
 * purchase path; `owner-demo` is ONLY ever written by an owner grant, so it is
 * entitled too — but it is still subject to `expires_at`, so an owner-demo row
 * with a past expiry grants nothing. (Fixed here rather than by adding the
 * manager demo address to DEMO_EMAILS: a DEMO_EMAILS entry means "always
 * subscribed, never expires", which is not what an owner-granted row is.)
 */
export const ENTITLED_STATUSES = ["active", "owner-demo"];

/**
 * Real entitlement for a user: `subscribed` is explicit and `tier` is the tier
 * from a LIVE subscription row (status active AND not expired), or null when
 * there is none (never a defaulted "basic").
 *
 * Demo/owner accounts are exempt from expiry so the owner can always review
 * their own product.
 */
export async function getSubscriptionState(user: {
  id?: number | string | null;
  email?: string | null;
} | null): Promise<SubscriptionState> {
  const none: SubscriptionState = { subscribed: false, tier: null, demo: false, expiresAt: null, expired: false, expiredTier: null };
  if (!user) return none;
  if (isDemoAccount(user)) {
    return { subscribed: true, tier: "premium", demo: true, expiresAt: null, expired: false, expiredTier: null };
  }
  const db = sql();
  const userId = Number(user.id);
  const rows = (await db`
    SELECT tier, expires_at FROM subscriptions
    WHERE user_id = ${userId}
      AND status IN ('active', 'owner-demo')
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY id DESC LIMIT 1
  `) as Array<{ tier: string; expires_at: string | Date | null }>;
  if (rows.length > 0) {
    const expiresAt = rows[0].expires_at ? new Date(rows[0].expires_at).toISOString() : null;
    return { subscribed: true, tier: rows[0].tier, demo: false, expiresAt, expired: false, expiredTier: null };
  }
  // Nothing live. Did a term ever run and end? Then this is an EXPIRED customer,
  // not a brand-new account — the two get different copy in the gate.
  const lapsed = (await db`
    SELECT tier, expires_at FROM subscriptions
    WHERE user_id = ${userId}
      AND expires_at IS NOT NULL
      AND expires_at <= NOW()
    ORDER BY expires_at DESC LIMIT 1
  `) as Array<{ tier: string; expires_at: string | Date }>;
  if (lapsed.length > 0) {
    return {
      subscribed: false,
      tier: null,
      demo: false,
      expiresAt: new Date(lapsed[0].expires_at).toISOString(),
      expired: true,
      expiredTier: lapsed[0].tier ?? null,
    };
  }
  return none;
}

export const SUBSCRIPTION_REQUIRED_ERROR =
  "An active subscription is required to access training.";

export const SUBSCRIPTION_EXPIRED_ERROR =
  "Your 90-day access term has ended. Buy a new term to unlock training again.";

/** Standard 403 body for training endpoints. */
export function subscriptionRequiredResponse(expired = false) {
  return new Response(
    JSON.stringify({
      success: false,
      error: expired ? SUBSCRIPTION_EXPIRED_ERROR : SUBSCRIPTION_REQUIRED_ERROR,
      subscriptionRequired: true,
      expired,
    }),
    { status: 403, headers: { "Content-Type": "application/json" } },
  );
}
