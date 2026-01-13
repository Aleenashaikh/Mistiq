import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SocialMediaLinks from './SocialMediaLinks';
import ProductsDropdown from './ProductsDropdown';
import './Layout.css';

// Footer component with categories
const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const location = useLocation();
  const categories = [
    { title: 'Best Seller', products: ['morgan', 'inferno', 'eloria'] },
    { title: 'Bold & Intense', products: ['morgan', 'inferno'] },
    { title: 'Fresh & Modern', products: ['oro blue', 'eloria', 'morgan'] },
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  };

  return (
    <div className="layout">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <Link to="/" className="logo" onClick={closeMobileMenu}>
            {!logoError && (
              <img 
                src="/images/logo.png" 
                alt="Mistiq Perfumeries Logo" 
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

          {/* Mobile Cart Icon - Right Side */}
          <Link to="/cart" className="mobile-cart-link" onClick={closeMobileMenu}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {getCartCount() > 0 && (
              <span className="mobile-cart-count">{getCartCount()}</span>
            )}
          </Link>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
          )}

          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li 
              className="nav-products-item"
              ref={productsDropdownRef}
              onMouseEnter={() => {
                if (window.innerWidth > 768) {
                  setProductsDropdownOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 768) {
                  setProductsDropdownOpen(false);
                }
              }}
            >
              <button
                className="nav-products-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth <= 768) {
                    setProductsDropdownOpen(!productsDropdownOpen);
                  } else {
                    navigate('/products');
                  }
                }}
              >
                Products
                <span className="nav-products-arrow">{productsDropdownOpen ? '−' : '+'}</span>
              </button>
              <ProductsDropdown 
                isOpen={productsDropdownOpen} 
                onClose={() => {
                  setProductsDropdownOpen(false);
                  closeMobileMenu();
                }}
              />
            </li>
            <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
            <li><Link to="/feedback" onClick={closeMobileMenu}>Feedback</Link></li>
            <li className="mobile-cart-menu-item">
              <Link to="/cart" onClick={closeMobileMenu}>
                Cart {getCartCount() > 0 && `(${getCartCount()})`}
              </Link>
            </li>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li><Link to="/admin/dashboard" className="admin-portal-link" onClick={closeMobileMenu}>Admin Portal</Link></li>
                )}
                <li><span className="user-name">{user.username}</span></li>
                <li><button onClick={handleLogout} className="logout-link">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
            )}
          </ul>
        </div>
      </nav>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

