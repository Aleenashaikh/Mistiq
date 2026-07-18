import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import axios from '../config/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { SITE_URL } from '../lib/site';
import { cn } from '@/lib/utils';
import './Products.css';

const CATEGORY_DEFS = {
  'best-seller': {
    label: 'Bestsellers',
    products: ['morgan', 'inferno', 'eloria'],
  },
  'bold-intense': {
    label: 'Bold & Intense',
    products: ['morgan', 'inferno'],
  },
  'fresh-modern': {
    label: 'Fresh & Modern',
    products: ['oro blue', 'eloria', 'morgan'],
  },
  'floral-romantic': {
    label: 'Floral & Romantic',
    products: ['eloria', 'La Fleure'],
  },
};

const GENDER_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Male', label: 'For Him' },
  { value: 'Female', label: 'For Her' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'name', label: 'A–Z' },
];

const getPrice = (p) =>
  p.discountedPrice && p.discountedPrice > 0
    ? p.discountedPrice
    : p.actualPrice || p.price || 0;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const gender = searchParams.get('gender') || 'All';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSearch('');
    setSort('newest');
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (gender !== 'All') {
      list = list.filter((p) => p.gender === gender);
    }

    if (category !== 'All' && CATEGORY_DEFS[category]) {
      const names = CATEGORY_DEFS[category].products;
      list = list.filter((p) =>
        names.some(
          (name) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
        )
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.impressionOf?.toLowerCase().includes(q) ||
          p.gender?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price-desc':
        list.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'name':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return list;
  }, [products, gender, category, search, sort]);

  const categoryParam = category !== 'All' ? category : '';
  const categoryLabel = CATEGORY_DEFS[category]?.label || '';
  const productsUrl = categoryParam
    ? `/products?category=${categoryParam}`
    : '/products';

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
  ];
  if (categoryLabel) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: categoryLabel,
      item: `${SITE_URL}${productsUrl}`,
    });
  }

  const handleQuickAdd = (product) => {
    if (product.stock === 0) {
      showToast('This product is sold out!', 'error');
      return;
    }
    const priceToUse = getPrice(product);
    addToCart({ ...product, price: priceToUse }, 1);
    showToast('Added to cart!', 'success');
  };

  const hasActiveFilters =
    gender !== 'All' || category !== 'All' || search.trim() || sort !== 'newest';

  return (
    <>
      <SEO
        title="Our Collection - Mistiq Perfumeries | Perfume Dupes & Designer Impressions"
        description="Explore our complete collection of luxury fragrances and designer perfume dupes. Find impressions of Gucci Flora, Miss Dior, Azzaro Wanted, Sauvage Dior, Tuscan Leather and more."
        url={productsUrl}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems,
          },
        ]}
      />
      <div className="products-page">
        <div className="products-hero">
          <h1>Explore Our Collection</h1>
          <p>
            Each bottle is a masterpiece—carefully blended to complement your
            mood, personality, and style.
          </p>
        </div>

        <div className="products-toolbar">
          <div className="products-search">
            <Search className="products-search-icon" aria-hidden />
            <input
              type="search"
              placeholder="Search by name or inspiration…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
            {search && (
              <button
                type="button"
                className="products-search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="products-toolbar-right">
            <button
              type="button"
              className="products-filter-toggle"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <select
              className="products-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={cn('products-filters', filtersOpen && 'is-open')}>
          <div className="filter-chip-group">
            <span className="filter-chip-label">Gender</span>
            <div className="filter-chips">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    'filter-chip',
                    gender === opt.value && 'filter-chip--active'
                  )}
                  onClick={() => updateParam('gender', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-chip-group">
            <span className="filter-chip-label">Collection</span>
            <div className="filter-chips">
              <button
                type="button"
                className={cn(
                  'filter-chip',
                  category === 'All' && 'filter-chip--active'
                )}
                onClick={() => updateParam('category', 'All')}
              >
                All
              </button>
              {Object.entries(CATEGORY_DEFS).map(([key, def]) => (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    'filter-chip',
                    category === key && 'filter-chip--active'
                  )}
                  onClick={() => updateParam('category', key)}
                >
                  {def.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button type="button" className="filter-clear" onClick={clearFilters}>
              Clear all
            </button>
          )}
        </div>

        <div className="products-meta">
          <span>
            {loading
              ? 'Loading…'
              : `${filteredProducts.length} fragrance${filteredProducts.length === 1 ? '' : 's'}`}
          </span>
        </div>

        <div className="products-grid-wrap">
          <div className="products-grid">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found</p>
                <button type="button" className="filter-clear" onClick={clearFilters}>
                  Reset filters
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showQuickAdd
                  onQuickAdd={handleQuickAdd}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
