// Shared auth hook — uses client-side JWT check first, server call in background
import { useState, useEffect } from "react";
import { isTokenValid, getTokenPayload } from "~/lib/client-auth";
import { getAuthInfo } from "~/lib/auth-guard";

export function useAuth() {
  const [state, setState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [tier, setTier] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("salesdrive_token");
    if (!t) {
      setState("unauthenticated");
      return;
    }
    // Client-side JWT check — instant, never fails
    if (!isTokenValid(t)) {
      setState("unauthenticated");
      return;
    }
    const payload = getTokenPayload(t)!;
    setToken(t);
    setState("authenticated");
    // Tier is only real once the server confirms an ACTIVE subscription.
    setTier(null);
    // Background: get actual tier from server (non-blocking)
    getAuthInfo({ data: { token: t } }).then((result) => {
      if (result.authenticated && result.user) {
        setTier((result.user as { tier?: string | null }).tier ?? null);
      }
    }).catch(() => {});
  }, []);

  return { state, tier, token };
}
