import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from '../config/axios';
import { useDiscount } from '../context/DiscountContext';
import { trackEvent, generateEventId } from '../lib/metaPixel';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { qrDiscount, clearDiscount } = useDiscount();
  const [loading, setLoading] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(200);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    nearestLandmark: '',
  });

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const response = await axios.get('/api/admin/settings');
        setDeliveryCharge(response.data.deliveryCharge);
      } catch (error) {
        console.error('Error fetching delivery charge:', error);
        // Keep default 200 if fetch fails
      }
    };
    fetchDeliveryCharge();

    // Fire InitiateCheckout pixel event
    const eventId = generateEventId();
    try {
      trackEvent('InitiateCheckout', {
        num_items: cartItems.reduce((sum, i) => sum + i.quantity, 0),
        currency: 'PKR',
      }, eventId);
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = getCartTotal();
  const discountAmount = qrDiscount ? subtotal * 0.10 : 0;
  const total = subtotal - discountAmount + deliveryCharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    // Generate Purchase event ID for browser ↔ CAPI deduplication
    const purchaseEventId = generateEventId();

    setLoading(true);
    try {
      const orderItems = cartItems.flatMap((item) => {
        if (item.type === 'bundle') {
          return item.products.map((product) => ({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
            isTester: true,
            size: '10ml',
            bundleId: item.id,
          }));
        }
        return [{
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        }];
      });

      const orderData = {
        items: orderItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || undefined, // Optional email
          phone: formData.phone.replace(/-/g, ''), // Remove dashes from phone
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: 'Pakistan',
          nearestLandmark: formData.nearestLandmark,
        },
        paymentMethod: 'COD',
        qrDiscount: qrDiscount,
        purchaseEventId,  // For CAPI deduplication
      };

      // Create axios instance without auth header for orders (no login required)
      const orderAxios = axios.create({
        baseURL: axios.defaults.baseURL,
      });
      const response = await orderAxios.post('/api/orders', orderData);

      clearCart();
      clearDiscount();
      showToast('Order placed successfully! You will receive a confirmation email shortly.', 'success');

      // Fire Purchase pixel event (browser-side, matched with CAPI by purchaseEventId)
      try {
        trackEvent('Purchase', {
          value: total,
          currency: 'PKR',
          content_ids: orderItems.map((i) => i.product),
          content_type: 'product',
          num_items: orderItems.reduce((sum, i) => sum + i.quantity, 0),
        }, purchaseEventId);
      } catch (_) {}

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Order error:', error);
      showToast(error.response?.data?.message || 'Error placing order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Your cart is empty</h1>
          <p>Add items to your cart to proceed with checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Complete Your Order</h1>
        <p className="checkout-intro">
          Fill in your details and get ready to unveil your essence with every moment.
        </p>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number (Pakistan) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  pattern="[0-9]{11}"
                  required
                />
                <small>Format: 03XXXXXXXXX (11 digits)</small>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State/Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Postal Code (Optional)</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nearest Landmark (Optional)</label>
                <input
                  type="text"
                  name="nearestLandmark"
                  value={formData.nearestLandmark}
                  onChange={handleChange}
                  placeholder="e.g., Near XYZ Mall"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-method">
                <p><strong>Cash on Delivery (COD)</strong></p>
                <p>You will pay when you receive your order.</p>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>
            {qrDiscount && (
              <div className="qr-discount-badge">
                🎉 QR Code Discount Applied &mdash; 10% OFF!
              </div>
            )}
            <div className="summary-items">
              {cartItems.map((item) => {
                if (item.type === 'bundle') {
                  return (
                    <div key={item.id} className="summary-item summary-item--bundle">
                      <span>
                        {item.name}
                        <small style={{ display: 'block', opacity: 0.75, marginTop: 4 }}>
                          {item.products.map((p) => p.name).join(', ')}
                        </small>
                      </span>
                      <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                }
                return (
                  <div key={item.product._id} className="summary-item">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>Rs {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              {qrDiscount && (
                <div className="summary-row discount-row">
                  <span>🎟️ QR Discount (10%):</span>
                  <span className="discount-amount">- Rs {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>Rs {deliveryCharge}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

