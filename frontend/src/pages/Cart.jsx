import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, Minus, Plus, ShoppingCart, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
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
      className="flex gap-5 py-6 border-b border-[var(--color-border)] last:border-0"
    >
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-24 h-28 object-cover rounded-[12px] bg-[var(--color-secondary-bg)] hover:opacity-90 transition-opacity"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest mb-1.5">
              {typeof product.category === 'object' ? (product.category?.name || 'Jewellery') : (product.category || 'Jewellery')}
            </p>
            <Link
              to={`/product/${product.slug}`}
              className="text-base font-medium text-[var(--color-brand)] hover:text-[var(--color-accent)] transition-colors line-clamp-2 leading-snug"
            >
              {name}
            </Link>
          </div>
          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 p-2 text-[#8A8A8A] hover:text-red-500 transition-colors rounded-[8px] hover:bg-red-50"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          {/* Inline Quantity Selector */}
          <div className="inline-flex items-center border border-[var(--color-border)] rounded-[8px] bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-9 h-9 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-secondary-bg)] disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-[var(--color-brand)] border-x border-[var(--color-border)] bg-[var(--color-background)]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= (product.stock || 99)}
              className="w-9 h-9 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-secondary-bg)] disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Line Total */}
          <p className="text-lg font-bold text-[var(--color-brand)]">
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
      <div className="container-default section-padding">
        <ErrorState message={error} onRetry={refreshCart} />
      </div>
    );
  }

  return (
    <div className="container-default section-padding pb-20">
      <Breadcrumb items={[{ label: 'Shopping Cart', path: '/cart' }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand)] font-heading">Shopping Cart</h1>
        {itemCount > 0 && (
          <p className="text-[var(--color-muted)] font-medium mt-2">
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
              className="btn-primary"
            >
              Explore Collections <ArrowRight size={18} className="ml-2" />
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Items List */}
          <div className="flex-1">
            <div className="premium-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-4">
                <h2 className="text-lg font-bold text-[var(--color-brand)] uppercase tracking-wider">Items</h2>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[var(--color-muted)] hover:text-red-500 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Clear All
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
              className="inline-flex items-center gap-2 mt-6 text-sm text-[var(--color-accent)] font-bold hover:text-[var(--color-brand)] transition-colors tracking-wide"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-card p-6 md:p-8 sticky top-28 bg-[var(--color-background)]"
            >
              <h2 className="text-xl font-bold text-[var(--color-brand)] mb-6 font-heading">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)] font-medium">Subtotal ({itemCount} items)</span>
                  <span className="font-bold text-[var(--color-brand)]">{formatPrice(subtotal)}</span>
                </div>
                {shipping > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)] font-medium">Shipping</span>
                    <span className="font-bold text-[var(--color-brand)]">{formatPrice(shipping)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)] font-medium">Shipping</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)] font-medium">Tax (GST)</span>
                    <span className="font-bold text-[var(--color-brand)]">{formatPrice(tax)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--color-border)] pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[var(--color-brand)] uppercase tracking-wider">Grand Total</span>
                  <span className="text-2xl font-bold text-[var(--color-brand)]">{formatPrice(grandTotal)}</span>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-1.5 font-medium">Inclusive of all taxes</p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-4 text-base"
              >
                Proceed to Checkout <ArrowRight size={18} className="ml-2" />
              </button>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs font-medium text-[var(--color-muted)] bg-white py-2 rounded-[8px] border border-[var(--color-border)]">
                <ShoppingBag size={14} />
                Secure checkout by Aparna Aura
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
