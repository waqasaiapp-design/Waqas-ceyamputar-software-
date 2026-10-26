import React, { useState } from 'react';
import { 
  Store, 
  BookOpen, 
  Kanban, 
  Calculator, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  Check, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  MessageSquare, 
  Share2, 
  ArrowRight, 
  ArrowLeft,
  X,
  TrendingUp,
  Receipt,
  UserCheck,
  CreditCard,
  ShieldCheck,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  LanguageMode, 
  ScriptStyle, 
  ProductItem, 
  CartItem, 
  Invoice, 
  KhataParty, 
  KhataTransaction, 
  TaskItem 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_KHATA_PARTIES, 
  INITIAL_KHATA_TRANSACTIONS, 
  INITIAL_TASKS 
} from '../data/softwareCategories';

interface LiveSoftwareDemosProps {
  language: LanguageMode;
  scriptStyle: ScriptStyle;
  onRequestCustomSoftware: () => void;
}

export const LiveSoftwareDemos: React.FC<LiveSoftwareDemosProps> = ({
  language,
  scriptStyle,
  onRequestCustomSoftware,
}) => {
  const isUrdu = language === 'urdu';
  const fontClass = scriptStyle === 'nastaliq' ? 'font-nastaliq' : 'font-naskh';

  // Sub-tab selection for the 4 working softwares
  const [activeDemo, setActiveDemo] = useState<'pos' | 'khata' | 'kanban' | 'calculator'>('pos');

  // --- STATE 1: POS SYSTEM ---
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[1], quantity: 1 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState('عام صارف (Cash Customer)');
  const [customerPhone, setCustomerPhone] = useState('0300-0000000');
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'udhar'>('cash');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<Invoice | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(250);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdCategory, setNewProdCategory] = useState('جنرل آئٹمز');

  // POS Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxAmount = 0; // Tax free demo
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
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

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const inv: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName,
      customerPhone,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
    };
    setLastInvoice(inv);
    setShowInvoiceModal(true);
    setCart([]);
  };

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const newP: ProductItem = {
      id: `p-${Date.now()}`,
      nameUrdu: newProdName,
      nameRoman: newProdName,
      nameEn: newProdName,
      categoryUrdu: newProdCategory,
      categoryRoman: newProdCategory,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      barcode: Math.floor(100000000 + Math.random() * 900000000).toString(),
    };
    setProducts((prev) => [newP, ...prev]);
    addToCart(newP);
    setNewProdName('');
    setShowAddProductModal(false);
  };

  // --- STATE 2: KHATA / LEDGER SYSTEM ---
  const [parties, setParties] = useState<KhataParty[]>(INITIAL_KHATA_PARTIES);
  const [transactions, setTransactions] = useState<KhataTransaction[]>(INITIAL_KHATA_TRANSACTIONS);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('party-1');
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txType, setTxType] = useState<'give' | 'receive'>('give');
  const [txAmount, setTxAmount] = useState<number>(2000);
  const [txNote, setTxNote] = useState('');
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const partyTransactions = transactions.filter((t) => t.partyId === activeParty.id);

  const totalReceivable = parties.filter((p) => p.balance > 0).reduce((s, p) => s + p.balance, 0);
  const totalPayable = parties.filter((p) => p.balance < 0).reduce((s, p) => s + Math.abs(p.balance), 0);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (txAmount <= 0) return;
    const newTx: KhataTransaction = {
      id: `tx-${Date.now()}`,
      partyId: activeParty.id,
      date: new Date().toISOString().split('T')[0],
      type: txType,
      amount: Number(txAmount),
      note: txNote || (txType === 'give' ? 'ادھار سامان دیا گیا' : 'نقد وصولی حاصل ہوئی'),
    };
    setTransactions((prev) => [newTx, ...prev]);
    // update party balance
    setParties((prev) =>
      prev.map((p) => {
        if (p.id === activeParty.id) {
          const delta = txType === 'give' ? txAmount : -txAmount;
          return { ...p, balance: p.balance + delta, lastUpdated: 'ابھی' };
        }
        return p;
      })
    );
    setTxNote('');
    setShowAddTxModal(false);
  };

  const copyWhatsAppReminder = () => {
    const text = `محترم ${activeParty.name} صاحب،\nآپ کے کاروباری کھاتے کا بقایا بیلنس ${Math.abs(activeParty.balance).toLocaleString()} روپے (${activeParty.balance > 0 ? 'واجب الادا' : 'آپ کی طرف جمع'}).\nبرائے مہربانی چیک فرما لیں۔\nشکریہ!`;
    navigator.clipboard.writeText(text);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 3000);
  };

  // --- STATE 3: TASK KANBAN SYSTEM ---
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('ٹیم ممبر');

  const moveTask = (taskId: string, targetStatus: 'todo' | 'inprogress' | 'done') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: 'مقررہ وقت پر',
      assignee: newTaskAssignee,
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  // --- STATE 4: BUSINESS FINANCIAL & PROFIT CALCULATOR ---
  const [monthlyRevenue, setMonthlyRevenue] = useState(750000); // 7.5 Lakh sales
  const [costOfGoods, setCostOfGoods] = useState(520000); // Purchases
  const [shopRent, setShopRent] = useState(45000); // Rent
  const [staffSalaries, setStaffSalaries] = useState(60000); // Salaries
  const [electricityBills, setElectricityBills] = useState(25000); // Bills
  const [miscExpenses, setMiscExpenses] = useState(15000); // Misc

  // EMI / Loan calculator state
  const [loanAmount, setLoanAmount] = useState(300000); // 3 Lakhs
  const [loanMonths, setLoanMonths] = useState(12); // 12 Months
  const [interestRate, setInterestRate] = useState(12); // 12%

  const grossProfit = Math.max(0, monthlyRevenue - costOfGoods);
  const totalOperatingExpenses = shopRent + staffSalaries + electricityBills + miscExpenses;
  const netProfit = grossProfit - totalOperatingExpenses;
  const netMargin = monthlyRevenue > 0 ? ((netProfit / monthlyRevenue) * 100).toFixed(1) : '0';

  // Loan EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 100 / 12;
  const monthlyEmi = monthlyRate > 0
    ? Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
        (Math.pow(1 + monthlyRate, loanMonths) - 1)
      )
    : Math.round(loanAmount / loanMonths);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameUrdu.includes(searchQuery) ||
      p.nameRoman.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    const matchesCat = selectedCategory === 'all' || p.categoryUrdu === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="demos" className="py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/25 mb-3">
            <Store className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'لائیو ورکنگ سافٹ ویئر لیب' : 'Live Interactive Software Lab'}</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold text-white ${fontClass}`}>
            {isUrdu ? 'خود چلا کر ٹیسٹ کریں کہ سافٹ ویئر کیسے کام کرتا ہے' : 'Khud chala kar test karein kaise software kaam karta hai'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            {isUrdu 
              ? 'نیچے دی گئی چاروں ایپلی کیشنز اصل ڈیٹا پر لائیو کام کر رہی ہیں۔ آپ بل بنا سکتے ہیں، کھاتہ چیک کر سکتے ہیں، اور پرنٹ ٹیسٹ کر سکتے ہیں۔'
              : 'Neeche diye gaye chaaron apps live kaam kar rahe hain. Aap bill bana kar receipt print bhi kar sakte hain.'}
          </p>
        </div>

        {/* Software Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
          <button
            onClick={() => setActiveDemo('pos')}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
              activeDemo === 'pos'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{isUrdu ? '1. پوائنٹ آف سیل (POS)' : '1. POS & Billing'}</span>
          </button>

          <button
            onClick={() => setActiveDemo('khata')}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
              activeDemo === 'khata'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isUrdu ? '2. ادھار کھاتہ بک' : '2. Digital Khata'}</span>
          </button>

          <button
            onClick={() => setActiveDemo('kanban')}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
              activeDemo === 'kanban'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>{isUrdu ? '3. ٹاسک و پراجیکٹ بورڈ' : '3. Task Workflow'}</span>
          </button>

          <button
            onClick={() => setActiveDemo('calculator')}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
              activeDemo === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{isUrdu ? '4. کاروباری منافع کیلکولیٹر' : '4. Profit Calculator'}</span>
          </button>
        </div>

        {/* DEMO 1: POS SYSTEM */}
        {activeDemo === 'pos' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            
            {/* POS Top Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold text-white ${fontClass}`}>
                    {isUrdu ? 'سپر اسٹور و دکان بلنگ کاؤنٹر (POS Terminal)' : 'Super Store POS Terminal'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isUrdu ? 'بارکوڈ یا نام سے سامان تلاش کریں اور فوری کمپیوٹرائزڈ بل تیار کریں' : 'Instant barcode item scan & printable receipt generator'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>{isUrdu ? 'نیا آئٹم شامل کریں' : 'New Item'}</span>
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                  کیشئر: ایڈمن کاؤنٹر #1
                </span>
              </div>
            </div>

            {/* POS Grid: Items on left/top, Cart on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Product Catalog (Left 7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Search & Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={isUrdu ? 'آئٹم کا نام یا بارکوڈ لکھیں (مثلاً: چاول، چائے، تیل)...' : 'Search item or barcode...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-2 bg-slate-800 rounded-xl text-xs text-slate-300 hover:text-white"
                    >
                      صاف
                    </button>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                  {filteredProducts.map((p) => {
                    const inCart = cart.find((c) => c.product.id === p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => addToCart(p)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                          inCart
                            ? 'bg-emerald-950/20 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                            : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                              {p.categoryUrdu}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              #{p.barcode.slice(-4)}
                            </span>
                          </div>
                          <h4 className={`font-bold text-white text-sm mt-2 leading-snug line-clamp-2 ${fontClass}`}>
                            {isUrdu ? p.nameUrdu : p.nameRoman}
                          </h4>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400">قیمت: </span>
                            <span className="font-extrabold text-emerald-400 font-mono text-sm">
                              {p.price} روپے
                            </span>
                          </div>
                          {inCart ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                              {inCart.quantity}
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-400 text-xs font-bold flex items-center justify-center transition-colors">
                              +
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Billing Cart & Summary (Right 5 Cols) */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                
                <div>
                  {/* Cart Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-sm">
                        {isUrdu ? 'گاہک کا بل (Cart)' : 'Current Invoice'}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {cart.reduce((n, i) => n + i.quantity, 0)} آئٹمز
                    </span>
                  </div>

                  {/* Customer Quick Info */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        {isUrdu ? 'گاہک کا نام' : 'Customer Name'}
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        {isUrdu ? 'فون نمبر' : 'Phone'}
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {cart.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        {isUrdu ? 'کوئی آئٹم منتخب نہیں ہے۔ بائیں طرف سے کلک کریں!' : 'Cart is empty. Click items on left.'}
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs"
                        >
                          <div className="flex-1 pr-2">
                            <div className="font-semibold text-slate-200">
                              {isUrdu ? item.product.nameUrdu : item.product.nameRoman}
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              {item.product.price} × {item.quantity} ={' '}
                              <span className="text-emerald-400 font-mono font-bold">
                                {item.product.price * item.quantity} روپے
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-bold text-white font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-6 h-6 rounded-md bg-rose-950/50 hover:bg-rose-900 text-rose-400 flex items-center justify-center ml-1 text-xs"
                              title="حذف کریں"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Calculation Summary & Payment */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{isUrdu ? 'ذیلی ٹوٹل (Subtotal):' : 'Subtotal:'}</span>
                    <span className="font-mono font-bold">{subtotal} روپے</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>{isUrdu ? 'رعایت (Discount):' : 'Discount:'}</span>
                      <select
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 text-[10px] rounded px-1.5 py-0.5 text-emerald-400 font-bold"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={10}>10%</option>
                        <option value={15}>15%</option>
                      </select>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">
                      - {discountAmount} روپے
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm sm:text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>{isUrdu ? 'حتمی قابل ادائیگی رقم:' : 'Net Total:'}</span>
                    <span className="text-xl font-mono text-emerald-400">
                      {grandTotal.toLocaleString()} روپے
                    </span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-1.5 text-[11px] rounded-lg font-bold border ${
                        paymentMethod === 'cash'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      💵 نقد (Cash)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-1.5 text-[11px] rounded-lg font-bold border ${
                        paymentMethod === 'card'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      💳 کارڈ (Card)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('udhar')}
                      className={`py-1.5 text-[11px] rounded-lg font-bold border ${
                        paymentMethod === 'udhar'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      📒 ادھار کھاتہ
                    </button>
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      cart.length > 0
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-98'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isUrdu ? 'بل مکمل کریں اور رسید پرنٹ کریں' : 'Finalize & Print Receipt'}</span>
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* DEMO 2: KHATA & DIGITAL LEDGER */}
        {activeDemo === 'khata' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            
            {/* Khata Top Bar & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-800">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold text-white ${fontClass}`}>
                    {isUrdu ? 'ڈیجیٹل ادھار کھاتہ رجسٹر (Khata Book)' : 'Digital Khata Ledger'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isUrdu ? 'گاہکوں کا ادھار اور وصولی مع خودکار واٹس ایپ یاد دہانی' : 'Customer debit/credit ledger & instant WhatsApp slip'}
                  </p>
                </div>
              </div>

              {/* Total Receivable */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    {isUrdu ? 'ہم نے مارکیٹ سے لینے ہیں (Receivable)' : 'You will receive:'}
                  </span>
                  <span className="text-xl font-mono font-extrabold text-white">
                    {totalReceivable.toLocaleString()} روپے
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  +
                </div>
              </div>

              {/* Total Payable */}
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-rose-400 block">
                    {isUrdu ? 'ہم نے کمپنیوں کو دینے ہیں (Payable)' : 'You have to give:'}
                  </span>
                  <span className="text-xl font-mono font-extrabold text-white">
                    {totalPayable.toLocaleString()} روپے
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  -
                </div>
              </div>

            </div>

            {/* Khata Content: Parties on right/left, Ledger on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Parties List (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {isUrdu ? 'کھاتہ دار پارٹیز' : 'Customers / Parties'} ({parties.length})
                  </span>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {parties.map((party) => {
                    const isSelected = party.id === activeParty.id;
                    const isPositive = party.balance >= 0;
                    return (
                      <div
                        key={party.id}
                        onClick={() => setSelectedPartyId(party.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 border-emerald-500/60 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-white text-sm">{party.name}</h4>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {party.phone} • {party.city}
                          </span>
                        </div>
                        <div className="text-left">
                          <span
                            className={`font-mono font-extrabold text-sm block ${
                              isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {Math.abs(party.balance).toLocaleString()} روپے
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isPositive ? 'لینے ہیں' : 'دینے ہیں'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Party Ledger & Actions (8 cols) */}
              <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
                
                <div>
                  {/* Ledger Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{activeParty.name}</h4>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono">
                          {activeParty.phone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        آخری لین دین: {activeParty.lastUpdated}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyWhatsAppReminder}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{whatsappCopied ? 'پیغام کاپی ہو گیا! ✓' : 'واٹس ایپ یاد دہانی'}</span>
                      </button>
                      
                      <button
                        onClick={() => setShowAddTxModal(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>نیا لین دین درج کریں</span>
                      </button>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold">
                          <th className="py-2 px-3">تاریخ</th>
                          <th className="py-2 px-3">تفصیل / بل نمبر</th>
                          <th className="py-2 px-3 text-emerald-400">ادھار دیا (Give)</th>
                          <th className="py-2 px-3 text-cyan-400">وصول کیا (Got)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {partyTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-500">
                              اس کھاتے میں فی الحال کوئی پرانا ریکارڈ موجود نہیں ہے۔
                            </td>
                          </tr>
                        ) : (
                          partyTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-900/40">
                              <td className="py-2.5 px-3 font-mono text-slate-300">{tx.date}</td>
                              <td className="py-2.5 px-3 text-slate-200">{tx.note}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                                {tx.type === 'give' ? `${tx.amount.toLocaleString()} روپے` : '-'}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                                {tx.type === 'receive' ? `${tx.amount.toLocaleString()} روپے` : '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Balance Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs text-slate-400 block">موجودہ نیٹ بیلنس:</span>
                    <span
                      className={`text-xl font-mono font-extrabold ${
                        activeParty.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {Math.abs(activeParty.balance).toLocaleString()} روپے{' '}
                      <span className="text-xs font-normal">
                        ({activeParty.balance >= 0 ? 'ہم نے وصول کرنے ہیں' : 'ہم نے ادا کرنے ہیں'})
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors no-print"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>اکاؤنٹ اسٹیٹمنٹ پرنٹ کریں</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* DEMO 3: TASK KANBAN SYSTEM */}
        {activeDemo === 'kanban' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Kanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold text-white ${fontClass}`}>
                    {isUrdu ? 'کمپنی و آفس ٹاسک مینیجر (Kanban Workflow)' : 'Office Task Kanban Board'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isUrdu ? 'ٹیم کے کاموں کی پیش رفت، ڈیڈ لائنز اور ملازمین کو کام تفویض کرنے کا بورڈ' : 'Interactive task workflow with status progression'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>نیا ٹاسک شامل کریں</span>
              </button>
            </div>

            {/* Kanban 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              
              {/* Column 1: To Do */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span>زیر غور (To Do)</span>
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {tasks.filter((t) => t.status === 'todo').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {tasks.filter((t) => t.status === 'todo').map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              task.priority === 'high'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {task.priority === 'high' ? 'شدید ضروری' : 'درمیانہ'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {task.dueDate}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-xs leading-snug">{task.title}</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-medium">
                            👤 {task.assignee}
                          </span>
                          <button
                            onClick={() => moveTask(task.id, 'inprogress')}
                            className="px-2 py-1 text-[10px] rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold transition-colors"
                          >
                            شروع کریں ←
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span>جاری کام (In Progress)</span>
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {tasks.filter((t) => t.status === 'inprogress').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {tasks.filter((t) => t.status === 'inprogress').map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-500/50 transition-all space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300">
                            کام جاری ہے
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {task.dueDate}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-xs leading-snug">{task.title}</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-medium">
                            👤 {task.assignee}
                          </span>
                          <button
                            onClick={() => moveTask(task.id, 'done')}
                            className="px-2 py-1 text-[10px] rounded bg-emerald-500 text-slate-950 font-bold transition-colors"
                          >
                            مکمل ہو گیا ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Done */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span>مکمل شدہ (Completed)</span>
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {tasks.filter((t) => t.status === 'done').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {tasks.filter((t) => t.status === 'done').map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-slate-900/40 border border-emerald-500/20 space-y-2 opacity-80"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3" /> مکمل
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {task.dueDate}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-300 text-xs line-through leading-snug">
                          {task.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{task.description}</p>
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            👤 {task.assignee}
                          </span>
                          <button
                            onClick={() => moveTask(task.id, 'inprogress')}
                            className="text-[10px] text-slate-400 hover:text-white"
                          >
                            دوبارہ کھولیں
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* DEMO 4: FINANCIAL & PROFIT CALCULATOR */}
        {activeDemo === 'calculator' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-bold text-white ${fontClass}`}>
                  {isUrdu ? 'کاروباری نفع و نقصان اور قرض کی قسط کیلکولیٹر' : 'Business Profit & Loan EMI Calculator'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isUrdu ? 'ماہانہ آمدنی و اخراجات درج کر کے خالص منافع اور اقساط کا خودکار تجزیہ کریں' : 'Live profit margin analysis and business loan calculator'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              
              {/* Financial Inputs (6 Cols) */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'کاروبار کی ماہانہ تفصیلات' : 'Monthly Business Figures'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      {isUrdu ? 'کل ماہانہ سیلز / آمدنی' : 'Monthly Sales / Revenue'}
                    </label>
                    <input
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-emerald-400 font-bold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      {isUrdu ? 'مال کی خریداری لاگت (Cost)' : 'Cost of Goods Sold'}
                    </label>
                    <input
                      type="number"
                      value={costOfGoods}
                      onChange={(e) => setCostOfGoods(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      {isUrdu ? 'دکان یا دفتر کا کرایہ' : 'Shop / Office Rent'}
                    </label>
                    <input
                      type="number"
                      value={shopRent}
                      onChange={(e) => setShopRent(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      {isUrdu ? 'ملازمین کی تنخواہیں' : 'Staff Salaries'}
                    </label>
                    <input
                      type="number"
                      value={staffSalaries}
                      onChange={(e) => setStaffSalaries(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      {isUrdu ? 'بجلی، گیس و انٹرنیٹ بلز' : 'Utility Bills'}
                    </label>
                    <input
                      type="number"
                      value={electricityBills}
                      onChange={(e) => setElectricityBills(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      {isUrdu ? 'متفرق اخراجات (Misc)' : 'Misc Expenses'}
                    </label>
                    <input
                      type="number"
                      value={miscExpenses}
                      onChange={(e) => setMiscExpenses(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Loan Installment Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mt-4">
                  <h5 className="font-bold text-cyan-400 text-xs mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'کاروباری قرض و قسط کا حساب (EMI)' : 'Business Loan & Installment'}</span>
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">قرض کی رقم</span>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">مدت (ماہ)</span>
                      <input
                        type="number"
                        value={loanMonths}
                        onChange={(e) => setLoanMonths(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">ماہانہ قسط</span>
                      <span className="text-xs font-mono font-extrabold text-cyan-400 block py-1">
                        {monthlyEmi.toLocaleString()} روپے
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Profit Results & Analysis (6 Cols) */}
              <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                    {isUrdu ? 'کاروباری منافع کا حتمی نتیجہ' : 'Profitability Assessment'}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">مجموعی منافع (Gross Profit):</span>
                      <span className="text-base font-mono font-bold text-slate-200 mt-1 block">
                        {grossProfit.toLocaleString()} روپے
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">کل دفتری اخراجات:</span>
                      <span className="text-base font-mono font-bold text-rose-400 mt-1 block">
                        {totalOperatingExpenses.toLocaleString()} روپے
                      </span>
                    </div>
                  </div>

                  {/* Net Profit Big Banner */}
                  <div
                    className={`p-4 rounded-2xl border text-center ${
                      netProfit > 0
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-rose-950/30 border-rose-500/50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-300 block">
                      {isUrdu ? 'ماہانہ خالص بچت / منافع (Net Profit):' : 'Monthly Net Savings:'}
                    </span>
                    <span
                      className={`text-2xl sm:text-3xl font-mono font-black mt-1 block ${
                        netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {netProfit.toLocaleString()} روپے
                    </span>
                    <span className="text-xs text-slate-400 mt-1 inline-block">
                      خالص منافع کا تناسب (Profit Margin):{' '}
                      <strong className="text-white font-mono">{netMargin}%</strong>
                    </span>
                  </div>

                  {/* Profit Health Advice */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {netProfit > 0 ? 'کاروبار منافع بخش ہے!' : 'توجہ طلب: اخراجات زیادہ ہیں!'}
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      {netProfit > 0
                        ? `آپ کا کاروبار کل فروخت پر تقریباً ${netMargin}% خالص منافع کما رہا ہے۔ کمپیوٹر سافٹ ویئر کے ذریعے اسٹاک کی چوری روک کر اور تیز ترین بلنگ سے آپ کا منافع مزید 15% سے 25% تک بڑھ سکتا ہے۔`
                        : 'آپ کے اخراجات آمدنی سے تجاوز کر رہے ہیں۔ پوائنٹ آف سیل سافٹ ویئر کے ذریعے اضافی اخراجات پر فوری قابو پائیں۔'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onRequestCustomSoftware}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>اس قسم کے کاروبار کے لیے مکمل سافٹ ویئر بنوائیں</span>
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* --- INVOICE PRINT MODAL --- */}
      {showInvoiceModal && lastInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Receipt Body */}
            <div className="text-center border-b pb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 no-print">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-naskh">المدینہ سپر اسٹور و مارٹ</h3>
              <p className="text-xs text-slate-600 font-latin">Main Commercial Area, Market Road</p>
              <p className="text-xs text-slate-600 font-mono">فون: 0300-1234567 | انوائس: {lastInvoice.id}</p>
              <p className="text-[11px] text-slate-500 font-mono">{lastInvoice.date}</p>
            </div>

            <div className="py-3 border-b text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">گاہک:</span>
                <span className="font-bold">{lastInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ادائیگی کا طریقہ:</span>
                <span className="font-bold font-mono uppercase">{lastInvoice.paymentMethod}</span>
              </div>
            </div>

            {/* Items */}
            <div className="py-3 border-b max-h-48 overflow-y-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-1">سامان</th>
                    <th className="py-1 text-center">تعداد</th>
                    <th className="py-1 text-left">رقم</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lastInvoice.items.map((item) => (
                    <tr key={item.product.id}>
                      <td className="py-1.5">{item.product.nameUrdu}</td>
                      <td className="py-1.5 text-center font-mono">{item.quantity}</td>
                      <td className="py-1.5 text-left font-mono font-bold">
                        {item.product.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>ٹوٹل:</span>
                <span className="font-mono">{lastInvoice.subtotal} روپے</span>
              </div>
              {lastInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ڈسکاؤنٹ:</span>
                  <span className="font-mono">- {lastInvoice.discount} روپے</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold border-t pt-2 text-slate-900">
                <span>حتمی بل:</span>
                <span className="font-mono">{lastInvoice.total} روپے</span>
              </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-slate-500">
              <p>خریداری کا شکریہ! برائے مہربانی رسید سنبھال کر رکھیں۔</p>
              <p className="font-mono mt-0.5">Software Powered by اردو سافٹ ویئر اسٹوڈیو</p>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>پرنٹر پر پرنٹ کریں</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
              >
                بند کریں
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h4 className="font-bold text-base mb-4 text-emerald-400">
              نیا آئٹم انوینٹری میں شامل کریں
            </h4>
            <form onSubmit={handleAddCustomProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">آئٹم کا نام</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: صابن لکس، بسکٹ سپر..."
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">سیل پرائس (روپے)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">موجود اسٹاک</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  محفوظ کریں اور کارٹ میں لائیں
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-2 bg-slate-800 rounded-lg text-slate-300"
                >
                  منسوخ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD TRANSACTION MODAL --- */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h4 className="font-bold text-base mb-3 text-white">
              {activeParty.name} کے کھاتے میں اندراج
            </h4>
            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('give')}
                  className={`py-2 rounded-lg font-bold border ${
                    txType === 'give'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  ادھار دیا (Give)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('receive')}
                  className={`py-2 rounded-lg font-bold border ${
                    txType === 'receive'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  رقم وصول کی (Got)
                </button>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">رقم (روپے)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-base font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">تفصیل / مال کی قسم</label>
                <input
                  type="text"
                  placeholder="مثلاً: 2 بوری چینی، نقد وصولی..."
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  اندراج محفوظ کریں
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-3 py-2 bg-slate-800 rounded-lg text-slate-300"
                >
                  منسوخ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD TASK MODAL --- */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h4 className="font-bold text-base mb-3 text-white">نیا ٹاسک شامل کریں</h4>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">ٹاسک کا عنوان</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: گودام کے سامان کا آڈٹ"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">تفصیل</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="ٹاسک کی مزید تفصیل..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">ترجیح</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="high">شدید ضروری (High)</option>
                    <option value="medium">درمیانہ (Medium)</option>
                    <option value="low">معمول (Low)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">تفویض کردہ ملازم</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  ٹاسک شامل کریں
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-2 bg-slate-800 rounded-lg text-slate-300"
                >
                  منسوخ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
