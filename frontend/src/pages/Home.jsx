import Hero from '../components/Hero';
import HeroImagesSection from '../components/HeroImagesSection';
import AnnouncementBanner from '../components/AnnouncementBanner';
import ProductCategories from '../components/ProductCategories';
import CircularSlider from '../components/CircularSlider';
import Feedbacks from '../components/Feedbacks';
import SEO from '../components/SEO';
import './Home.css';

const siteUrl = 'https://www.mistiq-perfumeries.com';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mistiq Perfumeries',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  description: 'Luxury fragrance house offering premium perfume impressions of designer scents.',
  sameAs: [
    'https://www.instagram.com/mistiqperfumeries',
    'https://www.facebook.com/mistiqperfumeries',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    areaServed: 'PK',
    availableLanguage: 'English',
  },
};

const Home = () => {
  return (
    <>
      <SEO 
        title="Mistiq Perfumeries - Luxury Fragrances & Premium Perfumes"
        description="Discover handcrafted luxury fragrances designed to match every personality. Shop premium perfumes with unique scents that tell your story. Find affordable designer perfume dupes and impressions of Gucci, Dior, Azzaro, and more."
        url="/"
        jsonLd={[organizationJsonLd]}
      />
      <div className="home">
        <Hero />
        <AnnouncementBanner />
        <HeroImagesSection />
        <ProductCategories />
        <CircularSlider />
        <Feedbacks />
      </div>
    </>
  );
};

export default Home;

