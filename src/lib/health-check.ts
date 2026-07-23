// Health check: verify all demo accounts can log in.
// Run: bun run src/lib/health-check.ts
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);
const LOGIN_URL = process.env.LOGIN_URL || "http://localhost:3000/api/login";

const DEMO_ACCOUNTS = [
  { email: "owner@champion.com", password: "Demo2024!", role: "management" },
  { email: "jappo122@gmail.com", password: "Demo2024!", role: "individual" },
  { email: "floydsandersjr@yahoo.com", password: "Demo2024!", role: "management" },
];

async function checkAccount(email: string, password: string, expectedRole: string) {
  process.stdout.write(`  ${email}... `);
  try {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as any;
    if (data.success && data.token && data.user?.role === expectedRole) {
      console.log("✅");
      return true;
    }
    console.log(`❌ (${data.error || "unknown"})`);
    return false;
  } catch (err: any) {
    console.log(`❌ (${err.message})`);
    return false;
  }
}

async function main() {
  console.log("\n🔍 Champion Sales Training — Login Health Check\n");
  
  let allPassed = true;
  for (const account of DEMO_ACCOUNTS) {
    const ok = await checkAccount(account.email, account.password, account.role);
    if (!ok) allPassed = false;
  }

  console.log(allPassed ? "\n✅ All accounts pass\n" : "\n❌ Some accounts failed\n");
}

main();
