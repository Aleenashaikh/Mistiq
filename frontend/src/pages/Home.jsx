import Hero from '../components/Hero';
import HeroImagesSection from '../components/HeroImagesSection';
import AnnouncementBanner from '../components/AnnouncementBanner';
import ProductCategories from '../components/ProductCategories';
import CircularSlider from '../components/CircularSlider';
import Feedbacks from '../components/Feedbacks';
import SEO from '../components/SEO';
import './Home.css';

const Home = () => {
  return (
    <>
      <SEO 
        title="Mistiq Perfumeries - Luxury Fragrances & Premium Perfumes"
        description="Discover handcrafted luxury fragrances designed to match every personality. Shop premium perfumes with unique scents that tell your story. Find affordable designer perfume dupes and impressions of Gucci, Dior, Azzaro, and more."
        url="/"
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

