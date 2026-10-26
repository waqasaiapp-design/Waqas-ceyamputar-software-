import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Printer, 
  Search, 
  FileSpreadsheet, 
  ArrowLeft, 
  ShoppingBag, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  Eye, 
  Filter, 
  RefreshCw,
  Home,
  ShoppingCart,
  Truck,
  Layers,
  Settings as SettingsIcon,
  ChevronRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { CompletedSale, BrandingSettings, SidebarBannerSettings } from '../types/pos';
import { Sidebar } from './Sidebar';

interface SalesSummaryPageProps {
  salesHistory: CompletedSale[];
  branding: BrandingSettings;
  sidebarBanner: SidebarBannerSettings;
  onNavigateToPOS: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToPurchase: () => void;
  onNavigateToNewItem: () => void;
  onNavigateToTotalStock: () => void;
  onOpenDailyHisab: () => void;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onViewReceipt: (sale: CompletedSale) => void;
  showToast: (msg: string) => void;
}

export const SalesSummaryPage: React.FC<SalesSummaryPageProps> = ({
  salesHistory,
  branding,
  sidebarBanner,
  onNavigateToPOS,
  onNavigateToDashboard,
  onNavigateToPurchase,
  onNavigateToNewItem,
  onNavigateToTotalStock,
  onOpenDailyHisab,
  onOpenSettings,
  onViewReceipt,
  showToast,
}) => {
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Yesterday' | 'Last 7 Days' | 'This Month'>('All');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Cash' | 'Card' | 'Credit'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Date strings
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Filtered sales
  const filteredSales = useMemo(() => {
    return salesHistory.filter((sale) => {
      // Date filter
      if (dateFilter === 'Today' && sale.date !== todayStr) return false;
      if (dateFilter === 'Yesterday' && sale.date !== yesterdayStr) return false;
      if (dateFilter === 'Last 7 Days') {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (sale.timestamp < weekAgo) return false;
      }
      if (dateFilter === 'This Month') {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const saleDate = new Date(sale.timestamp);
        if (saleDate.getMonth() !== thisMonth || saleDate.getFullYear() !== thisYear) return false;
      }

      // Payment filter
      if (paymentFilter !== 'All' && sale.paymentMethod !== paymentFilter) return false;

      // Search query (invoice # or cashier)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesInvoice = sale.invoiceNo.toLowerCase().includes(q);
        const matchesCashier = sale.cashier.toLowerCase().includes(q);
        const matchesItem = sale.items.some(it => it.product.name.toLowerCase().includes(q));
        if (!matchesInvoice && !matchesCashier && !matchesItem) return false;
      }

      return true;
    });
  }, [salesHistory, dateFilter, paymentFilter, searchQuery, todayStr, yesterdayStr]);

  // Aggregate stats
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalItemsSold = filteredSales.reduce((sum, s) => sum + s.totalQuantity, 0);
  const totalInvoices = filteredSales.length;
  const avgBillValue = totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0;

  const cashRevenue = filteredSales
    .filter(s => s.paymentMethod === 'Cash')
    .reduce((sum, s) => sum + s.totalAmount, 0);
  const cardRevenue = filteredSales
    .filter(s => s.paymentMethod === 'Card')
    .reduce((sum, s) => sum + s.totalAmount, 0);
  const creditRevenue = filteredSales
    .filter(s => s.paymentMethod === 'Credit')
    .reduce((sum, s) => sum + s.totalAmount, 0);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredSales.length === 0) {
      showToast('No sales data to export');
      return;
    }

    const headers = ['Invoice No', 'Date', 'Time', 'Cashier', 'Items Count', 'Payment Method', 'Total Amount'];
    const rows = filteredSales.map(s => [
      `"${s.invoiceNo}"`,
      `"${s.date}"`,
      `"${s.time}"`,
      `"${s.cashier}"`,
      s.totalQuantity,
      `"${s.paymentMethod}"`,
      s.totalAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `waqas_sales_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales Summary CSV downloaded successfully!');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="w-[1536px] h-[1024px] flex flex-col bg-[#f0f4f8] text-slate-800 font-sans shadow-2xl shrink-0 select-none overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="h-[76px] bg-[#061224] text-white px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-white uppercase">
                Sales Summary & Financial Reports
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                AUDIT READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Complete transaction register, payment reconciliations and item sales records
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onNavigateToPOS}
            className="px-3.5 py-1.5 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Back to POS</span>
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar & Sales Content */}
      <div className="w-[1536px] h-[914px] flex overflow-hidden">
        
        {/* Left Dark Navy Sidebar */}
        <Sidebar
          activeTab="Sales History"
          setActiveTab={(tab) => {
            if (tab === 'Dashboard') onNavigateToDashboard();
            else if (tab === 'Sale') onNavigateToPOS();
            else if (tab === 'Purchase') onNavigateToPurchase();
            else if (tab === 'Stock Management') onNavigateToNewItem();
            else if (tab === 'Total Stock') onNavigateToTotalStock();
            else if (tab === 'Daily Hisab') onOpenDailyHisab();
          }}
          branding={branding}
          sidebarBanner={sidebarBanner}
          onOpenSettings={onOpenSettings}
          onOpenDailyHisab={onOpenDailyHisab}
          onOpenSalesHistory={() => {}}
          onOpenStockModal={onNavigateToTotalStock}
          onOpenReportsModal={() => {}}
        />

        {/* Center Content (1300px) */}
        <div className="flex-1 h-[914px] overflow-y-auto p-5 space-y-4 bg-[#f0f4f8]">
          
          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Total Net Revenue</span>
                <span className="text-emerald-600 font-extrabold">Rs</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                Rs. {totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Based on active filters</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Completed Invoices</span>
                <ShoppingBag className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-purple-700 font-mono">
                {totalInvoices}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Total customer transactions</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Total Items Sold</span>
                <Package className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-sky-700 font-mono">
                {totalItemsSold.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Product quantities billed</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Average Bill Value</span>
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-teal-700 font-mono">
                Rs. {avgBillValue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Per completed sale ticket</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Payment Breakdown
              </div>
              <div className="text-xs space-y-0.5 font-medium">
                <div className="flex justify-between text-slate-700">
                  <span>Cash:</span>
                  <span className="font-bold font-mono">Rs. {cashRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Card:</span>
                  <span className="font-bold font-mono">Rs. {cardRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Credit:</span>
                  <span className="font-bold font-mono">Rs. {creditRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by invoice number, cashier, or item name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00b852] focus:ring-1 focus:ring-[#00b852]"
                />
              </div>

              {/* Date Filter Buttons */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                {(['All', 'Today', 'Yesterday', 'Last 7 Days', 'This Month'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDateFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dateFilter === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="h-9 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700"
              >
                <option value="All">All Payments</option>
                <option value="Cash">Cash Only</option>
                <option value="Card">Card Only</option>
                <option value="Credit">Credit / Udhar Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setDateFilter('All');
                  setPaymentFilter('All');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Sales History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                Sales Transaction Register ({filteredSales.length} records found)
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any eye icon to view and print individual thermal receipt
              </span>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-4">Invoice #</th>
                    <th className="py-2.5 px-4">Date & Time</th>
                    <th className="py-2.5 px-4">Cashier</th>
                    <th className="py-2.5 px-4 text-center">Items Qty</th>
                    <th className="py-2.5 px-4">Payment</th>
                    <th className="py-2.5 px-4 text-right">Net Amount</th>
                    <th className="py-2.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                        <p className="font-semibold text-xs">No sales matching active criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <tr key={sale.invoiceNo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                          {sale.invoiceNo}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {sale.date} <span className="text-slate-400 font-mono text-[11px]">{sale.time}</span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 font-medium">
                          {sale.cashier}
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                          {sale.totalQuantity}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            sale.paymentMethod === 'Cash' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : sale.paymentMethod === 'Card'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {sale.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-black font-mono text-slate-900">
                          Rs. {sale.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => onViewReceipt(sale)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#00b852] font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="View / Print Thermal Receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Total Displayed Invoices: {filteredSales.length}</span>
              <span className="font-mono text-emerald-700 text-sm">
                Total Revenue: Rs. {totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Status Bar */}
      <footer className="h-[34px] bg-[#061224] text-slate-400 px-6 flex items-center justify-between text-xs border-t border-slate-800 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00b852]"></span>
            <span className="text-slate-300 font-medium">Sales Ledger Database: Synchronized</span>
          </div>
          <span>|</span>
          <span>Records Count: {salesHistory.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{branding.softwareName || 'WAQAS MART'} © 2026</span>
        </div>
      </footer>

    </div>
  );
};
