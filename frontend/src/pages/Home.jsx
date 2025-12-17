import Hero from '../components/Hero';
import AnnouncementBanner from '../components/AnnouncementBanner';
import SplitSection from '../components/SplitSection';
import CircularSlider from '../components/CircularSlider';
import MovingText from '../components/MovingText';
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
        <SplitSection />
        <CircularSlider />
        <MovingText />
        <Feedbacks />
      </div>
    </>
  );
};

export default Home;

