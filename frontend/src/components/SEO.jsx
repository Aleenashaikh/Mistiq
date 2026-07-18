import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../lib/site';

// Comprehensive base keywords
const getBaseKeywords = (impressionOf = '', productName = '', gender = '') => {
  // Brand name variations
  const brandVariations = [
    'Mistiq Perfumeries', 'Mistiq Perfumes', 'Mistiq Fragrances',
    'Mystiq Perfumeries', 'Mystiq Perfumes', 'Mystiq Fragrances',
    'Mistic Perfumeries', 'Mistic Perfumes', 'Mistic Fragrances',
    'Mystic Perfumeries', 'Mystic Perfumes', 'Mystic Fragrances',
    'Mistiq', 'Mystiq', 'Mistic', 'Mystic'
  ];

  // Common impressions from products
  const impressions = [
    'Gucci Flora', 'Miss Dior', 'Tuscan Leather', 'Azzaro Wanted', 'Sauvage Dior',
    'Gucci', 'Dior', 'Azzaro', 'Tom Ford', 'Versace', 'Prada', 'Chanel',
    'Yves Saint Laurent', 'YSL', 'Dolce Gabbana', 'D&G', 'Armani', 'Hugo Boss',
    'Calvin Klein', 'CK', 'Burberry', 'Hermes', 'Creed', 'Maison Margiela'
  ];

  // Impression variations
  const impressionKeywords = impressionOf ? [
    `impression of ${impressionOf}`,
    `impression ${impressionOf}`,
    `${impressionOf} impression`,
    `${impressionOf} dupe`,
    `${impressionOf} alternative`,
    `${impressionOf} inspired`,
    `${impressionOf} similar`,
    `${impressionOf} copy`,
    `${impressionOf} replica`,
    `dupe for ${impressionOf}`,
    `alternative to ${impressionOf}`,
    `similar to ${impressionOf}`,
    `inspired by ${impressionOf}`,
    `like ${impressionOf}`,
    `cheap ${impressionOf}`,
    `affordable ${impressionOf}`,
    `${impressionOf} perfume`,
    `${impressionOf} fragrance`,
    `${impressionOf} scent`
  ] : [];

  // Dupe variations
  const dupeKeywords = [
    'perfume dupes', 'fragrance dupes', 'scent dupes', 'perfume alternatives',
    'fragrance alternatives', 'designer perfume dupes', 'luxury perfume dupes',
    'affordable dupes', 'cheap dupes', 'best dupes', 'perfume copies',
    'fragrance replicas', 'perfume replicas', 'dupe perfumes', 'dupe fragrances',
    'designer dupes', 'high end dupes', 'perfume impressions', 'fragrance impressions'
  ];

  // Gender-specific keywords
  const genderKeywords = gender === 'Male' ? [
    'mens perfume', 'mens fragrance', 'mens cologne', 'mens scents',
    'men perfume', 'men fragrance', 'men cologne', 'men scents',
    'male perfume', 'male fragrance', 'male cologne', 'male scents',
    'for him', 'mens perfume dupes', 'mens fragrance dupes'
  ] : gender === 'Female' ? [
    'womens perfume', 'womens fragrance', 'womens scents',
    'women perfume', 'women fragrance', 'women scents',
    'female perfume', 'female fragrance', 'female scents',
    'ladies perfume', 'ladies fragrance', 'ladies scents',
    'for her', 'womens perfume dupes', 'womens fragrance dupes'
  ] : [];

  // Product-specific keywords
  const productKeywords = productName ? [
    productName, `${productName} perfume`, `${productName} fragrance`,
    `${productName} scent`, `buy ${productName}`, `${productName} review`
  ] : [];

  // Base keywords
  const baseKeywords = [
    // Perfume types
    'perfumes', 'fragrances', 'scents', 'colognes', 'eau de parfum', 'eau de toilette',
    'luxury perfumes', 'designer perfumes', 'premium perfumes', 'affordable perfumes',
    'cheap perfumes', 'budget perfumes', 'quality perfumes', 'long lasting perfumes',
    
    // Fragrance categories
    'floral perfumes', 'woody perfumes', 'citrus perfumes', 'oriental perfumes',
    'fresh perfumes', 'spicy perfumes', 'fruity perfumes', 'musky perfumes',
    'vanilla perfumes', 'leather perfumes', 'amber perfumes', 'sandalwood perfumes',
    
    // Shopping related
    'buy perfume online', 'perfume shop', 'fragrance store', 'perfume store',
    'online perfume store', 'perfume delivery', 'fragrance delivery',
    'perfume sale', 'fragrance sale', 'discount perfumes', 'perfume deals',
    
    // Location (if applicable - can be customized)
    'perfume Pakistan', 'fragrance Pakistan', 'perfumes in Pakistan',
    
    // General
    'best perfumes', 'top perfumes', 'popular perfumes', 'trending perfumes',
    'new perfumes', 'latest perfumes', 'perfume collection', 'fragrance collection',
    'signature scent', 'signature fragrance', 'everyday perfume', 'special occasion perfume'
  ];

  // Combine all keywords
  const allKeywords = [
    ...brandVariations,
    ...impressions,
    ...impressionKeywords,
    ...dupeKeywords,
    ...genderKeywords,
    ...productKeywords,
    ...baseKeywords
  ];

  // Remove duplicates and join
  return [...new Set(allKeywords)].join(', ');
};

const SEO = ({ 
  title = 'Mistiq Perfumeries - Luxury Fragrances',
  description = 'Discover handcrafted luxury fragrances designed to match every personality. Shop premium perfumes with unique scents that tell your story.',
  image = '/images/logo.png',
  url = '',
  type = 'website',
  keywords = '',
  impressionOf = '',
  productName = '',
  gender = '',
  jsonLd = [],         // Array of JSON-LD objects to inject
  canonical = '',      // Override canonical if needed
}) => {
  const location = useLocation();
  const gscVerification = import.meta.env.VITE_GSC_VERIFICATION || '';

  // Prefer explicit path; otherwise use current route (pathname + search)
  const path =
    url ||
    `${location.pathname}${location.search || ''}` ||
    '/';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`;
  const canonicalUrl = canonical || fullUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  // Use provided keywords or generate comprehensive keywords
  const finalKeywords = keywords || getBaseKeywords(impressionOf, productName, gender);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Mistiq Perfumeries" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Google Search Console verification (set VITE_GSC_VERIFICATION) */}
      {gscVerification ? (
        <meta name="google-site-verification" content={gscVerification} />
      ) : null}

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="PK" />
      <meta name="geo.placename" content="Pakistan" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Mistiq Perfumeries" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
