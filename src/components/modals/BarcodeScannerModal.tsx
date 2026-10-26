import React, { useState, useEffect } from 'react';
import { X, Scan, Search, Check, AlertCircle, Camera, Barcode as BarcodeIcon } from 'lucide-react';
import { Product } from '../../types/pos';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductScanned: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductScanned,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleManualScan = (codeToScan?: string) => {
    const code = (codeToScan || barcodeInput).trim();
    if (!code) return;

    const matched = products.find(
      (p) => p.barcode === code || p.id === code || p.name.toLowerCase().includes(code.toLowerCase())
    );

    if (matched) {
      onProductScanned(matched);
      setScanMessage({ text: `Scanned & Added: ${matched.name} (Rs. ${matched.price})`, success: true });
      setBarcodeInput('');
      setTimeout(() => setScanMessage(null), 3500);
    } else {
      setScanMessage({ text: `No product found for barcode "${code}". Try again!`, success: false });
      setTimeout(() => setScanMessage(null), 3500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualScan();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00b852] flex items-center justify-center text-white">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Barcode Scanner & Reader
              </h2>
              <p className="text-[11px] text-slate-400">
                Compatible with USB laser scanners & camera barcode readers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera / Laser Viewfinder Area */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="h-44 rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center border-2 border-slate-800">
            {/* Visual Scan Grid */}
            <div className="absolute inset-4 border border-dashed border-emerald-500/40 rounded-xl flex items-center justify-center">
              {/* Laser Animation Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00b852] to-transparent shadow-[0_0_12px_#00b852] animate-pulse" />
            </div>

            <div className="relative z-10 text-center text-slate-400 space-y-1">
              <BarcodeIcon className="w-10 h-10 mx-auto text-emerald-400 stroke-[1.5]" />
              <p className="font-mono text-xs text-white">Laser Barcode Ready</p>
              <p className="text-[10px] text-slate-400">Aim USB scanner at any barcode or type below</p>
            </div>
          </div>

          {/* Feedback Message */}
          {scanMessage && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in ${
                scanMessage.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {scanMessage.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{scanMessage.text}</span>
            </div>
          )}

          {/* Manual Input Search Fallback */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              Enter Barcode Number or Product Name:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="e.g. 896400101 or Coca Cola..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-10 px-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#00b852]"
              />
              <button
                type="button"
                onClick={() => handleManualScan()}
                className="px-4 py-2 bg-[#00b852] hover:bg-[#009c45] text-white font-bold rounded-xl shadow-xs active:scale-95 transition-all"
              >
                Scan & Add
              </button>
            </div>
          </div>

          {/* Quick Click-to-Scan Demo Barcodes */}
          {products.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Saved Barcodes (Click to simulate scan):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {products.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleManualScan(p.barcode)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                  >
                    <span className="font-bold text-slate-800 block truncate text-[11px]">{p.name}</span>
                    <span className="text-[10px] font-mono text-emerald-600 block">#{p.barcode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
