import { jsxs, jsx } from "react/jsx-runtime";
import { L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
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
function SalesLogPage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("a", { href: "/manager", className: "text-sm text-gray-400 hover:text-white", children: "Manager Dashboard" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-sm text-gray-400 hover:text-white", children: "Profile" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-5xl px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold text-white", children: "Sales Log" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: "Track your sales, goals, and gross profit. This feature is available in the manager dashboard for Premium subscribers." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [
        /* @__PURE__ */ jsx("a", { href: "/manager", className: "btn-primary text-sm", children: "Go to Manager Dashboard" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "btn-secondary text-sm", children: "View Subscription" })
      ] })
    ] }) })
  ] });
}
export {
  SalesLogPage as component
};
