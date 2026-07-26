import { jsxs, jsx } from "react/jsx-runtime";
import { u as useTranslation, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { c as courses } from "./courses-CY9yjTRv.js";
import { Q as QuizQuestion } from "./quiz-question-Bg5dlKMU.js";
import "@tanstack/react-router";
import "react";
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
const previewQuestions = [{
  courseName: "10 Steps to the Sale",
  question: `**Q1:** What is the most important goal of the greeting?
A) To qualify the customer's budget immediately
B) To build trust and make a positive first impression
C) To show the customer every vehicle on the lot
D) To get the customer's contact information
*Answer: B — The greeting is about building trust and making a positive first impression. Qualifying, showing vehicles, and gathering contact info come later in the process.*`
}, {
  courseName: "10 Steps of the Sale — Part 2",
  question: `**Q1:** What percentage of customers who take a test drive are more likely to buy?
A) 50%
B) 70%
C) 90%
D) 30%
*Answer: B — Customers who take a test drive are 70% more likely to buy. The test drive creates an emotional connection that's essential for closing the deal.*`
}, {
  courseName: "Advanced Closing Strategies",
  question: `**Q1:** When handling a negotiation, what is your most powerful tool?
A) A lower price
B) Silence
C) Product knowledge
D) A strong personality
*Answer: B — Silence is your most powerful negotiation tool. After presenting the number, stay silent. The person who speaks first typically concedes.*`
}, {
  courseName: "Digital Marketing for Dealers",
  question: `**Q1:** What is the most important metric for measuring marketing effectiveness?
A) Number of likes
B) Cost per lead
C) Follower count
D) Post impressions
*Answer: B — Cost per lead is the most important metric because it directly ties marketing spend to actual potential customers.*`
}, {
  courseName: "Customer Experience Excellence",
  question: `**Q1:** How quickly should you respond to an online inquiry?
A) Within 1 hour
B) Within 24 hours
C) Within 5 minutes
D) By end of business day
*Answer: C — Responding within 5 minutes dramatically increases the chance of converting an online inquiry into a showroom visit.*`
}, {
  courseName: "5-Minute Sales Drills",
  question: `**Q1:** A customer walks in and heads straight to a vehicle. You should:
A) Let them browse alone
B) Walk up and ask "Can I help you?"
C) Greet them warmly, then give them space
*Answer: C — Acknowledge them, then give them space.*`
}];
function TrainingPreview() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-6 md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 hover:text-white", children: t("nav.training") }),
        /* @__PURE__ */ jsx("a", { href: "/steps", className: "text-sm text-gray-400 hover:text-white", children: "Steps of the Sale" }),
        /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "text-sm text-gray-400 hover:text-white", children: t("nav.pricing") }),
        /* @__PURE__ */ jsx("a", { href: "/login", className: "rounded-lg bg-[#e63946] px-4 py-2 text-sm font-medium text-white hover:bg-[#c1121f]", children: "Sign In" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-6 py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
          "Free Preview"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-4 text-4xl font-extrabold text-white sm:text-5xl", children: [
          "Try a Sample ",
          /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "Quiz" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-400", children: "One question from each of our 6 training courses. See the quality and depth of our content — no account required." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [
          /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f] transition-colors", children: "Create Account — Full Access" }),
          /* @__PURE__ */ jsx("a", { href: "/training", className: "rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors", children: t("nav.training") })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: previewQuestions.map((pq, idx) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#e63946] text-xs font-bold text-white", children: idx + 1 }),
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: pq.courseName })
        ] }),
        /* @__PURE__ */ jsx(QuizQuestion, { content: pq.question })
      ] }, idx)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 text-center rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-8", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white", children: [
          "Want all ",
          courses.reduce((s, c) => s + c.lessons, 0),
          " lessons and 40+ quiz questions?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Create an account to unlock the full training catalog — 6 courses, detailed guides, interactive quizzes, and progress tracking." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-center gap-4", children: [
          /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f] transition-colors", children: "Create Free Account" }),
          /* @__PURE__ */ jsx("a", { href: "/login", className: "rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors", children: "Sign In" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-[#1a2d4a]/50 bg-[#0a1628] py-8 mt-auto", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl px-6 text-center", children: /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-6 py-2 text-sm font-medium text-white hover:bg-[#c1121f]", children: "Sign Up for Full Access" }) }) })
  ] });
}
export {
  TrainingPreview as component
};
