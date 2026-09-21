import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Store,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Clock,
  Award,
  Sparkles,
  Send,
  Trash2,
  Edit3,
  Tag,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';

export default function CustomerProfileModal({ customer, onClose, onPerformAction }) {
  const { deleteCustomer, updateCustomer } = useCustomers();
  const [activeTab, setActiveTab] = useState('overview');
  const [actionDoneMsg, setActionDoneMsg] = useState(null);

  if (!customer) return null;

  const handleUpgradeTier = (newTier) => {
    updateCustomer(customer.customer_id, { loyalty_tier: newTier });
    setActionDoneMsg(`Loyalty tier upgraded to ${newTier}!`);
    setTimeout(() => setActionDoneMsg(null), 2500);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete profile ${customer.customer_name}?`)) {
      deleteCustomer(customer.customer_id);
      onClose();
    }
  };

  const getSegmentColor = (seg) => {
    switch (seg) {
      case 'VIP Champions':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Consistent Bargain Buyers':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'At-Risk / Dormant':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl shadow-2xl shadow-sky-950/15 overflow-hidden">
        
        {/* Decorative header glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-sky-400/20 via-blue-500/15 to-indigo-500/20 pointer-events-none" />

        {/* Header Bar */}
        <div className="relative p-6 pb-4 flex items-start justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-sky-600/20">
              {customer.customer_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">{customer.customer_name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSegmentColor(customer.segment)}`}>
                  {customer.segment}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ID: <span className="font-mono font-semibold text-sky-700">{customer.customer_id}</span> • Registered {customer.date_added || 'Recently'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {actionDoneMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold animate-in slide-in-from-top-1">
            <Check size={16} />
            <span>{actionDoneMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* RFM Metrics Triad */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-sky-600 mb-1">
                <Clock size={15} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recency</span>
              </div>
              <p className="text-lg font-black text-slate-900">{customer.recency} days</p>
              <span className="text-[10px] text-slate-400">Since last order</span>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                <ShoppingBag size={15} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Frequency</span>
              </div>
              <p className="text-lg font-black text-slate-900">{customer.frequency} orders</p>
              <span className="text-[10px] text-slate-400">Total lifetime visits</span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <IndianRupee size={15} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monetary</span>
              </div>
              <p className="text-lg font-black text-slate-900">₹{(customer.monetary || 0).toLocaleString()}</p>
              <span className="text-[10px] text-slate-400">Gross revenue value</span>
            </div>
          </div>

          {/* Contact and Branch Details */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact & Location</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-sky-600" />
                <span>{customer.email || 'No email attached'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-sky-600" />
                <span>{customer.phone || 'No phone attached'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Store size={14} className="text-sky-600" />
                <span>Branch: {customer.store_location || 'General Store'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-amber-500" />
                <span>Tier: <strong className="text-slate-900">{customer.loyalty_tier || 'Silver'}</strong></span>
              </div>
            </div>
          </div>

          {/* Strategic Notes */}
          {customer.notes && (
            <div className="p-4 bg-sky-50/40 border border-sky-100 rounded-2xl text-xs">
              <span className="font-bold text-slate-700 block mb-1">CRM Intelligence & Notes:</span>
              <p className="text-slate-600 leading-relaxed">{customer.notes}</p>
            </div>
          )}

          {/* Action Dispatcher Shortcuts */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-3">Execute Direct Actions for this Customer:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onPerformAction('SEND_CAMPAIGN', [customer.customer_id])}
                className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-sky-800 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Send size={14} /> Send Campaign Email
              </button>

              <button
                type="button"
                onClick={() => handleUpgradeTier('Platinum')}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-800 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Award size={14} /> Upgrade to Platinum
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-800 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 size={14} /> Delete Profile
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
