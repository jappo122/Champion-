import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { useState, useRef, useEffect, useContext, createContext, Component } from "react";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
const __variableDynamicImportRuntimeHelper = (glob$1, path$13, segs) => {
  const v = glob$1[path$13];
  if (v) return typeof v === "function" ? v() : Promise.resolve(v);
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path$13 + (path$13.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : ""))));
  });
};
const languages = [
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", dir: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", dir: "ltr" }
];
const STORAGE_KEY = "champion_lang";
function getStoredLanguage() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY) || navigator.language.split("-")[0] || "en";
  }
  return "en";
}
function storeLanguage(code) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, code);
  }
}
const translations = {
  // ── Navbar ────────────────────────────────────────────────────────────────
  "nav.training": "Training",
  "nav.manager": "Manager",
  "nav.features": "Features",
  "nav.pricing": "Pricing",
  "nav.signIn": "Sign In",
  "nav.getStarted": "Get Started",
  "nav.backToCourses": "Back to Courses",
  "nav.signOut": "Sign Out",
  // ── Hero ──────────────────────────────────────────────────────────────────
  "hero.badge": "Learn to Sell Cars Like a Champion",
  "hero.title.line1": "Master the Sales Process.",
  "hero.title.line2": "Close More Deals.",
  "hero.description": "A comprehensive automotive sales training platform comprising concise modules, practical scenarios, and manager coaching tools. From meet & greet to closing — master every step.",
  "hero.cta.waitlist": "See Plans & Pricing",
  "hero.cta.learnMore": "Learn More",
  "hero.trust.proven": "Proven sales process",
  "hero.trust.biteSized": "5-minute modules",
  "hero.trust.forDealers": "Used by dealerships nationwide",
  // ── Features ──────────────────────────────────────────────────────────────
  "features.title": "Everything you need to sell more cars",
  "features.subtitle": "Built specifically for automotive sales professionals and dealership owners.",
  "features.sales.title": "Complete Sales Training Platform",
  "features.sales.desc": "A complete, step-by-step sales process designed for automotive. Master every stage with text-based lessons, interactive assessments, and real-world scenarios.",
  "features.sales.item1": "Proven automotive sales methodology",
  "features.sales.item2": "Interactive training modules",
  "features.sales.item3": "Interactive assessments & quizzes",
  "features.sales.item4": "Role-play scenarios & scripts",
  "features.sales.item5": "Progress tracking for managers",
  "features.sales.item6": "Available in 20 languages",
  "features.sales.item7": "Senior Sales Training modules (Plus+ required)",
  "features.sales.cta": "View Courses",
  // ── How It Works ─────────────────────────────────────────────────────────
  "how.title": "How It Works",
  "how.subtitle": "Three simple steps to transform your sales team.",
  "how.step1.title": "Learn",
  "how.step1.desc": "Access our complete automotive sales training library. Text-based lessons, scripts, and assessments teach you the proven process from greeting to closing.",
  "how.step2.title": "Practice",
  "how.step2.desc": "Apply what you've learned with interactive drills, role-play scenarios, and real-world simulations. Build confidence before you hit the lot.",
  "how.step3.title": "Close",
  "how.step3.desc": "Apply your training on the lot with confidence. Use your new skills to connect with customers, handle objections, and close more deals than ever before.",
  "how.step": "Step",
  // ── Pricing ───────────────────────────────────────────────────────────────
  "pricing.title": "Simple, transparent pricing",
  "pricing.subtitle": "Everything you need to start closing more deals.",
  "pricing.basic.name": "Basic",
  "pricing.basic.price": "149",
  "pricing.basic.desc": "Everything an individual salesperson needs to start mastering the sales process.",
  "pricing.basic.feature1": "Complete training library",
  "pricing.basic.feature2": "5-minute modules per sales step",
  "pricing.basic.feature3": "Objection handling & closing techniques",
  "pricing.basic.feature4": "Multiple choice questions & assessments",
  "pricing.plus.name": "Plus",
  "pricing.plus.price": "169",
  "pricing.plus.desc": "Everything in Basic plus manager tools for coaching and team development.",
  "pricing.plus.feature1": "Everything in Basic",
  "pricing.plus.feature2": "Managers can assign modules on this tier and above",
  "pricing.plus.feature3": "Hundreds of scenario & multiple choice questions",
  "pricing.plus.feature4": "Task assignment for salespeople",
  "pricing.premium.name": "Premium",
  "pricing.premium.price": "189",
  "pricing.premium.desc": "You get everything from Basic and Plus. The complete package — full analytics, goal tracking, and priority support.",
  "pricing.premium.feature1": "You get everything from Basic and Plus",
  "pricing.premium.feature2": "Sales chart & log",
  "pricing.premium.feature3": "Goal & gross tracking",
  "pricing.premium.feature4": "Manager dashboard & team analytics",
  "pricing.premium.feature5": "Priority support",
  "pricing.premium.feature6": "Mobile app access",
  "pricing.premium.feature7": "Digital calendar & daily planner",
  "pricing.period": "/mo per student",
  "pricing.cta": "Buy Now",
  "pricing.popular": "Most Popular",
  "pricing.individual": "For Individuals",
  "pricing.management": "For Dealership Managers",
  "pricing.management.desc": "Base management fee + per-salesperson pricing",
  "pricing.mgmtBasic.name": "Management Basic",
  "pricing.mgmtBasic.price": "149",
  "pricing.mgmtBasic.feature1": "Add & remove salespeople",
  "pricing.mgmtBasic.feature2": "Monitor training completion",
  "pricing.mgmtBasic.feature3": "Progress tracking only",
  "pricing.mgmtBasic.feature4": "Monthly invoice & cost summary",
  "pricing.mgmtPlus.name": "Management Plus",
  "pricing.mgmtPlus.price": "169",
  "pricing.mgmtPlus.feature1": "Everything in Management Basic",
  "pricing.mgmtPlus.feature2": "Assign tasks & modules",
  "pricing.mgmtPlus.feature3": "Private daily planner (per salesperson)",
  "pricing.mgmtPlus.feature4": "Manager + salesperson view only",
  "pricing.mgmtPlus.perPerson": "Salespeople priced individually",
  "pricing.mgmtPremium.name": "Management Premium",
  "pricing.mgmtPremium.price": "189",
  "pricing.mgmtPremium.feature1": "Everything in Management Plus",
  "pricing.mgmtPremium.feature2": "Digital sales log",
  "pricing.mgmtPremium.feature3": "Full daily planner with appointments",
  "pricing.mgmtPremium.feature4": "Goal & gross tracking",
  "pricing.mgmtPremium.feature5": "Set appointments with salespeople",
  "pricing.mgmtPremium.feature6": "Priority support & onboarding",
  "pricing.perPerson": "per salesperson",
  "pricing.basePlus": "base + per person",
  // ── Waitlist ──────────────────────────────────────────────────────────────
  "waitlist.title": "Ready to Get Started?",
  "waitlist.desc": "Ready to master the automotive sales process? Whether you're a seasoned pro or just starting out, our proven system will help you close more deals.",
  "waitlist.email": "Enter your email",
  "waitlist.cta": "Join Now",
  "waitlist.privacy": "No spam, ever. Start learning immediately.",
  "waitlist.success": "Welcome Aboard! Check your email for login details.",
  // ── Footer ────────────────────────────────────────────────────────────────
  "footer.copyright": "All rights reserved.",
  "footer.support": "Support",
  "footer.training": "Training",
  "footer.features": "Features",
  "footer.pricing": "Pricing",
  "footer.waitlist": "Get Started",
  "footer.manager": "Manager Dashboard",
  "footer.signIn": "Sign In",
  "footer.signUp": "Sign Up",
  // ── Training ──────────────────────────────────────────────────────────────
  "training.hero.title": "Master the Sales Process",
  "training.hero.subtitle": "Comprehensive training courses designed to take you from rookie to top performer. 5-minute modules with multiple choice questions. Learn at your own pace, track your progress, and start closing more deals.",
  "training.badge": "Sales Training Library",
  "training.start": "Start Learning",
  "training.courseContent": "Course Content",
  "training.aboutCourse": "About This Course",
  "training.whatYoullLearn": "What You'll Learn",
  "training.completed": "Completed",
  "training.markComplete": "Mark as Complete",
  "training.lessonCompleted": "Lesson Completed",
  "training.greatWork": "Great work!",
  "training.nextLesson": "Next Lesson",
  "training.backToCourses": "Back to Courses",
  "training.lessons": "lessons",
  "training.browseCourses": "Browse Courses",
  // ── Manager Dashboard ────────────────────────────────────────────────────
  "manager.title": "Team Dashboard",
  "manager.subtitle": "Track your team's training progress and send them messages about what to complete next.",
  "manager.noMembers": "No team members yet",
  "manager.noMembers.desc": "When salespeople sign up for training, they'll appear here so you can track their progress.",
  "manager.progress": "Progress",
  "manager.messages": "Messages",
  "manager.sendMessage": "Send Message",
  "manager.messagePlaceholder": "Tell them what to focus on next...",
  "manager.noMessages": "No messages sent yet.",
  "manager.backToTeam": "Back to Team",
  "manager.trainingProgress": "Training Progress",
  // ── Auth ──────────────────────────────────────────────────────────────────
  "auth.signIn": "Sign In",
  "auth.signUp": "Sign Up",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.name": "Full name",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.join": "Join Champion Sales Training & Events. Master the sales process.",
  "auth.signingIn": "Signing in...",
  "auth.creatingAccount": "Creating account...",
  // ── Account ───────────────────────────────────────────────────────────────
  "account.title": "Account Settings",
  "account.subtitle": "Manage your profile and account information.",
  "account.profile": "Profile",
  "account.profileInfo": "Profile Information",
  "account.profileDesc": "Update your name and email address.",
  "account.emailUnchangeable": "Email cannot be changed.",
  "account.save": "Save Changes",
  "account.saving": "Saving...",
  "account.saved": "Changes saved successfully!",
  "account.details": "Account Details",
  "account.memberSince": "Member since",
  "account.plan": "Plan",
  "account.userId": "User ID",
  "account.signOut": "Sign Out",
  // ── Profile ────────────────────────────────────────────────────────────────
  "profile.title": "Profile",
  "profile.subtitle": "Manage your profile and account information.",
  "profile.profile": "Profile",
  "profile.photo": "Profile Photo",
  "profile.photoDesc": "Upload a photo to personalize your account.",
  "profile.uploadPhoto": "Upload Photo",
  "profile.profileInfo": "Profile Information",
  "profile.profileDesc": "Update your name and email address.",
  "profile.subscription": "Subscription",
  "profile.subscriptionDesc": "Manage your subscription plan.",
  "profile.cancelButton": "Cancel Subscription",
  "profile.cancelling": "Cancelling...",
  "profile.cancelled": "Subscription cancelled. Your access continues until",
  "profile.cancelWarning": "Cancelling will stop future charges. You'll retain access until the end of your billing period.",
  "profile.cancelMinimum": "A 3-month minimum subscription period applies.",
  // ── Signup ─────────────────────────────────────────────────────────────────
  "signup.accountType": "Account Type",
  "signup.individual": "Individual Sales Account",
  "signup.management": "Management Account",
  "signup.individualDesc": "Access training courses and track your own progress.",
  "signup.managementDesc": "Manage team members, assign training, and track progress.",
  // ── Manager ────────────────────────────────────────────────────────────────
  "manager.addSalesperson": "Add Salesperson",
  "manager.costSummary": "Cost Summary",
  "manager.people": "salespeople",
  "manager.perMonth": "/mo",
  "manager.total": "Total",
  "manager.remove": "Remove",
  "manager.upgrade": "Upgrade",
  "manager.downgrade": "Downgrade",
  "manager.selectTier": "Select Tier",
  "manager.invoice": "Invoice",
  "manager.invoiceTitle": "Monthly Invoice",
  "manager.invoiceGenerated": "Invoice generated",
  "manager.quantity": "Qty",
  "manager.price": "Price",
  "manager.subtotal": "Subtotal",
  // ── Planner ────────────────────────────────────────────────────────────────
  "planner.title": "Daily Planner",
  "planner.subtitle": "Manage appointments, tasks, and schedules for your team.",
  "planner.newAppointment": "New Appointment",
  "planner.customerName": "Customer Name",
  "planner.appointmentTime": "Appointment Time",
  "planner.carDescription": "Car Description",
  "planner.task": "Task",
  "planner.save": "Save Appointment",
  "planner.saving": "Saving...",
  "planner.noAppointments": "No appointments scheduled for this day.",
  "planner.selectSalesperson": "Select Salesperson",
  "planner.appointments": "Appointments",
  "planner.myPlanner": "My Planner",
  // ── Checkout ───────────────────────────────────────────────────────────────
  "checkout.title": "Set Up Your Team",
  "checkout.step1": "Select Management Tier",
  "checkout.step2": "Add Salespeople",
  "checkout.step3": "Additional Managers",
  "checkout.step4": "Review & Pay",
  "checkout.addSalesperson": "Add Salesperson",
  "checkout.addManager": "Add Manager",
  "checkout.teamSize": "Select your team size",
  "checkout.breakdown": "Cost Breakdown",
  "checkout.managementBase": "Management Base",
  "checkout.salespeople": "Salespeople",
  "checkout.additionalManagers": "Additional Managers",
  "checkout.totalMonthly": "Total Monthly",
  "checkout.pay": "Pay & Activate",
  "checkout.processing": "Processing payment...",
  "checkout.success": "Payment Successful!",
  "checkout.successDesc": "Your team accounts have been created. Each person will receive an email with login instructions.",
  "checkout.email": "Email",
  "checkout.name": "Name",
  "checkout.tier": "Tier",
  "checkout.remove": "Remove",
  "checkout.perPerson": "per person",
  "checkout.nextStep": "Next Step",
  "checkout.backStep": "Back",
  // ── Purchase ───────────────────────────────────────────────────────────────
  "purchase.success": "Payment Successful!",
  "purchase.successDesc": "Your subscription has been activated. You can now access all training materials.",
  "purchase.emailSent": "We've sent your login details and invoice to your email. Check your inbox.",
  // ── Support ────────────────────────────────────────────────────────────────
  "support.title": "Contact Support",
  "support.subtitle": "We're here to help. Fill out the form below and we'll get back to you.",
  "support.name": "Your name",
  "support.email": "Your email",
  "support.subject": "Subject",
  "support.message": "Message",
  "support.submit": "Send Message",
  "support.sending": "Sending...",
  "support.success": "Message sent!",
  "support.successDesc": "We've received your message and will get back to you within 24 hours.",
  "support.error": "Something went wrong. Please try again."
};
const en = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: translations,
  translations
}, Symbol.toStringTag, { value: "Module" }));
function LanguageSwitcher() {
  const { lang, setLang, currentLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-500", children: "Change Language" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:text-white hover:bg-[#1a2d4a]",
        "aria-label": "Select language",
        children: [
          /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: currentLanguage?.nativeName || lang })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-full z-50 mt-1 max-h-72 w-48 overflow-y-auto rounded-xl border border-[#1a2d4a] bg-[#0d1f35] shadow-xl shadow-black/30", children: languages.map((langItem) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setLang(langItem.code);
          setOpen(false);
        },
        className: `flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1a2d4a] ${lang === langItem.code ? "text-[#e63946]" : "text-gray-400"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 w-6", children: langItem.code.toUpperCase() }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: langItem.nativeName })
        ]
      },
      langItem.code
    )) })
  ] });
}
const I18nContext = createContext({
  lang: "en",
  setLang: () => {
  },
  t: (key) => key,
  currentLanguage: void 0
});
const localeCache = {};
async function loadLocale(lang) {
  if (localeCache[lang]) return localeCache[lang];
  try {
    const mod = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./locales/ar.ts": () => import("./ar-DbMZx13I.js"), "./locales/bn.ts": () => import("./bn-DbMZx13I.js"), "./locales/de.ts": () => import("./de-DbMZx13I.js"), "./locales/en.ts": () => Promise.resolve().then(() => en), "./locales/es.ts": () => import("./es-DbMZx13I.js"), "./locales/fr.ts": () => import("./fr-DbMZx13I.js"), "./locales/hi.ts": () => import("./hi-DbMZx13I.js"), "./locales/it.ts": () => import("./it-DbMZx13I.js"), "./locales/ja.ts": () => import("./ja-DbMZx13I.js"), "./locales/jv.ts": () => import("./jv-DbMZx13I.js"), "./locales/ko.ts": () => import("./ko-DbMZx13I.js"), "./locales/mr.ts": () => import("./mr-DbMZx13I.js"), "./locales/ms.ts": () => import("./ms-DbMZx13I.js"), "./locales/pa.ts": () => import("./pa-DbMZx13I.js"), "./locales/pt.ts": () => import("./pt-DbMZx13I.js"), "./locales/ru.ts": () => import("./ru-DbMZx13I.js"), "./locales/ta.ts": () => import("./ta-DbMZx13I.js"), "./locales/te.ts": () => import("./te-DbMZx13I.js"), "./locales/vi.ts": () => import("./vi-DbMZx13I.js"), "./locales/zh.ts": () => import("./zh-DbMZx13I.js") }), `./locales/${lang}.ts`, 3);
    localeCache[lang] = mod.default || mod.translations;
    return localeCache[lang];
  } catch {
    if (lang !== "en") return loadLocale("en");
    return {};
  }
}
function I18nProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [translations$1, setTranslations] = useState(translations);
  useEffect(() => {
    const stored = getStoredLanguage();
    setLangState(stored);
    loadLocale(stored).then(setTranslations);
  }, []);
  const setLang = (code) => {
    setLangState(code);
    storeLanguage(code);
    loadLocale(code).then(setTranslations);
  };
  const t = (key) => {
    return translations$1[key] || translations[key] || key;
  };
  const currentLanguage = languages.find((l) => l.code === lang);
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value: { lang, setLang, t, currentLanguage }, children });
}
function useTranslation() {
  return useContext(I18nContext);
}
function MobileNav() {
  const [open, setOpen] = useState(false);
  const loggedIn = typeof window !== "undefined" && !!localStorage.getItem("salesdrive_token");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] text-white md:hidden",
        "aria-label": "Menu",
        children: open ? /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) : /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-40 md:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 h-full w-64 bg-[#0d1f35] border-l border-[#1a2d4a] p-6 pt-20", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Home" }),
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/steps", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Steps of the Sale" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Profile" }),
        /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Blog" }),
        /* @__PURE__ */ jsx("a", { href: "/contact", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Contact Us" }),
        /* @__PURE__ */ jsx("a", { href: "/pricing", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Pricing" }),
        /* @__PURE__ */ jsx("a", { href: "/support", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Support" }),
        /* @__PURE__ */ jsx("a", { href: "/inbox", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Inbox" }),
        /* @__PURE__ */ jsx("hr", { className: "border-[#1a2d4a]" }),
        loggedIn ? /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              localStorage.removeItem("salesdrive_token");
              window.location.href = "/";
            },
            className: "text-left text-sm text-[#e63946] hover:text-[#ff6b6b]",
            children: "Sign Out"
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("a", { href: "/login", className: "text-sm text-gray-400 hover:text-white", onClick: () => setOpen(false), children: "Sign In" }),
          /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#c1121f]", onClick: () => setOpen(false), children: "Get Started" })
        ] })
      ] }) })
    ] })
  ] });
}
createServerFn({
  method: "POST"
}).handler(createSsrRpc("203c6d8ce876b2a75949deb516cb129dddf00a0f32bed6e082d8b128136d47e0"));
const logError = createServerFn({
  method: "POST"
}).handler(createSsrRpc("38c3584af60e662981ee1e05b5e204b7e874c0a9ed5375e2eebc6b76c845d600"));
const appCss = "/assets/app-FYQuGm25.css";
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    logError({
      data: {
        message: error.message,
        stack: error.stack || "",
        url: typeof window !== "undefined" ? window.location.href : ""
      }
    }).catch(() => {
    });
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxs("div", { className: "flex min-h-dvh flex-col items-center justify-center bg-[#0a1628] px-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }),
        /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold text-white", children: "Something went wrong" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-md text-gray-400", children: "We've been notified. Please try refreshing the page or contact support if the issue persists." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "btn-primary text-sm",
              children: "Refresh Page"
            }
          ),
          /* @__PURE__ */ jsx("a", { href: "/support", className: "btn-secondary text-sm", children: "Contact Support" })
        ] })
      ] });
    }
    return this.props.children;
  }
}
const Route$n = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Champion Sales Training & Events — Sales Training for Auto Dealers" },
      {
        name: "description",
        content: "Sales training that actually closes deals. A complete sales process training platform for automotive salespeople with text-based lessons, assessments, and manager coaching."
      },
      { name: "og:title", content: "Champion Sales Training & Events — Sales Training" },
      {
        name: "og:description",
        content: "Master the sales process. Close more deals. All in one platform."
      },
      { name: "og:type", content: "website" },
      { name: "trustpilot-one-time-verification-id", content: "62945537-9b3b-4a29-b0af-543f0c520c06" },
      { name: "trustpilot-one-time-domain-verification-id", content: "f0d6dc8c-dbdd-4479-a7c2-d4fd284fe839" },
      // Security headers
      { "http-equiv": "Content-Security-Policy", content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://buy.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com; frame-src https://buy.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';" },
      { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
      { "http-equiv": "X-Frame-Options", content: "DENY" },
      { "http-equiv": "Referrer-Policy", content: "strict-origin-when-cross-origin" },
      { "http-equiv": "Permissions-Policy", content: "camera=(), microphone=(), geolocation=()" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      }
    ]
  }),
  notFoundComponent: () => /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400", children: "Page not found" }) }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(HeadContent, {}),
      /* @__PURE__ */ jsx("style", { children: `
          /* Auth-aware footer: CSS handles visibility, immune to React hydration */
          body:not(.is-logged-in) .auth-logged-out { display: inline; }
          body:not(.is-logged-in) .auth-logged-in { display: none; }
          body.is-logged-in .auth-logged-out { display: none; }
          body.is-logged-in .auth-logged-in { display: inline; }
        ` })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsxs(ErrorBoundary, { children: [
        /* @__PURE__ */ jsx("div", { className: "fixed right-4 top-20 z-40", children: /* @__PURE__ */ jsx(LanguageSwitcher, {}) }),
        children,
        /* @__PURE__ */ jsx(MobileNav, {}),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://www.facebook.com/Championsalesevents",
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": "Follow us on Facebook",
            className: "fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20 transition-all duration-200 hover:bg-[#c1121f] hover:shadow-[#e63946]/40 hover:scale-110",
            children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/contact", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Contact Us" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Blog" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsx("a", { href: "/email", className: "auth-logged-in text-sm text-gray-400 transition-colors hover:text-white", children: "Email" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-600 auth-logged-in", children: "|" }),
          /* @__PURE__ */ jsx("a", { href: "/login", className: "auth-logged-out text-sm font-medium text-[#e63946] transition-colors hover:text-[#ff6b6b]", children: "Sign In" }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "auth-logged-in text-sm font-medium text-[#e63946] transition-colors hover:text-[#ff6b6b]",
              onClick: (e) => {
                e.preventDefault();
                localStorage.removeItem("salesdrive_token");
                document.body.classList.remove("is-logged-in");
                window.location.href = "/";
              },
              children: "Sign Out"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx("script", { children: `
          (function(){
            // Always sync body class with token state — add if logged in, remove if not
            if (localStorage.getItem("salesdrive_token")) {
              document.body.classList.add("is-logged-in");
            } else {
              document.body.classList.remove("is-logged-in");
            }
            // Re-check on storage change (multi-tab)
            window.addEventListener("storage", function(){
              if (localStorage.getItem("salesdrive_token")) {
                document.body.classList.add("is-logged-in");
              } else {
                document.body.classList.remove("is-logged-in");
              }
            });
          })();
        ` })
    ] })
  ] });
}
const $$splitComponentImporter$m = () => import("./index-zwmunjqt.js");
const Route$m = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./account-DXPtYoM-.js");
const Route$l = createFileRoute("/account")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./admin-C_IeYcpL.js");
const Route$k = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./checkout-CteyEnfa.js");
const Route$j = createFileRoute("/checkout")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./contact-CRUWI-dA.js");
const Route$i = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}
function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload;
  } catch {
    return null;
  }
}
function isTokenValid(token) {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp > Date.now();
}
function getTokenPayload(token) {
  const decoded = decodeToken(token);
  if (!decoded || decoded.exp <= Date.now()) return null;
  return decoded;
}
const $$splitComponentImporter$h = () => import("./email-oOyn1nPp.js");
const Route$h = createFileRoute("/email")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("salesdrive_token");
      if (!token || !isTokenValid(token)) {
        throw redirect({
          to: "/login"
        });
      }
    }
  }
});
const $$splitComponentImporter$g = () => import("./inbox-P8KOWeFy.js");
const Route$g = createFileRoute("/inbox")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./login-DSpHJPRp.js");
const Route$f = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./planner-SGOUZTBI.js");
const Route$e = createFileRoute("/planner")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./pricing-BGwaPHEF.js");
const Route$d = createFileRoute("/pricing")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./profile-tx9tXdVs.js");
const Route$c = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./sales-log-DJFnFDo5.js");
const Route$b = createFileRoute("/sales-log")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./steps-ByMk9-Rr.js");
const Route$a = createFileRoute("/steps")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./support-DCbukaZc.js");
const Route$9 = createFileRoute("/support")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-Zwov0U6o.js");
const Route$8 = createFileRoute("/blog/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./_slug-CIoKwEX4.js");
const Route$7 = createFileRoute("/blog/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-y5wo0F-2.js");
const Route$6 = createFileRoute("/manager/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./success-Dzs4ORSO.js");
const Route$5 = createFileRoute("/purchase/success")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-CQcmpzhY.js");
const Route$4 = createFileRoute("/signup/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./complete-CefDkTNy.js");
const Route$3 = createFileRoute("/signup/complete")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const getMyProgress = createServerFn({
  method: "POST"
}).handler(createSsrRpc("3221f3a4204dd83bc28ed66fb5acdffa4d96a1e8f1db920b51a7367bfb38d607"));
const markMyLessonComplete = createServerFn({
  method: "POST"
}).handler(createSsrRpc("e7770dfade8d3e86aa88e5d711d4c723eb0200691ef9a76fc8763eff3acf2fdd"));
const removeMyLessonComplete = createServerFn({
  method: "POST"
}).handler(createSsrRpc("1b8000400d6d231bada369e773f07b6195fbc9fe0ed88e049db2f73d336fe0e4"));
const getTeamProgress = createServerFn({
  method: "POST"
}).handler(createSsrRpc("6d848a6285240562fade7cea55f201f8399aa920675d23a8d2f60811fd85fb58"));
const getUserProgress = createServerFn({
  method: "POST"
}).handler(createSsrRpc("9c0421e3ae78540b25ad0e30e8d434622c6f1ff4b61c1617f4b1908a169e6a89"));
const sendMessage = createServerFn({
  method: "POST"
}).handler(createSsrRpc("f8f55b485c47ee0f5d017569a268e294533cd5195ce0bb2c9fe1e8133a96bb94"));
const markMessageRead = createServerFn({
  method: "POST"
}).handler(createSsrRpc("8eaef4251083319385a2e19d1be4b881bf29095f4d87934f8d1be0eba6a67ec4"));
const markLessonComplete = createServerFn({
  method: "POST"
}).handler(createSsrRpc("afa7675d84a08a924a93721ab3da1c98e107c856a23e7bebc378c17bfcdb96a6"));
const removeLessonComplete = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ed5b3652e011937d53d01f6c5920938d1175c8c543682bdb10932d6133608ee8"));
const addSalesperson = createServerFn({
  method: "POST"
}).handler(createSsrRpc("d59530cf90590aac5a47607c248df9cffcc1617e32d2390ecbe2c004add9f2d9"));
const removeSalesperson = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ca81aa781b4d068719ce036a5b2b0e3f88a1cdaef88e0f2bcc945f9c2fa25189"));
const changeSalespersonTier = createServerFn({
  method: "POST"
}).handler(createSsrRpc("03f6e12e4db29fb8b4b6afd287a6df9c6a8e7b8ae57708c1bb67f4e840ce62d2"));
const getTeamCost = createServerFn({
  method: "POST"
}).handler(createSsrRpc("21e9ac0f75fcb896d05f95803ca940ccf5073f894ac5252bc30ad0b7af411b5a"));
const getSalesLog = createServerFn({
  method: "POST"
}).handler(createSsrRpc("38ac02dafb0d26f55b381bf8e049da13b9e64485cc34697c62bafbb8287fe567"));
const addSalesEntry = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ced407a3b857bc28380a3412b5b592807e08617739a57bc5f5c601224a8ccf49"));
const deleteSalesEntry = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ec00ab5cf9967a6672888a83b23fcfb7c6de22fd5f7057498f4be212333cfc1a"));
const createAssignment = createServerFn({
  method: "POST"
}).handler(createSsrRpc("43dac81f24a83401a179dcc542fde77b11bef664a85cdd75812560e7498cfc3b"));
const assignAllSalespeople = createServerFn({
  method: "POST"
}).handler(createSsrRpc("b290334c87f65aa12dfa707394f10bd647afee85ceb1e2df2c992e1f8c7f129e"));
const getAssignments = createServerFn({
  method: "POST"
}).handler(createSsrRpc("9a42464ad55bb0261ecee7e16bb1920825485257bab1868c4ea6148f4a79334d"));
const completeAssignment = createServerFn({
  method: "POST"
}).handler(createSsrRpc("d0151042fbfaa43cce236a092102e6802294901453c35c6218a2aae04df4e8fc"));
const deleteAssignment = createServerFn({
  method: "POST"
}).handler(createSsrRpc("593287870e8409025900fbb2929e698265032a933e96b6e4c5277c74e1fb7015"));
const getTeamMembers = createServerFn({
  method: "POST"
}).handler(createSsrRpc("27f38323f5a8f60beae3ed33af644a3d0c19a306d0c851c31b40d92751c29b34"));
const getMyAssignments = createServerFn({
  method: "POST"
}).handler(createSsrRpc("e84e6d2db2b812879be8b49ee430996ce17268a8dbfb11012fafd1bd8dfce5fb"));
const getMyAppointments = createServerFn({
  method: "POST"
}).handler(createSsrRpc("5d97fca2e9fb72281a49bcf5f8b7c47035cd048e39a5994130236cd819496062"));
const getMyMessages = createServerFn({
  method: "POST"
}).handler(createSsrRpc("d50b22ea8bc3499776f9360fd8ff013a0f8cfb5cd8b32b53f29f25b65922145a"));
const getMyNotificationCounts = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ee4342a9f92b0ca9c8ba97cf34dca08b8423a995b366c0666e8590af349a502e"));
const checkDailyLimit = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c153c6f9d97b6ec247c501fa9cc10f2a1f7a19996ff1dfb211836fa0dd1fa6ca"));
const getSkillGaps = createServerFn({
  method: "POST"
}).handler(createSsrRpc("7aa6c6bf3d00934822d619178e6a2688cc840cbba0debbce10014029836c6741"));
const resetMyProgress = createServerFn({
  method: "POST"
}).handler(createSsrRpc("d71ed2c05491e732831296bfed5af0ddd2b8162ec0568bffb05ca3ea7c2bc949"));
const resetUserProgress = createServerFn({
  method: "POST"
}).handler(createSsrRpc("9733d655e8700c2dae7fd3b88b155bc8d16d8d7ebfec622dd443818434419500"));
const manager = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addSalesEntry,
  addSalesperson,
  assignAllSalespeople,
  changeSalespersonTier,
  checkDailyLimit,
  completeAssignment,
  createAssignment,
  deleteAssignment,
  deleteSalesEntry,
  getAssignments,
  getMyAppointments,
  getMyAssignments,
  getMyMessages,
  getMyNotificationCounts,
  getMyProgress,
  getSalesLog,
  getSkillGaps,
  getTeamCost,
  getTeamMembers,
  getTeamProgress,
  getUserProgress,
  markLessonComplete,
  markMessageRead,
  markMyLessonComplete,
  removeLessonComplete,
  removeMyLessonComplete,
  removeSalesperson,
  resetMyProgress,
  resetUserProgress,
  sendMessage
}, Symbol.toStringTag, { value: "Module" }));
const $$splitComponentImporter$2 = () => import("./index-B_htZyu5.js");
const Route$2 = createFileRoute("/training/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./_courseId-BfzvpwkV.js");
const Route$1 = createFileRoute("/training/$courseId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./preview-BZy4Qf25.js");
const Route = createFileRoute("/training/preview")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$m.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$n
});
const AccountRoute = Route$l.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$n
});
const AdminRoute = Route$k.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$n
});
const CheckoutRoute = Route$j.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$n
});
const ContactRoute = Route$i.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$n
});
const EmailRoute = Route$h.update({
  id: "/email",
  path: "/email",
  getParentRoute: () => Route$n
});
const InboxRoute = Route$g.update({
  id: "/inbox",
  path: "/inbox",
  getParentRoute: () => Route$n
});
const LoginRoute = Route$f.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$n
});
const PlannerRoute = Route$e.update({
  id: "/planner",
  path: "/planner",
  getParentRoute: () => Route$n
});
const PricingRoute = Route$d.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$n
});
const ProfileRoute = Route$c.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$n
});
const SalesLogRoute = Route$b.update({
  id: "/sales-log",
  path: "/sales-log",
  getParentRoute: () => Route$n
});
const StepsRoute = Route$a.update({
  id: "/steps",
  path: "/steps",
  getParentRoute: () => Route$n
});
const SupportRoute = Route$9.update({
  id: "/support",
  path: "/support",
  getParentRoute: () => Route$n
});
const BlogIndexRoute = Route$8.update({
  id: "/blog/",
  path: "/blog/",
  getParentRoute: () => Route$n
});
const BlogSlugRoute = Route$7.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$n
});
const ManagerIndexRoute = Route$6.update({
  id: "/manager/",
  path: "/manager/",
  getParentRoute: () => Route$n
});
const PurchaseSuccessRoute = Route$5.update({
  id: "/purchase/success",
  path: "/purchase/success",
  getParentRoute: () => Route$n
});
const SignupIndexRoute = Route$4.update({
  id: "/signup/",
  path: "/signup/",
  getParentRoute: () => Route$n
});
const SignupCompleteRoute = Route$3.update({
  id: "/signup/complete",
  path: "/signup/complete",
  getParentRoute: () => Route$n
});
const TrainingIndexRoute = Route$2.update({
  id: "/training/",
  path: "/training/",
  getParentRoute: () => Route$n
});
const TrainingCourseIdRoute = Route$1.update({
  id: "/training/$courseId",
  path: "/training/$courseId",
  getParentRoute: () => Route$n
});
const TrainingPreviewRoute = Route.update({
  id: "/training/preview",
  path: "/training/preview",
  getParentRoute: () => Route$n
});
const rootRouteChildren = {
  IndexRoute,
  AccountRoute,
  AdminRoute,
  CheckoutRoute,
  ContactRoute,
  EmailRoute,
  InboxRoute,
  LoginRoute,
  PlannerRoute,
  PricingRoute,
  ProfileRoute,
  SalesLogRoute,
  StepsRoute,
  SupportRoute,
  BlogSlugRoute,
  PurchaseSuccessRoute,
  SignupCompleteRoute,
  TrainingCourseIdRoute,
  TrainingPreviewRoute,
  BlogIndexRoute,
  ManagerIndexRoute,
  SignupIndexRoute,
  TrainingIndexRoute
};
const routeTree = Route$n._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: () => /* @__PURE__ */ jsx("p", { children: "Not found" })
  });
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  getTokenPayload as A,
  Route$1 as B,
  translations as C,
  manager as D,
  router as E,
  LanguageSwitcher as L,
  Route$j as R,
  getMyAppointments as a,
  getMyMessages as b,
  getTeamMembers as c,
  getTeamCost as d,
  getSalesLog as e,
  getAssignments as f,
  getMyAssignments as g,
  addSalesperson as h,
  removeSalesperson as i,
  addSalesEntry as j,
  deleteSalesEntry as k,
  createAssignment as l,
  deleteAssignment as m,
  Route$7 as n,
  getTeamProgress as o,
  resetUserProgress as p,
  getUserProgress as q,
  resetMyProgress as r,
  sendMessage as s,
  getSkillGaps as t,
  useTranslation as u,
  checkDailyLimit as v,
  removeLessonComplete as w,
  markLessonComplete as x,
  changeSalespersonTier as y,
  isTokenValid as z
};
