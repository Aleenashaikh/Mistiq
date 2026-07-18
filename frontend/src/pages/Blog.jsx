import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Blog.css';

const placeholderPosts = [
  {
    slug: 'how-to-choose-your-signature-scent',
    title: 'How to Choose Your Signature Scent',
    excerpt:
      'A practical guide to finding a fragrance that feels like you — from top notes to lasting impression.',
  },
  {
    slug: 'perfume-dupes-vs-designer-fragrances',
    title: 'Perfume Dupes vs Designer Fragrances',
    excerpt:
      'What “impression” really means, how longevity compares, and when a dupe is the smarter buy.',
  },
  {
    slug: 'layering-fragrances-for-everyday-wear',
    title: 'Layering Fragrances for Everyday Wear',
    excerpt:
      'Simple layering tips so your scent lasts longer and evolves beautifully through the day.',
  },
];

const Blog = () => {
  return (
    <>
      <SEO
        title="Fragrance Blog - Mistiq Perfumeries | Perfume Tips & Guides"
        description="Explore perfume tips, scent guides, and fragrance stories from Mistiq Perfumeries. Learn how to choose, wear, and love luxury-inspired scents."
        url="/blog"
      />
      <div className="blog-page">
        <div className="blog-hero">
          <h1>Fragrance Journal</h1>
          <p>
            Guides, scent stories, and perfume tips — coming soon. Content that helps you
            discover the perfect fragrance.
          </p>
        </div>
        <div className="blog-list">
          {placeholderPosts.map((post) => (
            <article key={post.slug} className="blog-card">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="blog-card-status">Coming soon</span>
            </article>
          ))}
        </div>
        <div className="blog-cta">
          <Link to="/products" className="blog-shop-link">
            Shop the collection
          </Link>
        </div>
      </div>
    </>
  );
};

export default Blog;
