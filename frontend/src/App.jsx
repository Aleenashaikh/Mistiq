import { Routes, Route, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackPageView } from './lib/metaPixel';
import { trackGAPageView } from './lib/analytics';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import DiscoverySet from './pages/DiscoverySet';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import HeroEditor from './pages/admin/HeroEditor';
import Settings from './pages/admin/Settings';
import { useDiscount } from './context/DiscountContext';
import { useToast } from './context/ToastContext';
import axios from './config/axios';

function App() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { activateQrDiscount, qrDiscount } = useDiscount();
  const { showToast } = useToast();

  // Fire Meta Pixel + GA4 page views on every route change
  useEffect(() => {
    trackPageView();
    trackGAPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchParams.get('ref') === 'qr' && !qrDiscount) {
      // Check server-side flag before activating
      axios.get('/api/admin/settings')
        .then(({ data }) => {
          setTimeout(() => {
            if (!data.qrDiscountEnabled) {
              showToast('🚫 QR discount is not currently active.', 'error');
              return;
            }
            const activated = activateQrDiscount();
            if (activated) {
              showToast('🎉 10% QR discount applied to your order!', 'success');
            } else {
              showToast('❌ This QR discount has already been used. Each code can only be redeemed once.', 'error');
            }
          }, 500);
        })
        .catch(() => {
          // If settings fetch fails, silently ignore
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="hero" element={<HeroEditor />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/discovery-set" element={<DiscoverySet />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
