// ── Reset Demo Account Passwords ────────────────────────────────────────
// Run: bun run reset-demo-passwords.ts
// Resets owner@champion.com, jappo122@gmail.com, floydsandersjr@yahoo.com
// to "Demo2024!" by regenerating the password hash in the Neon DB.
// ─────────────────────────────────────────────────────────────────────────

import { createHash, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1000; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  return `${salt}:${key}`;
}

const DEMO_ACCOUNTS = [
  "owner@champion.com",
  "jappo122@gmail.com",
  "floydsandersjr@yahoo.com",
];
const PASSWORD = "Demo2024!";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(url);

  for (const email of DEMO_ACCOUNTS) {
    // Check user exists
    const rows = await sql`SELECT id, email FROM users WHERE LOWER(email) = ${email.toLowerCase()}`;
    if (rows.length === 0) {
      console.log(`⚠️  ${email} — user not found, skipping`);
      continue;
    }

    const hash = hashPassword(PASSWORD);
    await sql`UPDATE users SET password_hash = ${hash} WHERE LOWER(email) = ${email.toLowerCase()}`;
    console.log(`✅ ${email} — password reset to "${PASSWORD}"`);
  }

  console.log("\nDone. Demo accounts reset.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
