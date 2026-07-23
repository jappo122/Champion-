// ── Login Credential Verification ──────────────────────────────────────────
// Before any welcome email is sent, this module verifies that the credentials
// ACTUALLY work by making a real HTTP request to the /api/login endpoint.
// Up to 3 retry attempts with regenerated passwords if verification fails.
//
// Used by: signup/complete.tsx, manager.ts (addSalesperson)
// ────────────────────────────────────────────────────────────────────────────

import { createHash, randomBytes } from "node:crypto";

const LOGIN_URL = "http://localhost:3000/api/login";

interface VerificationResult {
  ok: boolean;
  token?: string;
  error?: string;
}

/**
 * Verify login credentials by making a real HTTP POST to the login API.
 * This tests the exact same code path a customer would use.
 */
async function callLoginApi(email: string, password: string): Promise<VerificationResult> {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { ok: false, error: `Login API returned HTTP ${response.status}` };
    }

    const data = await response.json() as any;

    if (data.success && data.token) {
      return { ok: true, token: data.token };
    }

    return { ok: false, error: data.error || "Login API returned success:false" };
  } catch (err: any) {
    return { ok: false, error: `Login API unreachable: ${err.message}` };
  }
}

/**
 * Generate a new password hash.
 */
function generatePassword(password: string): { password: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1000; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  return { password, hash: `${salt}:${key}` };
}

/**
 * Verify that an email/password pair can successfully log in.
 * Makes up to 3 attempts — if the first password fails, regenerates and retries.
 * 
 * Returns { ok: true, password } on success (with the working password).
 * Returns { ok: false, error } if all 3 attempts fail.
 */
export async function verifyAndEnsureLogin(
  email: string,
  initialPassword: string,
  db: any,
): Promise<{ ok: boolean; password: string; error?: string }> {
  let currentPassword = initialPassword;

  for (let attempt = 0; attempt < 3; attempt++) {
    console.log(`[VerifyLogin] Attempt ${attempt + 1}/3 for ${email}`);

    const result = await callLoginApi(email, currentPassword);

    if (result.ok) {
      console.log(`[VerifyLogin] ✅ Login verified for ${email} on attempt ${attempt + 1}`);
      // Session token update removed — no longer invalidates other sessions
      return { ok: true, password: currentPassword };
    }

    console.log(`[VerifyLogin] ❌ Attempt ${attempt + 1} failed: ${result.error}`);

    // On failure, regenerate password and update DB (unless it's the last attempt)
    if (attempt < 2) {
      const { password: newPassword, hash: newHash } = generatePassword(
        randomBytes(12).toString("hex"),
      );
      currentPassword = newPassword;
      try {
        await db`UPDATE users SET password_hash = ${newHash} WHERE LOWER(email) = ${email.toLowerCase()}`;
        console.log(`[VerifyLogin] Regenerated credentials for ${email}`);
      } catch (err: any) {
        console.error(`[VerifyLogin] Failed to update password for ${email}:`, err.message);
      }
    }
  }

  console.error(`[VerifyLogin] ❌ All 3 attempts failed for ${email}`);
  return { ok: false, password: currentPassword, error: "Login verification failed after 3 attempts" };
}

/**
 * Quick check: verify all existing demo accounts can log in.
 * Run this after deploys or when troubleshooting.
 */
export async function verifyAllAccounts(db: any): Promise<{ passed: string[]; failed: string[] }> {
  const passed: string[] = [];
  const failed: string[] = [];

  try {
    const accounts = [
      { email: "owner@champion.com", password: "Demo2024!" },
      { email: "jappo122@gmail.com", password: "Demo2024!" },
      { email: "floydsandersjr@yahoo.com", password: "Demo2024!" },
    ];

    for (const account of accounts) {
      const result = await callLoginApi(account.email, account.password);
      if (result.ok) {
        passed.push(account.email);
      } else {
        failed.push(`${account.email}: ${result.error}`);
      }
    }
  } catch (err: any) {
    console.error("[VerifyLogin] Account verification error:", err.message);
  }

  return { passed, failed };
}
