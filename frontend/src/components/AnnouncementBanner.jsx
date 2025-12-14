import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import './AnnouncementBanner.css';

const AnnouncementBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get('/api/products/announcement');
        setBanner(response.data);
      } catch (error) {
        console.error('Error fetching announcement banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // Don't render if loading, inactive, or no banner
  if (loading || !banner || !banner.isActive) {
    return null;
  }

  // Create repeated text for seamless scrolling
  const repeatedText = Array(10).fill(banner.text).join(' • ');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="announcement-banner"
    >
      <div className="announcement-content">
        <span className="announcement-text">
          {repeatedText}
        </span>
      </div>
    </motion.div>
  );
};

export default AnnouncementBanner;

