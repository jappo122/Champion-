import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { createHash } from "node:crypto";

const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Upgrade all known demo accounts to premium tier. */
export const upgradeDemoAccounts = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const demoEmails = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
    const results: string[] = [];

    for (const email of demoEmails) {
      // Find user
      const users = await db`SELECT id FROM users WHERE email = ${email}` as Array<{ id: number }>;
      if (users.length === 0) {
        results.push(`${email}: user not found`);
        continue;
      }

      const userId = users[0].id;

      // Create or update subscription to premium
      const existing = await db`
        SELECT id FROM subscriptions WHERE user_id = ${userId} AND status = 'active'
      ` as Array<{ id: number }>;

      if (existing.length > 0) {
        await db`
          UPDATE subscriptions SET tier = 'premium' WHERE id = ${existing[0].id}
        `;
        results.push(`${email}: upgraded to premium`);
      } else {
        const billingDay = new Date().getDate();
        const nextBilling = new Date();
        nextBilling.setDate(nextBilling.getDate() + 30);
        await db`
          INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
          VALUES (${userId}, 'premium', 'premium', 'active', ${nextBilling.toISOString()}, ${billingDay}, TRUE)
        `;
        results.push(`${email}: created premium subscription`);
      }
    }

    return { success: true, results };
  },
);
