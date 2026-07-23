const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
async function main() {
  const rows = await sql`SELECT u.email, u.id, s.tier FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id WHERE u.email IN ('owner@champion.com','jappo122@gmail.com','floydsandersjr@yahoo.com')`;
  for (const r of rows) {
    if (r.tier === null) {
      const nb = new Date(); nb.setDate(nb.getDate()+30);
      await sql`INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual) VALUES (${r.id}, 'premium', 'premium', 'active', ${nb.toISOString()}, ${new Date().getDate()}, true)`;
      console.log('Added sub:', r.email);
    } else {
      console.log('OK:', r.email, r.tier);
    }
  }
}
main().catch(e => console.error(e.message));
