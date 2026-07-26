import { jsxs, jsx } from "react/jsx-runtime";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import { useState } from "react";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
const submitContactForm = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c3804d43ea11a75535ebb5ae9e76d1efb9734c08a9487988e3b78f015fb81075"));
function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wantsCallback, setWantsCallback] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) return;
    setStatus("loading");
    try {
      const result = await submitContactForm({
        data: {
          name,
          email,
          phone,
          wantsCallback,
          subject,
          description
        }
      });
      if (result.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setWantsCallback(false);
        setSubject("");
        setDescription("");
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
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Home" }),
        /* @__PURE__ */ jsx("a", { href: "/support", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Support" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-4xl px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: "Contact Us" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Have a question about our training platform, pricing, or need help getting started? We're here to help." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }) }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 text-lg font-semibold text-white", children: "Sales Department" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: /* @__PURE__ */ jsx("a", { href: "mailto:cstrainingpros@yahoo.com", className: "text-[#e63946] hover:underline", children: "cstrainingpros@yahoo.com" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Contact our sales department via email 24/7. You'll receive a response within 48 hours. Usually a sales person will reach out and call you right away if you provide a phone number." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-blue-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" }) }) }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 text-lg font-semibold text-white", children: "Support" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-400", children: [
            "Need help with the platform? Visit our",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/support", className: "text-blue-400 hover:underline", children: "Support page" }),
            " ",
            "to submit a ticket. Our support team will respond within 24 hours."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white", children: "Send Us a Message" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Fill out the form below and we'll get back to you as soon as possible." }),
        status === "success" ? /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-xl border border-[#1a2d4a] bg-[#0a1628] p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "mt-4 text-xl font-bold text-white", children: "Message Sent!" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-gray-400", children: [
            "We've received your message and will get back to you within 48 hours.",
            wantsCallback && " A team member will call you at the number you provided."
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setStatus("idle"), className: "mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1a2d4a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a4a6a]", children: "Send Another Message" })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-300", children: [
                "Name ",
                /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
              ] }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "John Doe" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-300", children: [
                "Email ",
                /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
              ] }),
              /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "you@dealership.com" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-300", children: [
              "Phone Number ",
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "(555) 123-4567" }),
            /* @__PURE__ */ jsxs("label", { className: "mt-2 flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: wantsCallback, onChange: (e) => setWantsCallback(e.target.checked), className: "h-4 w-4 rounded border-[#1a2d4a] bg-[#0a1628] text-[#e63946] focus:ring-[#e63946]" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: "I'd like a call back" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-300", children: [
              "Subject ",
              /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: subject, onChange: (e) => setSubject(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "How can we help?" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-300", children: [
              "Description / Question / Concern ",
              /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("textarea", { required: true, rows: 5, value: description, onChange: (e) => setDescription(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "Tell us more about what you need..." })
          ] }),
          status === "error" && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]", children: "Something went wrong. Please try again or email us directly at cstrainingpros@yahoo.com." }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: status === "loading", className: "w-full rounded-lg bg-[#e63946] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#c1121f] disabled:cursor-not-allowed disabled:opacity-50", children: status === "loading" ? "Sending..." : "Send Message" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ContactPage as component
};
