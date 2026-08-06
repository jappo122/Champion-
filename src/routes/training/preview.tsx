import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { courses } from "~/content/courses";
import { QuizQuestion } from "~/components/quiz-question";

export const Route = createFileRoute("/training/preview")({
  component: TrainingPreview,
});

// One sample quiz question from each course
const previewQuestions: { courseName: string; question: string }[] = [
  {
    courseName: "10 Steps to the Sale",
    question: `**Q1:** What is the most important goal of the greeting?
A) To qualify the customer's budget immediately
B) To build trust and make a positive first impression
C) To show the customer every vehicle on the lot
D) To get the customer's contact information
*Answer: B — The greeting is about building trust and making a positive first impression. Qualifying, showing vehicles, and gathering contact info come later in the process.*`,
  },
  {
    courseName: "10 Steps of the Sale — Part 2",
    question: `**Q1:** What percentage of customers who take a test drive are more likely to buy?
A) 50%
B) 70%
C) 90%
D) 30%
*Answer: B — Customers who take a test drive are 70% more likely to buy. The test drive creates an emotional connection that's essential for closing the deal.*`,
  },
  {
    courseName: "Advanced Closing Strategies",
    question: `**Q1:** When handling a negotiation, what is your most powerful tool?
A) A lower price
B) Silence
C) Product knowledge
D) A strong personality
*Answer: B — Silence is your most powerful negotiation tool. After presenting the number, stay silent. The person who speaks first typically concedes.*`,
  },
  {
    courseName: "Digital Marketing for Dealers",
    question: `**Q1:** What is the most important metric for measuring marketing effectiveness?
A) Number of likes
B) Cost per lead
C) Follower count
D) Post impressions
*Answer: B — Cost per lead is the most important metric because it directly ties marketing spend to actual potential customers.*`,
  },
  {
    courseName: "Customer Experience Excellence",
    question: `**Q1:** How quickly should you respond to an online inquiry?
A) Within 1 hour
B) Within 24 hours
C) Within 5 minutes
D) By end of business day
*Answer: C — Responding within 5 minutes dramatically increases the chance of converting an online inquiry into a showroom visit.*`,
  },
  {
    courseName: "5-Minute Sales Drills",
    question: `**Q1:** A customer walks in and heads straight to a vehicle. You should:
A) Let them browse alone
B) Walk up and ask "Can I help you?"
C) Greet them warmly, then give them space
*Answer: C — Acknowledge them, then give them space.*`,
  },
];

function TrainingPreview() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
<img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/training" className="text-sm text-gray-400 hover:text-white">{t('nav.training')}</a>
            <a href="/steps" className="text-sm text-gray-400 hover:text-white">Steps of the Sale</a>
            <a href="/#pricing" className="text-sm text-gray-400 hover:text-white">{t('nav.pricing')}</a>
            <a href="/login" className="rounded-lg bg-[#e63946] px-4 py-2 text-sm font-medium text-white hover:bg-[#c1121f]">Sign In</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />Free Preview
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Try a Sample <span className="text-[#e63946]">Quiz</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">One question from each of our 6 training courses. See the quality and depth of our content — no account required.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/signup" className="rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f] transition-colors">Create Account — Full Access</a>
            <a href="/training" className="rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors">{t('nav.training')}</a>
          </div>
        </div>

        {/* Preview questions */}
        <div className="space-y-8">
          {previewQuestions.map((pq, idx) => (
            <div key={idx}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e63946] text-xs font-bold text-white">{idx + 1}</span>
                <h2 className="text-lg font-bold text-white">{pq.courseName}</h2>
              </div>
              <QuizQuestion content={pq.question} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-8">
          <h2 className="text-xl font-bold text-white">Want all {courses.reduce((s, c) => s + c.lessons, 0)} lessons and 40+ quiz questions?</h2>
          <p className="mt-2 text-gray-400">Create an account to unlock the full training catalog — 6 courses, detailed guides, interactive quizzes, and progress tracking.</p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/signup" className="rounded-lg bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f] transition-colors">Create Free Account</a>
            <a href="/login" className="rounded-lg border border-[#1a2d4a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors">Sign In</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a]/50 bg-[#0a1628] py-8 mt-auto">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <a href="/signup" className="rounded-lg bg-[#e63946] px-6 py-2 text-sm font-medium text-white hover:bg-[#c1121f]">Sign Up for Full Access</a>
        </div>
      </footer>
    </div>
  );
}
