import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import './Hero.css';

const staticVideoPath = '/videos/perfume-hero.mp4';

const Hero = () => {
  const [hero, setHero] = useState({
    title: 'Discover Scents That Tell Your Story',
    subtitle:
      'Let your presence linger beautifully. Explore our handcrafted fragrances designed to match every personality.',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Explore Collection',
  });
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await axios.get('/api/products/hero');
        setHero({
          title: data.title || hero.title,
          subtitle: data.subtitle || hero.subtitle,
          primaryButtonText: data.primaryButtonText || 'Shop Now',
          secondaryButtonText: data.secondaryButtonText || 'Explore Collection',
        });
      } catch (e) {
        console.error('Error fetching hero section:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="hero hero--below-nav">
        <div className="hero-video-wrap">
          <div className="hero-aspect hero-aspect--video hero-aspect--loading" />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Loading...</h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero hero--below-nav">
      <div className="hero-video-wrap">
        <div className="hero-video-overlay" />
        {!videoError ? (
          <video
            className="hero-media-el hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
          >
            <source src={staticVideoPath} type="video/mp4" />
          </video>
        ) : (
          <div
            className="hero-media-el hero-fallback"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15), var(--cream))',
            }}
          />
        )}
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hero-text"
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
