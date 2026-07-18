/** Turn text into a URL-safe slug. */
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
 * Generate a unique product slug, appending -2, -3, … on collision.
 * @param {import('mongoose').Model} ProductModel
 * @param {string} name
 * @param {string|null} excludeId - product _id to ignore (on update)
 */
export async function ensureUniqueProductSlug(ProductModel, name, excludeId = null) {
  const base = slugify(name) || 'product';
  let candidate = base;
  let n = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await ProductModel.findOne(query).select('_id').lean();
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}
