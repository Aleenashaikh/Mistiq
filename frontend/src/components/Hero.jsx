import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
  const [hero, setHero] = useState({
    title: 'Discover Scents That Tell Your Story',
    subtitle: 'Let your presence linger beautifully. Explore our handcrafted fragrances designed to match every personality.',
    backgroundImage: '',
    backgroundVideo: '/videos/perfume-hero.mp4',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Vote Your Favorite',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get('/api/products/hero');
        setHero(response.data);
      } catch (error) {
        console.error('Error fetching hero section:', error);
        // Use default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-video-overlay"></div>
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/videos/perfume-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Loading...</h1>
          </div>
        </div>
      </section>
    );
  }

  // Determine video source - prioritize uploaded video, fallback to default
  const hasVideo = hero.backgroundVideo && hero.backgroundVideo.trim() !== '';
  const hasImage = hero.backgroundImage && hero.backgroundImage.trim() !== '';

  return (
    <section className="hero">
      <div className="hero-video-overlay"></div>
      {hasVideo ? (
        <video 
          key={hero.backgroundVideo} // Force re-render when video changes
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onError={(e) => {
            console.error('Video load error:', e.target.error, 'Source:', hero.backgroundVideo);
            // Fallback to default video if uploaded video fails
            const video = e.target;
            if (video.currentSrc && !video.currentSrc.includes('perfume-hero.mp4')) {
              video.src = '/videos/perfume-hero.mp4';
              video.load();
            }
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully:', hero.backgroundVideo);
          }}
        >
          <source src={hero.backgroundVideo} type="video/mp4" />
          <source src={hero.backgroundVideo} type="video/webm" />
          <source src={hero.backgroundVideo} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      ) : hasImage ? (
        <div 
          className="hero-image-background"
          style={{ 
            backgroundImage: `url(${hero.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />
      ) : (
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/videos/perfume-hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hero-text"
          style={{ width: '100%' }}
        >
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-buttons"
        >
          <Link to="/products" className="btn btn-primary">
            {hero.primaryButtonText || 'Shop Now'}
          </Link>
          <Link to="/products" className="btn btn-secondary">
            {hero.secondaryButtonText || 'Vote Your Favorite'}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

