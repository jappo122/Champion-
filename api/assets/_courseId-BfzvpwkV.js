import { jsx, jsxs } from "react/jsx-runtime";
import { u as useTranslation, B as Route, z as isTokenValid, A as getTokenPayload, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
import { useState, useEffect } from "react";
import { c as courses } from "./courses-CY9yjTRv.js";
import { g as getAuthInfo } from "./auth-guard-DDzkafwD.js";
import { Q as QuizQuestion } from "./quiz-question-Bg5dlKMU.js";
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
function renderMarkdown(md, lessonId) {
  const lines = md.split("\n");
  const nodes = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (line === "") {
      i++;
      continue;
    }
    if (line.startsWith("### ") && line.toLowerCase().includes("quick quiz")) {
      i++;
      const quizLines = [];
      while (i < lines.length) {
        const nextLine = lines[i].trimEnd();
        if (nextLine.startsWith("## ") || nextLine.startsWith("### ") || nextLine.startsWith("#### ")) {
          break;
        }
        if (nextLine !== "") {
          quizLines.push(nextLine);
        }
        i++;
      }
      nodes.push(
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(QuizQuestion, { content: quizLines.join("\n"), lessonId }) }, `quiz-${i}`)
      );
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        /* @__PURE__ */ jsx("h2", { className: "mt-8 text-xl font-bold text-white first:mt-0", children: renderInline(line.slice(3)) }, i)
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        /* @__PURE__ */ jsx("h3", { className: "mt-6 text-lg font-semibold text-white", children: renderInline(line.slice(4)) }, i)
      );
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      nodes.push(
        /* @__PURE__ */ jsx("h4", { className: "mt-4 text-base font-semibold text-white", children: renderInline(line.slice(5)) }, i)
      );
      i++;
      continue;
    }
    if (line.match(/^[-*]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trimEnd().match(/^[-*]\s/)) {
        const item = lines[i].trimEnd().replace(/^[-*]\s/, "");
        items.push(
          /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex items-start gap-3 text-sm text-gray-400",
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946]",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M5 13l4 4L19 7"
                      }
                    )
                  }
                ),
                renderInline(item)
              ]
            },
            `${i}-${items.length}`
          )
        );
        i++;
      }
      nodes.push(
        /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2", children: items }, `ul-${i}`)
      );
      continue;
    }
    if (line.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trimEnd().match(/^\d+\.\s/)) {
        const item = lines[i].trimEnd().replace(/^\d+\.\s/, "");
        items.push(
          /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex items-start gap-3 text-sm text-gray-400",
              children: [
                /* @__PURE__ */ jsx("span", { className: "mt-0.5 h-4 w-4 shrink-0 text-[#e63946] font-bold text-center", children: items.length + 1 }),
                renderInline(item)
              ]
            },
            `${i}-${items.length}`
          )
        );
        i++;
      }
      nodes.push(
        /* @__PURE__ */ jsx("ol", { className: "mt-3 space-y-2 list-none", children: items }, `ol-${i}`)
      );
      continue;
    }
    if (line.startsWith("**") && line.endsWith("**") && !line.includes("\n")) {
      nodes.push(
        /* @__PURE__ */ jsx("p", { className: "mt-3 font-semibold text-white", children: renderInline(line.slice(2, -2)) }, i)
      );
      i++;
      continue;
    }
    nodes.push(
      /* @__PURE__ */ jsx("p", { className: "mt-3 leading-relaxed text-gray-400", children: renderInline(line) }, i)
    );
    i++;
  }
  return nodes;
}
function renderInline(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(/* @__PURE__ */ jsx("strong", { children: match[2] }, match.index));
    } else if (match[3]) {
      parts.push(/* @__PURE__ */ jsx("em", { children: match[3] }, match.index));
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}
function CourseDetail() {
  const {
    t
  } = useTranslation();
  const params = Route.useParams();
  const course = courses.find((c) => c.id === params.courseId);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(/* @__PURE__ */ new Set());
  const [authToken, setAuthToken] = useState(null);
  const [authState, setAuthState] = useState("loading");
  const [userTier, setUserTier] = useState("basic");
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
    setAuthToken(token);
    setAuthState("authenticated");
    setUserTier(payload.role === "management" ? "premium" : "basic");
    if (course) {
      const fetchProgress = async () => {
        try {
          const {
            getMyProgress
          } = await import("./router-jD0MEXbQ.js").then((n) => n.D);
          const result = await getMyProgress({
            data: {
              token
            }
          });
          if (result.success) {
            const completed = new Set(result.completedLessons.map((cl) => cl.lesson_id));
            setCompletedLessons(completed);
          }
        } catch {
        }
      };
      fetchProgress();
    }
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
  }, [course]);
  const [markError, setMarkError] = useState("");
  const markComplete = async (lessonId) => {
    setMarkError("");
    if (!authToken || !course) return;
    const quizScores = window.__quizScores || {};
    const quizResult = quizScores[lessonId];
    const hasQuiz = quizResult && quizResult.total > 0;
    if (hasQuiz && !quizResult.allAnswered) {
      setMarkError(`Answer all ${quizResult.total} questions before marking complete.`);
      return;
    }
    if (hasQuiz) {
      const percent = Math.round(quizResult.correct / quizResult.total * 100);
      if (percent < 80) {
        setMarkError(`Score ${percent}% — need 80% or higher to mark this lesson complete.`);
        return;
      }
    }
    try {
      const res = await fetch("/api/mark-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: authToken,
          courseId: course.id,
          lessonId,
          quizResults: hasQuiz ? {
            correct: quizResult.correct,
            total: quizResult.total
          } : {
            correct: 0,
            total: 0
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCompletedLessons((prev) => new Set(prev).add(lessonId));
        setMarkError("");
      } else if (data.error) {
        setMarkError(data.error);
      }
    } catch {
    }
  };
  const currentLesson = course?.lessonsList?.[currentLessonIdx];
  if (authState === "loading") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" }) });
  }
  if (authState === "unauthenticated") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold text-white", children: "Sign in to access training" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: "Please sign in to view this course content." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [
        /* @__PURE__ */ jsx("a", { href: "/login", className: "btn-primary text-sm", children: "Sign In" }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "btn-secondary text-sm", children: "Create Account" })
      ] })
    ] }) });
  }
  if (!course) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: "Course not found" }),
      /* @__PURE__ */ jsx("a", { href: "/training", className: "mt-4 inline-block text-[#e63946]", children: t("training.backToCourses") })
    ] }) });
  }
  const tierRank = {
    basic: 0,
    plus: 1,
    premium: 2
  };
  const requiredRank = course.requiredTier ? tierRank[course.requiredTier] ?? 0 : 0;
  const userRank = userTier ? tierRank[userTier] ?? 0 : 0;
  if (requiredRank > userRank) {
    const tierName = course.requiredTier === "premium" ? "Premium" : "Plus+";
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f77f00]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-[#f77f00]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-2xl font-bold text-white", children: [
        tierName,
        " Subscription Required"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 text-gray-400", children: [
        course.title,
        " is available on the ",
        tierName,
        " tier and above. Upgrade your subscription to unlock this course and all its content."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [
        /* @__PURE__ */ jsx("a", { href: "/pricing", className: "rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f]", children: "View Plans" }),
        /* @__PURE__ */ jsx("a", { href: "/training", className: "rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50", children: "Back to Courses" })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 transition-colors hover:text-white", children: t("training.backToCourses") }),
        /* @__PURE__ */ jsx("a", { href: "/steps", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Steps of the Sale" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Profile" }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          localStorage.removeItem("salesdrive_token");
          window.location.href = "/";
        }, className: "text-sm text-gray-400 transition-colors hover:text-white", children: "Sign Out" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-7xl px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx("div", { className: "order-2 lg:order-1 lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider", children: t("training.courseContent") }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: course.lessonsList.map((lesson, idx) => {
          const isActive = idx === currentLessonIdx;
          const isCompleted = completedLessons.has(lesson.id);
          return /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentLessonIdx(idx), className: `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${isActive ? "bg-[#e63946]/20 text-white" : isCompleted ? "text-green-400 hover:bg-[#1a2d4a]/50" : "text-gray-400 hover:bg-[#1a2d4a]/50 hover:text-white"}`, children: [
            isCompleted ? /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 shrink-0 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) : isActive ? /* @__PURE__ */ jsx("div", { className: "h-4 w-4 shrink-0 rounded-full border-2 border-[#e63946]", children: /* @__PURE__ */ jsx("div", { className: "m-0.5 h-2.5 w-2.5 rounded-full bg-[#e63946]" }) }) : /* @__PURE__ */ jsx("div", { className: "h-4 w-4 shrink-0 rounded-full border border-gray-600" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: lesson.title }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs text-gray-500", children: lesson.duration })
          ] }, lesson.id);
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t border-[#1a2d4a] pt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { children: t("training.progress") }),
            /* @__PURE__ */ jsxs("span", { children: [
              completedLessons.size,
              " / ",
              course.lessonsList.length
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-[#e63946] transition-all duration-300", style: {
            width: `${completedLessons.size / course.lessonsList.length * 100}%`
          } }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "order-1 lg:order-2 lg:col-span-2", children: currentLesson ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500 mb-4", children: [
          /* @__PURE__ */ jsx("span", { children: t("training.badge") }),
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxs("span", { children: [
            t("training.lessons"),
            " ",
            currentLessonIdx + 1,
            " of ",
            course.lessonsList.length
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white sm:text-3xl", children: currentLesson.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 leading-relaxed text-gray-400", children: currentLesson.description }),
        renderMarkdown(currentLesson.content, currentLesson.id),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex items-center justify-between border-t border-[#1a2d4a] pt-6", children: [
          markError && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-400", children: markError }) }),
          /* @__PURE__ */ jsx("div", { children: completedLessons.has(currentLesson.id) ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-[#e63946]", children: [
            /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
            t("training.completed")
          ] }) : /* @__PURE__ */ jsx("button", { onClick: () => markComplete(currentLesson.id), className: "btn-primary text-sm", children: t("training.markComplete") }) }),
          !completedLessons.has(currentLesson.id) && (() => {
            const quizScores = typeof window !== "undefined" ? window.__quizScores || {} : {};
            const qr = quizScores[currentLesson.id];
            const hasQuiz = qr && qr.total > 0;
            if (!hasQuiz) return null;
            if (!qr.allAnswered) {
              return /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-gray-500", children: "You must complete all quiz questions and score 80% or higher to mark this lesson complete." });
            }
            const pct = Math.round(qr.correct / qr.total * 100);
            if (pct < 80) {
              return /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-red-400", children: [
                "Score ",
                pct,
                "% — need 80% or higher to mark complete. Review and try again."
              ] });
            }
            return /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-green-400", children: [
              "Score ",
              pct,
              "% — you're ready to mark this lesson complete!"
            ] });
          })(),
          currentLessonIdx < course.lessonsList.length - 1 && /* @__PURE__ */ jsxs("button", { onClick: () => setCurrentLessonIdx(currentLessonIdx + 1), className: "flex items-center gap-2 text-sm font-medium text-[#e63946] hover:text-[#c1121f] transition-colors", children: [
            t("training.nextLesson"),
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ] })
        ] })
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center rounded-xl border border-[#1a2d4a] bg-[#0d1f35]", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Select a lesson to begin" }) }) })
    ] }) })
  ] });
}
export {
  CourseDetail as component
};
