import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import {
  UserPlus,
  Sparkles,
  CheckCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  RotateCcw,
  Tag,
  Store
} from 'lucide-react';

export default function CustomerFormPage({ onNavigateToExplorer }) {
  const { addCustomer, determineSegment } = useCustomers();

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customerId, setCustomerId] = useState(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
  const [recency, setRecency] = useState(4);
  const [frequency, setFrequency] = useState(12);
  const [monetary, setMonetary] = useState(45000);
  const [storeLocation, setStoreLocation] = useState('Mumbai Flagship');
  const [channel, setChannel] = useState('Omni-channel');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Retail', 'Registered']);

  const [submittedCustomer, setSubmittedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic live predicted segment
  const liveSegment = determineSegment(recency, frequency, monetary);

  const getSegmentTheme = (seg) => {
    switch (seg) {
      case 'VIP Champions':
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          border: 'border-sky-300',
          bg: 'bg-gradient-to-br from-sky-50 to-blue-50/50',
          iconColor: 'text-sky-600',
          action: 'Assign dedicated executive, send VIP lounge invite, offer early drop access.'
        };
      case 'Consistent Bargain Buyers':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          border: 'border-emerald-300',
          bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50',
          iconColor: 'text-emerald-600',
          action: 'Target with bundle discounts, seasonal voucher blasts, and free shipping triggers.'
        };
      case 'At-Risk / Dormant':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          border: 'border-rose-300',
          bg: 'bg-gradient-to-br from-rose-50 to-orange-50/50',
          iconColor: 'text-rose-600',
          action: 'Dispatch urgent 25% win-back comeback offer via WhatsApp / SMS.'
        };
      default:
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          border: 'border-amber-300',
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50/50',
          iconColor: 'text-amber-600',
          action: 'Trigger welcome nurturing sequence and second-purchase reward coupon.'
        };
    }
  };

  const currentTheme = getSegmentTheme(liveSegment);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleQuickPreset = (r, f, m) => {
    setRecency(r);
    setFrequency(f);
    setMonetary(m);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const record = {
      customer_id: customerId,
      customer_name: name || `Customer ${customerId}`,
      email: email || `${customerId.toLowerCase()}@client.io`,
      phone: phone || '+91 98000 00000',
      recency: parseFloat(recency) || 0,
      frequency: parseInt(frequency, 10) || 1,
      monetary: parseFloat(monetary) || 0.0,
      segment: liveSegment,
      store_location: storeLocation,
      channel: channel,
      notes: notes || `Registered through Customer Data Capture Portal.`,
      tags: tags
    };

    setTimeout(() => {
      addCustomer(record);
      setSubmittedCustomer(record);
      setIsSubmitting(false);

      // Generate new ID for next entry
      setCustomerId(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Registry & Data Onboarding
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture new customer records, store profile data in the database, and preview automated behavioral RFM clustering in real time.
          </p>
        </div>

        <button
          onClick={onNavigateToExplorer}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl shadow-sm hover:shadow transition-smooth self-start md:self-auto"
        >
          <Database size={16} />
          <span>View Stored Records in Action Hub</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Success Notification Alert */}
      {submittedCustomer && (
        <div className="glass-panel-elevated p-4 rounded-2xl border-emerald-200 bg-emerald-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Customer Record Stored Successfully!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                <strong>{submittedCustomer.customer_name}</strong> ({submittedCustomer.customer_id}) was saved and assigned to{' '}
                <span className="font-bold underline">{submittedCustomer.segment}</span>.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToExplorer}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl shadow-sm transition"
          >
            Explore & Perform Actions &rarr;
          </button>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Comprehensive Registration Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl shadow-sky-950/5">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
                  <Store size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Fill Customer Information</h3>
                  <p className="text-xs text-slate-500">All fields are indexed and persistently stored</p>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(3, 16, 68000)}
                  className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-bold rounded-lg border border-sky-200 transition"
                  title="VIP Preset"
                >
                  VIP
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(80, 5, 29000)}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-200 transition"
                  title="Dormant Preset"
                >
                  Dormant
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(14, 20, 14500)}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 transition"
                  title="Bargain Hunter Preset"
                >
                  Bargain
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Identity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Customer Full Name <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Merchant"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl font-mono text-sky-700 font-bold bg-slate-50 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Work / Personal Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@domain.com"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Branch and Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Store Branch Node</label>
                  <select
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none text-xs"
                  >
                    <option value="Mumbai Flagship">Mumbai Flagship</option>
                    <option value="Bangalore Tech Hub">Bangalore Tech Hub</option>
                    <option value="Delhi NCR Mall">Delhi NCR Mall</option>
                    <option value="Hyderabad Midtown">Hyderabad Midtown</option>
                    <option value="Pune Express">Pune Express</option>
                    <option value="Ahmedabad Central">Ahmedabad Central</option>
                    <option value="Kolkata City Center">Kolkata City Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Acquisition Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none text-xs"
                  >
                    <option value="Omni-channel">Omni-channel (In-Store + Web)</option>
                    <option value="Physical POS Counter">Physical POS Counter</option>
                    <option value="Mobile App Exclusive">Mobile App Exclusive</option>
                    <option value="Direct Sales / WhatsApp">Direct Sales / WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* RFM Parameters Section */}
              <div className="pt-3 pb-1 border-t border-slate-100">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
                  Behavioral RFM Metrics
                </span>
                <p className="text-[11px] text-slate-500 mb-3">Adjust these parameters to watch live persona recalculation on the right.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Recency */}
                  <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-100">
                    <label className="block font-bold text-slate-800 mb-1">
                      Recency (Days Ago)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      required
                      value={recency}
                      onChange={(e) => setRecency(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-lg text-slate-900 font-bold outline-none text-sm"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Since last transaction</span>
                  </div>

                  {/* Frequency */}
                  <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-100">
                    <label className="block font-bold text-slate-800 mb-1">
                      Frequency (Visits)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      required
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-lg text-slate-900 font-bold outline-none text-sm"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Total lifetime orders</span>
                  </div>

                  {/* Monetary */}
                  <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-100">
                    <label className="block font-bold text-slate-800 mb-1">
                      Monetary Spend (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      required
                      value={monetary}
                      onChange={(e) => setMonetary(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-lg text-slate-900 font-bold outline-none text-sm"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Gross lifetime spend</span>
                  </div>
                </div>
              </div>

              {/* Tags & Notes */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Segmentation Tags (Press Enter)</label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 glass-input rounded-xl mb-1.5">
                  {tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-[11px] font-semibold"
                    >
                      <Tag size={10} />
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="hover:text-rose-600 ml-1 font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type tag & Enter..."
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-xs text-slate-800 px-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Profile Notes & Preferences</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Inquires about seasonal bridal collection, prefers weekend morning shopping..."
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-smooth flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Storing Customer...</span>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Save & Store Customer Profile</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setEmail('');
                    setPhone('');
                    setNotes('');
                    setRecency(2);
                    setFrequency(1);
                    setMonetary(3500);
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Dynamic Scorecard & Persona Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`glass-panel rounded-2xl p-6 border ${currentTheme.border} ${currentTheme.bg} shadow-xl shadow-sky-950/5 sticky top-24 transition-smooth`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-sky-200/50">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className={currentTheme.iconColor} />
                <h3 className="text-sm font-bold text-slate-900">Real-Time RFM AI Scorecard</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-white/80 px-2 py-0.5 rounded-full border border-sky-200">
                Live Classifier
              </span>
            </div>

            {/* Persona Result Banner */}
            <div className="my-5 p-5 bg-white/90 backdrop-blur rounded-2xl border border-sky-100 shadow-md">
              <p className="text-xs text-slate-500 font-medium">Dynamic Classified Persona:</p>
              <div className="flex items-center justify-between mt-1.5">
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {liveSegment}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentTheme.badge}`}>
                  Active Tier
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">RECENCY</span>
                  <span className="text-xs font-bold text-slate-800">{recency} days</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">FREQUENCY</span>
                  <span className="text-xs font-bold text-slate-800">{frequency} orders</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">MONETARY</span>
                  <span className="text-xs font-bold text-slate-800">₹{Number(monetary).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actionable Strategy Recommendation */}
            <div className="p-4 bg-white/85 rounded-xl border border-sky-100 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-sky-700 font-bold">
                <Zap size={15} />
                <span>Recommended CRM Playbook:</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {currentTheme.action}
              </p>
            </div>

            {/* Persistence & Flow Explainer */}
            <div className="mt-5 p-4 bg-sky-50/70 rounded-xl border border-sky-200/60 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Database size={15} className="text-sky-600" />
                <span>Data Flow & Persistence:</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Once saved, this customer profile is stored in the application database and appears instantly on the <strong>Data Action Hub</strong> page for bulk marketing campaigns, SMS triggers, and individual 360-degree drill-downs.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
