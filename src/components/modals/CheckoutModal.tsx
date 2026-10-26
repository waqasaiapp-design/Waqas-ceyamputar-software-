import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Banknote, 
  CreditCard, 
  Users, 
  Printer, 
  Receipt as ReceiptIcon, 
  User, 
  Phone 
} from 'lucide-react';
import { CartItem, PaymentMethod, CompletedSale, BrandingSettings } from '../../types/pos';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  branding: BrandingSettings;
  onSaleCompleted: (sale: CompletedSale) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  paymentMethod,
  setPaymentMethod,
  branding,
  onSaleCompleted,
}) => {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const [cashTendered, setCashTendered] = useState<number>(totalAmount);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState<number>(0);

  if (!isOpen) return null;

  const finalPayable = Math.max(0, totalAmount - discount);
  const changeDue = Math.max(0, cashTendered - finalPayable);

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale: CompletedSale = {
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp: Date.now(),
      items: [...cart],
      totalQuantity: totalQty,
      totalAmount: finalPayable,
      paymentMethod,
      cashTendered: paymentMethod === 'Cash' ? cashTendered : finalPayable,
      changeAmount: paymentMethod === 'Cash' ? changeDue : 0,
      cashier: 'Admin (POS User)',
    };

    onSaleCompleted(newSale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#008744] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ReceiptIcon className="w-5 h-5" />
            <h2 className="font-extrabold text-base tracking-tight">Checkout & Finalize Sale</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFinalize} className="p-6 space-y-4 text-xs">
          
          {/* Total Amount Display Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs block">Total Items: {totalQty}</span>
              <span className="text-slate-300 text-xs font-semibold">Net Payable:</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono text-[#00b852]">
                Rs. {finalPayable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
                  paymentMethod === 'Cash'
                    ? 'bg-[#00b852] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Credit')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
                  paymentMethod === 'Credit'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Credit</span>
              </button>
            </div>
          </div>

          {/* Cash Tendered & Change (If Cash selected) */}
          {paymentMethod === 'Cash' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Cash Tendered (Rs.)
                  </label>
                  <input
                    type="number"
                    min={finalPayable}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-emerald-300 bg-white font-mono font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00b852]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Change Due (Return)
                  </label>
                  <div className="h-10 px-3 rounded-xl bg-emerald-100/70 border border-emerald-300 flex items-center font-mono font-black text-lg text-emerald-900">
                    Rs. {changeDue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex gap-1.5">
                {[totalAmount, 500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashTendered(amt)}
                    className="flex-1 py-1 px-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-mono font-bold text-[11px] hover:bg-emerald-100"
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="0300-..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Complete Sale & Print Receipt</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
