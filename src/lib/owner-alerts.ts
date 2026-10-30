// ── OWNER ALERTS — the owner's notification inbox and owner-only settings ────
//
// This is the ONE module that holds owner-specific configuration:
//   • who receives the payment / activation alert emails
//   • which accounts count as "the owner" for the owner-only admin page
//
// It is imported by BOTH API layers — api/handlers.mjs, which is loaded by
// serve.ts (the Bun server behind the published site) and by api/ssr.mjs (the
// Vercel function behind www) — so the two can never drift apart.
//
// Server-only: it reads process.env, so never import it from client code.
//
// ── CHANGING THE ALERT ADDRESS ──────────────────────────────────────────────
// Edit ADMIN_NOTIFY_EMAILS below (line 26). That single constant is the only
// place the address appears in the codebase.
//
// OWNER_ALERT_TEST_REDIRECT is a TEST-ONLY escape hatch: when it is set to an
// address, alerts go there instead of ADMIN_NOTIFY_EMAILS. It exists so the
// payment-notification path can be exercised against a throwaway inbox without
// editing (or risking) the production recipient. Leave it unset in production —
// unset means alerts go to ADMIN_NOTIFY_EMAILS and nowhere else.

// ── THE OWNER ALERT ADDRESS ────────────────────────────────────────────────
export const ADMIN_NOTIFY_EMAILS: string[] = ["Floydsandersjr@yahoo.com"];

// ── Owner-only accounts (owner decision): ids 1, 2, 4, 5, plus the demo emails.
// These accounts can open /admin/activate and call the owner activation API.
// This is the ADMIN gate only — it does NOT change the training gate, and it
// does not make these accounts paid: they are owner/demo accounts with
// permanent access (see DEMO_EMAILS in subscription-server.ts / handlers.mjs).
export const OWNER_ACCOUNT_IDS: number[] = [1, 2, 4, 5];

/** From address for every alert email (Resend-verified domain). */
export const OWNER_ALERT_FROM = "Sales@championsalestrainingandevents.com";

/** Test-only redirect; empty in production. */
export function ownerAlertRedirect(): string | null {
  const raw = String(process.env.OWNER_ALERT_TEST_REDIRECT ?? "").trim();
  return raw || null;
}

/** Where alerts actually go: the test redirect when set, else the owner address. */
export function ownerAlertRecipients(): string[] {
  const redirect = ownerAlertRedirect();
  if (redirect) {
    return redirect
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return ADMIN_NOTIFY_EMAILS.slice();
}

export interface OwnerAlertResult {
  ok: boolean;
  /** Resend message id when the API accepted the email. */
  id: string | null;
  /** HTTP status Resend answered with (null when the request never left). */
  status: number | null;
  error: string | null;
  to: string[];
}

/**
 * Hand one alert email to Resend. Never throws: the caller is a customer-facing
 * request that must not fail because email did. The result is returned so the
 * caller can record whether the owner was actually told.
 */
export async function sendOwnerAlert({
  subject,
  body,
  replyTo,
}: {
  subject: string;
  body: string;
  replyTo?: string | null;
}): Promise<OwnerAlertResult> {
  const to = ownerAlertRecipients();
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[owner-alert] RESEND_API_KEY is not set — owner alert NOT sent:", subject);
    return { ok: false, id: null, status: null, error: "RESEND_API_KEY is not set", to };
  }
  const payload: Record<string, unknown> = {
    from: OWNER_ALERT_FROM,
    to,
    subject,
    text: body,
  };
  if (replyTo) payload.reply_to = replyTo;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let parsed: { id?: string; message?: string; name?: string } | null = null;
    try {
      parsed = JSON.parse(text) as { id?: string; message?: string; name?: string };
    } catch {
      parsed = null;
    }
    if (!res.ok) {
      console.error("[owner-alert] Resend rejected the alert:", res.status, text.slice(0, 300));
      return {
        ok: false,
        id: null,
        status: res.status,
        error: parsed?.message || text.slice(0, 300) || `HTTP ${res.status}`,
        to,
      };
    }
    console.log("[owner-alert] sent:", parsed?.id || "(no id)", "→", to.join(","), "|", subject);
    return { ok: true, id: parsed?.id ?? null, status: res.status, error: null, to };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[owner-alert] Resend request failed:", message);
    return { ok: false, id: null, status: null, error: message, to };
  }
}

// ── Formatting shared by the API response and the emails ───────────────────
/** "28 January 2027" — the plain-words date the owner and customers read. */
export function formatDateWords(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2026-10-30 15:42 UTC" — an unambiguous timestamp for the alert email. */
export function formatTimestampUtc(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`
  );
}

/** Whole days left in a term (0 once it has passed). */
export function daysRemaining(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const ms = d.getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

// ── Email copy ─────────────────────────────────────────────────────────────

export interface UnverifiedCheckoutDetails {
  customerEmail: string | null;
  tier: string | null;
  tierLabel: string | null;
  amountCents: number | null;
  sessionId: string;
  receivedAt: Date | string;
  matchedPending: boolean;
  pendingRecordedAt?: Date | string | null;
  siteUrl: string;
}

/**
 * The email the owner gets when a customer comes back from Stripe. It never
 * claims money arrived — the site cannot ask Stripe that without a key — it
 * says a checkout completed and needs confirming.
 */
export function buildUnverifiedCheckoutAlert(d: UnverifiedCheckoutDetails): {
  subject: string;
  body: string;
} {
  const who = d.customerEmail || "customer email unknown";
  const tierLine = d.tierLabel
    ? `${d.tierLabel}${d.amountCents ? ` ($${(d.amountCents / 100).toFixed(2)} one-time / 90 days)` : ""}`
    : "tier unknown — not recorded before checkout";
  const subject = `Payment to confirm — ${who} — ${d.tierLabel || "tier unknown"}`;
  const body = [
    "A customer came back from Stripe to the site just now.",
    "",
    "*** UNVERIFIED — PLEASE CONFIRM THE PAYMENT IN STRIPE BEFORE ACTIVATING ***",
    "This is a notification that a checkout completed, NOT proof that money arrived.",
    "The site cannot ask Stripe whether this checkout was paid (no API key and no",
    "webhook are configured), so nothing was activated automatically and the",
    "customer's account is untouched.",
    "",
    "── What we know ──",
    `Customer email: ${d.customerEmail || "UNKNOWN — no pending checkout record matched this session"}`,
    `Tier:           ${tierLine}`,
    `Amount:         ${d.amountCents ? `$${(d.amountCents / 100).toFixed(2)} (recorded when they left for Stripe)` : "unknown"}`,
    `Checkout id:    ${d.sessionId}`,
    `Returned at:    ${formatTimestampUtc(d.receivedAt)}`,
    d.matchedPending && d.pendingRecordedAt
      ? `Matched to the pending checkout record created ${formatTimestampUtc(d.pendingRecordedAt)}.`
      : "No pending checkout record matched this session id — treat the email/tier above as unconfirmed.",
    "",
    "── What to do ──",
    "1. Open Stripe and confirm the payment for the checkout id above.",
    "2. If it is paid, sign in as the owner and open /admin/activate on the site,",
    "   enter the customer's email, choose the tier, and press Activate.",
    "   That grants exactly 90 days of access and marks the row as a manual",
    "   activation so it is always distinguishable from a Stripe-verified one.",
    "3. If it is not paid, do nothing — no access was granted.",
    "",
    `Site: ${d.siteUrl}`,
    "",
    "— Champion Sales Training & Events (automated payment notification)",
  ].join("\n");
  return { subject, body };
}

export interface ManualActivationDetails {
  customerEmail: string;
  tierLabel: string;
  price: number;
  expiresAt: Date | string;
  previousExpiresAt: Date | string | null;
  extended: boolean;
  termDays: number;
  activatedByEmail: string;
  activatedAt: Date | string;
  siteUrl: string;
}

/** The owner's own record of a manual switch-on. */
export function buildManualActivationAlert(d: ManualActivationDetails): {
  subject: string;
  body: string;
} {
  const until = formatDateWords(d.expiresAt);
  const subject = `Access activated manually — ${d.customerEmail} — ${d.tierLabel} until ${until}`;
  const previous = d.previousExpiresAt
    ? `Previous term ended ${formatDateWords(d.previousExpiresAt)} — extended from the later of now and that date, so no access was lost.`
    : "The account had no live term before this — this is their first 90-day term.";
  const body = [
    "You switched on a paid term by hand from /admin/activate.",
    "",
    "── What was switched on ──",
    `Customer:  ${d.customerEmail}`,
    `Tier:      ${d.tierLabel} ($${d.price} one-time / ${d.termDays} days)`,
    `Access until: ${until}`,
    previous,
    "",
    `Marked as: MANUAL ACTIVATION (source = manual-owner-activation)`,
    `Activated by: ${d.activatedByEmail}`,
    `Activated at: ${formatTimestampUtc(d.activatedAt)}`,
    "",
    "This email is your record of the switch-on. Rows created this way are always",
    "distinguishable from Stripe-verified purchases, which are marked source =",
    "stripe-verified.",
    "",
    `Site: ${d.siteUrl}`,
    "",
    "— Champion Sales Training & Events (automated activation notice)",
  ].join("\n");
  return { subject, body };
}
