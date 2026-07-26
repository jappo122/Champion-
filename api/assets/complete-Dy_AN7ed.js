import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { s as sql } from "./db-D7cnbd5l.js";
import { randomBytes, createHash } from "node:crypto";
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
const completeSignupAfterPayment_createServerFn_handler = createServerRpc({
  id: "1e00ff5f02fb617bd6edcdd81b75dcefdab45e38e1aec047d5e513514e6c3886",
  name: "completeSignupAfterPayment",
  filename: "src/routes/signup/complete.tsx"
}, (opts) => completeSignupAfterPayment.__executeServer(opts));
const completeSignupAfterPayment = createServerFn({
  method: "POST"
}).handler(completeSignupAfterPayment_createServerFn_handler, async ({
  data
}) => {
  const db = sql();
  const email = data.email.trim().toLowerCase();
  const existing = await db`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return {
      success: true,
      alreadyExists: true
    };
  }
  const tempPassword = randomBytes(12).toString("hex");
  const salt = randomBytes(16).toString("hex");
  let key = tempPassword + salt;
  for (let i = 0; i < 1e3; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  const passwordHash = `${salt}:${key}`;
  const sessionToken = randomBytes(32).toString("hex");
  const role = data.type === "management" ? "management" : "individual";
  const name = (data.name || "").trim().slice(0, 100) || null;
  const result = await db`
      INSERT INTO users (email, name, password_hash, role, session_token)
      VALUES (${email}, ${name}, ${passwordHash}, ${role}, ${sessionToken})
      RETURNING id, email, name, role
    `;
  const user = result[0];
  const billingDay = (/* @__PURE__ */ new Date()).getDate();
  const nextBilling = /* @__PURE__ */ new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  await db`
      INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
      VALUES (${user.id}, ${data.tier}, ${data.tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${data.type !== "management"})
    `;
  const {
    verifyAndEnsureLogin
  } = await import("./verify-login-CC2mAV6S.js");
  const verifyResult = await verifyAndEnsureLogin(email, tempPassword, db);
  const finalPassword = verifyResult.password;
  const tierLabel = data.tier.charAt(0).toUpperCase() + data.tier.slice(1);
  const accountType = data.type === "management" ? "Management" : "Individual";
  try {
    const {
      sendEmail
    } = await import("./email-cxXaOx6X.js");
    await sendEmail({
      to: [email],
      subject: `Welcome to Champion Sales Training — Your ${accountType} Account is Ready`,
      body: `Hi ${name || "there"},

Welcome to Champion Sales Training & Events! Your ${tierLabel} ${accountType} account has been created.

─── Your Login ───
Site: https://championsalestrainingandevents.com/login
Email: ${email}
Temporary Password: ${finalPassword}

Please log in and change your password from your profile page.

${data.type === "management" ? "─── Next Steps ───\n- Add your sales team from your manager dashboard\n- Assign training modules based on skill gaps\n- Track team progress and sales performance\n\n" : ""}Get started now!

- Champion Sales Training Team`
    });
  } catch {
  }
  const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
  const header = Buffer.from(JSON.stringify({
    alg: "HS256",
    typ: "JWT"
  })).toString("base64url");
  const body = Buffer.from(JSON.stringify({
    userId: user.id,
    email: user.email,
    sessionToken,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1e3
  })).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
  const token = `${header}.${body}.${signature}`;
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
});
export {
  completeSignupAfterPayment_createServerFn_handler
};
