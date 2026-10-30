// ── Pending purchase recorder ───────────────────────────────────────────────
// Stripe cannot call the site back (no API key, no webhook), so the ONLY thing
// that tells us a checkout happened is the customer's own return trip — and
// that return trip carries nothing but the checkout session id. This records
// what they chose on the way OUT (email, tier, amount) so the owner's alert can
// name the customer instead of saying "someone".
//
// Fire-and-forget: `keepalive` lets the request finish after the browser leaves
// for Stripe, and a failure here must never stop a sale.
export function recordPendingPurchase(email: string, tier: string): void {
  try {
    const token =
      localStorage.getItem("salesdrive_token") ?? localStorage.getItem("auth-token") ?? undefined;
    void fetch("/api/recordPendingPurchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { token, email: email || undefined, tier } }),
      keepalive: true,
    }).catch(() => {
      /* never block the redirect */
    });
  } catch {
    /* never block the redirect */
  }
}
