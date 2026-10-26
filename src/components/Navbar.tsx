import React from 'react';
import { Cpu, Languages, Sparkles, Layers, Terminal, FileCode2, PhoneCall } from 'lucide-react';
import { LanguageMode, ScriptStyle } from '../types';

interface NavbarProps {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  scriptStyle: ScriptStyle;
  setScriptStyle: (style: ScriptStyle) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  scriptStyle,
  setScriptStyle,
  activeTab,
  setActiveTab,
  onRequestOpen,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('hero')}>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                <Cpu className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-naskh">
                  اردو سافٹ ویئر اسٹوڈیو
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  کمپیوٹر سافٹ ویئر لیب
                </span>
              </div>
              <p className="text-xs text-slate-400 font-latin hidden md:block">
                Custom Computer Software Architecture & Interactive Engineering
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'hero'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              تعارف و صلاحیتیں
            </button>
            <button
              onClick={() => setActiveTab('demos')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'demos'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>لائیو ورکنگ سافٹ ویئر</span>
            </button>
            <button
              onClick={() => setActiveTab('architect')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'architect'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span>سافٹ ویئر معمار (بلیو پرنٹ)</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>سافٹ ویئر اقسام و گائیڈ</span>
            </button>
          </nav>

          {/* Controls: Script & Request Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Style Switcher */}
            <button
              onClick={() => setScriptStyle(scriptStyle === 'nastaliq' ? 'naskh' : 'nastaliq')}
              title="رسم الخط تبدیل کریں"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">فونٹ:</span>
              <span className="font-semibold text-emerald-400">
                {scriptStyle === 'nastaliq' ? 'نستعلیق' : 'سادہ نسخ'}
              </span>
            </button>

            {/* Language Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setLanguage('urdu')}
                className={`px-2 py-1 text-xs rounded-md transition-all ${
                  language === 'urdu'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                اردو
              </button>
              <button
                onClick={() => setLanguage('roman')}
                className={`px-2 py-1 text-xs rounded-md transition-all font-latin ${
                  language === 'roman'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Roman
              </button>
            </div>

            {/* Request Software Button */}
            <button
              onClick={onRequestOpen}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>نیا سافٹ ویئر بنوائیں</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 px-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'hero' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          تعارف
        </button>
        <button
          onClick={() => setActiveTab('demos')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'demos' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>لائیو سافٹ ویئر</span>
        </button>
        <button
          onClick={() => setActiveTab('architect')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'architect' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>بلیو پرنٹ</span>
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'catalog' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>اقسام</span>
        </button>
      </div>
    </header>
  );
};
