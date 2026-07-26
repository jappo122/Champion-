import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useTranslation, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
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
function Home() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx(Navbar, { t }),
    /* @__PURE__ */ jsx(Hero, { t }),
    /* @__PURE__ */ jsx(Features, { t }),
    /* @__PURE__ */ jsx(AccountTypes, { t }),
    /* @__PURE__ */ jsx(HowItWorks, { t }),
    /* @__PURE__ */ jsx(Pricing, { t }),
    /* @__PURE__ */ jsx(Footer, { t })
  ] });
}
function Navbar({
  t
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("salesdrive_token"));
    const check = () => setLoggedIn(!!localStorage.getItem("salesdrive_token"));
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);
  return /* @__PURE__ */ jsx("header", { className: "fixed top-0 z-50 w-full border-b border-[#1a2d4a]/50 bg-[#0a1628]/90 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 md:flex", children: [
      loggedIn ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.training") }),
        /* @__PURE__ */ jsx("a", { href: "/steps", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Steps of the Sale" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("profile.title") }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          localStorage.removeItem("salesdrive_token");
          window.location.href = "/";
        }, className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Sign Out" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.training") }),
        /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Blog" }),
        /* @__PURE__ */ jsx("a", { href: "/manager", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.manager") }),
        /* @__PURE__ */ jsx("a", { href: "/#features", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.features") }),
        /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.pricing") }),
        /* @__PURE__ */ jsx("a", { href: "/login", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.signIn") }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary text-sm", children: t("nav.getStarted") })
      ] }),
      /* @__PURE__ */ jsx(LanguageSwitcher, {})
    ] }),
    /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "btn-primary text-sm md:hidden", children: t("hero.cta.waitlist") })
  ] }) });
}
function Hero({
  t
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden pt-32 pb-20 sm:pb-28", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#e63946]/10 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-[#1a2d4a]/40 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-7xl px-6 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946] animate-pulse" }),
        t("hero.badge")
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "mx-auto mt-8 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl", children: [
        /* @__PURE__ */ jsx("span", { className: "text-white", children: t("hero.title.line1") }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "gradient-text", children: t("hero.title.line2") })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl", children: t("hero.description") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row", children: [
        /* @__PURE__ */ jsx("a", { href: "#pricing", className: "btn-primary text-base", children: t("hero.cta.waitlist") }),
        /* @__PURE__ */ jsx("a", { href: "#features", className: "btn-secondary text-base", children: t("hero.cta.learnMore") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `fixed bottom-8 right-8 z-40 flex flex-col items-center gap-1.5 transition-all duration-700 ${scrolled ? "pointer-events-none opacity-0" : "opacity-100"}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-widest text-gray-500", children: "Scroll Down" }),
        /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 animate-bounce text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }),
          t("hero.trust.proven")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }),
          t("hero.trust.biteSized")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" }) }),
          t("hero.trust.forDealers")
        ] })
      ] })
    ] })
  ] });
}
function Features({
  t
}) {
  const features = [t("features.sales.item1"), t("features.sales.item2"), t("features.sales.item3"), t("features.sales.item4"), t("features.sales.item5"), t("features.sales.item6"), t("features.sales.item7")];
  return /* @__PURE__ */ jsx("section", { id: "features", className: "border-t border-[#1a2d4a]/50 py-20 sm:py-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: t("features.title") }),
      /* @__PURE__ */ jsx("p", { className: "section-subtitle mx-auto", children: t("features.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 grid gap-8 md:grid-cols-2", children: /* @__PURE__ */ jsxs("div", { className: "card group md:col-span-2 max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: t("features.sales.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: t("features.sales.desc") }),
      /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3", children: features.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-400", children: [
        /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
        item
      ] }, item)) }),
      /* @__PURE__ */ jsx("a", { href: "/training", className: "btn-primary mt-6 text-sm", children: t("features.sales.cta") })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium uppercase tracking-widest text-gray-500", children: "Scroll Down" }),
      /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 animate-bounce text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) })
    ] }) })
  ] }) });
}
function AccountTypes({
  t
}) {
  return /* @__PURE__ */ jsx("section", { id: "account-types", className: "border-t border-[#1a2d4a]/50 py-20 sm:py-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "Choose Your Account Type" }),
      /* @__PURE__ */ jsx("p", { className: "section-subtitle mx-auto", children: "Whether you're an individual salesperson or a dealership manager, we have the right plan for you." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "card group", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "Individual Account" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: "Perfect for salespeople who want to master the sales process at their own pace. Access all courses, track your progress, and start closing more deals." }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2", children: ["Complete training library", "Track your own progress", "Interactive quizzes with 80% mastery threshold", "Objection handling techniques"].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-400", children: [
          /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
          item
        ] }, item)) }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary mt-6 text-sm inline-block", children: "Get Started — Individual" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "card group border-[#e63946]/30", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" }) }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "Management Account" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: "Built for dealership managers who need to train their team at scale. Add salespeople, track progress, assign modules, and manage subscriptions." }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2", children: ["Add & manage salespeople", "Track team progress", "Assign modules by skill gaps", "Cost & subscription management"].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-400", children: [
          /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
          item
        ] }, item)) }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary mt-6 text-sm inline-block", children: "Get Started — Management" })
      ] })
    ] })
  ] }) });
}
function HowItWorks({
  t
}) {
  const steps = [{
    number: "01",
    title: t("how.step1.title"),
    description: t("how.step1.desc"),
    color: "from-[#e63946] to-[#f77f00]"
  }, {
    number: "02",
    title: t("how.step2.title"),
    description: t("how.step2.desc"),
    color: "from-[#f77f00] to-[#e63946]"
  }, {
    number: "03",
    title: t("how.step3.title"),
    description: t("how.step3.desc"),
    color: "from-[#e63946] to-[#f77f00]"
  }];
  return /* @__PURE__ */ jsx("section", { id: "how-it-works", className: "border-t border-[#1a2d4a]/50 py-20 sm:py-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: t("how.title") }),
      /* @__PURE__ */ jsx("p", { className: "section-subtitle mx-auto", children: t("how.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 grid gap-8 md:grid-cols-3", children: steps.map((step) => /* @__PURE__ */ jsxs("div", { className: "card relative", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r px-4 py-1 text-xs font-bold text-white", children: /* @__PURE__ */ jsxs("span", { className: "gradient-text", style: {
        WebkitTextFillColor: "white"
      }, children: [
        t("how.step"),
        " ",
        step.number
      ] }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white", children: step.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 leading-relaxed text-gray-400", children: step.description }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 h-1 w-full rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: `h-1 w-1/3 rounded-full bg-gradient-to-r ${step.color}` }) })
    ] }, step.number)) })
  ] }) });
}
function Pricing({
  t
}) {
  const individualTiers = [{
    id: "basic",
    name: t("pricing.basic.name"),
    price: t("pricing.basic.price"),
    period: t("pricing.period"),
    description: t("pricing.basic.desc"),
    features: [t("pricing.basic.feature1"), t("pricing.basic.feature2"), t("pricing.basic.feature3"), t("pricing.basic.feature4")],
    cta: t("pricing.cta"),
    href: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
    featured: false
  }, {
    id: "plus",
    name: t("pricing.plus.name"),
    price: t("pricing.plus.price"),
    period: t("pricing.period"),
    description: t("pricing.plus.desc"),
    features: [t("pricing.plus.feature1"), t("pricing.plus.feature2"), t("pricing.plus.feature3"), t("pricing.plus.feature4")],
    cta: t("pricing.cta"),
    href: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
    featured: true
  }, {
    id: "premium",
    name: t("pricing.premium.name"),
    price: t("pricing.premium.price"),
    period: t("pricing.period"),
    description: t("pricing.premium.desc"),
    features: [t("pricing.premium.feature1"), t("pricing.premium.feature2"), t("pricing.premium.feature3"), t("pricing.premium.feature4"), t("pricing.premium.feature5"), t("pricing.premium.feature6"), t("pricing.premium.feature7")],
    cta: t("pricing.cta"),
    href: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
    featured: false
  }];
  const mgmtTiers = [{
    id: "mgmt-basic",
    name: t("pricing.mgmtBasic.name"),
    price: t("pricing.mgmtBasic.price"),
    period: t("pricing.basePlus"),
    description: t("pricing.management.desc"),
    perPerson: t("pricing.perPerson"),
    range: "$149–$189",
    features: [t("pricing.mgmtBasic.feature1"), t("pricing.mgmtBasic.feature2"), t("pricing.mgmtBasic.feature3"), t("pricing.mgmtBasic.feature4"), t("pricing.mgmtPlus.perPerson")],
    cta: t("pricing.cta"),
    href: "/checkout?tier=mgmt-basic",
    featured: false
  }, {
    id: "mgmt-plus",
    name: t("pricing.mgmtPlus.name"),
    price: t("pricing.mgmtPlus.price"),
    period: t("pricing.basePlus"),
    description: t("pricing.management.desc"),
    perPerson: t("pricing.perPerson"),
    range: "$149–$189",
    features: [t("pricing.mgmtPlus.feature1"), t("pricing.mgmtPlus.feature2"), t("pricing.mgmtPlus.feature3"), t("pricing.mgmtPlus.feature4"), t("pricing.mgmtPlus.perPerson")],
    cta: t("pricing.cta"),
    href: "/checkout?tier=mgmt-plus",
    featured: true
  }, {
    id: "mgmt-premium",
    name: t("pricing.mgmtPremium.name"),
    price: t("pricing.mgmtPremium.price"),
    period: t("pricing.basePlus"),
    description: t("pricing.management.desc"),
    perPerson: t("pricing.perPerson"),
    range: "$149–$189",
    features: [t("pricing.mgmtPremium.feature1"), t("pricing.mgmtPremium.feature2"), t("pricing.mgmtPremium.feature3"), t("pricing.mgmtPremium.feature4"), t("pricing.mgmtPremium.feature5"), t("pricing.mgmtPremium.feature6"), t("pricing.mgmtPlus.perPerson")],
    cta: t("pricing.cta"),
    href: "/checkout?tier=mgmt-premium",
    featured: false
  }];
  const renderTier = (tier) => /* @__PURE__ */ jsxs("div", { className: `relative flex flex-col rounded-xl border p-8 transition-all duration-200 ${tier.featured ? "border-[#e63946] bg-[#0d1f35] shadow-lg shadow-[#e63946]/10 scale-105" : "border-[#1a2d4a] bg-[#0d1f35] hover:border-[#2a4a6a]"}`, children: [
    tier.featured && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e63946] px-4 py-1 text-xs font-semibold text-white", children: t("pricing.popular") }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-300", children: tier.name }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline gap-1", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-4xl font-extrabold text-white", children: [
        "$",
        tier.price
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: tier.period })
    ] }),
    tier.range && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
      tier.perPerson,
      ": ",
      tier.range
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: tier.description }),
    /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3 flex-1", children: tier.features.map((feature) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-400", children: [
      /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
      feature
    ] }, feature)) }),
    /* @__PURE__ */ jsx("a", { href: tier.href, target: "_blank", rel: "noopener noreferrer", className: `mt-8 flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${tier.featured ? "bg-[#e63946] text-white hover:bg-[#c1121f]" : "border border-[#1a2d4a] text-white hover:border-[#e63946] hover:text-[#e63946]"}`, children: tier.cta })
  ] }, tier.id);
  return /* @__PURE__ */ jsx("section", { id: "pricing", className: "border-t border-[#1a2d4a]/50 py-20 sm:py-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: t("pricing.title") }),
      /* @__PURE__ */ jsx("p", { className: "section-subtitle mx-auto", children: t("pricing.subtitle") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-8 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-5 py-2 text-sm font-medium text-gray-300", children: t("pricing.individual") }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-3", children: individualTiers.map(renderTier) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative my-16", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-[#1a2d4a]/50" }) }),
      /* @__PURE__ */ jsx("div", { className: "relative flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "bg-[#0a1628] px-6 text-sm font-medium text-gray-500", children: "OR" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "mb-8 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#e63946]/30 bg-[#e63946]/5 px-5 py-2 text-sm font-medium text-[#e63946]", children: t("pricing.management") }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-3", children: mgmtTiers.map(renderTier) })
    ] })
  ] }) });
}
function Footer({
  t
}) {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-[#1a2d4a]/50 bg-[#0a1628] py-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-md text-sm leading-relaxed text-gray-500", children: "The complete automotive sales training platform. Master the proven sales process, close more deals, and grow your career." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400", children: t("nav.training") }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("nav.training") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-sm text-gray-500 transition-colors hover:text-white", children: "Blog" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/#features", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("nav.features") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("nav.pricing") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400", children: "Account" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/login", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("nav.signIn") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/signup", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("nav.getStarted") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/manager", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("nav.manager") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/support", className: "text-sm text-gray-500 transition-colors hover:text-white", children: t("footer.support") }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1a2d4a]/50 pt-8 sm:flex-row", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Champion Sales Training & Events. ",
        t("footer.copyright")
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/Championsalesevents", target: "_blank", rel: "noopener noreferrer", className: "text-gray-600 transition-colors hover:text-white", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" }) }) }) })
    ] })
  ] }) });
}
export {
  Home as component
};
