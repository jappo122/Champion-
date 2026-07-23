import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { createHash } from "node:crypto";

// ── Token verification (inlined from auth.ts) ─────

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

// ── Tier info ─────────────────────────────────────

const TIER_INFO: Record<string, { label: string; price: number; features: string[] }> = {
  basic: { label: "Basic", price: 149, features: ["Complete training library", "2-min modules", "Objection handling", "Closing techniques", "Quizzes"] },
  plus: { label: "Plus", price: 169, features: ["Everything in Basic", "Managers can assign modules on this tier and above", "Hundreds of scenario questions", "Task assignment"] },
  premium: { label: "Premium", price: 189, features: ["You get everything from Basic and Plus", "Sales chart/log", "Goal tracking", "Gross tracking", "Manager dashboard", "Priority support"] },
};

const TIER_ORDER = ["basic", "plus", "premium"];

// ── Get user subscription details ─────────────────

export const getUserSubscription = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const userId = payload.userId as number;

    const subs = await db`
      SELECT id, tier, status, next_billing_date, billing_day, is_individual, 
             started_at, cancelled_at, ends_at, billing_email_sent
      FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active'
      ORDER BY id DESC LIMIT 1
    ` as Array<{
      id: number; tier: string; status: string; next_billing_date: string | null;
      billing_day: number | null; is_individual: boolean | null;
      started_at: string | null; cancelled_at: string | null;
      ends_at: string | null; billing_email_sent: boolean | null;
    }>;

    if (subs.length === 0) {
      return { success: true, subscription: null, message: "No active subscription" };
    }

    const sub = subs[0];
    const tierInfo = TIER_INFO[sub.tier] || TIER_INFO.basic;
    const canUpgrade = TIER_ORDER.indexOf(sub.tier) < TIER_ORDER.length - 1;
    const canDowngrade = TIER_ORDER.indexOf(sub.tier) > 0;

    return {
      success: true,
      subscription: {
        id: sub.id,
        tier: sub.tier,
        tierLabel: tierInfo.label,
        price: tierInfo.price,
        status: sub.status,
        nextBillingDate: sub.next_billing_date ? String(sub.next_billing_date) : null,
        billingDay: sub.billing_day,
        isIndividual: sub.is_individual !== false,
        startedAt: sub.started_at ? String(sub.started_at) : null,
        cancelledAt: sub.cancelled_at ? String(sub.cancelled_at) : null,
        endsAt: sub.ends_at ? String(sub.ends_at) : null,
        billingEmailSent: sub.billing_email_sent === true,
        canUpgrade,
        canDowngrade,
        availableUpgrades: canUpgrade ? TIER_ORDER.slice(TIER_ORDER.indexOf(sub.tier) + 1) : [],
        availableDowngrades: canDowngrade ? TIER_ORDER.slice(0, TIER_ORDER.indexOf(sub.tier)) : [],
      },
    };
  },
);

// ── Cancel individual subscription ────────────────

export const cancelSubscription = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const userId = payload.userId as number;

    // Get user info
    const userResult = await db`SELECT id, email, name, role FROM users WHERE id = ${userId}` as Array<{ id: number; email: string; name: string | null; role: string }>;
    if (userResult.length === 0) return { success: false, error: "User not found" };

    const user = userResult[0];

    // Only individual accounts can self-cancel
    if (user.role === "management" || user.role === "user") {
      return { success: false, error: "Management accounts must be cancelled by the account owner" };
    }

    // Get current subscription's next billing date
    const subResult = await db`
      SELECT id, next_billing_date FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active' 
      ORDER BY id DESC LIMIT 1
    ` as Array<{ id: number; next_billing_date: string | null }>;

    if (subResult.length === 0) return { success: false, error: "No active subscription" };

    const sub = subResult[0];
    const lastDay = sub.next_billing_date 
      ? new Date(sub.next_billing_date).toLocaleDateString() 
      : "the end of the current billing period";

    // Update subscription
    await db`
      UPDATE subscriptions 
      SET status = 'cancelled', cancelled_at = NOW(), cancelled_by = ${userId},
          ends_at = ${sub.next_billing_date ? new Date(sub.next_billing_date).toISOString() : null}
      WHERE id = ${sub.id}
    `;

    // Send cancellation email
    try {
      const { sendEmail } = await import("~/lib/email");
      await sendEmail({
        to: [user.email],
        subject: "Subscription Cancellation Confirmed",
        body: `Hi ${user.name || "there"},\n\nYour Champion Sales Training subscription has been cancelled.\n\nYour access will continue until ${lastDay}. No further charges will be made.\n\nThank you for being a customer.\n\n- Champion Sales Training Team`,
      });
    } catch {}

    return { success: true, lastDay };
  },
);

// ── Upgrade/downgrade tier for individual accounts ─

export const changeTier = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; newTier: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    if (!TIER_INFO[data.newTier]) return { success: false, error: "Invalid tier" };

    const db = sql();
    const userId = payload.userId as number;

    // Get user to check they're an individual
    const userResult = await db`SELECT role FROM users WHERE id = ${userId}` as Array<{ role: string }>;
    if (userResult.length === 0) return { success: false, error: "User not found" };

    if (userResult[0].role === "management" || userResult[0].role === "user") {
      return { success: false, error: "Contact your account manager to change tiers" };
    }

    // Update subscription tier
    await db`
      UPDATE subscriptions SET tier = ${data.newTier}
      WHERE user_id = ${userId} AND status = 'active'
    `;

    // Send confirmation email
    const userInfo = await db`SELECT email, name FROM users WHERE id = ${userId}` as Array<{ email: string; name: string | null }>;
    if (userInfo.length > 0) {
      try {
        const { sendEmail } = await import("~/lib/email");
        await sendEmail({
          to: [userInfo[0].email],
          subject: "Subscription Tier Updated",
          body: `Hi ${userInfo[0].name || "there"},\n\nYour Champion Sales Training subscription has been updated to the ${TIER_INFO[data.newTier].label} tier ($${TIER_INFO[data.newTier].price}/mo). The new rate will apply on your next billing date.\n\n- Champion Sales Training Team`,
        });
      } catch {}
    }

    return { success: true, newTier: data.newTier, newPrice: TIER_INFO[data.newTier].price };
  },
);

// ── Check subscriptions due for billing reminders ──

export const checkBillingDueSoon = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token?: string; daysAhead?: number } }) => {
    const payload = verifyToken(data.token || "");
    if (!payload) return { success: false, error: "Not authenticated" };
    const daysAhead = data.daysAhead || 3;
    const db = sql();
    const now = new Date();
    const target = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    // Find active subscriptions where next_billing_date is within `daysAhead` days, 
    // and we haven't sent a 3-day reminder yet
    const dueSubs = await db`
      SELECT s.id, s.user_id, s.tier, s.next_billing_date, s.billing_day,
             u.email, u.name
      FROM subscriptions s
      JOIN users u ON u.id = s.user_id
      WHERE s.status = 'active'
        AND s.next_billing_date IS NOT NULL
        AND s.next_billing_date <= ${target.toISOString()}
        AND s.next_billing_date > ${now.toISOString()}
        AND (s.billing_email_sent IS NULL OR s.billing_email_sent = FALSE)
    ` as Array<{
      id: number; user_id: number; tier: string; next_billing_date: string;
      billing_day: number | null; email: string; name: string | null;
    }>;

    const remindersSent: string[] = [];

    for (const sub of dueSubs) {
      try {
        const { sendEmail } = await import("~/lib/email");
        const tierInfo = TIER_INFO[sub.tier] || TIER_INFO.basic;
        const billingDate = new Date(sub.next_billing_date).toLocaleDateString();
        
        // Get Stripe payment link based on tier
        const stripeLinks: Record<string, string> = {
          basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
          plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
          premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
        };
        const paymentLink = stripeLinks[sub.tier] || stripeLinks.basic;

        await sendEmail({
          to: [sub.email],
          subject: `Your Champion Sales Training renewal is due soon — $${tierInfo.price}`,
          body: `Hi ${sub.name || "there"},\n\nYour Champion Sales Training ${tierInfo.label} subscription ($${tierInfo.price}/mo) will renew on ${billingDate}.\n\nTo continue your access, please complete payment here:\n${paymentLink}\n\nIf you've already paid, please ignore this reminder.\n\n- Champion Sales Training Team`,
        });

        // Mark reminder as sent
        await db`
          UPDATE subscriptions SET billing_email_sent = TRUE WHERE id = ${sub.id}
        `;
        
        // Log reminder
        await db`
          INSERT INTO billing_reminders (subscription_id, reminder_type, next_billing_date)
          VALUES (${sub.id}, '3day', ${sub.next_billing_date})
        `;

        remindersSent.push(sub.email);
      } catch (err) {
        console.error(`[Billing] Failed to send reminder to ${sub.email}:`, err);
      }
    }

    return { success: true, count: remindersSent.length, sentTo: remindersSent };
  },
);

// ── Get Stripe payment links for each tier ─────────

export const getPaymentLink = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { tier: string } }) => {
    const stripeLinks: Record<string, string> = {
      basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
      plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
      premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
    };
    return { link: stripeLinks[data.tier] || stripeLinks.basic };
  },
);