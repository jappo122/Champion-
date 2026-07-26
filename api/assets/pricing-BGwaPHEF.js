import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
const PER_PERSON_RATES = {
  basic: 149,
  plus: 169,
  premium: 189
};
const BASE_MGMT_RATES = {
  basic: 149,
  plus: 169,
  premium: 189
};
function PricingPage() {
  const individualTiers = [{
    id: "individual-basic",
    name: "Basic",
    price: 149,
    period: "/mo per student",
    description: "Complete training: 5-min modules, objection handling, interactive quizzes with 80% mastery threshold.",
    features: ["Complete training library", "5-minute micro-learning modules", "Objection handling techniques", "Built-in assessments with 80% mastery threshold"],
    cta: "Get Started",
    href: "/signup?tier=basic&type=individual",
    featured: false,
    upgradeNote: "Upgrade to Plus: +$20/mo"
  }, {
    id: "individual-plus",
    name: "Plus",
    price: 169,
    period: "/mo per student",
    description: "Everything in Basic plus manager-level tools and scenario practice.",
    features: ["Everything in Basic", "Manager 3-min coaching modules", "Hundreds of scenario questions", "Task assignment & tracking"],
    cta: "Get Started",
    href: "/signup?tier=plus&type=individual",
    featured: true,
    badge: "Most Popular",
    upgradeNote: "Upgrade to Premium: +$20/mo"
  }, {
    id: "individual-premium",
    name: "Premium",
    price: 189,
    period: "/mo per student",
    description: "Everything in Plus plus analytics, goal tracking, and priority support.",
    features: ["Everything in Plus", "Sales chart & performance log", "Goal tracking & gross tracking", "Manager dashboard & team analytics", "Priority support", "Mobile access"],
    cta: "Get Started",
    href: "/signup?tier=premium&type=individual",
    featured: false
  }];
  const managementTiers = [{
    id: "mgmt-basic",
    name: "Management Basic",
    price: 149,
    period: "/mo base + per person",
    description: "Add and manage your sales team with progress tracking.",
    features: ["Add & remove salespeople", "Monitor course completion", "Team progress tracking", "Per-person add-ons at any tier"],
    cta: "Get Started",
    href: "/checkout?tier=mgmt-basic",
    featured: false,
    upgradeNote: "Upgrade to Plus: +$20/mo"
  }, {
    id: "mgmt-plus",
    name: "Management Plus",
    price: 169,
    period: "/mo base + per person",
    description: "Everything in Basic plus task assignments and private daily planner.",
    features: ["Everything in Management Basic", "Assign tasks & modules by skill gap", "Private daily planner", "Per-person add-ons at any tier"],
    cta: "Get Started",
    href: "/checkout?tier=mgmt-plus",
    featured: true,
    badge: "Most Popular",
    upgradeNote: "Upgrade to Premium: +$20/mo"
  }, {
    id: "mgmt-premium",
    name: "Management Premium",
    price: 189,
    period: "/mo base + per person",
    description: "Everything in Plus plus full planner, goal tracking, and priority support.",
    features: ["Everything in Management Plus", "Digital sales log", "Full team calendar access", "Goal tracking & analytics", "Priority support", "Per-person add-ons at any tier"],
    cta: "Get Started",
    href: "/checkout?tier=mgmt-premium",
    featured: false
  }];
  function TierCard({
    tier
  }) {
    return /* @__PURE__ */ jsxs("div", { className: `relative flex flex-col rounded-xl border p-8 transition-all duration-200 ${tier.featured ? "border-[#e63946] bg-[#0d1f35] shadow-lg shadow-[#e63946]/10 md:scale-105" : "border-[#1a2d4a] bg-[#0d1f35] hover:border-[#2a4a6a]"}`, children: [
      tier.badge && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e63946] px-4 py-1 text-xs font-semibold text-white", children: tier.badge }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-300", children: tier.name }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline gap-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-4xl font-extrabold text-white", children: [
          "$",
          tier.price
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: tier.period })
      ] }),
      tier.upgradeNote && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#e63946]/80 font-medium", children: tier.upgradeNote }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: tier.description }),
      /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3 flex-1", children: tier.features.map((feature) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-400", children: [
        /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
        feature
      ] }, feature)) }),
      /* @__PURE__ */ jsx("a", { href: tier.href, className: `mt-8 block rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 ${tier.featured ? "bg-[#e63946] text-white hover:bg-[#c1121f] shadow-lg shadow-[#e63946]/20" : "border border-[#2a4a6a] text-gray-300 hover:border-[#e63946] hover:text-white"}`, children: tier.cta })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("section", { className: "px-4 py-16 md:py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-white md:text-5xl", children: "Simple, Transparent Pricing" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-400", children: "Choose the plan that fits your dealership. Every plan includes full access to the Champion Sales Training platform. Works for both individual salespeople and management accounts." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white", children: "Individual Plans" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "For individual salespeople who want to master the automotive sales process." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: individualTiers.map((tier) => /* @__PURE__ */ jsx(TierCard, { tier }, tier.id)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white", children: "Management Plans" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "For dealership owners and managers who need to train and track their entire sales team." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: managementTiers.map((tier) => /* @__PURE__ */ jsx(TierCard, { tier }, tier.id)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pb-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white text-center mb-2", children: "Per-Salesperson Add-On Rates" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 text-center mb-6", children: "Management accounts can add salespeople at any tier. Each salesperson gets their own training access." }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#1a2d4a]", children: [
          /* @__PURE__ */ jsx("th", { className: "py-3 pr-4 text-gray-400 font-medium", children: "Tier" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 pr-4 text-gray-400 font-medium", children: "Rate per person" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 text-gray-400 font-medium", children: "Includes" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "text-gray-300", children: [
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#1a2d4a]/50", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: "Basic" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 font-semibold text-white", children: "$149/mo" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 text-gray-400", children: "Complete training, 5-min modules, quizzes with 80% mastery" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#1a2d4a]/50", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: "Plus" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 font-semibold text-white", children: "$169/mo" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 text-gray-400", children: "Basic + manager modules, scenario questions, task assignment" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: "Premium" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 font-semibold text-white", children: "$189/mo" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 text-gray-400", children: "Plus + sales log, goal tracking, full analytics, mobile access" })
          ] })
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pb-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white text-center mb-2", children: "Manager Cost Calculator" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 text-center mb-6", children: "Estimate your monthly total based on your plan and team size." }),
      /* @__PURE__ */ jsx(ManagerCostCalculator, {})
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "border-t border-[#1a2d4a] px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "Questions?" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-400", children: [
        "Contact us at",
        " ",
        /* @__PURE__ */ jsx("a", { href: "mailto:champion-sales-training-events-f80d0630@ctomail.io", className: "text-[#e63946] hover:underline", children: "champion-sales-training-events-f80d0630@ctomail.io" }),
        " ",
        "or visit our",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/support", className: "text-[#e63946] hover:underline", children: "Support page" }),
        "."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-gray-600", children: "All plans auto-renew every 30 days. Cancel anytime from your profile dashboard. Works for any type of account — individual or management." })
    ] }) })
  ] });
}
function ManagerCostCalculator() {
  const [planTier, setPlanTier] = useState("basic");
  const [salespersonTier, setSalespersonTier] = useState("basic");
  const [salespeople, setSalespeople] = useState(3);
  const baseFee = BASE_MGMT_RATES[planTier] || 149;
  const perPersonRate = PER_PERSON_RATES[salespersonTier] || 149;
  const totalPerPerson = perPersonRate * salespeople;
  const total = baseFee + totalPerPerson;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Management Plan" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: ["basic", "plus", "premium"].map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setPlanTier(t), className: `rounded-lg border px-3 py-2 text-sm font-medium transition ${planTier === t ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]" : "border-[#1a2d4a] text-gray-400 hover:border-[#2a4a6a]"}`, children: [
        t.charAt(0).toUpperCase() + t.slice(1),
        " ($",
        BASE_MGMT_RATES[t],
        ")"
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Per-Salesperson Tier" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: ["basic", "plus", "premium"].map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setSalespersonTier(t), className: `rounded-lg border px-3 py-2 text-sm font-medium transition ${salespersonTier === t ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]" : "border-[#1a2d4a] text-gray-400 hover:border-[#2a4a6a]"}`, children: [
        t.charAt(0).toUpperCase() + t.slice(1),
        " ($",
        PER_PERSON_RATES[t],
        ")"
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: [
        "Number of Salespeople: ",
        /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: salespeople })
      ] }),
      /* @__PURE__ */ jsx("input", { type: "range", min: 1, max: 20, value: salespeople, onChange: (e) => setSalespeople(Number(e.target.value)), className: "w-full h-2 bg-[#1a2d4a] rounded-lg appearance-none cursor-pointer accent-[#e63946]" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-600 mt-1", children: [
        /* @__PURE__ */ jsx("span", { children: "1" }),
        /* @__PURE__ */ jsx("span", { children: "10" }),
        /* @__PURE__ */ jsx("span", { children: "20" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-[#0a1628] p-5 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Base management fee" }),
        /* @__PURE__ */ jsxs("span", { className: "text-white font-medium", children: [
          "$",
          baseFee,
          "/mo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
          salespeople,
          " salespeople × $",
          perPersonRate,
          "/mo"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-white font-medium", children: [
          "$",
          totalPerPerson,
          "/mo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-[#1a2d4a] pt-3 flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "Estimated Monthly Total" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[#e63946] text-xl font-extrabold", children: [
          "$",
          total,
          "/mo"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("a", { href: `/checkout?tier=mgmt-${planTier}`, className: "block w-full rounded-lg bg-[#e63946] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20", children: [
      "Get Started — $",
      total,
      "/mo Estimated"
    ] })
  ] });
}
export {
  PricingPage as component
};
