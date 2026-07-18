import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Sparkles, Check } from 'lucide-react';
import axios from '../config/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import {
  DISCOVERY_SET_SIZE,
  TESTER_VOLUME_ML,
  getTesterPrice,
  getDiscoverySetTotal,
} from '../lib/bundlePricing';
import './DiscoverySet.css';

const EMPTY_SLOTS = Array.from({ length: DISCOVERY_SET_SIZE }, () => null);

const DiscoverySet = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState(EMPTY_SLOTS);
  const [openSlot, setOpenSlot] = useState(null);
  const [burst, setBurst] = useState(false);
  const dropdownRef = useRef(null);
  const { addDiscoverySet } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/products')
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => showToast('Could not load fragrances. Please try again.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenSlot(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const selectedIds = slots.filter(Boolean).map((p) => p._id);
  const filledCount = selectedIds.length;
  const isComplete = filledCount === DISCOVERY_SET_SIZE;
  const setTotal = getDiscoverySetTotal(slots.filter(Boolean));

  const selectProduct = (slotIndex, product) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = product;
      return next;
    });
    setOpenSlot(null);
  };

  const clearSlot = (slotIndex) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const handleAddToBag = () => {
    if (!isComplete) {
      showToast('Choose all five fragrances to complete your set.', 'error');
      return;
    }

    const priced = slots.map((product) => ({
      ...product,
      price: getTesterPrice(product),
    }));

    addDiscoverySet(priced);
    setBurst(true);
    showToast('Discovery Set added to your bag.', 'success');
    setTimeout(() => navigate('/cart'), 900);
  };

  const availableForSlot = (slotIndex) => {
    const currentId = slots[slotIndex]?._id;
    return products.filter(
      (p) => p._id === currentId || !selectedIds.includes(p._id)
    );
  };

  return (
    <>
      <SEO
        title="Discovery Set — Taste Five Favourites | Mistiq"
        description="Curate five 10ml perfume testers. Sample your favourites at home, then order the full bottles you love. A taste of Mistiq before you commit."
        url="/discovery-set"
      />

      <div className="discovery-page">
        <section className="discovery-hero" aria-labelledby="discovery-hero-title">
          <div className="discovery-hero-media" aria-hidden>
            <img
              src="/images/split-section.png"
              alt=""
              className="discovery-hero-img"
            />
            <div className="discovery-hero-veil" />
          </div>
          <div className="discovery-hero-copy">
            <p className="discovery-eyebrow">
              <Sparkles size={14} aria-hidden /> New · Limited experience
            </p>
            <h1 id="discovery-hero-title">A Taste of Five</h1>
            <p className="discovery-hero-lead">
              Can&apos;t choose just one? Sample five of your favourites in
              elegant 10ml testers — wear them, live in them, then come back for
              the full bottles that stole your heart.
            </p>
            <div className="discovery-hero-pills" aria-hidden>
              <span>5 fragrances</span>
              <span>{TESTER_VOLUME_ML}ml each</span>
              <span>Try before you commit</span>
            </div>
          </div>
        </section>

        <section className="discovery-builder" aria-labelledby="builder-title">
          <div className="discovery-builder-head">
            <h2 id="builder-title">Compose your Discovery Set</h2>
            <p>
              Pick five distinct scents from the collection. Each arrives as a
              travel-ready {TESTER_VOLUME_ML}ml tester — perfect for discovering
              what truly becomes you.
            </p>
            <div
              className="discovery-progress"
              role="status"
              aria-live="polite"
            >
              <div className="discovery-progress-track">
                <div
                  className="discovery-progress-fill"
                  style={{ width: `${(filledCount / DISCOVERY_SET_SIZE) * 100}%` }}
                />
              </div>
              <span>
                {filledCount} of {DISCOVERY_SET_SIZE} selected
              </span>
            </div>
          </div>

          {loading ? (
            <p className="discovery-loading">Gathering the collection…</p>
          ) : (
            <div className="discovery-slots" ref={dropdownRef}>
              {slots.map((selected, index) => {
                const isOpen = openSlot === index;
                const options = availableForSlot(index);

                return (
                  <div
                    key={index}
                    className={`discovery-slot ${selected ? 'is-filled' : ''} ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="discovery-slot-trigger"
                      aria-expanded={isOpen}
                      aria-label={
                        selected
                          ? `Change scent ${index + 1}: ${selected.name}`
                          : `Choose scent ${index + 1}`
                      }
                      onClick={() => setOpenSlot(isOpen ? null : index)}
                    >
                      <span className="discovery-slot-num">{index + 1}</span>
                      {selected ? (
                        <span className="discovery-slot-product">
                          <img
                            src={selected.bottleImage || '/images/perfumes/placeholder.jpg'}
                            alt=""
                            loading="lazy"
                          />
                          <span className="discovery-slot-meta">
                            <strong>{selected.name}</strong>
                            <em>
                              {TESTER_VOLUME_ML}ml · Rs {getTesterPrice(selected)}
                            </em>
                          </span>
                        </span>
                      ) : (
                        <span className="discovery-slot-empty">
                          <span>Choose a fragrance</span>
                          <ChevronDown size={18} />
                        </span>
                      )}
                    </button>

                    {selected && (
                      <button
                        type="button"
                        className="discovery-slot-clear"
                        aria-label={`Remove ${selected.name}`}
                        onClick={() => clearSlot(index)}
                      >
                        <X size={16} />
                      </button>
                    )}

                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          className="discovery-dropdown"
                          role="listbox"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          {options.map((product) => {
                            const active = selected?._id === product._id;
                            return (
                              <li key={product._id} role="option" aria-selected={active}>
                                <button
                                  type="button"
                                  className={active ? 'is-active' : ''}
                                  onClick={() => selectProduct(index, product)}
                                >
                                  <img
                                    src={product.bottleImage || '/images/perfumes/placeholder.jpg'}
                                    alt=""
                                    loading="lazy"
                                  />
                                  <span>
                                    <strong>{product.name}</strong>
                                    <em>
                                      {product.gender}
                                      {product.impressionOf
                                        ? ` · Inspired by ${product.impressionOf}`
                                        : ''}
                                    </em>
                                  </span>
                                  <span className="discovery-dropdown-price">
                                    Rs {getTesterPrice(product)}
                                  </span>
                                  {active && <Check size={16} className="discovery-check" />}
                                </button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          <div className="discovery-checkout-bar">
            <div className="discovery-total">
              <span>Discovery Set total</span>
              <strong>Rs {setTotal.toLocaleString()}</strong>
            </div>
            <button
              type="button"
              className="discovery-cta"
              disabled={!isComplete || loading}
              onClick={handleAddToBag}
            >
              {isComplete ? 'Add Discovery Set to Bag' : `Select ${DISCOVERY_SET_SIZE - filledCount} more`}
            </button>
            <Link to="/products" className="discovery-shop-link">
              Or browse full bottles →
            </Link>
          </div>
        </section>

        <section className="discovery-promise" aria-labelledby="promise-title">
          <h2 id="promise-title">Test them all. Order what you love.</h2>
          <div className="discovery-promise-grid">
            <article>
              <h3>Wear &amp; wander</h3>
              <p>
                Live with each scent for a few days — mornings, evenings, and
                everything in between.
              </p>
            </article>
            <article>
              <h3>Find your signature</h3>
              <p>
                Notice which trail turns heads, which feels like home, which you
                reach for again.
              </p>
            </article>
            <article>
              <h3>Come back for more</h3>
              <p>
                When you know, you know. Return for the full 50ml bottle of your
                favourite.
              </p>
            </article>
          </div>
        </section>

        {burst && (
          <div className="discovery-burst" aria-hidden>
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="discovery-burst-piece"
                style={{
                  '--x': `${(Math.random() - 0.5) * 220}px`,
                  '--y': `${-80 - Math.random() * 180}px`,
                  '--r': `${Math.random() * 360}deg`,
                  '--d': `${0.4 + Math.random() * 0.6}s`,
                  '--c': i % 3 === 0 ? '#C9A961' : i % 3 === 1 ? '#E8D5A3' : '#FAF8F5',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DiscoverySet;
