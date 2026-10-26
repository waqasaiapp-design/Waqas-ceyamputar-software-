import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Scan, 
  Calendar, 
  User, 
  ChevronDown, 
  Wifi, 
  Settings, 
  Minus, 
  Square, 
  X 
} from 'lucide-react';
import { BrandingSettings } from '../types/pos';

interface TopHeaderProps {
  branding: BrandingSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenScanner: () => void;
  onOpenSettings: (initialTab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  branding,
  searchQuery,
  setSearchQuery,
  onOpenScanner,
  onOpenSettings,
  onSearchSubmit,
}) => {
  return (
    <header className="h-[76px] w-[1536px] bg-white border-b border-slate-200/90 px-6 flex items-center justify-between select-none shrink-0 z-30">
      
      {/* 1. Left: Brand Logo & Title */}
      <div 
        className="flex items-center gap-3.5 cursor-pointer"
        onClick={() => onOpenSettings('branding')}
        title="Settings: Customize Software Name, Logo & Branding"
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <div className="relative">
            <ShoppingCart className="w-9 h-9 stroke-[2.3] text-[#00b852]" />
            <span className="absolute -left-2 top-1 w-2.5 h-0.5 bg-[#00b852] rounded-full"></span>
            <span className="absolute -left-2.5 top-3 w-3.5 h-0.5 bg-[#00b852] rounded-full"></span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0f172a] uppercase font-sans leading-none">
            {branding.softwareName || 'WAQAS MART'}
          </h1>
          <p className="text-xs font-semibold text-slate-500 tracking-tight mt-1">
            {branding.tagline || 'Quality Products • Better Life'}
          </p>
        </div>
      </div>

      {/* 2. Center: Barcode Search Bar */}
      <div className="w-[520px]">
        <form onSubmit={onSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search or Scan Barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-12 rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00b852]/30 focus:border-[#00b852] transition-all"
          />
          <button
            type="button"
            onClick={onOpenScanner}
            title="Open Barcode & Camera Scanner"
            className="w-9 h-9 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white flex items-center justify-center absolute right-1 shadow-sm active:scale-95 transition-all"
          >
            <Scan className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Right: Date/Time, User Profile, Status & Windows Controls */}
      <div className="flex items-center gap-5">
        
        {/* Date and Time Display */}
        <div className="flex items-center gap-2.5 text-slate-700">
          <Calendar className="w-5 h-5 text-[#00b852]" />
          <div className="text-left leading-tight text-xs">
            <span className="font-bold block text-slate-800 font-sans">
              26 Oct 2026
            </span>
            <span className="text-[11px] text-slate-500 block font-sans">
              12:45 PM
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1 pr-1.5 py-1 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#00b852] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <div className="leading-tight text-left">
            <span className="text-xs font-bold block text-slate-900">Admin</span>
            <span className="text-[11px] text-slate-500 block">POS User</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Wi-Fi Online Icon */}
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#00b852] cursor-pointer" 
          title="Online - Connected to Database"
        >
          <Wifi className="w-5 h-5" />
        </div>

        {/* Settings Button */}
        <button
          onClick={() => onOpenSettings()}
          title="Software Settings (Branding, Pictures, Hardware)"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Windows Title Bar Controls */}
        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
          <button
            onClick={() => {}}
            title="Minimize"
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {}}
            title="Maximize"
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {}}
            title="Close"
            className="w-7 h-7 rounded hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
