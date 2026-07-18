import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import ProductCard from './ProductCard';
import './ProductCategories.css';

const getImagePath = (productName) => {
  if (!productName) return '/images/perfumes/placeholder.jpg';
  const filename = productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `/images/perfumes/${filename}.png`;
};

const ProductCategories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { title: 'Best Seller', products: ['morgan', 'inferno', 'eloria'] },
    { title: 'Bold & Intense', products: ['morgan', 'inferno'] },
    { title: 'Fresh & Modern', products: ['oro bleu', 'eloria'] },
    { title: 'Floral & Romantic', products: ['eloria', 'La Fleure'] },
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

  const findProductsByName = (names) =>
    names
      .map((name) =>
        products.find(
          (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
        )
      )
      .filter(Boolean);

  if (loading) {
    return (
      <div className="product-categories-section">
        <div className="loading">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="product-categories-section">
      {categories.map((category) => {
        const categoryProducts = findProductsByName(category.products);
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category.title} className="category-section">
            <div className="category-header">
              <h2 className="category-title">{category.title}</h2>
              <Link to="/products" className="view-all-link">
                View All
                <span className="view-all-arrow">→</span>
              </Link>
            </div>
            <div className="category-products">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  imageSrc={getImagePath(product.name)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCategories;
