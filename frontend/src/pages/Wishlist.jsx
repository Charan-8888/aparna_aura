import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/ErrorState/ErrorState';
import EmptyState from '../components/EmptyState/EmptyState';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

// ─── Wishlist Item Card ───────────────────────────────────────────────────────
const WishlistItem = ({ item, onRemove, onMoveToCart }) => {
  const product = item.product || {};
  const image = typeof product.images?.[0] === 'object'
    ? product.images?.[0]?.image
    : product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=400&h=400&fit=crop';
  const name = product.name || item.name || 'Product';
  const price = Number(product.price || 0);
  const originalPrice = Number(product.original_price || product.originalPrice || 0);
  const productId = product.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35 }}
      className="group bg-white rounded-none border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[#FAF8F5]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Remove button */}
        <button
          onClick={(e) => { e.preventDefault(); onRemove(productId); }}
          className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-[#382135] shadow-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          title="Remove from selection"
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-5 text-center">
        <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-medium mb-2">
          {typeof product.category === 'object' ? product.category?.name : (product.category || 'Jewellery')}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="text-base font-bold text-[#382135] hover:text-[#D4AF37] transition-colors line-clamp-1 block mb-3"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {name}
        </Link>

        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="text-sm font-semibold text-[#382135]">{formatPrice(price)}</span>
          {originalPrice > price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Move to Cart */}
        <button
          onClick={() => onMoveToCart(productId)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-[#382135] text-[#382135] text-xs uppercase tracking-widest font-semibold hover:bg-[#382135] hover:text-white transition-all duration-300"
        >
          <ShoppingBag size={14} />
          Move to Bag
        </button>
      </div>
    </motion.div>
  );
};

// ─── Wishlist Page ────────────────────────────────────────────────────────────
const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, wishlistCount, loading, error, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch {
      /* handled in context */
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId, 1, {
        onRequireLogin: () => navigate('/login'),
      });
      // Optionally remove from wishlist after moving
      await removeFromWishlist(productId);
    } catch {
      /* handled in context */
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={refreshWishlist} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[85vh] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={[{ label: 'Curated Selection', path: '/wishlist' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Your Curated Selection
          </h1>
          {wishlistCount > 0 && (
            <p className="text-gray-500 mt-3 text-sm tracking-wide uppercase">
              {wishlistCount} {wishlistCount === 1 ? 'Piece' : 'Pieces'} Saved
            </p>
          )}
        </motion.div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon={null} // Elegant empty state without bulky icon
            title="Your Curated Selection Awaits"
            description="Save the pieces that capture your attention and revisit them whenever inspiration strikes."
            action={
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#382135] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#2a1827] transition-all shadow-lg shadow-[#382135]/20 mt-4 uppercase tracking-wider text-sm"
              >
                Explore Collections
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Link
                to="/products"
                className="flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#382135] uppercase tracking-wider transition-colors"
              >
                Continue Exploring <ArrowRight size={16} />
              </Link>
            </div>
            
            <AnimatePresence initial={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {wishlist.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onMoveToCart={handleMoveToCart}
                  />
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
