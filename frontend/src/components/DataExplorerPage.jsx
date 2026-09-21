import React, { useState, useMemo } from 'react';
import { useCustomers } from '../context/CustomerContext';
import {
  Database,
  Search,
  Filter,
  Download,
  Mail,
  Award,
  Trash2,
  Eye,
  Plus,
  ArrowUpDown,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
  Send,
  UserCheck
} from 'lucide-react';
import CustomerProfileModal from './CustomerProfileModal';
import ActionModal from './ActionModal';

export default function DataExplorerPage({ onNavigateToRegister }) {
  const { customers, deleteCustomer, exportCustomers } = useCustomers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [sortField, setSortField] = useState('monetary'); // 'monetary' | 'recency' | 'frequency' | 'customer_name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [profileCustomer, setProfileCustomer] = useState(null);
  const [activeActionType, setActiveActionType] = useState(null);
  const [actionCustomerIds, setActionCustomerIds] = useState([]);

  // Segments available
  const segments = ['All', 'VIP Champions', 'Consistent Bargain Buyers', 'At-Risk / Dormant', 'Occasional / Newbies'];

  // Filter and sort
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => {
        const matchesSegment = selectedSegment === 'All' || c.segment === selectedSegment;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          c.customer_name?.toLowerCase().includes(q) ||
          c.customer_id?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.store_location?.toLowerCase().includes(q);
        return matchesSegment && matchesQuery;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [customers, selectedSegment, searchQuery, sortField, sortOrder]);

  // Checkbox handling
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.customer_id));
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const openAction = (type, ids) => {
    setActiveActionType(type);
    setActionCustomerIds(ids);
  };

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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Database size={20} />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Data Explorer & Action Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse stored customer profiles, filter across behavioral personas, and execute instant marketing campaigns, loyalty upgrades, or data exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onNavigateToRegister}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-smooth"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>

          <button
            onClick={() => exportCustomers('csv')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl shadow-sm transition"
            title="Download CSV of all profiles"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4">
        
        {/* Search & Sort Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, ID, email, or store..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs text-slate-800 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold hidden sm:inline">Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
              className="glass-input px-3 py-2 rounded-xl text-slate-800 text-xs outline-none"
            >
              <option value="monetary">Monetary Spend (₹)</option>
              <option value="recency">Recency (Days)</option>
              <option value="frequency">Purchase Frequency</option>
              <option value="customer_name">Customer Name</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title={`Switch order (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>

        {/* Persona Segment Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {segments.map((seg) => {
            const count = seg === 'All' ? customers.length : customers.filter(c => c.segment === seg).length;
            const isSelected = selectedSegment === seg;
            return (
              <button
                key={seg}
                onClick={() => setSelectedSegment(seg)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-smooth flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                    : 'bg-white/80 hover:bg-sky-50 text-slate-600 border border-sky-100'
                }`}
              >
                <span>{seg}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-sky-800/60 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Sticky Bar (Visible when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="glass-panel-elevated p-3.5 rounded-2xl border-sky-300 bg-sky-50/90 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
            <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
              {selectedIds.length}
            </span>
            <span>Customer Profiles Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => openAction('SEND_CAMPAIGN', selectedIds)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Mail size={13} />
              <span>Launch Campaign</span>
            </button>

            <button
              onClick={() => openAction('UPGRADE_LOYALTY', selectedIds)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Award size={13} />
              <span>Upgrade Tier</span>
            </button>

            <button
              onClick={() => openAction('EXPORT_CSV', selectedIds)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Main Customers Data Grid Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl shadow-sky-950/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-sky-50/70 border-b border-sky-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-sky-600">
                    {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                      <CheckSquare size={16} className="text-sky-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Assigned Persona</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-sky-700" onClick={() => handleSort('recency')}>
                  <span className="inline-flex items-center gap-1">
                    Recency <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-sky-700" onClick={() => handleSort('frequency')}>
                  <span className="inline-flex items-center gap-1">
                    Frequency <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-sky-700" onClick={() => handleSort('monetary')}>
                  <span className="inline-flex items-center gap-1">
                    Monetary Spend <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="py-3.5 px-4">Loyalty Tier</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sky-100/60 bg-white/70">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No customer records match your filter.</p>
                    <p className="text-xs mt-1">Try changing the search query or selecting "All" segments.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isChecked = selectedIds.includes(c.customer_id);
                  return (
                    <tr
                      key={c.customer_id}
                      className={`hover:bg-sky-50/40 transition ${isChecked ? 'bg-sky-50/60' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(c.customer_id)}
                          className="text-slate-400 hover:text-sky-600"
                        >
                          {isChecked ? (
                            <CheckSquare size={16} className="text-sky-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Customer identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-100 to-blue-200 text-sky-800 font-bold flex items-center justify-center text-xs border border-sky-200">
                            {c.customer_name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block hover:text-sky-600 cursor-pointer" onClick={() => setProfileCustomer(c)}>
                              {c.customer_name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {c.customer_id} • {c.store_location || 'Retail Node'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Segment Persona */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getSegmentBadge(c.segment)}`}>
                          {c.segment}
                        </span>
                      </td>

                      {/* Recency */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <span>{c.recency} days ago</span>
                      </td>

                      {/* Frequency */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                          {c.frequency} orders
                        </span>
                      </td>

                      {/* Monetary */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{(c.monetary || 0).toLocaleString()}
                      </td>

                      {/* Loyalty Tier */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          c.loyalty_tier === 'Platinum'
                            ? 'bg-purple-100 text-purple-800'
                            : c.loyalty_tier === 'Gold'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.loyalty_tier || 'Silver'}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setProfileCustomer(c)}
                            className="p-1.5 bg-white hover:bg-sky-50 border border-sky-100 rounded-lg text-slate-600 hover:text-sky-700 transition"
                            title="Inspect 360 Customer Profile"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => openAction('SEND_CAMPAIGN', [c.customer_id])}
                            className="p-1.5 bg-white hover:bg-sky-50 border border-sky-100 rounded-lg text-slate-600 hover:text-sky-700 transition"
                            title="Send Campaign Offer"
                          >
                            <Mail size={14} />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete profile ${c.customer_name}?`)) {
                                deleteCustomer(c.customer_id);
                              }
                            }}
                            className="p-1.5 bg-white hover:bg-rose-50 border border-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition"
                            title="Delete customer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="p-4 bg-slate-50/80 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong className="text-slate-800">{filteredCustomers.length}</strong> of{' '}
            <strong className="text-slate-800">{customers.length}</strong> customer profiles
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time synchronization with K-Means segmentation engine
          </span>
        </div>
      </div>

      {/* Customer 360 Inspection Modal */}
      {profileCustomer && (
        <CustomerProfileModal
          customer={profileCustomer}
          onClose={() => setProfileCustomer(null)}
          onPerformAction={(type, ids) => {
            setProfileCustomer(null);
            openAction(type, ids);
          }}
        />
      )}

      {/* Action Execution Modal */}
      {activeActionType && (
        <ActionModal
          actionType={activeActionType}
          targetCustomerIds={actionCustomerIds}
          onClose={() => {
            setActiveActionType(null);
            setActionCustomerIds([]);
          }}
        />
      )}

    </div>
  );
}
