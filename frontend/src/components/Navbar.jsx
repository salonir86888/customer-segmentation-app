import React from 'react';
import { Users, BarChart3, Target, UserPlus, Database, Sparkles, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, openAuthModal } = useAuth();
  const { customers } = useCustomers();

  const navItems = [
    {
      id: 'analytics',
      label: 'Analytics & Clusters',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'register',
      label: 'Register Customer',
      sublabel: 'Fill & Store',
      icon: UserPlus,
      badge: 'New'
    },
    {
      id: 'explorer',
      label: 'Data Action Hub',
      sublabel: 'Explore & Act',
      icon: Database,
      badge: customers.length > 0 ? customers.length : null
    },
    {
      id: 'predictor',
      label: 'Live Predictor',
      icon: Target,
      badge: null
    }
  ];

  return (
    <header className="glass-nav sticky top-0 z-40 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Logo & Platform identity */}
          <div 
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-smooth">
                <Users size={22} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 bg-clip-text text-transparent">
                  Segment<span className="text-sky-600">IQ</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">POS Retail Intelligence & Behavioral RFM</p>
            </div>
          </div>

          {/* Center Navigation Bar (Tabs) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-100/90 border border-sky-100/80 rounded-2xl shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-smooth ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-md shadow-sky-950/5 border border-sky-100'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-white/60'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: User Login / Session Profile */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-3 p-1.5 pr-3 bg-white/90 hover:bg-white border border-sky-100/90 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-300 transition-smooth group"
                title="Click to view profile or switch account"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-sky-200 group-hover:scale-105 transition"
                />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-100 text-sky-700 rounded">
                      {currentUser.role_badge || currentUser.roleBadge || 'Active'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{currentUser.role || 'Team Member'}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-sky-600 transition" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-smooth"
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-sky-100/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 border border-sky-100'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1 rounded-full bg-white/20 text-current">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}