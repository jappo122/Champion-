import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { g as getAuthInfo } from "./auth-guard-DDzkafwD.js";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
createServerFn({
  method: "POST"
}).handler(createSsrRpc("41d202b084b14e3e75d708c55ad99d40b5f6ae906cd75aa3cef2dbbbe22c3acc"));
const getInboxEmails = createServerFn({
  method: "POST"
}).handler(createSsrRpc("19fd05a3b414584d5d5f8e94ca693f242ca9535f045dc61024638b4bcb5eddb0"));
const getInboxEmail = createServerFn({
  method: "POST"
}).handler(createSsrRpc("4d95adaa58744130183a772a48ea1cb1f3a58c6c622c4f9cb1a7611c474dac26"));
const markInboxRead = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c110eb88eecc149966720d75536ffe1431d75c2d4c05296822de2be4990e74e4"));
const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
const BUSINESS_EMAIL = "champion-sales-training-events-f80d0630@ctomail.io";
function InboxPage() {
  const [token, setToken] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [mobileView, setMobileView] = useState("list");
  useEffect(() => {
    const stored = localStorage.getItem("auth-token");
    if (!stored) {
      setInitializing(false);
      return;
    }
    setToken(stored);
    (async () => {
      const res = await getAuthInfo({
        data: {
          token: stored
        }
      });
      if (res.authenticated && res.user) {
        if (res.user.id === 1 || DEMO_EMAILS.includes(res.user.email?.toLowerCase() || "")) {
          setIsDemo(true);
          const emailList = await getInboxEmails({
            data: {
              token: stored
            }
          });
          setEmails(emailList);
        }
      }
      setInitializing(false);
    })();
  }, []);
  const unreadCount = emails.filter((e) => !e.is_read).length;
  async function handleSelectEmail(email) {
    if (!token) return;
    setLoadingEmail(true);
    setMobileView("detail");
    try {
      const full = await getInboxEmail({
        data: {
          token,
          id: email.id
        }
      });
      setSelectedEmail(full);
      if (!email.is_read) {
        await markInboxRead({
          data: {
            token,
            id: email.id
          }
        });
        setEmails((prev) => prev.map((e) => e.id === email.id ? {
          ...e,
          is_read: true
        } : e));
      }
    } catch (err) {
      console.error("Failed to load email:", err);
    }
    setLoadingEmail(false);
  }
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  if (initializing) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin h-8 w-8 border-2 border-[#e63946] border-t-transparent rounded-full" }) });
  }
  if (!token) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white mb-4", children: "Inbox" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-6", children: "Please sign in to access the inbox." }),
      /* @__PURE__ */ jsx("a", { href: "/login", className: "px-6 py-3 bg-[#e63946] text-white rounded-lg hover:bg-[#c1121f] transition font-semibold", children: "Sign In" })
    ] }) });
  }
  if (!isDemo) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1628] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20 mb-4", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white mb-2", children: "Access Denied" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "The inbox is only available to account owners." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-[#0f1d32] border-b border-[#1a2d4a] px-4 py-3 md:px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-white", children: "Inbox" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: BUSINESS_EMAIL })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "bg-[#e63946] text-white text-xs font-semibold px-2.5 py-1 rounded-full", children: [
        unreadCount,
        " unread"
      ] })
    ] }) }),
    mobileView === "detail" && /* @__PURE__ */ jsx("div", { className: "md:hidden px-4 pt-3", children: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setMobileView("list");
      setSelectedEmail(null);
    }, className: "flex items-center gap-2 text-sm text-slate-400 hover:text-white transition", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
      "Back to inbox"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex h-[calc(100vh-80px)]", children: [
      /* @__PURE__ */ jsx("div", { className: `${mobileView === "detail" ? "hidden md:block" : "block"} w-full md:w-96 lg:w-[420px] border-r border-[#1a2d4a] overflow-y-auto`, children: emails.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full px-4", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 text-slate-600 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm", children: "No emails" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-xs mt-1", children: "Emails sent from your business inbox will appear here." })
      ] }) : emails.map((email) => /* @__PURE__ */ jsxs("button", { onClick: () => handleSelectEmail(email), className: `w-full text-left px-4 py-3 border-b border-[#1a2d4a] transition hover:bg-[#0f1d32] ${selectedEmail?.id === email.id ? "bg-[#0f1d32] border-l-2 border-l-[#e63946]" : ""} ${!email.is_read ? "bg-[#0d1f35]/60" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${email.direction === "outbound" ? "bg-blue-600/20 text-blue-400" : "bg-green-600/20 text-green-400"}`, children: (email.from_name || email.from_email).charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: `text-sm truncate ${!email.is_read ? "text-white font-semibold" : "text-slate-300"}`, children: email.from_name || email.from_email }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 flex-shrink-0", children: formatDate(email.received_at) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: `text-sm truncate mt-0.5 ${!email.is_read ? "text-white font-medium" : "text-slate-400"}`, children: email.subject }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 truncate mt-0.5", children: email.preview })
          ] })
        ] }),
        !email.is_read && /* @__PURE__ */ jsx("div", { className: "ml-12 mt-1", children: /* @__PURE__ */ jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-[#e63946]" }) })
      ] }, email.id)) }),
      /* @__PURE__ */ jsx("div", { className: `${mobileView === "list" ? "hidden md:flex" : "flex"} flex-1 flex-col overflow-y-auto`, children: loadingEmail ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx("div", { className: "animate-spin h-6 w-6 border-2 border-[#e63946] border-t-transparent rounded-full" }) }) : selectedEmail ? /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white mb-4", children: selectedEmail.subject }),
        /* @__PURE__ */ jsx("div", { className: "bg-[#0f1d32] rounded-lg border border-[#1a2d4a] p-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "From:" }),
          /* @__PURE__ */ jsxs("span", { className: "text-slate-300", children: [
            selectedEmail.from_name ? `${selectedEmail.from_name} ` : "",
            /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
              "<",
              selectedEmail.from_email,
              ">"
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "To:" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: selectedEmail.to_emails.join(", ") }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Date:" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: new Date(selectedEmail.received_at).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
          }) }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Direction:" }),
          /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${selectedEmail.direction === "outbound" ? "text-blue-400" : "text-green-400"}`, children: selectedEmail.direction === "outbound" ? "Outbound" : "Inbound" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed", children: selectedEmail.body })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-slate-500", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 mb-4 text-slate-700", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Select an email to read" })
      ] }) })
    ] })
  ] });
}
export {
  InboxPage as component
};
