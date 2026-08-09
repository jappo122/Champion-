import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { courses } from "~/content/courses";
import { getAuthInfo } from "~/lib/api-client";
import { getMyAssignments, getMyProgress } from "~/lib/api-client";
import { isTokenValid, getTokenPayload } from "~/lib/client-auth";
import { SiteHeader } from "~/components/site-header";

export const Route = createFileRoute("/training/")({
  component: TrainingCatalog,
});

const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400",
  Intermediate: "bg-yellow-500/20 text-yellow-400",
  Advanced: "bg-[#e63946]/20 text-[#e63946]",
};

function TrainingCatalog() {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated" | "no-subscription">("loading");
  const [userTier, setUserTier] = useState<string | null>(null);
  const [assignedCourseIds, setAssignedCourseIds] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedPerCourse, setCompletedPerCourse] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      setAuthState("unauthenticated");
      return;
    }
    // Client-side JWT check first — no server call, never fails
    if (!isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    const payload = getTokenPayload(token)!;
    setAuthState("authenticated");
    setUserTier(payload.role === "management" ? "premium" : "basic");
    // Background: fetch tier + assignments + progress (non-blocking)
    getAuthInfo({ data: { token } }).then((result) => {
      if (result.authenticated && result.user) {
        setUserTier(result.user.tier);
      }
    }).catch(() => {});
    getMyAssignments({ data: { token } }).then((res) => {
      if (res.success) {
        const ids = new Set(res.assignments.filter((a: any) => !a.completed_at).map((a: any) => a.course_id));
        setAssignedCourseIds(ids);
      }
    }).catch(() => {});
    // Fetch completed lessons for progress display
    fetch("/api/my-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(r => r.json()).then((data) => {
      if (data.success && data.completedLessons) {
        const ids = new Set<string>();
        const perCourse = new Map<string, number>();
        for (const item of data.completedLessons) {
          ids.add(item.lesson_id);
          perCourse.set(item.course_id, (perCourse.get(item.course_id) || 0) + 1);
        }
        setCompletedLessons(ids);
        setCompletedPerCourse(perCourse);
      }
    }).catch(() => {});
  }, []);

  // If not authenticated, show loading then redirect
  if (authState === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div className="min-h-dvh bg-[#0a1628]">
        {/* Header */}
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-6 pt-10 pb-12">
          {/* Sign-in prompt — the training catalog is behind login */}
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
              <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />Professional Sales Training
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Automotive Sales <span className="text-[#e63946]">Training</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">The full training catalog — courses, lessons, and quizzes — is part of the Champion Sales Training platform. Sign in to access your training.</p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="/signup" className="rounded-lg bg-[#e63946] px-8 py-3 text-base font-semibold text-white hover:bg-[#c1121f] transition-colors">Create Account — Start Free</a>
              <a href="/login" className="rounded-lg border border-[#1a2d4a] px-8 py-3 text-base font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors">Sign In</a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              <a href="/training/preview" className="text-[#e63946] hover:underline">Try a sample quiz →</a>
              {" "}No account required
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1a2d4a]/50 bg-[#0a1628] py-8 mt-auto">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <a href="/signup" className="rounded-lg bg-[#e63946] px-6 py-2 text-sm font-medium text-white hover:bg-[#c1121f]">Sign In to Access Training</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-[#1a2d4a]/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />
            {t('training.badge')}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t('training.hero.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            {t('training.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {courses.map((course) => {
              const tierRank: Record<string, number> = { basic: 0, plus: 1, premium: 2 };
              const requiredRank = course.requiredTier ? (tierRank[course.requiredTier] ?? 0) : 0;
              const userRank = userTier ? (tierRank[userTier] ?? 0) : 0;
              const isLocked = requiredRank > userRank;
              const isGated = course.requiredTier && course.requiredTier !== "basic";

              if (isLocked) {
                return (
                  <div
                    key={course.id}
                    className="group relative overflow-hidden rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 sm:p-8 opacity-75"
                  >
                    {/* Lock overlay */}
                    <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>

                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a]">
                      <svg className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={course.icon} />
                      </svg>
                    </div>

                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${levelColors[course.levels] || "bg-gray-500/20 text-gray-400"}`}>
                      {course.levels}
                    </span>
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Plus+
                    </span>

                    <h2 className="mt-3 text-xl font-bold text-gray-400">{course.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{course.subtitle}</p>
                    <p className="mt-3 leading-relaxed text-gray-500 line-clamp-3">{course.description}</p>

                    <div className="mt-5 flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {course.lessons} {t('training.lessons')}
                      </span>
                    </div>

                    <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                      <p className="text-sm font-medium text-amber-400">Upgrade to Plus+ to unlock</p>
                      <a href="/pricing" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#e63946] hover:underline">
                        View Plans
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              }

              return (
              <a
                key={course.id}
                href={`/training/${course.id}`}
                className="group relative overflow-hidden rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 sm:p-8"
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] group-hover:bg-[#e63946]/20">
                  <svg className="h-7 w-7 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={course.icon} />
                  </svg>
                </div>

                {/* Level badge */}
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    levelColors[course.levels] || "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {course.levels}
                </span>
                {isGated && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">Plus+</span>
                )}
                {!isGated && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">All Plans</span>
                )}
                {completedPerCourse.has(course.id) && (completedPerCourse.get(course.id)! >= course.lessons) && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">✓ Complete</span>
                )}

                <h2 className="mt-3 text-xl font-bold text-white group-hover:text-[#e63946] transition-colors">
                  {course.title}
                </h2>
                {assignedCourseIds.has(course.id) && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#e63946]/10 px-2 py-0.5 text-[10px] font-medium text-[#e63946]">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Assigned by Manager
                  </span>
                )}
                <p className="mt-1 text-sm text-gray-500">{course.subtitle}</p>
                <p className="mt-3 leading-relaxed text-gray-400 line-clamp-3">{course.description}</p>

                <div className="mt-5 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {course.lessons} {t('training.lessons')}
                  </span>
                </div>

                {/* Progress bar */}
                {completedPerCourse.has(course.id) && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{completedPerCourse.get(course.id)}/{course.lessons} lessons</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a2d4a]">
                      <div
                        className="h-1.5 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${Math.round(((completedPerCourse.get(course.id) || 0) / course.lessons) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#e63946]">
                  {t('training.start')}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a]/50 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Champion Sales Training & Events. {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
}