import { createFileRoute } from "@tanstack/react-router";
import { useTranslation, LanguageSwitcher } from "~/i18n";
import { courses } from "~/content/courses";
import { detailedSteps } from "~/content/steps-content";
import type { DetailedStep } from "~/content/steps-content";

export const Route = createFileRoute("/steps")({
  component: StepsPage,
});

function StepsPage() {
  const { t } = useTranslation();

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

        {/* Guide content */}
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
