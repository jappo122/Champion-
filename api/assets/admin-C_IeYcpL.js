import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import { g as getAuthInfo } from "./auth-guard-DDzkafwD.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
const upgradeDemoAccounts = createServerFn({
  method: "POST"
}).handler(createSsrRpc("51a6ee04e2ec0e00570fb8699480d88a0654b4f3b1a6e02db39797c9a704fb5c"));
function AdminPage() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("auth-token");
    if (stored) {
      setToken(stored);
      getAuthInfo({
        data: {
          token: stored
        }
      }).then((res) => {
        if (res.authenticated) {
          const adminEmails = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
          if (res.user?.id === 1 || adminEmails.includes(res.user?.email || "")) {
            setIsAdmin(true);
          }
        }
        setInitializing(false);
      });
    } else {
      setInitializing(false);
    }
  }, []);
  async function handleUpgrade() {
    if (!token) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await upgradeDemoAccounts({
        data: {
          token
        }
      });
      if (res.success) {
        setResult("✅ Done!\n" + (res.results || []).join("\n"));
      } else {
        setResult("❌ " + (res.error || "Unknown error"));
      }
    } catch (e) {
      setResult("❌ " + (e.message || "Request failed"));
    }
    setLoading(false);
  }
  if (initializing) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "Loading..." }) });
  }
  if (!token) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white mb-4", children: "Admin" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-6", children: "Please sign in to access the admin panel." }),
      /* @__PURE__ */ jsx("a", { href: "/login", className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition", children: "Sign In" })
    ] }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white mb-4", children: "Access Denied" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "This page is restricted to owner accounts." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Admin Panel" }),
    /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-8", children: "Manage demo accounts and platform settings." }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0f1d32] rounded-xl border border-slate-700 p-6 mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "Demo Accounts" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Upgrade known demo accounts to the Premium tier for full platform access. This affects: owner@champion.com, jappo122@gmail.com, floydsandersjr@yahoo.com" }),
      /* @__PURE__ */ jsx("button", { onClick: handleUpgrade, disabled: loading, className: `px-6 py-3 rounded-lg font-medium transition ${loading ? "bg-slate-600 text-slate-300 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`, children: loading ? "Upgrading..." : "Upgrade Demo Accounts to Premium" }),
      result && /* @__PURE__ */ jsx("pre", { className: "mt-4 p-4 bg-[#0a1628] rounded-lg text-sm text-slate-300 whitespace-pre-wrap", children: result })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0f1d32] rounded-xl border border-slate-700 p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "How It Works" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-400 text-sm", children: [
        "Demo accounts are automatically recognized by ",
        /* @__PURE__ */ jsx("code", { className: "text-blue-400", children: "getAuthInfo" }),
        " in",
        " ",
        /* @__PURE__ */ jsx("code", { className: "text-blue-400", children: "src/lib/auth-guard.ts" }),
        ". Their tier is overridden to",
        " ",
        /* @__PURE__ */ jsx("code", { className: "text-green-400", children: "premium" }),
        " regardless of their subscription record, giving them full access to all tier-gated courses including Advanced Closing Part 2 and Senior Sales Training."
      ] })
    ] })
  ] }) });
}
export {
  AdminPage as component
};
