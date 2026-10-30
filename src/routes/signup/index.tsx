import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
// Direct API call — the TanStack server-function transport is broken site-wide,
// so signup POSTs to the direct /api/signup handler in serve.ts instead.
async function signupCall(data: { email: string; password: string; name: string; role: string }) {
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
import { SiteHeader } from "~/components/site-header";
import { isTokenValid, decodeToken } from "~/lib/client-auth";
import { TERM_DAYS, TIER_PRICES, stripeLinkForTier } from "~/lib/pricing";

// Owner rule (2026-10-30): there is no free signup. Submitting this form creates
// the account RECORD only — it carries no subscription and therefore no training
// access. Access is granted in /signup/complete, and only after the server has
// verified a paid Stripe checkout session (see api/handlers.mjs → signupComplete).
//
// Stripe substitutes {CHECKOUT_SESSION_ID} into the return URL it is configured
// with; we build the same shape here so the redirect works either way.
const RETURN_URL = "/signup/complete?session_id={CHECKOUT_SESSION_ID}";

export const Route = createFileRoute("/signup/")({
  component: SignupPage,
});

// Per-tier Stripe payment links — ONE-TIME $224/$244/$264 for a 90-day term.
// The links live in src/lib/pricing.ts (single source of truth).

function SignupPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "management">("individual");
  const [selectedTier, setSelectedTier] = useState("basic");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Read tier and type from URL params (from pricing page or direct links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier");
    const type = params.get("type");
    if (tier && ["basic", "plus", "premium"].includes(tier)) {
      setSelectedTier(tier);
    }
    if (type === "individual" || type === "management") {
      setAccountType(type);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailClean = email.trim().toLowerCase();
    if (!emailClean || !emailClean.includes("@")) {
      setError("Valid email is required");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Who is already signed in on this device (if anyone)? Used only to let an
    // existing, unpaid customer reach Stripe without re-registering.
    const existingToken = localStorage.getItem("salesdrive_token");
    const signedInEmail = (() => {
      if (!existingToken || !isTokenValid(existingToken)) return "";
      const payload = decodeToken(existingToken) as { email?: string } | null;
      return String(payload?.email || "").trim().toLowerCase();
    })();

    try {
      const result = await signupCall({ email: emailClean, password, name: name.trim(), role: accountType });
      if (result.success) {
        // The account record exists so the details they typed are not lost — it
        // is INERT: no subscription row, so the gate still denies all training.
        if (result.token) localStorage.setItem("salesdrive_token", result.token);
      } else if (result.alreadyExists) {
        // Already registered. Only the owner of that email may continue to pay
        // for it; otherwise point them at sign-in instead.
        if (signedInEmail !== emailClean) {
          setError("An account with this email already exists. Sign in, then choose a plan to subscribe.");
          setLoading(false);
          return;
        }
      } else {
        setError(result.error || "Could not create account");
        setLoading(false);
        return;
      }
    } catch {
      setError("Something went wrong creating your account");
      setLoading(false);
      return;
    }

    const returnUrl = `${window.location.origin}${RETURN_URL}`;
    // Keep the {CHECKOUT_SESSION_ID} placeholder literal — Stripe substitutes it.
    const successUrl = encodeURIComponent(returnUrl).replace(/%7BCHECKOUT_SESSION_ID%7D/gi, "{CHECKOUT_SESSION_ID}");

    if (accountType === "individual") {
      // Individual flow: redirect to Stripe payment
      const stripeLink = stripeLinkForTier(selectedTier);
      window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(emailClean)}&success_url=${successUrl}`;
    } else {
      // Management flow: redirect to checkout page with tier pre-selected
      window.location.href = `/checkout?tier=mgmt-${selectedTier}&email=${encodeURIComponent(emailClean)}`;
    }
    setLoading(false);
  };

  // Tier prices for display — one-time, 90-day term (src/lib/pricing.ts)
  const tierPrices: Record<string, string> = {
    basic: `$${TIER_PRICES.basic}`,
    plus: `$${TIER_PRICES.plus}`,
    premium: `$${TIER_PRICES.premium}`,
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />

      <div className="flex items-center justify-center px-6 pt-10 pb-12">
        <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
          <h1 className="text-2xl font-bold text-white">Buy {TERM_DAYS}-Day Access</h1>
          <p className="mt-2 text-sm text-gray-400">
            Create your account, then complete a one-time payment. Training access unlocks as soon as Stripe confirms your payment and runs for {TERM_DAYS} days.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.accountType')}</label>
              <div className="space-y-2">
                <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  accountType === "individual" ? "border-[#e63946] bg-[#e63946]/5" : "border-[#1a2d4a] hover:border-[#2a4a6a]"
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="individual"
                    checked={accountType === "individual"}
                    onChange={() => setAccountType("individual")}
                    className="mt-1 h-4 w-4 accent-[#e63946]"
                  />
                  <div>
                    <span className="text-sm font-medium text-white">{t('signup.individual')}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{t('signup.individualDesc')}</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  accountType === "management" ? "border-[#e63946] bg-[#e63946]/5" : "border-[#1a2d4a] hover:border-[#2a4a6a]"
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="management"
                    checked={accountType === "management"}
                    onChange={() => setAccountType("management")}
                    className="mt-1 h-4 w-4 accent-[#e63946]"
                  />
                  <div>
                    <span className="text-sm font-medium text-white">{t('signup.management')}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{t('signup.managementDesc')}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Tier selection for individual accounts */}
            {accountType === "individual" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["basic", "plus", "premium"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        selectedTier === tier
                          ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]"
                          : "border-[#1a2d4a] text-gray-400 hover:border-[#2a4a6a]"
                      }`}
                    >
                      <div className="capitalize">{tier}</div>
                      <div className="text-[10px] opacity-70">{tierPrices[tier]} / {TERM_DAYS}d</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300">{t('auth.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                placeholder="you@dealership.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">{t('auth.password')}</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 pr-11 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">{error}</div>
            )}
            {accountType === "individual" && (
              <p className="text-xs text-gray-600">
                You'll be redirected to Stripe to pay {tierPrices[selectedTier]} one-time for {TERM_DAYS} days of {selectedTier} access. Training unlocks the moment Stripe confirms the payment — there is no free tier and nothing renews automatically.
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? t('auth.creatingAccount')
                : accountType === "individual"
                  ? `Continue to Payment — ${tierPrices[selectedTier]} One-Time`
                  : "Continue to Setup"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            {t('auth.hasAccount')}{" "}
            <a href="/login" className="text-[#e63946] hover:underline">
              {t('auth.signIn')}
            </a>
          </p>
          <p className="mt-4 text-center text-xs text-gray-600">
            After signing up, check your spam folder if you don't see our email. Add <span className="text-[#e63946]">champion-sales-training-events-f80d0630@ctomail.io</span> to your contacts.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
