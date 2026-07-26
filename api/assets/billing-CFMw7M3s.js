import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { s as sql } from "./db-D7cnbd5l.js";
import { createHash } from "node:crypto";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@neondatabase/serverless";
const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
function verifyToken(token) {
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
const TIER_INFO = {
  basic: {
    label: "Basic",
    price: 149,
    features: ["Complete training library", "2-min modules", "Objection handling", "Closing techniques", "Quizzes"]
  },
  plus: {
    label: "Plus",
    price: 169,
    features: ["Everything in Basic", "Managers can assign modules on this tier and above", "Hundreds of scenario questions", "Task assignment"]
  },
  premium: {
    label: "Premium",
    price: 189,
    features: ["You get everything from Basic and Plus", "Sales chart/log", "Goal tracking", "Gross tracking", "Manager dashboard", "Priority support"]
  }
};
const TIER_ORDER = ["basic", "plus", "premium"];
const getUserSubscription_createServerFn_handler = createServerRpc({
  id: "0180ec20f4f85db3db9b0e717dc6fec707ca24c83f7c469fc54fd667d52fdeeb",
  name: "getUserSubscription",
  filename: "src/lib/billing.ts"
}, (opts) => getUserSubscription.__executeServer(opts));
const getUserSubscription = createServerFn({
  method: "POST"
}).handler(getUserSubscription_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  const subs = await db`
      SELECT id, tier, status, next_billing_date, billing_day, is_individual, 
             started_at, cancelled_at, ends_at, billing_email_sent
      FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active'
      ORDER BY id DESC LIMIT 1
    `;
  if (subs.length === 0) {
    return {
      success: true,
      subscription: null,
      message: "No active subscription"
    };
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
      availableDowngrades: canDowngrade ? TIER_ORDER.slice(0, TIER_ORDER.indexOf(sub.tier)) : []
    }
  };
});
const cancelSubscription_createServerFn_handler = createServerRpc({
  id: "be78ff41ae7dd690dbf863c6dcb088f14b6f581e68d78f11e9aaf00ea544d3d5",
  name: "cancelSubscription",
  filename: "src/lib/billing.ts"
}, (opts) => cancelSubscription.__executeServer(opts));
const cancelSubscription = createServerFn({
  method: "POST"
}).handler(cancelSubscription_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  const userResult = await db`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
  if (userResult.length === 0) return {
    success: false,
    error: "User not found"
  };
  const user = userResult[0];
  if (user.role === "management" || user.role === "user") {
    return {
      success: false,
      error: "Management accounts must be cancelled by the account owner"
    };
  }
  const subResult = await db`
      SELECT id, next_billing_date FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active' 
      ORDER BY id DESC LIMIT 1
    `;
  if (subResult.length === 0) return {
    success: false,
    error: "No active subscription"
  };
  const sub = subResult[0];
  const lastDay = sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : "the end of the current billing period";
  await db`
      UPDATE subscriptions 
      SET status = 'cancelled', cancelled_at = NOW(), cancelled_by = ${userId},
          ends_at = ${sub.next_billing_date ? new Date(sub.next_billing_date).toISOString() : null}
      WHERE id = ${sub.id}
    `;
  try {
    const {
      sendEmail
    } = await import("./email-cxXaOx6X.js");
    await sendEmail({
      to: [user.email],
      subject: "Subscription Cancellation Confirmed",
      body: `Hi ${user.name || "there"},

Your Champion Sales Training subscription has been cancelled.

Your access will continue until ${lastDay}. No further charges will be made.

Thank you for being a customer.

- Champion Sales Training Team`
    });
  } catch {
  }
  return {
    success: true,
    lastDay
  };
});
const changeTier_createServerFn_handler = createServerRpc({
  id: "6c7fecfc9d8449071711550e67738e5f4e394877d01f75c25415e06feb4013be",
  name: "changeTier",
  filename: "src/lib/billing.ts"
}, (opts) => changeTier.__executeServer(opts));
const changeTier = createServerFn({
  method: "POST"
}).handler(changeTier_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  if (!TIER_INFO[data.newTier]) return {
    success: false,
    error: "Invalid tier"
  };
  const db = sql();
  const userId = payload.userId;
  const userResult = await db`SELECT role FROM users WHERE id = ${userId}`;
  if (userResult.length === 0) return {
    success: false,
    error: "User not found"
  };
  if (userResult[0].role === "management" || userResult[0].role === "user") {
    return {
      success: false,
      error: "Contact your account manager to change tiers"
    };
  }
  await db`
      UPDATE subscriptions SET tier = ${data.newTier}
      WHERE user_id = ${userId} AND status = 'active'
    `;
  const userInfo = await db`SELECT email, name FROM users WHERE id = ${userId}`;
  if (userInfo.length > 0) {
    try {
      const {
        sendEmail
      } = await import("./email-cxXaOx6X.js");
      await sendEmail({
        to: [userInfo[0].email],
        subject: "Subscription Tier Updated",
        body: `Hi ${userInfo[0].name || "there"},

Your Champion Sales Training subscription has been updated to the ${TIER_INFO[data.newTier].label} tier ($${TIER_INFO[data.newTier].price}/mo). The new rate will apply on your next billing date.

- Champion Sales Training Team`
      });
    } catch {
    }
  }
  return {
    success: true,
    newTier: data.newTier,
    newPrice: TIER_INFO[data.newTier].price
  };
});
const checkBillingDueSoon_createServerFn_handler = createServerRpc({
  id: "5591c2b3597100b9969d6501091d3186819a086075674d2502f905ec7bf5dcb5",
  name: "checkBillingDueSoon",
  filename: "src/lib/billing.ts"
}, (opts) => checkBillingDueSoon.__executeServer(opts));
const checkBillingDueSoon = createServerFn({
  method: "POST"
}).handler(checkBillingDueSoon_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token || "");
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const daysAhead = data.daysAhead || 3;
  const db = sql();
  const now = /* @__PURE__ */ new Date();
  const target = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1e3);
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
    `;
  const remindersSent = [];
  for (const sub of dueSubs) {
    try {
      const {
        sendEmail
      } = await import("./email-cxXaOx6X.js");
      const tierInfo = TIER_INFO[sub.tier] || TIER_INFO.basic;
      const billingDate = new Date(sub.next_billing_date).toLocaleDateString();
      const stripeLinks = {
        basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
        plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
        premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e"
      };
      const paymentLink = stripeLinks[sub.tier] || stripeLinks.basic;
      await sendEmail({
        to: [sub.email],
        subject: `Your Champion Sales Training renewal is due soon — $${tierInfo.price}`,
        body: `Hi ${sub.name || "there"},

Your Champion Sales Training ${tierInfo.label} subscription ($${tierInfo.price}/mo) will renew on ${billingDate}.

To continue your access, please complete payment here:
${paymentLink}

If you've already paid, please ignore this reminder.

- Champion Sales Training Team`
      });
      await db`
          UPDATE subscriptions SET billing_email_sent = TRUE WHERE id = ${sub.id}
        `;
      await db`
          INSERT INTO billing_reminders (subscription_id, reminder_type, next_billing_date)
          VALUES (${sub.id}, '3day', ${sub.next_billing_date})
        `;
      remindersSent.push(sub.email);
    } catch (err) {
      console.error(`[Billing] Failed to send reminder to ${sub.email}:`, err);
    }
  }
  return {
    success: true,
    count: remindersSent.length,
    sentTo: remindersSent
  };
});
const getPaymentLink_createServerFn_handler = createServerRpc({
  id: "f62be4de966117424056f297806112128d11fd61abc285c86cd0691f071c7f71",
  name: "getPaymentLink",
  filename: "src/lib/billing.ts"
}, (opts) => getPaymentLink.__executeServer(opts));
const getPaymentLink = createServerFn({
  method: "POST"
}).handler(getPaymentLink_createServerFn_handler, async ({
  data
}) => {
  const stripeLinks = {
    basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
    plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
    premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e"
  };
  return {
    link: stripeLinks[data.tier] || stripeLinks.basic
  };
});
export {
  cancelSubscription_createServerFn_handler,
  changeTier_createServerFn_handler,
  checkBillingDueSoon_createServerFn_handler,
  getPaymentLink_createServerFn_handler,
  getUserSubscription_createServerFn_handler
};
