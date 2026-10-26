import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Copy, 
  Send, 
  Store, 
  Building, 
  GraduationCap, 
  Stethoscope, 
  Briefcase, 
  MessageSquare
} from 'lucide-react';
import { LanguageMode, ScriptStyle } from '../types';

interface ProjectRequesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageMode;
  scriptStyle: ScriptStyle;
  initialPreset?: string;
}

export const ProjectRequesterModal: React.FC<ProjectRequesterModalProps> = ({
  isOpen,
  onClose,
  language,
  scriptStyle,
  initialPreset,
}) => {
  const isUrdu = language === 'urdu';
  const fontClass = scriptStyle === 'nastaliq' ? 'font-nastaliq' : 'font-naskh';

  const [businessType, setBusinessType] = useState(initialPreset || 'جنرل اسٹور / سپر مارٹ');
  const [softwareName, setSoftwareName] = useState('');
  const [targetDevice, setTargetDevice] = useState('Windows کمپیوٹر و لیپ ٹاپ');
  const [features, setFeatures] = useState<string[]>([
    'بارکوڈ اسکیننگ و پرنٹنگ',
    'تھرمل رسید پرنٹنگ (80mm/58mm)',
    'ادھار کھاتہ و گاہکوں کا لیجر',
    'آف لائن موڈ (بغیر انٹرنیٹ کام کرنا)',
    'روزانہ سیلز و منافع کی تفصیلی رپورٹ'
  ]);
  const [extraNotes, setExtraNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const availableFeatures = [
    'بارکوڈ اسکیننگ و پرنٹنگ',
    'تھرمل رسید پرنٹنگ (80mm/58mm)',
    'ادھار کھاتہ و گاہکوں کا لیجر',
    'واٹس ایپ پر رسید / بل بھیجنا',
    'آف لائن موڈ (بغیر انٹرنیٹ کام کرنا)',
    'ایکسل فائل سے اسٹاک امپورٹ / ایکسپورٹ',
    'کیشئر اور ایڈمن کا الگ لاگ ان',
    'کم اسٹاک ہونے پر وارننگ الرٹ',
    'ایکسپائری ڈیٹ مانیٹرنگ (فارمیسی کے لیے)'
  ];

  const toggleFeature = (f: string) => {
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const generatedBrief = `السلام علیکم!
مجھے اپنے کاروبار کے لیے درج ذیل کمپیوٹر سافٹ ویئر بنوانا ہے:
- کاروباری شعبہ: ${businessType}
- سافٹ ویئر کا نام / عنوان: ${softwareName || businessType}
- جس ڈیوائس پر چلانا ہے: ${targetDevice}
- ضروری فیچرز:
${features.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}
${extraNotes ? `- مزید تفصیلات: ${extraNotes}\n` : ''}
برائے مہربانی یہ سافٹ ویئر تیار کرنا شروع کر دیں۔ شکریہ!`;

  const copyBrief = () => {
    navigator.clipboard.writeText(generatedBrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/25 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'نیا سافٹ ویئر آرڈر ڈرافٹر' : 'Custom Software Specification Builder'}</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold text-white ${fontClass}`}>
            {isUrdu ? 'اپنا مطلوبہ کمپیوٹر سافٹ ویئر بتائیں' : 'Tell Us What Software You Need'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isUrdu
              ? 'چند ضروری سوالات کے جواب دیں، اور آپ کی مکمل درخواست خودکار تیار ہو جائے گی جسے آپ کاپی کر کے ہمیں چیٹ میں بھیج سکتے ہیں۔'
              : 'Configure your requirements below to generate a tailored project brief.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs">
          
          {/* Quick Category Buttons */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              1. کس کاروبار یا ادارے کے لیے چاہیے؟
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'جنرل اسٹور / سپر مارٹ',
                'میڈیکل اسٹور و فارمیسی',
                'اسکول / کالج پورٹل',
                'ریسٹورنٹ و کیفے',
                'ہول سیل و گودام انوینٹری',
                'آٹو ورکشاپ و سروس سینٹر'
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setBusinessType(cat)}
                  className={`p-2.5 rounded-xl border text-right font-semibold transition-all ${
                    businessType === cat
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Software Name / Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                2. سافٹ ویئر یا دکان کا نام (اختیاری):
              </label>
              <input
                type="text"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                placeholder="مثلاً: المدینہ سپر اسٹور سافٹ ویئر"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                3. کس ڈیوائس پر استعمال کریں گے؟
              </label>
              <select
                value={targetDevice}
                onChange={(e) => setTargetDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Windows کمپیوٹر و لیپ ٹاپ">Windows کمپیوٹر و لیپ ٹاپ</option>
                <option value="اینڈرائیڈ ٹیبلٹ (Touch POS)">اینڈرائیڈ ٹیبلٹ (Touch POS)</option>
                <option value="آن لائن کلاؤڈ ویب براؤزر">آن لائن کلاؤڈ ویب براؤزر</option>
                <option value="تمام ڈیوائسز (ملٹی یوزر)">تمام ڈیوائسز (ملٹی یوزر)</option>
              </select>
            </div>
          </div>

          {/* Features Selection */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              4. آپ کو کون سے فیچرز لازمی چاہیے؟ (ٹک کریں)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableFeatures.map((feat) => {
                const isChecked = features.includes(feat);
                return (
                  <div
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs">{feat}</span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                        isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                      }`}
                    >
                      {isChecked && '✓'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extra Notes */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">
              5. کوئی خاص بات یا اضافی ضرورت:
            </label>
            <input
              type="text"
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="مثلاً: میرے پاس 80mm کا تھرمل پرنٹر اور بارکوڈ گن موجود ہے..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Generated Preview Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mt-4">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              تیار شدہ پیغام کا پیش منظر:
            </span>
            <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap font-naskh leading-relaxed max-h-32 overflow-y-auto">
              {generatedBrief}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={copyBrief}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>درخواست کاپی ہو گئی! چیٹ میں پیسٹ کریں ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>یہ درخواست کاپی کریں اور چیٹ میں بھیجیں</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              بند کریں
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
