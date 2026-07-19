import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Shield, Truck, RefreshCw, Check } from 'lucide-react';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import PriceBadge from '../components/PriceBadge/PriceBadge';
import RatingDisplay from '../components/RatingDisplay/RatingDisplay';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import ProductCard from '../components/ProductCard/ProductCard';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import EmptyState from '../components/EmptyState/EmptyState';
import ErrorState from '../components/ErrorState/ErrorState';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, loading, error, retry } = useProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = product ? isWishlisted(product.id) : false;

  // Fetch related products based on the current product's category
  const { products: relatedProductsArray } = useProducts({
    category: product?.category || '',
  });

  // Filter out the current product from related
  const relatedProducts = relatedProductsArray
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

  // Recently viewed (newest products as placeholder)
  const { products: recentlyViewed } = useProducts({
    ordering: '-created_at',
  });
  const recentItems = recentlyViewed.filter((p) => p.id !== product?.id).slice(0, 4);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      setQuantity(1);
      setCartSuccess(false);
    }
  }, [product?.slug]);

  const handleAddToCart = async () => {
    if (cartLoading) return;
    setCartLoading(true);
    try {
      await addToCart(product.id, quantity, {
        onRequireLogin: () => navigate('/login', { state: { from: location } }),
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } catch {
      // Error already logged in context
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product.id, {
      onRequireLogin: () => navigate('/login', { state: { from: location } }),
    });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={retry} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Product Not Found"
          description="We couldn't find the product you're looking for."
          action={
            <Link to="/products" className="bg-[#382135] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2a1827] transition-colors">
              Continue Shopping
            </Link>
          }
        />
      </div>
    );
  }

  const images = product.images || [];
  if (images.length === 0 && product.image) images.push(product.image);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Shop', path: '/products' },
          { label: product.category, path: `/categories/${product.category}` },
          { label: product.name, path: `/product/${product.slug}` },
        ]} />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">

          {/* Left Column - Gallery */}
          <div>
            <div className="sticky top-28">
              <ImageGallery
                images={images}
                video={product.video}
                productName={product.name}
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <p className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-[#382135] mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center justify-between">
                  <RatingDisplay rating={product.rating || 5} reviewCount={product.reviewCount || 0} size="md" />
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#382135] transition-colors rounded-full hover:bg-gray-50">
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 transition-colors rounded-full hover:bg-gray-50 ${wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="mb-8">
                <PriceBadge
                  price={product.price}
                  originalPrice={product.original_price || product.price}
                  formatPrice={(p) => `₹${Number(p).toLocaleString('en-IN')}`}
                  size="lg"
                />
                <p className={`mt-2 text-sm font-medium ${product.stock > 5 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 5 ? 'In Stock - Ready to ship' : `Only ${product.stock || 0} left in stock - Order soon`}
                </p>
              </div>

              {/* Description */}
              <div className="mb-8 prose prose-sm text-gray-600">
                <p>{product.description}</p>
                <ul className="mt-4 space-y-1">
                  <li><strong>Material:</strong> {product.material || 'Premium Quality'}</li>
                  <li><strong>Weight:</strong> {product.weight || 'Standard'}</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#382135]">Quantity:</span>
                  <QuantitySelector
                    quantity={quantity}
                    onChange={setQuantity}
                    max={product.stock || 1}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || cartSuccess}
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-full border-2 font-semibold transition-all duration-300 ${
                      cartSuccess
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-[#382135] text-[#382135] hover:bg-gray-50'
                    } disabled:opacity-70`}
                  >
                    <AnimatePresence mode="wait">
                      {cartLoading ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-5 h-5 border-2 border-[#382135]/30 border-t-[#382135] rounded-full animate-spin" />
                      ) : cartSuccess ? (
                        <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                          <Check size={20} /> Added!
                        </motion.span>
                      ) : (
                        <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <ShoppingBag size={20} /> Add to Cart
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Buy It Now */}
                  <button
                    onClick={async () => {
                      await handleAddToCart();
                      navigate('/cart');
                    }}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#382135] text-white font-semibold hover:bg-[#2a1827] transition-colors shadow-lg shadow-[#382135]/20"
                  >
                    Buy It Now
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#D4AF37]">
                    <Shield size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-[#382135]">Certified</h4>
                  <p className="text-xs text-gray-500">100% Authentic</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#D4AF37]">
                    <Truck size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-[#382135]">Free Shipping</h4>
                  <p className="text-xs text-gray-500">Insured Delivery</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#D4AF37]">
                    <RefreshCw size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-[#382135]">Easy Returns</h4>
                  <p className="text-xs text-gray-500">30-Day Policy</p>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="You May Also Like" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentItems.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Recently Viewed" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {recentItems.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile Purchase Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{product.name}</p>
            <p className="text-sm font-bold text-[#382135]">₹{Number(product.price).toLocaleString('en-IN')}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="flex-shrink-0 bg-[#382135] text-white px-6 py-2.5 rounded-full font-semibold text-sm disabled:opacity-70"
          >
            {cartLoading ? 'Adding...' : cartSuccess ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
