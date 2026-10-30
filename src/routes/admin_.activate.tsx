import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SiteHeader } from "~/components/site-header";
import { TERM_DAYS, TIER_LABELS, TIER_PRICES, type Tier } from "~/lib/pricing";

// ── OWNER-ONLY: manual activation ───────────────────────────────────────────
// Why this page exists: Stripe cannot call the site back (no API key, no
// webhook on the connected account), so a real payment can never unlock an
// account by itself. The owner takes the payment, then switches the 90-day term
// on here.
//
// The gate is SERVER-SIDE. This page is a form; /api/ownerActivate and
// /api/ownerListAccounts answer 403 to every non-owner caller from BOTH API
// layers (serve.ts on Bun and api/ssr.mjs on Vercel). Nothing here grants
// anything on its own — the page cannot even load its data without a 200.
//
// It is deliberately not linked from the public navigation and carries
// noindex, nofollow.

const TIER_ORDER: Tier[] = ["basic", "plus", "premium"];

type ApiResult = Record<string, any>;

async function post(name: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  let body: ApiResult = {};
  try {
    body = (await res.json()) as ApiResult;
  } catch {
    body = {};
  }
  return { status: res.status, ok: res.ok, body };
}

export const Route = createFileRoute("/admin_/activate")({
  head: () => ({
    meta: [
      { title: "Owner — Manual Activation | Champion Sales Training & Events" },
      // Owner-only admin surface: keep it out of every index.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OwnerActivatePage,
});

type View = "loading" | "anon" | "forbidden" | "ready" | "error";

interface AccountRow {
  id: number;
  email: string;
  name: string | null;
  role: string;
  tier: string | null;
  status: string | null;
  active: boolean;
  demo: boolean;
  expiresAt: string | null;
  expiresAtWords: string | null;
  daysRemaining: number | null;
  source: string | null;
  manual: boolean;
}

function OwnerActivatePage() {
  const [view, setView] = useState<View>("loading");
  const [loadError, setLoadError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<Tier>("premium");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [alertTo, setAlertTo] = useState<string[]>([]);

  async function load(storedToken: string) {
    const { status, body } = await post("ownerListAccounts", { token: storedToken });
    if (status === 403) {
      setView("forbidden");
      return;
    }
    if (status === 401) {
      setView("anon");
      return;
    }
    if (!body?.success) {
      setLoadError(body?.error || "Could not load accounts.");
      setView("error");
      return;
    }
    setAccounts((body.accounts || []) as AccountRow[]);
    setAlertTo((body.alertRecipients || []) as string[]);
    setView("ready");
  }

  useEffect(() => {
    const stored =
      localStorage.getItem("salesdrive_token") ?? localStorage.getItem("auth-token");
    if (!stored) {
      setView("anon");
      return;
    }
    setToken(stored);
    load(stored).catch(() => {
      setLoadError("Could not reach the server.");
      setView("error");
    });
  }, []);

  async function activate() {
    if (!token || busy) return;
    setBusy(true);
    setResult(null);
    setResultError(null);
    try {
      const { status, body } = await post("ownerActivate", { token, email, tier });
      if (status === 403) {
        setView("forbidden");
        return;
      }
      if (body?.success) {
        setResult(body);
        // Refresh the table so the new expiry shows immediately.
        await load(token);
      } else {
        setResultError(body?.error || "Activation failed.");
      }
    } catch {
      setResultError("Could not reach the server.");
    }
    setBusy(false);
  }

  const tierOptions = useMemo(
    () => TIER_ORDER.map((t) => ({ id: t, label: TIER_LABELS[t], price: TIER_PRICES[t] })),
    [],
  );

  const shell = (children: ReactNode) => (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );

  if (view === "loading") {
    return shell(<p className="text-slate-400">Checking your account…</p>);
  }

  if (view === "anon") {
    return shell(
      <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
        <h1 className="text-2xl font-bold text-white">Owner activation</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with an owner account to use this page.</p>
        <a
          href="/login"
          className="mt-5 inline-block rounded-lg bg-[#e63946] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c1121f]"
        >
          Sign in
        </a>
      </div>,
    );
  }

  if (view === "forbidden") {
    return shell(
      <div className="rounded-xl border border-[#e63946]/40 bg-[#e63946]/5 p-6">
        <h1 className="text-2xl font-bold text-white">Not authorised</h1>
        <p className="mt-2 text-sm text-slate-300">
          This page is for the account owner only. Your account does not have access to it, and the
          server refused the request.
        </p>
        <a href="/training" className="mt-5 inline-block text-sm text-[#e63946] hover:underline">
          Go to your training
        </a>
      </div>,
    );
  }

  if (view === "error") {
    return shell(
      <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
        <h1 className="text-2xl font-bold text-white">Owner activation</h1>
        <p className="mt-2 text-sm text-slate-300">{loadError}</p>
      </div>,
    );
  }

  return shell(
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Owner — manual activation</h1>
        <span className="rounded-full border border-[#1a2d4a] px-3 py-1 text-xs text-slate-400">
          {TERM_DAYS}-day terms · owner only
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        Switch on a paid {TERM_DAYS}-day term by hand after you have confirmed the payment in Stripe.
        Activation always extends from the later of today and the customer's current expiry, so it
        can never shorten anyone's access. Every activation is marked as manual and is emailed to{" "}
        {alertTo.length > 0 ? alertTo.join(", ") : "the owner"}.
      </p>

      {/* ── Activate ── */}
      <section className="mt-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Activate an account</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Customer email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              autoComplete="off"
              className="w-full rounded-lg border border-[#2a4a6a] bg-[#0a1628] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#e63946] focus:outline-none"
            />
          </label>
          <button
            onClick={activate}
            disabled={busy || !email.trim()}
            className="h-[42px] rounded-lg bg-[#e63946] px-6 text-sm font-semibold text-white transition hover:bg-[#c1121f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Activating…" : `Activate ${TERM_DAYS} days`}
          </button>
        </div>

        <div className="mt-4">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Tier
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            {tierOptions.map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  tier === t.id
                    ? "border-[#e63946] bg-[#e63946]/5"
                    : "border-[#2a4a6a] hover:border-[#3a5a7a]"
                }`}
              >
                <span className="block text-sm font-semibold text-white">{t.label}</span>
                <span className="block text-xs text-slate-400">${t.price} one-time</span>
              </button>
            ))}
          </div>
        </div>

        {result?.success && (
          <div className="mt-5 rounded-lg border border-green-500/40 bg-green-500/10 p-4">
            <p className="text-sm font-semibold text-green-300">{result.message}</p>
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs text-slate-300 sm:grid-cols-2">
              <div>
                <dt className="inline text-slate-500">Customer: </dt>
                <dd className="inline">{result.email}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Tier: </dt>
                <dd className="inline">
                  {result.tierLabel} (${result.price})
                </dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Access until: </dt>
                <dd className="inline">{result.expiresAtWords}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Marked as: </dt>
                <dd className="inline">manual activation</dd>
              </div>
              {result.extended && result.previousExpiresAtWords && (
                <div className="sm:col-span-2">
                  <dt className="inline text-slate-500">Extended: </dt>
                  <dd className="inline">
                    moved from {result.previousExpiresAtWords} to {result.expiresAtWords} (nothing lost)
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="inline text-slate-500">Training gate: </dt>
                <dd className="inline">
                  {result.subscribedNow ? `open — ${result.gateTier} tier` : "still closed"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="inline text-slate-500">Owner email: </dt>
                <dd className="inline">
                  {result.ownerAlertSent
                    ? `sent to ${(result.ownerAlertTo || []).join(", ")}`
                    : `not sent (${result.ownerAlertError || "unknown error"})`}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {resultError && (
          <div className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
            <p className="text-sm text-amber-200">{resultError}</p>
          </div>
        )}
      </section>

      {/* ── Every account ── */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white">All accounts</h2>
        <p className="mt-1 text-sm text-slate-400">
          {accounts.filter((a) => a.active).length} active of {accounts.length}. Days remaining counts
          down to the paid term's expiry.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-[#1a2d4a]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#0d1f35] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Days left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2d4a]">
              {accounts.map((a) => (
                <tr key={a.id} className="bg-[#0a1628]">
                  <td className="px-4 py-3 text-slate-200">
                    <span className="block truncate">{a.email}</span>
                    {a.manual && (
                      <span className="mt-0.5 inline-block rounded bg-[#e63946]/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#e63946]">
                        manual activation
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-300">{a.tier || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        a.active
                          ? "rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-300"
                          : "rounded-full bg-slate-500/15 px-2 py-0.5 text-xs text-slate-400"
                      }
                    >
                      {a.demo ? "owner / demo" : a.active ? "active" : a.status || "inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {a.demo ? "no expiry" : a.expiresAtWords || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {a.demo ? "—" : a.daysRemaining === null ? "—" : a.daysRemaining}
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No accounts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>,
  );
}
