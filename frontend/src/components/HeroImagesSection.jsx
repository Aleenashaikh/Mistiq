import { useState, useEffect } from 'react';
import axios from '../config/axios';
import './HeroImagesSection.css';

const HeroImagesSection = () => {
  const [images, setImages] = useState({
    heroDesktopImageUrl: '',
    heroMobileImageUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await axios.get('/api/products/hero');
        setImages({
          heroDesktopImageUrl:
            (data.heroDesktopImageUrl || data.backgroundImage || '').trim(),
          heroMobileImageUrl: (data.heroMobileImageUrl || '').trim(),
        });
      } catch (e) {
        console.error('Error fetching hero images:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const desktopSrc = images.heroDesktopImageUrl;
  const mobileSrc =
    images.heroMobileImageUrl || images.heroDesktopImageUrl;

  if (loading) {
    return (
      <section className="hero-images-section">
        <div className="hero-images-inner">
          <div className="hero-images-placeholder hero-images-placeholder--desktop" />
          <div className="hero-images-placeholder hero-images-placeholder--mobile" />
        </div>
      </section>
    );
  }

  if (!desktopSrc && !mobileSrc) {
    return null;
  }

  return (
    <section className="hero-images-section" aria-label="Promotional images">
      <div className="hero-images-inner">
        {/* Desktop: 1920×900 frame */}
        <div className="hero-images-viewport hero-images-viewport--desktop">
          <div className="hero-images-aspect hero-images-aspect--desktop">
            {desktopSrc && (
              <img
                src={desktopSrc}
                alt=""
                className="hero-images-img"
                decoding="async"
              />
            )}
          </div>
        </div>
        {/* Mobile: 800×900 frame */}
        <div className="hero-images-viewport hero-images-viewport--mobile">
          <div className="hero-images-aspect hero-images-aspect--mobile">
            {mobileSrc && (
              <img
                src={mobileSrc}
                alt=""
                className="hero-images-img"
                decoding="async"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImagesSection;
