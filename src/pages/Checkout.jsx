import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { MapPin, CreditCard, ChevronRight, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  // Navigation steps: 'shipping', 'payment', 'success'
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Shipping Address Fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [shippingError, setShippingError] = useState('');

  // Mock Card Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Redirect if cart is empty and not on success step
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'success') {
      navigate('/cart');
    }
  }, [cartItems, step, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setShippingError('');

    if (!address || !city || !postalCode || !country) {
      setShippingError('Please fill in all shipping fields.');
      return;
    }

    setStep('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
      setPaymentError('Please fill in all card details.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setPaymentError('Invalid card number. Must be 16 digits.');
      return;
    }

    setLoading(true);

    try {
      // 1. Post order items to database
      const orderBody = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Credit Card',
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const { data: createdOrder } = await axios.post('/api/orders', orderBody);

      // 2. Mock payment confirmation: update order in backend to paid
      await axios.put(`/api/orders/${createdOrder._id}/pay`, {
        id: 'PAY_MOCK_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'COMPLETED',
      });

      // 3. Complete checkout state
      setPlacedOrderId(createdOrder._id);
      clearCart();
      setStep('success');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setPaymentError(
        err.response && err.response.data.message ? err.response.data.message : err.message
      );
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-6">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
        <h1 className="text-2xl font-black text-slate-100">Order Placed Successfully!</h1>
        <p className="text-sm text-slate-400 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Your order has been logged and marked as **paid**. We are preparing your tech items for shipment.
        </p>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl my-8 text-xs text-left space-y-1.5 max-w-xs mx-auto">
          <p className="text-slate-500">Order ID: <span className="font-mono text-slate-300">{placedOrderId}</span></p>
          <p className="text-slate-500">Shipment address: <span className="text-slate-350">{address}, {city}</span></p>
          <p className="text-slate-500">Payment Status: <span className="text-emerald-400 font-semibold">PAID</span></p>
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-violet-600 to-primary-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-violet-550/15"
        >
          View Order History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-8">
        Checkout
      </h1>

      {/* Progress Wizard Header */}
      <div className="flex items-center space-x-4 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-900 max-w-lg">
        <span className={`text-sm font-bold flex items-center space-x-1.5 ${
          step === 'shipping' ? 'text-primary-400' : 'text-slate-450'
        }`}>
          <MapPin size={16} /> <span>1. Shipping</span>
        </span>
        <ChevronRight size={14} className="text-slate-600" />
        <span className={`text-sm font-bold flex items-center space-x-1.5 ${
          step === 'payment' ? 'text-primary-400' : 'text-slate-450'
        }`}>
          <CreditCard size={16} /> <span>2. Payment</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Panels */}
        <div className="lg:col-span-8">
          {step === 'shipping' ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
                <MapPin size={18} className="mr-2 text-primary-400" /> Shipping Details
              </h2>

              {shippingError && (
                <div className="bg-red-950/45 border border-red-500/20 text-red-300 rounded-xl p-4 text-sm mb-6">
                  {shippingError}
                </div>
              )}

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St, Apt 4B"
                    className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="San Francisco"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="94103"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="United States"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-3.5 bg-primary-600 hover:bg-primary-500 font-bold rounded-xl text-white transition-all active:scale-[0.99]"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
              <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <CreditCard size={18} className="mr-2 text-primary-400" /> Card Payment Simulation
                </span>
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Edit Shipping
                </button>
              </h2>

              {paymentError && (
                <div className="bg-red-950/45 border border-red-500/20 text-red-300 rounded-xl p-4 text-sm mb-6">
                  {paymentError}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="19"
                      placeholder="4111 2222 3333 4444"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={cardNumber}
                      onChange={(e) => {
                        // Add spacing every 4 characters
                        const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength="5"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length === 2 && !val.includes('/')) {
                          val += '/';
                        }
                        setCardExpiry(val);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Security Code (CVC)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="3"
                      placeholder="***"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-violet-600 to-primary-600 hover:from-violet-500 hover:to-primary-500 font-bold rounded-xl text-white flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Checkout (${totalPrice.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Items Summary */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-base font-bold text-white mb-6 border-b border-slate-850 pb-4">
              Your Items
            </h2>

            <div className="max-h-48 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3 w-4/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-12 object-cover rounded bg-slate-900 border border-slate-800"
                    />
                    <span className="font-semibold text-slate-300 truncate">{item.name}</span>
                  </div>
                  <span className="text-slate-400 whitespace-nowrap">{item.qty} × ${item.price.toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 border-t border-slate-850 pt-4 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (15%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-850 pt-1"></div>
              <div className="flex justify-between text-sm font-bold text-slate-200">
                <span>Total Due</span>
                <span className="text-base font-black text-slate-100">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
