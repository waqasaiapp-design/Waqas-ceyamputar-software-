import React, { useState, useRef } from 'react';
import { 
  Box, 
  Tag, 
  Barcode, 
  Scan, 
  ArrowUpDown, 
  Share2, 
  Percent, 
  ShoppingBag, 
  FileText, 
  Edit3, 
  Users, 
  Save, 
  PlusCircle, 
  RotateCcw, 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  Eye, 
  Trash2, 
  Home, 
  ShoppingCart, 
  FileSpreadsheet, 
  Settings as SettingsIcon, 
  Calendar, 
  User, 
  ChevronDown, 
  Wifi, 
  Search, 
  Minus, 
  Square, 
  X, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  HelpCircle,
  PackageCheck
} from 'lucide-react';
import { Product, Supplier, BrandingSettings, SidebarBannerSettings, ActiveSidebarTab } from '../types/pos';
import { INITIAL_SUPPLIERS } from '../data/posData';

interface NewItemPageProps {
  products: Product[];
  onAddProduct: (product: Product) => boolean;
  branding: BrandingSettings;
  sidebarBanner: SidebarBannerSettings;
  onNavigateToPOS: () => void;
  onNavigateToPurchase: () => void;
  onNavigateToTotalStock?: () => void;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onOpenDailyHisab: () => void;
  onOpenSalesHistory: () => void;
  onOpenScanner: () => void;
  showToast: (msg: string) => void;
}

export const NewItemPage: React.FC<NewItemPageProps> = ({
  products,
  onAddProduct,
  branding,
  sidebarBanner,
  onNavigateToPOS,
  onNavigateToPurchase,
  onNavigateToTotalStock,
  onOpenSettings,
  onOpenDailyHisab,
  onOpenSalesHistory,
  onOpenScanner,
  showToast,
}) => {
  // Suppliers list (retrieved from localStorage or defaults)
  const [suppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('waqas_suppliers_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // Default initial image: Coca Cola packshot matching user reference screenshot
  const DEFAULT_IMAGE = '/products/coca_cola_can.jpg';

  // Form State
  const [productName, setProductName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [unit, setUnit] = useState('Piece');
  const [stockQuantity, setStockQuantity] = useState<string>('0');
  const [reorderLevel, setReorderLevel] = useState<string>('0');
  const [taxPercent, setTaxPercent] = useState<string>('0');
  const [supplier, setSupplier] = useState('');

  // Additional Settings Switches
  const [isActive, setIsActive] = useState<boolean>(true);
  const [trackStock, setTrackStock] = useState<boolean>(true);

  // Image State
  const [productImage, setProductImage] = useState<string>(DEFAULT_IMAGE);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Categories list
  const categories = [
    'Beverages',
    'Groceries',
    'Snacks',
    'Dairy',
    'Bakery',
    'Fresh Fruits',
    'Vegetables',
    'Household',
    'Personal Care',
    'Meat & Poultry',
    'Spices & Masalas',
    'Confectionery',
    'Baby Care'
  ];

  // Unit options matching reference
  const unitOptions = [
    'Piece',
    'Kg',
    'Gram',
    'Litre',
    'Pack',
    'Box',
    'Carton'
  ];

  // Generate random barcode if needed
  const handleGenerateBarcode = () => {
    const randomBarcode = '896400' + Math.floor(100000 + Math.random() * 900000);
    setBarcode(randomBarcode);
    showToast(`New Barcode Generated: ${randomBarcode}`);
  };

  // Image handling: File Upload & Drag-and-Drop with FileReader to base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, JPEG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProductImage(e.target.result as string);
        showToast('Product image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setProductImage('');
    showToast('Image removed');
  };

  const handleResetImage = () => {
    setProductImage(DEFAULT_IMAGE);
    showToast('Default image restored');
  };

  // Clear Form
  const handleClearForm = () => {
    setProductName('');
    setBarcode('');
    setPurchasePrice('');
    setSalePrice('');
    setCategory('');
    setBrand('');
    setDescription('');
    setUnit('Piece');
    setStockQuantity('0');
    setReorderLevel('0');
    setTaxPercent('0');
    setSupplier('');
    setIsActive(true);
    setTrackStock(true);
    setProductImage(DEFAULT_IMAGE);
    setErrors({});
    showToast('Form cleared');
  };

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (!barcode.trim()) {
      newErrors.barcode = 'Barcode / SKU is required';
    } else {
      // Check if barcode already exists
      const duplicate = products.find(p => p.barcode.trim().toLowerCase() === barcode.trim().toLowerCase());
      if (duplicate) {
        newErrors.barcode = `Barcode already used by "${duplicate.name}"`;
      }
    }

    const pPriceNum = parseFloat(purchasePrice) || 0;
    if (purchasePrice === '' || isNaN(pPriceNum) || pPriceNum < 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }

    const sPriceNum = parseFloat(salePrice) || 0;
    if (salePrice === '' || isNaN(sPriceNum) || sPriceNum <= 0) {
      newErrors.salePrice = 'Sale price must be greater than 0';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    const stockNum = parseInt(stockQuantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stockQuantity = 'Enter valid stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Item handler
  const handleSave = (addAnother: boolean = false) => {
    if (!validateForm()) {
      showToast('Please fix the highlighted required fields');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      barcode: barcode.trim(),
      purchasePrice: parseFloat(purchasePrice) || 0,
      price: parseFloat(salePrice) || 0,
      category: category,
      brand: brand.trim() || undefined,
      description: description.trim() || undefined,
      unit: unit,
      stock: parseInt(stockQuantity, 10) || 0,
      reorderLevel: parseInt(reorderLevel, 10) || 0,
      tax: parseFloat(taxPercent) || 0,
      supplier: supplier || undefined,
      isActive: isActive,
      trackStock: trackStock,
      image: productImage || DEFAULT_IMAGE
    };

    const success = onAddProduct(newProduct);
    if (!success) return;

    if (addAnother) {
      // Reset form but keep category & unit for faster bulk entry
      setProductName('');
      setBarcode('');
      setPurchasePrice('');
      setSalePrice('');
      setBrand('');
      setDescription('');
      setStockQuantity('0');
      setReorderLevel('0');
      setTaxPercent('0');
      setProductImage(DEFAULT_IMAGE);
      setErrors({});
      showToast(`Saved "${newProduct.name}"! Ready for next item.`);
    } else {
      showToast(`"${newProduct.name}" successfully added to inventory!`);
      // Navigate to POS so cashier can see it immediately
      setTimeout(() => {
        onNavigateToPOS();
      }, 700);
    }
  };

  return (
    <div className="w-[1536px] h-[1024px] bg-[#f4f7fb] text-slate-800 flex flex-col select-none overflow-hidden font-sans">
      
      {/* 1. TOP HEADER (Exact 76px desktop header with branding, global search, user profile, Windows controls) */}
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
              className="w-full h-11 pl-11 pr-12 rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b852]/30 focus:border-[#00b852] transition-all"
            />
            <button
              type="button"
              onClick={onOpenScanner}
              title="Open Barcode Scanner"
              className="w-9 h-9 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white flex items-center justify-center absolute right-1 shadow-sm active:scale-95 transition-all"
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
              className="hover:text-[#00b852] transition-colors"
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

      {/* 2. MAIN BODY (Sidebar + New Item Workspace) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Dark Navy Sidebar (w-[236px], exactly matching reference with green active tab) */}
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

            <button
              onClick={onNavigateToTotalStock || onNavigateToPOS}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-slate-400" />
                <span>Total Stock</span>
              </div>
            </button>

            <button
              onClick={onNavigateToPurchase}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Purchase Orders</span>
              </div>
            </button>

            {/* ACTIVE: Stock Management / New Item */}
            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold bg-[#00b852] text-white shadow-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-white" />
                <span>Stock Management</span>
              </div>
              <ChevronDown className="w-4 h-4 -rotate-90 text-white" />
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
                <Users className="w-4 h-4 text-slate-400" />
                <span>Suppliers</span>
              </div>
            </button>

            <button
              onClick={onOpenSalesHistory}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" />
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
                <Camera className="w-4 h-4 text-slate-400" />
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
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-emerald-300 p-1 rounded-full text-[9px] z-10">
                <Edit3 className="w-3 h-3" />
              </div>
              <div className="relative z-10 mt-auto">
                <div className="inline-block px-3 py-0.5 rounded-full bg-[#00b852] text-white text-[10px] font-bold shadow-xs">
                  {sidebarBanner.pillText || branding.sidebarBadgeText || branding.softwareName || 'WAQAS SOFTWARE'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center & Right New Item Workspace (Exact 1300px wide, matching screenshot) */}
        <div className="w-[1300px] h-[914px] flex flex-col justify-between p-4 overflow-hidden">
          
          {/* TOP GREEN BANNER */}
          <div className="w-full h-[66px] rounded-2xl bg-gradient-to-r from-[#009245] via-[#00a852] to-[#00b85c] px-6 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/95 flex items-center justify-center text-[#00a852] shadow-sm">
                <Box className="w-7 h-7 stroke-[2.3]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                  New Item
                </h2>
                <p className="text-emerald-100 text-xs font-semibold mt-1">
                  Add new product to your store
                </p>
              </div>
            </div>

            {/* Total Products Counter Box */}
            <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Box className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-[11px] font-medium text-emerald-100 leading-tight">
                  Total Products
                </span>
                <span className="block text-xl font-black text-white leading-tight font-mono">
                  {products.length}
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA: Left Form + Right Image Panel */}
          <div className="flex gap-4 mt-3 flex-1 overflow-hidden">
            
            {/* LEFT SIDE: Product Information + Additional Settings + Bottom Action Buttons */}
            <div className="w-[880px] flex flex-col justify-between">
              
              {/* Product Information Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
                  <Box className="w-4 h-4 text-slate-700" />
                  <span>Product Information</span>
                </div>

                {/* 2-Column Inputs Grid */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
                  
                  {/* Row 1, Col 1: Product Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      <span>Product Name <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name..."
                      value={productName}
                      onChange={(e) => {
                        setProductName(e.target.value);
                        if (errors.productName) setErrors(prev => ({ ...prev, productName: '' }));
                      }}
                      className={`w-full h-10 px-3.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                        errors.productName 
                          ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]'
                      }`}
                    />
                    {errors.productName && (
                      <span className="text-[11px] text-red-500 font-medium mt-0.5 block">
                        {errors.productName}
                      </span>
                    )}
                  </div>

                  {/* Row 1, Col 2: Unit */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      <span>Unit</span>
                    </label>
                    <div className="relative">
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full h-10 px-3.5 pr-8 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852] appearance-none cursor-pointer"
                      >
                        {unitOptions.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Row 2, Col 1: Barcode / SKU with Green Scan Button */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Barcode className="w-3.5 h-3.5 text-slate-600" />
                      <span>Barcode / SKU <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Scan or enter barcode / SKU..."
                        value={barcode}
                        onChange={(e) => {
                          setBarcode(e.target.value);
                          if (errors.barcode) setErrors(prev => ({ ...prev, barcode: '' }));
                        }}
                        className={`w-full h-10 pl-3.5 pr-12 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                          errors.barcode 
                            ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400' 
                            : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateBarcode}
                        title="Generate or scan Barcode"
                        className="w-8 h-8 rounded-lg bg-[#00a852] hover:bg-[#009245] text-white flex items-center justify-center absolute right-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <Scan className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.barcode && (
                      <span className="text-[11px] text-red-500 font-medium mt-0.5 block">
                        {errors.barcode}
                      </span>
                    )}
                  </div>

                  {/* Row 2, Col 2: Stock Quantity */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Box className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Stock Quantity <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => {
                        setStockQuantity(e.target.value);
                        if (errors.stockQuantity) setErrors(prev => ({ ...prev, stockQuantity: '' }));
                      }}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]"
                    />
                  </div>

                  {/* Row 3, Col 1: Purchase Price & Sale Price */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                        <Box className="w-3 h-3 text-slate-500" />
                        <span>Purchase Price <span className="text-red-500">*</span></span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-slate-500 pointer-events-none">Rs.</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={purchasePrice}
                          onChange={(e) => {
                            setPurchasePrice(e.target.value);
                            if (errors.purchasePrice) setErrors(prev => ({ ...prev, purchasePrice: '' }));
                          }}
                          className={`w-full h-10 pl-9 pr-2 rounded-xl border text-sm text-slate-800 font-medium focus:outline-none ${
                            errors.purchasePrice 
                              ? 'border-red-400 bg-red-50/30' 
                              : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                        <ArrowUpDown className="w-3 h-3 text-blue-600" />
                        <span>Sale Price <span className="text-red-500">*</span></span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-slate-500 pointer-events-none">Rs.</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={salePrice}
                          onChange={(e) => {
                            setSalePrice(e.target.value);
                            if (errors.salePrice) setErrors(prev => ({ ...prev, salePrice: '' }));
                          }}
                          className={`w-full h-10 pl-9 pr-2 rounded-xl border text-sm text-slate-800 font-medium focus:outline-none ${
                            errors.salePrice 
                              ? 'border-red-400 bg-red-50/30' 
                              : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3, Col 2: Reorder Level */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Share2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Reorder Level</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={reorderLevel}
                      onChange={(e) => setReorderLevel(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]"
                    />
                  </div>

                  {/* Row 4, Col 1: Category */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Box className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Category <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                        }}
                        className={`w-full h-10 px-3.5 pr-8 rounded-xl border text-sm text-slate-800 font-medium focus:outline-none appearance-none cursor-pointer ${
                          errors.category 
                            ? 'border-red-400 bg-red-50/30' 
                            : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]'
                        }`}
                      >
                        <option value="">Select category...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                    {errors.category && (
                      <span className="text-[11px] text-red-500 font-medium mt-0.5 block">
                        {errors.category}
                      </span>
                    )}
                  </div>

                  {/* Row 4, Col 2: Tax (%) */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Percent className="w-3.5 h-3.5 text-purple-500" />
                      <span>Tax (%)</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]"
                      />
                      <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                    </div>
                  </div>

                  {/* Row 5, Col 1: Brand */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                      <span>Brand</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter brand name..."
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852]"
                    />
                  </div>

                  {/* Row 5, Col 2: Supplier */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Supplier</span>
                    </label>
                    <div className="relative">
                      <select
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        className="w-full h-10 px-3.5 pr-8 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852] appearance-none cursor-pointer"
                      >
                        <option value="">Select supplier...</option>
                        {suppliers.map((sup) => (
                          <option key={sup.id} value={sup.name}>
                            {sup.name} {sup.city ? `(${sup.city})` : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Row 6: Description (Full Width across 2 cols) */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Description</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter product description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a852]/20 focus:border-[#00a852] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Settings Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-4 mt-2.5">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
                  <Users className="w-4 h-4 text-slate-700" />
                  <span>Additional Settings</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Switch 1: Is Active */}
                  <div className="flex items-center gap-3.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                        isActive ? 'bg-[#00a852]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        Is Active
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Product will be available for sale
                      </span>
                    </div>
                  </div>

                  {/* Switch 2: Track Stock */}
                  <div className="flex items-center gap-3.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setTrackStock(!trackStock)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                        trackStock ? 'bg-[#00a852]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          trackStock ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        Track Stock
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Maintain stock quantity
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons (Green, Blue, Slate Grey) */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="flex-1 h-11 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.3]" />
                  <span>Save Item</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="flex-1 h-11 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.3]" />
                  <span>Save & Add Another</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearForm}
                  className="flex-1 h-11 rounded-xl bg-[#5b6b7f] hover:bg-[#475569] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.3]" />
                  <span>Clear Form</span>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Product Image Upload & Live Preview Panel */}
            <div className="w-[370px] bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden flex flex-col justify-between">
              
              <div>
                {/* Panel Header */}
                <div className="h-11 bg-[#00a854] text-white px-4 flex items-center gap-2.5 font-bold text-sm">
                  <Camera className="w-5 h-5 stroke-[2.3]" />
                  <span>Product Image</span>
                </div>

                <div className="p-4 space-y-4">
                  {/* Upload Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-[#00a852] bg-emerald-50/50' 
                        : 'border-slate-200 hover:border-[#00a852] bg-slate-50/60 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <UploadCloud className="w-7 h-7 text-slate-400 stroke-[1.8]" />
                    </div>

                    <span className="font-bold text-xs text-slate-700 block">
                      Click to upload image
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      or drag and drop (PNG, JPG, JPEG)
                    </span>

                    {/* Choose from Computer Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="w-full mt-3.5 py-2.5 rounded-xl bg-[#00a854] hover:bg-[#009245] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Choose from Computer</span>
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      className="hidden"
                    />
                  </div>

                  {/* Image Preview Box */}
                  <div>
                    <span className="block text-xs font-bold text-slate-700 mb-1.5">
                      Image Preview
                    </span>

                    <div className="h-[185px] w-full rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center justify-center p-3 relative overflow-hidden">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt="Product Preview"
                          className="max-h-[160px] max-w-[210px] object-contain drop-shadow-md transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImageIcon className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
                          <span className="text-xs font-medium mt-1 block">No image selected</span>
                        </div>
                      )}
                    </div>

                    {/* Preview & Remove Action Buttons */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        disabled={!productImage}
                        className="flex-1 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={!productImage}
                        className="flex-1 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Reset Image Button */}
                    <button
                      type="button"
                      onClick={handleResetImage}
                      className="w-full mt-2 py-2 rounded-xl bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Image</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom tip info */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#00a852] shrink-0" />
                <span>Images are permanently stored locally for fast POS checkout.</span>
              </div>
            </div>
          </div>

          {/* BOTTOM DOCKED NAVIGATION (Home, Ledgers, POS, Products, Settings) */}
          <div className="w-full h-[52px] bg-white rounded-2xl border border-slate-200/90 px-8 flex items-center justify-around select-none shadow-xs mt-3">
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

            {/* Floating POS Button */}
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

            {/* Active Products Tab */}
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

      {/* 3. STATUS BAR (Exact dark status bar matching reference) */}
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

      {/* IMAGE PREVIEW MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-6 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col items-center relative">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#00a852]" />
              <span>Full Size Product Image Preview</span>
            </h3>

            <div className="w-full h-80 rounded-2xl bg-slate-50 flex items-center justify-center p-4 border border-slate-200 overflow-hidden">
              <img
                src={productImage}
                alt={productName || 'Product'}
                className="max-h-full max-w-full object-contain drop-shadow-xl"
              />
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{productName ? `Item: ${productName}` : 'Preview Sample'}</span>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#00a852] hover:bg-[#009545] text-white font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
