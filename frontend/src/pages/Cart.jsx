import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const DELIVERY_CHARGE = 200;
  const total = getCartTotal() + DELIVERY_CHARGE;

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
              {cartItems.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <img 
                    src={item.product.bottleImage || '/images/perfumes/placeholder.jpg'} 
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h3>{item.product.name}</h3>
                    <p>Rs {item.product.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p>Rs {(item.product.price * item.quantity).toFixed(2)}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>Rs {DELIVERY_CHARGE}</span>
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

