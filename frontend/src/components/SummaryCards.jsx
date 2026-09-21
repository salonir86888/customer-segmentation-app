import React from 'react';
import { Users, IndianRupee, ShoppingBag, TrendingUp, Sparkles, Layers, Activity } from 'lucide-react';

export default function SummaryCards({ totalCustomers, totalRevenue, segmentsCount, avgOrderValue, avgCustomerFrequency, vipOrdersCount }) {
  const cards = [
    {
      title: "Unique Customer Profiles",
      value: totalCustomers?.toLocaleString() || "0",
      subtext: "Ingested across POS nodes",
      change: "+14.2% this quarter",
      icon: Users,
      iconColor: "from-sky-500 to-blue-600",
      borderColor: "border-sky-200/80",
      accentBg: "bg-sky-50/50"
    },
    {
      title: "Gross Revenue Analyzed",
      value: `₹ ${(totalRevenue || 0).toLocaleString()}`,
      subtext: `Avg ₹ ${Math.round(totalRevenue / (totalCustomers || 1)).toLocaleString()} / customer`,
      change: "Direct POS Ingestion",
      icon: IndianRupee,
      iconColor: "from-emerald-500 to-teal-600",
      borderColor: "border-emerald-200/80",
      accentBg: "bg-emerald-50/40"
    },
    {
      title: "VIP Orders",
      value: `${vipOrdersCount || 0} orders`,
      subtext: "From VIP Champions segment",
      change: "High Value",
      icon: ShoppingBag,
      iconColor: "from-blue-600 to-indigo-600",
      borderColor: "border-blue-200/80",
      accentBg: "bg-blue-50/40"
    },
    {
      title: "Cluster Personas Active",
      value: `${segmentsCount || 4} Archetypes`,
      subtext: "K-Means ML Segmentation",
      change: "Auto-Rebalanced",
      icon: Layers,
      iconColor: "from-sky-500 to-cyan-500",
      borderColor: "border-cyan-200/80",
      accentBg: "bg-cyan-50/40"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden bg-white/90 backdrop-blur-md border ${card.borderColor} rounded-2xl p-5 shadow-lg shadow-sky-950/5 hover-lift transition-smooth group`}
          >
            {/* Top decorative accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.iconColor}`} />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </h4>
              </div>

              <div className={`p-3 rounded-xl bg-gradient-to-tr ${card.iconColor} text-white shadow-md shadow-sky-500/15 group-hover:scale-110 transition-smooth`}>
                <Icon size={20} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{card.subtext}</span>
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
