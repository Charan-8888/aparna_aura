import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=800&h=1000&fit=crop';

const CategoryCard = memo(({ category, index = 0 }) => {
  const image = category.image || FALLBACK_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
    >
      <Link
        to={`/categories/${category.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[#24141f] shadow-[0_16px_45px_rgba(47,27,43,.08)]"
      >
        <OptimizedImage
          src={image}
          alt={category.name || 'Jewellery category'}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          containerClassName="absolute inset-0 h-full w-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,8,13,.03)_25%,rgba(20,10,17,.88)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          {category.productCount != null && (
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d9b45d]">
              {category.productCount} pieces
            </p>
          )}
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-xl font-medium text-white sm:text-2xl">{category.name}</h3>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white/75 backdrop-blur-sm transition duration-300 group-hover:border-[#d9b45d] group-hover:bg-[#d9b45d] group-hover:text-[#26141f]">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
