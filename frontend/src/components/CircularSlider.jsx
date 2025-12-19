import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Link } from 'react-router-dom';
import './CircularSlider.css';

// Helper function to get first sentence from description
const getFirstSentence = (text) => {
  if (!text || text.trim() === '') {
    return 'Discover this exquisite fragrance that captures the essence of luxury.';
  }
  // Split by period, exclamation, or question mark and take first sentence
  const sentences = text.split(/[.!?]+/);
  const firstSentence = sentences[0].trim();
  // If first sentence is empty or too short, use the whole text up to 100 chars
  if (firstSentence.length < 10) {
    return text.substring(0, 100).trim() + (text.length > 100 ? '...' : '');
  }
  return firstSentence + '.';
};

const CircularSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch latest 5 products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        // Get latest 5 products (sorted by createdAt descending, limit to 5)
        const latestProducts = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Transform products to slides format
        const slidesData = latestProducts.map((product, index) => ({
          id: product._id,
          src: product.bottleImage || '/images/perfumes/placeholder.jpg',
          title: product.name,
          description: getFirstSentence(product.description || `Experience ${product.name}, a captivating fragrance that embodies luxury and elegance.`),
          productId: product._id,
        }));
        
        setProducts(slidesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products for slider:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  const getImageClass = (index) => {
    if (products.length === 0) return 'inactive';
    const diff = (index - currentIndex + products.length) % products.length;
    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === products.length - 1) return 'previous';
    return 'inactive';
  };

  const getBackgroundOpacity = (index) => {
    return index === currentIndex ? 1 : 0;
  };

  // Touch handlers for slider swiping
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

    if (isLeftSwipe && products.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    } else if (isRightSwipe && products.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  if (loading) {
    return (
      <section className="circular-slider-section">
        <div className="container-fluid">
          <div className="loading-slider">Loading fragrances...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="circular-slider-section">
        <div className="container-fluid">
          <div className="loading-slider">No products available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="circular-slider-section">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Left Side - Text Content */}
          <div className="col-12 col-lg-7 text-panel">
            <div className="text-content">
              <h2 className="section-title">Discover Our Signature Fragrances</h2>
              <div className="slide-text-content">
                <h3 className="slide-title">
                  <Link to={`/products/${products[currentIndex]?.productId}`} className="slide-title-link">
                    {products[currentIndex]?.title}
                  </Link>
                </h3>
                <p className="slide-description">{products[currentIndex]?.description}</p>
              </div>
              <div className="slider-dots">
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Circular Slider */}
          <div className="col-12 col-lg-5 p-0 slider-panel">
            <div 
              className="slider-main"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="slider-images">
                {products.map((product, index) => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.productId}`}
                    className={`slider-image-link ${getImageClass(index)}`}
                  >
                    <img
                      className="slider-image"
                      src={product.src}
                      alt={product.title}
                      onError={(e) => {
                        if (!e.target.dataset.errorHandled) {
                          e.target.src = '/images/perfumes/placeholder.jpg';
                          e.target.dataset.errorHandled = 'true';
                        }
                      }}
                    />
                  </Link>
                ))}
              </div>
              <div id="backgrounds">
                {products.map((_, index) => (
                  <div
                    key={index}
                    className="background"
                    style={{ opacity: getBackgroundOpacity(index) }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircularSlider;

