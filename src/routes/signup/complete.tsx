import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "~/i18n";
import { SiteHeader } from "~/components/site-header";

// ── Direct API call: create account after Stripe payment ───────────────────
// The TanStack server-function transport is broken site-wide, so the post-payment
// account creation (user row + subscription + welcome email + JWT) runs through
// the direct /api/signup-complete handler in serve.ts instead.
async function completeSignupAfterPayment(data: { email: string; name?: string; tier: string; type: string }) {
  const res = await fetch("/api/signup-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

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

    completeSignupAfterPayment({ email, name: name || undefined, tier, type }).then((res) => {
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
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />

      <div className="flex items-center justify-center px-6 pt-10 pb-12">
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
    </div>
  );
}
