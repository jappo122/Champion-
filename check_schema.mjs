import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_oOCycGVL10lb@ep-icy-shape-athyq30a-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  for (const t of tables) {
    const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${t.table_name} AND table_schema = 'public' ORDER BY ordinal_position`;
    console.log(t.table_name + ':');
    cols.forEach(c => console.log('  ' + c.column_name + ' (' + c.data_type + ')'));
    console.log('');
  }
}
main().catch(e => console.error(e.message));
