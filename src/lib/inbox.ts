import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";

/**
 * Ensure the inbox_emails table exists. Called lazily before any query.
 */
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
  // Create index for fast sorted listing
  await db`
    CREATE INDEX IF NOT EXISTS idx_inbox_emails_received_at
    ON inbox_emails (received_at DESC)
  `;
}

// ── Sync inbox emails from external API (placeholder) ────────────────────────

export const syncInboxEmails = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; emails?: Array<{
    id: string;
    thread_id?: string;
    direction?: string;
    from_email?: string;
    from_name?: string;
    to_emails?: string[];
    subject?: string;
    preview?: string;
    body?: string;
    received_at?: string;
  }> } }) => {
    // Token verification is handled by the auth-guard; this is a placeholder
    // for the lead to implement the actual external API sync later.
    await ensureTable();
    const db = sql();

    if (!data.emails || data.emails.length === 0) {
      return { success: true, synced: 0 };
    }

    let synced = 0;
    for (const email of data.emails) {
      try {
        await db`
          INSERT INTO inbox_emails (id, thread_id, direction, from_email, from_name, to_emails, subject, preview, body, received_at)
          VALUES (
            ${email.id},
            ${email.thread_id || null},
            ${email.direction || 'inbound'},
            ${email.from_email || ''},
            ${email.from_name || ''},
            ${email.to_emails || []},
            ${email.subject || ''},
            ${email.preview || ''},
            ${email.body || ''},
            ${email.received_at ? new Date(email.received_at).toISOString() : new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
        synced++;
      } catch (err) {
        console.error("[Inbox] Failed to sync email:", email.id, err);
      }
    }

    return { success: true, synced };
  },
);

// ── Get all inbox emails ─────────────────────────────────────────────────────

export const getInboxEmails = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    await ensureTable();
    const db = sql();
    const rows = await db`
      SELECT id, thread_id, direction, from_email, from_name, to_emails, subject, preview, received_at, is_read
      FROM inbox_emails
      ORDER BY received_at DESC
      LIMIT 100
    `;
    return rows.map((r: any) => ({
      ...r,
      received_at: String(r.received_at),
      to_emails: Array.isArray(r.to_emails) ? r.to_emails : [],
    }));
  },
);

// ── Get single email with full body ──────────────────────────────────────────

export const getInboxEmail = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; id: string } }) => {
    await ensureTable();
    const db = sql();
    const rows = await db`
      SELECT id, thread_id, direction, from_email, from_name, to_emails, subject, preview, body, received_at, is_read
      FROM inbox_emails
      WHERE id = ${data.id}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    const r = rows[0] as any;
    return {
      ...r,
      received_at: String(r.received_at),
      to_emails: Array.isArray(r.to_emails) ? r.to_emails : [],
    };
  },
);

// ── Mark email as read ───────────────────────────────────────────────────────

export const markInboxRead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; id: string } }) => {
    await ensureTable();
    const db = sql();
    await db`
      UPDATE inbox_emails SET is_read = true WHERE id = ${data.id}
    `;
    return { success: true };
  },
);
