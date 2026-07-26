import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { g as getBlogPosts } from "./blog-B_nmuHou.js";
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
function BlogListing() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-sm font-medium text-white", children: "Blog" }),
        /* @__PURE__ */ jsx("a", { href: "/pricing", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Pricing" }),
        /* @__PURE__ */ jsx("a", { href: "/login", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Sign In" }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary text-sm", children: "Get Started" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-[#1a2d4a]/50 py-16 sm:py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6 text-center", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
        "Blog"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl", children: [
        "Sales Training ",
        /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "Insights" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-400", children: "Expert advice, proven strategies, and actionable tips to master automotive sales and grow your career." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 sm:py-20", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl px-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-8", children: posts.map((post) => /* @__PURE__ */ jsxs("a", { href: `/blog/${post.slug}`, className: "group block rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-500 mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]", children: "Article" }),
        /* @__PURE__ */ jsx("span", { children: post.date })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white group-hover:text-[#e63946] transition-colors sm:text-2xl", children: post.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 leading-relaxed text-gray-400 line-clamp-3", children: post.excerpt }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-2 text-sm font-medium text-[#e63946]", children: [
        "Read More",
        /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
      ] })
    ] }, post.slug)) }) }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-[#1a2d4a]/50 py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "hover:text-white transition-colors", children: "Home" }),
        /* @__PURE__ */ jsx("a", { href: "/training", className: "hover:text-white transition-colors", children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/blog", className: "hover:text-white transition-colors", children: "Blog" }),
        /* @__PURE__ */ jsx("a", { href: "/pricing", className: "hover:text-white transition-colors", children: "Pricing" }),
        /* @__PURE__ */ jsx("a", { href: "/support", className: "hover:text-white transition-colors", children: "Support" }),
        /* @__PURE__ */ jsx("a", { href: "/login", className: "hover:text-white transition-colors", children: "Sign In" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-600", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Champion Sales Training & Events. All rights reserved."
      ] })
    ] }) })
  ] });
}
export {
  BlogListing as component
};
