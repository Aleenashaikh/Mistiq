import { createContext, useState, useContext } from 'react';

const DiscountContext = createContext();

export const useDiscount = () => {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscount must be used within DiscountProvider');
  }
  return context;
};

export const DiscountProvider = ({ children }) => {
  // qrDiscount: active for this session (clears on browser close)
  const [qrDiscount, setQrDiscount] = useState(() => {
    return sessionStorage.getItem('qrDiscount') === 'true';
  });

  // discountAlreadyUsed: persists across sessions — once used it stays used
  const discountAlreadyUsed = localStorage.getItem('qrDiscountUsed') === 'true';

  /**
   * Activate only if the discount has NOT been used before.
   * Returns true if activated, false if already used.
   */
  const activateQrDiscount = () => {
    if (localStorage.getItem('qrDiscountUsed') === 'true') {
      return false; // Already used — reject silently, caller shows toast
    }
    sessionStorage.setItem('qrDiscount', 'true');
    setQrDiscount(true);
    return true;
  };

  /**
   * Called after a successful order — marks discount as permanently used.
   */
  const clearDiscount = () => {
    sessionStorage.removeItem('qrDiscount');
    localStorage.setItem('qrDiscountUsed', 'true'); // Permanently mark as used
    setQrDiscount(false);
  };

  return (
    <DiscountContext.Provider value={{ qrDiscount, discountAlreadyUsed, activateQrDiscount, clearDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
};
