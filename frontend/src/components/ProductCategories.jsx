import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import PriceDisplay from './PriceDisplay';
import './ProductCategories.css';

// Helper function to get image path from product name
const getImagePath = (productName) => {
  if (!productName) return '/images/perfumes/placeholder.jpg';
  
  // Convert product name to filename format (lowercase, replace spaces with hyphens)
  const filename = productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  return `/images/perfumes/${filename}.png`;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const imagePath = getImagePath(product.name);
  const actualPrice = product.actualPrice || product.price || 0;
  const discountedPrice = product.discountedPrice;
  const hasDiscount = discountedPrice && discountedPrice > 0 && discountedPrice < actualPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
    : 0;
  const displayPrice = hasDiscount ? discountedPrice : actualPrice;
  
  return (
    <div className="category-product-card">
      <Link
        to={`/products/${product._id}`}
        className="category-product-link"
      >
        <div className="category-product-image-wrapper">
          {hasDiscount && (
            <div className="category-discount-badge">
              {discountPercent}% OFF
            </div>
          )}
          <img
            src={imagePath}
            alt={product.name}
            className="category-product-image"
            onError={(e) => {
              e.target.src = '/images/perfumes/placeholder.jpg';
            }}
          />
        </div>
        {/* Product info below image */}
        <div className="category-product-info">
          <div className="category-product-gender-size">
            <span className="category-product-gender">{product.gender}</span>
            <span className="category-product-size">50 mL</span>
          </div>
          <div className="category-product-separator"></div>
          <div className="category-product-price-section">
            <div className="category-product-price">
              {hasDiscount ? (
                <>
                  <span className="category-actual-price">Rs {actualPrice}</span>
                  <span className="category-discounted-price">Rs {displayPrice}</span>
                </>
              ) : (
                <span className="category-regular-price">Rs {displayPrice}</span>
              )}
            </div>
            <button 
              className="category-buy-now-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/products/${product._id}`);
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

const ProductCategories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category definitions with product names
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
      products: ['oro blue', 'eloria', 'morgan']
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
      .filter(Boolean); // Remove undefined products
  };

  if (loading) {
    return (
      <div className="product-categories-section">
        <div className="loading">Loading collections...</div>
      </div>
    );
  }

  // Group categories for layout optimization
  const groupedCategories = [];
  let currentGroup = [];
  
  categories.forEach((category, index) => {
    const categoryProducts = findProductsByName(category.products);
    if (categoryProducts.length === 0) return;
    
    // If category has 3 products, it takes full row
    if (categoryProducts.length === 3) {
      if (currentGroup.length > 0) {
        groupedCategories.push(currentGroup);
        currentGroup = [];
      }
      groupedCategories.push([{ category, products: categoryProducts }]);
    }
    // If category has 2 products, add to current group
    else if (categoryProducts.length === 2) {
      currentGroup.push({ category, products: categoryProducts });
      // If group has 2 categories (4 products total), finalize it
      if (currentGroup.length === 2) {
        groupedCategories.push(currentGroup);
        currentGroup = [];
      }
    }
    // If category has 1 product, add to current group or create new
    else {
      currentGroup.push({ category, products: categoryProducts });
    }
  });
  
  // Add remaining group
  if (currentGroup.length > 0) {
    groupedCategories.push(currentGroup);
  }

  return (
    <div className="product-categories-section">
      {groupedCategories.map((group, groupIndex) => (
        <div key={groupIndex} className="category-group">
          {group.map(({ category, products }, categoryIndex) => (
            <div key={`${groupIndex}-${categoryIndex}`} className="category-section">
              <div className="category-header">
                <h2 className="category-title">{category.title}</h2>
                <Link to="/products" className="view-all-link">
                  View All
                  <span className="view-all-arrow">→</span>
                </Link>
              </div>
              <div className={`category-products category-products-${products.length}`}>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductCategories;
