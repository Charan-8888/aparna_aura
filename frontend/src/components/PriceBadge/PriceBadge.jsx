import React, { memo } from 'react';

const PriceBadge = memo(({ price, originalPrice, formatPrice, size = 'md' }) => {
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizes = {
    sm: { price: 'text-base', original: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { price: 'text-xl', original: 'text-sm', badge: 'text-xs px-2 py-0.5' },
    lg: { price: 'text-3xl', original: 'text-lg', badge: 'text-sm px-2.5 py-1' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className={`${s.price} font-bold text-[#382135]`}>
        {formatPrice(price)}
      </span>
      {discount > 0 && (
        <>
          <span className={`${s.original} text-gray-400 line-through`}>
            {formatPrice(originalPrice)}
          </span>
          <span className={`${s.badge} bg-green-100 text-green-700 font-semibold rounded-full`}>
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
});

PriceBadge.displayName = 'PriceBadge';

export default PriceBadge;
