import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation, LanguageSwitcher } from "~/i18n";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

interface Tier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
  badge?: string;
  upgradeNote?: string;
}

// Per-salesperson add-on rates for management accounts
const PER_PERSON_RATES: Record<string, number> = {
  basic: 149,
  plus: 169,
  premium: 189,
};

// Base management fees
const BASE_MGMT_RATES: Record<string, number> = {
  basic: 149,
  plus: 169,
  premium: 189,
};

function PricingPage() {
  const individualTiers: Tier[] = [
    {
      id: "individual-basic",
      name: "Basic",
      price: 149,
      period: "/mo per student",
      description: "Complete training: 5-min modules, objection handling, interactive quizzes with 80% mastery threshold.",
      features: [
        "Complete training library",
        "5-minute micro-learning modules",
        "Objection handling techniques",
        "Built-in assessments with 80% mastery threshold",
      ],
      cta: "Get Started",
      href: "/signup?tier=basic&type=individual",
      featured: false,
      upgradeNote: "Upgrade to Plus: +$20/mo",
    },
    {
      id: "individual-plus",
      name: "Plus",
      price: 169,
      period: "/mo per student",
      description: "Everything in Basic plus manager-level tools and scenario practice.",
      features: [
        "Everything in Basic",
        "Manager 3-min coaching modules",
        "Hundreds of scenario questions",
        "Task assignment & tracking",
      ],
      cta: "Get Started",
      href: "/signup?tier=plus&type=individual",
      featured: true,
      badge: "Most Popular",
      upgradeNote: "Upgrade to Premium: +$20/mo",
    },
    {
      id: "individual-premium",
      name: "Premium",
      price: 189,
      period: "/mo per student",
      description: "Everything in Plus plus analytics, goal tracking, and priority support.",
      features: [
        "Everything in Plus",
        "Sales chart & performance log",
        "Goal tracking & gross tracking",
        "Manager dashboard & team analytics",
        "Priority support",
        "Mobile access",
      ],
      cta: "Get Started",
      href: "/signup?tier=premium&type=individual",
      featured: false,
    },
  ];

  const managementTiers: Tier[] = [
    {
      id: "mgmt-basic",
      name: "Management Basic",
      price: 149,
      period: "/mo base + per person",
      description: "Add and manage your sales team with progress tracking.",
      features: [
        "Add & remove salespeople",
        "Monitor course completion",
        "Team progress tracking",
        "Per-person add-ons at any tier",
      ],
      cta: "Get Started",
      href: "/checkout?tier=mgmt-basic",
      featured: false,
      upgradeNote: "Upgrade to Plus: +$20/mo",
    },
    {
      id: "mgmt-plus",
      name: "Management Plus",
      price: 169,
      period: "/mo base + per person",
      description: "Everything in Basic plus task assignments and private daily planner.",
      features: [
        "Everything in Management Basic",
        "Assign tasks & modules by skill gap",
        "Private daily planner",
        "Per-person add-ons at any tier",
      ],
      cta: "Get Started",
      href: "/checkout?tier=mgmt-plus",
      featured: true,
      badge: "Most Popular",
      upgradeNote: "Upgrade to Premium: +$20/mo",
    },
    {
      id: "mgmt-premium",
      name: "Management Premium",
      price: 189,
      period: "/mo base + per person",
      description: "Everything in Plus plus full planner, goal tracking, and priority support.",
      features: [
        "Everything in Management Plus",
        "Digital sales log",
        "Full team calendar access",
        "Goal tracking & analytics",
        "Priority support",
        "Per-person add-ons at any tier",
      ],
      cta: "Get Started",
      href: "/checkout?tier=mgmt-premium",
      featured: false,
    },
  ];

  function TierCard({ tier }: { tier: Tier }) {
    return (
      <div
        className={`relative flex flex-col rounded-xl border p-8 transition-all duration-200 ${
          tier.featured
            ? "border-[#e63946] bg-[#0d1f35] shadow-lg shadow-[#e63946]/10 md:scale-105"
            : "border-[#1a2d4a] bg-[#0d1f35] hover:border-[#2a4a6a]"
        }`}
      >
        {tier.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e63946] px-4 py-1 text-xs font-semibold text-white">
            {tier.badge}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-300">{tier.name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white">${tier.price}</span>
          <span className="text-sm text-gray-500">{tier.period}</span>
        </div>
        {tier.upgradeNote && (
          <p className="mt-1 text-xs text-[#e63946]/80 font-medium">{tier.upgradeNote}</p>
        )}
        <p className="mt-2 text-sm text-gray-400">{tier.description}</p>
        <ul className="mt-6 space-y-3 flex-1">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <a
          href={tier.href}
          className={`mt-8 block rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 ${
            tier.featured
              ? "bg-[#e63946] text-white hover:bg-[#c1121f] shadow-lg shadow-[#e63946]/20"
              : "border border-[#2a4a6a] text-gray-300 hover:border-[#e63946] hover:text-white"
          }`}
        >
          {tier.cta}
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 pt-[184px] pb-16 md:pt-[200px] md:pb-24">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Choose the plan that fits your dealership. Every plan includes full access to the Champion Sales Training platform. Works for both individual salespeople and management accounts.
          </p>
        </div>
      </section>

      {/* Individual Plans */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Individual Plans</h2>
            <p className="mt-2 text-sm text-gray-500">For individual salespeople who want to master the automotive sales process.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {individualTiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Management Plans */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Management Plans</h2>
            <p className="mt-2 text-sm text-gray-500">For dealership owners and managers who need to train and track their entire sales team.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {managementTiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Per-Salesperson Add-On Rates */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
            <h2 className="text-xl font-bold text-white text-center mb-2">Per-Salesperson Add-On Rates</h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Management accounts can add salespeople at any tier. Each salesperson gets their own training access.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1a2d4a]">
                    <th className="py-3 pr-4 text-gray-400 font-medium">Tier</th>
                    <th className="py-3 pr-4 text-gray-400 font-medium">Rate per person</th>
                    <th className="py-3 text-gray-400 font-medium">Includes</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-[#1a2d4a]/50">
                    <td className="py-3 pr-4">Basic</td>
                    <td className="py-3 pr-4 font-semibold text-white">$149/mo</td>
                    <td className="py-3 text-gray-400">Complete training, 5-min modules, quizzes with 80% mastery</td>
                  </tr>
                  <tr className="border-b border-[#1a2d4a]/50">
                    <td className="py-3 pr-4">Plus</td>
                    <td className="py-3 pr-4 font-semibold text-white">$169/mo</td>
                    <td className="py-3 text-gray-400">Basic + manager modules, scenario questions, task assignment</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Premium</td>
                    <td className="py-3 pr-4 font-semibold text-white">$189/mo</td>
                    <td className="py-3 text-gray-400">Plus + sales log, goal tracking, full analytics, mobile access</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Manager Cost Calculator */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
            <h2 className="text-xl font-bold text-white text-center mb-2">Manager Cost Calculator</h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Estimate your monthly total based on your plan and team size.
            </p>
            <ManagerCostCalculator />
          </div>
        </div>
      </section>

      {/* FAQ / Footer note */}
      <section className="border-t border-[#1a2d4a] px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-lg font-semibold text-white">Questions?</h3>
          <p className="mt-2 text-sm text-gray-400">
            Contact us at{" "}
            <a href="mailto:champion-sales-training-events-f80d0630@ctomail.io" className="text-[#e63946] hover:underline">
              champion-sales-training-events-f80d0630@ctomail.io
            </a>{" "}
            or visit our{" "}
            <a href="/support" className="text-[#e63946] hover:underline">Support page</a>.
          </p>
          <p className="mt-3 text-xs text-gray-600">
            All plans auto-renew every 30 days. Cancel anytime from your profile dashboard. Works for any type of account — individual or management.
          </p>
        </div>
      </section>
    </div>
  );
}

function ManagerCostCalculator() {
  const [planTier, setPlanTier] = useState("basic");
  const [salespersonTier, setSalespersonTier] = useState("basic");
  const [salespeople, setSalespeople] = useState(3);

  const baseFee = BASE_MGMT_RATES[planTier] || 149;
  const perPersonRate = PER_PERSON_RATES[salespersonTier] || 149;
  const totalPerPerson = perPersonRate * salespeople;
  const total = baseFee + totalPerPerson;

  return (
    <div className="space-y-6">
      {/* Management plan tier selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Management Plan</label>
        <div className="grid grid-cols-3 gap-2">
          {(["basic", "plus", "premium"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPlanTier(t)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                planTier === t
                  ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]"
                  : "border-[#1a2d4a] text-gray-400 hover:border-[#2a4a6a]"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} (${BASE_MGMT_RATES[t]})
            </button>
          ))}
        </div>
      </div>

      {/* Salesperson tier selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Per-Salesperson Tier</label>
        <div className="grid grid-cols-3 gap-2">
          {(["basic", "plus", "premium"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSalespersonTier(t)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                salespersonTier === t
                  ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]"
                  : "border-[#1a2d4a] text-gray-400 hover:border-[#2a4a6a]"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} (${PER_PERSON_RATES[t]})
            </button>
          ))}
        </div>
      </div>

      {/* Salesperson count */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of Salespeople: <span className="text-white font-bold">{salespeople}</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={salespeople}
          onChange={(e) => setSalespeople(Number(e.target.value))}
          className="w-full h-2 bg-[#1a2d4a] rounded-lg appearance-none cursor-pointer accent-[#e63946]"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>1</span>
          <span>10</span>
          <span>20</span>
        </div>
      </div>

      {/* Calculation breakdown */}
      <div className="rounded-lg bg-[#0a1628] p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Base management fee</span>
          <span className="text-white font-medium">${baseFee}/mo</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            {salespeople} salespeople × ${perPersonRate}/mo
          </span>
          <span className="text-white font-medium">${totalPerPerson}/mo</span>
        </div>
        <div className="border-t border-[#1a2d4a] pt-3 flex justify-between">
          <span className="text-white font-semibold">Estimated Monthly Total</span>
          <span className="text-[#e63946] text-xl font-extrabold">${total}/mo</span>
        </div>
      </div>

      <a
        href={`/checkout?tier=mgmt-${planTier}`}
        className="block w-full rounded-lg bg-[#e63946] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20"
      >
        Get Started — ${total}/mo Estimated
      </a>
    </div>
  );
}
