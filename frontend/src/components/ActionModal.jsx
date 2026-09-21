import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle,
  Mail,
  Award,
  MessageSquare,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';

export default function ActionModal({ actionType, targetCustomerIds, onClose }) {
  const { customers, executeBulkAction, exportCustomers } = useCustomers();

  const [campaignTitle, setCampaignTitle] = useState('Festive VIP Exclusive 20% Privilege');
  const [couponCode, setCouponCode] = useState('PRIVILEGE20');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [customMsg, setCustomMsg] = useState('We value your continuous patronage! Enjoy an exclusive discount on your next visit.');
  const [selectedTier, setSelectedTier] = useState('Platinum');
  const [isSuccess, setIsSuccess] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const targetCustomers = customers.filter(c => targetCustomerIds.includes(c.customer_id));

  const handleExecute = (e) => {
    e.preventDefault();

    if (actionType === 'EXPORT_CSV') {
      exportCustomers('csv', targetCustomerIds);
      setIsSuccess(true);
      setProcessedCount(targetCustomerIds.length);
      return;
    }

    if (actionType === 'EXPORT_JSON') {
      exportCustomers('json', targetCustomerIds);
      setIsSuccess(true);
      setProcessedCount(targetCustomerIds.length);
      return;
    }

    let payload = {};
    if (actionType === 'SEND_CAMPAIGN') {
      payload = { campaignName: `${campaignTitle} (${couponCode})` };
    } else if (actionType === 'UPGRADE_LOYALTY') {
      payload = { tier: selectedTier };
    }

    const res = executeBulkAction(actionType, targetCustomerIds, payload);
    setProcessedCount(res.count);
    setIsSuccess(true);
  };

  const getActionHeading = () => {
    switch (actionType) {
      case 'SEND_CAMPAIGN':
        return {
          title: 'Dispatch Targeted Email & Voucher Campaign',
          icon: Mail,
          color: 'from-sky-500 to-blue-600',
          desc: 'Trigger personalized marketing offers based on recipient RFM personas.'
        };
      case 'UPGRADE_LOYALTY':
        return {
          title: 'Batch Loyalty Tier Upgrade',
          icon: Award,
          color: 'from-amber-500 to-orange-600',
          desc: 'Elevate selected customers to exclusive club memberships.'
        };
      case 'EXPORT_CSV':
      case 'EXPORT_JSON':
        return {
          title: 'Export Customer Directory',
          icon: FileSpreadsheet,
          color: 'from-emerald-500 to-teal-600',
          desc: 'Download structured records for external CRM or ERP ingestion.'
        };
      default:
        return {
          title: 'Batch Customer Action',
          icon: Sparkles,
          color: 'from-sky-500 to-blue-600',
          desc: 'Apply updates to targeted customer profiles.'
        };
    }
  };

  const info = getActionHeading();
  const Icon = info.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl shadow-2xl shadow-sky-950/15 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 bg-gradient-to-tr ${info.color} text-white rounded-xl shadow-md`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{info.title}</h3>
              <p className="text-xs text-slate-500">{info.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <CheckCircle size={36} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Action Executed Successfully!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Processed action for <strong>{processedCount}</strong> customer records in the database.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Close & Return to Hub
              </button>
            </div>
          ) : (
            <form onSubmit={handleExecute} className="space-y-4 text-xs">
              {/* Target Banner */}
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 font-medium">Selected Recipients:</span>
                <span className="font-bold text-sky-800 bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                  {targetCustomerIds.length} Profiles
                </span>
              </div>

              {actionType === 'SEND_CAMPAIGN' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Campaign Subject / Title</label>
                    <input
                      type="text"
                      required
                      value={campaignTitle}
                      onChange={e => setCampaignTitle(e.target.value)}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Promo Coupon Code</label>
                      <input
                        type="text"
                        required
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 font-mono font-bold outline-none uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount Rate (%)</label>
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={e => setDiscountPercent(e.target.value)}
                        className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Personalized Message Body</label>
                    <textarea
                      rows="3"
                      value={customMsg}
                      onChange={e => setCustomMsg(e.target.value)}
                      className="w-full glass-input px-3.5 py-2 rounded-xl text-slate-800 outline-none"
                    />
                  </div>
                </>
              )}

              {actionType === 'UPGRADE_LOYALTY' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select New Loyalty Tier</label>
                  <select
                    value={selectedTier}
                    onChange={e => setSelectedTier(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-800 outline-none"
                  >
                    <option value="Platinum">Platinum (Top Spender Status)</option>
                    <option value="Gold">Gold (Preferred Patron)</option>
                    <option value="Silver">Silver (Regular Member)</option>
                  </select>
                </div>
              )}

              {(actionType === 'EXPORT_CSV' || actionType === 'EXPORT_JSON') && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                  <p>
                    You are about to export {targetCustomerIds.length} customer records formatted with complete RFM metrics, contact details, and segmentation labels.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 bg-gradient-to-r ${info.color} text-white font-bold rounded-xl shadow-md transition hover:opacity-95 flex items-center gap-1.5`}
                >
                  <Send size={14} />
                  <span>Execute Action</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
