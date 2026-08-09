// Idempotent migration: create `appointments` table + add `started_at` to `subscriptions`.
// Matches the exact SQL the /api handlers use (api/handlers.mjs):
//   - appointments: manager_id, salesperson_id, customer_name, appointment_time,
//     car_description, task, created_at (id SERIAL PK) — JOINed on users(id)
//   - subscriptions.started_at (timestamptz, default now()) — selected by getUserSubscription
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_oOCycGVL10lb@ep-icy-shape-athyq30a-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(url);

async function main() {
  console.log('Running migration against Neon...');

  // 1. appointments table
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      manager_id INTEGER NOT NULL REFERENCES users(id),
      salesperson_id INTEGER NOT NULL REFERENCES users(id),
      customer_name TEXT NOT NULL,
      appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
      car_description TEXT,
      task TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log('✓ appointments table present');

  // Indexes the queries need (WHERE salesperson_id / manager_id, ORDER BY appointment_time)
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_salesperson ON appointments (salesperson_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_manager ON appointments (manager_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments (appointment_time)`;
  console.log('✓ appointments indexes present');

  // 2. subscriptions.started_at (+ cancelled_at/ends_at — also referenced by getUserSubscription SELECT and cancel flows)
  await sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;
  await sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE`;
  await sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE`;
  console.log('✓ subscriptions.started_at / cancelled_at / ends_at present');

  // Verify
  const cols = await sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'appointments' ORDER BY ordinal_position
  `;
  console.log('\nappointments columns:');
  for (const c of cols) console.log(`  - ${c.column_name} ${c.data_type} null=${c.is_nullable} default=${c.column_default ?? '-'}`);

  const subCols = await sql`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'started_at'
  `;
  console.log('\nsubscriptions.started_at:', subCols.length ? `${subCols[0].column_name} ${subCols[0].data_type} default=${subCols[0].column_default ?? '-'}` : 'MISSING');

  const idx = await sql`
    SELECT indexname FROM pg_indexes WHERE tablename = 'appointments' ORDER BY indexname
  `;
  console.log('\nappointments indexes:', idx.map((i) => i.indexname).join(', '));
  console.log('\nMigration complete.');
}

main().then(() => process.exit(0)).catch((e) => { console.error('MIGRATION FAILED:', e.message); process.exit(1); });
