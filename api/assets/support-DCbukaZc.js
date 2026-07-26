import { jsxs, jsx } from "react/jsx-runtime";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import { useState } from "react";
import { u as useTranslation } from "./router-jD0MEXbQ.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
const submitTicket = createServerFn({
  method: "POST"
}).handler(createSsrRpc("f5173620d55d830dc2de8cfa624dba56e5ea52c5dc1a060d5d038008ea2b7835"));
function SupportPage() {
  const {
    t
  } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    setStatus("loading");
    try {
      const result = await submitTicket({
        data: {
          name,
          email,
          subject,
          message
        }
      });
      if (result.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        try {
          const {
            sendEmail
          } = await import("./email-cxXaOx6X.js");
          await sendEmail({
            to: [email],
            subject: "Support Ticket Received",
            body: `Hi ${name},

We've received your support ticket.

Subject: ${subject}

We'll review it and get back to you within 24 hours.

- Champion Sales Training Support`
          });
        } catch {
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-4xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Home" })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-4xl px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-lg", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: t("support.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: t("support.subtitle") }),
      status === "success" ? /* @__PURE__ */ jsxs("div", { className: "mt-10 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-xl font-bold text-white", children: t("support.success") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: t("support.successDesc") })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-10 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("support.name") }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "John Doe" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("support.email") }),
            /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "you@dealership.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("support.subject") }),
          /* @__PURE__ */ jsx("input", { type: "text", required: true, value: subject, onChange: (e) => setSubject(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "How can we help?" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("support.message") }),
          /* @__PURE__ */ jsx("textarea", { required: true, rows: 5, value: message, onChange: (e) => setMessage(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "Tell us more about your issue..." })
        ] }),
        status === "error" && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]", children: t("support.error") }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: status === "loading", className: "btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50", children: status === "loading" ? t("support.sending") : t("support.submit") })
      ] })
    ] }) })
  ] });
}
export {
  SupportPage as component
};
