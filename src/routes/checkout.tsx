import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from 'react';
import { useTranslation, LanguageSwitcher } from "~/i18n";

// ── Stripe payment links for management tiers ──────────────────────────────

const STRIPE_LINKS: Record<string, string> = {
  "mgmt-basic": "https://buy.stripe.com/9B6fZhcP4eHqeXM43t8Vi0f",
  "mgmt-plus": "https://buy.stripe.com/fZu5kDeXc2YIeXM8jJ8Vi0g",
  "mgmt-premium": "https://buy.stripe.com/8x214n7uKaraaHw9nN8Vi0h",
};

const TIER_DETAILS: Record<string, { price: number; label: string; features: string[] }> = {
  "mgmt-basic": {
    price: 149,
    label: "Management Basic",
    features: [
      "Add & remove salespeople",
      "Monitor course completion",
      "Team progress tracking",
    ],
  },
  "mgmt-plus": {
    price: 169,
    label: "Management Plus",
    features: [
      "Everything in Basic",
      "Assign tasks & modules by skill gap",
      "Private daily planner",
    ],
  },
  "mgmt-premium": {
    price: 189,
    label: "Management Premium",
    features: [
      "Everything in Plus",
      "Digital sales log",
      "Full team calendar access",
      "Goal tracking & analytics",
      "Priority support",
    ],
  },
};

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { t } = useTranslation();
  const search = useSearch({ from: Route.id as any });
  const initialTier = (search as any)?.tier || "mgmt-plus";

  const [step, setStep] = useState(1);
  const [mgtTier, setMgtTier] = useState(initialTier);
  const [agreeBilling, setAgreeBilling] = useState(false);

  const mgtInfo = TIER_DETAILS[mgtTier] || TIER_DETAILS["mgmt-plus"];
  const stripeLink = STRIPE_LINKS[mgtTier] || STRIPE_LINKS["mgmt-plus"];
  const billingDay = new Date().getDate();

  const handleProceedToCheckout = () => {
    // Build return URL for post-payment account creation
    const returnUrl = `${window.location.origin}/signup/complete?payment=success&tier=${mgtTier}&type=management`;
    // Redirect to Stripe with return URL
    window.location.href = `${stripeLink}?success_url=${encodeURIComponent(returnUrl)}`;
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <header className="sticky top-0 z-50 border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <a href="/" className={`flex items-center gap-2 transition-all duration-300 ${scrolled ? "-translate-y-2 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
            <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Management Account Setup</h1>
        <p className="mt-2 text-gray-400">Choose your plan and start building your sales team.</p>

        {/* Step indicator */}
        <div className="mt-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? "bg-[#e63946]" : "bg-[#1a2d4a]"}`} />
          ))}
        </div>

        {/* Step 1: Select Management Tier */}
        {step === 1 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold text-white">1. Select Your Plan</h2>
            <div className="space-y-3">
              {Object.entries(TIER_DETAILS).map(([key, info]) => {
                const isSelected = mgtTier === key;
                return (
                  <button
                    key={key}
                    onClick={() => setMgtTier(key)}
                    className={`w-full text-left rounded-xl border p-5 transition-all duration-200 ${
                      isSelected
                        ? "border-[#e63946] bg-[#e63946]/5 shadow-lg shadow-[#e63946]/5"
                        : "border-[#1a2d4a] hover:border-[#2a4a6a]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-white">{info.label}</span>
                        <p className="text-sm text-gray-400 mt-0.5">Base fee for your management account</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-white">${info.price}</span>
                        <span className="text-sm text-gray-500">/mo</span>
                      </div>
                    </div>
                    {isSelected && (
                      <ul className="mt-4 space-y-1.5 border-t border-[#1a2d4a] pt-4">
                        {info.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                            <svg className="h-3.5 w-3.5 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(2)} className="rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20">
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Review & Salesperson Info */}
        {step === 2 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-white">2. Review Your Plan</h2>

            {/* Total card */}
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">{mgtInfo.label} — base fee</p>
                  <p className="text-xs text-gray-600 mt-0.5">Charged on day {billingDay} of each month</p>
                </div>
                <span className="text-2xl font-extrabold text-white">${mgtInfo.price}<span className="text-sm text-gray-500">/mo</span></span>
              </div>
            </div>

            {/* Salesperson message */}
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0a1628] p-6">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e63946]/10">
                  <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Add Salespeople After Signup</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    After checkout, you'll be able to add salespeople from your manager dashboard. Each salesperson is billed separately at <strong className="text-white">$149–$189/mo</strong> depending on their tier.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400">Basic: $149/mo</span>
                    <span className="rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400">Plus: $169/mo</span>
                    <span className="rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400">Premium: $189/mo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="rounded-lg border border-[#2a4a6a] px-6 py-3 text-sm font-semibold text-gray-300 hover:border-[#e63946] hover:text-white transition">
                Back
              </button>
              <button onClick={() => setStep(3)} className="rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20">
                Continue to Checkout
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Pay */}
        {step === 3 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-white">3. Confirm & Pay</h2>

            {/* Final summary */}
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">{mgtInfo.label} base plan</span>
                <span className="text-white font-medium">${mgtInfo.price}/mo</span>
              </div>
              <div className="border-t border-[#1a2d4a] pt-3 flex justify-between">
                <span className="text-white font-bold">You'll be charged</span>
                <span className="text-[#e63946] text-xl font-extrabold">${mgtInfo.price}<span className="text-sm">/mo</span></span>
              </div>
              <p className="text-xs text-gray-600">
                Additional salespeople: $149–$189/mo each (added after signup from your dashboard). Charged on the same day each month. Cancel anytime.
              </p>
            </div>

            {/* Billing agreement */}
            <label className="flex items-start gap-3 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeBilling}
                onChange={(e) => setAgreeBilling(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#e63946]"
              />
              <span className="text-sm text-gray-400">
                I agree to be automatically charged ${mgtInfo.price} every 30 days. I understand I can cancel anytime from my profile dashboard after my account is created.
              </span>
            </label>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="rounded-lg border border-[#2a4a6a] px-6 py-3 text-sm font-semibold text-gray-300 hover:border-[#e63946] hover:text-white transition">
                Back
              </button>
              <button
                onClick={handleProceedToCheckout}
                disabled={!agreeBilling}
                className="flex-1 rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Secure Checkout — ${mgtInfo.price}/mo
              </button>
            </div>

            <p className="text-center text-xs text-gray-600">
              You'll be redirected to Stripe, our secure payment processor. Your account will be activated after payment.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
