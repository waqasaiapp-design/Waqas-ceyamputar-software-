import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  FileJson, 
  Layers, 
  ShoppingCart, 
  RefreshCw,
  ShieldCheck,
  Server
} from 'lucide-react';
import { Product, CompletedSale, HeldBill, PurchaseInvoice, Supplier, BrandingSettings, SidebarBannerSettings, SaleBannerSettings, StockAdjustment } from '../../types/pos';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  salesHistory: CompletedSale[];
  heldBills: HeldBill[];
  branding: BrandingSettings;
  sidebarBanner: SidebarBannerSettings;
  saleBanner: SaleBannerSettings;
  onRestoreData: (importedData: any) => void;
  showToast: (msg: string) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  products,
  salesHistory,
  heldBills,
  branding,
  sidebarBanner,
  saleBanner,
  onRestoreData,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export entire store database as JSON file
  const handleExportBackup = () => {
    const backupPayload = {
      version: 'waqas_mart_v2',
      exportDate: new Date().toISOString(),
      branding,
      sidebarBanner,
      saleBanner,
      products,
      salesHistory,
      heldBills,
      purchases: JSON.parse(localStorage.getItem('waqas_purchases_v2') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('waqas_suppliers_v2') || '[]'),
      adjustments: JSON.parse(localStorage.getItem('waqas_stock_adjustments_v2') || '[]'),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `waqas_mart_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('مکمل ڈیٹا بیس فائل ڈاؤنلوڈ ہو گئی ہے (Database Backup Downloaded)');
  };

  // 2. Import JSON backup file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON format');
        }

        const confirmMsg = `Are you sure you want to restore this backup?\n\n` +
          `• Products to restore: ${parsed.products?.length || 0}\n` +
          `• Completed Invoices: ${parsed.salesHistory?.length || 0}\n` +
          `• Export Date: ${parsed.exportDate || 'Unknown'}\n\n` +
          `This will safely load the data into this browser.`;

        if (window.confirm(confirmMsg)) {
          onRestoreData(parsed);
          setImportStatus('Backup restored successfully!');
          showToast('ڈیٹا بیس کامیابی سے بحال ہو گیا ہے (Backup Restored Successfully)');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } catch (err: any) {
        alert('Invalid backup file! Please select a valid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00b852] flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Database Backup & Cross-Computer Sync
              </h2>
              <p className="text-[11px] text-slate-400">
                Safe offline storage, JSON export/import and multi-terminal sync
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Current Local Database Status */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Current Browser Database Status: Active</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800 text-[10px] font-bold">
                Persistent Storage
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-slate-500 font-semibold">Products</div>
                <div className="text-base font-black text-slate-900 font-mono">{products.length}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-slate-500 font-semibold">Sales History</div>
                <div className="text-base font-black text-slate-900 font-mono">{salesHistory.length}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-slate-500 font-semibold">Parked / Held</div>
                <div className="text-base font-black text-slate-900 font-mono">{heldBills.length}</div>
              </div>
            </div>
          </div>

          {/* Action 1: Export Backup File */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-900">
                  1. Export Database Backup (.JSON)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Save all products, prices, barcodes, sales and hisab to a file on your computer or USB drive.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-4 py-2 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup</span>
              </button>
            </div>
          </div>

          {/* Action 2: Import Backup File */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-900">
                  2. Restore / Transfer Database to this Computer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select a previously downloaded backup file to load all items and history onto this machine.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Restore File</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            {importStatus && (
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold text-center">
                {importStatus}
              </div>
            )}
          </div>

          {/* Important Technical Notice on Browser Storage vs Cloud Shared DB */}
          <div className="p-4 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <Server className="w-4 h-4 text-slate-600" />
              <span>Multi-Computer Synchronization Notice</span>
            </div>
            <p>
              In a browser environment, local storage is stored securely inside this device's browser profile. Data is retained even when you close, refresh, or reboot your computer.
            </p>
            <p>
              To share data across multiple cashier PCs without an internet database, use the <strong>Download Backup</strong> and <strong>Restore File</strong> buttons above via a local network or USB drive. For automatic real-time cloud multi-user sync across multiple terminals, cloud database integration (Firebase Firestore or PostgreSQL) can be enabled.
            </p>
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
