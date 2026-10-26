import { Product, CartItem, BrandingSettings, SidebarBannerSettings, SaleBannerSettings, HeldBill } from '../types/pos';

// Start with 0 products (blank slate as requested by user)
export const INITIAL_PRODUCTS: Product[] = [];

// Optional demo products that can be loaded on demand
export const SAMPLE_DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Coca Cola 500ml',
    price: 150,
    purchasePrice: 120,
    category: 'Beverages',
    image: '/products/coca_cola_can.jpg',
    barcode: '896400123456',
    stock: 0,
    unit: 'Piece',
    reorderLevel: 10,
    supplier: 'Nestle',
    brand: 'Coca-Cola',
    tax: 0,
    description: 'Refreshing Coca Cola 500ml.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-4',
    name: "Lay's Chips 50g",
    price: 60,
    purchasePrice: 38,
    category: 'Snacks',
    image: '/products/lays_chips.png',
    barcode: '896400654321',
    stock: 0,
    unit: 'Piece',
    reorderLevel: 15,
    supplier: 'PepsiCo',
    brand: "Lay's",
    tax: 0,
    description: 'Crispy salted potato chips 50g.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-3',
    name: 'Nestle Milk 1L',
    price: 120,
    purchasePrice: 90,
    category: 'Dairy',
    image: '/products/nestle_milk.png',
    barcode: '896400987654',
    stock: 0,
    unit: 'Piece',
    reorderLevel: 20,
    supplier: 'Nestle',
    brand: 'Nestle',
    tax: 0,
    description: 'Pure and fresh homogenized milk 1L.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-12',
    name: 'Tomato 1kg',
    price: 150,
    purchasePrice: 80,
    category: 'Vegetables',
    image: '/products/tomato.png',
    barcode: '896400111222',
    stock: 0,
    unit: 'Kg',
    reorderLevel: 10,
    supplier: 'Local',
    brand: 'Farm Fresh',
    tax: 0,
    description: 'Fresh organic farm tomatoes.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-7',
    name: 'Sugar 1kg',
    price: 140,
    purchasePrice: 70,
    category: 'Groceries',
    image: '/products/sugar.png',
    barcode: '896400333444',
    stock: 0,
    unit: 'Kg',
    reorderLevel: 25,
    supplier: 'Local',
    brand: 'Pure Sugar',
    tax: 0,
    description: 'Refined crystal white sugar 1kg.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-8',
    name: 'Flour 10kg',
    price: 1250,
    purchasePrice: 950,
    category: 'Groceries',
    image: '/products/flour.png',
    barcode: '896400555666',
    stock: 0,
    unit: 'Pack',
    reorderLevel: 10,
    supplier: 'Local',
    brand: 'Ashrafi',
    tax: 0,
    description: 'Premium whole wheat chakki flour 10kg.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-16',
    name: 'Biscuits 200g',
    price: 150,
    purchasePrice: 95,
    category: 'Snacks',
    image: '/products/marie_biscuit.png',
    barcode: '896400777888',
    stock: 0,
    unit: 'Pack',
    reorderLevel: 15,
    supplier: 'Britannia',
    brand: 'Britannia',
    tax: 0,
    description: 'Crispy sweet tea biscuits 200g.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-18',
    name: 'Cooking Oil 1L',
    price: 580,
    purchasePrice: 420,
    category: 'Cooking Oil',
    image: '/products/cooking_oil_1l.png',
    barcode: '896400999000',
    stock: 0,
    unit: 'Piece',
    reorderLevel: 10,
    supplier: 'Mezan',
    brand: 'Mezan',
    tax: 0,
    description: 'Pure refined edible cooking oil 1L.',
    isActive: true,
    trackStock: true
  },
  {
    id: 'prod-2',
    name: 'Pepsi 500ml',
    price: 120,
    purchasePrice: 95,
    category: 'Beverages',
    image: '/products/pepsi.png',
    barcode: '896400102',
    stock: 0,
    unit: '500ml',
    supplier: 'PepsiCo',
    brand: 'Pepsi'
  },
  {
    id: 'prod-5',
    name: 'Lays Classic 50g',
    price: 50,
    purchasePrice: 38,
    category: 'Snacks',
    image: '/products/lays_classic.png',
    barcode: '896400105',
    stock: 0,
    unit: '50g',
    supplier: 'PepsiCo',
    brand: "Lay's"
  },
  {
    id: 'prod-6',
    name: 'Dalda Cooking Oil 5L',
    price: 2850,
    purchasePrice: 2300,
    category: 'Groceries',
    image: '/products/dalda_oil.png',
    barcode: '896400106',
    stock: 0,
    unit: '5L',
    supplier: 'Habib Oil Mills',
    brand: 'Dalda'
  },
  {
    id: 'prod-9',
    name: 'Nestle Yogurt 1kg',
    price: 350,
    purchasePrice: 280,
    category: 'Dairy',
    image: '/products/nestle_yogurt.png',
    barcode: '896400109',
    stock: 0,
    unit: '1kg',
    supplier: 'Nestle',
    brand: 'Nestle'
  },
  {
    id: 'prod-10',
    name: 'Tata Tea 250g',
    price: 450,
    purchasePrice: 360,
    category: 'Beverages',
    image: '/products/tata_tea.png',
    barcode: '896400110',
    stock: 0,
    unit: '250g',
    supplier: 'Unilever Pakistan',
    brand: 'Tata'
  },
  {
    id: 'prod-11',
    name: 'Onion 1kg',
    price: 120,
    purchasePrice: 80,
    category: 'Vegetables',
    image: '/products/onion.png',
    barcode: '896400111',
    stock: 0,
    unit: '1kg',
    supplier: 'Local',
    brand: 'Farm Fresh'
  },
  {
    id: 'prod-13',
    name: 'Potato 1kg',
    price: 100,
    purchasePrice: 65,
    category: 'Vegetables',
    image: '/products/potato.png',
    barcode: '896400113',
    stock: 0,
    unit: '1kg',
    supplier: 'Local',
    brand: 'Farm Fresh'
  },
  {
    id: 'prod-14',
    name: 'Banana 1kg',
    price: 180,
    purchasePrice: 120,
    category: 'Fresh Fruits',
    image: '/products/banana.png',
    barcode: '896400114',
    stock: 0,
    unit: '1kg',
    supplier: 'Local',
    brand: 'Farm Fresh'
  },
  {
    id: 'prod-15',
    name: 'Eggs (Dozen)',
    price: 300,
    purchasePrice: 240,
    category: 'Dairy',
    image: '/products/eggs.png',
    barcode: '896400115',
    stock: 0,
    unit: 'Dozen',
    supplier: 'Local',
    brand: 'Poultry Farm'
  },
  {
    id: 'prod-17',
    name: 'Tapal Danedar Tea',
    price: 500,
    purchasePrice: 420,
    category: 'Beverages',
    image: '/products/tapal_tea.png',
    barcode: '896400999888',
    stock: 0,
    unit: '400g',
    supplier: 'Unilever Pakistan',
    brand: 'Tapal'
  }
];

export const INITIAL_SUPPLIERS: import('../types/pos').Supplier[] = [
  { id: 'sup-1', name: 'M. Traders (Karachi)', city: 'Karachi', phone: '0321-9876543', balance: 0 },
  { id: 'sup-2', name: 'Al-Madina Wholesale', city: 'Lahore', phone: '0300-1122334', balance: 0 },
  { id: 'sup-3', name: 'Nestle Distribution', city: 'Islamabad', phone: '0333-5566778', balance: 0 },
  { id: 'sup-4', name: 'Unilever Pakistan', city: 'Karachi', phone: '0312-3344556', balance: 0 },
  { id: 'sup-5', name: 'Habib Oil Mills', city: 'Karachi', phone: '0345-7788990', balance: 0 },
];

export const INITIAL_CART: CartItem[] = []; // Initial sale cart empty / 0

export const DEFAULT_BRANDING: BrandingSettings = {
  softwareName: 'WAQAS MART',
  tagline: 'Quality Products • Better Life',
  headerLogoIcon: 'cart',
  sidebarBadgeText: 'WAQAS MART',
  sidebarFooterName: 'WAQAS MART',
  deviceCode: 'WM-001',
  storeAddress: 'Shop # 12, Main Market, Lahore',
  storePhone: '0300-1234567',
  currency: 'Rs.'
};

export const DEFAULT_SIDEBAR_BANNER: SidebarBannerSettings = {
  image: '/products/sidebar_banner_art.png',
  heading: 'Small Steps\nBig Dreams',
  pillText: 'WAQAS MART',
  fit: 'cover',
  isCustom: false
};

export const DEFAULT_SALE_BANNER: SaleBannerSettings = {
  image: '/products/fresh_basket.png',
  heading: 'Fresh Products\nEveryday',
  subtitle: 'Best Quality • Lowest Prices',
  fit: 'contain',
  isCustom: false
};

export const INITIAL_HELD_BILLS: HeldBill[] = [];

export const INITIAL_PURCHASE_ITEMS: import('../types/pos').PurchaseItem[] = [];
