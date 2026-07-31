import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Package, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import Pagination from '../components/Pagination/Pagination';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import EmptyState from '../components/EmptyState/EmptyState';
import ErrorState from '../components/ErrorState/ErrorState';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { APP_NAME } from '../constants/app';

const ITEMS_PER_PAGE = 8; 

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || null,
    max_price: searchParams.get('max_price') || 100000,
    ordering: searchParams.get('ordering') || 'featured',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const { products, pagination, loading, error, retry } = useProducts(filters);
  const { categories } = useCategories();
  const categoryList = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.min_price) params.set('min_price', filters.min_price);
    if (filters.max_price < 100000) params.set('max_price', filters.max_price);
    if (filters.ordering && filters.ordering !== 'featured') params.set('ordering', filters.ordering);
    if (filters.search) params.set('search', filters.search);
    if (filters.page > 1) params.set('page', filters.page);
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '', page: 1 }));
  };

  const handleFilterChange = (newSidebarFilters) => {
    setFilters(prev => ({
      ...prev,
      category: newSidebarFilters.category || '',
      max_price: newSidebarFilters.maxPrice || 100000,
      ordering: newSidebarFilters.sort || 'featured',
      page: 1, 
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setFilters({
      category: '',
      min_price: null,
      max_price: 100000,
      ordering: 'featured',
      search: '',
      page: 1,
    });
  };

  const sidebarFilters = {
    category: filters.category,
    maxPrice: filters.max_price,
    sort: filters.ordering,
  };

  const activeFilterCount = [
    filters.category,
    filters.max_price < 100000,
    filters.ordering !== 'featured',
  ].filter(Boolean).length;

  const totalPages = Math.ceil((pagination.count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="luxury-page min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="relative bg-[#301b2f] pt-28 pb-24 px-4 overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow text-[#d8b979] mb-5">Fine jewellery, considered</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-5" style={{ fontFamily: '"Playfair Display", serif' }}>
              {filters.category ? categories?.find(c => c.slug === filters.category)?.name || 'The Collection' : 'The Signature Collection'}
            </h1>
            <p className="text-white/65 max-w-xl mx-auto text-sm md:text-base leading-7 mb-10">
              Discover our exquisite range of handcrafted jewellery. Each piece tells a story of timeless elegance and unparalleled craftsmanship.
            </p>
            
            {/* Minimalist Search within Header */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search the collection..."
                className="w-full pl-12 pr-10 py-3.5 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:bg-white/15 focus:border-[#D4AF37]/50 backdrop-blur-md transition-all text-sm"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-8">
        <Breadcrumb items={[{ label: 'Shop', path: '/products' }]} />
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-7 mb-10 border-b border-[#e7dfd3] gap-4">
          <p className="text-sm font-medium text-gray-500">
            {!loading && !error ? `Showing ${products.length} of ${pagination.count} results` : 'Loading...'}
          </p>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Sort Dropdown - Desktop */}
            <div className="relative hidden lg:block group">
              <select
                value={filters.ordering}
                onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value, page: 1 }))}
                className="appearance-none bg-transparent pr-8 pl-2 py-2 text-sm font-bold text-[#382135] focus:outline-none cursor-pointer border-none uppercase tracking-wider"
              >
                <option value="featured">Featured</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-created_at">Newest First</option>
                <option value="-rating">Highest Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#382135] group-hover:text-[#D4AF37] transition-colors" />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full px-6 py-2.5 text-sm font-bold text-[#382135] hover:border-[#D4AF37] transition-colors"
            >
              <SlidersHorizontal size={16} />
              Refine
              {activeFilterCount > 0 && (
                <span className="bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <FilterSidebar
                isOpen={true} // Always open on desktop
                onClose={() => {}}
                filters={sidebarFilters}
                onFilterChange={handleFilterChange}
                categories={categories} 
              />
            </div>
          </div>

          {/* Mobile Filter Sidebar Drawer */}
          <div className="lg:hidden">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={sidebarFilters}
              onFilterChange={handleFilterChange}
              categories={categories} 
            />
          </div>

          {/* Product Grid Container */}
          <div className="flex-1 min-w-0">
            
            {/* Category Chips (Mobile/Tablet only) */}
            <div className="lg:hidden flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6 -mx-4 px-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  !filters.category
                    ? 'bg-[#382135] text-white shadow-md shadow-[#382135]/20'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#D4AF37]'
                }`}
              >
                All Pieces
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    filters.category === cat.slug
                      ? 'bg-[#382135] text-white shadow-md shadow-[#382135]/20'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-[#D4AF37]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                <SkeletonLoader type="card" count={6} />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No Products Found"
                description="Try adjusting your filters or search query to explore our collection."
                action={
                  <button onClick={clearAllFilters} className="mt-6 px-8 py-3 bg-[#382135] text-white rounded-full font-semibold hover:bg-[#2a1827] transition-colors">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10 lg:gap-y-16"
                >
                  {products.map((product, i) => (
                    <ProductCard key={product.id || product.slug} product={product} index={i} />
                  ))}
                </motion.div>
                
                <div className="mt-16 pt-8 border-t border-gray-100">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages > 0 ? totalPages : 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
