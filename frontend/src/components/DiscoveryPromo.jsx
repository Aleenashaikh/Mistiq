import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import './DiscoveryPromo.css';

const CONFETTI_COUNT = 36;

const DiscoveryPromo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.35 });
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3.5 + Math.random() * 3,
        size: 4 + Math.random() * 7,
        rotate: Math.random() * 360,
        tone: i % 4,
      }))
    );
  }, []);

  return (
    <section
      ref={ref}
      className={`discovery-promo ${isInView ? 'is-alive' : ''}`}
      aria-labelledby="discovery-promo-title"
    >
      <div className="discovery-promo-bg" aria-hidden>
        <img src="/images/split-section.png" alt="" />
        <div className="discovery-promo-veil" />
      </div>

      <div className="discovery-promo-confetti" aria-hidden>
        {pieces.map((p) => (
          <span
            key={p.id}
            className={`discovery-promo-piece tone-${p.tone}`}
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * (0.6 + (p.tone % 2) * 0.8),
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--rot': `${p.rotate}deg`,
            }}
          />
        ))}
      </div>

      <div className="discovery-promo-inner">
        <motion.p
          className="discovery-promo-brand"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Mistiq
        </motion.p>
        <motion.h2
          id="discovery-promo-title"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          A Taste of Five
        </motion.h2>
        <motion.p
          className="discovery-promo-lead"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.16 }}
        >
          Curate five 10ml testers of your favourite fragrances. Sample them all
          at home — then order the full bottles you can&apos;t live without.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.28 }}
        >
          <Link to="/discovery-set" className="discovery-promo-cta">
            Build Your Discovery Set
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DiscoveryPromo;
