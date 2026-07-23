import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  // Use tagged template literals for all queries
  await sql`CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  console.log("✅ Created waitlist table");

  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'salesperson',
    password_hash TEXT NOT NULL,
    stripe_customer_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  console.log("✅ Created users table");

  await sql`CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan TEXT NOT NULL,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  console.log("✅ Created subscriptions table");

  // Verify tables
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  const names = tables.map((t: any) => t.table_name).join(", ");
  console.log(`\n📊 Tables in database: ${names}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});