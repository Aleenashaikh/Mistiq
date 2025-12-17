import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SocialMediaLinks from './SocialMediaLinks';
import './Layout.css';

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
          )}

          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><Link to="/products" onClick={closeMobileMenu}>Products</Link></li>
            <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
            <li><Link to="/feedback" onClick={closeMobileMenu}>Feedback</Link></li>
            <li>
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
      <footer className="footer">
        <div className="footer-content">
          <img 
            src="/images/logo.png" 
            alt="Mistiq Perfumeries Logo" 
            className="footer-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <p>© 2025 Mistiq Perfumeries — Unveil your essence.</p>
          <div className="footer-social">
            <SocialMediaLinks showQR={true} compact={true} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

