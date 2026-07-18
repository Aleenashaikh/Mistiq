/** Discovery Set tester pricing — rate is backend-aligned; never surface in UI copy. */
export const TESTER_PRICE_RATE = 0.15;
export const DISCOVERY_SET_SIZE = 5;
export const TESTER_VOLUME_ML = 10;

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

export function getDiscoverySetTotal(products) {
  return products.reduce((sum, p) => sum + getTesterPrice(p), 0);
}
