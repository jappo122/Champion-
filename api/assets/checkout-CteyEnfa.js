import { jsxs, jsx } from "react/jsx-runtime";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { u as useTranslation, R as Route, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import "./createSsrRpc-l1y8KE69.js";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const STRIPE_LINKS = {
  "mgmt-basic": "https://buy.stripe.com/9B6fZhcP4eHqeXM43t8Vi0f",
  "mgmt-plus": "https://buy.stripe.com/fZu5kDeXc2YIeXM8jJ8Vi0g",
  "mgmt-premium": "https://buy.stripe.com/8x214n7uKaraaHw9nN8Vi0h"
};
const TIER_DETAILS = {
  "mgmt-basic": {
    price: 149,
    label: "Management Basic",
    features: ["Add & remove salespeople", "Monitor course completion", "Team progress tracking"]
  },
  "mgmt-plus": {
    price: 169,
    label: "Management Plus",
    features: ["Everything in Basic", "Assign tasks & modules by skill gap", "Private daily planner"]
  },
  "mgmt-premium": {
    price: 189,
    label: "Management Premium",
    features: ["Everything in Plus", "Digital sales log", "Full team calendar access", "Goal tracking & analytics", "Priority support"]
  }
};
function CheckoutPage() {
  const {
    t
  } = useTranslation();
  const search = useSearch({
    from: Route.id
  });
  const initialTier = search?.tier || "mgmt-plus";
  const [step, setStep] = useState(1);
  const [mgtTier, setMgtTier] = useState(initialTier);
  const [agreeBilling, setAgreeBilling] = useState(false);
  const mgtInfo = TIER_DETAILS[mgtTier] || TIER_DETAILS["mgmt-plus"];
  const stripeLink = STRIPE_LINKS[mgtTier] || STRIPE_LINKS["mgmt-plus"];
  const billingDay = (/* @__PURE__ */ new Date()).getDate();
  const handleProceedToCheckout = () => {
    const returnUrl = `${window.location.origin}/signup/complete?payment=success&tier=${mgtTier}&type=management`;
    window.location.href = `${stripeLink}?success_url=${encodeURIComponent(returnUrl)}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-4xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsx(LanguageSwitcher, {})
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-2xl px-6 py-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: "Management Account Setup" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Choose your plan and start building your sales team." }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex gap-2", children: [1, 2, 3].map((s) => /* @__PURE__ */ jsx("div", { className: `flex-1 h-1 rounded-full ${s <= step ? "bg-[#e63946]" : "bg-[#1a2d4a]"}` }, s)) }),
      step === 1 && /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "1. Select Your Plan" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Object.entries(TIER_DETAILS).map(([key, info]) => {
          const isSelected = mgtTier === key;
          return /* @__PURE__ */ jsxs("button", { onClick: () => setMgtTier(key), className: `w-full text-left rounded-xl border p-5 transition-all duration-200 ${isSelected ? "border-[#e63946] bg-[#e63946]/5 shadow-lg shadow-[#e63946]/5" : "border-[#1a2d4a] hover:border-[#2a4a6a]"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-white", children: info.label }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-0.5", children: "Base fee for your management account" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-white", children: [
                  "$",
                  info.price
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "/mo" })
              ] })
            ] }),
            isSelected && /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-1.5 border-t border-[#1a2d4a] pt-4", children: info.features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm text-gray-400", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
              f
            ] }, f)) })
          ] }, key);
        }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setStep(2), className: "rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20", children: "Continue" })
      ] }),
      step === 2 && /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "2. Review Your Plan" }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400", children: [
              mgtInfo.label,
              " — base fee"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 mt-0.5", children: [
              "Charged on day ",
              billingDay,
              " of each month"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-white", children: [
            "$",
            mgtInfo.price,
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "/mo" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0a1628] p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e63946]/10", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Add Salespeople After Signup" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-gray-400", children: [
              "After checkout, you'll be able to add salespeople from your manager dashboard. Each salesperson is billed separately at ",
              /* @__PURE__ */ jsx("strong", { className: "text-white", children: "$149–$189/mo" }),
              " depending on their tier."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400", children: "Basic: $149/mo" }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400", children: "Plus: $169/mo" }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[#1a2d4a] px-2.5 py-1 text-gray-400", children: "Premium: $189/mo" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setStep(1), className: "rounded-lg border border-[#2a4a6a] px-6 py-3 text-sm font-semibold text-gray-300 hover:border-[#e63946] hover:text-white transition", children: "Back" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setStep(3), className: "rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20", children: "Continue to Checkout" })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "3. Confirm & Pay" }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
              mgtInfo.label,
              " base plan"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-white font-medium", children: [
              "$",
              mgtInfo.price,
              "/mo"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-[#1a2d4a] pt-3 flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: "You'll be charged" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#e63946] text-xl font-extrabold", children: [
              "$",
              mgtInfo.price,
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "/mo" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Additional salespeople: $149–$189/mo each (added after signup from your dashboard). Charged on the same day each month. Cancel anytime." })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-3 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 cursor-pointer", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: agreeBilling, onChange: (e) => setAgreeBilling(e.target.checked), className: "mt-1 h-4 w-4 shrink-0 accent-[#e63946]" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400", children: [
            "I agree to be automatically charged $",
            mgtInfo.price,
            " every 30 days. I understand I can cancel anytime from my profile dashboard after my account is created."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setStep(2), className: "rounded-lg border border-[#2a4a6a] px-6 py-3 text-sm font-semibold text-gray-300 hover:border-[#e63946] hover:text-white transition", children: "Back" }),
          /* @__PURE__ */ jsxs("button", { onClick: handleProceedToCheckout, disabled: !agreeBilling, className: "flex-1 rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20 disabled:opacity-50 disabled:cursor-not-allowed", children: [
            "Proceed to Secure Checkout — $",
            mgtInfo.price,
            "/mo"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-gray-600", children: "You'll be redirected to Stripe, our secure payment processor. Your account will be activated after payment." })
      ] })
    ] })
  ] });
}
export {
  CheckoutPage as component
};
