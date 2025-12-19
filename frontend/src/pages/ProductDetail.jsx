import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PriceDisplay from '../components/PriceDisplay';
import SocialMediaLinks from '../components/SocialMediaLinks';
import SEO from '../components/SEO';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [packagingExpanded, setPackagingExpanded] = useState(false);

  // Helper function to get small description
  const getSmallDescription = (description) => {
    if (!description || description.trim() === '') {
      return 'Discover this exquisite fragrance that captures the essence of luxury.';
    }
    
    // Split by sentence endings
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return description.substring(0, 100).trim() + (description.length > 100 ? '...' : '');
    
    // Try first sentence
    let text = sentences[0].trim();
    let wordCount = text.split(/\s+/).length;
    
    if (wordCount >= 10) {
      return text + '.';
    }
    
    // Try first two sentences
    if (sentences.length >= 2) {
      text = sentences.slice(0, 2).join('. ').trim();
      wordCount = text.split(/\s+/).length;
      if (wordCount >= 10) {
        return text + '.';
      }
    }
    
    // Try first three sentences
    if (sentences.length >= 3) {
      text = sentences.slice(0, 3).join('. ').trim();
      wordCount = text.split(/\s+/).length;
      if (wordCount >= 10) {
        return text + '.';
      }
    }
    
    // If still less than 10 words, return first three sentences or all if less than 3
    return sentences.slice(0, 3).join('. ').trim() + '.';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setActiveImage('main'); // Reset to main image when product changes
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchProductFeedbacks = async () => {
      if (!product) return;
      
      try {
        setFeedbacksLoading(true);
        const response = await axios.get('/api/feedback?minStars=3');
        if (Array.isArray(response.data)) {
          // Filter feedbacks by product name
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
    // Use discounted price if available, otherwise actual price
    const priceToUse = product.discountedPrice && product.discountedPrice > 0 
      ? product.discountedPrice 
      : (product.actualPrice || product.price);
    const productWithPrice = { ...product, price: priceToUse };
    addToCart(productWithPrice, quantity);
    showToast('Product added to cart!', 'success');
    navigate('/cart');
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Touch handlers for image swiping
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

  return (
    <>
      <SEO 
        title={product ? `${product.name} - ${product.impressionOf} Dupe | Mistiq Perfumeries` : 'Product - Mistiq Perfumeries'}
        description={product ? (product.description || `Shop ${product.name} - An affordable impression of ${product.impressionOf}. ${product.gender} fragrance dupe. Quality ${product.impressionOf} alternative at best prices.`) : 'Discover luxury fragrances'}
        image={product?.bottleImage || '/images/logo.png'}
        url={`/products/${id}`}
        type="product"
        impressionOf={product?.impressionOf || ''}
        productName={product?.name || ''}
        gender={product?.gender || ''}
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
              alt={product.name}
              className={`detail-image ${activeImage === 'main' ? 'active' : ''}`}
            />
            {product.hoverImage && (
              <img 
                src={product.hoverImage} 
                alt={`${product.name} hover`}
                className={`detail-image ${activeImage === 'hover' ? 'active' : ''}`}
              />
            )}
            {product.thirdImage && (
              <img 
                src={product.thirdImage} 
                alt={`${product.name} third`}
                className={`detail-image ${activeImage === 'third' ? 'active' : ''}`}
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
                <img src={product.bottleImage} alt="Main" />
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
                  <img src={product.hoverImage} alt="Hover" />
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
                  <img src={product.thirdImage} alt="Third" />
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
            {/* <span className="vote-count-detail">({product.votes} votes)</span> */}
          </div>
          <PriceDisplay product={product} />
          {product.stock === 0 && (
            <div className="stock-info">
              <span className="sold-out">Sold Out</span>
            </div>
          )}

          {/* Small Description - shown when description dropdown is closed */}
          {!descriptionExpanded && (
            <>
              <p className="product-description-small">{getSmallDescription(product.description)}</p>
              
              {/* Top Notes Only */}
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

              {/* Quantity Selector with +/- buttons */}
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || product.stock === 0}
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
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="product-actions-detail">
                <button 
                  className="add-to-bag-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
                </button>
              </div>
            </>
          )}

          {/* Expandable Sections - Description and Packaging */}
          <div className="expandable-sections-group">
            <div className="expandable-section">
              <button
                className="expandable-header"
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              >
                <span>Description</span>
                <span className="expand-icon">{descriptionExpanded ? '−' : '+'}</span>
              </button>
              {descriptionExpanded && (
                <div className="expandable-content">
                  <p className="product-description-full">{product.description}</p>
                  <div className="notes-section">
                    <h3>Fragrance Notes</h3>
                    <div className="notes-grid">
                      <div className="note-group">
                        <h4>Top Notes</h4>
                        <div className="notes-list">
                          {product.topNotes?.map((note, idx) => (
                            <span key={idx} className="note-tag">{note}</span>
                          ))}
                        </div>
                      </div>
                      <div className="note-group">
                        <h4>Heart Notes</h4>
                        <div className="notes-list">
                          {product.heartNotes?.map((note, idx) => (
                            <span key={idx} className="note-tag">{note}</span>
                          ))}
                        </div>
                      </div>
                      <div className="note-group">
                        <h4>Base Notes</h4>
                        <div className="notes-list">
                          {product.baseNotes?.map((note, idx) => (
                            <span key={idx} className="note-tag">{note}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

