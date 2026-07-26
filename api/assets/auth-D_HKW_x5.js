import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { s as sql } from "./db-D7cnbd5l.js";
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
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
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1e3; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  return `${salt}:${key}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  let key = password + salt;
  for (let i = 0; i < 1e3; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  try {
    return timingSafeEqual(Buffer.from(key), Buffer.from(hash));
  } catch {
    return false;
  }
}
const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({
    alg: "HS256",
    typ: "JWT"
  })).toString("base64url");
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1e3
  })).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
  return `${header}.${body}.${signature}`;
}
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
const signup_createServerFn_handler = createServerRpc({
  id: "29d53067a15b6c3c749b565474c9e5ba5375eed02a60b4bfd7fc4415c983d284",
  name: "signup",
  filename: "src/lib/auth.ts"
}, (opts) => signup.__executeServer(opts));
const signup = createServerFn({
  method: "POST"
}).handler(signup_createServerFn_handler, async ({
  data
}) => {
  const email = (data.email || "").trim().toLowerCase();
  const password = data.password || "";
  const name = (data.name || "").trim().slice(0, 100);
  if (!email || !email.includes("@") || email.length > 254) {
    return {
      success: false,
      error: "Valid email is required"
    };
  }
  if (password.length < 6 || password.length > 128) {
    return {
      success: false,
      error: "Password must be 6-128 characters"
    };
  }
  if (/[<>"'&]/.test(name)) {
    return {
      success: false,
      error: "Name contains invalid characters"
    };
  }
  const db = sql();
  const existing = await db`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return {
      success: false,
      error: "Email already registered"
    };
  }
  const passwordHash = hashPassword(data.password);
  const sessionToken = randomBytes(32).toString("hex");
  const role = data.role || "individual";
  const result = await db`
      INSERT INTO users (email, name, password_hash, role, session_token)
      VALUES (${email}, ${name || null}, ${passwordHash}, ${role}, ${sessionToken})
      RETURNING id, email, name, role
    `;
  const user = result[0];
  const startTier = role === "management" ? "plus" : "basic";
  const billingDay = (/* @__PURE__ */ new Date()).getDate();
  const nextBilling = /* @__PURE__ */ new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  await db`
      INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
      VALUES (${user.id}, ${startTier}, ${startTier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${role !== "management"})
    `;
  const token = generateToken({
    userId: user.id,
    email: user.email,
    sessionToken,
    role: user.role
  });
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
const login_createServerFn_handler = createServerRpc({
  id: "3413f37ce562bd409c6edcfc5ac799a802e8aca98c19a8dbb241f2af801e245b",
  name: "login",
  filename: "src/lib/auth.ts"
}, (opts) => login.__executeServer(opts));
const login = createServerFn({
  method: "POST"
}).handler(login_createServerFn_handler, async ({
  data
}) => {
  const db = sql();
  const normalizedEmail = (data.email || "").trim().toLowerCase();
  const result = await db`SELECT id, email, name, password_hash, role FROM users WHERE LOWER(email) = ${normalizedEmail}`;
  if (result.length === 0) {
    return {
      success: false,
      error: "Invalid email or password"
    };
  }
  const user = result[0];
  if (!verifyPassword(data.password, user.password_hash)) {
    return {
      success: false,
      error: "Invalid email or password"
    };
  }
  const userRow = await db`SELECT session_token FROM users WHERE id = ${user.id}`;
  const sessionToken = userRow[0].session_token;
  const token = generateToken({
    userId: user.id,
    email: user.email,
    sessionToken,
    role: user.role
  });
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
const getSession_createServerFn_handler = createServerRpc({
  id: "8d7f24c3687ad1408d854b37dc5edf2d3a510b4baf76498b108805ad6fce6f0c",
  name: "getSession",
  filename: "src/lib/auth.ts"
}, (opts) => getSession.__executeServer(opts));
const getSession = createServerFn({
  method: "POST"
}).handler(getSession_createServerFn_handler, async ({
  data
}) => {
  if (!data?.token) return {
    user: null
  };
  const payload = verifyToken(data.token);
  if (!payload) return {
    user: null
  };
  const db = sql();
  const result = await db`SELECT id, email, name, role, session_token FROM users WHERE id = ${payload.userId}`;
  if (result.length === 0) return {
    user: null
  };
  const user = result[0];
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
});
const updateProfile_createServerFn_handler = createServerRpc({
  id: "8b41c00657d15b510a5abe0425ac021bd70d5707576ac4ecbda6382e421a0c7b",
  name: "updateProfile",
  filename: "src/lib/auth.ts"
}, (opts) => updateProfile.__executeServer(opts));
const updateProfile = createServerFn({
  method: "POST"
}).handler(updateProfile_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  if (data.name !== void 0) {
    await db`UPDATE users SET name = ${data.name} WHERE id = ${userId}`;
  }
  if (data.email !== void 0) {
    await db`UPDATE users SET email = ${data.email} WHERE id = ${userId}`;
  }
  const result = await db`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
  const user = result[0];
  return {
    success: true,
    user
  };
});
export {
  getSession_createServerFn_handler,
  login_createServerFn_handler,
  signup_createServerFn_handler,
  updateProfile_createServerFn_handler
};
