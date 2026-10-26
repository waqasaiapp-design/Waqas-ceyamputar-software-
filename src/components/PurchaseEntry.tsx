import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  User, 
  Search, 
  Scan, 
  Box, 
  Tag, 
  Percent, 
  ShieldCheck, 
  PlusCircle, 
  ShoppingCart, 
  Trash2, 
  Save, 
  Plus, 
  Edit3, 
  Printer, 
  MoreVertical, 
  Grid, 
  Users, 
  Package, 
  Settings as SettingsIcon, 
  Check, 
  X,
  CreditCard,
  Banknote,
  DollarSign,
  Truck,
  Layers,
  ChevronRight,
  ChevronDown,
  Wifi,
  Minus,
  Square,
  Home,
  Store,
  RotateCcw,
  ClipboardList,
  Video,
  Smartphone,
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { Product, Supplier, PurchaseItem, PurchaseInvoice, BrandingSettings, ActiveSidebarTab } from '../types/pos';
import { INITIAL_SUPPLIERS } from '../data/posData';

interface PurchaseEntryProps {
  products: Product[];
  onUpdateStock: (productId: string, addedQty: number, newPurchasePrice?: number, newSalePrice?: number) => void;
  branding: BrandingSettings;
  onNavigateToPOS: () => void;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onOpenStockModal: () => void;
  showToast: (msg: string) => void;
}

export const PurchaseEntry: React.FC<PurchaseEntryProps> = ({
  products,
  onUpdateStock,
  branding,
  onNavigateToPOS,
  onOpenSettings,
  onOpenStockModal,
  showToast,
}) => {
  // 1. Invoices & Suppliers Data State (with localStorage persistence)
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('waqas_suppliers_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [savedPurchases, setSavedPurchases] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem('waqas_purchases_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Form State matching reference screenshot
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState<string>('PI-2026-10-26-001');
  const [purchaseDate, setPurchaseDate] = useState<string>('26-10-2026');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState<string>('MT-4587');

  // Product Entry Form Inputs
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [inputQty, setInputQty] = useState<number>(1);
  const [inputCost, setInputCost] = useState<number>(0);
  const [inputSalePrice, setInputSalePrice] = useState<number>(0);
  const [inputDiscount, setInputDiscount] = useState<number>(0);
  const [inputTax, setInputTax] = useState<number>(0);

  // Right Panel Category & Search Filters
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedRightCategory, setSelectedRightCategory] = useState<string>('All');

  // Initial Purchase Table Items (Empty table with 0 amounts)
  const [items, setItems] = useState<PurchaseItem[]>(() => {
    const saved = localStorage.getItem('waqas_current_purchase_items_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Payment & Notes
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Cheque' | 'Credit'>('Cash');
  const [notes, setNotes] = useState<string>('');

  // Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [purchaseToPrint, setPurchaseToPrint] = useState<PurchaseInvoice | null>(null);

  // Auto Calculations
  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.purchaseCost * item.quantity), 0);
  }, [items]);

  const totalDiscount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.discount, 0);
  }, [items]);

  const totalTax = useMemo(() => {
    return items.reduce((sum, item) => sum + item.tax, 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subTotal - totalDiscount + totalTax);
  }, [subTotal, totalDiscount, totalTax]);

  const remainingBalance = useMemo(() => {
    return Math.max(0, grandTotal - (amountPaid || 0));
  }, [grandTotal, amountPaid]);

  // Total purchases today counter
  const totalPurchasesToday = useMemo(() => {
    return savedPurchases.reduce((acc, p) => acc + p.grandTotal, 0);
  }, [savedPurchases]);

  // Autocomplete products for central search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(q) || 
           p.barcode.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // Right Panel Category Filters
  const rightCategories = ['All', 'Beverages', 'Snacks', 'Dairy', 'Household'];

  const rightPanelProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedRightCategory === 'All' || p.category.toLowerCase().includes(selectedRightCategory.toLowerCase());
      const matchSearch = !productSearch.trim() || 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
        p.barcode.includes(productSearch);
      return matchCat && matchSearch;
    });
  }, [products, selectedRightCategory, productSearch]);

  // Select Product to fill Entry Form
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setSearchQuery(prod.name);
    setIsSearchDropdownOpen(false);
    setInputCost(prod.price * 0.8 > 0 ? Math.round(prod.price * 0.8) : prod.price);
    setInputSalePrice(prod.price);
    setInputQty(1);
    setInputDiscount(0);
    setInputTax(0);
  };

  // Add Product from Entry Form to Table
  const handleAddProduct = () => {
    if (!selectedProduct) {
      if (searchQuery.trim()) {
        const found = products.find(p => p.name.toLowerCase() === searchQuery.trim().toLowerCase());
        if (found) {
          handleSelectProduct(found);
          return;
        }
      }
      showToast('Please search and select a product first');
      return;
    }

    if (inputQty <= 0) {
      showToast('Quantity must be greater than 0');
      return;
    }

    const rowTotal = Math.max(0, (inputQty * inputCost) - (inputDiscount || 0) + (inputTax || 0));

    const newItem: PurchaseItem = {
      id: `pi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product: selectedProduct,
      quantity: Number(inputQty),
      purchaseCost: Number(inputCost),
      salePrice: Number(inputSalePrice) || selectedProduct.price,
      discount: Number(inputDiscount) || 0,
      tax: Number(inputTax) || 0,
      total: rowTotal
    };

    setItems(prev => [newItem, ...prev]);
    showToast(`Added ${selectedProduct.name} to purchase items`);

    // Reset inputs
    setSelectedProduct(null);
    setSearchQuery('');
    setInputQty(1);
    setInputCost(0);
    setInputSalePrice(0);
    setInputDiscount(0);
    setInputTax(0);
  };

  // Direct Add Product from Right Panel (+ button)
  const handleQuickAddFromRightPanel = (prod: Product) => {
    const existingIndex = items.findIndex(i => i.product.id === prod.id);
    if (existingIndex > -1) {
      // Increase qty
      setItems(prev => prev.map((item, idx) => {
        if (idx === existingIndex) {
          const newQty = item.quantity + 1;
          const total = (newQty * item.purchaseCost) - item.discount + item.tax;
          return { ...item, quantity: newQty, total };
        }
        return item;
      }));
      showToast(`Updated ${prod.name} quantity`);
    } else {
      const cost = Math.round(prod.price * 0.8) || prod.price;
      const newItem: PurchaseItem = {
        id: `pi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product: prod,
        quantity: 1,
        purchaseCost: cost,
        salePrice: prod.price,
        discount: 0,
        tax: 0,
        total: cost
      };
      setItems(prev => [newItem, ...prev]);
      showToast(`Added ${prod.name} to purchase items`);
    }
  };

  // Remove Item from Table
  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from purchase table');
  };

  // Update Item Qty with Stepper
  const handleUpdateItemQty = (itemId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        const total = (newQty * item.purchaseCost) - item.discount + item.tax;
        return { ...item, quantity: newQty, total };
      }
      return item;
    }));
  };

  // 1. SAVE PURCHASE
  const handleSavePurchase = () => {
    if (items.length === 0) {
      showToast('Cannot save empty purchase. Add at least one item.');
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

    const newInvoice: PurchaseInvoice = {
      id: `purch-${Date.now()}`,
      purchaseInvoiceNo,
      purchaseDate,
      supplierId: supplier?.id || 'sup-1',
      supplierName: supplier?.name || 'M. Traders (Karachi)',
      supplierInvoiceNo,
      items: [...items],
      subTotal,
      totalDiscount,
      totalTax,
      grandTotal,
      amountPaid,
      paymentMethod,
      remainingBalance,
      notes,
      timestamp: Date.now()
    };

    // Update real stock for each product
    items.forEach(item => {
      onUpdateStock(item.product.id, item.quantity, item.purchaseCost, item.salePrice);
    });

    // Update supplier balance
    if (remainingBalance > 0 && supplier) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === supplier.id) {
          return { ...s, balance: s.balance + remainingBalance };
        }
        return s;
      }));
    }

    const updated = [newInvoice, ...savedPurchases];
    setSavedPurchases(updated);
    localStorage.setItem('waqas_purchases_v2', JSON.stringify(updated));

    showToast(`Purchase ${purchaseInvoiceNo} saved successfully! Real stock updated.`);
  };

  // 2. NEW PURCHASE
  const handleNewPurchase = () => {
    if (items.length > 0) {
      if (!window.confirm('Start a new purchase entry? Unsaved table lines will be cleared.')) {
        return;
      }
    }

    const today = new Date();
    const dateFormatted = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    const nextInvoice = `PI-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}-${(savedPurchases.length + 1).toString().padStart(3, '0')}`;

    setPurchaseInvoiceNo(nextInvoice);
    setPurchaseDate(dateFormatted);
    setSupplierInvoiceNo(`MT-${Math.floor(1000 + Math.random() * 9000)}`);
    setItems([]);
    setAmountPaid(0);
    setNotes('');
    showToast('New Purchase entry initialized');
  };

  // 3. EDIT PURCHASE
  const handleEditPurchase = (inv: PurchaseInvoice) => {
    setPurchaseInvoiceNo(inv.purchaseInvoiceNo);
    setPurchaseDate(inv.purchaseDate);
    setSelectedSupplierId(inv.supplierId);
    setSupplierInvoiceNo(inv.supplierInvoiceNo);
    setItems(inv.items);
    setAmountPaid(inv.amountPaid);
    setPaymentMethod(inv.paymentMethod);
    setNotes(inv.notes || '');
    setIsSearchModalOpen(false);
    showToast(`Loaded Purchase ${inv.purchaseInvoiceNo} for editing`);
  };

  // 4. PRINT PURCHASE
  const handlePrint = () => {
    if (items.length === 0) {
      showToast('No items to print');
      return;
    }
    const supplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
    const preview: PurchaseInvoice = {
      id: 'print-preview',
      purchaseInvoiceNo,
      purchaseDate,
      supplierId: supplier?.id || 'sup-1',
      supplierName: supplier?.name || 'M. Traders (Karachi)',
      supplierInvoiceNo,
      items,
      subTotal,
      totalDiscount,
      totalTax,
      grandTotal,
      amountPaid,
      paymentMethod,
      remainingBalance,
      notes,
      timestamp: Date.now()
    };
    setPurchaseToPrint(preview);
    setIsPrintModalOpen(true);
  };

  const sidebarMenuItems: { id: string; label: string; icon: React.ReactNode; active?: boolean; action?: () => void }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'Sales / POS', label: 'Sales / POS', icon: <ShoppingCart className="w-4 h-4" />, action: onNavigateToPOS },
    { id: 'Purchase Entry', label: 'Purchase Entry', icon: <FileText className="w-4 h-4" />, active: true },
    { id: 'Purchase Orders', label: 'Purchase Orders', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'Stock Management', label: 'Stock Management', icon: <Store className="w-4 h-4" />, action: onOpenStockModal },
    { id: 'Customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'Suppliers', label: 'Suppliers', icon: <User className="w-4 h-4" />, action: () => setIsLedgerModalOpen(true) },
    { id: 'Reports', label: 'Reports', icon: <Tag className="w-4 h-4" /> },
    { id: 'Daily Hisab', label: 'Daily Hisab', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'CCTV Cameras', label: 'CCTV Cameras', icon: <Video className="w-4 h-4" /> },
    { id: 'Google Search', label: 'Google Search', icon: <Search className="w-4 h-4" /> },
    { id: 'Device Management', label: 'Device Management', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div 
      style={{ width: '1536px', height: '1024px' }} 
      className="bg-[#f0f4f8] text-slate-800 font-sans flex flex-col justify-between overflow-hidden shadow-2xl shrink-0 select-none border border-slate-700/50"
    >
      
      {/* 1. TOP HEADER (Exact 76px matching reference screenshot) */}
      <header className="h-[76px] w-[1536px] bg-white border-b border-slate-200/90 px-6 flex items-center justify-between select-none shrink-0 z-30">
        {/* Left Branding */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer"
          onClick={() => onOpenSettings('branding')}
          title="Customize Branding & Software Name"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <div className="relative">
              <ShoppingCart className="w-9 h-9 stroke-[2.3] text-[#00b852]" />
              <span className="absolute -left-2 top-1 w-2.5 h-0.5 bg-[#00b852] rounded-full"></span>
              <span className="absolute -left-2.5 top-3 w-3.5 h-0.5 bg-[#00b852] rounded-full"></span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0f172a] uppercase font-sans leading-none">
              {branding.softwareName || 'WAQAS SOFTWARE'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 tracking-tight mt-1">
              Smart Mart • Fast • Easy • Reliable
            </p>
          </div>
        </div>

        {/* Center Global Search with Barcode Scanner */}
        <div className="w-[520px]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-11 pl-11 pr-12 rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b852]/30 focus:border-[#00b852] transition-all"
            />
            <button
              type="button"
              className="w-9 h-9 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white flex items-center justify-center absolute right-1 shadow-sm transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Date/Time, User, Wi-Fi, Settings, Windows controls */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <CalendarIcon className="w-5 h-5 text-[#00b852]" />
            <div className="text-left leading-tight text-xs">
              <span className="font-bold block text-slate-800 font-sans">26 Oct 2026</span>
              <span className="text-[11px] text-slate-500 block font-sans">12:45 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pl-1 pr-1.5 py-1 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#00b852] flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div className="leading-tight text-left">
              <span className="text-xs font-bold block text-slate-900">Admin</span>
              <span className="text-[11px] text-slate-500 block">POS User</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#00b852] cursor-pointer" title="Online">
            <Wifi className="w-5 h-5" />
          </div>

          <button
            onClick={() => onOpenSettings()}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
            <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500"><Minus className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500"><Square className="w-3.5 h-3.5" /></button>
            <button className="w-7 h-7 rounded hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Exact 914px height = Sidebar 236px + Purchase Workspace ~980px + Right Products ~320px) */}
      <div className="w-[1536px] h-[914px] flex overflow-hidden">
        
        {/* Left Dark Navy Sidebar (236px) */}
        <aside className="w-[236px] h-[914px] shrink-0 bg-[#061224] text-slate-300 flex flex-col justify-between select-none border-r border-slate-800/60 overflow-hidden">
          <div className="p-2 space-y-0.5 overflow-y-auto max-h-[690px]">
            {sidebarMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) item.action();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                  item.active
                    ? 'bg-[#00b852] text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={item.active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.active && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Bottom Card: Better Stock Better Business */}
          <div className="p-2.5 space-y-1.5 mt-auto bg-[#061224]">
            <div 
              onClick={() => onOpenSettings('sidebar')}
              className="relative rounded-2xl overflow-hidden cursor-pointer group border border-emerald-600/40 bg-[#082e1c] h-[140px] flex flex-col justify-end p-2 text-center shadow-md hover:ring-2 hover:ring-[#00b852] transition-all"
              title="Click to Change Sidebar Picture"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-102"
                style={{ 
                  backgroundImage: `url(/products/sidebar_purchase_banner.png)` 
                }}
              />
              <div className="relative z-10">
                <div className="inline-block px-3 py-0.5 rounded-full bg-[#00b852] text-white text-[10px] font-bold shadow-xs">
                  {branding.softwareName || 'WAQAS SOFTWARE'}
                </div>
              </div>
            </div>

            <div className="px-1.5 py-0.5 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b852] shrink-0"></span>
              <span className="font-bold text-slate-200 truncate">{branding.softwareName || 'WAQAS SOFTWARE'}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 shrink-0">POS System</span>
            </div>
          </div>
        </aside>

        {/* Center Purchase Workspace (~980px) */}
        <div className="flex-1 h-[914px] flex flex-col justify-between p-3.5 bg-[#f0f4f8] overflow-y-auto select-none border-r border-slate-200">
          
          <div className="space-y-2.5">
            {/* Wide Green Purchase Entry Title Banner */}
            <div className="h-16 rounded-2xl bg-gradient-to-r from-[#00873d] via-[#00a854] to-[#059649] text-white px-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">Purchase Entry</h2>
                  <p className="text-xs text-emerald-100 font-medium">Add new purchase invoice and manage stock</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/15 px-3 py-1.5 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-emerald-200" />
                <div className="text-right">
                  <div className="text-[10px] text-emerald-100 font-semibold uppercase">Total Purchases Today</div>
                  <div className="text-sm font-black font-mono">Rs. {totalPurchasesToday.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Purchase Details 2-Column Fields */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="grid grid-cols-2 gap-3">
                {/* Purchase Invoice No */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Purchase Invoice No</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={purchaseInvoiceNo}
                      onChange={(e) => setPurchaseInvoiceNo(e.target.value)}
                      className="w-full h-9 pl-3 pr-14 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                    />
                    <span className="absolute right-2 px-1.5 py-0.5 rounded-md bg-[#00a854] text-white font-bold text-[10px]">
                      Auto
                    </span>
                  </div>
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Purchase Date</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                    />
                    <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Supplier / Vendor */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Supplier / Vendor</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#00a854] cursor-pointer appearance-none"
                    >
                      <option value="">Search Supplier...</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.city ? `(${s.city})` : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Supplier Invoice No */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Supplier Invoice No</span>
                  </label>
                  <input
                    type="text"
                    value={supplierInvoiceNo}
                    onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                    placeholder="MT-4587"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                  />
                </div>
              </div>
            </div>

            {/* Product Entry Form */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  placeholder="Search Product by Name, Barcode or SKU..."
                  className="w-full h-9 pl-9 pr-10 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                  className="w-7 h-7 rounded-lg bg-emerald-50 text-[#00a854] flex items-center justify-center absolute right-1 top-1 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" />
                </button>

                {isSearchDropdownOpen && filteredProducts.length > 0 && (
                  <div className="absolute left-0 right-0 top-10 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-48 overflow-y-auto z-40 divide-y divide-slate-100">
                    {filteredProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className="p-2 hover:bg-emerald-50/70 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-6 h-6 object-contain" />
                          <div>
                            <div className="font-bold text-xs text-slate-800">{p.name}</div>
                            <div className="text-[10px] text-slate-400">Barcode: {p.barcode} • Stock: {p.stock}</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-800 font-mono">Rs. {p.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5 Compact Input Fields */}
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5 truncate">
                    <Box className="w-3 h-3 text-slate-400" />
                    <span>Quantity</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={inputQty}
                      onChange={(e) => setInputQty(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5 truncate">
                    <Layers className="w-3 h-3 text-slate-400" />
                    <span>Purchase Cost</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputCost}
                    onChange={(e) => setInputCost(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs text-right focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5 truncate">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>Sale Price (Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputSalePrice}
                    onChange={(e) => setInputSalePrice(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs text-right focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5 truncate">
                    <Percent className="w-3 h-3 text-slate-400" />
                    <span>Discount</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="text-[10px] text-slate-400 pl-1.5 font-mono absolute pointer-events-none">%</span>
                    <input
                      type="number"
                      min="0"
                      value={inputDiscount}
                      onChange={(e) => setInputDiscount(Number(e.target.value))}
                      className="w-full h-8 pl-5 pr-4 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                    />
                    <span className="text-[10px] text-slate-400 pr-1.5 font-mono absolute right-0 pointer-events-none">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5 truncate">
                    <ShieldCheck className="w-3 h-3 text-slate-400" />
                    <span>Tax</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="text-[10px] text-slate-400 pl-1.5 font-mono absolute pointer-events-none">%</span>
                    <input
                      type="number"
                      min="0"
                      value={inputTax}
                      onChange={(e) => setInputTax(Number(e.target.value))}
                      className="w-full h-8 pl-5 pr-4 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                    />
                    <span className="text-[10px] text-slate-400 pr-1.5 font-mono absolute right-0 pointer-events-none">%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                className="w-36 h-8 rounded-xl bg-[#00a854] hover:bg-[#009449] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Purchase Items Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#00a854]" />
                  <h3 className="font-bold text-xs text-slate-800">Purchase Items</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#00a854] text-white text-[10px] font-bold font-mono">
                  Total Items: {items.length}
                </span>
              </div>

              <div className="max-h-[175px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] text-slate-500 text-[10px] font-bold border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th className="py-1.5 px-2.5 text-center w-7">#</th>
                      <th className="py-1.5 px-2.5">Product</th>
                      <th className="py-1.5 px-2 text-center w-16">Qty</th>
                      <th className="py-1.5 px-2.5 text-right w-24">Purchase Cost</th>
                      <th className="py-1.5 px-2 text-right w-16">Discount</th>
                      <th className="py-1.5 px-2 text-right w-14">Tax</th>
                      <th className="py-1.5 px-2.5 text-right w-24">Total</th>
                      <th className="py-1.5 px-2 text-center w-10">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-1.5 px-2.5 text-center font-mono font-bold text-slate-600 text-[11px]">
                          {index + 1}
                        </td>
                        <td className="py-1.5 px-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-white border border-slate-100 p-0.5 flex items-center justify-center shrink-0">
                              <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div>
                              <div className="font-bold text-[11px] text-slate-900 leading-tight">{item.product.name}</div>
                              <div className="text-[9px] text-slate-400 font-mono">Barcode: {item.product.barcode}</div>
                              <div className="text-[9px] font-bold text-[#00a854] font-mono">Stock: {item.product.stock}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <div className="inline-flex items-center border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[11px] font-bold">
                            <span>{item.quantity}</span>
                            <div className="flex flex-col ml-1">
                              <button onClick={() => handleUpdateItemQty(item.id, 1)} className="text-[8px] hover:text-[#00a854]">▲</button>
                              <button onClick={() => handleUpdateItemQty(item.id, -1)} className="text-[8px] hover:text-rose-500">▼</button>
                            </div>
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono text-[11px] text-slate-800">
                          {item.purchaseCost.toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-[11px] text-slate-800">
                          {item.discount > 0 ? item.discount.toFixed(2) : '0'}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-[11px] text-slate-800">
                          {item.tax > 0 ? item.tax.toFixed(2) : '0'}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-[11px] text-slate-900">
                          {item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-5 h-5 rounded bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center mx-auto cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchase Totals Summary (4 cards) */}
            <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="p-1.5 border-r border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block">Sub Total</span>
                  <span className="text-xs font-black font-mono text-slate-900">
                    Rs. {subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-1.5 border-r border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block">Total Discount</span>
                  <span className="text-xs font-black font-mono text-slate-900">
                    Rs. {totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-1.5 border-r border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block">Total Tax</span>
                  <span className="text-xs font-black font-mono text-slate-900">
                    Rs. {totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-1.5 rounded-xl bg-[#e8f8ef] border border-emerald-200 flex items-center justify-between px-3">
                  <div>
                    <span className="text-[9px] font-bold text-[#00a854] uppercase block">Grand Total</span>
                    <span className="text-sm font-black font-mono text-[#00a854]">
                      Rs. {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Tag className="w-5 h-5 text-[#00a854]/40" />
                </div>
              </div>
            </div>

            {/* Payment and Notes Card */}
            <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="grid grid-cols-3 gap-2.5 items-center">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-0.5">
                    <Banknote className="w-3 h-3 text-slate-400" />
                    <span>Amount Paid</span>
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-0.5">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    <span>Payment Method</span>
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#00a854] cursor-pointer appearance-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Credit">Credit</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-0.5">
                    <Layers className="w-3 h-3 text-slate-400" />
                    <span>Remaining Balance</span>
                  </label>
                  <div className="h-8 px-2.5 rounded-lg bg-[#e8f8ef] border border-emerald-200 flex items-center text-xs font-mono font-black text-[#00a854]">
                    Rs. {remainingBalance.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-0.5">
                  <Edit3 className="w-3 h-3 text-slate-400" />
                  <span>Notes (Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes about this purchase..."
                  className="w-full h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                />
              </div>
            </div>

            {/* 5 Bottom Action Buttons */}
            <div className="grid grid-cols-5 gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleSavePurchase}
                className="h-9 rounded-xl bg-[#00a854] hover:bg-[#009449] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-98 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Purchase</span>
              </button>

              <button
                type="button"
                onClick={handleNewPurchase}
                className="h-9 rounded-xl bg-[#0284c7] hover:bg-[#0275b1] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-98 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Purchase</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="h-9 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-98 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Purchase</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="h-9 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-98 transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Purchase</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="h-9 rounded-xl bg-[#64748b] hover:bg-[#475569] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-98 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Purchase</span>
              </button>
            </div>
          </div>

          {/* Bottom Navigation matching reference screenshot */}
          <div className="h-14 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-around px-4 mt-2">
            <button
              onClick={onNavigateToPOS}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-[#00a854] cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5">HOME</span>
            </button>

            <button
              onClick={() => setIsLedgerModalOpen(true)}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-[#00a854] cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5">LEDGERS</span>
            </button>

            <div className="relative -top-3 flex flex-col items-center">
              <button
                onClick={onNavigateToPOS}
                title="Go to POS Sale"
                className="w-12 h-12 rounded-full bg-[#00a854] hover:bg-[#009449] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer border-3 border-white"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-black text-[#00a854] tracking-tight">
                POS
              </span>
            </div>

            <button
              onClick={onOpenStockModal}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-[#00a854] cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5">PRODUCTS</span>
            </button>

            <button
              onClick={() => onOpenSettings('branding')}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-[#00a854] cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5">SETTINGS</span>
            </button>
          </div>

        </div>

        {/* 3. RIGHT-SIDE PRODUCTS PANEL (Exact 320px matching reference screenshot) */}
        <aside className="w-[320px] h-[914px] shrink-0 bg-white border-l border-slate-200 flex flex-col justify-between select-none shadow-2xs">
          <div>
            {/* Green Header */}
            <div className="h-11 bg-[#00873d] text-white px-3.5 flex items-center gap-2">
              <Box className="w-4 h-4" />
              <h3 className="font-bold text-sm tracking-wide">Products</h3>
            </div>

            {/* Search Input */}
            <div className="p-2.5 pb-1.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00a854]"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5">
                {rightCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedRightCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                      selectedRightCategory === cat
                        ? 'bg-[#00a854] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Scrollable Products List */}
            <div className="p-2 space-y-1.5 overflow-y-auto max-h-[770px]">
              {rightPanelProducts.length === 0 ? (
                <div className="py-12 px-4 text-center text-slate-400">
                  <Box className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
                  <p className="text-xs font-bold text-slate-600">No Products in Catalog</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    کیٹلاگ میں کوئی آئٹم موجود نہیں ہے۔ نیویگیشن سے "New Item" پر جائیں یا اوپر نام اور بارکوڈ سے پرچیز درج کریں۔
                  </p>
                </div>
              ) : (
                rightPanelProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-2 rounded-xl border border-slate-200/90 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 p-0.5 flex items-center justify-center shrink-0">
                        <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-800 truncate" title={p.name}>
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Barcode: {p.barcode}
                        </div>
                        <div className="text-[10px] font-bold text-[#00a854] font-mono">
                          Stock: {p.stock}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-slate-900 block">
                          Rs. {p.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAddFromRightPanel(p)}
                        title="Add to Purchase"
                        className="w-7 h-7 rounded-lg bg-[#00a854] hover:bg-[#009449] text-white flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

      </div>

      {/* 3. BOTTOM STATUS BAR (Exact 34px matching reference screenshot) */}
      <footer className="w-[1536px] h-[34px] bg-[#071120] text-slate-300 px-4 flex items-center justify-between text-[11px] font-medium border-t border-slate-800 select-none shrink-0 z-30">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-[#00b852]"></span>
            <span className="font-semibold text-white">Online</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-slate-300">
            <span className="text-slate-400">Device ID:</span>
            <span className="text-white font-semibold">{branding.deviceCode || 'WMS-001'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-slate-300 text-[11px]">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>26 Oct 2026 12:45 PM</span>
        </div>
      </footer>

      {/* SEARCH / EDIT PURCHASES MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                <h3 className="font-bold text-sm">Search Saved Purchases</h3>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1">
              {savedPurchases.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                  <p className="font-semibold text-xs">No saved purchases yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "Save Purchase" on the main page to create records</p>
                </div>
              ) : (
                savedPurchases.map(p => (
                  <div key={p.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl">
                    <div>
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
                        <span>{p.purchaseInvoiceNo}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-mono">
                          Ref: {p.supplierInvoiceNo}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Supplier: {p.supplierName} • Date: {p.purchaseDate}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.items.length} items • Paid: Rs. {p.amountPaid.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-sm font-black text-emerald-600 font-mono">
                        Rs. {p.grandTotal.toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleEditPurchase(p)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-2xs cursor-pointer"
                      >
                        Load / Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT INVOICE MODAL */}
      {isPrintModalOpen && purchaseToPrint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Purchase Invoice Document</h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-50/50">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-slate-800">
                <div className="text-center pb-3 border-b border-dashed border-slate-300">
                  <h2 className="text-base font-black tracking-tight">{branding.softwareName || 'WAQAS SOFTWARE'}</h2>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">PURCHASE INWARD VOUCHER</p>
                  <p className="text-[10px] text-slate-400 mt-1">{branding.storeAddress}</p>
                </div>

                <div className="grid grid-cols-2 text-[11px] gap-1 pb-2 border-b border-dashed border-slate-300">
                  <div><strong>Invoice:</strong> {purchaseToPrint.purchaseInvoiceNo}</div>
                  <div><strong>Date:</strong> {purchaseToPrint.purchaseDate}</div>
                  <div><strong>Supplier:</strong> {purchaseToPrint.supplierName}</div>
                  <div><strong>Ref Bill:</strong> {purchaseToPrint.supplierInvoiceNo}</div>
                </div>

                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-1">Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Cost</th>
                      <th className="py-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseToPrint.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-1 pr-1">{item.product.name}</td>
                        <td className="py-1 text-center">{item.quantity}</td>
                        <td className="py-1 text-right">{item.purchaseCost.toFixed(2)}</td>
                        <td className="py-1 text-right font-bold">{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-right text-[11px]">
                  <div>Sub Total: Rs. {purchaseToPrint.subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  {purchaseToPrint.totalDiscount > 0 && <div>Discount: -Rs. {purchaseToPrint.totalDiscount.toFixed(2)}</div>}
                  {purchaseToPrint.totalTax > 0 && <div>Tax: +Rs. {purchaseToPrint.totalTax.toFixed(2)}</div>}
                  <div className="text-sm font-black text-emerald-700 pt-1 border-t border-slate-200">
                    Grand Total: Rs. {purchaseToPrint.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div>Paid ({purchaseToPrint.paymentMethod}): Rs. {purchaseToPrint.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="font-bold">Remaining: Rs. {purchaseToPrint.remainingBalance.toFixed(2)}</div>
                </div>

                {purchaseToPrint.notes && (
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                    Note: {purchaseToPrint.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#00a854] hover:bg-[#009449] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLIER KHATA / LEDGER MODAL */}
      {isLedgerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-sm">Supplier Khata & Ledgers</h3>
              </div>
              <button
                onClick={() => setIsLedgerModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1">
              {suppliers.map(sup => (
                <div key={sup.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{sup.name}</h4>
                    <p className="text-[11px] text-slate-500">{sup.city} • Phone: {sup.phone || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Payable Balance</span>
                    <span className={`text-xs font-bold font-mono ${sup.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Rs. {sup.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsLedgerModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
