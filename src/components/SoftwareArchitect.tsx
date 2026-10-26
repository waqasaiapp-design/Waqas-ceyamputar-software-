import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Layout, 
  ShieldCheck, 
  Cpu, 
  Copy, 
  Check, 
  Sparkles, 
  Boxes, 
  ArrowRight, 
  CheckSquare, 
  Square,
  Download,
  Code
} from 'lucide-react';
import { LanguageMode, ScriptStyle, BlueprintPreset } from '../types';
import { BLUEPRINT_PRESETS } from '../data/softwareCategories';

interface SoftwareArchitectProps {
  language: LanguageMode;
  scriptStyle: ScriptStyle;
  onRequestSoftware: (presetName?: string) => void;
}

export const SoftwareArchitect: React.FC<SoftwareArchitectProps> = ({
  language,
  scriptStyle,
  onRequestSoftware,
}) => {
  const isUrdu = language === 'urdu';
  const fontClass = scriptStyle === 'nastaliq' ? 'font-nastaliq' : 'font-naskh';

  const [selectedPresetId, setSelectedPresetId] = useState<string>(BLUEPRINT_PRESETS[0].id);
  const [selectedModules, setSelectedModules] = useState<string[]>(
    BLUEPRINT_PRESETS[0].modules.filter((m) => m.defaultSelected).map((m) => m.id)
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  const activePreset = BLUEPRINT_PRESETS.find((p) => p.id === selectedPresetId) || BLUEPRINT_PRESETS[0];

  const handleSelectPreset = (preset: BlueprintPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedModules(preset.modules.filter((m) => m.defaultSelected).map((m) => m.id));
  };

  const toggleModule = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const copyBlueprintText = () => {
    const text = `=== سافٹ ویئر بلیو پرنٹ دستاویز ===
سافٹ ویئر کا نام: ${activePreset.nameUrdu} (${activePreset.nameRoman})
شعبہ: ${activePreset.industry}
منتخب ماڈیولز: ${selectedModules.join(', ')}
ڈیٹا بیس ٹیبلز: ${activePreset.databaseTables.map((t) => t.name).join(', ')}
اسکرینز: ${activePreset.sampleScreens.join(', ')}
ٹیکنالوجی: React, TypeScript, Tailwind CSS, SQLite/PostgreSQL`;
    navigator.clipboard.writeText(text);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(activePreset.codePreview);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <section id="architect" className="py-12 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/25 mb-3">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'انٹرایکٹو سافٹ ویئر معمار' : 'Interactive Software Architect'}</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold text-white ${fontClass}`}>
            {isUrdu ? 'کسی بھی سافٹ ویئر کا ڈیٹا بیس و خاکہ خود بنائیں' : 'Software Architecture & Database Blueprint Builder'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            {isUrdu
              ? 'اپنے مطلوبہ شعبے کا انتخاب کریں، فیچرز اور ماڈیولز ٹک کریں، اور ریئل ٹائم میں مکمل ڈیٹا بیس اسکیما اور کوڈ اسٹرکچر دیکھیں!'
              : 'Select your industry, toggle features, and explore real-time generated database schemas and production code patterns.'}
          </p>
        </div>

        {/* Presets Horizontal Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {BLUEPRINT_PRESETS.map((preset) => {
            const isSelected = preset.id === activePreset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                  {preset.industry}
                </span>
                <h4 className={`font-bold text-white text-sm sm:text-base mt-2 line-clamp-1 ${fontClass}`}>
                  {isUrdu ? preset.nameUrdu : preset.nameRoman}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {preset.taglineUrdu}
                </p>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                    <Check className="w-3.5 h-3.5" /> منتخب شدہ
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Architect Workspace: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Modules & Features Config (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    {isUrdu ? 'سافٹ ویئر کے لازمی ماڈیولز' : 'Core Software Modules'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedModules.length} منتخب
                </span>
              </div>

              <div className="space-y-2.5">
                {activePreset.modules.map((mod) => {
                  const isChecked = selectedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-slate-950/90 border-cyan-500/50 text-white'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-cyan-400">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-200">
                            {isUrdu ? mod.titleUrdu : mod.titleRoman}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {mod.descUrdu}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => onRequestSoftware(activePreset.nameUrdu)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isUrdu ? 'یہ سافٹ ویئر میرے لیے تیار کریں' : 'Build This Software For Me'}</span>
                </button>

                <button
                  onClick={copyBlueprintText}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  {copiedBlueprint ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">بلیو پرنٹ کاپی ہو گیا!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>بلیو پرنٹ رپورٹ کاپی کریں</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Database Schema & Technical Architecture (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Database Schema Visualizer */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">
                    {isUrdu ? 'خودکار جنریٹ شدہ ڈیٹا بیس اسکیما (Database Tables)' : 'Generated Database Schema'}
                  </h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  PostgreSQL / SQLite
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePreset.databaseTables.map((table) => (
                  <div
                    key={table.name}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="font-mono font-bold text-xs text-cyan-300">
                        📁 {table.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {table.columns.length} کالمز
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {table.descriptionUrdu}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {table.columns.map((col) => (
                        <span
                          key={col}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Screens Breakdown */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-indigo-400" />
                  <span>{isUrdu ? 'تیار ہونے والی اسکرینز و فارمز:' : 'Included User Interface Screens:'}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activePreset.sampleScreens.map((screen) => (
                    <span
                      key={screen}
                      className="text-xs px-3 py-1 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/60"
                    >
                      🖥️ {screen}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Pattern Preview */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-white">
                    {isUrdu ? 'کوڈ کا پیش منظر (TypeScript & React Component)' : 'Production Code Blueprint'}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'کاپی ہوا' : 'کوڈ کاپی'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
                {activePreset.codePreview}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
