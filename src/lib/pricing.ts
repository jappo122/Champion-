// ── Champion Sales Training — SINGLE SOURCE OF TRUTH FOR PRICING ────────────
//
// Business model (owner decision, 2026-10-30): ONE-TIME 90-DAY ACCESS TERMS.
// There is no recurring billing, no "per month" price and no free tier. A
// customer pays once and receives 90 days of access from the date the payment
// is verified; when the term ends their access ends with it and they can buy a
// fresh term.
//
// The SAME three prices apply to individual accounts, management accounts and
// every salesperson seat a manager adds. Nothing is billed per month.
//
// Every screen imports from this file. `api/handlers.mjs` (the Bun/Vercel API
// layer) imports it too, so the prices the customer reads and the prices the
// server enforces can never drift apart.
//
// This module must stay dependency-free and contain only erasable TypeScript
// syntax (no enums, no namespaces): the API layer loads it directly at runtime.

/** Length of one paid access term, in days. */
export const TERM_DAYS = 90;

/** Human label for a term. */
export const TERM_LABEL = "90 days";

/** What the term is called in customer-facing copy. */
export const TERM_DESCRIPTION = "one-time payment, 90 days of access";

export type Tier = "basic" | "plus" | "premium";

export const TIERS: Tier[] = ["basic", "plus", "premium"];

/** One-time price in US dollars for a full 90-day term. */
export const TIER_PRICES: Record<Tier, number> = {
  basic: 224,
  plus: 244,
  premium: 264,
};

/** Display label per tier. */
export const TIER_LABELS: Record<Tier, string> = {
  basic: "Basic",
  plus: "Plus",
  premium: "Premium",
};

/**
 * Live Stripe payment links. Each one is a ONE-TIME $224/$244/$264 charge for a
 * 90-day term and redirects to /signup/complete?session_id={CHECKOUT_SESSION_ID}
 * carrying metadata tier=basic|plus|premium and term_days=90.
 */
export const STRIPE_LINKS: Record<Tier, string> = {
  basic: "https://buy.stripe.com/cNiaEX9CSbvebLAgQf8Vi0l",
  plus: "https://buy.stripe.com/6oU00jdT8dDm3f443t8Vi0m",
  premium: "https://buy.stripe.com/5kQ8wP6qG7eYcPE57x8Vi0n",
};

/**
 * Stripe price ids behind those links. Used server-side to map a VERIFIED
 * checkout session back to a tier — never trusted from the client.
 */
export const STRIPE_PRICE_IDS: Record<Tier, string> = {
  basic: "price_1UWG4kDjYftjQLcOb3aKlRZd",
  plus: "price_1UWG5RDjYftjQLcOlwMemk6y",
  premium: "price_1UWG5vDjYftjQLcOavTLTbrT",
};

/** Reverse map: Stripe price id → tier. */
export const PRICE_ID_TIERS: Record<string, Tier> = {
  price_1UWG4kDjYftjQLcOb3aKlRZd: "basic",
  price_1UWG5RDjYftjQLcOlwMemk6y: "plus",
  price_1UWG5vDjYftjQLcOavTLTbrT: "premium",
};

/** Reverse map: one-time amount in cents → tier (Stripe `amount_total`). */
export const AMOUNT_TIERS: Record<number, Tier> = {
  22400: "basic",
  24400: "plus",
  26400: "premium",
};

/** Price range label used in marketing copy, e.g. "$224–$264". */
export const PRICE_RANGE = "$224–$264";

/** True when the value is one of our tiers. */
export function isTier(value: unknown): value is Tier {
  return value === "basic" || value === "plus" || value === "premium";
}

/** Normalise a tier-ish string ("Basic", "mgmt-plus") to a Tier, or null. */
export function normalizeTier(value: unknown): Tier | null {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^mgmt-/, "");
  return isTier(raw) ? raw : null;
}

/** One-time price for a tier (falls back to Basic for unknown input). */
export function priceForTier(tier: unknown): number {
  const t = normalizeTier(tier);
  return t ? TIER_PRICES[t] : TIER_PRICES.basic;
}

/** Stripe payment link for a tier (falls back to Basic for unknown input). */
export function stripeLinkForTier(tier: unknown): string {
  const t = normalizeTier(tier);
  return t ? STRIPE_LINKS[t] : STRIPE_LINKS.basic;
}

/** Tier behind a Stripe price id, or null. */
export function tierForPriceId(priceId: unknown): Tier | null {
  const id = String(priceId ?? "").trim();
  return PRICE_ID_TIERS[id] ?? null;
}

/** Tier behind a Stripe amount_total (cents), or null. */
export function tierForAmount(amountCents: unknown): Tier | null {
  return AMOUNT_TIERS[Number(amountCents)] ?? null;
}

/**
 * Expiry for a term starting now (or at `from`): exactly TERM_DAYS × 24 hours
 * later, i.e. payment time + 90 days (2160 hours). Not "90 calendar days at
 * midnight" — the clock starts at the moment Stripe verified the payment.
 */
export function termEndsAt(from: Date = new Date()): Date {
  return new Date(from.getTime() + TERM_DAYS * 24 * 60 * 60 * 1000);
}

/** "$224" — one-time price, no period suffix. */
export function priceLabel(tier: unknown): string {
  return `$${priceForTier(tier)}`;
}

/** "$224 for 90 days" — the standard one-time price phrase. */
export function priceWithTerm(tier: unknown): string {
  return `$${priceForTier(tier)} for ${TERM_DAYS} days`;
}
