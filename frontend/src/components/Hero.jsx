import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import './Hero.css';

const Hero = () => {
  const [hero, setHero] = useState({
    title: 'Discover Scents That Tell Your Story',
    subtitle: 'Let your presence linger beautifully. Explore our handcrafted fragrances designed to match every personality.',
    backgroundImage: '',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Explore Collection',
  });
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Static video path - now from images folder
  const staticVideoPath = '/videos/perfume-hero.mp4';

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get('/api/products/hero');
        // Only use title, subtitle, backgroundImage, and button texts from API
        // Video is now static from images folder
        setHero({
          title: response.data.title || hero.title,
          subtitle: response.data.subtitle || hero.subtitle,
          backgroundImage: response.data.backgroundImage || '',
          primaryButtonText: response.data.primaryButtonText || 'Shop Now',
          secondaryButtonText: response.data.secondaryButtonText || 'Explore Collection',
        });
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
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata">
          <source src={staticVideoPath} type="video/mp4" />
        </video>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Loading...</h1>
          </div>
        </div>
      </section>
    );
  }

  // Determine if we should use image or video
  const hasImage = hero.backgroundImage && hero.backgroundImage.trim() !== '';

  return (
    <section className="hero">
      <div className="hero-video-overlay"></div>
      {hasImage ? (
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
      ) : !videoError ? (
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          onError={(e) => {
            console.error('Video load error:', e.target.error);
            setVideoError(true);
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
          }}
        >
          <source src={staticVideoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className="hero-image-background"
          style={{ 
            backgroundImage: `url(/images/logo.png)`,
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
          <Link to="/products" className="shop-btn">
            {hero.primaryButtonText || 'Shop Now'}
          </Link>
        
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

