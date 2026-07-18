/**
 * sitemapRoutes.js
 * Serves /sitemap.xml with static + dynamic product routes.
 * Auto-regenerates on each request so new products appear immediately.
 */

import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

const SITE_URL = 'https://www.mistiq-perfumeries.com';

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/products', priority: '0.9', changefreq: 'daily' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
  { loc: '/feedback', priority: '0.5', changefreq: 'monthly' },
];

router.get('/', async (req, res) => {
  try {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch visible products to build dynamic URLs
    let products = [];
    try {
      products = await Product.find({ isVisible: true }, '_id slug name updatedAt').lean();
    } catch (_) {
      // DB failure? serve static-only sitemap gracefully
    }

    const urls = [
      // Static pages
      ...staticRoutes.map(
        ({ loc, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      ),
      // Dynamic product pages (prefer human-readable slug)
      ...products.map((p) => {
        const lastmod = p.updatedAt
          ? new Date(p.updatedAt).toISOString().split('T')[0]
          : now;
        const slug =
          p.slug ||
          String(p.name || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') ||
          p._id;
        return `
  <url>
    <loc>${SITE_URL}/products/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('[Sitemap] Error generating sitemap:', err.message);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

export default router;
