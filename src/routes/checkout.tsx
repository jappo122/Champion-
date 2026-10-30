import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation, LanguageSwitcher } from "~/i18n";
import { SiteHeader } from "~/components/site-header";
import { TERM_DAYS, TIER_PRICES, stripeLinkForTier } from "~/lib/pricing";
import { recordPendingPurchase } from "~/lib/pending-purchase";

// ── Stripe payment links for management tiers ──────────────────────────────
// ONE-TIME 90-DAY TERMS. The links live in src/lib/pricing.ts (single source of
// truth) — the same three links and the same three prices serve individual
// accounts, management accounts and salesperson seats.

const TIER_DETAILS: Record<string, { price: number; label: string; features: string[] }> = {
  "mgmt-basic": {
    price: TIER_PRICES.basic,
    label: "Management Basic",
    features: [
      "Add & remove salespeople",
      "Monitor course completion",
      "Team progress tracking",
    ],
  },
  "mgmt-plus": {
    price: TIER_PRICES.plus,
    label: "Management Plus",
    features: [
      "Everything in Basic",
      "Assign tasks & modules by skill gap",
      "Private daily planner",
    ],
  },
  "mgmt-premium": {
    price: TIER_PRICES.premium,
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
  const { t } = useTranslation();
  const search = useSearch({ from: Route.id as any });
  const initialTier = (search as any)?.tier || "mgmt-plus";
  // The buyer's email, carried over from /signup so the owner's payment alert can
  // name the customer. Editable, because a manager may pay for someone else.
  const [buyerEmail, setBuyerEmail] = useState(String((search as any)?.email || ""));

  const [step, setStep] = useState(1);
  const [mgtTier, setMgtTier] = useState(initialTier);
  const [agreeBilling, setAgreeBilling] = useState(false);

  const mgtInfo = TIER_DETAILS[mgtTier] || TIER_DETAILS["mgmt-plus"];
  const stripeLink = stripeLinkForTier(mgtTier.replace(/^mgmt-/, ""));

  const handleProceedToCheckout = () => {
    // Record what they chose BEFORE we hand them to Stripe: the return trip only
    // carries the checkout session id, so this is the only chance to know who is
    // paying and for which tier (the owner's payment alert uses it).
    recordPendingPurchase(buyerEmail, mgtTier.replace(/^mgmt-/, ""));
    // Return URL for post-payment activation. Stripe substitutes the real
    // checkout session id for {CHECKOUT_SESSION_ID}; /signup/complete sends that
    // id to the server, which verifies the payment with Stripe before activating
    // anything. Nothing in this URL can grant access by itself.
    const returnUrl = `${window.location.origin}/signup/complete?session_id={CHECKOUT_SESSION_ID}`;
    const successUrl = encodeURIComponent(returnUrl).replace(/%7BCHECKOUT_SESSION_ID%7D/gi, "{CHECKOUT_SESSION_ID}");
    // Redirect to Stripe with return URL
    window.location.href = `${stripeLink}?success_url=${successUrl}`;
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pt-10 pb-12">
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
                        <span className="text-sm text-gray-500"> one-time / {TERM_DAYS} days</span>
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
                  <p className="text-sm text-gray-400">{mgtInfo.label} — one-time base fee</p>
                  <p className="text-xs text-gray-600 mt-0.5">{TERM_DAYS} days of access from the day your payment clears</p>
                </div>
                <span className="text-2xl font-extrabold text-white">${mgtInfo.price}<span className="text-sm text-gray-500"> one-time</span></span>
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
                    After checkout, you'll be able to add salespeople from your manager dashboard. Each seat is a one-time charge for its own {TERM_DAYS}-day term at <strong className="text-white">${TIER_PRICES.basic}–${TIER_PRICES.premium}</strong> depending on their tier.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400">Basic: ${TIER_PRICES.basic} one-time</span>
                    <span className="rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400">Plus: ${TIER_PRICES.plus} one-time</span>
                    <span className="rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400">Premium: ${TIER_PRICES.premium} one-time</span>
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
                <span className="text-gray-400">{mgtInfo.label} base plan (one-time)</span>
                <span className="text-white font-medium">${mgtInfo.price}</span>
              </div>
              <div className="border-t border-[#1a2d4a] pt-3 flex justify-between">
                <span className="text-white font-bold">You'll be charged today</span>
                <span className="text-[#e63946] text-xl font-extrabold">${mgtInfo.price}<span className="text-sm"> one-time</span></span>
              </div>
              <p className="text-xs text-gray-600">
                Covers {TERM_DAYS} days of access from the day your payment clears. Additional salespeople are ${TIER_PRICES.basic}–${TIER_PRICES.premium} one-time each for their own {TERM_DAYS}-day term (added after signup from your dashboard). Nothing renews automatically.
              </p>
            </div>

            {/* Buyer email — used to identify the payment when you return from Stripe */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Email for this account
              </span>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="you@dealership.com"
                autoComplete="email"
                className="w-full rounded-lg border border-[#2a4a6a] bg-[#0a1628] px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#e63946] focus:outline-none"
              />
              <span className="mt-1 block text-xs text-gray-600">
                We use this to match your payment to your account after checkout.
              </span>
            </label>

            {/* Billing agreement */}
            <label className="flex items-start gap-3 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeBilling}
                onChange={(e) => setAgreeBilling(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#e63946]"
              />
              <span className="text-sm text-gray-400">
                I understand this is a one-time payment of ${mgtInfo.price} for {TERM_DAYS} days of access. There is no recurring charge and my access ends when the {TERM_DAYS}-day term ends.
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
                Proceed to Secure Checkout — ${mgtInfo.price} One-Time
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
