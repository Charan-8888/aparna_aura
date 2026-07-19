import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    : "flex justify-center items-center p-8";

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-12 h-12 rounded-full border-4 border-[#382135]/30 border-t-[#382135] dark:border-[#D4AF37]/30 dark:border-t-[#D4AF37] animate-spin"
      />
    </div>
  );
};

export default Loader;
