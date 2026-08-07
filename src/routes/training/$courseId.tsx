import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { courses, type Lesson } from "~/content/courses";
import { getAuthInfo } from "~/lib/auth-guard";
import { isTokenValid, getTokenPayload } from "~/lib/client-auth";
import { renderMarkdown } from "~/lib/renderer";
export const Route = createFileRoute("/training/$courseId")({
  component: CourseDetail,
});
function CourseDetail() {
  const { t } = useTranslation();
  const params = Route.useParams();
  const course = courses.find((c) => c.id === params.courseId);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const [userTier, setUserTier] = useState<string>("basic");
  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      setAuthState("unauthenticated");
      return;
    }
    // Client-side JWT check — instant, no server call
    if (!isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    const payload = getTokenPayload(token);
    setAuthToken(token);
    setAuthState("authenticated");
    setUserTier(payload.role === "management" ? "premium" : "basic");
    // Background: fetch progress (non-blocking)
    if (course) {
      const fetchProgress = async () => {
        try {
          const { getMyProgress } = await import("~/lib/manager");
          const result = await getMyProgress({ data: { token } });
          if (result.success) {
            const completed = new Set(result.completedLessons.map((cl) => cl.lesson_id));
            setCompletedLessons(completed);
          }
        } catch {}
      };
      fetchProgress();
    }
    // Background: get tier info (non-blocking)
    getAuthInfo({ data: { token } }).then((result) => {
      if (result.authenticated && result.user) {
        setUserTier(result.user.tier);
      }
    }).catch(() => {});
  }, [course]);
  const [markError, setMarkError] = useState("");
  const markComplete = async (lessonId: string) => {
    setMarkError("");
    if (!authToken || !course) return;

    // Get quiz scores from window global (set by quiz component)
    const quizScores = (window as any).__quizScores || {};
    const quizResult = quizScores[lessonId];
    const hasQuiz = quizResult && quizResult.total > 0;

    // If lesson has quiz but not all answered
    if (hasQuiz && !quizResult.allAnswered) {
      setMarkError(`Answer all ${quizResult.total} questions before marking complete.`);
      return;
    }

    // If lesson has quiz, check 80% threshold
    if (hasQuiz) {
      const percent = Math.round((quizResult.correct / quizResult.total) * 100);
      if (percent < 80) {
        setMarkError(`Score ${percent}% — need 80% or higher to mark this lesson complete.`);
        return;
      }
    }

    try {
      const res = await fetch("/api/mark-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: authToken,
          courseId: course.id,
          lessonId,
          quizResults: hasQuiz ? { correct: quizResult.correct, total: quizResult.total } : { correct: 0, total: 0 }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCompletedLessons((prev) => new Set(prev).add(lessonId));
        setMarkError("");
      } else if (data.error) {
        setMarkError(data.error);
      }
    } catch {}
  };
  const currentLesson = course?.lessonsList?.[currentLessonIdx];
  // Auth check
  if (authState === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
      </div>
    );
  }
  if (authState === "unauthenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20">
            <svg className="h-8 w-8 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Sign in to access training</h1>
          <p className="mt-3 text-gray-400">Please sign in to view this course content.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/login" className="btn-primary text-sm">Sign In</a>
            <a href="/signup" className="btn-secondary text-sm">Create Account</a>
          </div>
        </div>
      </div>
    );
  }
  if (!course) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Course not found</h1>
          <a href="/training" className="mt-4 inline-block text-[#e63946]">{t('training.backToCourses')}</a>
        </div>
      </div>
    );
  }
  // Tier gate: check requiredTier against userTier
  const tierRank: Record<string, number> = { basic: 0, plus: 1, premium: 2 };
  const requiredRank = course.requiredTier ? (tierRank[course.requiredTier] ?? 0) : 0;
  const userRank = userTier ? (tierRank[userTier] ?? 0) : 0;
  if (requiredRank > userRank) {
    const tierName = course.requiredTier === 'premium' ? 'Premium' : 'Plus+';
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f77f00]/20">
            <svg className="h-8 w-8 text-[#f77f00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">{tierName} Subscription Required</h1>
          <p className="mt-3 text-gray-400">{course.title} is available on the {tierName} tier and above. Upgrade your subscription to unlock this course and all its content.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/pricing" className="rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f]">View Plans</a>
            <a href="/training" className="rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50">Back to Courses</a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <SiteHeader />
      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 pt-[184px] pb-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Lesson list sidebar */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('training.courseContent')}</h3>
              <div className="space-y-1">
                {course.lessonsList.map((lesson, idx) => {
                  const isActive = idx === currentLessonIdx;
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIdx(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-[#e63946]/20 text-white"
                          : isCompleted
                            ? "text-green-400 hover:bg-[#1a2d4a]/50"
                            : "text-gray-400 hover:bg-[#1a2d4a]/50 hover:text-white"
                      }`}
                    >
                      {/* Status icon */}
                      {isCompleted ? (
                        <svg className="h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : isActive ? (
                        <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#e63946]">
                          <div className="m-0.5 h-2.5 w-2.5 rounded-full bg-[#e63946]" />
                        </div>
                      ): (

                        <div className="h-4 w-4 shrink-0 rounded-full border border-gray-600" />
                      )}
                      <span className="flex-1 truncate">{lesson.title}</span>
                      <span className="shrink-0 text-xs text-gray-500">{lesson.duration}</span>
                    </button>
                  );
                })}
              </div>
              {/* Course progress */}
              <div className="mt-4 border-t border-[#1a2d4a] pt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{t('training.progress')}</span>
                  <span>{completedLessons.size} / {course.lessonsList.length}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1a2d4a]">
                  <div
                    className="h-full rounded-full bg-[#e63946] transition-all duration-300"
                    style={{ width: `${(completedLessons.size / course.lessonsList.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Lesson viewer */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            {currentLesson ? (
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span>{t('training.badge')}</span>
                    <span>·</span>
                    <span>{t('training.lessons')} {currentLessonIdx + 1} of {course.lessonsList.length}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">{currentLesson.title}</h1>
                  <p className="mt-3 leading-relaxed text-gray-400">{currentLesson.description}</p>
                  {/* Content sections */}
                  {renderMarkdown(currentLesson.content, currentLesson.id)}
                  {/* Mark Complete button */}
                  <div className="mt-8 flex items-center justify-between border-t border-[#1a2d4a] pt-6">
                    {markError && (
                      <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                        <p className="text-sm text-red-400">{markError}</p>
                      </div>
                    )}
                    <div>
                      {completedLessons.has(currentLesson.id) ? (
                        <div className="flex items-center gap-2 text-sm text-[#e63946]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('training.completed')}
                        </div>
                      ): (
                        <button
                          onClick={() => markComplete(currentLesson.id)}
                          className="btn-primary text-sm"
                        >
                          {t('training.markComplete')}
                        </button>
                      )}
                    </div>
                    {/* Quiz requirement text */}
                    {!completedLessons.has(currentLesson.id) && (() => {
                      const quizScores = typeof window !== "undefined" ? (window as any).__quizScores || {} : {};
                      const qr = quizScores[currentLesson.id];
                      const hasQuiz = qr && qr.total > 0;
                      if (!hasQuiz) return null;
                      if (!qr.allAnswered) {
                        return <p className="mt-3 text-xs text-gray-500">You must complete all quiz questions and score 80% or higher to mark this lesson complete.</p>;
                      }
                      const pct = Math.round((qr.correct / qr.total) * 100);
                      if (pct < 80) {
                        return <p className="mt-3 text-xs text-red-400">Score {pct}% — need 80% or higher to mark complete. Review and try again.</p>;
                      }
                      return <p className="mt-3 text-xs text-green-400">Score {pct}% — you're ready to mark this lesson complete!</p>;
                    })()}
                    {currentLessonIdx < course.lessonsList.length - 1 && (
                      <button
                        onClick={() => setCurrentLessonIdx(currentLessonIdx + 1)}
                        className="flex items-center gap-2 text-sm font-medium text-[#e63946] hover:text-[#c1121f] transition-colors"
                      >
                        {t('training.nextLesson')}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ): (

              <div className="flex h-64 items-center justify-center rounded-xl border border-[#1a2d4a] bg-[#0d1f35]">
                <p className="text-gray-500">Select a lesson to begin</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}