import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { s as sql } from "./db-D7cnbd5l.js";
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
const submitTicket_createServerFn_handler = createServerRpc({
  id: "203c6d8ce876b2a75949deb516cb129dddf00a0f32bed6e082d8b128136d47e0",
  name: "submitTicket",
  filename: "src/lib/support.ts"
}, (opts) => submitTicket.__executeServer(opts));
const submitTicket = createServerFn({
  method: "POST"
}).handler(submitTicket_createServerFn_handler, async ({
  data
}) => {
  const db = sql();
  try {
    await db`
        INSERT INTO support_tickets (name, email, subject, message)
        VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message})
      `;
    return {
      success: true
    };
  } catch (err) {
    console.error("[Support] Error submitting ticket:", err);
    return {
      success: false
    };
  }
});
const logError_createServerFn_handler = createServerRpc({
  id: "38c3584af60e662981ee1e05b5e204b7e874c0a9ed5375e2eebc6b76c845d600",
  name: "logError",
  filename: "src/lib/support.ts"
}, (opts) => logError.__executeServer(opts));
const logError = createServerFn({
  method: "POST"
}).handler(logError_createServerFn_handler, async ({
  data
}) => {
  const db = sql();
  try {
    await db`
        INSERT INTO error_logs (message, stack, url, user_id)
        VALUES (${data.message}, ${data.stack || null}, ${data.url || null}, ${data.userId || null})
      `;
  } catch (err) {
    console.error("[ErrorLog] Failed to log error:", err);
  }
  return {
    success: true
  };
});
export {
  logError_createServerFn_handler,
  submitTicket_createServerFn_handler
};
