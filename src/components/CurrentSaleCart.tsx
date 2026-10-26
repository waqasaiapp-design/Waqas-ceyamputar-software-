import React from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Banknote, 
  CreditCard, 
  Users, 
  ChevronRight, 
  Receipt, 
  Printer, 
  Clock, 
  PauseCircle 
} from 'lucide-react';
import { CartItem, PaymentMethod, HeldBill } from '../types/pos';

interface CurrentSaleCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  heldBills: HeldBill[];
  onHoldBill: () => void;
  onOpenHeldBills: () => void;
  onOpenCheckout: () => void;
  onOpenReceiptModal: () => void;
  onPrintThermal: () => void;
  onOpenSalesHistory: () => void;
}

export const CurrentSaleCart: React.FC<CurrentSaleCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  paymentMethod,
  setPaymentMethod,
  heldBills,
  onHoldBill,
  onOpenHeldBills,
  onOpenCheckout,
  onOpenReceiptModal,
  onPrintThermal,
  onOpenSalesHistory,
}) => {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="w-[415px] h-[914px] shrink-0 bg-white border-l border-slate-200 flex flex-col justify-between select-none shadow-2xs">
      
      {/* 1. Cart Header */}
      <div>
        <div className="h-11 bg-[#007a3d] text-white px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-bold text-sm tracking-wide">Current Sale</h2>
          </div>

          <button
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="flex items-center gap-1.5 text-xs text-white/95 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        {/* 2. Cart Table Column Headers */}
        <div className="grid grid-cols-12 px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-700 bg-white">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Item</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {/* 3. Cart Items Rows */}
        <div className="overflow-y-auto max-h-[380px] divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-400">
              <ShoppingCart className="w-9 h-9 mx-auto text-slate-300 mb-1.5 stroke-[1.5]" />
              <p className="text-xs font-semibold text-slate-500">Cart is empty</p>
            </div>
          ) : (
            cart.map((item, index) => {
              const lineTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.product.id}
                  className="grid grid-cols-12 items-center px-3 py-2 hover:bg-slate-50/80 transition-colors text-xs"
                >
                  {/* # Index */}
                  <div className="col-span-1 text-center font-mono text-slate-800 text-xs">
                    {index + 1}
                  </div>

                  {/* Thumbnail & Item Name */}
                  <div className="col-span-5 flex items-center gap-2 pr-1">
                    <div className="w-7 h-7 rounded bg-white flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="font-semibold text-slate-800 truncate text-[11px]" title={item.product.name}>
                      {item.product.name}
                    </span>
                  </div>

                  {/* Quantity Stepper: - 1 + */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="w-4 text-center font-mono font-bold text-slate-800 text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-right font-mono text-slate-800 text-[11px]">
                    Rs. {item.product.price}
                  </div>

                  {/* Line Total & Remove Trash Icon */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5 pl-1">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      Rs. {lineTotal}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      title="Remove Item"
                      className="text-rose-500 hover:text-rose-700 p-0.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Bottom Cart Summary, Payments & Actions */}
      <div className="p-3.5 border-t border-slate-200 bg-white space-y-2.5">
        
        {/* Total Quantity & Total Amount Panel */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Total Qty</span>
            <span className="font-mono font-bold text-sm text-slate-900">{totalQty}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Amount</span>
            <span className="text-2xl font-black text-[#00b852] font-mono">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Methods (Cash, Card, Credit) */}
        <div>
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            Payment Method
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('Cash')}
              className={`h-14 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all ${
                paymentMethod === 'Cash'
                  ? 'bg-[#00b852] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span>Cash</span>
            </button>

            <button
              onClick={() => setPaymentMethod('Card')}
              className={`h-14 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all ${
                paymentMethod === 'Card'
                  ? 'bg-[#00b852] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <CreditCard className="w-5 h-5 text-slate-700" />
              <span>Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod('Credit')}
              className={`h-14 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all ${
                paymentMethod === 'Credit'
                  ? 'bg-[#00b852] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Users className="w-5 h-5 text-slate-700" />
              <span className="text-[10px] whitespace-nowrap">Credit Pay Later</span>
            </button>
          </div>
        </div>

        {/* HOLD BILL & PARK SALE ACTION BAR (Requirement 5) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onHoldBill}
            disabled={cart.length === 0}
            title="Save current cart to Held Bills without completing sale or deducting stock"
            className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
          >
            <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Hold Bill</span>
            {heldBills.length > 0 && (
              <span className="px-1.5 rounded-full bg-amber-600 text-white text-[10px] font-mono">
                {heldBills.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenHeldBills}
            title="View, resume or manage held bills"
            className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <span>Held ({heldBills.length})</span>
          </button>
        </div>

        {/* Large Green Checkout Button */}
        <button
          onClick={onOpenCheckout}
          disabled={cart.length === 0}
          className="w-full h-11 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Checkout</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>

        {/* Bottom 3 Action Buttons (Receipt, Print, History) */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <button
            onClick={onOpenReceiptModal}
            className="h-10 rounded-xl bg-[#e8f3fc] hover:bg-[#d0e7f9] text-[#0369a1] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>Receipt</span>
          </button>

          <button
            onClick={onPrintThermal}
            className="h-10 rounded-xl bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#7e22ce] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={onOpenSalesHistory}
            className="h-10 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>

      </div>

    </div>
  );
};
