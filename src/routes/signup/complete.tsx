import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { randomBytes, createHash } from "node:crypto";
import { useState, useEffect } from "react";

// ── Server function: create account after Stripe payment ───────────────────

const completeSignupAfterPayment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { email: string; name?: string; tier: string; type: string } }) => {
    const db = sql();
    const email = data.email.trim().toLowerCase();

    // Check if email already exists
    const existing = await db`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return { success: true, alreadyExists: true };
    }

    // Generate random password
    const tempPassword = randomBytes(12).toString("hex");
    const salt = randomBytes(16).toString("hex");
    let key = tempPassword + salt;
    for (let i = 0; i < 1000; i++) {
      key = createHash("sha256").update(key).digest("hex");
    }
    const passwordHash = `${salt}:${key}`;
    const sessionToken = randomBytes(32).toString("hex");

    const role = data.type === "management" ? "management" : "individual";
    const name = (data.name || "").trim().slice(0, 100) || null;

    const result = await db`
      INSERT INTO users (email, name, password_hash, role, session_token)
      VALUES (${email}, ${name}, ${passwordHash}, ${role}, ${sessionToken})
      RETURNING id, email, name, role
    `;
    const user = result[0] as { id: number; email: string; name: string | null; role: string };

    // Create subscription
    const billingDay = new Date().getDate();
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);
    await db`
      INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
      VALUES (${user.id}, ${data.tier}, ${data.tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${data.type !== "management"})
    `;

    // Verify login credentials work before sending welcome email
    const { verifyAndEnsureLogin } = await import("~/lib/verify-login");
    const verifyResult = await verifyAndEnsureLogin(email, tempPassword, db);
    const finalPassword = verifyResult.password; // May have been regenerated on retry

    // Send welcome email with verified login credentials
    const tierLabel = data.tier.charAt(0).toUpperCase() + data.tier.slice(1);
    const accountType = data.type === "management" ? "Management" : "Individual";
    try {
      const { sendEmail } = await import("~/lib/email");
      await sendEmail({
        to: [email],
        subject: `Welcome to Champion Sales Training — Your ${accountType} Account is Ready`,
        body: `Hi ${name || "there"},\n\nWelcome to Champion Sales Training & Events! Your ${tierLabel} ${accountType} account has been created.\n\n─── Your Login ───\nSite: https://championsalestrainingandevents.com/login\nEmail: ${email}\nTemporary Password: ${finalPassword}\n\nPlease log in and change your password from your profile page.\n\n${data.type === "management" ? "─── Next Steps ───\n- Add your sales team from your manager dashboard\n- Assign training modules based on skill gaps\n- Track team progress and sales performance\n\n" : ""}Get started now!\n\n- Champion Sales Training Team`,
      });
    } catch {}

    // Generate auth token
    const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(
      JSON.stringify({ userId: user.id, email: user.email, sessionToken, role: user.role, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
    ).toString("base64url");
    const signature = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
    const token = `${header}.${body}.${signature}`;

    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
);

export const Route = createFileRoute("/signup/complete")({
  component: SignupCompletePage,
});

function SignupCompletePage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("/training");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const tier = params.get("tier");
    const email = params.get("email");
    const name = params.get("name");
    const type = params.get("type") || "individual";

    if (payment !== "success" || !tier || !email) {
      setStatus("error");
      setMessage("Invalid or incomplete payment return URL. Please try signing up again.");
      return;
    }

    completeSignupAfterPayment({ data: { email, name: name || undefined, tier, type } }).then((res) => {
      if (res.success && res.token) {
        localStorage.setItem("salesdrive_token", res.token);
        setRedirectPath(res.user?.role === "management" ? "/manager" : "/training");
        setStatus("success");
      } else {
        setStatus("error");
        setMessage("Something went wrong creating your account. Please contact support.");
      }
    }).catch(() => {
      setStatus("error");
      setMessage("Something went wrong. Please contact support.");
    });
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a1628] px-6">
      <div className="w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#e63946] border-t-transparent" />
            <h1 className="mt-6 text-2xl font-bold text-white">Setting Up Your Account</h1>
            <p className="mt-2 text-sm text-gray-400">We're creating your account. This will just take a moment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">You're All Set!</h1>
            <p className="mt-2 text-gray-400">Your account has been created and your subscription is active.</p>
            <a
              href={redirectPath}
              className="mt-8 inline-block rounded-lg bg-[#e63946] px-8 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20"
            >
              Go to Your Dashboard →
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20">
              <svg className="h-8 w-8 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">Something Went Wrong</h1>
            <p className="mt-2 text-sm text-gray-400">{message}</p>
            <div className="mt-8 flex gap-4 justify-center">
              <a href="/signup" className="text-sm text-[#e63946] hover:underline">Try Again</a>
              <a href="/support" className="text-sm text-gray-400 hover:text-white">Contact Support</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
