import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useDiscount } from '../context/DiscountContext';
import axios from '../config/axios';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemKey,
  } = useCart();
  const { qrDiscount } = useDiscount();
  const [deliveryCharge, setDeliveryCharge] = useState(200);

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const response = await axios.get('/api/admin/settings');
        setDeliveryCharge(response.data.deliveryCharge);
      } catch (error) {
        console.error('Error fetching delivery charge:', error);
      }
    };
    fetchDeliveryCharge();
  }, []);

  const subtotal = getCartTotal();
  const discountAmount = qrDiscount ? subtotal * 0.10 : 0;
  const total = subtotal - discountAmount + deliveryCharge;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Bag</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your bag is feeling lonely. Add something unforgettable.</p>
            <Link to="/products" className="shop-btn">Shop Now</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => {
                const key = getCartItemKey(item);

                if (item.type === 'bundle') {
                  return (
                    <div key={key} className="cart-item cart-item--bundle">
                      <div className="cart-bundle-thumbs" aria-hidden>
                        {item.products.slice(0, 3).map((p) => (
                          <img
                            key={p._id}
                            src={p.bottleImage || '/images/perfumes/placeholder.jpg'}
                            alt=""
                            loading="lazy"
                          />
                        ))}
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p className="cart-bundle-list">
                          {item.products.map((p) => p.name).join(' · ')}
                        </p>
                        <p>Rs {item.price}</p>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(key, item.quantity - 1)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(key, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        <p>Rs {(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(key)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={key} className="cart-item">
                    <img
                      src={item.product.bottleImage || '/images/perfumes/placeholder.jpg'}
                      alt={item.product.name}
                      className="cart-item-image"
                      loading="lazy"
                    />
                    <div className="cart-item-info">
                      <h3>{item.product.name}</h3>
                      <p>Rs {item.product.price}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <p>Rs {(item.product.price * item.quantity).toFixed(2)}</p>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              {qrDiscount && (
                <div className="cart-qr-badge">
                  🎉 QR Discount Active &mdash; 10% OFF at Checkout!
                </div>
              )}
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              {qrDiscount && (
                <div className="summary-row cart-discount-row">
                  <span>🎟️ QR Discount (10%):</span>
                  <span className="cart-discount-amount">- Rs {discountAmount.toFixed(2)}</span>
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
              <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
