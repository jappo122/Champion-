import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { sendEmail } from "./email-cxXaOx6X.js";
import "./createSsrRpc-l1y8KE69.js";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const handleSend = async (e) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    setSending(true);
    setError("");
    try {
      const result = await sendEmail({
        data: {
          to: to.trim(),
          subject: subject.trim(),
          body: body.trim()
        }
      });
      if (result.success) {
        setSent(true);
        setTo("");
        setSubject("");
        setBody("");
      } else {
        setError("Failed to send email. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setSending(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a] bg-[#0d1f35]/60 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "text-xl font-bold text-white", children: [
        "Champion",
        /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "Sales" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6 text-sm", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-gray-400 transition-colors hover:text-white", children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-gray-400 transition-colors hover:text-white", children: "Profile" }),
        /* @__PURE__ */ jsx("a", { href: "/email", className: "font-medium text-[#e63946]", children: "Email" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white sm:text-4xl", children: "Send Email" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Compose and send emails to your contacts." })
      ] }),
      sent ? /* @__PURE__ */ jsxs("div", { className: "card p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-green-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white", children: "Email Sent!" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Your email has been sent successfully." }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSent(false), className: "btn-primary mt-6", children: "Send Another" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSend, className: "card space-y-6 p-6 sm:p-8", children: [
        error && /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-red-500/30 bg-red-500/10 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-400", children: error }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "to", className: "mb-2 block text-sm font-medium text-gray-300", children: [
            "To ",
            /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("input", { id: "to", type: "email", value: to, onChange: (e) => setTo(e.target.value), placeholder: "recipient@example.com", required: true, className: "w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "subject", className: "mb-2 block text-sm font-medium text-gray-300", children: [
            "Subject ",
            /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("input", { id: "subject", type: "text", value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Email subject line", required: true, className: "w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "body", className: "mb-2 block text-sm font-medium text-gray-300", children: [
            "Message ",
            /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("textarea", { id: "body", rows: 8, value: body, onChange: (e) => setBody(e.target.value), placeholder: "Write your email message here...", required: true, className: "w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946] resize-y" })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: sending || !to.trim() || !subject.trim() || !body.trim(), className: "btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed", children: sending ? "Sending..." : "Send Email" })
      ] })
    ] })
  ] });
}
export {
  EmailPage as component
};
