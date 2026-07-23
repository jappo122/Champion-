import { neon } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = neon(url);
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
for (const t of tables) {
  const cols = await sql`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ${t.table_name} ORDER BY ordinal_position`;
  console.log(`\nTable: ${t.table_name}`);
  for (const c of cols) console.log(`  ${c.column_name} (${c.data_type}) ${c.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
}