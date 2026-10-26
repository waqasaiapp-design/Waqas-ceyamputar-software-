import React from 'react';
import { 
  CheckCircle2, 
  Terminal, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Printer, 
  HardDrive, 
  MonitorSmartphone, 
  ArrowLeft,
  ArrowRight,
  Database,
  Code2
} from 'lucide-react';
import { LanguageMode, ScriptStyle } from '../types';

interface HeroResponseProps {
  language: LanguageMode;
  scriptStyle: ScriptStyle;
  onExploreDemos: () => void;
  onOpenArchitect: () => void;
  onOpenRequester: () => void;
  onViewCatalog: () => void;
}

export const HeroResponse: React.FC<HeroResponseProps> = ({
  language,
  scriptStyle,
  onExploreDemos,
  onOpenArchitect,
  onOpenRequester,
  onViewCatalog,
}) => {
  const isUrdu = language === 'urdu';
  const fontClass = scriptStyle === 'nastaliq' ? 'font-nastaliq' : 'font-naskh';

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Answer Header Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-300" style={{ animationDuration: '4s' }} />
            <span>
              {isUrdu ? 'آپ کے سوال کا باضابطہ جواب' : 'Aap Ke Sawal Ka Mukammal Jawab'}
            </span>
          </div>

          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug ${fontClass}`}>
            {isUrdu ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  جی ہاں!
                </span>{' '}
                میں آپ کے لیے ہر قسم کا جدید کمپیوٹر سافٹ ویئر بنا سکتا ہوں۔
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Jee Haan!
                </span>{' '}
                Main aap ke liye har qisam ka computer software bana sakta hoon.
              </>
            )}
          </h1>

          <p className={`text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed ${fontClass}`}>
            {isUrdu ? (
              'چاہے وہ دکان اور سپر اسٹور کا پوائنٹ آف سیل (POS) ہو، گاہکوں کا کھاتہ بک اور لیجر، اسکول یا کالج کا فیس چالان اور داخلہ سسٹم، ہسپتال و فارمیسی کا سافٹ ویئر، یا کوئی کسٹم ویب اور ڈیسک ٹاپ ایپلی کیشن — میں آپ کی ضروریات کے عین مطابق مکمل فنکشنل سافٹ ویئر تیار کر سکتا ہوں۔'
            ) : (
              'Chahe wo retail store ka Point of Sale (POS) ho, udhar khata book, school fee challan portal, pharmacy stock system ya custom database dashboard — main aap ki zaroorat ke mutabiq 100% working software tayar kar sakta hoon.'
            )}
          </p>

          {/* Quick CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreDemos}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Terminal className="w-5 h-5" />
              <span>{isUrdu ? 'لائیو چلتے ہوئے سافٹ ویئر ٹیسٹ کریں' : 'Live Working Software Test Karein'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenRequester}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500/50 font-semibold text-base transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{isUrdu ? 'اپنا مطلوبہ سافٹ ویئر بتائیں' : 'Apna Software Request Karein'}</span>
            </button>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <MonitorSmartphone className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-white text-base sm:text-lg mb-1 ${fontClass}`}>
              {isUrdu ? 'تمام ڈیوائسز پر دستیاب' : 'Har Device Par Ready'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isUrdu ? 'Windows کمپیوٹر، لیپ ٹاپ، اینڈرائیڈ ٹیبلٹ، اور آئی فون' : 'Windows PC, Mac, Laptop, Android & iPad'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-white text-base sm:text-lg mb-1 ${fontClass}`}>
              {isUrdu ? 'بغیر انٹرنیٹ (آف لائن) سپورٹ' : 'Offline Database Ready'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isUrdu ? 'انٹرنیٹ بند ہونے پر بھی بلنگ اور ریکارڈ کی روانی جاری' : 'Net na hone par bhi billing aur records chalta rahe'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-white text-base sm:text-lg mb-1 ${fontClass}`}>
              {isUrdu ? 'رسیدیں اور چالان پرنٹنگ' : 'Thermal & Laser Print'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isUrdu ? 'تھرمل رسید پرنٹر اور A4 لیزر پرنٹر پر اردو پرنٹنگ' : 'Thermal 80mm/58mm aur A4 Challans in Urdu'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-white text-base sm:text-lg mb-1 ${fontClass}`}>
              {isUrdu ? 'ڈیٹا کی 100% حفاظت' : 'Auto Backup & Security'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isUrdu ? 'خودکار بیک اپ، پاس ورڈ اور ملٹی یوزر پرمیشنز' : 'Daily backups, cashier logins & cloud sync'}
            </p>
          </div>
        </div>

        {/* Quick Discovery Cards */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isUrdu ? 'سافٹ ویئر تیاری کا عمل' : 'Development Workflow'}
              </span>
              <h2 className={`text-xl sm:text-2xl font-bold text-white mt-1 ${fontClass}`}>
                {isUrdu ? 'ہم کس طرح آپ کا مطلوبہ سافٹ ویئر تیار کرتے ہیں؟' : 'Hum software kaise tayar karte hain?'}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenArchitect}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>{isUrdu ? 'سافٹ ویئر آرکیٹیکٹ دیکھیں' : 'Blueprint Architecture'}</span>
              </button>
              <button
                onClick={onViewCatalog}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{isUrdu ? 'تمام اقسام کی فہرست' : 'All Software Types'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'ضروریات کا انتخاب' : 'Requirements'}
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'آپ بتاتے ہیں کہ آپ کو کس کاروبار یا مقصد کے لیے سافٹ ویئر چاہیے (دکان، اسکول، ہسپتال یا آفس)۔'
                  : 'Aap batate hain ke aap ko kis purpose ya business ke liye software chahiye.'}
              </p>
            </div>

            <div className="relative p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'اسکرینز و ڈیٹا بیس ڈیزائن' : 'UI & Database Schema'}
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'ڈیٹا بیس ٹیبلز، فیلڈز اور خوبصورت اردو/انگریزی یوزر انٹرفیس اسکرینز فوری ڈیزائن کی جاتی ہیں۔'
                  : 'Database schema, forms aur bilingual responsive screens design hoti hain.'}
              </p>
            </div>

            <div className="relative p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'کوڈنگ اور فیچرز تکمیل' : 'Full Coding & Logic'}
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'بارکوڈ، واٹس ایپ انوائس، کیلکولیشنز، پرنٹنگ، اور کھاتہ لاجک مکمل طور پر کوڈ کی جاتی ہے۔'
                  : 'Full functionality, calculations, receipt printing aur validation code tayar hota hai.'}
              </p>
            </div>

            <div className="relative p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h4 className="font-bold text-white text-sm">
                  {isUrdu ? 'لائیو رن اور انسٹالیشن' : 'Live Run & Export'}
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'سافٹ ویئر فوری طور پر لائیو براؤزر میں چلتا ہے اور ڈیسک ٹاپ ایپ کی صورت میں انسٹال ہو جاتا ہے۔'
                  : 'Software instant run hota hai aur desktop ya mobile par install ho jata hai.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
