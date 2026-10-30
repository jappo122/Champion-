const TERM_DAYS = 90;
const TERM_LABEL = "90 days";
const TERM_DESCRIPTION = "one-time payment, 90 days of access";
const TIERS = ["basic", "plus", "premium"];
const TIER_PRICES = {
  basic: 224,
  plus: 244,
  premium: 264
};
const TIER_LABELS = {
  basic: "Basic",
  plus: "Plus",
  premium: "Premium"
};
const STRIPE_LINKS = {
  basic: "https://buy.stripe.com/cNiaEX9CSbvebLAgQf8Vi0l",
  plus: "https://buy.stripe.com/6oU00jdT8dDm3f443t8Vi0m",
  premium: "https://buy.stripe.com/5kQ8wP6qG7eYcPE57x8Vi0n"
};
const STRIPE_PRICE_IDS = {
  basic: "price_1UWG4kDjYftjQLcOb3aKlRZd",
  plus: "price_1UWG5RDjYftjQLcOlwMemk6y",
  premium: "price_1UWG5vDjYftjQLcOavTLTbrT"
};
const PRICE_ID_TIERS = {
  price_1UWG4kDjYftjQLcOb3aKlRZd: "basic",
  price_1UWG5RDjYftjQLcOlwMemk6y: "plus",
  price_1UWG5vDjYftjQLcOavTLTbrT: "premium"
};
const AMOUNT_TIERS = {
  22400: "basic",
  24400: "plus",
  26400: "premium"
};
const PRICE_RANGE = "$224\u2013$264";
function isTier(value) {
  return value === "basic" || value === "plus" || value === "premium";
}
function normalizeTier(value) {
  const raw = String(value ?? "").trim().toLowerCase().replace(/^mgmt-/, "");
  return isTier(raw) ? raw : null;
}
function priceForTier(tier) {
  const t = normalizeTier(tier);
  return t ? TIER_PRICES[t] : TIER_PRICES.basic;
}
function stripeLinkForTier(tier) {
  const t = normalizeTier(tier);
  return t ? STRIPE_LINKS[t] : STRIPE_LINKS.basic;
}
function tierForPriceId(priceId) {
  const id = String(priceId ?? "").trim();
  return PRICE_ID_TIERS[id] ?? null;
}
function tierForAmount(amountCents) {
  return AMOUNT_TIERS[Number(amountCents)] ?? null;
}
function termEndsAt(from = /* @__PURE__ */ new Date()) {
  return new Date(from.getTime() + TERM_DAYS * 24 * 60 * 60 * 1e3);
}
function priceLabel(tier) {
  return `$${priceForTier(tier)}`;
}
function priceWithTerm(tier) {
  return `$${priceForTier(tier)} for ${TERM_DAYS} days`;
}
export {
  AMOUNT_TIERS,
  PRICE_ID_TIERS,
  PRICE_RANGE,
  STRIPE_LINKS,
  STRIPE_PRICE_IDS,
  TERM_DAYS,
  TERM_DESCRIPTION,
  TERM_LABEL,
  TIERS,
  TIER_LABELS,
  TIER_PRICES,
  isTier,
  normalizeTier,
  priceForTier,
  priceLabel,
  priceWithTerm,
  stripeLinkForTier,
  termEndsAt,
  tierForAmount,
  tierForPriceId
};
