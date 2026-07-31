import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=800&h=800&fit=crop';

const CategoryCard = memo(({ category, index = 0 }) => {
  // The backend serializer now returns absolute Cloudinary URLs.
  // Guard against any stale relative paths as a safety net.
  const image = category.image || FALLBACK_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/categories/${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl aspect-[4/5]"
      >
        <OptimizedImage
          src={image}
          alt={category.name || 'Category'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          containerClassName="absolute inset-0 w-full h-full"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#382135]/90 via-[#382135]/30 to-transparent transition-opacity duration-300 pointer-events-none" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {category.productCount != null && (
            <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-widest mb-1">
              {category.productCount} Products
            </p>
          )}
          <h3 className="text-white text-xl font-bold font-heading mb-2">
            {category.name}
          </h3>
          <div className="flex items-center text-white/80 text-sm font-medium group-hover:text-[#D4AF37] transition-colors duration-300">
            <span>Explore</span>
            <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
