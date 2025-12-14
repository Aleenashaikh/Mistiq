import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PriceDisplay from './PriceDisplay';
import './ProductShowcase.css';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        // API already filters visible products, but double-check
        const visibleProducts = response.data.filter(p => p.isVisible !== false);
        setProducts(visibleProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleVote = async (productId) => {
    try {
      const response = await axios.post(`/api/vote/${productId}`);
      setProducts(products.map(p => 
        p._id === productId ? { ...p, votes: response.data.votes } : p
      ));
      showToast('Vote recorded successfully!', 'success');
    } catch (error) {
      console.error('Error voting:', error);
      showToast('Error voting. Please try again.', 'error');
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      showToast('This product is sold out!', 'error');
      return;
    }
    // Use discounted price if available, otherwise actual price
    const priceToUse = product.discountedPrice && product.discountedPrice > 0 
      ? product.discountedPrice 
      : (product.actualPrice || product.price);
    const productWithPrice = { ...product, price: priceToUse };
    addToCart(productWithPrice, 1);
    showToast('Product added to cart!', 'success');
  };

  if (loading) {
    return (
      <section className="product-showcase">
        <div className="loading">Loading fragrances...</div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section ref={ref} className="product-showcase">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="showcase-header"
        >
          <h2 className="showcase-title">Our Signature Collection</h2>
          <p className="showcase-subtitle">
            Discover fragrances crafted to perfection, each telling a unique story.
          </p>
        </motion.div>
        <div className="loading" style={{ padding: '4rem 2rem' }}>
          <p>No products available at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="product-showcase">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="showcase-header"
      >
        <h2 className="showcase-title">Our Signature Collection</h2>
        <p className="showcase-subtitle">
          Discover fragrances crafted to perfection, each telling a unique story.
        </p>
      </motion.div>

      <div className="products-grid">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="product-card"
            style={{ '--accent-color': product.themeColor }}
          >
            <div className="product-image-wrapper">
              {product.discountedPrice && product.discountedPrice > 0 && (product.actualPrice || product.price) && (
                <div className="discount-badge-card">
                  {Math.round(((product.actualPrice || product.price) - product.discountedPrice) / (product.actualPrice || product.price) * 100)}% OFF
                </div>
              )}
              <img 
                src={product.bottleImage || '/images/perfumes/placeholder.jpg'} 
                alt={product.name}
                className="product-image main-image"
                onError={(e) => {
                  if (!e.target.dataset.errorHandled) {
                    e.target.src = '/images/perfumes/placeholder.jpg';
                    e.target.dataset.errorHandled = 'true';
                  }
                }}
              />
              {product.hoverImage && (
                <img 
                  src={product.hoverImage} 
                  alt={`${product.name} hover`}
                  className="product-image hover-image"
                  onError={(e) => {
                    if (!e.target.dataset.errorHandled) {
                      e.target.style.display = 'none';
                      e.target.dataset.errorHandled = 'true';
                    }
                  }}
                />
              )}
              <div className="product-overlay">
                <Link to={`/products/${product._id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
            <div className="product-info">
              <div className="product-header">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-gender">{product.gender}</span>
              </div>
              <p className="product-impression">Inspired by {product.impressionOf}</p>
              <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                {product.discountedPrice && product.discountedPrice > 0 && (product.actualPrice || product.price) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ textDecoration: 'line-through', color: 'var(--white)', opacity: 0.5, fontSize: '0.9em' }}>
                      Rs {product.actualPrice || product.price}
                    </span>
                    <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '1.2em' }}>
                      Rs {product.discountedPrice}
                    </span>
                  </div>
                ) : (
                  <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '1.2em' }}>
                    Rs {product.actualPrice || product.price || 0}
                  </span>
                )}
              </div>
              <div className="stock-info-small">
                {product.stock > 0 ? (
                  <span className="in-stock-small">In Stock ({product.stock})</span>
                ) : (
                  <span className="sold-out-small">Sold Out</span>
                )}
              </div>
              <div className="product-rating">
                <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
                <span className="rating-value">{product.rating}</span>
              </div>
              <div className="product-actions">
                <button 
                  className="vote-btn"
                  onClick={() => handleVote(product._id)}
                >
                  Vote for this fragrance
                </button>
                <span className="vote-count">{product.votes} votes</span>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  style={{ marginTop: '0.5rem' }}
                >
                  {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;

