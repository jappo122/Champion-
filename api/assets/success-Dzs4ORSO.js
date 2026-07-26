import { jsx, jsxs } from "react/jsx-runtime";
import { u as useTranslation } from "./router-jD0MEXbQ.js";
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
function PurchaseSuccess() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh flex-col items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
    /* @__PURE__ */ jsx("h1", { className: "mt-6 text-3xl font-bold text-white", children: t("purchase.success") }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: t("purchase.successDesc") }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-lg border border-[#1a2d4a] bg-[#0d1f35] p-4 text-sm text-gray-400", children: t("purchase.emailSent") }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center", children: [
      /* @__PURE__ */ jsx("a", { href: "/login", className: "btn-primary text-sm", children: t("auth.signIn") }),
      /* @__PURE__ */ jsx("a", { href: "/training", className: "btn-secondary text-sm", children: t("training.start") })
    ] })
  ] }) });
}
export {
  PurchaseSuccess as component
};
