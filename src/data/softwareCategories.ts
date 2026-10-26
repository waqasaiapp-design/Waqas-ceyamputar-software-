import { SoftwareCategory, BlueprintPreset, ProductItem, KhataParty, KhataTransaction, TaskItem } from '../types';

export const SOFTWARE_CATEGORIES: SoftwareCategory[] = [
  {
    id: 'pos-retail',
    titleUrdu: 'پوائنٹ آف سیل و دکان بلنگ سسٹم',
    titleRoman: 'Point of Sale (POS) & Retail Billing',
    titleEn: 'POS & Store Billing Software',
    icon: 'Store',
    descriptionUrdu: 'ہر قسم کی دکان، جنرل اسٹور، میڈیکل اسٹور، کپڑوں اور الیکٹرانکس کی دکان کے لیے بارکوڈ اسکیننگ، کمپیوٹرائزڈ رسید اور اسٹاک کنٹرول کا مکمل نظام۔',
    descriptionRoman: 'Har qisam ki dukan, medical store, super store ke liye barcode scanning, computerized bill receipt aur inventory control system.',
    featuresUrdu: [
      'تھرمل پرنٹر پر اردو اور انگریزی رسید پرنٹنگ',
      'بارکوڈ اسکینر سپورٹ اور کسٹم بارکوڈ جنریٹر',
      'کم اسٹاک ہونے پر فوری الرٹ اور نوٹیفکیشن',
      'روزانہ، ہفتہ وار اور ماہانہ سیلز و منافع کی رپورٹ',
      'ملٹی یوزر کیشئر اور ایڈمن کاؤنٹر لاگ ان'
    ],
    featuresRoman: [
      'Thermal printer par Urdu/English receipt printing',
      'Barcode scanner support aur barcode generator',
      'Low stock auto-alerts aur supplier reorder',
      'Daily/Monthly sales aur profit reporting',
      'Cashier aur Admin multi-level permissions'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB / SQLite', 'Web Print API'],
    platforms: ['Windows PC', 'Android Tablet', 'Mac / Linux', 'Web Browser'],
    badge: 'سب سے زیادہ مانگ'
  },
  {
    id: 'accounting-khata',
    titleUrdu: 'کھاتہ بک اور مکمل اکاؤنٹنگ سافٹ ویئر',
    titleRoman: 'Khata Book & Accounting Software',
    titleEn: 'Digital Ledger & Accounting',
    icon: 'BookOpen',
    descriptionUrdu: 'کسٹمرز اور سپلائرز کے ادھار اور وصولی کا ڈیجیٹل رجسٹر۔ واٹس ایپ پر ریمائنڈر میسج، مکمل لیجر اسٹیٹمنٹ اور بیلنس شیٹ۔',
    descriptionRoman: 'Customers aur suppliers ke udhar aur wasooli ka digital ledger. WhatsApp reminders aur balance sheet reporting.',
    featuresUrdu: [
      'گاہکوں کا الگ الگ کھاتہ مع تاریخ اور بل نمبر',
      'واٹس ایپ پر بقایا رقم کی خودکار سلپ بھیجنا',
      'کیش ان ہینڈ اور بینک اکاؤنٹس کا بیلنس',
      'پی ڈی ایف لیجر اسٹیٹمنٹ ڈاؤنلوڈ اور پرنٹ',
      'آف لائن موڈ بغیر انٹرنیٹ کے بھی کام کرتا ہے'
    ],
    featuresRoman: [
      'Customer-wise debit/credit ledger with history',
      'One-click WhatsApp reminder with payment breakdown',
      'Cash-in-hand & multi-bank ledger balancing',
      'PDF printable party account statements',
      'Offline-first capability with automatic cloud sync'
    ],
    techStack: ['React', 'TypeScript', 'IndexedDB', 'PDF Generation', 'WhatsApp Web API'],
    platforms: ['Desktop PC', 'Mobile Phone', 'Tablet', 'Web Browser'],
    badge: 'کاروباری ضروریات'
  },
  {
    id: 'school-management',
    titleUrdu: 'اسکول، کالج اور اکیڈمی مینجمنٹ پورٹل',
    titleRoman: 'School & College Management Portal',
    titleEn: 'School Management System (SMS)',
    icon: 'GraduationCap',
    descriptionUrdu: 'طلباء کے داخلے، ماہانہ فیس چالان، حاضری، امتحانی نتائج اور اساتذہ کی تنخواہوں کا مکمل اور جدید کلاؤڈ سسٹم۔',
    descriptionRoman: 'Students admission, monthly fee challan printing, attendance, examination report cards aur teacher payroll system.',
    featuresUrdu: [
      'بینک فیس چالان اور اسکول کاؤنٹر فیس رسید',
      'روزانہ طلباء اور اساتذہ کی بایومیٹرک/ڈیجیٹل حاضری',
      'رزلٹ کارڈز اور گریڈنگ سسٹم (GPA/فیصد)',
      'والدین کے لیے ایس ایم ایس/واٹس ایپ نوٹیفکیشن',
      'کلاس و سیکشن وائز ٹائم ٹیبل اور سلیبس'
    ],
    featuresRoman: [
      '3-part auto fee challans & instant receipt generation',
      'Biometric / QR attendance for students and staff',
      'Automated result cards & report cards with grading',
      'SMS / WhatsApp alerts to parents on absence & fees',
      'Class timetables, subject syllabi & exam schedules'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL / Supabase', 'Tailwind CSS'],
    platforms: ['Web Portal', 'Teacher App', 'Parents Portal', 'Admin Dashboard'],
    badge: 'تعلیمی ادارے'
  },
  {
    id: 'hospital-clinic',
    titleUrdu: 'ہسپتال، کلینک و فارمیسی مینجمنٹ',
    titleRoman: 'Hospital, Clinic & Pharmacy Software',
    titleEn: 'Hospital & Clinic Management',
    icon: 'Activity',
    descriptionUrdu: 'مریضوں کی رجسٹریشن، ڈاکٹر کے اپوائنٹمنٹس، ڈیجیٹل نسخہ جات (Prescriptions)، ٹیسٹ رپورٹس اور فارمیسی اسٹاک کنٹرول۔',
    descriptionRoman: 'Patient records, doctor appointment scheduling, digital prescription printing, lab reports aur pharmacy inventory.',
    featuresUrdu: [
      'او پی ڈی پرچی اور ٹوکن سسٹم (Token Display)',
      'ڈیجیٹل میڈیکل پریسکرپشن پرنٹنگ',
      'ادویات کی ایکسپائری ڈیٹ الرٹس اور فارمولا سرچ',
      'لیبارٹری ٹیسٹ رپورٹس کی تاریخ اور ٹریکنگ',
      'ڈاکٹر فیس شیئر اور روزانہ کلینک کلیکشن'
    ],
    featuresRoman: [
      'OPD patient slip & digital token display counter',
      'Doctor prescription generator with drug dosage guides',
      'Medicine expiry date alerts and batch tracking',
      'Lab test reports archives and printable slips',
      'Doctor fee share calculation and daily OPD ledger'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL / SQLite'],
    platforms: ['Desktop PC', 'Clinic Reception', 'Doctor Tablet', 'Web'],
    badge: 'طبی خدمات'
  },
  {
    id: 'restaurant-food',
    titleUrdu: 'ریسٹورنٹ، کیفے اور کچن ڈسپلے سسٹم',
    titleRoman: 'Restaurant, Cafe & KOT System',
    titleEn: 'Restaurant Billing & KOT',
    icon: 'UtensilsCrossed',
    descriptionUrdu: 'ڈائن اِن ٹیبل مینجمنٹ، کچن آرڈر ٹکٹ (KOT)، ٹیک اوے، ہوم ڈلیوری اور فوڈ کاسٹنگ کا تیز ترین سافٹ ویئر۔',
    descriptionRoman: 'Dine-in table management, Kitchen Order Tickets (KOT), takeaway, home delivery aur rider tracking.',
    featuresUrdu: [
      'ٹیبل وائز آرڈر بکنگ اور ریئل ٹائم اسٹیٹس',
      'کچن میں فوری KOT پرنٹر یا ڈسپلے اسکرین',
      'ڈلیوری رائیڈر مینجمنٹ اور کیش آن ڈلیوری ٹریکنگ',
      'مینو آئٹم ایڈ آنز (ڈیلز، سائز، اسپائس لیول)',
      'روزانہ سب سے زیادہ بکنے والے کھانوں کی اینالیٹکس'
    ],
    featuresRoman: [
      'Visual interactive table layout with reservation states',
      'Instant Kitchen Order Ticket (KOT) thermal printing',
      'Delivery rider assignment and COD collection',
      'Item variants, deals, modifiers and recipe costing',
      'Daily best-seller item analytics & waste tracking'
    ],
    techStack: ['React', 'TypeScript', 'WebSockets', 'Thermal Print'],
    platforms: ['Touch POS Terminal', 'Waiter Mobile App', 'Kitchen Screen', 'Admin PC'],
    badge: 'ریسٹورنٹس'
  },
  {
    id: 'task-erp',
    titleUrdu: 'پروجیکٹ، ٹاسک اور ملازمین پے رول سسٹم',
    titleRoman: 'Project, Task & Employee Payroll System',
    titleEn: 'ERP, CRM & Task Board',
    icon: 'Briefcase',
    descriptionUrdu: 'کمپنی کے ملازمین کا ریکارڈ، تنخواہوں کی سلپس، پے رول، کسٹمر لیڈز (CRM) اور ٹیم ٹاسک ورک فلو کینبان بورڈ۔',
    descriptionRoman: 'Employee attendance, monthly salary pay slips, lead management CRM aur kanban project workflow boards.',
    featuresUrdu: [
      'کینبان بورڈ: ٹو-ڈو، پراگریس اور مکمل ٹاسکس',
      'تنخواہ سلپ جنریٹر مع الاؤنسز اور کٹوتیاں',
      'کسٹمر لیڈز اور فالو اپ ریمائنڈرز',
      'کمپنی اخراجات اور پراجیکٹ لاگت کا حساب',
      'رول بیسڈ پرمیشنز (مینیجر، اکاؤنٹنٹ، ملازم)'
    ],
    featuresRoman: [
      'Interactive Kanban boards with drag-and-drop workflow',
      'Salary payslip generator with deductions & bonuses',
      'Customer leads CRM and automated follow-up calendar',
      'Departmental expense approvals and profit tracking',
      'Role-based permissions (Super Admin, HR, Employee)'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    platforms: ['Desktop PC', 'Laptop', 'Mobile Web', 'Tablet'],
    badge: 'کارپوریٹ'
  }
];

export const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    id: 'medical-store',
    nameUrdu: 'فارمیسی و میڈیکل اسٹور سافٹ ویئر',
    nameRoman: 'Pharmacy & Medical Store Software',
    taglineUrdu: 'ادویات کی فروخت، ایکسپائری الرٹ، فارمولا سرچ اور ڈسٹری بیوٹر آرڈرز',
    industry: 'صحت و طب (Healthcare)',
    modules: [
      { id: 'pos', titleUrdu: 'پوائنٹ آف سیل (POS)', titleRoman: 'POS Billing', descUrdu: 'تیز ترین بلنگ مع ڈسکاؤنٹ اور بارکوڈ', defaultSelected: true },
      { id: 'expiry', titleUrdu: 'ایکسپائری ٹریکر', titleRoman: 'Expiry Tracker', descUrdu: '3 ماہ قبل ایکسپائر ہونے والی ادویات کی فہرست', defaultSelected: true },
      { id: 'substitute', titleUrdu: 'متبادل فارمولا سرچ', titleRoman: 'Formula Substitute', descUrdu: 'دوا نہ ملنے پر اسی فارمولے کی دوسری کمپنی تجویز کرنا', defaultSelected: true },
      { id: 'distributor', titleUrdu: 'ڈسٹری بیوٹر کھاتہ', titleRoman: 'Distributor Khata', descUrdu: 'کمپنیوں کے بل اور ادائیگی کا حساب', defaultSelected: true },
      { id: 'narcotics', titleUrdu: 'کنٹرولڈ میڈیسن رجسٹر', titleRoman: 'Prescription Drug Register', descUrdu: 'ڈاکٹر کے نسخے کے بغیر نہ بکنے والی ادویات کا ریکارڈ', defaultSelected: false }
    ],
    databaseTables: [
      { name: 'medicines', descriptionUrdu: 'ادویات کا ڈیٹا، برانڈ، فارمولا، پیک سائز', columns: ['id', 'brand_name', 'generic_formula', 'company', 'batch_no', 'expiry_date', 'purchase_rate', 'sale_rate', 'current_stock'] },
      { name: 'sales_invoices', descriptionUrdu: 'گاہکوں کے بلوں کا ریکارڈ', columns: ['invoice_id', 'date_time', 'customer_name', 'total_amount', 'discount', 'net_payable', 'cashier_id'] },
      { name: 'suppliers', descriptionUrdu: 'ڈسٹری بیوٹرز اور کمپنیوں کا کھاتہ', columns: ['id', 'company_name', 'contact_person', 'phone', 'current_payable'] }
    ],
    sampleScreens: ['بلنگ کاؤنٹر اسکرین', 'اسٹاک سرچ و ایکسپائری شیلف', 'روزانہ کلیکشن ڈیش بورڈ', 'پرنٹ رسید ٹیمپلیٹ'],
    codePreview: `// Example Architecture: Medicine Inventory & POS Component
interface Medicine {
  id: string;
  name: string;
  batchNo: string;
  expiryDate: string; // YYYY-MM
  mrp: number;
  stock: number;
}

export function PharmacyPOS() {
  const [cart, setCart] = useState([]);
  const handleScan = (barcode: string) => {
    // Quick find & add to bill
  };
  return <div className="p-4 grid grid-cols-3 gap-4">...</div>;
}`
  },
  {
    id: 'grocery-mart',
    nameUrdu: 'سپر مارٹ و کریانہ اسٹور ای آر پی',
    nameRoman: 'Super Mart & Grocery ERP',
    taglineUrdu: 'وزن والی اشیاء (Weighing Scale)، بارکوڈ، کیش دراز اور ہول سیل ریٹس',
    industry: 'ریٹیل و ہول سیل (Retail)',
    modules: [
      { id: 'scale', titleUrdu: 'ڈیجیٹل وزن اسکیل کنکشن', titleRoman: 'Weighing Scale Integration', descUrdu: 'چینی، دالیں اور آلو پیاز کا وزن خودکار کمپیوٹر میں آنا', defaultSelected: true },
      { id: 'barcode', titleUrdu: 'بارکوڈ و اسٹیکر پرنٹر', titleRoman: 'Barcode Label Printing', descUrdu: 'اپنی دکان کے بارکوڈ اسٹیکر پرنٹ کرنا', defaultSelected: true },
      { id: 'cash-drawer', titleUrdu: 'الیکٹرانک کیش کاؤنٹر دراز', titleRoman: 'Cash Drawer Trigger', descUrdu: 'بل نکلتے ہی کیش دراز کا خود بخود کھلنا', defaultSelected: true },
      { id: 'udhar-card', titleUrdu: 'علاقائی گاہک ادھار کارڈ', titleRoman: 'Customer Khata Card', descUrdu: 'ماہانہ راشن والے گاہکوں کا الگ کھاتہ', defaultSelected: true }
    ],
    databaseTables: [
      { name: 'items', descriptionUrdu: 'سامان کی فہرست، بارکوڈ اور کیٹیگری', columns: ['id', 'barcode', 'item_name_ur', 'item_name_en', 'unit', 'purchase_price', 'retail_price', 'wholesale_price', 'stock_qty'] },
      { name: 'customers', descriptionUrdu: 'کھاتہ دار گاہکوں کی معلومات', columns: ['id', 'name', 'phone', 'address', 'credit_limit', 'balance'] }
    ],
    sampleScreens: ['فاسٹ کیش کاؤنٹر', 'بارکوڈ جنریشن اسکرین', 'سپلائر بل اندراج', 'نفع نقصان رپورٹ'],
    codePreview: `// Fast grocery scanning logic with hotkeys
window.addEventListener('keydown', (e) => {
  if (e.key === 'F12') finalizeBill();
  if (e.key === 'F2') toggleWeightScale();
});`
  },
  {
    id: 'school-portal',
    nameUrdu: 'اسکول مینجمنٹ اور فیس چالان پورٹل',
    nameRoman: 'School Management & Fee Challan Portal',
    taglineUrdu: 'داخلے، ماہانہ فیس بینک چالان، حاضری، اور ایس ایم ایس نوٹیفکیشن',
    industry: 'تعلیم (Education)',
    modules: [
      { id: 'admission', titleUrdu: 'طالب علم داخلہ فارم', titleRoman: 'Student Admission', descUrdu: 'ب فارم، والد کا نام، سابقہ اسکول اور کوائف', defaultSelected: true },
      { id: 'challan', titleUrdu: 'خودکار 3 حصوں والا فیس چالان', titleRoman: '3-Part Fee Challan', descUrdu: 'اسکول، بینک، اور والدین کا چالان ایک صفحے پر', defaultSelected: true },
      { id: 'attendance', titleUrdu: 'غیر حاضر طلباء کا الرٹ', titleRoman: 'Absentee SMS / WhatsApp', descUrdu: 'حاضری لگتے ہی والدین کو فوری پیغام', defaultSelected: true },
      { id: 'exam', titleUrdu: 'امتحانی رزلٹ اور پروموشن', titleRoman: 'Exam Result Cards', descUrdu: 'مضامین کے نمبرز، گریڈ اور پوزیشن سرٹیفکیٹ', defaultSelected: true }
    ],
    databaseTables: [
      { name: 'students', descriptionUrdu: 'طلباء کا ریکارڈ اور کلاس', columns: ['gr_no', 'full_name', 'father_name', 'class_id', 'section', 'monthly_fee', 'status'] },
      { name: 'fee_vouchers', descriptionUrdu: 'فیس چالان اور وصولی', columns: ['voucher_no', 'student_id', 'month_year', 'tuition_fee', 'exam_fee', 'fine', 'paid_date', 'status'] }
    ],
    sampleScreens: ['سٹوڈنٹ پروفائل', 'فیس چالان بلک پرنٹنگ', 'ڈیلی اٹینڈنس شیٹ', 'رزلٹ کارڈ ویو'],
    codePreview: `// Auto Fee Challan Generator
export function generateFeeVoucher(student: Student, month: string) {
  return {
    challanNo: 'CH-' + Date.now(),
    studentName: student.name,
    class: student.className,
    tuitionFee: student.monthlyFee,
    dueDate: '10-' + month,
  };
}`
  },
  {
    id: 'car-repair-workshop',
    nameUrdu: 'آٹو ورکشاپ و کار سروس سینٹر سسٹم',
    nameRoman: 'Auto Workshop & Service Center System',
    taglineUrdu: 'گاڑیوں کی جاب شیٹ، اسپیئر پارٹس بل، میکینک کمیشن اور سروس ٹریکنگ',
    industry: 'آٹوموبائل و سروس (Automotive)',
    modules: [
      { id: 'jobcard', titleUrdu: 'گاڑی آمد جاب کارڈ', titleRoman: 'Vehicle Job Card', descUrdu: 'گاڑی نمبر، ماڈل، کلومیٹر ریڈنگ، اور خرابی کی تفصیل', defaultSelected: true },
      { id: 'parts', titleUrdu: 'اسپیئر پارٹس انوینٹری', titleRoman: 'Spare Parts Stock', descUrdu: 'موبل آئل، فلٹرز، بریک پیڈز کی لاگت اور سیل ریٹ', defaultSelected: true },
      { id: 'mechanic', titleUrdu: 'میکینک / استاد کمیشن', titleRoman: 'Technician Labor Share', descUrdu: 'میکینک کی محنتانہ اجرت اور کمیشن کا حساب', defaultSelected: true },
      { id: 'service-reminder', titleUrdu: 'اگلی سروس کا واٹس ایپ الرٹ', titleRoman: 'Next Service Reminder', descUrdu: '3 ماہ بعد آئل چینج کا خودکار میسج گاہک کو جانا', defaultSelected: true }
    ],
    databaseTables: [
      { name: 'vehicles_jobs', descriptionUrdu: 'ورکشاپ میں داخل گاڑیوں کا ریکارڈ', columns: ['job_id', 'car_reg_no', 'owner_name', 'owner_phone', 'car_make_model', 'services_required', 'status', 'total_bill'] },
      { name: 'parts_used', descriptionUrdu: 'گاڑی میں لگائے گئے نئے پارٹس', columns: ['id', 'job_id', 'part_name', 'qty', 'unit_cost', 'sale_price'] }
    ],
    sampleScreens: ['جاب کارڈ اندراج', 'میکینک پروڈکٹیوٹی بورڈ', 'فائنل انوائس پرنٹ', 'کسٹمر گاڑی ہسٹری'],
    codePreview: `// Workshop Job Card Calculator
const totalJobCost = laborCharges + partsTotal - discount;`
  }
];

// Sample Initial Products for POS Demo
export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    nameUrdu: 'چاول کرنل باسمتی (1 کلو)',
    nameRoman: 'Basmati Rice 1kg',
    nameEn: 'Kernel Basmati Rice 1kg',
    categoryUrdu: 'اناج و دالیں',
    categoryRoman: 'Grains & Pulses',
    price: 360,
    stock: 85,
    barcode: '896400101'
  },
  {
    id: 'p2',
    nameUrdu: 'کوکنگ آئل پریمیم (1 لیٹر)',
    nameRoman: 'Premium Cooking Oil 1L',
    nameEn: 'Cooking Oil 1L',
    categoryUrdu: 'خوردنی تیل',
    categoryRoman: 'Edible Oils',
    price: 540,
    stock: 42,
    barcode: '896400102'
  },
  {
    id: 'p3',
    nameUrdu: 'چائے کی پتی اسپیشل (450 گرام)',
    nameRoman: 'Special Black Tea 450g',
    nameEn: 'Premium Tea 450g',
    categoryUrdu: 'چائے و مشروبات',
    categoryRoman: 'Beverages',
    price: 780,
    stock: 28,
    barcode: '896400103'
  },
  {
    id: 'p4',
    nameUrdu: 'سفید چینی صاف ستھری (1 کلو)',
    nameRoman: 'Refined White Sugar 1kg',
    nameEn: 'White Sugar 1kg',
    categoryUrdu: 'گروسری اشیاء',
    categoryRoman: 'Grocery',
    price: 155,
    stock: 120,
    barcode: '896400104'
  },
  {
    id: 'p5',
    nameUrdu: 'ڈیٹول اینٹی بیکٹیریل صابن',
    nameRoman: 'Antiseptic Soap Bar',
    nameEn: 'Antiseptic Soap Bar',
    categoryUrdu: 'حفظان صحت',
    categoryRoman: 'Personal Care',
    price: 135,
    stock: 64,
    barcode: '896400105'
  },
  {
    id: 'p6',
    nameUrdu: 'طاقتور خشک دودھ پاؤڈر (380 گرام)',
    nameRoman: 'Instant Milk Powder 380g',
    nameEn: 'Dry Milk Powder 380g',
    categoryUrdu: 'ڈیری مصنوعات',
    categoryRoman: 'Dairy',
    price: 690,
    stock: 19,
    barcode: '896400106'
  }
];

// Sample Initial Khata Parties
export const INITIAL_KHATA_PARTIES: KhataParty[] = [
  {
    id: 'party-1',
    name: 'حاجی محمد رفیق صاحب',
    phone: '0300-1234567',
    city: 'لاہور',
    balance: 14500, // ہم نے لینے ہیں (Receivable)
    lastUpdated: 'آج صبح 11:30'
  },
  {
    id: 'party-2',
    name: 'ملک ارشد کریانہ اسٹور',
    phone: '0321-9876543',
    city: 'فیصل آباد',
    balance: 42000, // ہم نے لینے ہیں
    lastUpdated: 'کل شام 04:15'
  },
  {
    id: 'party-3',
    name: 'الرحمان ہول سیل ڈسٹری بیوٹر',
    phone: '0333-5551234',
    city: 'گوجرانوالہ',
    balance: -28000, // ہم نے دینے ہیں (Payable)
    lastUpdated: '2 روز قبل'
  },
  {
    id: 'party-4',
    name: 'چوہدری طارق بلڈرز',
    phone: '0345-7788990',
    city: 'راولپنڈی',
    balance: 8900,
    lastUpdated: '3 روز قبل'
  }
];

export const INITIAL_KHATA_TRANSACTIONS: KhataTransaction[] = [
  {
    id: 'tx-1',
    partyId: 'party-1',
    date: '2026-10-24',
    type: 'give',
    amount: 8500,
    note: 'کرنل باسمتی اور گھی کی فراہمی (بل # 1042)'
  },
  {
    id: 'tx-2',
    partyId: 'party-1',
    date: '2026-10-22',
    type: 'receive',
    amount: 5000,
    note: 'جاز کیش کے ذریعے جزوی ادائیگی موصول ہوئی'
  },
  {
    id: 'tx-3',
    partyId: 'party-2',
    date: '2026-10-23',
    type: 'give',
    amount: 42000,
    note: 'ہول سیل سامان کی سپلائی (انوائس # 208)'
  },
  {
    id: 'tx-4',
    partyId: 'party-3',
    date: '2026-10-20',
    type: 'receive',
    amount: 15000,
    note: 'کمپنی سپلائر کو چیک کے ذریعے ادائیگی'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'کسٹمر کے لیے میڈیکل اسٹور سافٹ ویئر کی تنصیب',
    description: 'بارکوڈ پرنٹر کی کیلیبریشن اور ادویات کے 1200 آئٹمز کی ایکسل شیٹ امپورٹ کرنا',
    priority: 'high',
    status: 'inprogress',
    dueDate: 'کل تک',
    assignee: 'عمران علی (سینئر ڈویلپر)'
  },
  {
    id: 'task-2',
    title: 'اسکول فیس چالان پر کیو آر کوڈ (QR Code) کا اضافہ',
    description: 'بینک الفلاح اور جاز کیش کی آن لائن فیس ادائیگی کے لیے کیو آر کوڈ لگانا',
    priority: 'medium',
    status: 'todo',
    dueDate: '27 اکتوبر',
    assignee: 'حمزہ احمد'
  },
  {
    id: 'task-3',
    title: 'ریسٹورنٹ کچن ڈسپلے KOT کی ٹیسٹنگ مکمل',
    description: 'ٹیبلٹ اور تھرمل پرنٹر کے درمیان لائیو ٹیسٹ 100% کامیاب ہو چکا ہے',
    priority: 'low',
    status: 'done',
    dueDate: 'آج',
    assignee: 'بلال شیخ'
  },
  {
    id: 'task-4',
    title: 'کھاتہ سافٹ ویئر میں واٹس ایپ میسجنگ ٹیمپلیٹ کا فیچر',
    description: 'صارفین ایک کلک سے اردو میں خودکار بیلنس اسٹیٹمنٹ گاہک کو بھیج سکیں',
    priority: 'high',
    status: 'inprogress',
    dueDate: 'آج شام',
    assignee: 'ٹیم لیڈ'
  }
];
