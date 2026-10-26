import React, { useState } from 'react';
import { X, Plus, Package, Check } from 'lucide-react';
import { Product } from '../../types/pos';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (product: Product) => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [category, setCategory] = useState('Groceries');
  const [barcode, setBarcode] = useState(() => Math.floor(896400000 + Math.random() * 99999).toString());
  const [stock, setStock] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      category,
      barcode: barcode.trim(),
      stock: Number(stock),
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
    };

    onAddItem(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00b852] flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                Add New Inventory Product
              </h2>
              <p className="text-[11px] text-slate-400">
                Adds item directly to catalog with instant barcode
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

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          
          <div>
            <label className="font-bold text-slate-800 block mb-1">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Basmati Rice 1kg..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00b852]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Price (Rs.) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00b852]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Initial Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00b852]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
              >
                <option value="Groceries">Groceries</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
                <option value="Dairy">Dairy</option>
                <option value="Fresh Fruits">Fresh Fruits</option>
                <option value="Household">Household</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Barcode</label>
              <input
                type="text"
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Product Photo URL (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-mono"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Add to Inventory</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
