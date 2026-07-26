import { randomBytes, createHash } from "node:crypto";
const LOGIN_URL = "http://localhost:3000/api/login";
async function callLoginApi(email, password) {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      return { ok: false, error: `Login API returned HTTP ${response.status}` };
    }
    const data = await response.json();
    if (data.success && data.token) {
      return { ok: true, token: data.token };
    }
    return { ok: false, error: data.error || "Login API returned success:false" };
  } catch (err) {
    return { ok: false, error: `Login API unreachable: ${err.message}` };
  }
}
function generatePassword(password) {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1e3; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  return { password, hash: `${salt}:${key}` };
}
async function verifyAndEnsureLogin(email, initialPassword, db) {
  let currentPassword = initialPassword;
  for (let attempt = 0; attempt < 3; attempt++) {
    console.log(`[VerifyLogin] Attempt ${attempt + 1}/3 for ${email}`);
    const result = await callLoginApi(email, currentPassword);
    if (result.ok) {
      console.log(`[VerifyLogin] ✅ Login verified for ${email} on attempt ${attempt + 1}`);
      return { ok: true, password: currentPassword };
    }
    console.log(`[VerifyLogin] ❌ Attempt ${attempt + 1} failed: ${result.error}`);
    if (attempt < 2) {
      const { password: newPassword, hash: newHash } = generatePassword(
        randomBytes(12).toString("hex")
      );
      currentPassword = newPassword;
      try {
        await db`UPDATE users SET password_hash = ${newHash} WHERE LOWER(email) = ${email.toLowerCase()}`;
        console.log(`[VerifyLogin] Regenerated credentials for ${email}`);
      } catch (err) {
        console.error(`[VerifyLogin] Failed to update password for ${email}:`, err.message);
      }
    }
  }
  console.error(`[VerifyLogin] ❌ All 3 attempts failed for ${email}`);
  return { ok: false, password: currentPassword, error: "Login verification failed after 3 attempts" };
}
export {
  verifyAndEnsureLogin
};
