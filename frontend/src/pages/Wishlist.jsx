import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
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
  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=400&h=400&fit=crop';
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
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Remove button */}
        <button
          onClick={() => onRemove(productId)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="Remove from wishlist"
        >
          <Trash2 size={15} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-medium mb-0.5">
          {product.category || 'Jewellery'}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="text-sm font-semibold text-[#382135] hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug block mb-3"
        >
          {name}
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-base font-bold text-[#382135]">{formatPrice(price)}</span>
          {originalPrice > price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Move to Cart */}
        <button
          onClick={() => onMoveToCart(productId)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#382135] text-white text-sm font-semibold rounded-xl hover:bg-[#2a1827] transition-colors"
        >
          <ShoppingBag size={15} />
          Add to Cart
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Breadcrumb items={[{ label: 'My Wishlist', path: '/wishlist' }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#382135]">My Wishlist</h1>
            {wishlistCount > 0 && (
              <p className="text-gray-500 mt-1">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
              </p>
            )}
          </div>
          {wishlistCount > 0 && (
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:text-[#382135] transition-colors"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </motion.div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save your favourite pieces here and come back to them anytime."
          action={
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#382135] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#2a1827] transition-colors"
            >
              Explore Collections <ArrowRight size={18} />
            </Link>
          }
        />
      ) : (
        <AnimatePresence initial={false}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
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
      )}
    </div>
  );
};

export default Wishlist;
