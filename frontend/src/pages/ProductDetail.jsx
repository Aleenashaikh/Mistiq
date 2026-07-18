import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PriceDisplay from '../components/PriceDisplay';
import SocialMediaLinks from '../components/SocialMediaLinks';
import SEO from '../components/SEO';
import { trackEvent, generateEventId } from '../lib/metaPixel';
import { SITE_URL, getProductPath } from '../lib/site';
import './ProductDetail.css';

/** Short plain-text description for OG / meta (≤ ~160 chars). */
const shortDescription = (product) => {
  if (!product) return 'Discover luxury fragrances';
  const raw =
    product.description ||
    `Shop ${product.name} — an affordable impression of ${product.impressionOf}. ${product.gender} fragrance.`;
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= 160) return trimmed;
  return `${trimmed.slice(0, 157).trim()}...`;
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('main');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [productFeedbacks, setProductFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);
  const [packagingExpanded, setPackagingExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${slug}`);
        const data = response.data;
        setProduct(data);
        setActiveImage('main');
        setLoading(false);

        // Canonicalize ID-based URLs to human-readable slug
        const canonicalPath = getProductPath(data);
        if (data.slug && `/products/${slug}` !== canonicalPath) {
          navigate(canonicalPath, { replace: true });
        }

        const price = data.discountedPrice && data.discountedPrice > 0
          ? data.discountedPrice
          : (data.actualPrice || data.price);
        const eventId = generateEventId();
        try {
          trackEvent('ViewContent', {
            content_ids: [data._id],
            content_name: data.name,
            content_type: 'product',
            value: price,
            currency: 'PKR',
          }, eventId);
        } catch (_) {}
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  useEffect(() => {
    const fetchProductFeedbacks = async () => {
      if (!product) return;

      try {
        setFeedbacksLoading(true);
        const response = await axios.get('/api/feedback?minStars=3');
        if (Array.isArray(response.data)) {
          const filtered = response.data.filter(
            feedback => feedback.product && feedback.product.toLowerCase() === product.name.toLowerCase()
          );
          setProductFeedbacks(filtered);
        } else {
          setProductFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching product feedbacks:', error);
        setProductFeedbacks([]);
      } finally {
        setFeedbacksLoading(false);
      }
    };

    fetchProductFeedbacks();
  }, [product]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showToast('This product is sold out!', 'error');
      return;
    }
    if (quantity > product.stock) {
      showToast(`Only ${product.stock} items available in stock.`, 'error');
      return;
    }
    const priceToUse = product.discountedPrice && product.discountedPrice > 0
      ? product.discountedPrice
      : (product.actualPrice || product.price);
    const productWithPrice = { ...product, price: priceToUse };
    addToCart(productWithPrice, quantity);
    showToast('Product added to cart!', 'success');

    const eventId = generateEventId();
    try {
      trackEvent('AddToCart', {
        content_ids: [product._id],
        content_name: product.name,
        content_type: 'product',
        value: priceToUse * quantity,
        currency: 'PKR',
        num_items: quantity,
      }, eventId);
    } catch (_) {}

    navigate('/cart');
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const images = ['main'];
      if (product?.hoverImage) images.push('hover');
      if (product?.thirdImage) images.push('third');

      const currentIndex = images.indexOf(activeImage);

      if (isLeftSwipe && currentIndex < images.length - 1) {
        setActiveImage(images[currentIndex + 1]);
      } else if (isRightSwipe && currentIndex > 0) {
        setActiveImage(images[currentIndex - 1]);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  const productPath = getProductPath(product);
  const productPrice = product.discountedPrice && product.discountedPrice > 0
    ? product.discountedPrice
    : (product.actualPrice || product.price);
  const availability = product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const ogDescription = shortDescription(product);
  const ogImage = product.bottleImage || '/images/logo.png';

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.bottleImage, product.hoverImage, product.thirdImage].filter(Boolean),
    description: ogDescription,
    brand: { '@type': 'Brand', name: 'Mistiq Perfumeries' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}${productPath}`,
      priceCurrency: 'PKR',
      price: productPrice,
      availability,
      seller: { '@type': 'Organization', name: 'Mistiq Perfumeries' },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}${productPath}` },
    ],
  };

  return (
    <>
      <SEO
        title={product.name}
        description={ogDescription}
        image={ogImage}
        url={productPath}
        type="product"
        impressionOf={product.impressionOf || ''}
        productName={product.name || ''}
        gender={product.gender || ''}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <div className="product-detail-page">
        <div className="product-detail-container">
        <div className="product-image-section">
          <div
            className={`detail-image-wrapper ${activeImage !== 'main' ? 'has-active' : ''}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={product.bottleImage || '/images/perfumes/placeholder.jpg'}
              alt={`${product.name} - ${product.impressionOf} inspired perfume bottle`}
              className={`detail-image ${activeImage === 'main' ? 'active' : ''}`}
            />
            {product.hoverImage && (
              <img
                src={product.hoverImage}
                alt={`${product.name} - alternate view of ${product.impressionOf} inspired fragrance`}
                className={`detail-image ${activeImage === 'hover' ? 'active' : ''}`}
                loading="lazy"
              />
            )}
            {product.thirdImage && (
              <img
                src={product.thirdImage}
                alt={`${product.name} - lifestyle view of ${product.impressionOf} dupe`}
                className={`detail-image ${activeImage === 'third' ? 'active' : ''}`}
                loading="lazy"
              />
            )}
          </div>
          {(product.hoverImage || product.thirdImage) && (
            <div className="image-thumbnails">
              <button
                className={`thumb-btn ${activeImage === 'main' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImage('main');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImage('main');
                }}
              >
                <img src={product.bottleImage} alt={`${product.name} main bottle view`} loading="lazy" />
              </button>
              {product.hoverImage && (
                <button
                  className={`thumb-btn ${activeImage === 'hover' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage('hover');
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage('hover');
                  }}
                >
                  <img src={product.hoverImage} alt={`${product.name} alternate view`} loading="lazy" />
                </button>
              )}
              {product.thirdImage && (
                <button
                  className={`thumb-btn ${activeImage === 'third' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage('third');
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage('third');
                  }}
                >
                  <img src={product.thirdImage} alt={`${product.name} lifestyle view`} loading="lazy" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="product-detail-info">
          <div className="product-header-detail">
            <h1>{product.name}</h1>
            <div className="gender-size-container">
              <span className="product-gender-badge" style={{ background: product.themeColor }}>
                {product.gender}
              </span>
              <span className="product-size">50 mL</span>
            </div>
          </div>
          <p className="product-impression-detail">Inspired by {product.impressionOf}</p>
          <div className="product-rating-detail">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-value">{product.rating}</span>
          </div>
          <PriceDisplay product={product} />
          {product.stock === 0 && (
            <div className="stock-info">
              <span className="sold-out">Sold Out</span>
            </div>
          )}

          {product.description && (
            <p className="product-description-small">{product.description}</p>
          )}

          {product.topNotes && product.topNotes.length > 0 && (
            <div className="top-notes-preview">
              <h4>Top Notes</h4>
              <div className="notes-list">
                {product.topNotes.map((note, idx) => (
                  <span key={idx} className="note-tag">{note}</span>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || product.stock === 0}
                type="button"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1 && val <= product.stock) {
                    setQuantity(val);
                  }
                }}
                disabled={product.stock === 0}
                aria-label="Quantity"
              />
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock || product.stock === 0}
                type="button"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions-detail product-actions-detail--inline">
            <button
              className="add-to-bag-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              type="button"
            >
              {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
            </button>
          </div>

          {/* Sticky mobile CTA bar */}
          <div className="pdp-sticky-bar" aria-hidden={false}>
            <div className="pdp-sticky-price">
              <PriceDisplay product={product} />
            </div>
            <button
              className="add-to-bag-btn pdp-sticky-cta"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              type="button"
            >
              {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
            </button>
          </div>

          <div className="expandable-sections-group">
            <div className="expandable-section">
              <button
                className="expandable-header"
                onClick={() => setPackagingExpanded(!packagingExpanded)}
              >
                <span>Packaging</span>
                <span className="expand-icon">{packagingExpanded ? '−' : '+'}</span>
              </button>
              {packagingExpanded && (
                <div className="expandable-content">
                  <div className="packaging-details">
                    <p><strong>Elegant, Secure Box:</strong> Your fragrance comes in a beautifully designed, secure packaging that ensures safe delivery.</p>
                    <p><strong>50ml Glass Bottle:</strong> Elegant and stylish glass bottle designed to preserve the fragrance quality.</p>
                    <p><strong>Free Tester:</strong> A complimentary tester from our perfume collection is included with your purchase.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {productFeedbacks.length > 0 && (
            <div className="product-feedbacks-section">
              <h3 className="product-feedbacks-title">Customer Reviews</h3>
              <div className="product-feedbacks-list">
                {productFeedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="product-feedback-item"
                  >
                    <div className="product-feedback-stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < feedback.stars ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="product-feedback-comments">"{feedback.comments}"</p>
                    <div className="product-feedback-author">
                      <span className="product-feedback-name">— {feedback.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="product-social-section">
            <h3>Connect With Us</h3>
            <SocialMediaLinks showQR={true} compact={true} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetail;
