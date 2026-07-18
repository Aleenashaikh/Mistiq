import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.type !== 'bundle' && item.product._id === product._id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.type !== 'bundle' && item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { type: 'product', product, quantity }];
    });
  };

  const addDiscoverySet = (products) => {
    if (!Array.isArray(products) || products.length !== 5) {
      throw new Error('Discovery set requires exactly 5 fragrances');
    }

    const total = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const bundle = {
      type: 'bundle',
      id: createId(),
      name: 'Discovery Set — 5 × 10ml Testers',
      products: products.map((p) => ({ ...p })),
      quantity: 1,
      price: total,
    };

    setCartItems((prev) => [...prev, bundle]);
    return bundle;
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        if (item.type === 'bundle') return item.id !== itemKey;
        return item.product._id !== itemKey;
      })
    );
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.type === 'bundle') {
          if (item.id !== itemKey) return item;
          return { ...item, quantity };
        }
        if (item.product._id !== itemKey) return item;
        return { ...item, quantity };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.type === 'bundle') {
        return total + item.price * item.quantity;
      }
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      if (item.type === 'bundle') {
        return count + item.quantity;
      }
      return count + item.quantity;
    }, 0);
  };

  const getCartItemKey = (item) =>
    item.type === 'bundle' ? item.id : item.product._id;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addDiscoverySet,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartItemKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
