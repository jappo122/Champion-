// Shared lock states for every training surface.
// Three deliberate states (owner rule, 2026-10):
//   loading      → spinner only, never course content
//   anon         → sign-in prompt (existing behaviour)
//   unsubscribed → "subscribe to unlock" + link to /pricing, no catalog, no lessons
import { SiteHeader } from "~/components/site-header";
import type { TrainingAccessState } from "~/lib/use-training-access";

export function TrainingGate({ state }: { state: TrainingAccessState }) {
  if (state === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
      </div>
    );
  }

  const isAnon = state === "anon";

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-10 pb-16">
        <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20">
            <svg className="h-8 w-8 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl" data-testid="training-gate-title">
            {isAnon ? "Sign in to access training" : "Subscribe to unlock the training"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            {isAnon
              ? "The training catalog — courses, lessons, quizzes and the Road to the Sale — is part of the Champion Sales Training platform and requires an active subscription."
              : "Training access is included with an active Champion Sales Training subscription. Your account is signed in, but there is no active subscription on it yet."}
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            {isAnon ? (
              <>
                <a
                  href="/login"
                  className="rounded-lg bg-[#e63946] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#c1121f]"
                >
                  Sign In
                </a>
                <a
                  href="/pricing"
                  className="rounded-lg border border-[#1a2d4a] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1a2d4a]/50"
                >
                  View Plans
                </a>
              </>
            ) : (
              <>
                <a
                  href="/pricing"
                  className="rounded-lg bg-[#e63946] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#c1121f]"
                  data-testid="training-gate-subscribe"
                >
                  View Plans &amp; Subscribe
                </a>
                <a
                  href="/support"
                  className="rounded-lg border border-[#1a2d4a] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1a2d4a]/50"
                >
                  Contact Support
                </a>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Already subscribed and still seeing this?{" "}
            <a href="/support" className="text-[#e63946] hover:underline">
              Get help
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
