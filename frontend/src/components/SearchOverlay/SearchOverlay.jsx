import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECENT_SEARCHES = ['Diamond Ring', 'Gold Necklace', 'Bridal Set'];
const POPULAR_SEARCHES = [
  { label: 'Engagement Rings', slug: 'rings' },
  { label: 'Pearl Necklaces', slug: 'necklaces' },
  { label: 'Sapphire Earrings', slug: 'earrings' },
  { label: 'Bridal Collection', slug: 'bridal' },
  { label: 'Gold Bracelets', slug: 'bracelets' },
];

const SearchOverlay = memo(({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24"
          style={{ background: 'rgba(250, 248, 245, 0.96)', backdropFilter: 'blur(14px)' }}
        >
          <div className="absolute inset-0" onClick={onClose} />
          
          <div className="w-full max-w-3xl px-4 relative z-10">
            {/* Close button */}
            <div className="absolute -top-16 right-4">
              <button
                onClick={onClose}
                className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-[#6F6F6F] hover:text-[#382135] transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input Container */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E6E1D8] p-4 flex items-center relative overflow-hidden"
            >
              <Search size={28} className="text-[#C9A227] ml-4 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for jewellery..."
                className="w-full border-none bg-transparent pl-4 pr-12 py-4 text-xl md:text-2xl font-heading text-[#382135] placeholder:text-[#8A8A8A] outline-none transition-colors duration-300"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-[#8A8A8A] hover:text-[#382135] transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </motion.div>

            {/* Search suggestions when no query */}
            {!query && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-8 grid md:grid-cols-2 gap-8 bg-white/80 rounded-[16px] p-8 shadow-sm border border-[#E6E1D8]"
              >
                {/* Recent Searches */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-5">
                    <Clock size={16} />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {RECENT_SEARCHES.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="px-4 py-2 bg-[#F3EFE8] text-[#2C2C2C] text-sm rounded-[12px] hover:bg-[#382135] hover:text-white transition-all duration-300"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Searches */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-5">
                    <TrendingUp size={16} />
                    Popular Searches
                  </h3>
                  <div className="space-y-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/categories/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between py-3 px-4 rounded-[12px] text-[#6F6F6F] hover:bg-[#F3EFE8] hover:text-[#382135] transition-all duration-300 group"
                      >
                        <span className="font-medium">{item.label}</span>
                        <ArrowRight size={16} className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Search results placeholder when query exists */}
            {query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white/80 rounded-[16px] mt-8 shadow-sm border border-[#E6E1D8]"
              >
                <p className="text-[#6F6F6F] text-lg">
                  Search results for "<span className="text-[#382135] font-bold">{query}</span>"
                </p>
                <p className="text-[#8A8A8A] text-sm mt-3">Press Enter to view all results</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SearchOverlay.displayName = 'SearchOverlay';

export default SearchOverlay;
