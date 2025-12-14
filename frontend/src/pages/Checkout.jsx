import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
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
  }, []);

  const subtotal = getCartTotal();
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: 'Pakistan',
          nearestLandmark: formData.nearestLandmark,
        },
        paymentMethod: 'COD',
      };

      // Create axios instance without auth header for orders (no login required)
      const orderAxios = axios.create();
      const response = await orderAxios.post('/api/orders', orderData);
      
      clearCart();
      showToast('Order placed successfully! You will receive a confirmation email shortly.', 'success');
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
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number (Pakistan) *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                  pattern="[0-9]{4}-[0-9]{7}"
                  required 
                />
                <small>Format: 03XX-XXXXXXX</small>
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
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>Rs {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>Rs {DELIVERY_CHARGE}</span>
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

