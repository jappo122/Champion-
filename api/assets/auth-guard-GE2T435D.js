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
const getAuthInfo_createServerFn_handler = createServerRpc({
  id: "3f684d671b507ac1ca775d259a4f5582e2f837c3da8d3c1d6311c2b2a59906c7",
  name: "getAuthInfo",
  filename: "src/lib/auth-guard.ts"
}, (opts) => getAuthInfo.__executeServer(opts));
const getAuthInfo = createServerFn({
  method: "POST"
}).handler(getAuthInfo_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    authenticated: false,
    user: null
  };
  const db = sql();
  const userId = payload.userId;
  const userResult = await db`
      SELECT id, email, name, role, session_token FROM users WHERE id = ${userId}
    `;
  if (userResult.length === 0) return {
    authenticated: false,
    user: null
  };
  const user = userResult[0];
  const subResult = await db`
      SELECT tier, status FROM subscriptions 
      WHERE user_id = ${userId} AND status = 'active' 
      ORDER BY id DESC LIMIT 1
    `;
  const tier = subResult.length > 0 ? subResult[0].tier : "basic";
  const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
  const effectiveTier = user.id === 1 || DEMO_EMAILS.includes(user.email.toLowerCase()) ? "premium" : tier;
  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tier: effectiveTier
    }
  };
});
export {
  getAuthInfo_createServerFn_handler
};
