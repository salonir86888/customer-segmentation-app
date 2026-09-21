import React, { useState } from 'react';
import { ArrowRight, Eye, Tag, Users } from 'lucide-react';

export default function CustomerTable({ customers, segmentsSummary, onExploreMore }) {
  const [selectedSegment, setSelectedSegment] = useState('All');

  if (!customers || customers.length === 0) return null;

  const filtered = selectedSegment === 'All'
    ? customers
    : customers.filter(c => c.segment === selectedSegment);

  const getSegmentBadge = (seg) => {
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
    <div className="glass-panel rounded-2xl p-5 sm:p-6 my-6 shadow-xl shadow-sky-950/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Ingested Customer Directory (Preview)</h3>
          <p className="text-xs text-slate-500">Real-time profile records extracted from transaction data</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="glass-input text-xs text-slate-800 rounded-xl px-3 py-2 outline-none font-medium"
          >
            <option value="All">All Segments ({customers.length})</option>
            {segmentsSummary?.map((s) => (
              <option key={s.segment_name} value={s.segment_name}>
                {s.segment_name} ({s.customer_count})
              </option>
            ))}
          </select>

          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl transition shadow-sm"
            >
              <span>Action Hub</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-sky-50/70 border-b border-sky-100 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Recency</th>
              <th className="py-3 px-4">Frequency</th>
              <th className="py-3 px-4">Monetary Total</th>
              <th className="py-3 px-4">Assigned Persona</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/60 bg-white/60">
            {filtered.slice(0, 10).map((c) => (
              <tr key={c.customer_id} className="hover:bg-sky-50/30 transition">
                <td className="py-3 px-4 font-bold text-slate-900">
                  {c.customer_name && c.customer_name !== 'Unknown' ? c.customer_name : c.customer_id}
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-sky-700">
                  {c.customer_id}
                </td>
                <td className="py-3 px-4 text-slate-600">{c.recency} days ago</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{c.frequency} orders</td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  ₹{(c.monetary || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getSegmentBadge(c.segment)}`}>
                    {c.segment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 10 && onExploreMore && (
        <div className="pt-4 mt-2 border-t border-slate-100 text-center">
          <button
            onClick={onExploreMore}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            + {filtered.length - 10} more profiles available in the Data Action Hub &rarr;
          </button>
        </div>
      )}
    </div>
  );
}