import { jsx, jsxs } from "react/jsx-runtime";
import { u as useTranslation, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { useState } from "react";
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
function LoginPage() {
  const {
    t
  } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const result = await res.json();
      if (result.success && result.token) {
        localStorage.setItem("salesdrive_token", result.token);
        window.location.href = "/profile";
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8 text-center", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
      /* @__PURE__ */ jsx(LanguageSwitcher, {}),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: t("auth.signIn") }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: "Sign in to your account to continue." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.email") }),
          /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "you@dealership.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.password") }),
          /* @__PURE__ */ jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "Your password" })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]", children: error }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50", children: loading ? t("auth.signingIn") : t("auth.signIn") })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-400", children: [
        t("auth.noAccount"),
        " ",
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "text-[#e63946] hover:underline", children: t("auth.signUp") })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-xs text-gray-600", children: [
        "After signing in, if you don't see our emails, check your spam folder. Add ",
        /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "champion-sales-training-events-f80d0630@ctomail.io" }),
        " to your contacts."
      ] })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
