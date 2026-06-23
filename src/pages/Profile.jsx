import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-8">
        Your Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Card: Summary details */}
        <div className="md:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center text-white font-extrabold text-3xl mx-auto mb-4 shadow-lg shadow-violet-500/20">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-white truncate">{user?.name}</h2>
          <p className="text-xs text-slate-450 truncate mt-0.5">{user?.email}</p>

          <div className="h-px bg-slate-850 my-5"></div>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            user?.isAdmin
              ? 'bg-violet-500/10 text-violet-400 border border-violet-550/20'
              : 'bg-slate-900 text-slate-450 border border-slate-800'
          }`}>
            {user?.isAdmin ? 'Administrator' : 'Customer Account'}
          </span>
        </div>

        {/* Right Form Panel: Profile Update */}
        <div className="md:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-slate-100 mb-6 pb-2 border-b border-slate-850">
            Account Settings
          </h3>

          {/* Success Dialog */}
          {success && (
            <div className="bg-emerald-950/40 border border-emerald-555/20 text-emerald-350 rounded-xl p-4 flex items-center space-x-3 text-sm mb-6">
              <CheckCircle2 className="text-emerald-400" size={18} />
              <span>Profile updated successfully.</span>
            </div>
          )}

          {/* Error Dialog */}
          {error && (
            <div className="bg-red-955/45 border border-red-500/25 text-red-300 rounded-xl p-4 flex items-center space-x-3 text-sm mb-6">
              <AlertCircle className="text-red-400" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-405 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-405 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-850 my-6"></div>

            <div>
              <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-4">
                Update Password (leave blank to keep current)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-405 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-405 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="block w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-550 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 bg-gradient-to-r from-violet-600 to-primary-600 hover:from-violet-500 hover:to-primary-500 text-sm font-bold rounded-xl text-white transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
