/**
 * Backfill unique human-readable slugs for existing products.
 * Usage: node scripts/backfillProductSlugs.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { ensureUniqueProductSlug } from '../utils/slugify.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({}).select('name slug');
  let updated = 0;

  for (const product of products) {
    if (product.slug) continue;
    product.slug = await ensureUniqueProductSlug(Product, product.name, product._id);
    await product.save();
    updated += 1;
    console.log(`Slug set: ${product.name} → ${product.slug}`);
  }

  console.log(`Done. Updated ${updated} product(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
