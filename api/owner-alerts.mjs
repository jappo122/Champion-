const ADMIN_NOTIFY_EMAILS = ["Floydsandersjr@yahoo.com"];
const OWNER_ACCOUNT_IDS = [1, 2, 4, 5];
const OWNER_ALERT_FROM = "Sales@championsalestrainingandevents.com";
function ownerAlertRedirect() {
  const raw = String(process.env.OWNER_ALERT_TEST_REDIRECT ?? "").trim();
  return raw || null;
}
function ownerAlertRecipients() {
  const redirect = ownerAlertRedirect();
  if (redirect) {
    return redirect.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return ADMIN_NOTIFY_EMAILS.slice();
}
async function sendOwnerAlert({
  subject,
  body,
  replyTo
}) {
  const to = ownerAlertRecipients();
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[owner-alert] RESEND_API_KEY is not set \u2014 owner alert NOT sent:", subject);
    return { ok: false, id: null, status: null, error: "RESEND_API_KEY is not set", to };
  }
  const payload = {
    from: OWNER_ALERT_FROM,
    to,
    subject,
    text: body
  };
  if (replyTo) payload.reply_to = replyTo;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
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
        to
      };
    }
    console.log("[owner-alert] sent:", parsed?.id || "(no id)", "\u2192", to.join(","), "|", subject);
    return { ok: true, id: parsed?.id ?? null, status: res.status, error: null, to };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[owner-alert] Resend request failed:", message);
    return { ok: false, id: null, status: null, error: message, to };
  }
}
function formatDateWords(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}
function formatTimestampUtc(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}
function daysRemaining(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const ms = d.getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1e3));
}
function buildUnverifiedCheckoutAlert(d) {
  const who = d.customerEmail || "customer email unknown";
  const tierLine = d.tierLabel ? `${d.tierLabel}${d.amountCents ? ` ($${(d.amountCents / 100).toFixed(2)} one-time / 90 days)` : ""}` : "tier unknown \u2014 not recorded before checkout";
  const subject = `Payment to confirm \u2014 ${who} \u2014 ${d.tierLabel || "tier unknown"}`;
  const body = [
    "A customer came back from Stripe to the site just now.",
    "",
    "*** UNVERIFIED \u2014 PLEASE CONFIRM THE PAYMENT IN STRIPE BEFORE ACTIVATING ***",
    "This is a notification that a checkout completed, NOT proof that money arrived.",
    "The site cannot ask Stripe whether this checkout was paid (no API key and no",
    "webhook are configured), so nothing was activated automatically and the",
    "customer's account is untouched.",
    "",
    "\u2500\u2500 What we know \u2500\u2500",
    `Customer email: ${d.customerEmail || "UNKNOWN \u2014 no pending checkout record matched this session"}`,
    `Tier:           ${tierLine}`,
    `Amount:         ${d.amountCents ? `$${(d.amountCents / 100).toFixed(2)} (recorded when they left for Stripe)` : "unknown"}`,
    `Checkout id:    ${d.sessionId}`,
    `Returned at:    ${formatTimestampUtc(d.receivedAt)}`,
    d.matchedPending && d.pendingRecordedAt ? `Matched to the pending checkout record created ${formatTimestampUtc(d.pendingRecordedAt)}.` : "No pending checkout record matched this session id \u2014 treat the email/tier above as unconfirmed.",
    "",
    "\u2500\u2500 What to do \u2500\u2500",
    "1. Open Stripe and confirm the payment for the checkout id above.",
    "2. If it is paid, sign in as the owner and open /admin/activate on the site,",
    "   enter the customer's email, choose the tier, and press Activate.",
    "   That grants exactly 90 days of access and marks the row as a manual",
    "   activation so it is always distinguishable from a Stripe-verified one.",
    "3. If it is not paid, do nothing \u2014 no access was granted.",
    "",
    `Site: ${d.siteUrl}`,
    "",
    "\u2014 Champion Sales Training & Events (automated payment notification)"
  ].join("\n");
  return { subject, body };
}
function buildManualActivationAlert(d) {
  const until = formatDateWords(d.expiresAt);
  const subject = `Access activated manually \u2014 ${d.customerEmail} \u2014 ${d.tierLabel} until ${until}`;
  const previous = d.previousExpiresAt ? `Previous term ended ${formatDateWords(d.previousExpiresAt)} \u2014 extended from the later of now and that date, so no access was lost.` : "The account had no live term before this \u2014 this is their first 90-day term.";
  const body = [
    "You switched on a paid term by hand from /admin/activate.",
    "",
    "\u2500\u2500 What was switched on \u2500\u2500",
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
    "\u2014 Champion Sales Training & Events (automated activation notice)"
  ].join("\n");
  return { subject, body };
}
export {
  ADMIN_NOTIFY_EMAILS,
  OWNER_ACCOUNT_IDS,
  OWNER_ALERT_FROM,
  buildManualActivationAlert,
  buildUnverifiedCheckoutAlert,
  daysRemaining,
  formatDateWords,
  formatTimestampUtc,
  ownerAlertRecipients,
  ownerAlertRedirect,
  sendOwnerAlert
};
