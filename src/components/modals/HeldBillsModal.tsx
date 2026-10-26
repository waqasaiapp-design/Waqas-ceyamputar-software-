import React from 'react';
import { X, PauseCircle, Play, Trash2, Calendar, ShoppingCart, User, AlertCircle, Printer } from 'lucide-react';
import { HeldBill } from '../../types/pos';

interface HeldBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  heldBills: HeldBill[];
  onResumeBill: (bill: HeldBill) => void;
  onCancelBill: (billId: string) => void;
}

export const HeldBillsModal: React.FC<HeldBillsModalProps> = ({
  isOpen,
  onClose,
  heldBills,
  onResumeBill,
  onCancelBill,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <PauseCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-tight text-white">
                  Held Bills / Parked Sales
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                  {heldBills.length} Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Resuming a bill restores all its items to the cart. Stock is only deducted upon checkout.
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

        {/* Informational Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Holding a bill preserves customer items while letting you serve other customers. Stock and sales revenue are safe and untouched.
          </span>
        </div>

        {/* Held Bills List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {heldBills.length === 0 ? (
            <div className="text-center py-14 text-slate-400 space-y-2">
              <PauseCircle className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="font-bold text-slate-600 text-sm">No Held Bills Currently</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                To park an unfinished sale, add items to the cart and click the "Hold Bill" button next to Checkout.
              </p>
            </div>
          ) : (
            heldBills.map((bill) => (
              <div
                key={bill.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 shadow-xs transition-all space-y-3"
              >
                {/* Bill Top Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                      {bill.billNumber}
                    </span>
                    <span className="font-semibold text-slate-700 text-xs">
                      {bill.customerName || 'General Customer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{bill.date} • {bill.time}</span>
                  </div>
                </div>

                {/* Items Summary Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {bill.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {item.product.name} × <strong className="font-mono">{item.quantity}</strong>
                    </span>
                  ))}
                </div>

                {/* Bottom Bar: Totals & Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[11px] block">
                      Total: <strong className="text-slate-800 font-mono">{bill.totalQuantity} items</strong>
                    </span>
                    <span className="text-base font-black text-[#00b852] font-mono">
                      Rs. {bill.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel and delete Held Bill ${bill.billNumber}?`)) {
                          onCancelBill(bill.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onResumeBill(bill);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/25 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume Sale</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
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
