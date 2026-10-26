export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  barcode: string;
  stock: number;
  unit?: string;
  purchasePrice?: number;
  brand?: string;
  description?: string;
  reorderLevel?: number;
  tax?: number;
  supplier?: string;
  isActive?: boolean;
  trackStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface HeldBill {
  id: string;
  billNumber: string;
  date: string;
  time: string;
  timestamp: number;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  customerName?: string;
  paymentMethod: 'Cash' | 'Card' | 'Credit';
  notes?: string;
}

export interface CompletedSale {
  invoiceNo: string;
  date: string;
  time: string;
  timestamp: number;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'Credit';
  cashTendered?: number;
  changeAmount?: number;
  cashier: string;
}

export interface BrandingSettings {
  softwareName: string;
  tagline: string;
  headerLogoIcon: string;
  headerLogoUrl?: string;
  sidebarBadgeText: string;
  sidebarFooterName: string;
  deviceCode: string;
  storeAddress: string;
  storePhone: string;
  currency: string;
}

export interface SidebarBannerSettings {
  image: string;
  heading: string;
  pillText: string;
  fit: 'cover' | 'contain' | 'fill';
  isCustom: boolean;
}

export interface SaleBannerSettings {
  image: string;
  heading: string;
  subtitle: string;
  fit: 'cover' | 'contain' | 'fill';
  isCustom: boolean;
}

export type ActiveSidebarTab = 
  | 'Dashboard'
  | 'Sale' 
  | 'Purchase' 
  | 'Sales History' 
  | 'Sales Return' 
  | 'Purchase Orders' 
  | 'Stock Management'
  | 'Total Stock' 
  | 'Customers' 
  | 'Suppliers' 
  | 'Daily Hisab' 
  | 'Reports' 
  | 'CCTV Cameras' 
  | 'Google Search' 
  | 'Device Management';

export type PosMode = 'Sale' | 'Purchase' | 'Return Mode';
export type PaymentMethod = 'Cash' | 'Card' | 'Credit';

export interface Supplier {
  id: string;
  name: string;
  city?: string;
  phone?: string;
  balance: number;
}

export interface PurchaseItem {
  id: string;
  product: Product;
  quantity: number;
  purchaseCost: number;
  salePrice?: number;
  discount: number;
  tax: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  purchaseInvoiceNo: string;
  purchaseDate: string;
  supplierId: string;
  supplierName: string;
  supplierInvoiceNo: string;
  items: PurchaseItem[];
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Credit';
  remainingBalance: number;
  notes?: string;
  timestamp: number;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  barcode: string;
  type: 'Add' | 'Reduce' | 'Set';
  changeQty: number;
  previousQty: number;
  newQty: number;
  reason: string;
  user: string;
  timestamp: number;
  dateStr: string;
}
