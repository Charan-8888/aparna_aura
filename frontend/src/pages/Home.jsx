import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Shield, Truck, Award, RefreshCw,
  Quote, Send, Gift, Gem, Eye, Camera, Heart,
  Package, Star, Sparkles,
} from 'lucide-react';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import ProductCard from '../components/ProductCard/ProductCard';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import ErrorState from '../components/ErrorState/ErrorState';
import OptimizedImage from '../components/OptimizedImage/OptimizedImage';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { TESTIMONIALS, INSTAGRAM_POSTS } from '../data/testimonials';
import { APP_NAME } from '../constants/app';

import SEO from '../components/SEO/SEO';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}`;

// ─── Luxury Packaging Showcase Items ──
const PACKAGING_FEATURES = [
  {
    icon: Gift,
    title: 'Premium Gift Box',
    desc: 'Every piece arrives in our signature handcrafted wooden box with velvet lining.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f72e?w=500&h=500&fit=crop',
  },
  {
    icon: Package,
    title: 'Unboxing Experience',
    desc: 'Sealed with a wax stamp, wrapped in tissue, and presented with a personal note.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop',
  },
  {
    icon: Award,
    title: 'Certificate of Authenticity',
    desc: 'Each jewellery piece includes a hallmark-verified certificate of authenticity.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
  },
  {
    icon: Shield,
    title: 'Lifetime Care Card',
    desc: 'Complimentary cleaning and maintenance card with every purchase.',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&h=500&fit=crop',
  },
];

const Home = () => {
  const { products: trending, loading: trendingLoading, error: trendingError, retry: retryTrending } = useProducts({ is_trending: true });
  const { products: newArrivals, loading: newArrivalsLoading, error: newArrivalsError, retry: retryNewArrivals } = useProducts({ is_new_arrival: true });
  const { categories, loading: categoriesLoading, error: categoriesError, retry: retryCategories } = useCategories();
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <div className="-mt-24">
      <SEO 
        title="Luxury Jewellery & Fine Ornaments"
        description="Elegant handcrafted jewellery designed to celebrate life's most meaningful moments. Explore our premium collection of rings, necklaces, earrings, and bridal wear."
        url="/"
      />
      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Marquee Band ── */}
      <div className="bg-[#382135] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-8 text-white/40 text-xs font-medium uppercase tracking-[0.25em] mr-8">
              {['Handcrafted with Love', 'Certified Authentic', 'Premium Artistry', 'Since 2020', 'Insured Delivery', 'Lifetime Warranty', 'BIS Hallmarked'].map((t) => (
                <React.Fragment key={t}>
                  <span>{t}</span>
                  <Gem size={10} className="text-[#D4AF37]/50" />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionTitle
            title="Shop by Category"
            subtitle="Explore our curated collections of exquisite jewellery"
          />
          <Link
            to="/categories/all"
            className="flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:text-[#382135] transition-colors mt-4 md:mt-0"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        {categoriesError ? (
          <ErrorState message={categoriesError} onRetry={retryCategories} />
        ) : categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            <SkeletonLoader type="card" count={6} />
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id || cat.slug} category={cat} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No categories available at the moment.</p>
        )}
      </section>

      {/* ── Trending Products ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle
              title="Trending Now"
              subtitle="Our most sought-after pieces, loved by thousands"
            />
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:text-[#382135] transition-colors mt-4 md:mt-0"
            >
              Shop All <ArrowRight size={16} />
            </Link>
          </div>

          {trendingError ? (
            <ErrorState message={trendingError} onRetry={retryTrending} />
          ) : trendingLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              <SkeletonLoader type="card" count={4} />
            </div>
          ) : trending && trending.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {trending.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id || product.slug} product={product} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No trending products found.</p>
          )}
        </div>
      </section>

      {/* ── Virtual Try-On CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div {...fadeUp}>
          <Link
            to="/try-on"
            className="block bg-gradient-to-r from-[#382135] to-[#4D2C48] rounded-3xl p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D4AF37]/5 rounded-full group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#D4AF37]/5 rounded-full group-hover:scale-125 transition-transform duration-700" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <Camera size={32} className="text-[#D4AF37]" />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={10} /> New Feature
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Virtual Try-On
                </h3>
                <p className="text-white/60 text-sm max-w-lg">
                  See how our jewellery looks on you using your camera — before you buy. No app needed.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm whitespace-nowrap group-hover:gap-3 transition-all">
                Try Now <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* ── Featured Collection Banner ── */}
      <section className="relative overflow-hidden mt-8">
        <motion.div {...fadeUp} className="relative h-[50vh] md:h-[60vh] bg-[#1a1a2e]">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=1600&h=800&fit=crop"
            alt="Featured Collection"
            className="w-full h-full object-cover"
            containerClassName="absolute inset-0 w-full h-full"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#382135]/85 via-[#382135]/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg">
                <motion.p
                  {...stagger}
                  transition={{ delay: 0.2 }}
                  className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] font-medium mb-4"
                >
                  Limited Edition
                </motion.p>
                <motion.h2
                  {...stagger}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
                >
                  The Heritage Collection
                </motion.h2>
                <motion.p
                  {...stagger}
                  transition={{ delay: 0.6 }}
                  className="text-white/70 mb-8 text-base md:text-lg leading-relaxed"
                >
                  Inspired by centuries of artistry, each piece tells a story of tradition reimagined for the modern woman.
                </motion.p>
                <motion.div {...stagger} transition={{ delay: 0.8 }}>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#382135] font-bold px-8 py-4 rounded-full hover:bg-[#e0c55c] transition-all duration-300 text-sm uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20"
                  >
                    Explore Collection <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionTitle
            title="New Arrivals"
            subtitle="Fresh from our artisans, just for you"
          />
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:text-[#382135] transition-colors mt-4 md:mt-0"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {newArrivalsError ? (
          <ErrorState message={newArrivalsError} onRetry={retryNewArrivals} />
        ) : newArrivalsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <SkeletonLoader type="card" count={4} />
          </div>
        ) : newArrivals && newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id || product.slug} product={product} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No new arrivals found.</p>
        )}
      </section>

      {/* ── Luxury Packaging Experience ── */}
      <section className="bg-[#FAF8F5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium mb-3">The Full Experience</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#382135] mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
              Luxury Beyond the Jewellery
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every {APP_NAME} purchase is a complete sensory experience — from the moment it arrives at your door.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGING_FEATURES.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E6E1D8] hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <OptimizedImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    containerClassName="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#382135]/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <item.icon size={20} className="text-[#D4AF37]" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#382135] mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-[#382135] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Why Choose {APP_NAME}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              We are committed to delivering exceptional quality and unforgettable experiences.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Certified Authentic', desc: 'Every piece comes with a certificate of authenticity and hallmark guarantee.' },
              { icon: Truck, title: 'Free Insured Shipping', desc: 'Complimentary insured delivery on all orders above ₹5,000.' },
              { icon: Award, title: 'Lifetime Warranty', desc: 'We stand behind our craftsmanship with a lifetime warranty on all jewellery.' },
              { icon: RefreshCw, title: '30-Day Returns', desc: 'Not satisfied? Return within 30 days for a full refund, no questions asked.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-300">
                  <item.icon size={28} className="text-[#D4AF37] group-hover:text-[#382135] transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Viewed (Personalized) ── */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <SectionTitle
            title="Recently Viewed"
            subtitle="Pick up where you left off"
          />
          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 mt-10 -mx-4 px-4">
            {recentlyViewed.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.slug}`}
                className="flex-shrink-0 w-40 group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F3EFE8] mb-3 border border-[#E6E1D8] group-hover:shadow-lg transition-shadow">
                  <OptimizedImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    containerClassName="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-medium">{item.category}</p>
                <p className="text-sm font-semibold text-[#382135] truncate group-hover:text-[#D4AF37] transition-colors">{item.name}</p>
                <p className="text-sm font-bold text-[#382135] mt-0.5">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="What Our Customers Say"
            subtitle="Real stories from real customers"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 hover:shadow-lg hover:border-[#D4AF37]/20 transition-all duration-300"
              >
                <Quote size={24} className="text-[#D4AF37]/30 mb-4" />
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#382135]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(t.rating)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Gallery ── */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Follow Us on Instagram"
            subtitle="@aparnaaura • Share your moments with #AparnaAura"
            centered
          />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mt-12">
            {INSTAGRAM_POSTS.map((post, i) => (
              <motion.a
                key={post.id}
                href="#"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative group aspect-square overflow-hidden rounded-xl"
              >
                <OptimizedImage
                  src={post.image}
                  alt={`Instagram post ${post.id}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  containerClassName="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#382135]/0 group-hover:bg-[#382135]/60 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <Heart size={22} className="text-white mx-auto mb-1" />
                    <p className="text-white text-xs font-medium">{post.likes.toLocaleString()} likes</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#382135] to-[#4d3049]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <p className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] font-medium mb-4">
              Stay Connected
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the {APP_NAME} Family
            </h2>
            <p className="text-white/60 mb-10 text-lg">
              Be the first to know about new collections, exclusive offers, and styling tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3.5 rounded-full focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button className="bg-[#D4AF37] text-[#382135] font-bold px-8 py-3.5 rounded-full hover:bg-[#e0c55c] transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#D4AF37]/20">
                <Send size={18} />
                Subscribe
              </button>
            </div>
            <p className="text-white/30 text-xs mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
