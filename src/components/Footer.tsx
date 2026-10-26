import React from 'react';
import { Cpu, Heart, Sparkles, Terminal, Code2, ArrowUp } from 'lucide-react';
import { LanguageMode, ScriptStyle } from '../types';

interface FooterProps {
  language: LanguageMode;
  scriptStyle: ScriptStyle;
  onOpenRequester: () => void;
  onScrollTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  scriptStyle,
  onOpenRequester,
  onScrollTop,
}) => {
  const isUrdu = language === 'urdu';
  const fontClass = scriptStyle === 'nastaliq' ? 'font-nastaliq' : 'font-naskh';

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <span className={`text-xl font-bold text-white ${fontClass}`}>
                اردو سافٹ ویئر اسٹوڈیو
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {isUrdu
                ? 'کمپیوٹر سافٹ ویئر، بزنس پوائنٹ آف سیل (POS)، ادھار کھاتہ لیجر، اور کسٹم ویب ایپلی کیشنز کی تیاری کا سب سے جدید اور خودکار پلیٹ فارم۔'
                : 'Modern custom computer software architecture, point of sale solutions, and bespoke business systems.'}
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] pt-1 font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">React 19</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">TypeScript</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Tailwind CSS</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Offline SQLite</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Thermal POS Print</span>
            </div>
          </div>

          {/* Software Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isUrdu ? 'مقبول ترین سسٹمز' : 'Popular Systems'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 cursor-pointer">پوائنٹ آف سیل و بارکوڈ انوائس</li>
              <li className="hover:text-emerald-400 cursor-pointer">ادھار کھاتہ بک اور لیجر</li>
              <li className="hover:text-emerald-400 cursor-pointer">اسکول و کالج فیس چالان پورٹل</li>
              <li className="hover:text-emerald-400 cursor-pointer">ہسپتال و فارمیسی مینجمنٹ</li>
              <li className="hover:text-emerald-400 cursor-pointer">آٹو ورکشاپ جاب شیٹ سسٹم</li>
            </ul>
          </div>

          {/* Ready to order */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isUrdu ? 'نیا سافٹ ویئر شروع کریں' : 'Start New Project'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isUrdu
                ? 'اپنے کاروبار یا ادارے کا نام بتائیں، ہم فوری طور پر مکمل کوڈ تیار کر کے آپ کے سامنے پیش کر دیں گے۔'
                : 'Tell us your business idea in the chat, and we will code your custom software right away.'}
            </p>
            <button
              onClick={onOpenRequester}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ابھی آرڈر ڈرافٹ کریں</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © 2026 اردو سافٹ ویئر اسٹوڈیو | تمام حقوق محفوظ ہیں۔
          </p>
          <button
            onClick={onScrollTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <span>اوپر جائیں</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
