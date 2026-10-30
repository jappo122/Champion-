import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "~/i18n";
import { SiteHeader } from "~/components/site-header";

// ── Direct API call: activate the account after Stripe payment ─────────────
// The TanStack server-function transport is broken site-wide, so activation runs
// through the direct /api/signup-complete handler (api/handlers.mjs, shared by
// serve.ts and api/ssr.mjs).
//
// The ONLY thing this page sends is the Stripe checkout session id. The server
// asks Stripe whether that session was paid and reads the tier, email and account
// type from Stripe's answer — nothing in this URL can grant access on its own.
async function activateSubscription(sessionId: string) {
  const res = await fetch("/api/signup-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return data ?? { success: false, error: "We couldn't verify that payment. Please contact support." };
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
    // Stripe substitutes {CHECKOUT_SESSION_ID} into the return URL. Accept the
    // standard name and the `checkout_session_id` alias — and nothing else.
    const sessionId = params.get("session_id") || params.get("checkout_session_id");

    if (!sessionId) {
      setStatus("error");
      setMessage(
        "We couldn't find a payment to verify, so no account was activated. If you have just paid, contact support with your receipt.",
      );
      return;
    }

    activateSubscription(sessionId).then((res) => {
      if (res.success && res.token) {
        localStorage.setItem("salesdrive_token", res.token);
        setRedirectPath(res.user?.role === "management" ? "/manager" : "/training");
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(res.error || "We couldn't verify that payment. Please contact support.");
      }
    }).catch(() => {
      setStatus("error");
      setMessage("Something went wrong verifying your payment. Please contact support.");
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
