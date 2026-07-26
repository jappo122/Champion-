import { jsx, jsxs } from "react/jsx-runtime";
import { u as useTranslation, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { useState, useEffect } from "react";
import { g as getSession, u as updateProfile } from "./auth-EYtabqPq.js";
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
function AccountPage() {
  const {
    t
  } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    getSession({
      data: {
        token
      }
    }).then((result) => {
      if (result.user) {
        setUser(result.user);
        setName(result.user.name || "");
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    });
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("salesdrive_token");
    window.location.href = "/";
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const result = await updateProfile({
        data: {
          token,
          name
        }
      });
      if (result.success) {
        setSaved(true);
        setUser(result.user);
        setTimeout(() => setSaved(false), 3e3);
      } else {
        setError(result.error || "Failed to update");
      }
    } catch {
      setError("Something went wrong");
    }
    setSaving(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" }) });
  }
  if (!user) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-4xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(LanguageSwitcher, {}),
        /* @__PURE__ */ jsx("button", { onClick: handleLogout, className: "text-sm text-gray-400 transition-colors hover:text-[#e63946]", children: t("account.signOut") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-6 py-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: t("account.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: t("account.subtitle") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-8 md:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 px-4 py-2 text-sm font-medium text-[#e63946]", children: t("account.profile") }) }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: t("account.profileInfo") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-400", children: t("account.profileDesc") }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "mt-6 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.email") }),
                /* @__PURE__ */ jsx("input", { type: "email", value: user.email, disabled: true, className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-gray-500 outline-none" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: t("account.emailUnchangeable") })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.name") }),
                /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]", placeholder: "Your full name" })
              ] }),
              error && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]", children: error }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("button", { type: "submit", disabled: saving, className: "btn-primary disabled:cursor-not-allowed disabled:opacity-50", children: saving ? t("account.saving") : t("account.save") }),
                saved && /* @__PURE__ */ jsx("span", { className: "text-sm text-green-500", children: t("account.saved") })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: t("account.details") }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-[#1a2d4a] pb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: t("account.memberSince") }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white", children: "Just now" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-[#1a2d4a] pb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: t("account.plan") }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-white", children: "Free (waitlist)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: t("account.userId") }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-white", children: [
                  "#",
                  user.id
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AccountPage as component
};
