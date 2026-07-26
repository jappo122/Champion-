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
  id: "f5173620d55d830dc2de8cfa624dba56e5ea52c5dc1a060d5d038008ea2b7835",
  name: "submitTicket",
  filename: "src/routes/support.tsx"
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
export {
  submitTicket_createServerFn_handler
};
