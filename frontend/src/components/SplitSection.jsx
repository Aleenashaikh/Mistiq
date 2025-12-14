import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './SplitSection.css';

const SplitSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="split-section">
      <div className="split-container">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="split-image"
        >
          <img src="/images/split-section.png" alt="Luxury Perfume" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="split-content"
        >
          <h2 className="split-title">Our Signature Blends</h2>
          <p className="split-description">
            These are our most loved fragrances—crafted with rare ingredients, balanced with precision, and perfected over time.
          </p>
          <div className="split-features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <h3>Premium Ingredients</h3>
                <p>Sourced from the finest natural extracts.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏱️</span>
              <div>
                <h3>Long-Lasting Scents</h3>
                <p>Designed to stay with you all day.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌿</span>
              <div>
                <h3>Cruelty-Free</h3>
                <p>Because luxury should never harm.</p>
              </div>
            </div>
           
          </div>
        </motion.div>
      </div>
      <div className="gold-separator"></div>
    </section>
  );
};

export default SplitSection;

