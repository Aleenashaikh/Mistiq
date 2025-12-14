import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SocialMediaLinks from './SocialMediaLinks';
import './Layout.css';

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
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
  };

  return (
    <div className="layout">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo">
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
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li>
              <Link to="/cart">
                Cart {getCartCount() > 0 && `(${getCartCount()})`}
              </Link>
            </li>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li><Link to="/admin/dashboard" className="admin-portal-link">Admin Portal</Link></li>
                )}
                <li><span className="user-name">{user.username}</span></li>
                <li><button onClick={handleLogout} className="logout-link">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
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

