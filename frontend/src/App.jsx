import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUploadZone from './components/FileUploadZone';
import ClusterCharts from './components/ClusterCharts';
import CustomerTable from './components/CustomerTable';
import SegmentPredictor from './components/SegmentPredictor';
import CustomerFormPage from './components/CustomerFormPage';
import DataExplorerPage from './components/DataExplorerPage';
import SummaryCards from './components/SummaryCards';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { CustomerProvider, useCustomers } from './context/CustomerContext';
import { analyzeFile } from './services/api';
import { Sparkles, Layers, ShieldCheck, Database, ArrowRight } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    customers,
    totalCustomers,
    totalRevenue,
    avgOrderValue,
    avgCustomerFrequency,
    vipOrdersCount,
    segmentsSummary,
    setUploadedData
  } = useCustomers();

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeFile(file);
      setUploadedData(response);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to process transaction file. Ensure CSV or PDF format with Customer ID & Amount.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* Top Glass Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Multi-Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* PAGE 1: Analytics & Cluster Intelligence */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-sky-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full border border-sky-200">
                    RFM Clustering Model
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Live Ingestion Active</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  POS Customer Behavioral Insights
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  Upload retail transaction exports (CSV / PDF) to run automated Recency, Frequency, Monetary (RFM) extraction and K-Means segmentation personas.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2.5 bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl shadow-sm hover:shadow transition-smooth flex items-center gap-1.5"
                >
                  <span>Register Customer</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* File Ingestion Dropzone */}
            <FileUploadZone onUpload={handleFileUpload} isLoading={loading} error={error} />

            {/* Metric KPI Summary Cards */}
            <SummaryCards
              totalCustomers={totalCustomers}
              totalRevenue={totalRevenue}
              segmentsCount={segmentsSummary.length}
              avgOrderValue={avgOrderValue}
              avgCustomerFrequency={avgCustomerFrequency}
              vipOrdersCount={vipOrdersCount}
            />

            {/* Interactive Cluster Visualization Charts */}
            <ClusterCharts
              segmentsSummary={segmentsSummary}
              totalCustomers={totalCustomers}
            />

            {/* Ingested Customer Directory Preview Table */}
            <CustomerTable
              customers={customers}
              segmentsSummary={segmentsSummary}
              onExploreMore={() => setActiveTab('explorer')}
            />

          </div>
        )}

        {/* PAGE 2: Register Customer (Fill & Store User Information) */}
        {activeTab === 'register' && (
          <CustomerFormPage onNavigateToExplorer={() => setActiveTab('explorer')} />
        )}

        {/* PAGE 3: Data Explorer & Action Hub (See Data & Perform Actions) */}
        {activeTab === 'explorer' && (
          <DataExplorerPage onNavigateToRegister={() => setActiveTab('register')} />
        )}

        {/* PAGE 4: Live Segment Predictor */}
        {activeTab === 'predictor' && (
          <SegmentPredictor />
        )}

      </main>

      {/* Global User Authentication / Switch Account Modal */}
      <AuthModal />

      {/* Modern Platform Footer */}
      <footer className="mt-auto border-t border-sky-100/80 bg-white/70 backdrop-blur py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">SegmentIQ Enterprise Cloud</span>
            <span className="text-slate-300">•</span>
            <span>FastAPI ML Engine Online</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Client State Synced</span>
            <span>End-to-End Encryption</span>
            <span>GDPR & Privacy Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <DashboardContent />
      </CustomerProvider>
    </AuthProvider>
  );
}