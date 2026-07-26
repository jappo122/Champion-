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
const upgradeDemoAccounts_createServerFn_handler = createServerRpc({
  id: "51a6ee04e2ec0e00570fb8699480d88a0654b4f3b1a6e02db39797c9a704fb5c",
  name: "upgradeDemoAccounts",
  filename: "src/lib/admin.ts"
}, (opts) => upgradeDemoAccounts.__executeServer(opts));
const upgradeDemoAccounts = createServerFn({
  method: "POST"
}).handler(upgradeDemoAccounts_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const demoEmails = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
  const results = [];
  for (const email of demoEmails) {
    const users = await db`SELECT id FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      results.push(`${email}: user not found`);
      continue;
    }
    const userId = users[0].id;
    const existing = await db`
        SELECT id FROM subscriptions WHERE user_id = ${userId} AND status = 'active'
      `;
    if (existing.length > 0) {
      await db`
          UPDATE subscriptions SET tier = 'premium' WHERE id = ${existing[0].id}
        `;
      results.push(`${email}: upgraded to premium`);
    } else {
      const billingDay = (/* @__PURE__ */ new Date()).getDate();
      const nextBilling = /* @__PURE__ */ new Date();
      nextBilling.setDate(nextBilling.getDate() + 30);
      await db`
          INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
          VALUES (${userId}, 'premium', 'premium', 'active', ${nextBilling.toISOString()}, ${billingDay}, TRUE)
        `;
      results.push(`${email}: created premium subscription`);
    }
  }
  return {
    success: true,
    results
  };
});
export {
  upgradeDemoAccounts_createServerFn_handler
};
