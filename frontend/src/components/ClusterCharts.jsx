import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart2, Sparkles } from 'lucide-react';

const SEGMENT_COLORS = {
  'VIP Champions': '#0284c7', // Sky Blue
  'Consistent Bargain Buyers': '#10b981', // Emerald
  'At-Risk / Dormant': '#ef4444', // Rose / Red
  'Occasional / Newbies': '#f59e0b', // Amber / Gold
};

const DEFAULT_PALETTE = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ClusterCharts({ segmentsSummary, totalCustomers }) {
  if (!segmentsSummary || segmentsSummary.length === 0) return null;

  const pieData = segmentsSummary.map((s) => ({
    name: s.segment_name,
    value: s.customer_count,
    percentage: s.percentage,
    spend: s.avg_spend
  }));

  const barData = segmentsSummary.map((s) => ({
    name: s.segment_name.split(' ')[0], // Short name for axis
    fullName: s.segment_name,
    avgSpend: s.avg_spend,
    count: s.customer_count
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-sky-200 shadow-xl shadow-sky-950/10 text-xs">
          <p className="font-bold text-slate-900">{data.fullName || data.name}</p>
          <div className="mt-1 space-y-1 text-slate-600">
            {data.value !== undefined && (
              <p className="flex justify-between gap-4">
                <span>Profiles:</span>
                <span className="font-bold text-sky-700">{data.value} customers ({data.percentage}%)</span>
              </p>
            )}
            {data.avgSpend !== undefined && (
              <p className="flex justify-between gap-4">
                <span>Average Spend:</span>
                <span className="font-bold text-emerald-600">₹ {data.avgSpend.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      
      {/* Donut Chart: Customer Share */}
      <div className="glass-panel rounded-2xl p-6 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <PieIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customer Share by Persona</h3>
              <p className="text-xs text-slate-500">Distribution across K-Means behavioral clusters</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
            {totalCustomers || pieData.reduce((a, b) => a + b.value, 0)} Total
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={68}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SEGMENT_COLORS[entry.name] || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend grid */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-slate-100">
          {pieData.map((item, idx) => {
            const color = SEGMENT_COLORS[item.name] || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-800 ml-auto">{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar Chart: Average Spend by Segment */}
      <div className="glass-panel rounded-2xl p-6 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <BarChart2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Average Monetary Value (₹)</h3>
              <p className="text-xs text-slate-500">Benchmark spend velocity per segment</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Monetary RFM
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgSpend" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={SEGMENT_COLORS[entry.fullName] || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-4 border-t border-slate-100">
          <span>Higher monetary velocity indicates greater customer lifetime value (LTV).</span>
        </div>
      </div>

    </div>
  );
}