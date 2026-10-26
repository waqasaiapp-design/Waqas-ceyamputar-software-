export type LanguageMode = 'urdu' | 'roman' | 'english';
export type ScriptStyle = 'naskh' | 'nastaliq';

export interface ProductItem {
  id: string;
  nameUrdu: string;
  nameRoman: string;
  nameEn: string;
  categoryUrdu: string;
  categoryRoman: string;
  price: number;
  stock: number;
  barcode: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface Invoice {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'udhar';
}

export interface KhataParty {
  id: string;
  name: string;
  phone: string;
  city: string;
  balance: number; // positive = we will receive (لینے ہیں), negative = we have to pay (دینے ہیں)
  lastUpdated: string;
}

export interface KhataTransaction {
  id: string;
  partyId: string;
  date: string;
  type: 'give' | 'receive'; // give = ادھار دیا (They owe us), receive = وصول کیا
  amount: number;
  note: string;
  invoiceNo?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inprogress' | 'done';
  dueDate: string;
  assignee: string;
}

export interface SoftwareCategory {
  id: string;
  titleUrdu: string;
  titleRoman: string;
  titleEn: string;
  icon: string;
  descriptionUrdu: string;
  descriptionRoman: string;
  featuresUrdu: string[];
  featuresRoman: string[];
  techStack: string[];
  platforms: string[];
  badge: string;
}

export interface BlueprintPreset {
  id: string;
  nameUrdu: string;
  nameRoman: string;
  taglineUrdu: string;
  industry: string;
  modules: {
    id: string;
    titleUrdu: string;
    titleRoman: string;
    descUrdu: string;
    defaultSelected: boolean;
  }[];
  databaseTables: {
    name: string;
    descriptionUrdu: string;
    columns: string[];
  }[];
  sampleScreens: string[];
  codePreview: string;
}
