import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import ProductCard from '../components/ProductCard/ProductCard';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import EmptyState from '../components/EmptyState/EmptyState';
import ErrorState from '../components/ErrorState/ErrorState';
import { Package } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

const Category = () => {
  const { slug } = useParams();
  const isAll = slug === 'all';
  
  const { category, categories, loading: catLoading, error: catError, retry: catRetry } = useCategories(isAll ? null : slug);
  const { products, loading: prodLoading, error: prodError, retry: prodRetry } = useProducts({ category: isAll ? '' : slug });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (catError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState message={catError} onRetry={catRetry} />
      </div>
    );
  }

  if (catLoading) {
    return (
      <div>
        <div className="h-[40vh] w-full bg-gray-100 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SkeletonLoader type="card" count={8} />
        </div>
      </div>
    );
  }

  if (!category && !isAll) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Category Not Found"
          description="The category you are looking for does not exist."
          action={
            <Link to="/products" className="bg-[#382135] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2a1827] transition-colors">
              Browse All Products
            </Link>
          }
        />
      </div>
    );
  }

  // If slug is 'all', show list of categories
  if (isAll) {
    return (
      <div>
        <div className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=1600&h=600&fit=crop" alt="Categories" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white font-heading mb-4"
            >
              Our Collections
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 max-w-2xl mx-auto text-lg"
            >
              Explore our complete collection of fine jewellery
            </motion.p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Breadcrumb items={[{ label: 'Categories', path: '/categories/all' }]} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {categories?.map((cat, i) => (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/categories/${cat.slug}`} className="group block relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=800&h=800&fit=crop'} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-3xl font-bold text-white font-heading mb-2">{cat.name}</h2>
                    <p className="text-[#D4AF37] font-medium tracking-wider text-sm uppercase">Explore Collection →</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Single Category View
  const safeImage = category.image || 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=1600&h=600&fit=crop';
  
  return (
    <div>
      {/* Luxury Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={safeImage} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 px-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] font-medium tracking-[0.3em] uppercase text-sm mb-4"
          >
            Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white font-heading mb-4"
          >
            {category.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 max-w-2xl mx-auto text-lg drop-shadow-md"
          >
            {category.description}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Categories', path: '/categories/all' },
          { label: category.name, path: `/categories/${category.slug}` }
        ]} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title={`Explore ${category.name}`} className="!mb-0" />
            {!prodLoading && !prodError && (
              <span className="text-gray-500 font-medium">{products?.length || 0} Products</span>
            )}
          </div>

          {prodError ? (
             <ErrorState message={prodError} onRetry={prodRetry} />
          ) : prodLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
               <SkeletonLoader type="card" count={4} />
            </div>
          ) : !products || products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Products Yet"
              description={`We are currently curating beautiful ${category.name.toLowerCase()} for you.`}
              action={
                <Link to="/products">
                  <button className="bg-[#382135] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2a1827] transition-colors mt-4">
                    Shop All Jewellery
                  </button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id || product.slug} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
