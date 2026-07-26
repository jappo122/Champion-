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
async function ensureTable() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS inbox_emails (
      id TEXT PRIMARY KEY,
      thread_id TEXT,
      direction TEXT NOT NULL DEFAULT 'inbound',
      from_email TEXT NOT NULL DEFAULT '',
      from_name TEXT NOT NULL DEFAULT '',
      to_emails TEXT[] NOT NULL DEFAULT '{}',
      subject TEXT NOT NULL DEFAULT '',
      preview TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_inbox_emails_received_at
    ON inbox_emails (received_at DESC)
  `;
}
const syncInboxEmails_createServerFn_handler = createServerRpc({
  id: "41d202b084b14e3e75d708c55ad99d40b5f6ae906cd75aa3cef2dbbbe22c3acc",
  name: "syncInboxEmails",
  filename: "src/lib/inbox.ts"
}, (opts) => syncInboxEmails.__executeServer(opts));
const syncInboxEmails = createServerFn({
  method: "POST"
}).handler(syncInboxEmails_createServerFn_handler, async ({
  data
}) => {
  await ensureTable();
  const db = sql();
  if (!data.emails || data.emails.length === 0) {
    return {
      success: true,
      synced: 0
    };
  }
  let synced = 0;
  for (const email of data.emails) {
    try {
      await db`
          INSERT INTO inbox_emails (id, thread_id, direction, from_email, from_name, to_emails, subject, preview, body, received_at)
          VALUES (
            ${email.id},
            ${email.thread_id || null},
            ${email.direction || "inbound"},
            ${email.from_email || ""},
            ${email.from_name || ""},
            ${email.to_emails || []},
            ${email.subject || ""},
            ${email.preview || ""},
            ${email.body || ""},
            ${email.received_at ? new Date(email.received_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      synced++;
    } catch (err) {
      console.error("[Inbox] Failed to sync email:", email.id, err);
    }
  }
  return {
    success: true,
    synced
  };
});
const getInboxEmails_createServerFn_handler = createServerRpc({
  id: "19fd05a3b414584d5d5f8e94ca693f242ca9535f045dc61024638b4bcb5eddb0",
  name: "getInboxEmails",
  filename: "src/lib/inbox.ts"
}, (opts) => getInboxEmails.__executeServer(opts));
const getInboxEmails = createServerFn({
  method: "POST"
}).handler(getInboxEmails_createServerFn_handler, async ({
  data
}) => {
  await ensureTable();
  const db = sql();
  const rows = await db`
      SELECT id, thread_id, direction, from_email, from_name, to_emails, subject, preview, received_at, is_read
      FROM inbox_emails
      ORDER BY received_at DESC
      LIMIT 100
    `;
  return rows.map((r) => ({
    ...r,
    received_at: String(r.received_at),
    to_emails: Array.isArray(r.to_emails) ? r.to_emails : []
  }));
});
const getInboxEmail_createServerFn_handler = createServerRpc({
  id: "4d95adaa58744130183a772a48ea1cb1f3a58c6c622c4f9cb1a7611c474dac26",
  name: "getInboxEmail",
  filename: "src/lib/inbox.ts"
}, (opts) => getInboxEmail.__executeServer(opts));
const getInboxEmail = createServerFn({
  method: "POST"
}).handler(getInboxEmail_createServerFn_handler, async ({
  data
}) => {
  await ensureTable();
  const db = sql();
  const rows = await db`
      SELECT id, thread_id, direction, from_email, from_name, to_emails, subject, preview, body, received_at, is_read
      FROM inbox_emails
      WHERE id = ${data.id}
      LIMIT 1
    `;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    ...r,
    received_at: String(r.received_at),
    to_emails: Array.isArray(r.to_emails) ? r.to_emails : []
  };
});
const markInboxRead_createServerFn_handler = createServerRpc({
  id: "c110eb88eecc149966720d75536ffe1431d75c2d4c05296822de2be4990e74e4",
  name: "markInboxRead",
  filename: "src/lib/inbox.ts"
}, (opts) => markInboxRead.__executeServer(opts));
const markInboxRead = createServerFn({
  method: "POST"
}).handler(markInboxRead_createServerFn_handler, async ({
  data
}) => {
  await ensureTable();
  const db = sql();
  await db`
      UPDATE inbox_emails SET is_read = true WHERE id = ${data.id}
    `;
  return {
    success: true
  };
});
export {
  getInboxEmail_createServerFn_handler,
  getInboxEmails_createServerFn_handler,
  markInboxRead_createServerFn_handler,
  syncInboxEmails_createServerFn_handler
};
