import { jsx, jsxs } from "react/jsx-runtime";
import { u as useTranslation, z as isTokenValid, A as getTokenPayload, g as getMyAssignments, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { useState, useEffect } from "react";
import { c as courses } from "./courses-CY9yjTRv.js";
import { g as getAuthInfo } from "./auth-guard-DDzkafwD.js";
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
const levelColors = {
  Beginner: "bg-green-500/20 text-green-400",
  Intermediate: "bg-yellow-500/20 text-yellow-400",
  Advanced: "bg-[#e63946]/20 text-[#e63946]"
};
function TrainingCatalog() {
  const {
    t
  } = useTranslation();
  const [authState, setAuthState] = useState("loading");
  const [userTier, setUserTier] = useState(null);
  const [assignedCourseIds, setAssignedCourseIds] = useState(/* @__PURE__ */ new Set());
  const [completedLessons, setCompletedLessons] = useState(/* @__PURE__ */ new Set());
  const [completedPerCourse, setCompletedPerCourse] = useState(/* @__PURE__ */ new Map());
  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      setAuthState("unauthenticated");
      return;
    }
    if (!isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    const payload = getTokenPayload(token);
    setAuthState("authenticated");
    setUserTier(payload.role === "management" ? "premium" : "basic");
    getAuthInfo({
      data: {
        token
      }
    }).then((result) => {
      if (result.authenticated && result.user) {
        setUserTier(result.user.tier);
      }
    }).catch(() => {
    });
    getMyAssignments({
      data: {
        token
      }
    }).then((res) => {
      if (res.success) {
        const ids = new Set(res.assignments.filter((a) => !a.completed_at).map((a) => a.course_id));
        setAssignedCourseIds(ids);
      }
    }).catch(() => {
    });
    fetch("/api/my-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    }).then((r) => r.json()).then((data) => {
      if (data.success && data.completedLessons) {
        const ids = /* @__PURE__ */ new Set();
        const perCourse = /* @__PURE__ */ new Map();
        for (const item of data.completedLessons) {
          ids.add(item.lesson_id);
          perCourse.set(item.course_id, (perCourse.get(item.course_id) || 0) + 1);
        }
        setCompletedLessons(ids);
        setCompletedPerCourse(perCourse);
      }
    }).catch(() => {
    });
  }, []);
  if (authState === "loading") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" }) });
  }
  if (authState === "unauthenticated") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
      /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6", children: [
        /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
        ] }),
        /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-6 md:flex", children: [
          /* @__PURE__ */ jsx("a", { href: "/training/preview", className: "text-sm text-gray-400 hover:text-white", children: "Preview" }),
          /* @__PURE__ */ jsx("a", { href: "/steps", className: "text-sm text-gray-400 hover:text-white", children: "Steps of the Sale" }),
          /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "text-sm text-gray-400 hover:text-white", children: t("nav.pricing") }),
          /* @__PURE__ */ jsx("a", { href: "/login", className: "rounded-lg bg-[#e63946] px-4 py-2 text-sm font-medium text-white hover:bg-[#c1121f]", children: "Sign In" }),
          /* @__PURE__ */ jsx(LanguageSwitcher, {})
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
            "Professional Sales Training"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-4 text-4xl font-extrabold text-white sm:text-5xl", children: [
            "Automotive Sales ",
            /* @__PURE__ */ jsx("span", { className: "text-[#e63946]", children: "Training" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-400", children: "Master the complete 10-step automotive sales process — from the initial greeting to follow-up referrals. 11 courses, 68 lessons, 200+ quiz questions with 80% mastery threshold required to mark complete." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [
            /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-8 py-3 text-base font-semibold text-white hover:bg-[#c1121f] transition-colors", children: "Create Account — Start Free" }),
            /* @__PURE__ */ jsx("a", { href: "/login", className: "rounded-lg border border-[#1a2d4a] px-8 py-3 text-base font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors", children: "Sign In" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-4 text-sm text-gray-500", children: [
            /* @__PURE__ */ jsx("a", { href: "/training/preview", className: "text-[#e63946] hover:underline", children: "Try a sample quiz →" }),
            " ",
            "No account required"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: courses.map((course) => {
          const isGated = course.requiredTier && course.requiredTier !== "basic";
          return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 transition-all duration-200 hover:border-[#e63946]/30", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.levels]}`, children: course.levels }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                course.lessons,
                " lessons"
              ] }),
              isGated && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400", children: "Plus+" }),
              !isGated && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400", children: "All Plans" })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-white", children: course.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-gray-400", children: course.description.length > 140 ? course.description.slice(0, 140) + "..." : course.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              course.duration
            ] })
          ] }, course.id);
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 text-center rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "Ready to close more deals?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Join hundreds of automotive sales professionals who use Champion Sales Training every day." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-center gap-4", children: [
            /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f] transition-colors", children: "Get Started" }),
            /* @__PURE__ */ jsx("a", { href: "/training/preview", className: "rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors", children: "Try a Free Preview" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("footer", { className: "border-t border-[#1a2d4a]/50 bg-[#0a1628] py-8 mt-auto", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl px-6 text-center", children: /* @__PURE__ */ jsx("a", { href: "/signup", className: "rounded-lg bg-[#e63946] px-6 py-2 text-sm font-medium text-white hover:bg-[#c1121f]", children: "Sign In to Access Training" }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm font-medium text-white", children: t("nav.training") }),
        /* @__PURE__ */ jsx("a", { href: "/steps", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Steps of the Sale" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Profile" }),
        /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("nav.pricing") }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          localStorage.removeItem("salesdrive_token");
          window.location.href = "/";
        }, className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Sign Out" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-[#1a2d4a]/50 py-16 sm:py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 text-center", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
        t("training.badge")
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl", children: t("training.hero.title") }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-400", children: t("training.hero.subtitle") })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 sm:py-20", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6", children: /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-2", children: courses.map((course) => {
      const tierRank = {
        basic: 0,
        plus: 1,
        premium: 2
      };
      const requiredRank = course.requiredTier ? tierRank[course.requiredTier] ?? 0 : 0;
      const userRank = userTier ? tierRank[userTier] ?? 0 : 0;
      const isLocked = requiredRank > userRank;
      const isGated = course.requiredTier && course.requiredTier !== "basic";
      if (isLocked) {
        return /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 sm:p-8 opacity-75", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-amber-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: course.icon }) }) }),
          /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${levelColors[course.levels] || "bg-gray-500/20 text-gray-400"}`, children: course.levels }),
          /* @__PURE__ */ jsxs("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
            "Plus+"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-3 text-xl font-bold text-gray-400", children: course.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: course.subtitle }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 leading-relaxed text-gray-500 line-clamp-3", children: course.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-4 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              course.duration
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
              course.lessons,
              " ",
              t("training.lessons")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-amber-400", children: "Upgrade to Plus+ to unlock" }),
            /* @__PURE__ */ jsxs("a", { href: "/pricing", className: "mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#e63946] hover:underline", children: [
              "View Plans",
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
            ] })
          ] })
        ] }, course.id);
      }
      return /* @__PURE__ */ jsxs("a", { href: `/training/${course.id}`, className: "group relative overflow-hidden rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 sm:p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: course.icon }) }) }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${levelColors[course.levels] || "bg-gray-500/20 text-gray-400"}`, children: course.levels }),
        isGated && /* @__PURE__ */ jsx("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400", children: "Plus+" }),
        !isGated && /* @__PURE__ */ jsx("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400", children: "All Plans" }),
        completedPerCourse.has(course.id) && completedPerCourse.get(course.id) >= course.lessons && /* @__PURE__ */ jsx("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400", children: "✓ Complete" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 text-xl font-bold text-white group-hover:text-[#e63946] transition-colors", children: course.title }),
        assignedCourseIds.has(course.id) && /* @__PURE__ */ jsxs("span", { className: "mt-1 inline-flex items-center gap-1 rounded-full bg-[#e63946]/10 px-2 py-0.5 text-[10px] font-medium text-[#e63946]", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }),
          "Assigned by Manager"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: course.subtitle }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 leading-relaxed text-gray-400 line-clamp-3", children: course.description }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-4 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            course.duration
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
            course.lessons,
            " ",
            t("training.lessons")
          ] })
        ] }),
        completedPerCourse.has(course.id) && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 mb-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Progress" }),
            /* @__PURE__ */ jsxs("span", { children: [
              completedPerCourse.get(course.id),
              "/",
              course.lessons,
              " lessons"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-1.5 rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: "h-1.5 rounded-full bg-green-500 transition-all duration-300", style: {
            width: `${Math.round((completedPerCourse.get(course.id) || 0) / course.lessons * 100)}%`
          } }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-2 text-sm font-medium text-[#e63946]", children: [
          t("training.start"),
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
        ] })
      ] }, course.id);
    }) }) }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-[#1a2d4a]/50 py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 text-center text-sm text-gray-600", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Champion Sales Training & Events. ",
      t("footer.copyright")
    ] }) })
  ] });
}
export {
  TrainingCatalog as component
};
