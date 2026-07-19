import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import Pagination from '../components/Pagination/Pagination';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import EmptyState from '../components/EmptyState/EmptyState';
import ErrorState from '../components/ErrorState/ErrorState';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

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

  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const { products, pagination, loading, error, retry } = useProducts(filters);
  const { categories } = useCategories();

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
    <div className="container-default section-padding pb-16">
      <Breadcrumb items={[{ label: 'Shop', path: '/products' }]} />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 mt-2"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand)] mb-3">
          Shop All Jewellery
        </h1>
        {!loading && !error && (
          <p className="text-[var(--color-muted)] font-medium">
            Showing {products.length} of {pagination.count} pieces
          </p>
        )}
      </motion.div>

      {/* Search & Controls Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-[16px] shadow-sm border border-[var(--color-border)]">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search jewellery..."
            className="w-full pl-12 pr-10 py-3 border border-[var(--color-border)] rounded-[12px] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all placeholder:text-[#8A8A8A]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#8A8A8A] hover:text-[var(--color-text-main)] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Sort Dropdown - Desktop */}
          <select
            value={filters.ordering}
            onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value, page: 1 }))}
            className="hidden lg:block border border-[var(--color-border)] rounded-[12px] px-4 py-3 text-sm bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-w-[200px] cursor-pointer font-medium text-[var(--color-text-main)]"
          >
            <option value="featured">Featured</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
            <option value="-rating">Highest Rated</option>
          </select>

          {/* View Mode Toggle */}
          <div className="hidden lg:flex items-center border border-[var(--color-border)] rounded-[12px] overflow-hidden bg-[var(--color-background)] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-[8px] transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[var(--color-brand)]' : 'text-[#8A8A8A] hover:text-[var(--color-brand)]'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-[8px] transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[var(--color-brand)]' : 'text-[#8A8A8A] hover:text-[var(--color-brand)]'}`}
            >
              <List size={18} />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex-1 flex items-center justify-center gap-2 border border-[var(--color-border)] rounded-[12px] px-4 py-3 text-sm font-semibold text-[var(--color-brand)] bg-[var(--color-background)] transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[var(--color-accent)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
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
          
          {/* Category Chips (Mobile/Tablet only to save space) */}
          <div className="lg:hidden flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6">
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !filters.category
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-accent)]'
              }`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, page: 1 }))}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.category === cat.slug
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-accent)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              <SkeletonLoader type={viewMode === 'grid' ? 'card' : 'line'} count={6} />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Products Found"
              description="Try adjusting your filters or search query to find what you're looking for."
              action={
                <button
                  onClick={clearAllFilters}
                  className="btn-primary mt-4"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div className={`grid ${
                viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              } gap-4 md:gap-6 lg:gap-8`}>
                {products.map((product, i) => (
                  <ProductCard key={product.id || product.slug} product={product} index={i} />
                ))}
              </div>
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages > 0 ? totalPages : 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
