import React from 'react';
import { X, Clock, Receipt, Printer, Search, Calendar } from 'lucide-react';
import { CompletedSale } from '../../types/pos';

interface SalesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: CompletedSale[];
  onReprintReceipt: (sale: CompletedSale) => void;
}

export const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({
  isOpen,
  onClose,
  sales,
  onReprintReceipt,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const filteredSales = sales.filter(
    (s) => s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) || s.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Sales History & Completed Transactions
              </h2>
              <p className="text-[11px] text-slate-400">
                Total Revenue: Rs. {totalRevenue.toLocaleString()} ({sales.length} completed transactions)
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

        {/* Search Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by invoice number (e.g. INV-)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#00b852]"
            />
          </div>
        </div>

        {/* Sales Table */}
        <div className="p-6 overflow-y-auto space-y-2 flex-1 text-xs">
          {filteredSales.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No transactions found</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div
                key={sale.invoiceNo}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {sale.invoiceNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {sale.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{sale.date} {sale.time}</span>
                    <span>•</span>
                    <span>{sale.totalQuantity} items</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-[#00b852]">
                    Rs. {sale.totalAmount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      onReprintReceipt(sale);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors"
                    title="Reprint Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
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
