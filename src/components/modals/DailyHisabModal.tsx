import React from 'react';
import { X, Calendar, Banknote, CreditCard, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CompletedSale } from '../../types/pos';

interface DailyHisabModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: CompletedSale[];
  onResetHisab?: () => void;
}

export const DailyHisabModal: React.FC<DailyHisabModalProps> = ({
  isOpen,
  onClose,
  sales,
  onResetHisab,
}) => {
  if (!isOpen) return null;

  const totalSalesAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const cashSales = sales.filter((s) => s.paymentMethod === 'Cash').reduce((sum, s) => sum + s.totalAmount, 0);
  const cardSales = sales.filter((s) => s.paymentMethod === 'Card').reduce((sum, s) => sum + s.totalAmount, 0);
  const creditSales = sales.filter((s) => s.paymentMethod === 'Credit').reduce((sum, s) => sum + s.totalAmount, 0);
  const initialDrawerCash = sales.length === 0 ? 0 : 10000; // Starting cash float in drawer
  const closingDrawerCash = initialDrawerCash + cashSales;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center text-white font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Daily Hisab & Cash Counter Closing
              </h2>
              <p className="text-[11px] text-slate-400">
                Today's Sales Register & Drawer Reconciliation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Main Total Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00b852] to-[#008744] text-white flex items-center justify-between shadow-md shadow-emerald-600/20">
            <div>
              <span className="text-emerald-100 text-[11px] font-semibold block">Total Sales Revenue Today</span>
              <span className="text-2xl font-black font-mono">
                Rs. {totalSalesAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-emerald-100 text-[11px] font-semibold block">Completed Bills</span>
              <span className="text-xl font-black font-mono">{sales.length}</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
                <Banknote className="w-4 h-4" />
                <span>Cash Sales</span>
              </div>
              <span className="text-sm font-mono font-black text-slate-800 block">
                Rs. {cashSales.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Card Sales</span>
              </div>
              <span className="text-sm font-mono font-black text-slate-800 block">
                Rs. {cardSales.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold mb-1">
                <Users className="w-4 h-4" />
                <span>Credit (Udhar)</span>
              </div>
              <span className="text-sm font-mono font-black text-slate-800 block">
                Rs. {creditSales.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Cash Drawer Reconciliation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Cash Drawer Reconciliation:</h4>
            
            <div className="flex justify-between text-slate-600 text-xs">
              <span>Opening Float (Cash in Drawer):</span>
              <span className="font-mono font-bold">Rs. {initialDrawerCash.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-600 text-xs">
              <span>Today's Cash Collected:</span>
              <span className="font-mono font-bold text-emerald-600">+ Rs. {cashSales.toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Current Cash in Drawer:</span>
              <span className="font-mono font-black text-emerald-700">
                Rs. {closingDrawerCash.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {onResetHisab ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('کیا آپ تمام سیلز اور یومیہ حساب 0 کرنا چاہتے ہیں؟\nAre you sure you want to reset all sales and daily hisab to 0?')) {
                  onResetHisab();
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Reset Hisab to 0 (حساب زیرو کریں)
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
