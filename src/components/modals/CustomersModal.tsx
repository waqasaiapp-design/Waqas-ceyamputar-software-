import React, { useState } from 'react';
import { X, Users, UserPlus, Phone, CreditCard, Search, Check, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalPurchases: number;
  balance: number;
}

interface CustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const CustomersModal: React.FC<CustomersModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('waqas_customers_v2');
    return saved ? JSON.parse(saved) : [
      { id: 'c-1', name: 'Walk-in Customer', phone: '0300-0000000', totalPurchases: 0, balance: 0 },
      { id: 'c-2', name: 'Muhammad Ali', phone: '0321-4567890', totalPurchases: 2500, balance: 0 },
      { id: 'c-3', name: 'Haji Aslam', phone: '0333-7890123', totalPurchases: 8400, balance: 350 },
    ];
  });

  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCust: Customer = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim() || 'N/A',
      totalPurchases: 0,
      balance: 0,
    };

    const updated = [newCust, ...customers];
    setCustomers(updated);
    localStorage.setItem('waqas_customers_v2', JSON.stringify(updated));
    setNewName('');
    setNewPhone('');
    setIsAdding(false);
    showToast(`Customer "${newCust.name}" added successfully!`);
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00b852] flex items-center justify-center text-white font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Customer Ledger & Accounts (گاہک کھاتہ)
              </h2>
              <p className="text-[11px] text-slate-400">
                Customer contacts, transaction history, and Udhar balances
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

        {/* Search & Add Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00b852]"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAdding ? 'Cancel' : 'New Customer'}</span>
          </button>
        </div>

        {/* Add Form Dropdown */}
        {isAdding && (
          <form onSubmit={handleAddCustomer} className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="Customer Name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="flex-1 h-8 px-3 rounded-lg border border-slate-300 text-xs bg-white font-medium"
            />
            <input
              type="text"
              placeholder="Phone Number (e.g. 0300-1234567)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="flex-1 h-8 px-3 rounded-lg border border-slate-300 text-xs bg-white font-mono"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#00b852] text-white font-bold text-xs shadow-xs"
            >
              Save
            </button>
          </form>
        )}

        {/* Customers List */}
        <div className="p-4 max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-semibold">
              No customers found
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg">
                <div>
                  <div className="font-bold text-xs text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">
                    Purchases: Rs. {c.totalPurchases.toLocaleString()}
                  </div>
                  <div className={`text-[10px] font-bold ${c.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {c.balance > 0 ? `Udhar Due: Rs. ${c.balance}` : 'No Balance Due'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Total Customers: {customers.length}</span>
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
