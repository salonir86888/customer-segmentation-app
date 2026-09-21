import React, { useState } from 'react';
import { predictCustomerSegment } from '../services/api';
import { useCustomers } from '../context/CustomerContext';
import {
  Sparkles,
  Loader2,
  Target,
  Sliders,
  Zap,
  CheckCircle2,
  Award,
  Clock,
  ShoppingBag,
  IndianRupee,
  Share2
} from 'lucide-react';

export default function SegmentPredictor() {
  const { determineSegment } = useCustomers();

  const [recency, setRecency] = useState('6');
  const [frequency, setFrequency] = useState('14');
  const [monetary, setMonetary] = useState('48000');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!recency || !frequency || !monetary) return;
    setLoading(true);

    try {
      // Call backend API /api/predict
      const data = await predictCustomerSegment(recency, frequency, monetary);
      setResult(data);
    } catch (err) {
      console.warn("Backend /api/predict offline or unavailable, using local machine learning heuristics", err);
      // Fallback local engine heuristics
      const seg = determineSegment(recency, frequency, monetary);
      const meta = {
        "VIP Champions": {
          cluster_id: 0,
          segment_name: "VIP Champions",
          description: "Top-tier affluent clientele with high order frequency and peak basket monetary size.",
          recommended_strategy: "Offer dedicated concierge manager, bespoke loyalty multipliers, and early access previews."
        },
        "Consistent Bargain Buyers": {
          cluster_id: 1,
          segment_name: "Consistent Bargain Buyers",
          description: "Regular visitors with steady purchasing habits driven by promotional discounts and bundled deals.",
          recommended_strategy: "Send personalized bundle discounts, buy-2-get-1 alerts, and free delivery thresholds."
        },
        "At-Risk / Dormant": {
          cluster_id: 2,
          segment_name: "At-Risk / Dormant",
          description: "Clients with high lapsed recency (>60 days). Substantial risk of brand defection.",
          recommended_strategy: "Dispatch high-urgency 25% win-back comeback voucher via WhatsApp / SMS within 48 hours."
        },
        "Occasional / Newbies": {
          cluster_id: 3,
          segment_name: "Occasional / Newbies",
          description: "Newly onboarded or sporadic customers with emerging transaction histories.",
          recommended_strategy: "Trigger onboarding welcome series, reward second transaction, and gather initial feedback."
        }
      };
      setResult(meta[seg] || meta["Occasional / Newbies"]);
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (r, f, m) => {
    setRecency(r.toString());
    setFrequency(f.toString());
    setMonetary(m.toString());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100/80 text-sky-800 text-xs font-bold rounded-full mb-3 border border-sky-200">
          <Target size={14} />
          <span>Real-Time RFM AI Inference Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Live Customer Segment Classifier
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Input individual customer behavioral traits to infer their statistical K-Means cluster persona and generate immediate marketing playbooks.
        </p>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1">Try Archetypes:</span>
        <button
          onClick={() => setPreset(4, 18, 75000)}
          className="px-3 py-1.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl shadow-sm transition"
        >
          👑 VIP Champion (₹75k)
        </button>
        <button
          onClick={() => setPreset(12, 18, 14000)}
          className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl shadow-sm transition"
        >
          🏷️ Bargain Buyer (18 visits)
        </button>
        <button
          onClick={() => setPreset(95, 4, 28000)}
          className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl shadow-sm transition"
        >
          ⚠️ At-Risk Dormant (95 days)
        </button>
        <button
          onClick={() => setPreset(2, 1, 3500)}
          className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl shadow-sm transition"
        >
          🌱 Newbie (1 visit)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Controls */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-950/5">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">RFM Dimension Sliders</h3>
            </div>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              Interactive
            </span>
          </div>

          <form onSubmit={handlePredict} className="space-y-6 text-xs">
            
            {/* Recency Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-sky-600" />
                  <span>Recency (Days since last purchase)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={recency}
                    onChange={(e) => setRecency(e.target.value)}
                    className="w-16 glass-input py-1 px-2 rounded-lg text-center font-bold text-slate-900 text-xs"
                  />
                  <span className="text-slate-400 font-semibold">days</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={recency}
                onChange={(e) => setRecency(e.target.value)}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0d (Today)</span>
                <span>90d (Lapsed)</span>
                <span>180d (Dormant)</span>
              </div>
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-sky-600" />
                  <span>Frequency (Total visit count)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-16 glass-input py-1 px-2 rounded-lg text-center font-bold text-slate-900 text-xs"
                  />
                  <span className="text-slate-400 font-semibold">orders</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 order</span>
                <span>25 orders</span>
                <span>50+ orders</span>
              </div>
            </div>

            {/* Monetary Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <IndianRupee size={14} className="text-sky-600" />
                  <span>Monetary Total (Lifetime spend in ₹)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={monetary}
                    onChange={(e) => setMonetary(e.target.value)}
                    className="w-24 glass-input py-1 px-2 rounded-lg text-center font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>
              <input
                type="range"
                min="500"
                max="150000"
                step="500"
                value={monetary}
                onChange={(e) => setMonetary(e.target.value)}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹500</span>
                <span>₹75,000</span>
                <span>₹1,50,000+</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/20 transition-smooth flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Computing Multi-Dimensional Cluster...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Classify Customer Persona</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results & Strategic Playbook Card */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border-sky-200 shadow-2xl shadow-sky-950/10 space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classification Outcome</span>
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
                  Cluster ID: #{result.cluster_id}
                </span>
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  {result.segment_name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* CRM Strategy Box */}
              <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200/80 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-extrabold">
                  <Zap size={16} />
                  <span>Recommended Action Playbook:</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.recommended_strategy}
                </p>
              </div>

              {/* Engagement Metrics Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Retention Priority</span>
                  <span className="font-bold text-slate-800">
                    {result.segment_name.includes('VIP') ? 'High / Critical' : result.segment_name.includes('Risk') ? 'Immediate Win-Back' : 'Standard Growth'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Preferred Channel</span>
                  <span className="font-bold text-slate-800">
                    {result.segment_name.includes('VIP') ? 'Personal Concierge / WhatsApp' : 'Email + App Notification'}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                <Target size={30} />
              </div>
              <h4 className="text-base font-bold text-slate-700">Awaiting Input Parameters</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Adjust the sliders on the left or select a preset archetype above, then click <strong>Classify Customer Persona</strong>.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}