import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PriceDisplay from '../components/PriceDisplay';
import SEO from '../components/SEO';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [filters, setFilters] = useState({
    gender: 'All',
    category: 'All',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    
    if (filters.gender !== 'All') {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }

    setFilteredProducts(filtered);
    
    // Scroll to top when filter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, products]);

  return (
    <>
      <SEO 
        title="Our Collection - Mistiq Perfumeries | Perfume Dupes & Designer Impressions"
        description="Explore our complete collection of luxury fragrances and designer perfume dupes. Find impressions of Gucci Flora, Miss Dior, Azzaro Wanted, Sauvage Dior, Tuscan Leather and more. Affordable designer alternatives."
        url="/products"
      />
      <div className="products-page">
        <div className="products-hero">
        <h1>Explore Our Collection</h1>
        <p>
          Each bottle is a masterpiece—carefully blended to complement your mood, personality, and style. 
          Whether you prefer warm, floral, citrusy, or musky notes, Mistiq Perfumeries helps you unveil your essence.
        </p>
      </div>

      <div className="products-container">
        <div className="filters-sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Gender</label>
            <select 
              value={filters.gender}
              onChange={(e) => setFilters({...filters, gender: e.target.value})}
            >
              <option value="All">All</option>
              <option value="Male">For Him</option>
              <option value="Female">For Her</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            filteredProducts.map(product => (
              <div key={product._id} className="product-card-wrapper">
                <Link to={`/products/${product._id}`} className="product-card-link">
                  <div className="product-card" style={{ '--accent-color': product.themeColor }}>
                    <div className="product-image-wrapper">
                      {product.discountedPrice && product.discountedPrice > 0 && (product.actualPrice || product.price) && (
                        <div className="discount-badge-card">
                          {Math.round(((product.actualPrice || product.price) - product.discountedPrice) / (product.actualPrice || product.price) * 100)}% OFF
                        </div>
                      )}
                      <img 
                        src={product.bottleImage || '/images/perfumes/placeholder.jpg'} 
                        alt={product.name}
                        className="main-image"
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
                          className="hover-image"
                          onError={(e) => {
                            if (!e.target.dataset.errorHandled) {
                              e.target.style.display = 'none';
                              e.target.dataset.errorHandled = 'true';
                            }
                          }}
                        />
                      )}
                      {product.stock === 0 && (
                        <div className="sold-out-badge">Sold Out</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-impression">Inspired by {product.impressionOf}</p>
                      <span className="product-gender">{product.gender}</span>
                      <div className="product-stock-small">
                        {product.stock > 0 ? `` : 'Sold Out'}
                      </div>
                      <PriceDisplay product={product} />
                    </div>
                  </div>
                </Link>
                <button
                  className="quick-add-btn"
                  onClick={(e) => {
                    e.preventDefault();
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
                    showToast('Added to cart!', 'success');
                  }}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sold Out' : 'Quick Add'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Products;

