/** Canonical production origin — never use vercel.app URLs in SEO tags. */
export const SITE_URL = 'https://www.mistiq-perfumeries.com';

/** Turn a product name into a URL-safe slug. */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Human-readable product path: /products/{slug}
 * Falls back to MongoDB id only if slug/name are unavailable.
 */
export function getProductPath(product) {
  if (!product) return '/products';
  const slug = product.slug || slugify(product.name);
  return `/products/${slug || product._id}`;
}

/** Absolute URL for a path (must start with /). */
export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
