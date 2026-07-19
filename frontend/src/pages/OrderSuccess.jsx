import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-[#382135] mb-2 font-heading">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for choosing Aparna Aura. Your order has been successfully placed and is being processed.
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium justify-center mb-2">
            <Package size={18} className="text-[#D4AF37]" />
            Order ID: #{orderId.slice(0, 8).toUpperCase()}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We've sent a confirmation email with your order details and tracking information.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to={`/orders/${orderId}`}
            className="w-full flex items-center justify-center gap-2 bg-[#382135] text-white py-3.5 px-6 rounded-full font-semibold hover:bg-[#2a1827] transition-all shadow-lg shadow-[#382135]/20"
          >
            Track Order <ArrowRight size={18} />
          </Link>
          <Link 
            to="/products"
            className="w-full flex items-center justify-center gap-2 bg-white text-[#382135] py-3.5 px-6 rounded-full font-semibold border-2 border-[#382135] hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
