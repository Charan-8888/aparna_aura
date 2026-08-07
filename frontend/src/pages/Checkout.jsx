import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loader from '../components/Loader/Loader';
import EmptyState from '../components/EmptyState/EmptyState';
import LuxuryGuarantees from '../components/LuxuryGuarantees/LuxuryGuarantees';
import { useCart } from '../hooks/useCart';
import addressService from '../services/addressService';
import orderService from '../services/orderService';

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, items, itemCount, subtotal, tax, shipping, grandTotal, loading: cartLoading } = useCart();
  
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await addressService.getAddresses();
        const addressList = Array.isArray(data) ? data : (data.results || []);
        setAddresses(addressList);
        
        // Auto-select default or first address
        const defaultAddr = addressList.find(a => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (addressList.length > 0) {
          setSelectedAddressId(addressList[0].id);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        setAddressesLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }
    
    setPlacingOrder(true);
    setError('');
    
    try {
      const response = await orderService.checkout(selectedAddressId);
      const orderData = response.data || response;
      const orderId = orderData.id;
      
      if (orderId) {
        navigate(`/payment/${orderId}`);
      } else {
        throw new Error("Order ID not returned from server.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartLoading || addressesLoading) return <Loader fullScreen />;

  if (itemCount === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          title="Checkout Unavailable"
          description="Your bag is empty. Please add items before proceeding to checkout."
          action={
            <Link to="/products" className="bg-[#382135] text-white px-8 py-3.5 rounded-full mt-4 inline-block font-semibold">
              Explore Collections
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={[{ label: 'Bag', path: '/cart' }, { label: 'Secure Checkout', path: '/checkout' }]} />

        <div className="aura-route-hero aura-route-hero--compact flex items-center gap-3 mt-6 mb-10">
          <Lock size={20} className="text-[#D4AF37]" />
          <h1 className="text-3xl font-bold text-[#382135]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Secure Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Side - Details */}
          <div className="flex-1 space-y-12">
            
            {/* Shipping Address Section */}
            <section>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#382135] uppercase tracking-wider text-sm">
                  1. Delivery Details
                </h2>
                <Link to="/addresses" className="text-xs font-bold text-[#D4AF37] hover:text-[#382135] uppercase tracking-wider transition-colors">
                  Manage Addresses
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF8F5] rounded-none border border-[#E6E1D8]">
                  <MapPin className="mx-auto text-gray-300 mb-4" size={32} />
                  <p className="text-gray-500 text-sm mb-6">Where should we send your luxury pieces?</p>
                  <Link to="/addresses" className="bg-white border border-[#E6E1D8] text-[#382135] px-8 py-3 rounded-full text-sm font-semibold hover:border-[#D4AF37] transition-colors">
                    Add New Address
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <div 
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`relative cursor-pointer p-6 transition-all duration-300 border ${
                          isSelected 
                            ? 'border-[#382135] bg-[#FAF8F5] shadow-md' 
                            : 'border-gray-200 hover:border-[#D4AF37] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-[#382135]">
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                          </div>
                        )}
                        <h4 className="text-base font-bold text-[#382135] mb-2 pr-6">{address.full_name}</h4>
                        <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                          <p>{address.house_no}, {address.street}</p>
                          {address.landmark && <p>{address.landmark}</p>}
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                          <p className="pt-3 font-medium text-[#382135]">Phone: {address.phone}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Review Items Section */}
            <section>
              <h2 className="text-xl font-bold text-[#382135] uppercase tracking-wider text-sm mb-6 pb-2 border-b border-gray-100">
                2. Review Items
              </h2>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-gray-50 overflow-hidden flex-shrink-0">
                      <img src={typeof item.product.images?.[0] === 'object' ? item.product.images?.[0]?.image : (item.product.images?.[0] || item.product.image)} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-[#382135] line-clamp-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-base font-bold text-[#382135]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 text-sm">
                <Link to="/cart" className="text-xs font-bold text-gray-400 hover:text-[#382135] uppercase tracking-wider flex items-center gap-1.5 w-fit transition-colors">
                  <ArrowLeft size={14} /> Back to Bag
                </Link>
              </div>
            </section>

          </div>

          {/* Right Side - Summary (High Contrast Dark Theme) */}
          <div className="lg:w-[420px] flex-shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#382135] text-white p-8 lg:p-10 sticky top-28 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
                Order Summary
              </h2>
              
              <div className="space-y-5 mb-8 text-white/80">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Insured Shipping</span>
                  <span className="font-semibold text-[#D4AF37]">{shipping > 0 ? formatPrice(shipping) : 'Complimentary'}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span className="font-semibold text-white">{formatPrice(tax)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-white/20 pt-6 mb-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Total</span>
                  <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="text-xs text-white/50 text-right mt-2">Inclusive of all duties and taxes</p>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddressId}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#382135] font-bold py-4 hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs disabled:opacity-70"
              >
                {placingOrder ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#382135]/30 border-t-[#382135] rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>Continue to Payment <ArrowRight size={16} className="ml-2" /></>
                )}
              </button>
              
              <div className="mt-8 pt-4 border-t border-white/20">
                <div className="text-white">
                  <LuxuryGuarantees className="border-0 pt-0" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
