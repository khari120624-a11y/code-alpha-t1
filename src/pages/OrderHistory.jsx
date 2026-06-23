import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Package, CreditCard, ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h2 className="text-xl font-bold text-slate-200">Failed to fetch order history</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-350"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-8">
        Your Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-900">
          <HelpCircle className="mx-auto text-slate-650 mb-4" size={40} />
          <h3 className="text-lg font-bold text-slate-300">No orders placed yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">Explore our tech products and place your first order!</p>
          <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-bold text-white transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all duration-300"
            >
              {/* Card Header: Order summary metadata */}
              <div className="bg-slate-900/50 border-b border-slate-850 p-4 sm:p-5 flex flex-wrap justify-between items-center gap-4 text-xs sm:text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <span className="text-slate-500 block font-medium uppercase tracking-wider text-[10px]">Order ID</span>
                    <span className="font-mono text-slate-300 font-semibold">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium uppercase tracking-wider text-[10px]">Date Placed</span>
                    <span className="text-slate-300 font-semibold flex items-center mt-0.5">
                      <Calendar size={13} className="mr-1.5 text-slate-400" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium uppercase tracking-wider text-[10px]">Total Bill</span>
                    <span className="text-slate-200 font-extrabold">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex space-x-2">
                  {/* Paid Badge */}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {order.isPaid ? 'PAID' : 'UNPAID'}
                  </span>

                  {/* Delivery Badge */}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.isDelivered
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {order.isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
                  </span>
                </div>
              </div>

              {/* Card Body: Items layout */}
              <div className="p-4 sm:p-5">
                <div className="divide-y divide-slate-850">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="py-3 flex items-center justify-between text-sm first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3.5 w-3/4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-14 object-cover rounded bg-slate-900 border border-slate-850"
                        />
                        <div>
                          <p className="font-bold text-slate-250 truncate">{item.name}</p>
                          <span className="text-xs text-slate-500">Qty: {item.qty} × ${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-300">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping address footer review */}
                <div className="mt-4 pt-4 border-t border-slate-850 flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-slate-450 gap-2">
                  <p>
                    📍 Shipping to:{' '}
                    <span className="text-slate-350">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </span>
                  </p>
                  {order.isPaid && order.paymentResult?.id && (
                    <p className="font-mono text-slate-500 text-[10px]">
                      Transaction ID: {order.paymentResult.id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
