import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Search, Settings, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-primary-500 to-indigo-400 bg-clip-text text-transparent">
              The Accessories
            </Link>
          </div>

          {/* Search bar - hidden on mobile, shown on md+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search premium gadgets..."
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-full py-2 pl-4 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-300"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 mt-2.5 mr-4 text-slate-400 hover:text-primary-400 transition-colors">
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Nav items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Products
            </Link>

            {/* Cart Icon with badge */}
            <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-600 to-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white focus:outline-none transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserIcon size={16} className="mr-3" /> Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <ClipboardList size={16} className="mr-3" /> My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-violet-400 hover:bg-slate-800 hover:text-violet-300 transition-colors"
                      >
                        <Settings size={16} className="mr-3" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors border-t border-slate-800 mt-2"
                    >
                      <LogOut size={16} className="mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2 border border-slate-700/60 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:border-slate-400 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative p-2 mr-4 text-slate-300 hover:text-white">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-600 to-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-900 px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-slate-900 border border-slate-850 rounded-full py-2 pl-4 pr-10 text-sm text-slate-100"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 mt-2.5 mr-4 text-slate-400">
              <Search size={16} />
            </button>
          </form>

          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white text-base font-medium py-1"
            >
              Products
            </Link>

            {user ? (
              <>
                <div className="h-px bg-slate-900 my-2"></div>
                <div className="flex items-center space-x-3 mb-2 px-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white text-base font-medium py-1"
                >
                  Profile Details
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white text-base font-medium py-1"
                >
                  My Orders
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-violet-400 hover:text-violet-300 text-base font-medium py-1"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 text-base font-medium py-1 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-slate-900 my-2"></div>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-gradient-to-r from-violet-600 to-primary-600 rounded-full text-base font-medium text-white shadow-lg shadow-violet-500/20"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
