import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { getProductPath } from '../lib/site';
import './ProductsDropdown.css';

const ProductsDropdown = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      title: 'Best Seller',
      products: ['morgan', 'inferno', 'eloria']
    },
    {
      title: 'Bold & Intense',
      products: ['morgan', 'inferno']
    },
    {
      title: 'Fresh & Modern',
      products: ['oro blue', 'eloria']
    },
    {
      title: 'Floral & Romantic',
      products: ['eloria', 'La Fleure']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper function to find products by name (case-insensitive)
  const findProductsByName = (names) => {
    return names
      .map(name => {
        const product = products.find(p => 
          p.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        return product;
      })
      .filter(Boolean);
  };

  const toggleCategory = (categoryTitle) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle);
  };

  const getCategoryUrl = (categoryTitle) => {
    const categoryMap = {
      'Best Seller': 'best-seller',
      'Bold & Intense': 'bold-intense',
      'Fresh & Modern': 'fresh-modern',
      'Floral & Romantic': 'floral-romantic'
    };
    return `/products?category=${categoryMap[categoryTitle] || categoryTitle.toLowerCase().replace(/\s+/g, '-')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="products-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="dropdown-content">
        {/* Main Products Section with Horizontal Scroll */}
        <div className="dropdown-main-section">
          <div className="dropdown-header-section">
            <h2 className="dropdown-main-title">Mistiq Perfumeries</h2>
            <h3 className="dropdown-sub-title">All Products</h3>
          </div>
          
          {/* Horizontally Scrollable Products */}
          <div className="products-horizontal-scroll">
            {loading ? (
              <div className="dropdown-loading">Loading...</div>
            ) : (
              <>


                {/* Product Cards */}
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={getProductPath(product)}
                    className="product-card"
                    onClick={onClose}
                  >
                    <img
                      src={product.bottleImage || '/images/perfumes/placeholder.jpg'}
                      alt={product.name}
                      className="product-card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/perfumes/placeholder.jpg';
                      }}
                    />
                    <div className="product-card-name">{product.name}</div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div className="dropdown-categories-section">
          <div className="categories-divider"></div>
          <div className="categories-list">
            {categories.map((category) => {
              const categoryProducts = findProductsByName(category.products);
              const isExpanded = expandedCategory === category.title;
              
              return (
                <div key={category.title} className="category-dropdown-item">
                  <button
                    className="category-dropdown-header"
                    onClick={() => toggleCategory(category.title)}
                  >
                    <span className="category-name">{category.title}</span>
                    <span className="category-arrow">{isExpanded ? '−' : '+'}</span>
                  </button>
                  {isExpanded && categoryProducts.length > 0 && (
                    <div className="category-products-scroll">
                      {categoryProducts.map((product) => (
                        <Link
                          key={product._id}
                          to={getProductPath(product)}
                          className="category-product-card"
                          onClick={onClose}
                        >
                          <img
                            src={product.bottleImage || '/images/perfumes/placeholder.jpg'}
                            alt={product.name}
                            className="category-product-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/images/perfumes/placeholder.jpg';
                            }}
                          />
                          <div className="category-product-name">{product.name}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDropdown;

