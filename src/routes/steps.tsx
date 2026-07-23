import { createFileRoute } from "@tanstack/react-router";
import { useTranslation, LanguageSwitcher } from "~/i18n";
import { useState, useEffect } from "react";
import { courses } from "~/content/courses";
import { getAuthInfo } from "~/lib/auth-guard";
import { detailedSteps, stepQuizzes } from "~/content/steps-content";
import type { DetailedStep, StepQuestion } from "~/content/steps-content";

export const Route = createFileRoute("/steps")({
  component: StepsPage,
});

function StepsPage() {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [mode, setMode] = useState<"guide" | "quiz">("guide");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      setAuthState("unauthenticated");
      return;
    }
    getAuthInfo({ data: { token } }).then((result) => {
      if (result.authenticated) {
        setAuthState("authenticated");
      } else {
        // Token kept — transient failures should not log you out
        setAuthState("unauthenticated");
      }
    });
  }, []);

  const handleSelectAnswer = (questionKey: string, index: number) => {
    if (submittedAnswers[questionKey]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionKey]: index }));
  };

  const handleSubmitAnswer = (questionKey: string) => {
    if (selectedAnswers[questionKey] === undefined) return;
    setSubmittedAnswers((prev) => ({ ...prev, [questionKey]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
  };

  const allQuestions = stepQuizzes.flatMap((sq) =>
    sq.questions.map((q, qi) => ({
      key: `${sq.step}-${qi}`,
      stepTitle: sq.title,
      stepNumber: sq.step,
      question: q,
    }))
  );

  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(submittedAnswers).length;
  const correctCount = allQuestions.filter((q) => {
    const answer = selectedAnswers[q.key];
    return submittedAnswers[q.key] && answer === q.question.correctIndex;
  }).length;
  const allAnswered = answeredCount === totalQuestions;

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
          <h1 className="mt-6 text-2xl font-bold text-white">Sign in to access the Sales Process</h1>
          <p className="mt-3 text-gray-400">Sign in to view the complete 10-step automotive sales process.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/login" className="btn-primary text-sm">Sign In</a>
            <a href="/signup" className="btn-secondary text-sm">Create Account</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">Champion Sales Training & Events</span>
          </a>
          <nav className="flex items-center gap-6">
            <a href="/training" className="text-sm text-gray-400 hover:text-white">{t('nav.training')}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />10-Step Sales Process
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Steps of the <span className="text-[#e63946]">Sales Process</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">Master every stage of the automotive sales process — from greeting to follow-up. Each step has detailed guidance and a dedicated training module.</p>
          <a href="/training/10-steps-part-1" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#e63946] px-6 py-3 text-sm font-medium text-white hover:bg-[#c1121f] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Start the Training Course →
          </a>
        </div>

        {/* Mode toggle */}
        <div className="mb-8 flex gap-1 rounded-lg bg-[#0d1f35] p-1 max-w-xs mx-auto">
          <button
            onClick={() => setMode("guide")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "guide" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Part 1: Guide
          </button>
          <button
            onClick={() => { setMode("quiz"); handleReset(); }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "quiz" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Part 2: Quiz ({totalQuestions})
          </button>
        </div>

        {/* ── PART 1: GUIDE ── */}
        {mode === "guide" && (
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

        {/* ── PART 2: QUIZ ── */}
        {mode === "quiz" && (
          <div>
            {/* Score header */}
            <div className="mb-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Knowledge Check</h2>
                  <p className="text-sm text-gray-400">Test your understanding of the complete sales process</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{correctCount}</span>
                  <span className="text-gray-500">/{totalQuestions}</span>
                  {allAnswered && (
                    <div className="mt-1">
                      <span className={`text-xs font-medium ${correctCount === totalQuestions ? "text-green-500" : correctCount >= totalQuestions * 0.7 ? "text-yellow-500" : "text-[#e63946]"}`}>
                        {correctCount === totalQuestions ? "🎉 Perfect Score!" : correctCount >= totalQuestions * 0.7 ? "Good Job!" : "Keep Practicing"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {answeredCount > 0 && (
                <div className="mt-3 h-2 w-full rounded-full bg-[#1a2d4a]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00] transition-all duration-500"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              )}
              {allAnswered && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    You answered {correctCount}/{totalQuestions} correctly ({Math.round((correctCount / totalQuestions) * 100)}%)
                  </p>
                  <button onClick={handleReset} className="rounded-lg border border-[#1a2d4a] px-3 py-1.5 text-xs text-gray-400 hover:border-gray-500 hover:text-white transition-colors">
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Questions grouped by step */}
            <div className="space-y-8">
              {stepQuizzes.map((sq) => (
                <div key={sq.step} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-[#1a2d4a] bg-[#0a1628] px-5 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e63946] text-xs font-bold text-white">{sq.step}</span>
                    <h3 className="font-semibold text-white">{sq.title}</h3>
                  </div>
                  <div className="space-y-6 p-5">
                    {sq.questions.map((q: StepQuestion, qi: number) => {
                      const key = `${sq.step}-${qi}`;
                      const selected = selectedAnswers[key];
                      const submitted = submittedAnswers[key];
                      const isCorrect = submitted && selected === q.correctIndex;

                      return (
                        <div key={qi} className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                          <p className="text-sm font-medium text-white">
                            <span className="text-[#e63946]">Q{qi + 1}:</span> {q.question}
                          </p>
                          <div className="mt-3 space-y-2">
                            {q.options.map((opt, oi) => {
                              const isAns = submitted && oi === q.correctIndex;
                              const isWrong = submitted && selected === oi && oi !== q.correctIndex;

                              return (
                                <button
                                  key={oi}
                                  onClick={() => handleSelectAnswer(key, oi)}
                                  disabled={submitted}
                                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                                    submitted
                                      ? isAns
                                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                                        : isWrong
                                          ? "border-red-500/50 bg-red-500/10 text-red-400"
                                          : "border-[#1a2d4a] text-gray-500 opacity-50"
                                      : selected === oi
                                        ? "border-[#e63946] bg-[#e63946]/10 text-white"
                                        : "border-[#1a2d4a] text-gray-400 hover:border-[#e63946]/50 hover:bg-[#e63946]/5"
                                  }`}
                                >
                                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                    submitted && isAns
                                      ? "border-green-500 bg-green-500"
                                      : submitted && isWrong
                                        ? "border-red-500 bg-red-500"
                                        : selected === oi
                                          ? "border-[#e63946] bg-[#e63946]"
                                          : "border-gray-600"
                                  }`}>
                                    {submitted && isAns && (
                                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                    {submitted && isWrong && (
                                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    )}
                                    {!submitted && selected === oi && <span className="h-2 w-2 rounded-full bg-white" />}
                                  </span>
                                  <span className="text-xs text-gray-500 font-mono mr-1">{String.fromCharCode(65 + oi)}.</span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {/* Check answer button */}
                          <div className="mt-3 flex items-center gap-3">
                            {!submitted && selected !== undefined && (
                              <button
                                onClick={() => handleSubmitAnswer(key)}
                                className="rounded-lg bg-[#e63946] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#c1121f]"
                              >
                                Check Answer
                              </button>
                            )}
                            {submitted && (
                              <button
                                onClick={() => {
                                  const newSelected = { ...selectedAnswers };
                                  delete newSelected[key];
                                  setSelectedAnswers(newSelected);
                                  const newSubmitted = { ...submittedAnswers };
                                  delete newSubmitted[key];
                                  setSubmittedAnswers(newSubmitted);
                                }}
                                className="rounded-lg border border-[#1a2d4a] px-4 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-gray-500 hover:text-white"
                              >
                                Retry
                              </button>
                            )}
                          </div>

                          {/* Explanation */}
                          {submitted && (
                            <div className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
                              isCorrect
                                ? "border border-green-500/30 bg-green-500/5 text-green-400"
                                : "border border-red-500/30 bg-red-500/5 text-red-400"
                            }`}>
                              <span className="font-semibold">{isCorrect ? "✓ Correct!" : "✗ Not quite."}</span> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}