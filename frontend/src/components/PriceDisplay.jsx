import React from 'react';
import './PriceDisplay.css';

const PriceDisplay = ({ product, showBadge = false, className = '' }) => {
  const actualPrice = product.actualPrice || product.price || 0;
  const discountedPrice = product.discountedPrice;
  const hasDiscount = discountedPrice && discountedPrice > 0 && discountedPrice < actualPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
    : 0;
  const displayPrice = hasDiscount ? discountedPrice : actualPrice;

  return (
    <div className={`price-display ${className}`}>
      {hasDiscount && (
        <div className="discount-badge">
          {discountPercent}% OFF
        </div>
      )}
      <div className="price-container">
        {hasDiscount ? (
          <>
            <span className="actual-price">Rs {actualPrice}</span>
            <span className="discounted-price">Rs {displayPrice}</span>
          </>
        ) : (
          <span className="regular-price">Rs {displayPrice}</span>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;

