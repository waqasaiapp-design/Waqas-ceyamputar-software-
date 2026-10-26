import React from 'react';
import { X, Download, Monitor, CheckCircle, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstallPrompt?: () => void;
  canInstallDirectly: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstallPrompt,
  canInstallDirectly,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00b852] flex items-center justify-center text-white font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Install WAQAS MART Web App
              </h2>
              <p className="text-[11px] text-slate-400">
                Run as a standalone desktop app on Windows 10 & 11 (Chrome / Edge)
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          
          {canInstallDirectly ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00b852] text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm text-emerald-950">
                  Ready for 1-Click Desktop Installation
                </h3>
                <p className="text-slate-600 text-[11px] mt-1">
                  Click the button below to install WAQAS MART directly onto your Windows desktop and taskbar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onTriggerInstallPrompt) onTriggerInstallPrompt();
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install WAQAS MART on Computer</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  How to Install via Google Chrome:
                </span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Look at the top-right address bar of Google Chrome.</li>
                  <li>Click the <strong>Install App icon (computer with down arrow)</strong> next to the bookmark star.</li>
                  <li>Click <strong>Install</strong> to add WAQAS MART to your Windows Desktop and Start Menu.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  How to Install via Microsoft Edge:
                </span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Click the <strong>Apps icon</strong> in the address bar (or Menu <code>...</code> &gt; <strong>Apps</strong>).</li>
                  <li>Select <strong>Install WAQAS MART</strong>.</li>
                  <li>Pin to Taskbar and Desktop for full-screen counter operations without browser tabs!</li>
                </ol>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Runs 100% offline with persistent local data storage. Thermal receipt printing and barcode scanners work natively.
            </span>
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
