import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './ScentFinder.css';

const MOODS = [
  {
    id: 'bold',
    label: 'Bold & Intense',
    emoji: '🔥',
    blurb: 'Leather, spice, and night-out energy',
    query: 'category=bold-intense',
  },
  {
    id: 'fresh',
    label: 'Fresh & Modern',
    emoji: '🌊',
    blurb: 'Clean citrus, airy, everyday polish',
    query: 'category=fresh-modern',
  },
  {
    id: 'floral',
    label: 'Floral & Romantic',
    emoji: '🌸',
    blurb: 'Soft petals, soft light, soft power',
    query: 'category=floral-romantic',
  },
  {
    id: 'him',
    label: 'For Him',
    emoji: '🖤',
    blurb: 'Signature scents made to linger',
    query: 'gender=Male',
  },
  {
    id: 'her',
    label: 'For Her',
    emoji: '✨',
    blurb: 'Elegant trails and memorable presence',
    query: 'gender=Female',
  },
  {
    id: 'best',
    label: 'Bestsellers',
    emoji: '⭐',
    blurb: 'What everyone keeps coming back for',
    query: 'category=best-seller',
  },
];

const ScentFinder = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const active = MOODS.find((m) => m.id === selected);

  return (
    <section className="scent-finder" aria-labelledby="scent-finder-title">
      <div className="scent-finder-inner">
        <div className="scent-finder-copy">
          <p className="scent-finder-eyebrow">Interactive guide</p>
          <h2 id="scent-finder-title">Find your scent mood</h2>
          <p className="scent-finder-sub">
            Tap what you&apos;re feeling — we&apos;ll take you straight to matching
            fragrances.
          </p>
        </div>

        <div className="scent-mood-grid" role="listbox" aria-label="Scent moods">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              role="option"
              aria-selected={selected === mood.id}
              className={cn(
                'scent-mood-chip',
                selected === mood.id && 'scent-mood-chip--active'
              )}
              onClick={() =>
                setSelected((prev) => (prev === mood.id ? null : mood.id))
              }
            >
              <span className="scent-mood-emoji" aria-hidden>
                {mood.emoji}
              </span>
              <span className="scent-mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28 }}
              className="scent-finder-result"
            >
              <div>
                <p className="scent-result-title">{active.label}</p>
                <p className="scent-result-blurb">{active.blurb}</p>
              </div>
              <Button
                type="button"
                size="lg"
                onClick={() => navigate(`/products?${active.query}`)}
              >
                Shop this mood
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScentFinder;
