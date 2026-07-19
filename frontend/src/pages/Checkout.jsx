import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loader from '../components/Loader/Loader';
import EmptyState from '../components/EmptyState/EmptyState';
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
      <div className="container-default section-padding">
        <EmptyState
          title="Checkout Unavailable"
          description="You cannot checkout with an empty cart."
          action={
            <Link to="/products" className="btn-primary mt-4">
              Go to Shop
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-default section-padding pb-20">
      <Breadcrumb items={[{ label: 'Cart', path: '/cart' }, { label: 'Checkout', path: '/checkout' }]} />

      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand)] mt-2 mb-8">Secure Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Details */}
        <div className="flex-1 space-y-8">
          
          {/* Shipping Address Section */}
          <section className="premium-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--color-brand)] flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center text-xs">1</span>
                Shipping Address
              </h2>
              <Link to="/addresses" className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-brand)] transition-colors">
                Manage Addresses
              </Link>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-10 bg-[var(--color-secondary-bg)] rounded-[12px] border border-dashed border-[var(--color-border)]">
                <MapPin className="mx-auto text-[var(--color-muted)] mb-3" size={36} />
                <p className="text-[var(--color-muted)] text-sm mb-5">You haven't added any addresses yet.</p>
                <Link to="/addresses" className="btn-primary">
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
                      className={`relative cursor-pointer p-5 rounded-[12px] border-2 transition-all duration-300 ${
                        isSelected ? 'border-[var(--color-brand)] bg-[var(--color-secondary-bg)] shadow-md' : 'border-[var(--color-border)] hover:border-[#D4AF37] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-[var(--color-brand)]">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-[var(--color-brand)] mb-1 pr-6">{address.full_name}</h4>
                      <div className="text-sm text-[var(--color-text-main)] space-y-0.5 leading-relaxed">
                        <p>{address.house_no}, {address.street}</p>
                        {address.landmark && <p>{address.landmark}</p>}
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p className="pt-2 font-medium">Phone: {address.phone}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Review Items Section */}
          <section className="premium-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[var(--color-brand)] flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center text-xs">2</span>
              Review Items
            </h2>
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-[8px] bg-[var(--color-secondary-bg)] border border-[var(--color-border)] overflow-hidden flex-shrink-0">
                    <img src={item.product.images?.[0] || item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[var(--color-brand)] line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-[var(--color-brand)]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-sm">
              <Link to="/cart" className="text-[var(--color-accent)] font-semibold hover:text-[var(--color-brand)] flex items-center gap-1.5 w-fit transition-colors">
                <ArrowLeft size={16} /> Back to Cart to edit items
              </Link>
            </div>
          </section>

        </div>

        {/* Right Side - Summary */}
        <div className="lg:w-[380px] flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-6 md:p-8 sticky top-28"
          >
            <h2 className="text-xl font-bold text-[var(--color-brand)] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-muted)] font-medium">Subtotal</span>
                <span className="font-bold text-[var(--color-brand)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-muted)] font-medium">Shipping</span>
                <span className="font-bold text-[var(--color-brand)]">{shipping > 0 ? formatPrice(shipping) : <span className="text-green-600">Free</span>}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)] font-medium">Tax</span>
                  <span className="font-bold text-[var(--color-brand)]">{formatPrice(tax)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-[var(--color-border)] pt-5 mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-bold text-[var(--color-brand)]">Total to Pay</span>
                <span className="text-2xl font-bold text-[var(--color-brand)]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="btn-primary w-full py-4 text-base"
            >
              {placingOrder ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>Continue to Payment <ArrowRight size={18} className="ml-2" /></>
              )}
            </button>
            <p className="text-center text-xs text-[var(--color-muted)] mt-4 leading-relaxed">
              You won't be charged yet. You will select your payment method in the next step.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
