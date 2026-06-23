import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, ChevronLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 2500);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-red-950/20 border border-red-500/20 rounded-full text-red-400 mb-4">
          <RefreshCw size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-200">Error loading product details</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">{error}</p>
        <Link to="/" className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-650 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-350 transition-all">
          <ChevronLeft size={16} /> <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Container */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-3.5 rounded-3xl overflow-hidden aspect-video bg-slate-900/60 shadow-xl border border-slate-800">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        </div>

        {/* Right Column: Information Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category tag */}
            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block mb-2">
              {product.category}
            </span>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                    className={i < Math.floor(product.rating || 0) ? "text-amber-400" : "text-slate-700"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-350">{product.rating.toFixed(1)}</span>
              <span className="text-slate-600">|</span>
              <span className="text-sm text-slate-400">{product.numReviews} Verified Reviews</span>
            </div>

            {/* Price section */}
            <div className="py-4 border-y border-slate-850 mb-6">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider block">Price</span>
              <span className="text-3xl font-black text-slate-100">${product.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm uppercase font-semibold text-slate-400 tracking-wider mb-2">Details</h3>
              <p className="text-sm text-slate-350 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Action Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400 font-medium">Availability</span>
              {product.countInStock > 0 ? (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  product.countInStock <= 3
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {product.countInStock <= 3 ? `Only ${product.countInStock} Left!` : 'In Stock'}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  Out of Stock
                </span>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-slate-400 font-medium">Quantity</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`w-full flex items-center justify-center space-x-2 py-3.5 px-4 font-bold rounded-xl transition-all duration-300 ${
                product.countInStock === 0
                  ? 'bg-slate-800 text-slate-550 cursor-not-allowed border border-slate-700/40'
                  : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-xl hover:shadow-primary-600/20 active:scale-[0.99]'
              }`}
            >
              {addedMessage ? (
                <>
                  <Check size={18} />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs text-slate-450 border-t border-slate-900 pt-6">
            <div className="flex flex-col items-center">
              <Truck size={18} className="text-violet-400 mb-1" />
              <span>Free Shipping Over $100</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={18} className="text-violet-400 mb-1" />
              <span>Secure checkout</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw size={18} className="text-violet-400 mb-1" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
