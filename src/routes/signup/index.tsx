import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { signup } from "~/lib/auth";

export const Route = createFileRoute("/signup/")({
  component: SignupPage,
});

// Per-tier Stripe payment links for individual signups
const INDIVIDUAL_STRIPE_LINKS: Record<string, string> = {
  basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
  plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
  premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
};

function SignupPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    // Create the account FIRST so the user can log in immediately
    try {
      const result = await signup({ data: { email: emailClean, password, name: name.trim(), role: accountType } });
      if (!result.success) {
        setError(result.error || "Could not create account");
        setLoading(false);
        return;
      }
      // Store the token so they're logged in after payment
      localStorage.setItem("salesdrive_token", result.token!);
    } catch {
      setError("Something went wrong creating your account");
      setLoading(false);
      return;
    }

    if (accountType === "individual") {
      // Individual flow: redirect to Stripe payment
      const stripeLink = INDIVIDUAL_STRIPE_LINKS[selectedTier] || INDIVIDUAL_STRIPE_LINKS.basic;
      const returnUrl = `${window.location.origin}/signup/complete?payment=success&tier=${selectedTier}&email=${encodeURIComponent(emailClean)}&name=${encodeURIComponent(name.trim())}&type=individual`;
      window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(emailClean)}&success_url=${encodeURIComponent(returnUrl)}`;
    } else {
      // Management flow: redirect to checkout page with tier pre-selected
      window.location.href = `/checkout?tier=mgmt-${selectedTier}`;
    }
    setLoading(false);
  };

  // Tier prices for display
  const tierPrices: Record<string, string> = {
    basic: "$149/mo",
    plus: "$169/mo",
    premium: "$189/mo",
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a1628] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2">
<img src="/fb-logo.jpg" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
        </div>
        <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
          <LanguageSwitcher />
          <h1 className="text-2xl font-bold text-white">{t('auth.signUp')}</h1>
          <p className="mt-2 text-sm text-gray-400">{t('auth.join')}</p>
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
                      <div className="text-[10px] opacity-70">{tierPrices[tier]}</div>
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
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                placeholder="At least 6 characters"
              />
            </div>
            {error && (
              <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">{error}</div>
            )}
            {accountType === "individual" && (
              <p className="text-xs text-gray-600">
                You'll be redirected to Stripe to complete your {selectedTier} plan payment ({tierPrices[selectedTier]}). Your account will be created after payment.
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
                  ? `Continue to Payment — ${tierPrices[selectedTier]}`
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
  );
}
