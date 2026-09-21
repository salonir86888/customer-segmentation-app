import React, { useState } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle, Sparkles, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';

export default function FileUploadZone({ onUpload, isLoading, error }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const { resetToDemoData } = useCustomers();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFileName(file.name);
      onUpload(file);
    }
  };

  const handleLoadDemo = (e) => {
    e.stopPropagation();
    setSelectedFileName("Enterprise_POS_Q3_Transactions.csv (Simulated Batch)");
    resetToDemoData();
  };

  return (
    <div className="w-full my-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-smooth cursor-pointer ${
          dragOver
            ? 'border-sky-500 bg-sky-100/50 shadow-lg shadow-sky-500/10 scale-[1.005]'
            : 'border-sky-300/80 bg-white/80 hover:bg-sky-50/40 hover:border-sky-500 shadow-md shadow-sky-950/5'
        }`}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Soft background lighting element */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-200/30 rounded-full blur-2xl pointer-events-none" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 animate-spin">
                <Loader2 size={32} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Processing POS Invoices & Calculating RFM Clusters...</p>
              <p className="text-xs text-slate-500 mt-1">Normalizing transaction dates, monetary amounts & running K-Means</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 mb-4 hover:scale-110 transition-smooth">
              <UploadCloud size={32} />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Drag & Drop POS Transaction Records or <span className="text-sky-600 underline font-extrabold decoration-sky-400">Browse Files</span>
            </h3>

            <p className="text-xs text-slate-500 mt-1.5 max-w-md">
              Supports POS billing exports in <strong>CSV</strong> or invoice reports in <strong>PDF</strong> format with automatic schema extraction.
            </p>

            {selectedFileName && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-sky-100/80 text-sky-800 text-xs font-semibold rounded-full border border-sky-200">
                <FileSpreadsheet size={14} />
                <span>Selected: {selectedFileName}</span>
              </div>
            )}

            {/* Quick Demo Dataset trigger */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs text-slate-400 font-medium">No file on hand?</span>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl transition shadow-sm hover:shadow"
              >
                <Sparkles size={13} className="text-sky-600" />
                <span>Load 12 Sample POS Records</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium shadow-sm animate-in fade-in">
          <AlertCircle size={18} className="text-rose-500 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Upload Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}