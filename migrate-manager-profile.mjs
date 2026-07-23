import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_oOCycGVL10lb@ep-icy-shape-athyq30a-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  // Create sales_log table
  await sql`
    CREATE TABLE IF NOT EXISTS sales_log (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      salesperson_id INTEGER REFERENCES users(id),
      customer_name TEXT NOT NULL,
      vehicle TEXT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('won', 'lost', 'pending')),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log('✓ sales_log table created');

  // Create module_assignments table
  await sql`
    CREATE TABLE IF NOT EXISTS module_assignments (
      id SERIAL PRIMARY KEY,
      manager_id INTEGER NOT NULL REFERENCES users(id),
      salesperson_id INTEGER NOT NULL REFERENCES users(id),
      course_id TEXT NOT NULL,
      lesson_id TEXT,
      assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      completed_at TIMESTAMP WITH TIME ZONE
    )
  `;
  console.log('✓ module_assignments table created');

  // Verify tables
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log('\nTables:');
  for (const t of tables) {
    console.log(`  - ${t.table_name}`);
  }
}

main().catch(e => console.error(e.message));