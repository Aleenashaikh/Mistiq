import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SocialMediaLinks from './SocialMediaLinks';
import ProductsDropdown from './ProductsDropdown';
import FloatingWhatsApp from './FloatingWhatsApp';
import './Layout.css';

// Footer component with categories
const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const location = useLocation();
  const categories = [
    { title: 'Best Seller', products: ['morgan', 'inferno', 'eloria'] },
    { title: 'Bold & Intense', products: ['morgan', 'inferno'] },
    { title: 'Fresh & Modern', products: ['oro bleu', 'eloria'] },
    { title: 'Floral & Romantic', products: ['eloria', 'La Fleure'] }
  ];

  // Close expanded section when route changes
  useEffect(() => {
    setExpandedSection(null);
  }, [location.pathname]);

  const getCategoryUrl = (categoryTitle) => {
    const categoryMap = {
      'Best Seller': 'best-seller',
      'Bold & Intense': 'bold-intense',
      'Fresh & Modern': 'fresh-modern',
      'Floral & Romantic': 'floral-romantic'
    };
    return `/products?category=${categoryMap[categoryTitle] || categoryTitle.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className="footer">
      <div className="footer-box">
        <div className="footer-columns">
          <div className="footer-left">
            <div className="footer-section">
              <h3 
                className="footer-heading"
                onClick={() => toggleSection('shop')}
              >
                Shop
                <span className="footer-toggle-icon">{expandedSection === 'shop' ? '−' : '+'}</span>
              </h3>
              <ul className={`footer-links ${expandedSection === 'shop' ? 'expanded' : ''}`}>
                {categories.map((category) => (
                  <li key={category.title}>
                    <Link to={getCategoryUrl(category.title)}>{category.title}</Link>
                  </li>
                ))}
                <li><Link to="/products?gender=Male">For Him</Link></li>
                <li><Link to="/products?gender=Female">For Her</Link></li>
                <li><Link to="/discovery-set">Discovery Set</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 
                className="footer-heading"
                onClick={() => toggleSection('company')}
              >
                Company
                <span className="footer-toggle-icon">{expandedSection === 'company' ? '−' : '+'}</span>
              </h3>
              <ul className={`footer-links ${expandedSection === 'company' ? 'expanded' : ''}`}>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-right">
            <div className="footer-logo-social">
              <img 
                src="/images/logo.png" 
                alt="Mistiq Perfumeries Logo" 
                className="footer-logo"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <p className="footer-brand-name">Mistiq Perfumeries</p>
              <div className="footer-social">
                <SocialMediaLinks showQR={true} compact={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="footer-copyright">© 2025 Mistiq Perfumeries — Unveil your essence.</p>
    </footer>
  );
};

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const productsDropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setProductsDropdownOpen(false);
      }
    };

    if (productsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [productsDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
  };

  const productsCloseTimer = useRef(null);

  const openProductsMenu = () => {
    if (productsCloseTimer.current) {
      clearTimeout(productsCloseTimer.current);
      productsCloseTimer.current = null;
    }
    setProductsDropdownOpen(true);
  };

  const scheduleCloseProductsMenu = () => {
    if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current);
    productsCloseTimer.current = setTimeout(() => {
      setProductsDropdownOpen(false);
      productsCloseTimer.current = null;
    }, 220);
  };

  useEffect(
    () => () => {
      if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current);
    },
    []
  );

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="nav-container">
          <button
            type="button"
            className={`mobile-menu-btn ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>

          <Link to="/" className="logo" onClick={closeMobileMenu}>
            {!logoError && (
              <img
                src="/images/logo.png"
                alt="Mistiq Perfumeries"
                className="logo-image"
                onError={() => setLogoError(true)}
              />
            )}
            {logoError && (
              <div className="logo-text-fallback">
                <span className="logo-text">MISTIQ</span>
                <span className="logo-subtitle">PERFUMERIES</span>
              </div>
            )}
          </Link>

          <div className="mobile-nav-actions">
            <Link
              to="/products"
              className="mobile-search-link"
              onClick={closeMobileMenu}
              aria-label="Browse products"
            >
              <Search size={20} strokeWidth={2} />
            </Link>
            <Link
              to="/cart"
              className="mobile-cart-link"
              onClick={closeMobileMenu}
              aria-label="Cart"
            >
              <ShoppingBag size={21} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="mobile-cart-count">{cartCount}</span>
              )}
            </Link>
          </div>

          {mobileMenuOpen && (
            <button
              type="button"
              className="mobile-menu-overlay"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
          )}

          <div className={`nav-panel ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="nav-panel-header">
              <p className="nav-panel-label">Menu</p>
              <button
                type="button"
                className="nav-panel-close"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>

            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className={isActive('/') ? 'is-active' : ''}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li
                className="nav-products-item"
                ref={productsDropdownRef}
                onMouseEnter={() => {
                  if (window.innerWidth > 768) openProductsMenu();
                }}
                onMouseLeave={() => {
                  if (window.innerWidth > 768) scheduleCloseProductsMenu();
                }}
              >
                <div className="nav-products-row">
                  <Link
                    to="/products"
                    className={`nav-products-link nav-products-text-link ${
                      isActive('/products') ? 'is-active' : ''
                    }`}
                    onClick={() => {
                      setProductsDropdownOpen(false);
                      closeMobileMenu();
                    }}
                  >
                    Products
                  </Link>
                  <button
                    type="button"
                    className="nav-products-chevron"
                    aria-expanded={productsDropdownOpen}
                    aria-label={
                      productsDropdownOpen
                        ? 'Close products menu'
                        : 'Open products menu'
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (window.innerWidth <= 768) {
                        setProductsDropdownOpen((open) => !open);
                      } else {
                        openProductsMenu();
                      }
                    }}
                  >
                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      className={
                        productsDropdownOpen
                          ? 'nav-products-chevron-icon open'
                          : 'nav-products-chevron-icon'
                      }
                    />
                  </button>
                </div>
                <ProductsDropdown
                  isOpen={productsDropdownOpen}
                  onClose={() => {
                    setProductsDropdownOpen(false);
                    closeMobileMenu();
                  }}
                />
              </li>
              <li>
                <Link
                  to="/discovery-set"
                  className={isActive('/discovery-set') ? 'is-active' : ''}
                  onClick={closeMobileMenu}
                >
                  Discovery Set
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={isActive('/about') ? 'is-active' : ''}
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={isActive('/contact') ? 'is-active' : ''}
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className={isActive('/feedback') ? 'is-active' : ''}
                  onClick={closeMobileMenu}
                >
                  Feedback
                </Link>
              </li>

              <li className="nav-divider" aria-hidden />

              <li className="desktop-nav-actions">
                <Link
                  to="/products"
                  className="nav-icon-btn"
                  aria-label="Browse products"
                  onClick={closeMobileMenu}
                >
                  <Search size={18} strokeWidth={2} />
                </Link>
                <Link
                  to="/cart"
                  className="nav-icon-btn nav-cart-btn"
                  aria-label="Cart"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag size={18} strokeWidth={2} />
                  {cartCount > 0 && (
                    <span className="nav-cart-badge">{cartCount}</span>
                  )}
                </Link>
              </li>

              <li className="mobile-cart-menu-item">
                <Link to="/cart" onClick={closeMobileMenu}>
                  Cart
                  {cartCount > 0 && (
                    <span className="nav-inline-badge">{cartCount}</span>
                  )}
                </Link>
              </li>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="admin-portal-link"
                        onClick={closeMobileMenu}
                      >
                        Admin Portal
                      </Link>
                    </li>
                  )}
                  <li className="nav-user-row">
                    <span className="user-name">{user.username}</span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="logout-link"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className={`nav-login-link ${
                      isActive('/login') ? 'is-active' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Layout;

