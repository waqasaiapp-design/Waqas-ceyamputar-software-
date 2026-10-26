import React from 'react';
import { 
  ShoppingCart, 
  Truck, 
  RotateCcw, 
  Grid, 
  ShoppingBag, 
  Coffee, 
  Cookie, 
  Milk, 
  Apple, 
  Home, 
  MoreHorizontal, 
  Plus, 
  Scan, 
  Calendar, 
  BarChart2, 
  Edit3
} from 'lucide-react';
import { Product, PosMode, SaleBannerSettings } from '../types/pos';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  posMode: PosMode;
  setPosMode: (mode: PosMode) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  saleBanner: SaleBannerSettings;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onOpenNewItem: () => void;
  onOpenScanner: () => void;
  onOpenDailyHisab: () => void;
  onOpenReports: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  posMode,
  setPosMode,
  selectedCategory,
  setSelectedCategory,
  saleBanner,
  onOpenSettings,
  onOpenNewItem,
  onOpenScanner,
  onOpenDailyHisab,
  onOpenReports,
}) => {
  const categories = [
    { id: 'All Items', label: 'All Items', icon: <Grid className="w-4 h-4" />, color: 'bg-[#00a859] text-white' },
    { id: 'Groceries', label: 'Groceries', icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-[#f97316] text-white' },
    { id: 'Beverages', label: 'Beverages', icon: <Coffee className="w-4 h-4" />, color: 'bg-[#0284c7] text-white' },
    { id: 'Snacks', label: 'Snacks', icon: <Cookie className="w-4 h-4" />, color: 'bg-[#8b5cf6] text-white' },
    { id: 'Dairy', label: 'Dairy', icon: <Milk className="w-4 h-4" />, color: 'bg-[#38bdf8] text-white' },
    { id: 'Fresh Fruits', label: 'Fresh Fruits', icon: <Apple className="w-4 h-4" />, color: 'bg-[#f43f5e] text-white' },
    { id: 'Household', label: 'Household', icon: <Home className="w-4 h-4" />, color: 'bg-[#0d9488] text-white' },
    { id: 'More', label: 'More', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-white text-slate-700 border border-slate-200' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All Items' || selectedCategory === 'More') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="w-[885px] h-[914px] shrink-0 flex flex-col justify-between p-3 bg-[#f0f4f8] overflow-hidden select-none">
      
      <div>
        {/* 1. Mode Tabs (Sale, Purchase, Return Mode) */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <button
            onClick={() => setPosMode('Sale')}
            className={`h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
              posMode === 'Sale'
                ? 'bg-[#00b852] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Sale</span>
          </button>

          <button
            onClick={() => setPosMode('Purchase')}
            className={`h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
              posMode === 'Purchase'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Purchase</span>
          </button>

          <button
            onClick={() => setPosMode('Return Mode')}
            className={`h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
              posMode === 'Return Mode'
                ? 'bg-[#ea580c] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return Mode</span>
          </button>
        </div>

        {/* 2. Category Selector Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all transform active:scale-95 cursor-pointer shadow-2xs ${cat.color} ${
                  isSelected ? 'ring-2 ring-slate-900/40 font-bold scale-[1.02]' : 'hover:opacity-90'
                }`}
              >
                {cat.icon}
                <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Product Cards Grid (Exact 5 Columns x 3 Rows) */}
        {filteredProducts.length === 0 ? (
          <div className="h-[390px] bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#00b852] flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              {products.length === 0 ? 'کوئی آئٹم موجود نہیں ہے (0 Products)' : 'No Products Match Selected Category'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              {products.length === 0
                ? 'ڈیٹا بیس بالکل خالی ہے۔ نیا پروڈکٹ درج کرنے کے لیے نیچے بٹن پر کلک کریں یا نیویگیشن سے "New Item" یا "Purchase Entry" استعمال کریں۔'
                : 'اس کیٹیگری میں فی الحال کوئی پروڈکٹ نہیں ہے۔ دوسری کیٹیگری منتخب کریں یا نیا آئٹم شامل کریں۔'}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenNewItem}
                className="px-5 py-2.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>نیا پروڈکٹ درج کریں (Add New Item)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-2 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                {/* Product Packshot Image */}
                <div className="h-20 rounded-lg bg-slate-50/50 flex items-center justify-center overflow-hidden mb-1.5 p-1">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                    onError={(e) => {
                      // fallback
                      (e.target as HTMLImageElement).src = '/products/coca_cola.png';
                    }}
                  />
                </div>

                {/* Title & Price */}
                <div className="mb-1.5">
                  <h3 className="font-semibold text-xs text-slate-800 truncate" title={p.name}>
                    {p.name}
                  </h3>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                    Rs. {p.price.toLocaleString()}
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => onAddToCart(p)}
                  className="w-full h-7 rounded-lg bg-[#00b852] hover:bg-[#009c45] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. Bottom Promotional Banner & Quick Access Bar */}
      <div className="mt-2 flex items-center gap-2.5">
        
        {/* Replaceable Bottom Sale Banner (Requirement 4) */}
        <div 
          onClick={() => onOpenSettings('banner')}
          className="flex-1 rounded-xl bg-gradient-to-r from-[#074727] via-[#09522e] to-[#04331d] text-white px-4 py-2.5 flex items-center justify-between relative overflow-hidden group cursor-pointer shadow-xs hover:ring-2 hover:ring-[#00b852] transition-all h-[76px]"
          title="Click to Change Banner Picture or Text in Settings"
        >
          <div className="relative z-10 leading-tight">
            <h4 className="text-sm font-black tracking-tight text-white">
              {saleBanner.heading || 'Fresh Products\nEveryday'}
            </h4>
            <p className="text-[10px] text-emerald-200 font-semibold tracking-wide mt-0.5">
              {saleBanner.subtitle || 'Best Quality • Lowest Prices'}
            </p>
          </div>

          {/* Edit Badge overlay */}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-emerald-300 p-1 rounded-full text-[9px] z-20">
            <Edit3 className="w-3 h-3" />
          </div>

          {/* Fresh Veggies Fruit Basket Art */}
          <div className="relative z-10 h-full flex items-center justify-end">
            <img
              src={saleBanner.image || '/products/fresh_basket.png'}
              alt="Fresh Produce"
              className="max-h-14 object-contain filter drop-shadow"
            />
          </div>
        </div>

        {/* Quick Access Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden lg:block mr-1">
            Quick Access
          </div>

          <button
            onClick={onOpenNewItem}
            className="w-16 h-[76px] rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-700" />
            <span className="text-[10px] whitespace-nowrap">New Item</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="w-20 h-[76px] rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-colors"
          >
            <Scan className="w-4 h-4 text-slate-700" />
            <span className="text-[10px] whitespace-nowrap text-center leading-tight">Barcode Scanner</span>
          </button>

          <button
            onClick={onOpenDailyHisab}
            className="w-16 h-[76px] rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-700" />
            <span className="text-[10px] whitespace-nowrap">Daily Hisab</span>
          </button>

          <button
            onClick={onOpenReports}
            className="w-16 h-[76px] rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-slate-700" />
            <span className="text-[10px] whitespace-nowrap">Reports</span>
          </button>
        </div>

      </div>

    </div>
  );
};
