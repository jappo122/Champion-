// ── Login Credential Verification ──────────────────────────────────────────
// Pure read-only verification — makes a single HTTP POST to /api/login and
// reports success/failure. Never writes to the DB, never regenerates passwords.
// The caller is responsible for emailing the tempPassword they generated at
// insert time, which already matches the stored hash.
//
// Used by: signup/complete.tsx, manager.ts (addSalesperson)
// ────────────────────────────────────────────────────────────────────────────

const LOGIN_URL = "http://localhost:3000/api/login";

interface VerificationResult {
  ok: boolean;
  token?: string;
  error?: string;
}

/**
 * Verify login credentials by making a single HTTP POST to the login API.
 * This tests the exact same code path a customer would use.
 * Pure read-only — no side effects, no retries, no password changes.
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
 * Verify that an email/password pair can successfully log in.
 * Single attempt — read-only, NO database writes, NO password changes.
 *
 * Returns { ok: true, password: <initialPassword> } on success.
 * Returns { ok: false, password: <initialPassword>, error } on failure.
 * The password returned is ALWAYS the initialPassword — callers email
 * that value, which matches the stored hash from insert time.
 */
export async function verifyAndEnsureLogin(
  email: string,
  password: string,
): Promise<{ ok: boolean; password: string; error?: string }> {
  console.log(`[VerifyLogin] Verifying login for ${email}`);

  const result = await callLoginApi(email, password);

  if (result.ok) {
    console.log(`[VerifyLogin] ✅ Login verified for ${email}`);
  } else {
    console.log(`[VerifyLogin] ❌ Login verification failed for ${email}: ${result.error}`);
  }

  return { ok: result.ok, password, error: result.error };
}

/**
 * Quick check: verify all existing demo accounts can log in.
 * Run this after deploys or when troubleshooting.
 * Read-only — no side effects.
 */
export async function verifyAllAccounts(): Promise<{ passed: string[]; failed: string[] }> {
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
