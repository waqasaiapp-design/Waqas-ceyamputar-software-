/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { ProductCatalog } from './components/ProductCatalog';
import { CurrentSaleCart } from './components/CurrentSaleCart';
import { StatusBar } from './components/StatusBar';

// Main Application Pages
import { PurchaseEntry } from './components/PurchaseEntry';
import { NewItemPage } from './components/NewItemPage';
import { TotalStockPage } from './components/TotalStockPage';
import { DashboardPage } from './components/DashboardPage';
import { SalesSummaryPage } from './components/SalesSummaryPage';

// Modals
import { SettingsModal } from './components/modals/SettingsModal';
import { HeldBillsModal } from './components/modals/HeldBillsModal';
import { BarcodeScannerModal } from './components/modals/BarcodeScannerModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { SalesHistoryModal } from './components/modals/SalesHistoryModal';
import { NewItemModal } from './components/modals/NewItemModal';
import { DailyHisabModal } from './components/modals/DailyHisabModal';
import { BackupModal } from './components/modals/BackupModal';
import { CustomersModal } from './components/modals/CustomersModal';
import { SuppliersModal } from './components/modals/SuppliersModal';
import { CctvModal } from './components/modals/CctvModal';
import { DeviceManagementModal } from './components/modals/DeviceManagementModal';
import { PwaInstallModal } from './components/modals/PwaInstallModal';

import { 
  Product, 
  CartItem, 
  HeldBill, 
  CompletedSale, 
  BrandingSettings, 
  SidebarBannerSettings, 
  SaleBannerSettings, 
  ActiveSidebarTab, 
  PosMode, 
  PaymentMethod 
} from './types/pos';

import { 
  SAMPLE_DEMO_PRODUCTS,
  DEFAULT_BRANDING, 
  DEFAULT_SIDEBAR_BANNER, 
  DEFAULT_SALE_BANNER 
} from './data/posData';

export type CurrentViewMode = 'pos' | 'dashboard' | 'purchase' | 'new-item' | 'total-stock' | 'sales-summary';

export default function App() {
  // Screen width detection for responsive auto-fit
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [mobileView, setMobileView] = useState<'fit' | 'products' | 'cart' | 'sidebar'>('fit');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Data States (Safely persistent across reloads - NEVER automatically wiped)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('waqas_pos_products_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('waqas_pos_cart_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [heldBills, setHeldBills] = useState<HeldBill[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('waqas_pos_held_bills_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [salesHistory, setSalesHistory] = useState<CompletedSale[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('waqas_pos_sales_history_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('waqas_pos_branding_v2') : null;
    return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
  });

  const [sidebarBanner, setSidebarBanner] = useState<SidebarBannerSettings>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('waqas_pos_sidebar_banner_v2') : null;
    return saved ? JSON.parse(saved) : DEFAULT_SIDEBAR_BANNER;
  });

  const [saleBanner, setSaleBanner] = useState<SaleBannerSettings>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('waqas_pos_sale_banner_v2') : null;
    return saved ? JSON.parse(saved) : DEFAULT_SALE_BANNER;
  });

  // 2. Active View & Mode States
  const [currentView, setCurrentView] = useState<CurrentViewMode>('pos');
  const [activeSidebarTab, setActiveSidebarTab] = useState<ActiveSidebarTab>('Sale');
  const [posMode, setPosMode] = useState<PosMode>('Sale');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastCompletedSale, setLastCompletedSale] = useState<CompletedSale | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3. PWA Installation Event & Prompt
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isPwaInstallModalOpen, setIsPwaInstallModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleTriggerInstall = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('WAQAS MART installed successfully on desktop!');
        }
        setDeferredInstallPrompt(null);
      });
    } else {
      setIsPwaInstallModalOpen(true);
    }
  };

  // Update stock when a purchase invoice is saved
  const handleUpdateStockFromPurchase = (
    productId: string,
    addedQty: number,
    newPurchaseCost?: number,
    newSalePrice?: number
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: p.stock + addedQty,
            purchasePrice: newPurchaseCost !== undefined ? newPurchaseCost : p.purchasePrice,
            price: newSalePrice ? newSalePrice : p.price,
          };
        }
        return p;
      })
    );
  };

  // Add new product from New Item Page
  const handleAddNewProduct = (newProd: Product): boolean => {
    const duplicate = products.find(
      (p) => p.barcode.trim().toLowerCase() === newProd.barcode.trim().toLowerCase()
    );
    if (duplicate) {
      showToast(`Error: Barcode already assigned to "${duplicate.name}"`);
      return false;
    }

    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('waqas_pos_products_v2', JSON.stringify(updated));
    return true;
  };

  // Update existing product from Total Stock / Edit Modal
  const handleUpdateExistingProduct = (updatedProd: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      localStorage.setItem('waqas_pos_products_v2', JSON.stringify(next));
      return next;
    });
  };

  // 4. Modals Visibility States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'branding' | 'sidebar' | 'banner' | 'desktop'>('branding');
  const [isHeldBillsOpen, setIsHeldBillsOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isSalesHistoryOpen, setIsSalesHistoryOpen] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isDailyHisabOpen, setIsDailyHisabOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  const [isSuppliersModalOpen, setIsSuppliersModalOpen] = useState(false);
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);
  const [isDeviceManagementModalOpen, setIsDeviceManagementModalOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('waqas_pos_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('waqas_pos_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('waqas_pos_held_bills_v2', JSON.stringify(heldBills));
  }, [heldBills]);

  useEffect(() => {
    localStorage.setItem('waqas_pos_sales_history_v2', JSON.stringify(salesHistory));
  }, [salesHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore Database from JSON file
  const handleRestoreBackupData = (importedData: any) => {
    if (importedData.products && Array.isArray(importedData.products)) {
      setProducts(importedData.products);
      localStorage.setItem('waqas_pos_products_v2', JSON.stringify(importedData.products));
    }
    if (importedData.salesHistory && Array.isArray(importedData.salesHistory)) {
      setSalesHistory(importedData.salesHistory);
      localStorage.setItem('waqas_pos_sales_history_v2', JSON.stringify(importedData.salesHistory));
    }
    if (importedData.heldBills && Array.isArray(importedData.heldBills)) {
      setHeldBills(importedData.heldBills);
      localStorage.setItem('waqas_pos_held_bills_v2', JSON.stringify(importedData.heldBills));
    }
    if (importedData.branding) {
      setBranding(importedData.branding);
      localStorage.setItem('waqas_pos_branding_v2', JSON.stringify(importedData.branding));
    }
    if (importedData.sidebarBanner) {
      setSidebarBanner(importedData.sidebarBanner);
      localStorage.setItem('waqas_pos_sidebar_banner_v2', JSON.stringify(importedData.sidebarBanner));
    }
    if (importedData.saleBanner) {
      setSaleBanner(importedData.saleBanner);
      localStorage.setItem('waqas_pos_sale_banner_v2', JSON.stringify(importedData.saleBanner));
    }
    if (importedData.purchases) {
      localStorage.setItem('waqas_purchases_v2', JSON.stringify(importedData.purchases));
    }
    if (importedData.suppliers) {
      localStorage.setItem('waqas_suppliers_v2', JSON.stringify(importedData.suppliers));
    }
    if (importedData.adjustments) {
      localStorage.setItem('waqas_stock_adjustments_v2', JSON.stringify(importedData.adjustments));
    }
  };

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to sale cart`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Clear all items from current sale cart?')) {
      setCart([]);
      showToast('Cart cleared');
    }
  };

  // HOLD BILL / PARK SALE
  const handleHoldBill = () => {
    if (cart.length === 0) return;

    const nextNumber = 101 + heldBills.length;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newHeldBill: HeldBill = {
      id: `hb-${Date.now()}`,
      billNumber: `HB-${nextNumber}`,
      date: dateStr,
      time: timeStr,
      timestamp: Date.now(),
      items: [...cart],
      totalQuantity: totalQty,
      totalAmount,
      customerName: `Customer #${nextNumber}`,
      paymentMethod,
    };

    setHeldBills((prev) => [newHeldBill, ...prev]);
    setCart([]);
    showToast(`Sale parked as Held Bill ${newHeldBill.billNumber}!`);
  };

  const handleResumeBill = (bill: HeldBill) => {
    if (cart.length > 0) {
      if (!window.confirm('Current cart has items. Replace cart with held bill?')) {
        return;
      }
    }
    setCart([...bill.items]);
    setPaymentMethod(bill.paymentMethod);
    setHeldBills((prev) => prev.filter((b) => b.id !== bill.id));
    showToast(`Resumed Held Bill ${bill.billNumber} into cart!`);
    if (mobileView !== 'fit') {
      setMobileView('cart');
    }
  };

  const handleCancelHeldBill = (billId: string) => {
    setHeldBills((prev) => prev.filter((b) => b.id !== billId));
    showToast('Held bill cancelled');
  };

  // CHECKOUT SALE COMPLETION
  const handleSaleCompleted = (sale: CompletedSale) => {
    // 1. Deduct stock from products
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = sale.items.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    // 2. Add to sales history
    setSalesHistory((prev) => [sale, ...prev]);

    // 3. Set last completed sale for receipt preview
    setLastCompletedSale(sale);

    // 4. Clear current cart
    setCart([]);

    // 5. Open thermal receipt modal
    setIsReceiptOpen(true);
    showToast(`Checkout complete! Invoice ${sale.invoiceNo}`);
  };

  // Barcode & Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = products.find(
      (p) =>
        p.barcode === searchQuery.trim() ||
        p.id === searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched) {
      handleAddToCart(matched);
      setSearchQuery('');
    } else {
      showToast(`No product found for "${searchQuery}"`);
    }
  };

  // Quick Action Modals
  const handleOpenSettingsTab = (tab: 'branding' | 'sidebar' | 'banner' | 'desktop' = 'branding') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  const handleResetStockToZero = () => {
    const updated = products.map((p) => ({ ...p, stock: 0 }));
    setProducts(updated);
    localStorage.setItem('waqas_pos_products_v2', JSON.stringify(updated));
    showToast('تمام پراڈکٹس کا اسٹاک 0 کر دیا گیا ہے (All Stock Set to 0)');
  };

  const handleResetHisabToZero = () => {
    setSalesHistory([]);
    setCart([]);
    setHeldBills([]);
    localStorage.removeItem('waqas_pos_sales_history_v2');
    localStorage.removeItem('waqas_pos_cart_v2');
    localStorage.removeItem('waqas_pos_held_bills_v2');
    localStorage.removeItem('waqas_purchases_v2');
    localStorage.removeItem('waqas_current_purchase_items_v2');
    localStorage.removeItem('waqas_stock_adjustments_v2');
    const savedSuppliers = localStorage.getItem('waqas_suppliers_v2');
    if (savedSuppliers) {
      try {
        const sups = JSON.parse(savedSuppliers);
        const zeroed = sups.map((s: any) => ({ ...s, balance: 0 }));
        localStorage.setItem('waqas_suppliers_v2', JSON.stringify(zeroed));
      } catch (e) {}
    }
    showToast('سیلز اور یومیہ حساب 0 کر دیا گیا ہے (All Accounts & Hisab Set to 0)');
  };

  const handleRemoveAllProducts = () => {
    setProducts([]);
    setCart([]);
    localStorage.setItem('waqas_pos_products_v2', JSON.stringify([]));
    localStorage.removeItem('waqas_pos_cart_v2');
    showToast('تمام آئٹمز ریمو کر دیے گئے ہیں (All Items Removed: 0 Products)');
  };

  const handleLoadDemoProducts = () => {
    setProducts(SAMPLE_DEMO_PRODUCTS);
    localStorage.setItem('waqas_pos_products_v2', JSON.stringify(SAMPLE_DEMO_PRODUCTS));
    showToast('ڈیمو پروڈکٹس کامیابی سے لوڈ ہو گئیں (Sample Demo Products Loaded)');
  };

  const handleResetFactoryData = () => {
    setProducts([]);
    setCart([]);
    setHeldBills([]);
    setSalesHistory([]);
    setBranding(DEFAULT_BRANDING);
    setSidebarBanner(DEFAULT_SIDEBAR_BANNER);
    setSaleBanner(DEFAULT_SALE_BANNER);
    localStorage.clear();
    showToast('سافٹ ویئر مکمل ری سیٹ ہو گیا (0 Items, 0 Hisab)');
  };

  // Keyboard shortcut listener for desktop POS speed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setIsScannerOpen(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleHoldBill();
      } else if (e.key === 'F12' && cart.length > 0) {
        e.preventDefault();
        setIsCheckoutOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, heldBills]);

  const [zoomMode, setZoomMode] = useState<'fit' | '100%'>('fit');
  const [zoomLevel, setZoomLevel] = useState<number | null>(null);

  const desktopWidth = 1536;
  const desktopHeight = 1024;
  const autoScale = Math.min(1, (windowWidth || 1536) / desktopWidth);
  const effectiveScale = zoomLevel !== null ? zoomLevel : (zoomMode === 'fit' ? autoScale : 1);

  // The Pure Complete Desktop POS Component matching 100% of reference screenshot
  const renderFullDesktopPOS = () => (
    <div 
      style={{ width: `${desktopWidth}px`, height: `${desktopHeight}px` }} 
      className="flex flex-col bg-[#f0f4f8] text-slate-800 font-sans shadow-2xl shrink-0 select-none overflow-hidden"
    >
      {/* 1. Top Windows Header Bar (76px) */}
      <TopHeader
        branding={branding}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenSettings={handleOpenSettingsTab}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. Main Workspace (Sidebar 236px + Catalog 885px + Cart 415px = 1536px, height 914px) */}
      <div className="w-[1536px] h-[914px] flex overflow-hidden">
        {/* Left Dark Navy Sidebar */}
        <Sidebar
          activeTab={activeSidebarTab}
          setActiveTab={(tab) => {
            setActiveSidebarTab(tab);
            if (tab === 'Dashboard') {
              setCurrentView('dashboard');
            } else if (tab === 'Purchase') {
              setCurrentView('purchase');
              setPosMode('Purchase');
            } else if (tab === 'Sale') {
              setCurrentView('pos');
              setPosMode('Sale');
            } else if (tab === 'Stock Management') {
              setCurrentView('new-item');
            } else if (tab === 'Total Stock') {
              setCurrentView('total-stock');
            } else if (tab === 'Sales History' || tab === 'Reports') {
              setCurrentView('sales-summary');
            }
          }}
          branding={branding}
          sidebarBanner={sidebarBanner}
          onOpenSettings={handleOpenSettingsTab}
          onOpenDailyHisab={() => setIsDailyHisabOpen(true)}
          onOpenSalesHistory={() => setCurrentView('sales-summary')}
          onOpenStockModal={() => {
            setCurrentView('total-stock');
            setActiveSidebarTab('Total Stock');
          }}
          onOpenReportsModal={() => setCurrentView('sales-summary')}
          onOpenCustomers={() => setIsCustomersModalOpen(true)}
          onOpenSuppliers={() => setIsSuppliersModalOpen(true)}
          onOpenCctv={() => setIsCctvModalOpen(true)}
          onOpenDeviceManagement={() => setIsDeviceManagementModalOpen(true)}
          onNavigateToDashboard={() => {
            setCurrentView('dashboard');
            setActiveSidebarTab('Dashboard');
          }}
        />

        {/* Center: Mode Tabs, Categories, Product Cards & Bottom Banner */}
        <ProductCatalog
          products={products}
          onAddToCart={handleAddToCart}
          posMode={posMode}
          setPosMode={(mode) => {
            setPosMode(mode);
            if (mode === 'Purchase') {
              setCurrentView('purchase');
              setActiveSidebarTab('Purchase');
            } else if (mode === 'Sale') {
              setCurrentView('pos');
              setActiveSidebarTab('Sale');
            }
          }}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          saleBanner={saleBanner}
          onOpenSettings={handleOpenSettingsTab}
          onOpenNewItem={() => {
            setCurrentView('new-item');
            setActiveSidebarTab('Stock Management');
          }}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenDailyHisab={() => setIsDailyHisabOpen(true)}
          onOpenReports={() => setCurrentView('sales-summary')}
        />

        {/* Right: Current Sale Cart with Hold Bill & Checkout */}
        <CurrentSaleCart
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          heldBills={heldBills}
          onHoldBill={handleHoldBill}
          onOpenHeldBills={() => setIsHeldBillsOpen(true)}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenReceiptModal={() => {
            if (lastCompletedSale) {
              setIsReceiptOpen(true);
            } else if (cart.length > 0) {
              setIsCheckoutOpen(true);
            } else {
              showToast('No active or recent receipt to view');
            }
          }}
          onPrintThermal={() => {
            if (lastCompletedSale) {
              setIsReceiptOpen(true);
            } else if (cart.length > 0) {
              setIsCheckoutOpen(true);
            } else {
              showToast('Add items and checkout to print thermal receipt');
            }
          }}
          onOpenSalesHistory={() => setCurrentView('sales-summary')}
        />
      </div>

      {/* 3. Bottom Desktop Status Bar (34px) */}
      <StatusBar deviceCode={branding.deviceCode} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071120] flex flex-col items-center justify-start overflow-x-auto relative">
      
      {/* Top Floating Control Bar for Web App Navigation, Modules, Backup, PWA Install & Zoom */}
      <aside aria-label="POS Display & View Controls" className="sticky top-0 z-40 w-full bg-[#0a182c]/95 backdrop-blur-md border-b border-slate-700/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg select-none">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00b852] animate-pulse"></span>
            <span className="font-extrabold text-white text-xs tracking-wide uppercase">
              {branding.softwareName || 'WAQAS MART'}
            </span>
          </div>

          {/* Module Switcher Tabs: Sale POS <-> Dashboard <-> Purchase <-> New Item <-> Total Stock <-> Sales Summary */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 overflow-x-auto max-w-[70vw]">
            <button
              onClick={() => {
                setCurrentView('pos');
                setActiveSidebarTab('Sale');
                setPosMode('Sale');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentView === 'pos'
                  ? 'bg-[#00b852] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>🛒</span>
              <span>Sale POS</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('dashboard');
                setActiveSidebarTab('Dashboard');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentView === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('purchase');
                setActiveSidebarTab('Purchase');
                setPosMode('Purchase');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentView === 'purchase'
                  ? 'bg-[#0284c7] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>🚚</span>
              <span>Purchase Entry</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('new-item');
                setActiveSidebarTab('Stock Management');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentView === 'new-item'
                  ? 'bg-[#00a852] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>📦</span>
              <span>New Item</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('total-stock');
                setActiveSidebarTab('Total Stock');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentView === 'total-stock'
                  ? 'bg-[#00a852] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>📈</span>
              <span>Total Stock</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('sales-summary');
                setActiveSidebarTab('Sales History');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                currentView === 'sales-summary'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>📑</span>
              <span>Sale Summary</span>
            </button>

            <button
              onClick={() => setIsDailyHisabOpen(true)}
              className="px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 text-amber-300 hover:text-white hover:bg-slate-700 shrink-0"
              title="Daily Cash Register & Drawer Balance"
            >
              <span>💵</span>
              <span>Daily Hisab</span>
            </button>

            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 text-sky-300 hover:text-white hover:bg-slate-700 shrink-0"
              title="Export or Restore JSON Database Backup"
            >
              <span>💾</span>
              <span>Backup & Sync</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {/* PWA Install Button */}
          <button
            onClick={handleTriggerInstall}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
            title="Install WAQAS MART on your Windows Desktop / Taskbar"
          >
            <span>📲</span>
            <span>Install Web App</span>
          </button>

          {/* Screen Fit & Zoom Controls */}
          <button
            onClick={() => { setZoomMode('fit'); setZoomLevel(null); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              zoomMode === 'fit' && zoomLevel === null
                ? 'bg-[#00b852] text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Auto fit screen size"
          >
            <span>🖥️</span>
            <span>Fit Screen</span>
          </button>

          <button
            onClick={() => { setZoomMode('100%'); setZoomLevel(1); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              effectiveScale === 1 && zoomLevel === 1
                ? 'bg-[#00b852] text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="100% Native Desktop Size"
          >
            <span>🔍</span>
            <span>100% View</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.25, Number(((prev || effectiveScale) - 0.1).toFixed(2))))}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-sm cursor-pointer"
              title="Zoom Out"
            >
              −
            </button>
            <span className="text-[11px] font-mono px-1.5 text-emerald-400 font-bold min-w-[36px] text-center">
              {Math.round(effectiveScale * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(2, Number(((prev || effectiveScale) + 0.1).toFixed(2))))}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-sm cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
          </div>

          <button
            onClick={() => handleOpenSettingsTab('branding')}
            className="px-2.5 py-1 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 border border-emerald-600/50 flex items-center gap-1 font-semibold text-xs cursor-pointer transition-colors"
            title="Settings & Branding"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Desktop Stage: Scaled with zero distortion or cutoff */}
      <main className="w-full flex-1 flex justify-center items-start overflow-auto p-1 sm:p-3">
        <div 
          style={{
            width: `${Math.ceil(desktopWidth * effectiveScale)}px`,
            height: `${Math.ceil(desktopHeight * effectiveScale)}px`,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            borderRadius: effectiveScale < 1 ? '8px' : '0px'
          }}
        >
          <div 
            style={{
              width: `${desktopWidth}px`,
              height: `${desktopHeight}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: '0 0',
            }}
          >
            {currentView === 'dashboard' ? (
              <DashboardPage
                products={products}
                salesHistory={salesHistory}
                branding={branding}
                sidebarBanner={sidebarBanner}
                onNavigateToPOS={() => {
                  setCurrentView('pos');
                  setActiveSidebarTab('Sale');
                  setPosMode('Sale');
                }}
                onNavigateToPurchase={() => {
                  setCurrentView('purchase');
                  setActiveSidebarTab('Purchase');
                  setPosMode('Purchase');
                }}
                onNavigateToNewItem={() => {
                  setCurrentView('new-item');
                  setActiveSidebarTab('Stock Management');
                }}
                onNavigateToTotalStock={() => {
                  setCurrentView('total-stock');
                  setActiveSidebarTab('Total Stock');
                }}
                onNavigateToSalesSummary={() => {
                  setCurrentView('sales-summary');
                  setActiveSidebarTab('Sales History');
                }}
                onOpenDailyHisab={() => setIsDailyHisabOpen(true)}
                onOpenSettings={handleOpenSettingsTab}
                onViewReceipt={(sale) => {
                  setLastCompletedSale(sale);
                  setIsReceiptOpen(true);
                }}
                onExportBackup={() => setIsBackupModalOpen(true)}
                showToast={showToast}
              />
            ) : currentView === 'sales-summary' ? (
              <SalesSummaryPage
                salesHistory={salesHistory}
                branding={branding}
                sidebarBanner={sidebarBanner}
                onNavigateToPOS={() => {
                  setCurrentView('pos');
                  setActiveSidebarTab('Sale');
                  setPosMode('Sale');
                }}
                onNavigateToDashboard={() => {
                  setCurrentView('dashboard');
                  setActiveSidebarTab('Dashboard');
                }}
                onNavigateToPurchase={() => {
                  setCurrentView('purchase');
                  setActiveSidebarTab('Purchase');
                  setPosMode('Purchase');
                }}
                onNavigateToNewItem={() => {
                  setCurrentView('new-item');
                  setActiveSidebarTab('Stock Management');
                }}
                onNavigateToTotalStock={() => {
                  setCurrentView('total-stock');
                  setActiveSidebarTab('Total Stock');
                }}
                onOpenDailyHisab={() => setIsDailyHisabOpen(true)}
                onOpenSettings={handleOpenSettingsTab}
                onViewReceipt={(sale) => {
                  setLastCompletedSale(sale);
                  setIsReceiptOpen(true);
                }}
                showToast={showToast}
              />
            ) : currentView === 'purchase' ? (
              <PurchaseEntry
                products={products}
                onUpdateStock={handleUpdateStockFromPurchase}
                branding={branding}
                onNavigateToPOS={() => {
                  setCurrentView('pos');
                  setActiveSidebarTab('Sale');
                  setPosMode('Sale');
                }}
                onOpenSettings={handleOpenSettingsTab}
                onOpenStockModal={() => {
                  setCurrentView('total-stock');
                  setActiveSidebarTab('Total Stock');
                }}
                showToast={showToast}
              />
            ) : currentView === 'new-item' ? (
              <NewItemPage
                products={products}
                onAddProduct={handleAddNewProduct}
                branding={branding}
                sidebarBanner={sidebarBanner}
                onNavigateToPOS={() => {
                  setCurrentView('pos');
                  setActiveSidebarTab('Sale');
                  setPosMode('Sale');
                }}
                onNavigateToPurchase={() => {
                  setCurrentView('purchase');
                  setActiveSidebarTab('Purchase');
                  setPosMode('Purchase');
                }}
                onNavigateToTotalStock={() => {
                  setCurrentView('total-stock');
                  setActiveSidebarTab('Total Stock');
                }}
                onOpenSettings={handleOpenSettingsTab}
                onOpenDailyHisab={() => setIsDailyHisabOpen(true)}
                onOpenSalesHistory={() => {
                  setCurrentView('sales-summary');
                  setActiveSidebarTab('Sales History');
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
                showToast={showToast}
              />
            ) : currentView === 'total-stock' ? (
              <TotalStockPage
                products={products}
                onUpdateProduct={handleUpdateExistingProduct}
                onNavigateToPOS={() => {
                  setCurrentView('pos');
                  setActiveSidebarTab('Sale');
                  setPosMode('Sale');
                }}
                onNavigateToPurchase={() => {
                  setCurrentView('purchase');
                  setActiveSidebarTab('Purchase');
                  setPosMode('Purchase');
                }}
                onNavigateToNewItem={() => {
                  setCurrentView('new-item');
                  setActiveSidebarTab('Stock Management');
                }}
                branding={branding}
                sidebarBanner={sidebarBanner}
                onOpenSettings={handleOpenSettingsTab}
                onOpenDailyHisab={() => setIsDailyHisabOpen(true)}
                onOpenSalesHistory={() => {
                  setCurrentView('sales-summary');
                  setActiveSidebarTab('Sales History');
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
                showToast={showToast}
                onResetStockToZero={handleResetStockToZero}
                onResetHisabToZero={handleResetHisabToZero}
              />
            ) : (
              renderFullDesktopPOS()
            )}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-semibold text-xs shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00b852]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsTab}
        branding={branding}
        setBranding={setBranding}
        sidebarBanner={sidebarBanner}
        setSidebarBanner={setSidebarBanner}
        saleBanner={saleBanner}
        setSaleBanner={setSaleBanner}
        onResetFactoryData={handleResetFactoryData}
        onResetStockToZero={handleResetStockToZero}
        onResetHisabToZero={handleResetHisabToZero}
        onRemoveAllProducts={handleRemoveAllProducts}
        onLoadDemoProducts={handleLoadDemoProducts}
      />

      {/* Held Bills Modal */}
      <HeldBillsModal
        isOpen={isHeldBillsOpen}
        onClose={() => setIsHeldBillsOpen(false)}
        heldBills={heldBills}
        onResumeBill={handleResumeBill}
        onCancelBill={handleCancelHeldBill}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        products={products}
        onProductScanned={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        branding={branding}
        onSaleCompleted={handleSaleCompleted}
      />

      {/* Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={lastCompletedSale}
        branding={branding}
      />

      {/* Sales History Modal */}
      <SalesHistoryModal
        isOpen={isSalesHistoryOpen}
        onClose={() => setIsSalesHistoryOpen(false)}
        sales={salesHistory}
        onReprintReceipt={(sale) => {
          setLastCompletedSale(sale);
          setIsReceiptOpen(true);
        }}
      />

      {/* Add New Item Modal */}
      <NewItemModal
        isOpen={isNewItemOpen}
        onClose={() => setIsNewItemOpen(false)}
        onAddItem={(newProd) => {
          setProducts((prev) => [newProd, ...prev]);
          handleAddToCart(newProd);
        }}
      />

      {/* Daily Hisab Cash Register Modal */}
      <DailyHisabModal
        isOpen={isDailyHisabOpen}
        onClose={() => setIsDailyHisabOpen(false)}
        sales={salesHistory}
        onResetHisab={handleResetHisabToZero}
      />

      {/* Backup & Cross-Computer Sync Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        products={products}
        salesHistory={salesHistory}
        heldBills={heldBills}
        branding={branding}
        sidebarBanner={sidebarBanner}
        saleBanner={saleBanner}
        onRestoreData={handleRestoreBackupData}
        showToast={showToast}
      />

      {/* Customers Ledger Modal */}
      <CustomersModal
        isOpen={isCustomersModalOpen}
        onClose={() => setIsCustomersModalOpen(false)}
        showToast={showToast}
      />

      {/* Suppliers Directory Modal */}
      <SuppliersModal
        isOpen={isSuppliersModalOpen}
        onClose={() => setIsSuppliersModalOpen(false)}
        showToast={showToast}
      />

      {/* CCTV Security Camera Modal */}
      <CctvModal
        isOpen={isCctvModalOpen}
        onClose={() => setIsCctvModalOpen(false)}
      />

      {/* Device Management Modal */}
      <DeviceManagementModal
        isOpen={isDeviceManagementModalOpen}
        onClose={() => setIsDeviceManagementModalOpen(false)}
        branding={branding}
        showToast={showToast}
      />

      {/* PWA Install Instructions Modal */}
      <PwaInstallModal
        isOpen={isPwaInstallModalOpen}
        onClose={() => setIsPwaInstallModalOpen(false)}
        onTriggerInstallPrompt={handleTriggerInstall}
        canInstallDirectly={!!deferredInstallPrompt}
      />

    </div>
  );
}
