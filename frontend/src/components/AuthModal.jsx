import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShieldCheck,
  KeyRound,
  Mail,
  Sparkles,
  LogOut,
  Check,
  AlertTriangle,
  User,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock
} from 'lucide-react';

export default function AuthModal() {
  const { currentUser, login, signup, logout, isAuthModalOpen, closeAuthModal } = useAuth();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Store Operations Lead');
  const [storeName, setStoreName] = useState('Downtown Flagship & Omni-channel');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isAuthModalOpen) return null;

  const resetFeedback = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSwitchMode = (mode) => {
    resetFeedback();
    setAuthMode(mode);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(`Welcome back, ${result.user.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        closeAuthModal();
      }, 1200);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      storeName: storeName.trim() || 'Local Retail POS Node'
    });
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(`Account created successfully! Logged in as ${result.user.name}.`);
      setTimeout(() => {
        setSuccessMessage(null);
        closeAuthModal();
      }, 1400);
    } else {
      setErrorMessage(result.error);
    }
  };

  const fillDemoAccount = () => {
    setAuthMode('signin');
    setEmail('sarah.jenkins@retailpulse.io');
    setPassword('Password123!');
    resetFeedback();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-sky-100 rounded-3xl shadow-2xl shadow-sky-950/20 p-6 sm:p-8 overflow-hidden">
        {/* Soft decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-700 rounded-2xl text-white shadow-md shadow-sky-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Retail Intelligence Portal</h3>
              <p className="text-xs text-slate-500">Live Real-Time User Authentication</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current User Status Banner (if already logged in) */}
        {currentUser && (
          <div className="my-4 p-3.5 bg-sky-50/80 border border-sky-200/70 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{currentUser.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-700 rounded-full border border-sky-200">
                    {currentUser.role_badge || currentUser.roleBadge || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                setSuccessMessage('Successfully logged out.');
                setTimeout(() => setSuccessMessage(null), 1500);
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-50 transition"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        )}

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-xl my-4 border border-slate-200/60">
          <button
            type="button"
            onClick={() => handleSwitchMode('signin')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'signin'
                ? 'bg-white text-sky-700 shadow-sm shadow-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'signup'
                ? 'bg-white text-sky-700 shadow-sm shadow-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account (Sign Up)
          </button>
        </div>

        {/* ERROR / WARNING ALERT BANNER */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 flex items-start gap-3 shadow-sm animate-in fade-in duration-150">
            <div className="p-1 bg-rose-100 text-rose-600 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-rose-900">Authentication Warning</p>
              <p className="text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* SUCCESS BANNER */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5 font-medium shadow-sm animate-in fade-in duration-150">
            <div className="p-1 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
              <Check size={16} />
            </div>
            <span>{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); resetFeedback(); }}
                  placeholder="name@company.com"
                  required
                  className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); resetFeedback(); }}
                  placeholder="Enter your password"
                  required
                  className="w-full glass-input pl-10 pr-10 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Sign In to SegmentIQ</span>
                </>
              )}
            </button>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Demo Account: </span>
                  <span className="text-slate-500">sarah.jenkins@retailpulse.io</span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold rounded-lg transition"
                >
                  Auto Fill
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); resetFeedback(); }}
                  placeholder="e.g. Elena Rostova"
                  required
                  className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); resetFeedback(); }}
                  placeholder="name@company.com"
                  required
                  className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password (min 6 characters)</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); resetFeedback(); }}
                  placeholder="Create a secure password"
                  required
                  minLength={6}
                  className="w-full glass-input pl-10 pr-10 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role / Access</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full glass-input px-3 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="Store Operations Lead">Store Operations Lead</option>
                  <option value="Senior Retail Merchandiser">Senior Retail Merchandiser</option>
                  <option value="CRM & Retention Specialist">CRM & Retention Specialist</option>
                  <option value="Franchise General Manager">Franchise General Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Store / Outlet Branch</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Central Outlet"
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Create Account & Log In</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time SQLite & bcrypt Active
          </span>
          <span>SegmentIQ Identity Engine</span>
        </div>
      </div>
    </div>
  );
}
