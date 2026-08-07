import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, ShieldCheck, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/ErrorState/ErrorState';

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrder(orderId);
        setOrder(response.data || response);
      } catch (err) {
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      // 1. Create order on backend
      const { data: rpData } = await paymentService.createRazorpayOrder(orderId);

      if (!rpData?.key_id || !rpData?.razorpay_order_id) {
        throw new Error('The payment gateway returned incomplete checkout details.');
      }
      
      // 2. Load Razorpay script if not present
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // 3. Initialize Razorpay
      const options = {
        key: rpData.key_id,
        amount: rpData.amount,
        currency: rpData.currency,
        name: 'Aparna Aura',
        description: `Order #${order.order_number || order.id.slice(0, 8)}`,
        order_id: rpData.razorpay_order_id,
        handler: async function (response) {
          // 4. Verify signature on backend
          try {
            await paymentService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/order-success', { state: { orderId: order.id } });
          } catch (verifyErr) {
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: order.shipping_address?.full_name || '',
          contact: order.shipping_address?.phone || '',
        },
        theme: {
          color: '#382135',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not initiate Razorpay. Try again.');
      setProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    setProcessing(true);
    try {
      await paymentService.confirmCOD(orderId);
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (err) {
      setError('Failed to confirm Cash on Delivery. Please try again.');
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (selectedMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error && !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="aura-route-hero aura-route-hero--center mb-10">
        <h1 className="text-3xl font-bold text-[#382135] mb-2">Complete Payment</h1>
        <p className="text-gray-500">Choose your preferred payment method</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Payment Methods */}
        <div className="md:col-span-3 space-y-4">
          <label 
            className={`block relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedMethod === 'razorpay' ? 'border-[#382135] bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              value="razorpay" 
              checked={selectedMethod === 'razorpay'} 
              onChange={() => setSelectedMethod('razorpay')}
              className="sr-only"
            />
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedMethod === 'razorpay' ? 'bg-[#382135] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <CreditCard size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#382135]">Pay Online</h3>
                  {selectedMethod === 'razorpay' && <CheckCircle className="text-[#382135]" size={20} />}
                </div>
                <p className="text-sm text-gray-500 mt-1">UPI, Cards, NetBanking, Wallets securely via Razorpay.</p>
                
                <AnimatePresence>
                  {selectedMethod === 'razorpay' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <ShieldCheck size={16} className="text-green-500" />
                        256-bit encryption. Secure checkout.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </label>

          <label 
            className={`block relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedMethod === 'cod' ? 'border-[#382135] bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              value="cod" 
              checked={selectedMethod === 'cod'} 
              onChange={() => setSelectedMethod('cod')}
              className="sr-only"
            />
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedMethod === 'cod' ? 'bg-[#382135] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <Banknote size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#382135]">Cash on Delivery</h3>
                  {selectedMethod === 'cod' && <CheckCircle className="text-[#382135]" size={20} />}
                </div>
                <p className="text-sm text-gray-500 mt-1">Pay with cash when your order is delivered.</p>
              </div>
            </div>
          </label>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
            <h2 className="text-lg font-bold text-[#382135] mb-4">Order Details</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold text-[#382135]">#{order.order_number || order.id.slice(0,8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-[#382135]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-[#382135]">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : <span className="text-green-600">Free</span>}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-[#382135]">{formatPrice(order.tax_amount)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#382135]">Amount to Pay</span>
                <span className="text-2xl font-bold text-[#382135]">{formatPrice(order.total_amount)}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-[#382135] text-white font-bold py-4 rounded-xl hover:bg-[#2a1827] transition-all duration-300 shadow-lg shadow-[#382135]/20 disabled:opacity-70"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>Pay {formatPrice(order.total_amount)} <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
