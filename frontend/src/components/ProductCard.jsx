import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getProductPath } from '@/lib/site';
import PriceDisplay from './PriceDisplay';

const WISHLIST_KEY = 'mistiq_wishlist';

const readWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Modern D2C product card — soft elevation, wishlist, hover overlay.
 */
const ProductCard = ({
  product,
  className,
  showQuickAdd = true,
  onQuickAdd,
  imageSrc,
  imageAlt,
}) => {
  const navigate = useNavigate();
  const [showAlt, setShowAlt] = useState(false);
  const [saved, setSaved] = useState(false);
  const path = getProductPath(product);
  const mainSrc =
    imageSrc || product.bottleImage || '/images/perfumes/placeholder.jpg';
  const altSrc = product.hoverImage;
  const hasAlt = Boolean(altSrc);
  const soldOut = product.stock === 0;
  const hasDiscount =
    product.discountedPrice > 0 &&
    (product.actualPrice || product.price) &&
    product.discountedPrice < (product.actualPrice || product.price);

  useEffect(() => {
    setSaved(readWishlist().includes(product._id));
  }, [product._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const current = readWishlist();
    const next = current.includes(product._id)
      ? current.filter((id) => id !== product._id)
      : [...current, product._id];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setSaved(next.includes(product._id));
  };

  const handleTouchToggle = (e) => {
    if (!hasAlt) return;
    if (window.matchMedia('(hover: none)').matches) {
      if (!showAlt) {
        e.preventDefault();
        setShowAlt(true);
      }
    }
  };

  const handleCta = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    if (onQuickAdd) {
      onQuickAdd(product);
      return;
    }
    navigate(path);
  };

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden bg-white',
        'hover:-translate-y-1.5 hover:shadow-lift',
        className
      )}
    >
      <div className="relative">
        <Link
          to={path}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={handleTouchToggle}
          onMouseEnter={() => {
            if (hasAlt && window.matchMedia('(hover: hover)').matches) {
              setShowAlt(true);
            }
          }}
          onMouseLeave={() => {
            if (window.matchMedia('(hover: hover)').matches) {
              setShowAlt(false);
            }
          }}
        >
          <div className="relative mx-2.5 mt-2.5 aspect-[3/4] overflow-hidden rounded-xl bg-[#f3f0eb] sm:mx-3 sm:mt-3">
            {hasDiscount && (
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#1f1f1f] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white sm:text-[11px]">
                {Math.round(
                  ((product.actualPrice || product.price) -
                    product.discountedPrice) /
                    (product.actualPrice || product.price) *
                    100
                )}
                % OFF
              </span>
            )}
            {soldOut && (
              <span className="absolute left-2.5 bottom-2.5 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-muted-foreground shadow-sm backdrop-blur-sm sm:text-[11px]">
                Sold Out
              </span>
            )}
            <img
              src={mainSrc}
              alt={
                imageAlt ||
                `${product.name} - ${product.impressionOf || 'perfume'}`
              }
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out',
                'group-hover:scale-[1.05]',
                showAlt && hasAlt ? 'opacity-0 scale-[1.05]' : 'opacity-100'
              )}
              loading="lazy"
              onError={(e) => {
                if (!e.target.dataset.errorHandled) {
                  e.target.src = '/images/perfumes/placeholder.jpg';
                  e.target.dataset.errorHandled = 'true';
                }
              }}
            />
            {hasAlt && (
              <img
                src={altSrc}
                alt={`${product.name} alternate view`}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out',
                  showAlt ? 'opacity-100 scale-[1.05]' : 'opacity-0'
                )}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}

            {/* Hover overlay — desktop */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/55 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm">
                <Eye className="h-3.5 w-3.5" />
                Quick look
              </span>
            </div>
          </div>
        </Link>

        <button
          type="button"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          onClick={toggleWishlist}
          className={cn(
            'absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur-sm transition-all sm:right-5 sm:top-5',
            'hover:scale-105 hover:bg-white',
            saved && 'text-red-500'
          )}
        >
          <Heart
            className="h-4 w-4"
            fill={saved ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </div>

      <Link to={path} className="flex flex-1 flex-col">
        <CardHeader className="space-y-1 pb-1.5 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {product.gender && (
              <span className="rounded-full bg-secondary px-2 py-0.5">
                {product.gender}
              </span>
            )}
            <span className="rounded-full bg-secondary px-2 py-0.5">50 mL</span>
          </div>
          <CardTitle className="line-clamp-2 pt-0.5 transition-colors group-hover:text-[#8a7340]">
            {product.name}
          </CardTitle>
          {product.impressionOf && (
            <p className="line-clamp-1 text-xs font-normal text-muted-foreground sm:text-[13px]">
              Inspired by {product.impressionOf}
            </p>
          )}
        </CardHeader>

        <CardContent className="pb-2 pt-0">
          <PriceDisplay product={product} className="product-card-price" />
        </CardContent>
      </Link>

      {showQuickAdd && (
        <CardFooter className="mt-auto gap-2 pt-1">
          <Button
            type="button"
            variant={soldOut ? 'secondary' : 'default'}
            size="sm"
            className="w-full text-[11px] tracking-[0.06em] sm:text-xs"
            disabled={soldOut}
            onClick={handleCta}
          >
            {soldOut ? 'Sold Out' : onQuickAdd ? 'Add to Bag' : 'Buy Now'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
