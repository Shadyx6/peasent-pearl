// helpers to match product+category against an offer and pick the right rule

const norm = (v) => String(v || "").trim().toLowerCase();

const productMatchesOfferCategories = (product, offer) => {
  // If offer has no categories -> global
  if (!offer.categories || offer.categories.length === 0) return true;

  const pCat = norm(product.category);
  const pSub = norm(product.subcategory);

  // categories in offer are populated in admin view; on /active you may get only ids.
  // So allow both: {name} or just string id — when id case we only match by main category name you pass in product.
  return offer.categories.some((c) => {
    const name = c?.name ? norm(c.name) : null;
    // If your frontend products have only category names, match by name
    return name ? name === pCat : false;
  });
};

const getRuleForDifficulty = (offer, difficulty = "easy") => {
  const d = norm(difficulty || "easy");
  const rules = Array.isArray(offer.discountRules) ? offer.discountRules : [];
  const rule = rules.find(r => norm(r.difficulty) === d);
  return rule || null;
};

export const getDiscountForProduct = (product, activeOffers = []) => {
  // returns {percent, price} where price is discounted price (or original if no rule matches)
  const basePrice = Number(product.finalPrice ?? product.price ?? 0);
  if (!basePrice || !Array.isArray(activeOffers) || activeOffers.length === 0) {
    return { percent: 0, price: basePrice };
  }

  const difficulty = product.difficulty || "easy";

  // collect all applicable % from offers
  const percents = activeOffers
    .filter(o => o.active !== false && productMatchesOfferCategories(product, o))
    .map(o => getRuleForDifficulty(o, difficulty)?.discountPercentage)
    .filter(p => Number.isFinite(p) && p > 0);

  if (percents.length === 0) return { percent: 0, price: basePrice };

  // Choose your stacking rule: most shops take the **max** discount
  const percent = Math.max(...percents);
  const price = Math.max(0, +(basePrice * (1 - percent / 100)).toFixed(2));

  return { percent, price };
};
