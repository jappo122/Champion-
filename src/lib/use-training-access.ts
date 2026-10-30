// Training access gate (owner rule, 2026-10): the BLOG is public to everyone,
// but every training surface (/training, /training/<courseId>, /training/preview,
// /steps) requires an ACTIVE subscription — being logged in is not enough.
//
// The server is the source of truth: /api/auth-info answers with
// `subscribed: boolean` and the real tier (or null). This hook never grants
// access on its own, and it never renders content while the check is in flight
// (so course content can never flash before the subscription check resolves).
import { useEffect, useState } from "react";
import { isTokenValid, decodeToken } from "~/lib/client-auth";

export type TrainingAccessState = "loading" | "anon" | "unsubscribed" | "subscribed";

export interface TrainingAccess {
  state: TrainingAccessState;
  /** Real tier from an ACTIVE subscription (or "premium" for demo accounts). Null when not subscribed. */
  tier: string | null;
  token: string | null;
}

// Demo/owner accounts the server always grants access to (see api/handlers.mjs
// and src/lib/subscription-server.ts). Used ONLY as a fallback when the server
// cannot answer at all — it can never grant access to anyone the server denies.
const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
const DEMO_USER_IDS = [1];

function isDemoToken(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return false;
  const email = String((payload as { email?: string }).email || "").toLowerCase();
  return DEMO_USER_IDS.includes(Number(payload.userId)) || DEMO_EMAILS.includes(email);
}

export function useTrainingAccess(): TrainingAccess {
  const [state, setState] = useState<TrainingAccessState>("loading");
  const [tier, setTier] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = typeof window !== "undefined" ? localStorage.getItem("salesdrive_token") : null;
    if (!t || !isTokenValid(t)) {
      setState("anon");
      return;
    }
    setToken(t);

    (async () => {
      // Retry once on a transient failure, then fail CLOSED: an unanswered
      // subscription check must never unlock training.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch("/api/auth-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: t }),
          });
          const data = await res.json();
          if (cancelled) return;
          if (!data || !data.authenticated || !data.user) {
            setState("anon");
            return;
          }
          const subscribed = data.subscribed === true || data.user.subscribed === true;
          setTier(data.user.tier ?? null);
          setState(subscribed ? "subscribed" : "unsubscribed");
          return;
        } catch {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }
        }
      }
      if (!cancelled) {
        // The server could not answer (e.g. a preview/dev environment where the
        // API layer isn't running). Fail CLOSED: no training for a regular
        // account — but keep demo/owner accounts able to review the product,
        // since the server grants them access unconditionally anyway.
        if (isDemoToken(t)) {
          setTier("premium");
          setState("subscribed");
        } else {
          setTier(null);
          setState("unsubscribed");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { state, tier, token };
}
