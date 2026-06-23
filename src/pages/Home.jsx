import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, HelpCircle } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const categories = ['All', 'Audio', 'Keyboards', 'Wearables', 'Accessories'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/products?keyword=${encodeURIComponent(keyword)}`;
        if (selectedCategory !== 'All') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        const { data } = await axios.get(url);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };

    fetchProducts();
  }, [keyword, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Client-side sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // 'featured' (default order)
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-slate-900 via-violet-950/70 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col justify-center min-h-[260px]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-650/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4 uppercase tracking-wider">
            Premium Workspaces
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Elevate Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Digital Stream</span>
          </h1>
          <p className="text-sm md:text-base text-slate-350 leading-relaxed">
            Discover high-fidelity acoustics, responsive mechanical boards, and cutting-edge devices designed to optimize your focus and style.
          </p>
        </div>
      </div>

      {/* Categories Horizontal Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8 pb-4 border-b border-slate-900">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-thin">
          <SlidersHorizontal size={18} className="text-slate-400 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-violet-600 to-primary-600 text-white border-transparent shadow-lg shadow-violet-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-650'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <ArrowUpDown size={16} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <LoadingSpinner fullPage={true} />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 font-semibold mb-2">Failed to load catalog.</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 px-4 py-2 rounded-xl text-sm"
          >
            <RefreshCw size={14} /> <span>Try Again</span>
          </button>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-900">
          <HelpCircle className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-300">No products found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find matches for "{keyword}" {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}.
          </p>
          <button
            onClick={() => {
              setSearchParams({});
              setSelectedCategory('All');
            }}
            className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-650 rounded-xl text-sm font-semibold text-slate-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div key={product._id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
