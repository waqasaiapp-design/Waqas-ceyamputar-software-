import React, { useState } from 'react';
import { X, Truck, UserPlus, Phone, Search, Building, Plus } from 'lucide-react';
import { Supplier } from '../../types/pos';
import { INITIAL_SUPPLIERS } from '../../data/posData';

interface SuppliersModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const SuppliersModal: React.FC<SuppliersModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('waqas_suppliers_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: newName.trim(),
      city: newCity.trim() || 'Pakistan',
      phone: newPhone.trim() || 'N/A',
      balance: 0,
    };

    const updated = [newSup, ...suppliers];
    setSuppliers(updated);
    localStorage.setItem('waqas_suppliers_v2', JSON.stringify(updated));
    setNewName('');
    setNewCity('');
    setNewPhone('');
    setIsAdding(false);
    showToast(`Supplier "${newSup.name}" added successfully!`);
  };

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.city && s.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Suppliers & Vendors Directory (سپلائرز کھاتہ)
              </h2>
              <p className="text-[11px] text-slate-400">
                Authorized FMCG distributors, wholesale invoices and balances
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
              placeholder="Search suppliers by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Cancel' : 'New Supplier'}</span>
          </button>
        </div>

        {/* Add Form Dropdown */}
        {isAdding && (
          <form onSubmit={handleAddSupplier} className="p-4 bg-sky-50/70 border-b border-sky-200 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Company / Supplier Name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="flex-1 min-w-[150px] h-8 px-3 rounded-lg border border-slate-300 text-xs bg-white font-medium"
            />
            <input
              type="text"
              placeholder="City (e.g. Lahore)"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-28 h-8 px-3 rounded-lg border border-slate-300 text-xs bg-white"
            />
            <input
              type="text"
              placeholder="Phone (0300-...)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-36 h-8 px-3 rounded-lg border border-slate-300 text-xs bg-white font-mono"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs shadow-xs"
            >
              Save
            </button>
          </form>
        )}

        {/* Suppliers List */}
        <div className="p-4 max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-semibold">
              No suppliers found
            </div>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg">
                <div>
                  <div className="font-bold text-xs text-slate-900">{s.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Building className="w-3 h-3 text-slate-400" /> {s.city || 'Pakistan'}</span>
                    <span>•</span>
                    <span className="font-mono flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {s.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">
                    Balance: Rs. {s.balance.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">Verified Vendor</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Total Suppliers: {suppliers.length}</span>
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
