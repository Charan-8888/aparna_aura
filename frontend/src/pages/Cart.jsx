import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, ShoppingCart, Minus, Plus } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/ErrorState/ErrorState';
import EmptyState from '../components/EmptyState/EmptyState';
import { useCart } from '../hooks/useCart';

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

// ─── Cart Item Row ────────────────────────────────────────────────────────────
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product || {};
  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=400&h=400&fit=crop';
  const name = product.name || item.name || 'Product';
  const price = Number(item.price || product.price || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-5 border-b border-gray-100 last:border-0"
    >
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-24 h-28 object-cover rounded-xl bg-gray-100 hover:opacity-90 transition-opacity"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-medium mb-0.5">
              {product.category || 'Jewellery'}
            </p>
            <Link
              to={`/product/${product.slug}`}
              className="text-sm font-semibold text-[#382135] hover:text-[#D4AF37] transition-colors line-clamp-2"
            >
              {name}
            </Link>
          </div>
          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Inline Quantity Selector */}
          <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-[#382135] border-x border-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= (product.stock || 99)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Line Total */}
          <p className="text-base font-bold text-[#382135]">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Breadcrumb items={[{ label: 'Shopping Cart', path: '/cart' }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#382135]">Shopping Cart</h1>
        {itemCount > 0 && (
          <p className="text-gray-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        )}
      </motion.div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Discover our exquisite collection of fine jewellery and add your favourites."
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-[#382135]">Items</h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={13} /> Clear All
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

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-5 text-sm text-[#D4AF37] font-medium hover:text-[#382135] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28"
            >
              <h2 className="text-lg font-bold text-[#382135] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-[#382135]">{formatPrice(subtotal)}</span>
                </div>
                {shipping > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-[#382135]">{formatPrice(shipping)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (GST)</span>
                    <span className="font-medium text-[#382135]">{formatPrice(tax)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-[#382135]">Grand Total</span>
                  <span className="text-xl font-bold text-[#382135]">{formatPrice(grandTotal)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-[#382135] text-white font-semibold py-4 rounded-xl hover:bg-[#2a1827] transition-all duration-300 shadow-lg shadow-[#382135]/20"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShoppingBag size={12} />
                Secure checkout powered by Aparna Aura
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
