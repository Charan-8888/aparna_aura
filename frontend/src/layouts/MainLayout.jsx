import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import Loader from '../components/Loader/Loader';
import ToastContainer from '../components/Toast/Toast';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

// Scroll-to-top on route change
const ScrollReset = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors duration-300">
      <ScrollReset />
      <Navbar />
      
      {/* 
        Main content area wrapper.
        The top padding accounts for the fixed navbar height.
      */}
      <main className="flex-grow pt-24 pb-12">
        <Suspense fallback={<Loader fullScreen />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      
      <Footer />
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
