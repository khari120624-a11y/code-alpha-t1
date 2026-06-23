import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { login, user, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/';

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    // Clean up auth error messages on mount
    return () => {
      setAuthError(null);
    };
  }, [user, navigate, redirect, setAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Handled by context state
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl animate-fade-in">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="mt-2.5 text-center text-sm text-slate-400">
            Or{' '}
            <Link to={redirect !== '/' ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'} className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              create a free account
            </Link>
          </p>
        </div>

        {/* Errors Display */}
        {(validationError || authError) && (
          <div className="bg-red-950/45 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3 text-red-300 text-sm">
            <AlertCircle className="flex-shrink-0 text-red-400" size={18} />
            <span>{validationError || authError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-violet-600 to-primary-600 hover:from-violet-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-xl shadow-violet-550/20 active:scale-[0.99] transition-all duration-150"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
