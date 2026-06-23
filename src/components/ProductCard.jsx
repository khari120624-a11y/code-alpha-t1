import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.countInStock === 0 && (
          <span className="absolute top-3 right-3 bg-red-650/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase border border-red-500/20">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-1.5">
          {product.category}
        </span>
        
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-base font-bold text-slate-100 hover:text-primary-400 line-clamp-1 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mt-2 mb-4 space-x-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating || 0) ? "text-amber-400" : "text-slate-600"}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.numReviews})</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/60">
          <div>
            <span className="text-xs text-slate-500 block uppercase font-medium tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-slate-100">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`inline-flex items-center justify-center p-3.5 rounded-xl transition-all duration-300 ${
              product.countInStock === 0
                ? 'bg-slate-800 text-slate-650 cursor-not-allowed border border-slate-700/40'
                : 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
