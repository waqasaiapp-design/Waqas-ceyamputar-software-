import React, { useState } from 'react';
import { 
  Layers, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Printer, 
  HardDrive, 
  WifiOff, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Barcode,
  Scale,
  CreditCard,
  Cloud,
  FileSpreadsheet
} from 'lucide-react';
import { LanguageMode, ScriptStyle, SoftwareCategory } from '../types';
import { SOFTWARE_CATEGORIES } from '../data/softwareCategories';

interface CapabilitiesGuideProps {
  language: LanguageMode;
  scriptStyle: ScriptStyle;
  onRequestCategory: (catTitle: string) => void;
}

export const CapabilitiesGuide: React.FC<CapabilitiesGuideProps> = ({
  language,
  scriptStyle,
  onRequestCategory,
}) => {
  const isUrdu = language === 'urdu';
  const fontClass = scriptStyle === 'nastaliq' ? 'font-nastaliq' : 'font-naskh';

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      qUrdu: 'کیا یہ سافٹ ویئر بغیر انٹرنیٹ (Offline) کمپیوٹر پر چل سکتا ہے؟',
      qRoman: 'Kya yeh software baghair internet (offline) computer par chal sakta hai?',
      aUrdu: 'جی ہاں بالکل! ہمارے تیار کردہ سافٹ ویئر میں مقامی آف لائن ڈیٹا بیس (Offline Local Storage & SQLite/IndexedDB) کی سہولت موجود ہوتی ہے۔ اگر انٹرنیٹ بند بھی ہو جائے تو بلنگ، کسٹمر اندراج اور پرنٹنگ بغیر کسی رکاوٹ کے چلتی رہتی ہے، اور نیٹ آنے پر خودکار کلاؤڈ بیک اپ ہو جاتا ہے۔',
      aRoman: 'Jee haan bilkul! Software offline mode mein 100% smoothly kaam karta hai. Net band hone par bhi billing aur receipts print hoti rehti hain.'
    },
    {
      qUrdu: 'کیا میرا پرانا ڈیٹا (ایکسل شیٹ یا رجسٹر کا حساب) سافٹ ویئر میں منتقل ہو سکتا ہے؟',
      qRoman: 'Kya mera purana Excel data software mein transfer ho sakta hai?',
      aUrdu: 'جی ہاں! ہم سافٹ ویئر میں "Excel Import & Export" فیچر شامل کرتے ہیں، جس کی مدد سے آپ کی تمام مصنوعات، قیمتیں، بارکوڈز اور گاہکوں کا پرانا ادھار ایک ہی کلک میں سافٹ ویئر میں اپ لوڈ ہو جاتا ہے۔',
      aRoman: 'Jee haan! Excel sheet se sara stock aur customer record aik click mein software mein upload ho jata hai.'
    },
    {
      qUrdu: 'کیا رسید پر میری دکان کا نام اور شرائط اردو میں پرنٹ ہوں گی؟',
      qRoman: 'Kya thermal receipt par Urdu mein dukan ka naam print hoga?',
      aUrdu: 'جی ہاں! تمام رسیدوں، بلوں اور چالان پر آپ کی دکان/ادارے کا نام، لوگو، فون نمبر، اور واپسی کی شرائط خوبصورت نستعلیق یا نسخ اردو میں پرنٹ ہوتی ہیں، اور انگریزی رسید کا آپشن بھی موجود رہتا ہے۔',
      aRoman: 'Jee haan! Thermal receipt par aap ki dukan ka naam, address aur rules Urdu font mein clear print hotay hain.'
    },
    {
      qUrdu: 'کیا ایک ہی دکان میں 2 یا زیادہ کمپیوٹرز پر ایک ساتھ کام ہو سکتا ہے؟',
      qRoman: 'Kya 2 ya zyada computers par aik sath billing ho sakti hai?',
      aUrdu: 'جی ہاں! لوکل نیٹ ورک (LAN) یا کلاؤڈ سرور کے ذریعے جتنے چاہیں کاؤنٹرز، کیشئرز اور ایڈمن پی سی کو ایک ہی مرکزی ڈیٹا بیس سے جوڑا جا سکتا ہے، جس سے سبھی کمپیوٹرز پر ریئل ٹائم اسٹاک خودکار اپ ڈیٹ ہوتا ہے۔',
      aRoman: 'Jee haan! Multi-counter network billing support mojood hai jahan multiple cashiers aik sath kaam kar saktay hain.'
    },
    {
      qUrdu: 'بارکوڈ اسکینر، تھرمل پرنٹر اور کیش دراز کیسے کنیکٹ ہوتے ہیں؟',
      qRoman: 'Barcode scanner aur thermal printer kaise connect hotay hain?',
      aUrdu: 'سافٹ ویئر تمام معیاری USB اور بلوٹوتھ بارکوڈ اسکینرز (1D/2D QR)، 80mm اور 58mm تھرمل پرنٹرز، وزن والی مشینوں (Digital Weight Scale) اور الیکٹرانک کیش دراز کے ساتھ پلگ اینڈ پلے سپورٹ رکھتا ہے۔',
      aRoman: 'USB aur Bluetooth thermal printers, barcode scanners aur cash drawers direct support kartay hain.'
    }
  ];

  return (
    <section id="catalog" className="py-14 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/25 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'جامع سافٹ ویئر کیٹلاگ و رہنمائی' : 'Software Catalog & Systems'}</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold text-white ${fontClass}`}>
            {isUrdu ? 'وہ تمام سافٹ ویئر جو ہم آپ کے لیے تیار کر سکتے ہیں' : 'All Computer Software Categories We Build'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            {isUrdu
              ? 'کاروباری، تعلیمی، طبی، صنعتی اور یوٹیلٹی سسٹمز کی مکمل تفصیلات مع خصوصیات'
              : 'Complete breakdown of business, educational, healthcare and utility software.'}
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOFTWARE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cat.badge}
                  </span>
                  <div className="flex gap-1">
                    {cat.platforms.slice(0, 2).map((p) => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className={`text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors ${fontClass}`}>
                  {isUrdu ? cat.titleUrdu : cat.titleRoman}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {isUrdu ? cat.descriptionUrdu : cat.descriptionRoman}
                </p>

                {/* Features List */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isUrdu ? 'نمایاں خصوصیات:' : 'Key Features:'}
                  </span>
                  {(isUrdu ? cat.featuresUrdu : cat.featuresRoman).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onRequestCategory(cat.titleUrdu)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'یہ سافٹ ویئر تیار کروائیں' : 'Request This System'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Supported Hardware & Compatibility Showcase */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className={`text-xl sm:text-2xl font-bold text-white ${fontClass}`}>
              {isUrdu ? 'ہارڈویئر و آلات کی ہم آہنگی (Hardware Compatibility)' : 'Hardware & Device Compatibility'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isUrdu
                ? 'ہمارا سافٹ ویئر آپ کے موجودہ کمپیوٹر اور ہارڈویئر کے ساتھ بغیر کسی اضافی خرچ کے کام کرتا ہے'
                : 'Plug & Play support with all your existing retail hardware'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <Printer className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h5 className="font-bold text-xs text-white">تھرمل رسید پرنٹر</h5>
              <p className="text-[10px] text-slate-400 mt-1">80mm & 58mm POS</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <Barcode className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <h5 className="font-bold text-xs text-white">بارکوڈ اسکینر</h5>
              <p className="text-[10px] text-slate-400 mt-1">1D / 2D QR Readers</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <Monitor className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <h5 className="font-bold text-xs text-white">ڈیسک ٹاپ و لیپ ٹاپ</h5>
              <p className="text-[10px] text-slate-400 mt-1">Windows 7, 10, 11</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <Tablet className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <h5 className="font-bold text-xs text-white">ٹیبلٹ و ٹچ اسکرین</h5>
              <p className="text-[10px] text-slate-400 mt-1">Android & iPad POS</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <Scale className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h5 className="font-bold text-xs text-white">ڈیجیٹل وزن مشین</h5>
              <p className="text-[10px] text-slate-400 mt-1">Weighing Scales</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <FileSpreadsheet className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <h5 className="font-bold text-xs text-white">ایکسل امپورٹ</h5>
              <p className="text-[10px] text-slate-400 mt-1">Excel & PDF Sheets</p>
            </div>

          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <HelpCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className={`text-xl sm:text-2xl font-bold text-white ${fontClass}`}>
              {isUrdu ? 'اکثر پوچھے جانے والے اہم سوالات (FAQ)' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 text-white hover:bg-slate-800/50 transition-colors"
                  >
                    <span className={`font-bold text-sm sm:text-base ${fontClass}`}>
                      {isUrdu ? faq.qUrdu : faq.qRoman}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {isUrdu ? faq.aUrdu : faq.aRoman}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
