import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { n as Route, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { a as getBlogPost, g as getBlogPosts } from "./blog-B_nmuHou.js";
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
function BlogPostPage() {
  const params = Route.useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {
    const p = getBlogPost(params.slug);
    setPost(p);
    const all = getBlogPosts().filter((bp) => bp.slug !== params.slug);
    setRecentPosts(all);
  }, [params.slug]);
  if (!post) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: "Post not found" }),
      /* @__PURE__ */ jsx("a", { href: "/blog", className: "mt-4 inline-block text-[#e63946] hover:underline", children: "Back to Blog" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Blog" }),
        /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Pricing" }),
        /* @__PURE__ */ jsx("a", { href: "/login", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Sign In" }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary text-sm", children: "Get Started" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-5xl px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("article", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("a", { href: "/blog", className: "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#e63946] transition-colors mb-6", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
          "Back to Blog"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-500 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]", children: "Article" }),
          /* @__PURE__ */ jsx("span", { children: post.date })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-white sm:text-4xl leading-tight", children: post.title }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-6", children: post.sections.map((section, i) => /* @__PURE__ */ jsx(BlogSectionRenderer, { section }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-6 sm:p-8", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "Ready to master the sales process?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Join Champion Sales Training & Events and get access to our complete training library, interactive assessments, and manager coaching tools." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-4", children: [
            /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary text-sm", children: "Start Training" }),
            /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "btn-secondary text-sm", children: "View Plans" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 sticky top-24", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4", children: "More Articles" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: recentPosts.map((rp) => /* @__PURE__ */ jsxs("a", { href: `/blog/${rp.slug}`, className: "group block", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white group-hover:text-[#e63946] transition-colors", children: rp.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: rp.date })
        ] }, rp.slug)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 border-t border-[#1a2d4a] pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3", children: "Start Learning" }),
          /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-primary text-sm w-full text-center block", children: "Get Started Free" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-[#1a2d4a]/50 py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "hover:text-white transition-colors", children: "Home" }),
        /* @__PURE__ */ jsx("a", { href: "/training", className: "hover:text-white transition-colors", children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/blog", className: "hover:text-white transition-colors", children: "Blog" }),
        /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "hover:text-white transition-colors", children: "Pricing" }),
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
function BlogSectionRenderer({
  section
}) {
  switch (section.type) {
    case "heading":
      return /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mt-10 mb-4", children: section.text });
    case "subheading":
      return /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#f77f00] mt-6 mb-2", children: section.text });
    case "text":
      return /* @__PURE__ */ jsx("p", { className: "leading-relaxed text-gray-300", children: section.text });
    case "list":
      return /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: (section.items || []).map((item, j) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-300", children: [
        /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }),
        item
      ] }, j)) });
    case "quote":
      return /* @__PURE__ */ jsx("div", { className: "border-l-4 border-[#e63946] bg-[#1a2d4a]/50 rounded-r-lg p-4 italic text-gray-300", children: section.text });
    case "separator":
      return /* @__PURE__ */ jsx("hr", { className: "border-[#1a2d4a] my-8" });
    default:
      return null;
  }
}
export {
  BlogPostPage as component
};
