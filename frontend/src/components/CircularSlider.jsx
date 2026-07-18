import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import axios from '../config/axios';
import { Button } from '@/components/ui/button';
import { getProductPath } from '@/lib/site';
import './CircularSlider.css';

const AUTOPLAY_MS = 3000;

const getFirstSentence = (text) => {
  if (!text || text.trim() === '') {
    return 'Discover this exquisite fragrance that captures the essence of luxury.';
  }
  const sentences = text.split(/[.!?]+/);
  const firstSentence = sentences[0].trim();
  if (firstSentence.length < 10) {
    return text.substring(0, 110).trim() + (text.length > 110 ? '…' : '');
  }
  return `${firstSentence}.`;
};

const getShortBlurb = (text) => {
  const full = getFirstSentence(text);
  if (full.length <= 110) return full;
  return `${full.slice(0, 106).trim()}…`;
};

const getPrice = (product) => {
  if (product.discountedPrice > 0) return product.discountedPrice;
  return product.actualPrice || product.price || null;
};

const CircularSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const resumeTimer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        const latestProducts = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setProducts(
          latestProducts.map((product) => {
            const raw =
              product.description ||
              `Experience ${product.name}, a captivating fragrance that embodies luxury and elegance.`;
            return {
              id: product._id,
              src: product.bottleImage || '/images/perfumes/placeholder.jpg',
              title: product.name,
              impressionOf: product.impressionOf,
              gender: product.gender,
              price: getPrice(product),
              compareAt:
                product.discountedPrice > 0
                  ? product.actualPrice || product.price
                  : null,
              description: getShortBlurb(raw),
              productPath: getProductPath(product),
            };
          })
        );
      } catch (error) {
        console.error('Error fetching products for slider:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const count = products.length;
  const step = count ? 360 / count : 0;

  const pauseBriefly = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), AUTOPLAY_MS + 600);
  }, []);

  const goTo = useCallback(
    (nextIndex, fromUser = false) => {
      if (!count) return;
      if (fromUser) pauseBriefly();
      setCurrentIndex(((nextIndex % count) + count) % count);
    },
    [count, pauseBriefly]
  );

  const next = useCallback(
    (fromUser = false) => goTo(currentIndex + 1, fromUser),
    [currentIndex, goTo]
  );
  const prev = useCallback(
    (fromUser = false) => goTo(currentIndex - 1, fromUser),
    [currentIndex, goTo]
  );

  useEffect(() => {
    if (!count || paused) return undefined;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStart.current == null || touchEnd.current == null) return;
    const d = touchStart.current - touchEnd.current;
    if (d > 40) next(true);
    else if (d < -40) prev(true);
  };

  if (loading) {
    return (
      <section className="orbit-slider">
        <div className="orbit-inner">
          <div className="orbit-loading">Loading fragrances…</div>
        </div>
      </section>
    );
  }

  if (!count) return null;

  const active = products[currentIndex];
  const ringRotation = -currentIndex * step;

  return (
    <section
      className="orbit-slider"
      aria-roledescription="carousel"
      aria-label="Featured fragrances"
    >
      <div className="orbit-inner">
        <div className="orbit-layout">
          {/* Left: product details (desktop + mobile) */}
          <div className="orbit-copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="orbit-copy-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="orbit-meta">
                  {active.gender && (
                    <span className="orbit-chip">{active.gender}</span>
                  )}
                  <span className="orbit-chip">50 mL</span>
                  <span className="orbit-counter" aria-live="polite">
                    {String(currentIndex + 1).padStart(2, '0')}
                    <span> / {String(count).padStart(2, '0')}</span>
                  </span>
                </div>

                <h2 className="orbit-title">
                  <Link to={active.productPath}>{active.title}</Link>
                </h2>

                {active.impressionOf && (
                  <p className="orbit-inspired">
                    Inspired by <em>{active.impressionOf}</em>
                  </p>
                )}

                <p className="orbit-description">{active.description}</p>

                {active.price != null && (
                  <div className="orbit-price">
                    {active.compareAt && active.compareAt > active.price && (
                      <span className="orbit-compare">Rs {active.compareAt}</span>
                    )}
                    <span className="orbit-amount">Rs {active.price}</span>
                  </div>
                )}

                <Button asChild size="lg" className="orbit-cta">
                  <Link to={active.productPath}>
                    View fragrance
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </motion.div>
            </AnimatePresence>

            <div className="orbit-controls">
              <button
                type="button"
                className="orbit-arrow"
                onClick={() => prev(true)}
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="orbit-dots">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`orbit-dot ${i === currentIndex ? 'is-active' : ''}`}
                    aria-label={p.title}
                    onClick={() => goTo(i, true)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="orbit-arrow"
                onClick={() => next(true)}
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right: half-circle wheel — one bottle on mobile */}
          <div
            className="orbit-viewport"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="orbit-guide" aria-hidden />

            <div className="orbit-pivot">
              <motion.div
                className="orbit-ring"
                animate={{ rotate: ringRotation }}
                transition={{
                  type: 'spring',
                  stiffness: 65,
                  damping: 16,
                  mass: 0.85,
                }}
              >
                {products.map((product, index) => {
                  const spokeAngle = index * step;
                  const dist = Math.min(
                    Math.abs(index - currentIndex),
                    count - Math.abs(index - currentIndex)
                  );
                  const isActive = index === currentIndex;

                  return (
                    <div
                      key={product.id}
                      className={`orbit-spoke ${isActive ? 'is-active' : ''}`}
                      style={{
                        transform: `rotate(${spokeAngle}deg)`,
                        zIndex: 20 - dist,
                      }}
                    >
                      <motion.div
                        className="orbit-card-wrap"
                        animate={{
                          rotate: -ringRotation - spokeAngle,
                          scale: isActive ? 1 : Math.max(0.78, 1 - dist * 0.08),
                          // Mobile: only the active bottle is visible
                          opacity: isActive
                            ? 1
                            : isMobile
                              ? 0
                              : Math.max(0.45, 1 - dist * 0.18),
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 65,
                          damping: 16,
                          mass: 0.85,
                        }}
                      >
                        <Link
                          to={product.productPath}
                          className="orbit-card"
                          tabIndex={isActive ? 0 : -1}
                          aria-hidden={!isActive}
                          onClick={(e) => {
                            if (!isActive) {
                              e.preventDefault();
                              goTo(index, true);
                            }
                          }}
                        >
                          <img
                            src={product.src}
                            alt={product.title}
                            draggable={false}
                            onError={(e) => {
                              if (!e.target.dataset.errorHandled) {
                                e.target.src = '/images/perfumes/placeholder.jpg';
                                e.target.dataset.errorHandled = 'true';
                              }
                            }}
                          />
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircularSlider;
