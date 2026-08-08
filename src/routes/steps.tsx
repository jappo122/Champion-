import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation, LanguageSwitcher } from "~/i18n";
import { courses } from "~/content/courses";
import { detailedSteps } from "~/content/steps-content";
import type { DetailedStep } from "~/content/steps-content";
import { QuizQuestion } from "~/components/quiz-question";
import { SiteHeader } from "~/components/site-header";
import { isTokenValid } from "~/lib/client-auth";

export const Route = createFileRoute("/steps")({
  component: StepsPage,
});

function StepsPage() {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [activePart, setActivePart] = useState<1 | 2>(1);

  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    setAuthState("authenticated");
  }, []);
  // Get the Part 2 quiz course
  const quizCourse = courses.find((c) => c.id === "10-steps-part-2");
  if (authState === "loading") {
    return (
      <div className="min-h-dvh bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
        </div>
      </div>
    );
  }
  if (authState === "unauthenticated") {
    return (
      <div className="min-h-dvh bg-[#0a1628]">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-6 pt-10 pb-12">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
              <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />10-Step Sales Process
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Road to the <span className="text-[#e63946]">Sale</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">The Road to the Sale is part of the Champion Sales Training platform — sign in to access the full 10-step sales process with detailed guidance and interactive quizzes.</p>
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
      </div>
    );
  }
  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 pt-10 pb-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />10-Step Sales Process
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Road to the <span className="text-[#e63946]">Sale</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">Master every stage of the automotive sales process — from greeting to follow-up. Each step has detailed guidance and a dedicated training module.</p>
          <a href="/training/10-steps-part-1" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#e63946] px-6 py-3 text-sm font-medium text-white hover:bg-[#c1121f] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Start the Training Course →
          </a>
        </div>

        {/* Part 1 / Part 2 Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-1.5 gap-1.5">
            <button
              onClick={() => setActivePart(1)}
              className={`flex items-center gap-3 rounded-lg px-5 py-3 text-left transition-all duration-200 ${
                activePart === 1
                  ? "bg-[#0a1628] border border-[#e63946]/30 shadow-lg shadow-[#e63946]/5"
                  : "hover:bg-[#0a1628]/50"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activePart === 1 ? "bg-[#1a2d4a]" : "bg-[#0a1628]"} transition-colors`}>
                <svg className={`h-5 w-5 ${activePart === 1 ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <div>
                <div className={`text-sm font-semibold ${activePart === 1 ? "text-white" : "text-gray-400"}`}>Read the Road</div>
                <div className="text-xs text-gray-500 mt-0.5">Detailed explanations</div>
              </div>
            </button>
            <button
              onClick={() => setActivePart(2)}
              className={`flex items-center gap-3 rounded-lg px-5 py-3 text-left transition-all duration-200 ${
                activePart === 2
                  ? "bg-[#0a1628] border border-[#e63946]/30 shadow-lg shadow-[#e63946]/5"
                  : "hover:bg-[#0a1628]/50"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activePart === 2 ? "bg-[#e63946]" : "bg-[#0a1628]"} transition-colors`}>
                <svg className={`h-5 w-5 ${activePart === 2 ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </span>
              <div>
                <div className={`text-sm font-semibold ${activePart === 2 ? "text-white" : "text-gray-400"}`}>Test Your Knowledge</div>
                <div className="text-xs text-gray-500 mt-0.5">40 quiz questions</div>
              </div>
              <span className="ml-auto inline-flex items-center rounded-full bg-[#e63946]/20 px-2 py-0.5 text-[10px] font-bold text-[#e63946] uppercase tracking-wider">Quiz</span>
            </button>
          </div>
        </div>

        {/* Part 1: Detailed Explanations */}
        {activePart === 1 && (
        <div className="space-y-8">
          {detailedSteps.map((s: DetailedStep) => {
            const course = courses.find((c) => c.id === s.courseId);
            return (
              <div key={s.step} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 sm:p-8 transition-all duration-200 hover:border-[#e63946]/30">
                <div className="flex items-start gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-lg font-bold text-white">{s.step}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white">{s.title}</h2>
                    
                    {/* Detailed description */}
                    <p className="mt-3 leading-relaxed text-gray-300">{s.detailedDesc}</p>
                    
                    {/* Why it matters */}
                    <div className="mt-4 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                      <h3 className="text-sm font-bold text-[#e63946] mb-2">Why It Matters</h3>
                      <p className="text-sm leading-relaxed text-gray-400">{s.whyItMatters}</p>
                    </div>

                    {/* How to Execute */}
                    <div className="mt-3 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                      <h3 className="text-sm font-bold text-[#e63946] mb-2">How to Execute</h3>
                      <p className="text-sm leading-relaxed text-gray-400">{s.howToExecute}</p>
                    </div>

                    {/* Key Principles */}
                    <div className="mt-4">
                      <h3 className="text-sm font-bold text-gray-400 mb-2">Key Principles</h3>
                      <div className="flex flex-wrap gap-2">
                        {s.keyPrinciples.map((p) => (
                          <span key={p} className="inline-flex items-center gap-1 rounded-full border border-[#1a2d4a] bg-[#0a1628] px-3 py-1 text-xs text-gray-400">
                            <svg className="h-3 w-3 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Common Mistakes */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-bold text-red-400 mb-2">Common Mistakes</h3>
                        <ul className="space-y-1.5">
                          {s.commonMistakes.map((m) => (
                            <li key={m} className="flex items-start gap-2 text-xs text-gray-400">
                              <svg className="mt-0.5 h-3 w-3 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-green-400 mb-2">Pro Tips</h3>
                        <ul className="space-y-1.5">
                          {s.proTips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2 text-xs text-gray-400">
                              <svg className="mt-0.5 h-3 w-3 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Link to training */}
                    {course && (
                      <a href={`/training/${course.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#e63946] hover:text-white transition-colors">
                        View training module →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Part 2: Interactive Quiz */}
        {activePart === 2 && quizCourse && (
        <div className="space-y-8">
          <div className="text-center mb-6">
            <p className="text-gray-400">
              Test your knowledge of each step with scenario-based questions. Select an answer to see instant feedback and explanations.
            </p>
          </div>
          {quizCourse.lessonsList.map((lesson) => (
            <div key={lesson.id} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-2">{lesson.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{lesson.description}</p>
              {lesson.content ? (
                <QuizQuestion content={lesson.content} lessonId={lesson.id} />
              ) : (
                <p className="text-gray-400 text-sm italic">No quiz content available for this step.</p>
              )}
            </div>
          ))}
        </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a]/50 py-12 mt-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Champion Sales Training & Events. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
