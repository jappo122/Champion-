// ── Migration: subscriptions.expires_at ─────────────────────────────────────
//
// The platform sells ONE-TIME 90-DAY ACCESS TERMS (owner decision 2026-10-30).
// A subscription row therefore carries the moment its paid term ends:
//
//   expires_at TIMESTAMPTZ NULL
//     NOT NULL → access ends at that instant (status must ALSO be 'active')
//     NULL     → no expiry. Reserved for the four pre-existing owner/demo
//                accounts. The gate never treats NULL as "anyone can in":
//                every real purchase writes an expires_at, and the gate only
//                accepts a NULL for an account that is a demo/owner account or
//                whose row predates this migration.
//
// Idempotent: safe to run any number of times. Reads DATABASE_URL from the
// environment (never hardcoded — see WORKFLOW.md) and exits if it is unset.
//
// Run with:  DATABASE_URL=... bun run migrate-expiry.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("migrate-expiry: DATABASE_URL is not set — refusing to run.");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  await sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ`;
  console.log("✅ subscriptions.expires_at (TIMESTAMPTZ, nullable) exists");

  await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions (expires_at)`;
  console.log("✅ index idx_subscriptions_expires_at exists");

  // Backfill: the four pre-existing owner/demo accounts keep NULL (no expiry).
  // Any other ACTIVE row that predates this migration gets a term so a legacy
  // row cannot act as an unlimited free pass.
  const backfilled = await sql`
    UPDATE subscriptions s
    SET expires_at = NOW() + INTERVAL '90 days'
    WHERE s.expires_at IS NULL
      AND s.status = 'active'
      AND s.user_id NOT IN (
        SELECT id FROM users
        WHERE id = 1
           OR LOWER(email) IN ('owner@champion.com', 'jappo122@gmail.com', 'floydsandersjr@yahoo.com')
      )
    RETURNING s.id
  `;
  console.log(`✅ backfilled ${backfilled.length} active row(s) with a 90-day term`);

  const cols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'expires_at'
  `;
  console.log("📊 column now:", JSON.stringify(cols));
}

main().catch((err) => {
  console.error("migrate-expiry failed:", err?.message || err);
  process.exit(1);
});
