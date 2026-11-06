// Shared lock states for every training surface.
// Four deliberate states (owner rule, 2026-10):
//   loading      → spinner only, never course content
//   anon         → sign-in prompt (existing behaviour)
//   unsubscribed → never bought: "subscribe to unlock" + link to /pricing
//   expired      → a paid 90-day term ENDED: say when it ended and offer that
//                  tier's renewal link. Factual notice, no pressure, and never
//                  the "you never subscribed" copy a brand-new account sees.
// No state renders course names or lesson content.
import { SiteHeader } from "~/components/site-header";
import type { TrainingAccessState } from "~/lib/use-training-access";
import { stripeLinkForTier, priceForTier, TERM_DAYS } from "~/lib/pricing";

/** "12 February 2027" — stable, timezone-independent wording for a term end. */
function formatTermEnd(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function TrainingGate({
  state,
  tier = null,
  expiresAt = null,
}: {
  state: TrainingAccessState;
  /** Tier of the lapsed term when state === "expired" (drives the renewal link). */
  tier?: string | null;
  expiresAt?: string | null;
}) {
  if (state === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
      </div>
    );
  }

  const isAnon = state === "anon";
  const isExpired = state === "expired";
  const endedOn = formatTermEnd(expiresAt);

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
            {isAnon
              ? "Sign in to access training"
              : isExpired
                ? "Your 90-day access term has ended"
                : "Subscribe to unlock the training"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400" data-testid="training-gate-body">
            {isAnon
              ? "The training catalog — courses, lessons, quizzes and the Road to the Sale — is part of the Champion Sales Training platform and requires an active subscription."
              : isExpired
                ? endedOn
                  ? `Your ${TERM_DAYS}-day term of access ended on ${endedOn}. Training is locked until you start a new term — your progress is kept.`
                  : `Your ${TERM_DAYS}-day term of access has ended. Training is locked until you start a new term — your progress is kept.`
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
            ) : isExpired ? (
              <>
                {/* Renewal is simply buying another 90-day term. The link and the
                    price both come from src/lib/pricing.ts, so they cannot drift. */}
                <a
                  href={stripeLinkForTier(tier)}
                  className="rounded-lg bg-[#e63946] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#c1121f]"
                  data-testid="training-gate-renew"
                >
                  Start a new {TERM_DAYS}-day term — ${priceForTier(tier)}
                </a>
                <a
                  href="/support"
                  className="rounded-lg border border-[#1a2d4a] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1a2d4a]/50"
                >
                  Contact Support
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
