import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { isTokenValid } from "~/lib/client-auth";
import { courses } from "~/content/courses";
import { QuizQuestion } from "~/components/quiz-question";
import { SiteHeader } from "~/components/site-header";

export const Route = createFileRoute("/training/preview")({
  component: TrainingPreview,
});

// One sample quiz question from each course
const previewQuestions: { courseName: string; question: string }[] = [
  {
    courseName: "Road to the Sale",
    question: `**Q1:** What is the most important goal of the greeting?
A) To qualify the customer's budget immediately
B) To build trust and make a positive first impression
C) To show the customer every vehicle on the lot
D) To get the customer's contact information
*Answer: B — The greeting is about building trust and making a positive first impression. Qualifying, showing vehicles, and gathering contact info come later in the process.*`,
  },
  {
    courseName: "Road to the Sale — Part 2",
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

// Newest modules — featured on the teaser page with their descriptions
const newModules: { title: string; description: string; meta: string }[] = [
  {
    title: "Stop Selling and Start Asking Questions",
    description:
      "The days of pitching your way to a sale are over. Today's buyers arrive already researched, so the salespeople who win are the ones who ask the right questions, listen to the answers, and present exactly what the customer actually needs. Master the complete questioning framework — why questions beat pitches, the 80/20 listening rule, open vs closed questions, the question funnel, the Five Ws and How of discovery, budget and timing questions done right, tie-downs, and the question-driven close.",
    meta: "10 lessons · 50 scenario-based quiz questions",
  },
  {
    title: "Landing on the Right Vehicle",
    description:
      "Most deals are lost before the test drive — because the customer was shown the wrong car. This module teaches the three-stage process for landing every customer on the right vehicle: a structured needs assessment that uncovers what they actually drive, need, and can afford; smart inventory selection that matches those real needs to the right cars on your lot; and a walkaround presentation that turns features into benefits the customer can picture themselves living with.",
    meta: "10 lessons · 50 scenario-based quiz questions",
  },
];

// Total quiz questions across the full catalog (computed, stays accurate as courses are added)
const totalQuizQuestions = courses.reduce(
  (sum, c) => sum + c.lessonsList.reduce((s, l) => s + (l.content.match(/\*\*Q\d+:/g) || []).length, 0),
  0
);

function TrainingPreview() {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    setAuthState("authenticated");
  }, []);
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
              <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />Training Preview
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Training <span className="text-[#e63946]">Preview</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">Sample lessons and quizzes are part of the Champion Sales Training platform — sign in to view the training preview and full course catalog.</p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="/signup" className="rounded-lg bg-[#e63946] px-8 py-3 text-base font-semibold text-white hover:bg-[#c1121f] transition-colors">Create Account — Start Free</a>
              <a href="/login" className="rounded-lg border border-[#1a2d4a] px-8 py-3 text-base font-semibold text-white hover:bg-[#1a2d4a]/50 transition-colors">Sign In</a>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pt-10 pb-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />Free Preview
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Try a Sample <span className="text-[#e63946]">Quiz</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">Sample questions from our training catalog, plus a first look at two brand-new modules. See the quality and depth of our content — no account required.</p>
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

        {/* New modules */}
        <div className="mt-14">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e63946]/30 bg-[#e63946]/10 px-4 py-1.5 text-xs font-medium text-[#e63946]">
              <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />New Modules
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">Two Fresh Modules, <span className="text-[#e63946]">Built for Modern Selling</span></h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-400">New training built around consultative, customer-first selling — with scenario-based quizzes to lock in the skill.</p>
          </div>
          <div className="space-y-6">
            {newModules.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-white">{m.title}</h3>
                  <span className="shrink-0 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]">New</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{m.description}</p>
                <p className="mt-4 text-xs font-medium text-gray-500">{m.meta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-8">
          <h2 className="text-xl font-bold text-white">Want all {courses.reduce((s, c) => s + c.lessons, 0)} lessons and {totalQuizQuestions} quiz questions?</h2>
          <p className="mt-2 text-gray-400">Create an account to unlock the full training catalog — {courses.length} courses, detailed guides, interactive quizzes, and progress tracking.</p>
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
