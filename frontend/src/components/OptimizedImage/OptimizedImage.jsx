import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy', 
  fetchPriority = 'auto',
  containerClassName = '',
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#F3EFE8] ${containerClassName}`}>
      {/* Skeleton / Blur Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-[#E6E1D8]" />
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-[#FAF8F5]">
          <ImageIcon size={24} className="mb-2 opacity-50" />
          <span className="text-xs uppercase tracking-widest font-semibold opacity-50">Image Unavailable</span>
        </div>
      )}

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        fetchpriority={fetchPriority}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-700 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default OptimizedImage;
