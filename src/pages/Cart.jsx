import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-5 bg-slate-905 border border-slate-800 rounded-full text-slate-500 mb-6">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-200">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-1 mb-8">
          Browse our collections and discover premium tech devices for your workspace.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-violet-600 to-primary-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-violet-550/15"
        >
          <ArrowLeft size={16} className="mr-2" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-8">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-6"
            >
              {/* Product Thumbnail */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="h-16 w-24 flex-shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div>
                  <Link
                    to={`/product/${item.product}`}
                    className="text-sm font-bold text-slate-100 hover:text-primary-400 line-clamp-1 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-slate-400 block mt-1">${item.price.toFixed(2)} each</span>
                </div>
              </div>

              {/* Quantity & Delete Controls */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                {/* Quantity Select */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Qty</span>
                  <select
                    value={item.qty}
                    onChange={(e) => updateQty(item.product, e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subtotal Item Price */}
                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-bold text-slate-200">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                  title="Remove from Cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Panel */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-850 pb-4">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-slate-200">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className="font-semibold text-slate-200">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Est. Tax (15%)</span>
                <span className="font-semibold text-slate-200">${taxPrice.toFixed(2)}</span>
              </div>
              
              {shippingPrice > 0 && (
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg">
                  💡 Add <span className="font-semibold text-primary-400">${(100 - itemsPrice).toFixed(2)}</span> more to unlock **FREE SHIPPING**!
                </div>
              )}

              <div className="h-px bg-slate-850 pt-2"></div>

              <div className="flex justify-between text-base">
                <span className="font-bold text-slate-300">Total Price</span>
                <span className="text-xl font-black text-slate-100">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-violet-600 to-primary-600 hover:from-violet-500 hover:to-primary-500 text-white font-bold rounded-xl shadow-lg shadow-violet-550/15 transition-all duration-300 active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
