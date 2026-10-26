import React from 'react';
import { X, Smartphone, Printer, Scan, Monitor, Wifi, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BrandingSettings } from '../../types/pos';

interface DeviceManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingSettings;
  showToast: (msg: string) => void;
}

export const DeviceManagementModal: React.FC<DeviceManagementModalProps> = ({
  isOpen,
  onClose,
  branding,
  showToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Hardware & Device Management
              </h2>
              <p className="text-[11px] text-slate-400">
                Printers, Barcode Scanners, Electronic Cash Drawer & Pole Display
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

        {/* Content */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          
          {/* Device 1: Thermal Printer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">80mm Thermal Receipt Printer</div>
                <div className="text-[11px] text-slate-500">ESC/POS USB / Browser System Print Engine</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Ready (Default)
              </span>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('Sent test print signal');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[11px]"
              >
                Test
              </button>
            </div>
          </div>

          {/* Device 2: Barcode Scanner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">USB / Wireless Barcode Scanner</div>
                <div className="text-[11px] text-slate-500">HID Keyboard Wedge Emulation (Plug & Play)</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Active & Listening
            </span>
          </div>

          {/* Device 3: Cash Drawer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Electronic Cash Drawer (RJ11 / RJ12)</div>
                <div className="text-[11px] text-slate-500">Automatic kick-out trigger on receipt print</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Cash drawer open pulse sent to printer port')}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]"
            >
              Open Drawer
            </button>
          </div>

          {/* Device 4: Terminal Info */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-950">Terminal Station Identifier</div>
              <div className="text-[11px] text-emerald-800">Assigned ID: {branding.deviceCode || 'POS-01'}</div>
            </div>
            <div className="text-right font-mono font-bold text-emerald-900">
              Web POS v2.4
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
