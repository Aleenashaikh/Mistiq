/** Tester / discovery-set pricing. Keep client-facing copy free of this rate. */
export const TESTER_PRICE_RATE = 0.15;

export function getProductEffectivePrice(product) {
  if (!product) return 0;
  if (product.discountedPrice != null && product.discountedPrice > 0) {
    return product.discountedPrice;
  }
  return product.actualPrice || product.price || 0;
}

export function getTesterPrice(product) {
  return Math.round(getProductEffectivePrice(product) * TESTER_PRICE_RATE);
}
