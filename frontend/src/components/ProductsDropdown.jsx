import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import axios from '../config/axios';
import { getProductPath } from '../lib/site';
import './ProductsDropdown.css';

const CATEGORIES = [
  {
    title: 'Best Seller',
    slug: 'best-seller',
    products: ['morgan', 'inferno', 'eloria'],
  },
  {
    title: 'Bold & Intense',
    slug: 'bold-intense',
    products: ['morgan', 'inferno'],
  },
  {
    title: 'Fresh & Modern',
    slug: 'fresh-modern',
    products: ['oro bleu', 'oro blue', 'eloria'],
  },
  {
    title: 'Floral & Romantic',
    slug: 'floral-romantic',
    products: ['eloria', 'La Fleure'],
  },
];

const ProductsDropdown = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null);
      return undefined;
    }

    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (cancelled) return;
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching products for nav:', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    setLoading(true);
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const findProductsByName = (names) =>
    names
      .map((name) =>
        products.find(
          (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
        )
      )
      .filter(Boolean);

  const featured = useMemo(
    () =>
      products
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [products]
  );

  const activeMeta = CATEGORIES.find((c) => c.title === activeCategory);
  const panelProducts = activeMeta
    ? findProductsByName(activeMeta.products)
    : featured;
  const panelTitle = activeMeta ? activeMeta.title : 'New arrivals';
  const panelViewAllTo = activeMeta
    ? `/products?category=${activeMeta.slug}`
    : '/products';

  const selectCategory = (title) => {
    setActiveCategory((current) => (current === title ? null : title));
  };

  if (!isOpen) return null;

  return (
    <div className="products-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="shop-panel">
        <div className="shop-panel-main">
          <p className="shop-panel-eyebrow">Shop</p>

          <div className="shop-quick-links">
            <Link
              to="/products?gender=Male"
              className="shop-chip"
              onClick={onClose}
            >
              For Him
            </Link>
            <Link
              to="/products?gender=Female"
              className="shop-chip"
              onClick={onClose}
            >
              For Her
            </Link>
            <Link
              to="/products"
              className="shop-chip shop-chip--all"
              onClick={onClose}
            >
              All fragrances
              <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="shop-category-list">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.title;
              const categoryProducts = findProductsByName(category.products);

              return (
                <li key={category.slug}>
                  {/* Desktop: select category → right panel */}
                  <button
                    type="button"
                    className={`shop-category-toggle shop-category-toggle--desktop ${
                      isActive ? 'is-open' : ''
                    }`}
                    onClick={() => selectCategory(category.title)}
                    aria-pressed={isActive}
                  >
                    <span>{category.title}</span>
                    <ChevronRight
                      size={16}
                      className={`shop-category-arrow-side ${
                        isActive ? 'is-open' : ''
                      }`}
                    />
                  </button>

                  {/* Mobile: expand under the row */}
                  <button
                    type="button"
                    className={`shop-category-toggle shop-category-toggle--mobile ${
                      isActive ? 'is-open' : ''
                    }`}
                    onClick={() => selectCategory(category.title)}
                    aria-expanded={isActive}
                  >
                    <span>{category.title}</span>
                    <ChevronDown
                      size={16}
                      className={`shop-category-arrow ${
                        isActive ? 'is-open' : ''
                      }`}
                    />
                  </button>

                  {isActive && (
                    <div className="shop-category-products shop-category-products--mobile">
                      {loading ? (
                        <p className="shop-loading">Loading…</p>
                      ) : categoryProducts.length === 0 ? (
                        <p className="shop-loading">
                          No products in this collection
                        </p>
                      ) : (
                        <div className="shop-product-scroll">
                          {categoryProducts.map((product) => (
                            <Link
                              key={product._id}
                              to={getProductPath(product)}
                              className="shop-product-card"
                              onClick={onClose}
                            >
                              <img
                                src={
                                  product.bottleImage ||
                                  '/images/perfumes/placeholder.jpg'
                                }
                                alt={product.name}
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src =
                                    '/images/perfumes/placeholder.jpg';
                                }}
                              />
                              <span>{product.name}</span>
                            </Link>
                          ))}
                          <Link
                            to={`/products?category=${category.slug}`}
                            className="shop-product-card shop-product-card--more"
                            onClick={onClose}
                          >
                            <span>View all</span>
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="shop-panel-featured">
          <div className="shop-featured-header">
            <p className="shop-panel-eyebrow">{panelTitle}</p>
            <Link
              to={panelViewAllTo}
              className="shop-view-all"
              onClick={onClose}
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p className="shop-loading">Loading…</p>
          ) : panelProducts.length === 0 ? (
            <p className="shop-loading">No products yet</p>
          ) : (
            <div className="shop-product-scroll shop-product-scroll--featured">
              {panelProducts.map((product) => (
                <Link
                  key={product._id}
                  to={getProductPath(product)}
                  className="shop-product-card"
                  onClick={onClose}
                >
                  <img
                    src={
                      product.bottleImage || '/images/perfumes/placeholder.jpg'
                    }
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/perfumes/placeholder.jpg';
                    }}
                  />
                  <span>{product.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDropdown;
