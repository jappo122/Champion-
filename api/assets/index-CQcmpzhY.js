import { jsx, jsxs } from "react/jsx-runtime";
import { u as useTranslation, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { useState, useEffect } from "react";
import { s as signup } from "./auth-EYtabqPq.js";
import "@tanstack/react-router";
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
const INDIVIDUAL_STRIPE_LINKS = {
  basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
  plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
  premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e"
};
function SignupPage() {
  const {
    t
  } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("individual");
  const [selectedTier, setSelectedTier] = useState("basic");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
  const handleSubmit = async (e) => {
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
    try {
      const result = await signup({
        data: {
          email: emailClean,
          password,
          name: name.trim(),
          role: accountType
        }
      });
      if (!result.success) {
        setError(result.error || "Could not create account");
        setLoading(false);
        return;
      }
      localStorage.setItem("salesdrive_token", result.token);
    } catch {
      setError("Something went wrong creating your account");
      setLoading(false);
      return;
    }
    if (accountType === "individual") {
      const stripeLink = INDIVIDUAL_STRIPE_LINKS[selectedTier] || INDIVIDUAL_STRIPE_LINKS.basic;
      const returnUrl = `${window.location.origin}/signup/complete?payment=success&tier=${selectedTier}&email=${encodeURIComponent(emailClean)}&name=${encodeURIComponent(name.trim())}&type=individual`;
      window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(emailClean)}&success_url=${encodeURIComponent(returnUrl)}`;
    } else {
      window.location.href = `/checkout?tier=mgmt-${selectedTier}`;
    }
    setLoading(false);
  };
  const tierPrices = {
    basic: "$149/mo",
    plus: "$169/mo",
    premium: "$189/mo"
  };
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8 text-center", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
      /* @__PURE__ */ jsx(LanguageSwitcher, {}),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: t("auth.signUp") }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: t("auth.join") }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: t("signup.accountType") }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${accountType === "individual" ? "border-[#e63946] bg-[#e63946]/5" : "border-[#1a2d4a] hover:border-[#2a4a6a]"}`, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "accountType", value: "individual", checked: accountType === "individual", onChange: () => setAccountType("individual"), className: "mt-1 h-4 w-4 accent-[#e63946]" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white", children: t("signup.individual") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: t("signup.individualDesc") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${accountType === "management" ? "border-[#e63946] bg-[#e63946]/5" : "border-[#1a2d4a] hover:border-[#2a4a6a]"}`, children: [
              /* @__PURE__ */ jsx("input", { type: "radio", name: "accountType", value: "management", checked: accountType === "management", onChange: () => setAccountType("management"), className: "mt-1 h-4 w-4 accent-[#e63946]" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white", children: t("signup.management") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: t("signup.managementDesc") })
              ] })
            ] })
          ] })
        ] }),
        accountType === "individual" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Select Plan" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: ["basic", "plus", "premium"].map((tier) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setSelectedTier(tier), className: `rounded-lg border px-3 py-2 text-xs font-medium transition ${selectedTier === tier ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]" : "border-[#1a2d4a] text-gray-400 hover:border-[#2a4a6a]"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "capitalize", children: tier }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] opacity-70", children: tierPrices[tier] })
          ] }, tier)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.name") }),
          /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "John Doe" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.email") }),
          /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "you@dealership.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.password") }),
          /* @__PURE__ */ jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "At least 6 characters" })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]", children: error }),
        accountType === "individual" && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
          "You'll be redirected to Stripe to complete your ",
          selectedTier,
          " plan payment (",
          tierPrices[selectedTier],
          "). Your account will be created after payment."
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50", children: loading ? t("auth.creatingAccount") : accountType === "individual" ? `Continue to Payment — ${tierPrices[selectedTier]}` : "Continue to Setup" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-400", children: [
        t("auth.hasAccount"),
        " ",
        /* @__PURE__ */ jsx("a", { href: "/login", className: "text-[#e63946] hover:underline", children: t("auth.signIn") })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-xs text-gray-600", children: [
        "After signing up, check your spam folder if you don't see our email. Add ",
        /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "champion-sales-training-events-f80d0630@ctomail.io" }),
        " to your contacts."
      ] })
    ] })
  ] }) });
}
export {
  SignupPage as component
};
