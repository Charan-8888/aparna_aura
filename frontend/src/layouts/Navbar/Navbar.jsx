import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, Package, ChevronDown, MapPin } from 'lucide-react';
import { MAIN_NAV_LINKS } from '../../constants/navigation';
import { APP_NAME } from '../../constants/app';
import SearchOverlay from '../../components/SearchOverlay/SearchOverlay';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const dropdownRef = useRef(null);

  // Derive initials for avatar
  const initials = currentUser
    ? [currentUser.first_name, currentUser.last_name]
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || currentUser.email?.[0]?.toUpperCase() || 'U'
    : '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClose = useCallback(() => setIsSearchOpen(false), []);

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-white/80 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 z-50">
              <span className="text-2xl font-bold tracking-wider text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {MAIN_NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors relative group ${
                      isActive ? 'text-[#382135]' : 'text-gray-500 hover:text-[#382135]'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-[#382135] transition-colors rounded-full hover:bg-gray-50"
              >
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="p-2 text-gray-500 hover:text-[#382135] transition-colors rounded-full hover:bg-gray-50 relative">
                <Heart size={20} />
                {isAuthenticated && wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-[10px] text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-2 text-gray-500 hover:text-[#382135] transition-colors rounded-full hover:bg-gray-50 relative">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-[10px] text-[#382135] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth Section */}
              {isAuthenticated ? (
                /* ── Authenticated: Avatar + Dropdown ── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen((s) => !s)}
                    className="flex items-center gap-1.5 ml-1 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#382135] text-white text-xs font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-xs font-semibold text-[#382135] truncate">
                            {[currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || 'Member'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FAF8F6] hover:text-[#382135] transition-colors"
                          >
                            <User size={15} className="text-[#D4AF37]" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FAF8F6] hover:text-[#382135] transition-colors"
                          >
                            <Package size={15} className="text-[#D4AF37]" />
                            My Orders
                          </Link>
                          <Link
                            to="/addresses"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FAF8F6] hover:text-[#382135] transition-colors"
                          >
                            <MapPin size={15} className="text-[#D4AF37]" />
                            My Addresses
                          </Link>
                          <hr className="my-1 border-gray-50" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Guest: Login + Register buttons ── */
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-[#382135] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-semibold bg-[#382135] text-white px-4 py-2 rounded-full hover:bg-[#2a1827] transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-600">
                <Search size={20} />
              </button>
              <Link to="/cart" className="p-2 text-gray-600 relative">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-[10px] text-[#382135] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2 z-50 text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-40 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 pt-20 border-b border-gray-100">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#382135] text-white text-sm font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#382135]">
                        {[currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || 'Member'}
                      </p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {APP_NAME}
                  </span>
                )}
              </div>

              {/* Nav Links */}
              <nav className="flex-1 py-6 px-6 space-y-1 overflow-y-auto">
                {MAIN_NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#382135] font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="grid grid-cols-3 gap-4">
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center text-gray-500 hover:text-[#D4AF37] transition-colors">
                      <Heart size={22} className="mb-1" />
                      <span className="text-[11px]">Wishlist</span>
                    </Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center text-gray-500 hover:text-[#D4AF37] transition-colors">
                      <User size={22} className="mb-1" />
                      <span className="text-[11px]">Profile</span>
                    </Link>
                    <button onClick={handleLogout} className="flex flex-col items-center text-red-500 hover:text-red-700 transition-colors">
                      <LogOut size={22} className="mb-1" />
                      <span className="text-[11px]">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center py-2.5 border border-[#382135] text-[#382135] rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center py-2.5 bg-[#382135] text-white rounded-full text-sm font-semibold hover:bg-[#2a1827] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Navbar;
