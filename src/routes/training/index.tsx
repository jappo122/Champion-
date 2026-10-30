import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { courses } from "~/content/courses";
import { getMyAssignments } from "~/lib/api-client";
import { useTrainingAccess } from "~/lib/use-training-access";
import { TrainingGate } from "~/components/training-gate";
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
  // Owner rule (2026-10): training requires an ACTIVE subscription, not just a
  // login. useTrainingAccess asks the server and never grants access on its own;
  // nothing below renders until that check resolves.
  const access = useTrainingAccess();
  const userTier = access.tier;
  const [assignedCourseIds, setAssignedCourseIds] = useState<Set<string>>(new Set());
  const [completedPerCourse, setCompletedPerCourse] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (access.state !== "subscribed" || !access.token) return;
    const token = access.token;
    // Background: fetch assignments + progress (non-blocking, subscribed only)
    getMyAssignments({ data: { token } }).then((res: any) => {
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
        const perCourse = new Map<string, number>();
        for (const item of data.completedLessons) {
          perCourse.set(item.course_id, (perCourse.get(item.course_id) || 0) + 1);
        }
        setCompletedPerCourse(perCourse);
      }
    }).catch(() => {});
  }, [access.state, access.token]);

  // loading → spinner; signed out → sign-in prompt; signed in without an active
  // subscription → subscribe-to-unlock. Course catalog renders only when subscribed.
  if (access.state !== "subscribed") {
    return <TrainingGate state={access.state} />;
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