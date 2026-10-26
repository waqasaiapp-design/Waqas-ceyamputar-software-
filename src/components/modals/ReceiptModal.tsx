import React from 'react';
import { X, Printer, Check, ShoppingBag, Download } from 'lucide-react';
import { CompletedSale, BrandingSettings } from '../../types/pos';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: CompletedSale | null;
  branding: BrandingSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  sale,
  branding,
}) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#00b852]" />
            <span className="font-bold text-xs">Thermal Receipt Preview</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt (80mm) */}
        <div 
          id="thermal-receipt-printable" 
          className="p-6 bg-white text-slate-950 font-mono text-xs space-y-3 max-h-[75vh] overflow-y-auto"
        >
          {/* Receipt Header */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-1">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base uppercase tracking-tight text-slate-900 font-sans">
              {branding.softwareName}
            </h3>
            <p className="text-[10px] text-slate-600">{branding.tagline}</p>
            <p className="text-[10px] text-slate-600">{branding.storeAddress}</p>
            <p className="text-[10px] text-slate-600 font-mono">Tel: {branding.storePhone}</p>
          </div>

          {/* Metadata */}
          <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice:</span>
              <span className="font-bold">{sale.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span>{sale.date} {sale.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span>{sale.cashier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-bold uppercase">{sale.paymentMethod}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-b border-dashed border-slate-400 pb-2">
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 pb-1">
              <div className="col-span-6">ITEM</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-2 text-right">RATE</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>

            <div className="divide-y divide-slate-100 text-[11px]">
              {sale.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 py-1">
                  <div className="col-span-6 truncate font-medium">{item.product.name}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">{item.product.price}</div>
                  <div className="col-span-2 text-right font-bold">
                    {item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs pt-1 border-b border-dashed border-slate-400 pb-3">
            <div className="flex justify-between text-slate-600">
              <span>Total Items:</span>
              <span className="font-bold">{sale.totalQuantity}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-1">
              <span>NET PAYABLE:</span>
              <span>Rs. {sale.totalAmount.toLocaleString()}</span>
            </div>
            {sale.cashTendered !== undefined && sale.cashTendered > 0 && (
              <>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>Cash Paid:</span>
                  <span>Rs. {sale.cashTendered.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Change Return:</span>
                  <span className="font-bold">Rs. {(sale.changeAmount || 0).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Barcode Graphic & Footer */}
          <div className="text-center pt-2 space-y-1">
            <div className="flex items-center justify-center font-mono tracking-widest text-xs font-bold text-slate-800">
              ||| | |||| | ||||| || |||| |||
            </div>
            <p className="text-[10px] text-slate-500">
              Thank you for shopping at {branding.softwareName}!
            </p>
            <p className="text-[9px] text-slate-400">
              Goods once sold can be returned within 7 days with this receipt.
            </p>
          </div>

        </div>

        {/* Modal Actions (Hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Receipt</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
