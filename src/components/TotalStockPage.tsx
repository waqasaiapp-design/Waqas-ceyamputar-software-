import React, { useState, useMemo, useRef } from 'react';
import { 
  Box, 
  Tag, 
  Barcode, 
  Scan, 
  RefreshCw, 
  Filter, 
  Layers, 
  AlertTriangle, 
  XCircle, 
  Pencil, 
  SlidersHorizontal, 
  BarChart3, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Eye, 
  Home, 
  ShoppingCart, 
  Settings as SettingsIcon, 
  Calendar, 
  User, 
  Users,
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Wifi, 
  Search, 
  Minus, 
  Square, 
  X, 
  ShieldCheck, 
  Check, 
  Trash2, 
  UploadCloud, 
  Image as ImageIcon, 
  RotateCcw,
  Truck,
  ArrowUpDown,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, Supplier, BrandingSettings, SidebarBannerSettings, StockAdjustment } from '../types/pos';
import { INITIAL_SUPPLIERS } from '../data/posData';

interface TotalStockPageProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onNavigateToPOS: () => void;
  onNavigateToPurchase: () => void;
  onNavigateToNewItem: () => void;
  branding: BrandingSettings;
  sidebarBanner: SidebarBannerSettings;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onOpenDailyHisab: () => void;
  onOpenSalesHistory: () => void;
  onOpenScanner: () => void;
  showToast: (msg: string) => void;
  onResetStockToZero?: () => void;
  onResetHisabToZero?: () => void;
}

export const TotalStockPage: React.FC<TotalStockPageProps> = ({
  products,
  onUpdateProduct,
  onNavigateToPOS,
  onNavigateToPurchase,
  onNavigateToNewItem,
  branding,
  sidebarBanner,
  onOpenSettings,
  onOpenDailyHisab,
  onOpenSalesHistory,
  onOpenScanner,
  showToast,
  onResetStockToZero,
  onResetHisabToZero,
}) => {
  // Suppliers list
  const [suppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('waqas_suppliers_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // Stock adjustments history log
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(() => {
    const saved = localStorage.getItem('waqas_stock_adjustments_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Product for Right Panel & Actions (default to first product or Coca-Cola)
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return products[0]?.id || 'prod-1';
  });

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Exactly 8 rows fit per page matching reference screenshot

  // Modals Visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStockReportModalOpen, setIsStockReportModalOpen] = useState(false);
  const [isPrintLabelModalOpen, setIsPrintLabelModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Edit Product Modal Form State
  const [editName, setEditName] = useState('');
  const [editBarcode, setEditBarcode] = useState('');
  const [editPurchasePrice, setEditPurchasePrice] = useState<number>(0);
  const [editSalePrice, setEditSalePrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editCategory, setEditCategory] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editSupplier, setEditSupplier] = useState('');
  const [editUnit, setEditUnit] = useState('Piece');
  const [editReorderLevel, setEditReorderLevel] = useState<number>(10);
  const [editTax, setEditTax] = useState<number>(0);
  const [editDescription, setEditDescription] = useState('');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [editTrackStock, setEditTrackStock] = useState<boolean>(true);
  const [editImage, setEditImage] = useState<string>('');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Adjust Stock Form State
  const [adjustType, setAdjustType] = useState<'Add' | 'Reduce' | 'Set'>('Add');
  const [adjustQtyInput, setAdjustQtyInput] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('Physical count variance');
  const [adjustNotes, setAdjustNotes] = useState<string>('');
  const [showAdjustConfirmation, setShowAdjustConfirmation] = useState<boolean>(false);

  // Dynamic Categories, Brands and Suppliers list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      const b = p.brand || (p.name.split(' ')[0]);
      if (b) set.add(b);
    });
    return Array.from(set).sort();
  }, [products]);

  const supplierNames = useMemo(() => {
    const set = new Set<string>();
    suppliers.forEach(s => set.add(s.name));
    products.forEach(p => { if (p.supplier) set.add(p.supplier); });
    return Array.from(set).sort();
  }, [products, suppliers]);

  // Helper: Determine product status
  const getProductStatus = (p: Product): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
    const reorder = p.reorderLevel !== undefined ? p.reorderLevel : 10;
    if (p.stock <= 0) return 'Out of Stock';
    if (p.stock <= reorder) return 'Low Stock';
    return 'In Stock';
  };

  // Helper: Get product effective purchase cost
  const getProductCost = (p: Product): number => {
    if (p.purchasePrice !== undefined && p.purchasePrice > 0) return p.purchasePrice;
    return Math.round(p.price * 0.8) || p.price;
  };

  // Dynamic 6 Summary Metric Cards Calculations
  const metrics = useMemo(() => {
    let totalQty = 0;
    let totalPurchaseVal = 0;
    let totalRetailVal = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      const qty = p.stock || 0;
      const cost = getProductCost(p);
      const retail = p.price || 0;
      const status = getProductStatus(p);

      totalQty += qty;
      totalPurchaseVal += qty * cost;
      totalRetailVal += qty * retail;

      if (status === 'Low Stock') lowStockCount++;
      if (status === 'Out of Stock') outOfStockCount++;
    });

    return {
      totalProducts: products.length,
      totalStockQty: totalQty,
      stockPurchaseValue: totalPurchaseVal,
      stockRetailValue: totalRetailVal,
      lowStockItems: lowStockCount,
      outOfStockItems: outOfStockCount,
    };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBarcode = p.barcode.toLowerCase().includes(q);
        const matchCategory = p.category?.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q);
        const matchSupplier = p.supplier?.toLowerCase().includes(q);
        if (!matchName && !matchBarcode && !matchCategory && !matchBrand && !matchSupplier) {
          return false;
        }
      }

      // Status Filter
      const status = getProductStatus(p);
      if (statusFilter !== 'All' && status !== statusFilter) {
        return false;
      }

      // Category Filter
      if (categoryFilter !== 'All' && p.category !== categoryFilter) {
        return false;
      }

      // Brand Filter
      if (brandFilter !== 'All') {
        const pBrand = p.brand || p.name.split(' ')[0];
        if (pBrand !== brandFilter) return false;
      }

      // Supplier Filter
      if (supplierFilter !== 'All') {
        const pSupplier = p.supplier || 'Local';
        if (pSupplier !== supplierFilter) return false;
      }

      // Active Filter
      if (activeFilter === 'Active' && p.isActive === false) return false;
      if (activeFilter === 'Inactive' && p.isActive !== false) return false;

      return true;
    });
  }, [products, searchQuery, statusFilter, categoryFilter, brandFilter, supplierFilter, activeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setBrandFilter('All');
    setSupplierFilter('All');
    setActiveFilter('All');
    setCurrentPage(1);
    showToast('Filters cleared');
  };

  // Open Edit Modal for a product
  const handleOpenEditModal = (p: Product) => {
    setSelectedProductId(p.id);
    setEditName(p.name);
    setEditBarcode(p.barcode);
    setEditPurchasePrice(getProductCost(p));
    setEditSalePrice(p.price);
    setEditStock(p.stock);
    setEditCategory(p.category || 'Groceries');
    setEditBrand(p.brand || p.name.split(' ')[0] || '');
    setEditSupplier(p.supplier || 'Nestle');
    setEditUnit(p.unit || 'Piece');
    setEditReorderLevel(p.reorderLevel !== undefined ? p.reorderLevel : 10);
    setEditTax(p.tax || 0);
    setEditDescription(p.description || `Refreshing and quality ${p.name}.`);
    setEditIsActive(p.isActive !== false);
    setEditTrackStock(p.trackStock !== false);
    setEditImage(p.image || '/products/coca_cola_can.jpg');
    setIsEditModalOpen(true);
  };

  // Save Edit Item Form
  const handleSaveEditProduct = () => {
    if (!editName.trim()) {
      showToast('Product name cannot be empty');
      return;
    }
    if (!editBarcode.trim()) {
      showToast('Barcode cannot be empty');
      return;
    }

    // Check duplicate barcode on other products
    const duplicate = products.find(p => p.id !== selectedProductId && p.barcode.trim().toLowerCase() === editBarcode.trim().toLowerCase());
    if (duplicate) {
      showToast(`Barcode "${editBarcode}" is already in use by "${duplicate.name}"`);
      return;
    }

    if (editSalePrice <= 0) {
      showToast('Sale price must be greater than 0');
      return;
    }

    const updated: Product = {
      id: selectedProductId,
      name: editName.trim(),
      barcode: editBarcode.trim(),
      purchasePrice: Number(editPurchasePrice) || 0,
      price: Number(editSalePrice) || 0,
      stock: Number(editStock) || 0,
      category: editCategory,
      brand: editBrand.trim() || undefined,
      supplier: editSupplier || undefined,
      unit: editUnit,
      reorderLevel: Number(editReorderLevel) || 10,
      tax: Number(editTax) || 0,
      description: editDescription.trim() || undefined,
      isActive: editIsActive,
      trackStock: editTrackStock,
      image: editImage
    };

    onUpdateProduct(updated);
    setIsEditModalOpen(false);
    showToast(`Updated "${updated.name}" successfully!`);
  };

  // Handle Edit Image File Select
  const handleEditImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setEditImage(e.target.result as string);
        showToast('New image selected');
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Adjust Stock Modal
  const handleOpenAdjustModal = (p: Product) => {
    setSelectedProductId(p.id);
    setAdjustType('Add');
    setAdjustQtyInput(1);
    setAdjustReason('Physical count variance');
    setAdjustNotes('');
    setShowAdjustConfirmation(false);
    setIsAdjustModalOpen(true);
  };

  // Compute calculated new quantity for stock adjustment
  const calculatedNewQty = useMemo(() => {
    if (!selectedProduct) return 0;
    const current = selectedProduct.stock || 0;
    const delta = Number(adjustQtyInput) || 0;
    if (adjustType === 'Add') return current + delta;
    if (adjustType === 'Reduce') return Math.max(0, current - delta);
    return Math.max(0, delta); // Set Corrected Quantity
  }, [selectedProduct, adjustType, adjustQtyInput]);

  // Execute Stock Adjustment
  const handleApplyStockAdjustment = () => {
    if (!selectedProduct) return;
    if (adjustQtyInput < 0) {
      showToast('Quantity cannot be negative');
      return;
    }

    if (adjustType === 'Reduce' && adjustQtyInput > selectedProduct.stock) {
      if (!showAdjustConfirmation) {
        setShowAdjustConfirmation(true);
        return;
      }
    }

    const previousQty = selectedProduct.stock;
    const newQty = calculatedNewQty;
    const changeAmount = adjustType === 'Set' ? (newQty - previousQty) : (adjustType === 'Add' ? adjustQtyInput : -adjustQtyInput);

    // Create adjustment history record
    const record: StockAdjustment = {
      id: `adj-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      barcode: selectedProduct.barcode,
      type: adjustType,
      changeQty: changeAmount,
      previousQty,
      newQty,
      reason: `${adjustReason}${adjustNotes ? ` - ${adjustNotes}` : ''}`,
      user: 'Admin',
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const newAdjustments = [record, ...adjustments];
    setAdjustments(newAdjustments);
    localStorage.setItem('waqas_stock_adjustments_v2', JSON.stringify(newAdjustments));

    // Update product stock
    const updatedProd: Product = {
      ...selectedProduct,
      stock: newQty
    };
    onUpdateProduct(updatedProd);

    setIsAdjustModalOpen(false);
    setShowAdjustConfirmation(false);
    showToast(`Stock for ${selectedProduct.name} adjusted from ${previousQty} to ${newQty}!`);
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      showToast('No products to export');
      return;
    }

    const headers = [
      'Product ID',
      'Product Name',
      'Barcode / SKU',
      'Category',
      'Brand',
      'Supplier',
      'Purchase Price (Rs)',
      'Sale Price (Rs)',
      'Stock Qty',
      'Unit',
      'Stock Value (Rs)',
      'Status',
      'Reorder Level',
      'Tax (%)',
      'Active'
    ];

    const rows = filteredProducts.map(p => {
      const cost = getProductCost(p);
      const stockVal = (p.stock || 0) * cost;
      const status = getProductStatus(p);
      return [
        `"${p.id}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.barcode}"`,
        `"${p.category || ''}"`,
        `"${(p.brand || '').replace(/"/g, '""')}"`,
        `"${(p.supplier || '').replace(/"/g, '""')}"`,
        cost,
        p.price,
        p.stock,
        `"${p.unit || 'Piece'}"`,
        stockVal,
        `"${status}"`,
        p.reorderLevel ?? 10,
        p.tax ?? 0,
        p.isActive !== false ? 'Yes' : 'No'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `waqas_total_stock_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredProducts.length} items to Excel/CSV`);
  };

  return (
    <div className="w-[1536px] h-[1024px] bg-[#f4f7fb] text-slate-800 flex flex-col select-none overflow-hidden font-sans">
      
      {/* 1. TOP HEADER (Exact 76px matching reference screenshot) */}
      <header className="h-[76px] w-[1536px] bg-white border-b border-slate-200/90 px-6 flex items-center justify-between select-none shrink-0 z-30">
        
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer"
          onClick={() => onOpenSettings('branding')}
          title="Click to customize software name, logo and branding in Settings"
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
              {branding.tagline || 'Smart Mart • Fast • Easy • Reliable'}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-[520px]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-12 rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b852]/30 focus:border-[#00b852] transition-all"
            />
            <button
              type="button"
              onClick={onOpenScanner}
              title="Open Barcode Scanner"
              className="w-9 h-9 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white flex items-center justify-center absolute right-1 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Info: Date/Time, Admin Profile, Wi-Fi, Settings, Windows controls */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Calendar className="w-5 h-5 text-[#00b852]" />
            <div className="text-left leading-tight text-xs">
              <span className="font-bold block text-slate-800 font-sans">
                26 Oct 2026
              </span>
              <span className="text-[11px] text-slate-500 block font-sans">
                12:45 PM
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1 pr-1.5 py-1 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#00b852] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left leading-tight">
              <span className="font-bold text-xs block text-slate-800 font-sans">
                Admin
              </span>
              <span className="text-[10px] text-slate-400 block font-sans">
                POS User
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </div>

          {/* Wi-Fi & Settings Icons */}
          <div className="flex items-center gap-3 text-slate-600 pl-1 border-l border-slate-200">
            <button title="Wi-Fi Connected" className="hover:text-[#00b852] transition-colors">
              <Wifi className="w-5 h-5 text-slate-700" />
            </button>
            <button 
              onClick={() => onOpenSettings('branding')}
              title="Open Settings" 
              className="hover:text-[#00b852] transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Windows Window Controls */}
          <div className="flex items-center gap-2 pl-2">
            <button className="w-4 h-4 text-slate-400 hover:text-slate-700 flex items-center justify-center" title="Minimize">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button className="w-4 h-4 text-slate-400 hover:text-slate-700 flex items-center justify-center" title="Maximize">
              <Square className="w-3 h-3" />
            </button>
            <button className="w-4 h-4 text-slate-400 hover:text-red-500 flex items-center justify-center" title="Close">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY (Sidebar + Total Stock Workspace) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Dark Navy Sidebar (w-[236px], Total Stock selected in vibrant green) */}
        <aside className="w-[236px] h-[914px] shrink-0 bg-[#061224] text-slate-300 flex flex-col justify-between select-none border-r border-slate-800/60 overflow-hidden">
          
          {/* Navigation Menu */}
          <div className="p-2 space-y-0.5 overflow-y-auto max-h-[690px]">
            <button
              onClick={onNavigateToPOS}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={onNavigateToPOS}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-slate-400" />
                <span>Sales / POS</span>
              </div>
            </button>

            <button
              onClick={onNavigateToPurchase}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                <span>Purchase Entry</span>
              </div>
            </button>

            {/* ACTIVE TAB: Total Stock (Selected in Vibrant Green) */}
            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold bg-[#00b852] text-white shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-white" />
                <span>Total Stock</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={onNavigateToPurchase}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                <span>Purchase Orders</span>
              </div>
            </button>

            <button
              onClick={onNavigateToNewItem}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-slate-400" />
                <span>Stock Management</span>
              </div>
            </button>

            <button
              onClick={() => onOpenSettings('branding')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Customers</span>
              </div>
            </button>

            <button
              onClick={onNavigateToPurchase}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>Suppliers</span>
              </div>
            </button>

            <button
              onClick={onOpenSalesHistory}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span>Reports</span>
              </div>
            </button>

            <button
              onClick={onOpenDailyHisab}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Daily Hisab</span>
              </div>
            </button>

            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Scan className="w-4 h-4 text-slate-400" />
                <span>CCTV Cameras</span>
              </div>
            </button>

            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Google Search</span>
              </div>
            </button>

            <button
              onClick={() => onOpenSettings('desktop')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                <span>Device Management</span>
              </div>
            </button>
          </div>

          {/* Bottom Promotional Artwork Banner (Better Stock Better Business) */}
          <div className="p-2.5 space-y-1.5 mt-auto bg-[#061224]">
            <div 
              onClick={() => onOpenSettings('sidebar')}
              className="relative rounded-2xl overflow-hidden cursor-pointer group border border-emerald-600/40 bg-[#082e1c] h-[135px] flex flex-col justify-between p-2.5 text-center shadow-md hover:ring-2 hover:ring-[#00b852] transition-all"
              title="Click to Change Sidebar Picture in Settings"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-102"
                style={{ 
                  backgroundImage: `url(${sidebarBanner.image || '/products/sidebar_purchase_banner.png'})`,
                  backgroundSize: sidebarBanner.fit || 'cover'
                }}
              />
              <div className="relative z-10 mt-auto">
                <div className="inline-block px-3 py-0.5 rounded-full bg-[#00b852] text-white text-[10px] font-bold shadow-xs">
                  {sidebarBanner.pillText || branding.sidebarBadgeText || branding.softwareName || 'WAQAS SOFTWARE'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center & Right Total Stock Workspace (w-[1300px]) */}
        <div className="w-[1300px] h-[914px] flex flex-col justify-between p-3.5 overflow-hidden">
          
          {/* Top Green Banner */}
          <div className="w-full h-[62px] rounded-2xl bg-gradient-to-r from-[#009245] via-[#00a852] to-[#00b85c] px-6 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/95 flex items-center justify-center text-[#00a852] shadow-sm">
                <Box className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                  Total Stock
                </h2>
                <p className="text-emerald-100 text-xs font-semibold mt-1">
                  Manage your complete inventory
                </p>
              </div>
            </div>

            {/* Total Products Counter Box */}
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xs border border-white/20 px-3.5 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Box className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-medium text-emerald-100 leading-tight">
                  Total Products
                </span>
                <span className="block text-lg font-black text-white leading-tight font-mono">
                  {metrics.totalProducts}
                </span>
              </div>
            </div>
          </div>

          {/* 6 SUMMARY CARDS IN ONE HORIZONTAL ROW */}
          <div className="grid grid-cols-6 gap-2.5 my-2.5 shrink-0">
            
            {/* Card 1: Total Products (Green) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00a852] flex items-center justify-center shrink-0">
                <Box className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block truncate">Total Products</span>
                <span className="text-base font-black text-slate-900 font-mono leading-tight">{metrics.totalProducts}</span>
              </div>
            </div>

            {/* Card 2: Total Stock Quantity (Blue) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0284c7] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block truncate">Total Stock Quantity</span>
                <span className="text-base font-black text-[#0284c7] font-mono leading-tight">{metrics.totalStockQty.toLocaleString()}</span>
              </div>
            </div>

            {/* Card 3: Stock Purchase Value (Purple) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block truncate">Stock Purchase Value</span>
                <span className="text-xs font-black text-[#7c3aed] font-mono leading-tight truncate block">Rs. {metrics.stockPurchaseValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Card 4: Stock Retail Value (Teal) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block truncate">Stock Retail Value</span>
                <span className="text-xs font-black text-[#0d9488] font-mono leading-tight truncate block">Rs. {metrics.stockRetailValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Card 5: Low Stock Items (Orange) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#f59e0b] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block truncate">Low Stock Items</span>
                <span className="text-base font-black text-[#f59e0b] font-mono leading-tight">{metrics.lowStockItems}</span>
              </div>
            </div>

            {/* Card 6: Out of Stock Items (Red) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#ef4444] flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block truncate">Out of Stock Items</span>
                <span className="text-base font-black text-[#ef4444] font-mono leading-tight">{metrics.outOfStockItems}</span>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs space-y-2.5 shrink-0">
            {/* Top Row: Search Input + Scanner + Refresh + Clear Filters */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by Product Name, Barcode or SKU..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b852]/20 focus:border-[#00b852] transition-all"
                />
                <button
                  type="button"
                  onClick={onOpenScanner}
                  title="Scan Barcode"
                  className="w-8 h-8 rounded-lg bg-[#00a852] hover:bg-[#009245] text-white flex items-center justify-center absolute right-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  showToast('Inventory table refreshed');
                }}
                className="h-10 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-all active:scale-98 cursor-pointer shrink-0"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Clear Filters</span>
              </button>

              {onResetStockToZero && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('کیا آپ تمام پروڈکٹس کا اسٹاک 0 کرنا چاہتے ہیں؟\nAre you sure you want to set stock of all products to 0?')) {
                      onResetStockToZero();
                    }
                  }}
                  className="h-10 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 border border-amber-300 transition-all active:scale-98 cursor-pointer shrink-0 ml-auto"
                  title="Reset All Stock to 0 (اسٹاک زیرو کریں)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>اسٹاک 0 کریں (Reset Stock)</span>
                </button>
              )}
            </div>

            {/* Bottom Row: Dropdown Filters */}
            <div className="flex items-center gap-2.5">
              {/* All Products Status Pill Dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="h-9 pl-3.5 pr-8 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white text-xs font-bold focus:outline-none shadow-2xs appearance-none cursor-pointer transition-colors"
                >
                  <option value="All" className="bg-white text-slate-800">All Products</option>
                  <option value="In Stock" className="bg-white text-slate-800">In Stock</option>
                  <option value="Low Stock" className="bg-white text-slate-800">Low Stock</option>
                  <option value="Out of Stock" className="bg-white text-slate-800">Out of Stock</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Category Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00b852] appearance-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Brand Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={brandFilter}
                  onChange={(e) => {
                    setBrandFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00b852] appearance-none cursor-pointer"
                >
                  <option value="All">All Brands</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Supplier Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={supplierFilter}
                  onChange={(e) => {
                    setSupplierFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00b852] appearance-none cursor-pointer"
                >
                  <option value="All">All Suppliers</option>
                  {supplierNames.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* Active/Inactive Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00b852] appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* MAIN TABLE + RIGHT SIDE PRODUCT DETAILS */}
          <div className="flex gap-3 my-2.5 flex-1 overflow-hidden">
            
            {/* Left: Table Container (w-[940px]) */}
            <div className="w-[940px] flex flex-col justify-between overflow-hidden">
              
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col flex-1">
                {/* Table Header Bar */}
                <div className="h-9 bg-[#00a854] text-white px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Total Stock Items ({filteredProducts.length})</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span>Page</span>
                    <span className="px-2 py-0.5 rounded bg-black/20 font-bold font-mono text-[11px]">{currentPage}</span>
                    <span>of {totalPages}</span>
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="w-6 h-6 rounded bg-black/20 hover:bg-black/30 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="w-6 h-6 rounded bg-black/20 hover:bg-black/30 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 border-b border-slate-200 select-none">
                        <th className="py-2 px-2 text-center w-8">#</th>
                        <th className="py-2 px-2 text-center w-12">Image</th>
                        <th className="py-2 px-2.5">Product Name</th>
                        <th className="py-2 px-2 font-mono">Barcode / SKU</th>
                        <th className="py-2 px-2">Category</th>
                        <th className="py-2 px-2">Supplier</th>
                        <th className="py-2 px-2 text-right">Purchase Price</th>
                        <th className="py-2 px-2 text-right">Sale Price</th>
                        <th className="py-2 px-2 text-center">Stock Qty</th>
                        <th className="py-2 px-1.5 text-center">Unit</th>
                        <th className="py-2 px-2 text-right">Stock Value</th>
                        <th className="py-2 px-2 text-center">Status</th>
                        <th className="py-2 px-2 text-center w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                      {paginatedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="py-14 text-center text-slate-400 font-medium">
                            <Box className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
                            <p className="text-sm font-bold text-slate-700">
                              {products.length === 0 ? 'کوئی پروڈکٹ موجود نہیں ہے (0 Products in Inventory)' : 'No products match search or filter'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {products.length === 0
                                ? 'اسٹاک لسٹ بالکل خالی ہے۔ نیا پروڈکٹ شامل کرنے کے لیے نیچے "New Item" پر کلک کریں۔'
                                : 'Please try different filter parameters.'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map((p, idx) => {
                          const cost = getProductCost(p);
                          const stockValue = (p.stock || 0) * cost;
                          const status = getProductStatus(p);
                          const isSelected = p.id === selectedProductId;
                          const rowNum = (currentPage - 1) * itemsPerPage + idx + 1;

                          return (
                            <tr
                              key={p.id}
                              onClick={() => setSelectedProductId(p.id)}
                              className={`transition-colors cursor-pointer ${
                                isSelected 
                                  ? 'bg-emerald-50/70 border-l-4 border-l-[#00a852]' 
                                  : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="py-2 px-2 text-center font-bold text-slate-500 font-mono text-[11px]">
                                {rowNum}
                              </td>

                              <td className="py-1.5 px-2 text-center">
                                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-0.5 mx-auto overflow-hidden shadow-2xs">
                                  <img
                                    src={p.image || '/products/coca_cola_can.jpg'}
                                    alt={p.name}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/products/coca_cola_can.jpg';
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="py-2 px-2.5 font-bold text-slate-900 max-w-[130px] truncate" title={p.name}>
                                {p.name}
                              </td>

                              <td className="py-2 px-2 font-mono text-[11px] text-slate-500 truncate" title={p.barcode}>
                                {p.barcode}
                              </td>

                              <td className="py-2 px-2 text-slate-600 text-[11px] truncate">
                                {p.category || 'Groceries'}
                              </td>

                              <td className="py-2 px-2 text-slate-600 text-[11px] truncate">
                                {p.supplier || 'Local'}
                              </td>

                              <td className="py-2 px-2 text-right font-mono font-bold text-slate-700 text-[11px]">
                                Rs. {cost.toLocaleString()}
                              </td>

                              <td className="py-2 px-2 text-right font-mono font-black text-slate-900 text-[11px]">
                                Rs. {p.price.toLocaleString()}
                              </td>

                              <td className="py-2 px-2 text-center font-mono font-black text-xs text-slate-900">
                                {p.stock}
                              </td>

                              <td className="py-2 px-1.5 text-center text-slate-500 text-[11px]">
                                {p.unit || 'Piece'}
                              </td>

                              <td className="py-2 px-2 text-right font-mono font-bold text-[#00a852] text-[11px]">
                                Rs. {stockValue.toLocaleString()}
                              </td>

                              <td className="py-2 px-2 text-center">
                                {status === 'In Stock' && (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#00a852] text-white font-bold text-[10px] shadow-2xs">
                                    In Stock
                                  </span>
                                )}
                                {status === 'Low Stock' && (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#f59e0b] text-white font-bold text-[10px] shadow-2xs">
                                    Low Stock
                                  </span>
                                )}
                                {status === 'Out of Stock' && (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#ef4444] text-white font-bold text-[10px] shadow-2xs">
                                    Out of Stock
                                  </span>
                                )}
                              </td>

                              <td className="py-1.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1">
                                  {/* Edit Button (Green) */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(p)}
                                    title="Edit Item"
                                    className="w-7 h-7 rounded-lg bg-[#00a854] hover:bg-[#009245] text-white flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Adjust Stock Button (Blue) */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAdjustModal(p)}
                                    title="Adjust Stock Quantity"
                                    className="w-7 h-7 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                                  >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Activity / History Button (Orange) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedProductId(p.id);
                                      setIsHistoryModalOpen(true);
                                    }}
                                    title="View Stock History & Activity"
                                    className="w-7 h-7 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                                  >
                                    <BarChart3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Table Action Buttons */}
              <div className="flex items-center gap-2 mt-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onNavigateToNewItem}
                  className="flex-1 h-10 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>New Item</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedProduct}
                  onClick={() => selectedProduct && handleOpenEditModal(selectedProduct)}
                  className="flex-1 h-10 rounded-xl bg-[#00a854] hover:bg-[#009245] disabled:opacity-50 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Edit Item</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedProduct}
                  onClick={() => selectedProduct && handleOpenAdjustModal(selectedProduct)}
                  className="flex-1 h-10 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Adjust Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStockReportModalOpen(true)}
                  className="flex-1 h-10 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Stock Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex-1 h-10 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>

            {/* Right: Product Details Panel (w-[335px]) */}
            <div className="w-[335px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between shrink-0">
              
              <div>
                {/* Panel Header */}
                <div className="h-9 bg-[#00a854] text-white px-3 flex items-center gap-2 font-bold text-xs">
                  <Box className="w-4 h-4 stroke-[2.5]" />
                  <span>Product Details</span>
                </div>

                {selectedProduct ? (
                  <div className="p-3 space-y-3">
                    
                    {/* Top Card: Image + Key Info */}
                    <div className="flex gap-3 items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-20 h-24 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden shadow-2xs shrink-0">
                        <img
                          src={selectedProduct.image || '/products/coca_cola_can.jpg'}
                          alt={selectedProduct.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/products/coca_cola_can.jpg';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight truncate">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                          Barcode: {selectedProduct.barcode}
                        </p>
                        <p className="text-[11px] font-medium text-slate-600 mt-1">
                          Purchase Price: <span className="font-bold text-slate-800">Rs. {getProductCost(selectedProduct)}</span>
                        </p>
                        <p className="text-[11px] font-medium text-slate-600">
                          Sale Price: <span className="font-bold text-[#00a852]">Rs. {selectedProduct.price}</span>
                        </p>
                        <div className="mt-1.5">
                          {getProductStatus(selectedProduct) === 'In Stock' && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00a852] text-white font-bold text-[10px]">
                              In Stock
                            </span>
                          )}
                          {getProductStatus(selectedProduct) === 'Low Stock' && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-white font-bold text-[10px]">
                              Low Stock
                            </span>
                          )}
                          {getProductStatus(selectedProduct) === 'Out of Stock' && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#ef4444] text-white font-bold text-[10px]">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Metrics 2x2 Box */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 font-medium">
                      <div className="border-r border-b border-slate-200 pb-1.5 pr-2">
                        <span className="text-[10px] text-slate-400 block font-bold">Stock Quantity</span>
                        <span className="text-sm font-black font-mono text-slate-900">{selectedProduct.stock}</span>
                      </div>
                      <div className="border-b border-slate-200 pb-1.5 pl-2">
                        <span className="text-[10px] text-slate-400 block font-bold">Unit</span>
                        <span className="text-sm font-bold text-slate-700">{selectedProduct.unit || 'Piece'}</span>
                      </div>
                      <div className="border-r border-slate-200 pt-1.5 pr-2">
                        <span className="text-[10px] text-slate-400 block font-bold">Reorder Level</span>
                        <span className="text-sm font-black font-mono text-amber-600">{selectedProduct.reorderLevel || 10}</span>
                      </div>
                      <div className="pt-1.5 pl-2">
                        <span className="text-[10px] text-slate-400 block font-bold">Stock Value</span>
                        <span className="text-xs font-black font-mono text-[#00a852]">Rs. {((selectedProduct.stock || 0) * getProductCost(selectedProduct)).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Metadata Items */}
                    <div className="space-y-1.5 text-xs text-slate-600 px-1">
                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                          <Tag className="w-3.5 h-3.5 text-blue-500" />
                          <span>Category</span>
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">{selectedProduct.category || 'Beverages'}</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                          <Building className="w-3.5 h-3.5 text-amber-500" />
                          <span>Brand</span>
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">{selectedProduct.brand || selectedProduct.name.split(' ')[0]}</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                          <Truck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Supplier</span>
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">{selectedProduct.supplier || 'Nestle'}</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                          <ArrowUpDown className="w-3.5 h-3.5 text-purple-500" />
                          <span>Tax</span>
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">{selectedProduct.tax || 0}%</span>
                      </div>

                      <div className="py-1">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px] mb-0.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                          <span>Description</span>
                        </span>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {selectedProduct.description || `Refreshing ${selectedProduct.name}.`}
                        </p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Box className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
                    <p className="text-xs font-semibold">Select a product to view details</p>
                  </div>
                )}
              </div>

              {/* 4 Action Buttons in 2 Rows matching screenshot */}
              {selectedProduct && (
                <div className="p-3 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(selectedProduct)}
                      className="py-2.5 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Item</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAdjustModal(selectedProduct)}
                      className="py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Adjust Stock</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDetailsModalOpen(true)}
                      className="py-2 rounded-xl bg-[#64748b] hover:bg-[#475569] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPrintLabelModalOpen(true)}
                      className="py-2 rounded-xl bg-[#64748b] hover:bg-[#475569] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Details</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* BOTTOM DOCKED NAVIGATION (Home, Ledgers, POS, Products, Settings) */}
          <div className="w-full h-[52px] bg-white rounded-2xl border border-slate-200/90 px-8 flex items-center justify-around select-none shadow-xs shrink-0">
            <button
              onClick={onNavigateToPOS}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>HOME</span>
            </button>

            <button
              onClick={onNavigateToPurchase}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
              <span>LEDGERS</span>
            </button>

            {/* Elevated Circular POS Button */}
            <button
              onClick={onNavigateToPOS}
              className="flex flex-col items-center justify-center -mt-6 group cursor-pointer"
              title="Return to Sales POS Screen"
            >
              <div className="w-13 h-13 rounded-full bg-[#00b852] group-hover:bg-[#009e45] text-white flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/40 transition-all transform group-hover:scale-105 border-4 border-white">
                <ShoppingCart className="w-6 h-6 stroke-[2.3]" />
              </div>
              <span className="text-[11px] font-black text-[#00b852] mt-0.5 tracking-tight">
                POS
              </span>
            </button>

            {/* Active PRODUCTS Button */}
            <button
              className="flex items-center gap-2 text-[#00a852] text-xs font-black transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4 text-[#00a852]" />
              <span>PRODUCTS</span>
            </button>

            <button
              onClick={() => onOpenSettings('branding')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>SETTINGS</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. STATUS BAR (Exact 34px matching reference screenshot) */}
      <footer className="h-[34px] w-[1536px] bg-[#061224] text-slate-400 px-6 flex items-center justify-between text-xs font-medium select-none shrink-0 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-[#00b852]" />
            <span>{branding.softwareName || 'WAQAS SOFTWARE'}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">POS System</span>
        </div>

        <div className="flex items-center gap-6 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00b852] animate-pulse"></span>
            <span className="text-slate-200 font-semibold">Online</span>
          </div>

          <div className="text-slate-400">
            <span>Device ID: </span>
            <span className="text-slate-200 font-mono font-bold">{branding.deviceCode || 'WMS-001'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-[#00b852]" />
            <span>26 Oct 2026 12:45 PM</span>
          </div>
        </div>
      </footer>

      {/* ======================= MODALS ======================= */}

      {/* 1. EDIT ITEM MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00a852] text-white flex items-center justify-center">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Edit Inventory Item</h3>
                  <p className="text-xs text-slate-400">Update item pricing, barcode, image and inventory levels</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Product Name */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Barcode & Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Barcode / SKU *</label>
                <input
                  type="text"
                  value={editBarcode}
                  onChange={(e) => setEditBarcode(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Purchase Price & Sale Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Price (Rs.) *</label>
                <input
                  type="number"
                  value={editPurchasePrice}
                  onChange={(e) => setEditPurchasePrice(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sale Price (Rs.) *</label>
                <input
                  type="number"
                  value={editSalePrice}
                  onChange={(e) => setEditSalePrice(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Stock Quantity & Unit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                <select
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                >
                  <option value="Piece">Piece</option>
                  <option value="Kg">Kg</option>
                  <option value="Gram">Gram</option>
                  <option value="Litre">Litre</option>
                  <option value="Pack">Pack</option>
                  <option value="Box">Box</option>
                  <option value="Carton">Carton</option>
                </select>
              </div>

              {/* Brand & Supplier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={editSupplier}
                  onChange={(e) => setEditSupplier(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Reorder Level & Tax */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reorder Level</label>
                <input
                  type="number"
                  value={editReorderLevel}
                  onChange={(e) => setEditReorderLevel(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tax (%)</label>
                <input
                  type="number"
                  value={editTax}
                  onChange={(e) => setEditTax(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Product Image Editing */}
              <div className="col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img src={editImage || '/products/coca_cola_can.jpg'} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Product Picture</span>
                    <span className="text-[11px] text-slate-400">Change image for POS and Total Stock</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleEditImageUpload(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setEditImage('/products/coca_cola_can.jpg')}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#00a852] resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="col-span-2 flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#00a852] rounded accent-[#00a852]"
                  />
                  <span className="text-xs font-bold text-slate-700">Product is Active for Sale</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editTrackStock}
                    onChange={(e) => setEditTrackStock(e.target.checked)}
                    className="w-4 h-4 text-[#00a852] rounded accent-[#00a852]"
                  />
                  <span className="text-xs font-bold text-slate-700">Track Inventory Levels</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditProduct}
                className="px-5 py-2 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADJUST STOCK MODAL */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0284c7] text-white flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Adjust Stock</h3>
                  <p className="text-xs text-slate-400">{selectedProduct.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Current Quantity and New Preview */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">Current Stock</span>
                  <span className="text-lg font-black font-mono text-slate-800">{selectedProduct.stock}</span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Calculated New Stock</span>
                  <span className={`text-lg font-black font-mono ${calculatedNewQty < selectedProduct.stock ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {calculatedNewQty}
                  </span>
                </div>
              </div>

              {/* Adjustment Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('Add')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      adjustType === 'Add' 
                        ? 'bg-[#00a854] text-white border-[#00a854] shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    + Add Stock
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('Reduce')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      adjustType === 'Reduce' 
                        ? 'bg-[#ef4444] text-white border-[#ef4444] shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    − Reduce Stock
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('Set')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      adjustType === 'Set' 
                        ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    = Set Quantity
                  </button>
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {adjustType === 'Set' ? 'New Exact Quantity' : 'Quantity to Apply'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={adjustQtyInput}
                  onChange={(e) => setAdjustQtyInput(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Adjustment</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                >
                  <option value="Physical count variance">Physical count variance</option>
                  <option value="Damaged / Expired stock">Damaged / Expired stock</option>
                  <option value="Supplier return">Supplier return</option>
                  <option value="Direct inward receiving">Direct inward receiving</option>
                  <option value="Sample / Internal use">Sample / Internal use</option>
                  <option value="Correction of previous entry">Correction of previous entry</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Audit note by Store Manager"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#00a852]"
                />
              </div>

              {/* Confirmation warning if reducing stock past limit */}
              {showAdjustConfirmation && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-medium">
                    Warning: You are reducing stock by {adjustQtyInput} when current stock is {selectedProduct.stock}. This will leave zero or negative stock. Click "Confirm & Apply" to proceed.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyStockAdjustment}
                className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                {showAdjustConfirmation ? 'Confirm & Apply' : 'Save Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. STOCK HISTORY / ACTIVITY MODAL */}
      {isHistoryModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Stock Activity & History</h3>
                  <p className="text-xs text-slate-400">{selectedProduct.name} ({selectedProduct.barcode})</p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 divide-y divide-slate-100">
              {adjustments.filter(a => a.productId === selectedProduct.id).length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <BarChart3 className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
                  <p className="text-xs font-semibold">No stock adjustments logged yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Use "Adjust Stock" button to record physical count updates</p>
                </div>
              ) : (
                adjustments
                  .filter(a => a.productId === selectedProduct.id)
                  .map(adj => (
                    <div key={adj.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            adj.type === 'Add' ? 'bg-emerald-100 text-emerald-700' : (adj.type === 'Reduce' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700')
                          }`}>
                            {adj.type}
                          </span>
                          <span className="font-bold text-slate-800">{adj.reason}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{adj.dateStr} by {adj.user}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold block text-slate-700">
                          {adj.previousQty} → {adj.newQty}
                        </span>
                        <span className={`text-[11px] font-mono font-bold ${adj.changeQty >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {adj.changeQty > 0 ? `+${adj.changeQty}` : adj.changeQty}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. STOCK VALUATION & AUDIT REPORT MODAL */}
      {isStockReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-300">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#00a852]" />
                <h3 className="font-black text-sm text-slate-900 uppercase">WAQAS SOFTWARE — STOCK VALUATION REPORT</h3>
              </div>
              <button
                onClick={() => setIsStockReportModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>Date Generated: <strong>26 Oct 2026 12:45 PM</strong></div>
                <div>Generated By: <strong>Admin (POS User)</strong></div>
                <div>Total Inventory Items: <strong>{metrics.totalProducts}</strong></div>
                <div>Total Stock Units: <strong>{metrics.totalStockQty.toLocaleString()}</strong></div>
                <div>Total Purchase Cost: <strong>Rs. {metrics.stockPurchaseValue.toLocaleString()}</strong></div>
                <div>Total Retail Valuation: <strong>Rs. {metrics.stockRetailValue.toLocaleString()}</strong></div>
                <div>Expected Gross Margin: <strong>Rs. {(metrics.stockRetailValue - metrics.stockPurchaseValue).toLocaleString()}</strong></div>
                <div>Low / Zero Stock Alerts: <strong>{metrics.lowStockItems + metrics.outOfStockItems} items</strong></div>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-1.5 uppercase text-slate-700">Top Inventory Breakdown:</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2">Barcode</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Cost</th>
                        <th className="p-2 text-right">Total Val</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.slice(0, 10).map(p => (
                        <tr key={p.id}>
                          <td className="p-2 font-bold">{p.name}</td>
                          <td className="p-2 font-mono text-slate-500">{p.barcode}</td>
                          <td className="p-2 text-center">{p.stock} {p.unit || 'pc'}</td>
                          <td className="p-2 text-right">Rs. {getProductCost(p)}</td>
                          <td className="p-2 text-right font-bold text-emerald-700">Rs. {((p.stock || 0) * getProductCost(p)).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-slate-300 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Official WAQAS SOFTWARE Inventory Document</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Sending report to thermal/desktop printer...');
                    setTimeout(() => setIsStockReportModalOpen(false), 800);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsStockReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PRINT PRODUCT BARCODE SHELF TAG */}
      {isPrintLabelModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center font-sans">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3">Shelf Barcode Tag Preview</h3>
            
            {/* Shelf Label Simulation */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-white shadow-xs space-y-2">
              <div className="text-[10px] font-bold text-[#00a852] uppercase tracking-wide">
                {branding.softwareName || 'WAQAS SOFTWARE'}
              </div>
              <h4 className="font-black text-sm text-slate-900 leading-tight">
                {selectedProduct.name}
              </h4>
              <div className="text-2xl font-black font-mono text-[#00a852]">
                Rs. {selectedProduct.price}
              </div>
              
              {/* Simulated EAN-13 Barcode */}
              <div className="py-1">
                <div className="h-10 w-44 mx-auto bg-slate-900 flex items-center justify-around px-2 rounded">
                  <div className="w-1 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-1.5 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-1 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-2 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-1.5 h-full bg-white"></div>
                </div>
                <span className="font-mono text-xs font-bold tracking-widest text-slate-700 mt-1 block">
                  {selectedProduct.barcode}
                </span>
              </div>
              
              <div className="text-[9px] text-slate-400">
                Unit: {selectedProduct.unit || 'Piece'} • Category: {selectedProduct.category || 'General'}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  showToast(`Printed barcode tag for ${selectedProduct.name}`);
                  setIsPrintLabelModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tag</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrintLabelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW PRODUCT DETAILS MODAL */}
      {isDetailsModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Complete Product Specification</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="w-28 h-28 mx-auto rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center">
                <img src={selectedProduct.image || '/products/coca_cola_can.jpg'} alt={selectedProduct.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="divide-y divide-slate-100">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Name:</span>
                  <span className="font-bold text-slate-900">{selectedProduct.name}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Barcode:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedProduct.barcode}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Purchase Price:</span>
                  <span className="font-bold text-slate-800">Rs. {getProductCost(selectedProduct)}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Retail Price:</span>
                  <span className="font-bold text-[#00a852]">Rs. {selectedProduct.price}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Available Stock:</span>
                  <span className="font-mono font-black text-slate-900">{selectedProduct.stock} {selectedProduct.unit || 'Piece'}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Reorder Alert:</span>
                  <span className="font-bold text-amber-600">{selectedProduct.reorderLevel || 10}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Supplier:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.supplier || 'Nestle'}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Category:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.category || 'Beverages'}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Brand:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.brand || selectedProduct.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-xs cursor-pointer"
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
