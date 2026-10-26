import React from 'react';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  FileSpreadsheet, 
  BarChart3, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Download, 
  Settings as SettingsIcon,
  ShoppingBag,
  Truck,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Product, CompletedSale, BrandingSettings, SidebarBannerSettings } from '../types/pos';
import { Sidebar } from './Sidebar';

interface DashboardPageProps {
  products: Product[];
  salesHistory: CompletedSale[];
  branding: BrandingSettings;
  sidebarBanner: SidebarBannerSettings;
  onNavigateToPOS: () => void;
  onNavigateToPurchase: () => void;
  onNavigateToNewItem: () => void;
  onNavigateToTotalStock: () => void;
  onNavigateToSalesSummary: () => void;
  onOpenDailyHisab: () => void;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onViewReceipt: (sale: CompletedSale) => void;
  onExportBackup: () => void;
  showToast: (msg: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  products,
  salesHistory,
  branding,
  sidebarBanner,
  onNavigateToPOS,
  onNavigateToPurchase,
  onNavigateToNewItem,
  onNavigateToTotalStock,
  onNavigateToSalesSummary,
  onOpenDailyHisab,
  onOpenSettings,
  onViewReceipt,
  onExportBackup,
  showToast,
}) => {
  // Calculations based on actual data
  const totalProductsCount = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalStockPurchaseValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.purchasePrice || 0)), 0);
  const totalStockRetailValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);
  
  const lowStockItems = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.reorderLevel || 5));
  const outOfStockItems = products.filter(p => (p.stock || 0) <= 0);

  // Today's Sales Calculation
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaySales = salesHistory.filter(s => s.date === todayStr);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayItemsSold = todaySales.reduce((sum, s) => sum + s.totalQuantity, 0);

  // All time revenue
  const totalLifetimeRevenue = salesHistory.reduce((sum, s) => sum + s.totalAmount, 0);

  // Recent 5 sales
  const recentSales = salesHistory.slice(0, 5);

  return (
    <div className="w-[1536px] h-[1024px] flex flex-col bg-[#f0f4f8] text-slate-800 font-sans shadow-2xl shrink-0 select-none overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="h-[76px] bg-[#061224] text-white px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b852] to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <img 
              src="/products/header_logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                // fallback
                (e.currentTarget as HTMLElement).style.display = 'none';
              }} 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-white uppercase">
                {branding.softwareName || 'WAQAS MART'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00b852] border border-[#00b852]/40 text-[10px] font-bold">
                WEB APP LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Supermarket Management & Point of Sale System
            </p>
          </div>
        </div>

        {/* Quick Launch Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToPOS}
            className="px-3.5 py-1.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Open POS Counter</span>
          </button>

          <button
            onClick={onNavigateToPurchase}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Purchase Entry</span>
          </button>

          <button
            onClick={onExportBackup}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download JSON Database Backup for Safe Storage"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Backup Data</span>
          </button>

          <button
            onClick={() => onOpenSettings('branding')}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar & Dashboard Content */}
      <div className="w-[1536px] h-[914px] flex overflow-hidden">
        
        {/* Left Dark Navy Sidebar */}
        <Sidebar
          activeTab="Dashboard"
          setActiveTab={(tab) => {
            if (tab === 'Sale') onNavigateToPOS();
            else if (tab === 'Purchase') onNavigateToPurchase();
            else if (tab === 'Stock Management') onNavigateToNewItem();
            else if (tab === 'Total Stock') onNavigateToTotalStock();
            else if (tab === 'Sales History') onNavigateToSalesSummary();
            else if (tab === 'Daily Hisab') onOpenDailyHisab();
            else if (tab === 'Reports') onNavigateToSalesSummary();
          }}
          branding={branding}
          sidebarBanner={sidebarBanner}
          onOpenSettings={onOpenSettings}
          onOpenDailyHisab={onOpenDailyHisab}
          onOpenSalesHistory={onNavigateToSalesSummary}
          onOpenStockModal={onNavigateToTotalStock}
          onOpenReportsModal={onNavigateToSalesSummary}
        />

        {/* Center Main Dashboard Area (1300px) */}
        <div className="flex-1 h-[914px] overflow-y-auto p-5 space-y-5 bg-[#f0f4f8]">
          
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#063f25] via-[#094d2f] to-[#04331d] text-white p-5 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00b852] animate-pulse"></span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
                  Business Overview & Management
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Welcome to {branding.softwareName || 'WAQAS MART'}
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Live browser-based supermarket point of sale, real-time inventory tracking, and purchase control.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-emerald-200 font-medium">Current Date</div>
                <div className="text-sm font-bold text-white font-mono">{todayStr}</div>
              </div>
              <button
                onClick={onNavigateToPOS}
                className="px-4 py-2.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <span>🚀 Launch POS Screen</span>
              </button>
            </div>

            <div className="absolute right-40 -bottom-10 opacity-15 text-8xl pointer-events-none">
              🛒
            </div>
          </div>

          {/* 6 Summary Metric Cards in 1 Row */}
          <div className="grid grid-cols-6 gap-3">
            {/* Card 1: Today's Revenue */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Today's Sales</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#00b852] flex items-center justify-center font-bold">
                  Rs
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  Rs. {todayRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{todaySales.length} Invoices</span>
                  <span className="text-emerald-600 font-bold">{todayItemsSold} Items</span>
                </div>
              </div>
            </div>

            {/* Card 2: Lifetime Sales */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  Rs. {totalLifetimeRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {salesHistory.length} Total completed sales
                </div>
              </div>
            </div>

            {/* Card 3: Total Products */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Products</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {totalProductsCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Active Catalog</span>
                  <button 
                    onClick={onNavigateToNewItem}
                    className="text-purple-600 hover:underline font-bold"
                  >
                    + Add New
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Total Stock Units */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Units</span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {totalStockUnits.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Units in store inventory
                </div>
              </div>
            </div>

            {/* Card 5: Inventory Valuation */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Stock Value</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  Rs. {totalStockPurchaseValue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Retail: Rs. {totalStockRetailValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Card 6: Low & Out of Stock */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Stock Alerts</span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-rose-600 font-mono flex items-center gap-1.5">
                  <span>{lowStockItems.length + outOfStockItems.length}</span>
                  <span className="text-xs font-semibold text-slate-500">Alerts</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span className="text-amber-600 font-medium">{lowStockItems.length} Low</span>
                  <span className="text-rose-600 font-medium">{outOfStockItems.length} Out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Module Navigation Buttons Grid */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-3">
              Direct System Navigation & Tools
            </h3>
            <div className="grid grid-cols-6 gap-3">
              <button
                onClick={onNavigateToPOS}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00b852] text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#00b852] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800">1. Sale / POS</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Counter sales, barcode scanner, thermal printing</p>
              </button>

              <button
                onClick={onNavigateToPurchase}
                className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-500 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800">2. Purchase Entry</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Supplier vouchers, stock in, purchase records</p>
              </button>

              <button
                onClick={onNavigateToNewItem}
                className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-500 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800">3. New Item</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Add products, barcode, unit, image upload</p>
              </button>

              <button
                onClick={onNavigateToTotalStock}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00b852] text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800">4. Total Stock</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Complete inventory table, adjust stock, edit item</p>
              </button>

              <button
                onClick={onNavigateToSalesSummary}
                className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-500 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800">5. Sale Summary</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Daily reports, transaction history, receipts</p>
              </button>

              <button
                onClick={onOpenDailyHisab}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-500 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800">6. Daily Hisab</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Cash register closing, daily drawer balance</p>
              </button>
            </div>
          </div>

          {/* Two-Column Layout: Recent Transactions & Low Stock Alerts */}
          <div className="grid grid-cols-12 gap-5">
            
            {/* Left Col: Recent Sales Transactions (7 cols) */}
            <div className="col-span-7 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Recent Sales Transactions
                    </h3>
                  </div>
                  <button
                    onClick={onNavigateToSalesSummary}
                    className="text-xs text-[#00b852] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Sales</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {recentSales.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No sales completed yet</p>
                    <button
                      onClick={onNavigateToPOS}
                      className="px-3 py-1.5 rounded-lg bg-[#00b852] text-white text-xs font-bold"
                    >
                      Create First Sale
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2">
                    {recentSales.map((sale) => (
                      <div key={sale.invoiceNo} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">{sale.invoiceNo}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                              {sale.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {sale.date} at {sale.time} • {sale.totalQuantity} items • Cashier: {sale.cashier}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-slate-900">
                            Rs. {sale.totalAmount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => onViewReceipt(sale)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-[#00b852] transition-colors"
                            title="Print / View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Stored persistently in browser memory</span>
                <button
                  onClick={onExportBackup}
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup File</span>
                </button>
              </div>
            </div>

            {/* Right Col: Stock Status & Alerts (5 cols) */}
            <div className="col-span-5 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Low & Out of Stock Alerts
                    </h3>
                  </div>
                  <button
                    onClick={onNavigateToTotalStock}
                    className="text-xs text-[#00b852] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Total Stock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                    <p className="text-xs font-semibold text-slate-600">All inventory items are healthy</p>
                    <p className="text-[11px] text-slate-400">No products are below reorder level</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2 max-h-[300px] overflow-y-auto">
                    {[...outOfStockItems, ...lowStockItems].slice(0, 5).map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between px-2 hover:bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <Package className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 truncate max-w-[170px]">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{item.barcode}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.stock <= 0 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.stock <= 0 ? 'Out of Stock' : `${item.stock} left`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={onNavigateToPurchase}
                  className="w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Receive Stock via Purchase Entry</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Status Bar */}
      <footer className="h-[34px] bg-[#061224] text-slate-400 px-6 flex items-center justify-between text-xs border-t border-slate-800 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00b852]"></span>
            <span className="text-slate-300 font-medium">Browser Web App Mode: Online</span>
          </div>
          <span>|</span>
          <span>Local Storage: Active</span>
          <span>|</span>
          <span>Terminal: {branding.deviceCode || 'POS-01'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{branding.softwareName || 'WAQAS MART'} © 2026</span>
        </div>
      </footer>

    </div>
  );
};
