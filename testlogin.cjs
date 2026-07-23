const { neon } = require("@neondatabase/serverless");
const { createHash } = require("node:crypto");

async function test() {
  const sql = neon(process.env.DATABASE_URL);
  const r = await sql`SELECT email, password_hash FROM users WHERE email = 'owner@champion.com'`;
  if (r.length === 0) { console.log("USER NOT FOUND"); return; }
  
  const user = r[0];
  const [salt, storedHash] = user.password_hash.split(":");
  
  // Test password
  const password = "Demo2024!";
  let key = password + salt;
  for (let i = 0; i < 1000; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  
  console.log("Stored hash:", storedHash.substring(0, 16) + "...");
  console.log("Computed:   ", key.substring(0, 16) + "...");
  console.log("Match:", key === storedHash);
}
test().catch(e => console.error(e.message));
