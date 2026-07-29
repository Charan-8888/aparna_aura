import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, Minus, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/ErrorState/ErrorState';
import EmptyState from '../components/EmptyState/EmptyState';
import LuxuryGuarantees from '../components/LuxuryGuarantees/LuxuryGuarantees';
import { useCart } from '../hooks/useCart';

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

// ─── Cart Item Row ────────────────────────────────────────────────────────────
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product || {};
  const image = typeof product.images?.[0] === 'object'
    ? product.images?.[0]?.image
    : product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=400&h=400&fit=crop';
  const name = product.name || item.name || 'Product';
  const price = Number(item.price || product.price || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.3 }}
      className="flex gap-6 py-6 border-b border-gray-100 last:border-0"
    >
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-28 h-32 object-cover rounded-xl bg-gray-50 hover:opacity-90 transition-opacity border border-gray-100"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-medium mb-1">
              {product.category || 'Jewellery'}
            </p>
            <Link
              to={`/product/${product.slug}`}
              className="text-lg font-bold text-[#382135] hover:text-[#D4AF37] transition-colors line-clamp-2"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {name}
            </Link>
          </div>
          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors uppercase text-xs tracking-wider font-semibold"
            title="Remove item"
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Minimalist Quantity Selector */}
          <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[#382135]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= (product.stock || 99)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Line Total */}
          <p className="text-xl font-bold text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
            {formatPrice(price * item.quantity)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Cart Page ───────────────────────────────────────────────────────────
const Cart = () => {
  const navigate = useNavigate();
  const {
    items, itemCount,
    subtotal, tax, shipping, grandTotal,
    loading, error,
    updateQuantity, removeItem, clearCart,
    refreshCart,
  } = useCart();

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={refreshCart} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[85vh] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={[{ label: 'Shopping Bag', path: '/cart' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Shopping Bag
          </h1>
          {itemCount > 0 && (
            <p className="text-gray-500 mt-3 text-sm tracking-wide uppercase">
              {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'} reserved for you
            </p>
          )}
        </motion.div>

        {items.length === 0 ? (
          <EmptyState
            icon={null} // We will use custom luxury styling below instead of default icon
            title="Your Shopping Bag Is Empty"
            description="Discover timeless pieces crafted to celebrate life's most meaningful moments."
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
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Items List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-[#382135] uppercase tracking-wider">Reserved Items</h2>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>

              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:w-[420px] flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#FAF8F5] p-8 lg:p-10 sticky top-28 border border-[#E6E1D8]"
              >
                <h2 className="text-2xl font-bold text-[#382135] mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8 text-[#382135]">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {shipping > 0 ? (
                    <div className="flex justify-between text-sm">
                      <span>Insured Shipping</span>
                      <span className="font-semibold">{formatPrice(shipping)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span>Insured Shipping</span>
                      <span className="font-semibold text-green-600">Complimentary</span>
                    </div>
                  )}
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Taxes (GST)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E6E1D8] pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-[#382135] uppercase tracking-wider">Total</span>
                    <span className="text-3xl font-bold text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">Inclusive of all duties and taxes</p>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center gap-2 bg-[#382135] text-white font-semibold py-4 rounded-full hover:bg-[#2a1827] transition-all duration-300 shadow-lg shadow-[#382135]/20 uppercase tracking-widest text-xs"
                >
                  Secure Checkout <ArrowRight size={16} />
                </button>

                {/* Trust Badges */}
                <LuxuryGuarantees className="mt-8 pt-6 border-[#E6E1D8]" />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
