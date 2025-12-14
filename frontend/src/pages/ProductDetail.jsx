import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PriceDisplay from '../components/PriceDisplay';
import SocialMediaLinks from '../components/SocialMediaLinks';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('main');

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

  const handleVote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const response = await axios.post(`/api/vote/${id}`);
      setProduct({ ...product, votes: response.data.votes });
      showToast('Vote recorded successfully!', 'success');
    } catch (error) {
      console.error('Error voting:', error);
      showToast('Error voting. Please try again.', 'error');
    } finally {
      setVoting(false);
    }
  };

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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-section">
          <div className="detail-image-wrapper">
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
            <span className="product-gender-badge" style={{ background: product.themeColor }}>
              {product.gender}
            </span>
          </div>
          <p className="product-impression-detail">Inspired by {product.impressionOf}</p>
          <div className="product-rating-detail">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-value">{product.rating}</span>
            {/* <span className="vote-count-detail">({product.votes} votes)</span> */}
          </div>
          <PriceDisplay product={product} />
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock"></span>
            ) : (
              <span className="sold-out">Sold Out</span>
            )}
          </div>
          <p className="product-description">{product.description}</p>

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

          <div className="quantity-selector" style={{ marginBottom: '1rem' }}>
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              disabled={product.stock === 0}
            />
          </div>

          <div className="product-actions-detail">
            <button 
              className="add-to-bag-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
            </button>
            <button 
              className="vote-btn-detail"
              onClick={handleVote}
              disabled={voting}
              style={{ borderColor: product.themeColor, color: product.themeColor }}
            >
              {voting ? 'Voting...' : 'Vote for this fragrance'}
            </button>
          </div>

          <div className="product-social-section">
            <h3>Connect With Us</h3>
            <SocialMediaLinks showQR={true} compact={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

