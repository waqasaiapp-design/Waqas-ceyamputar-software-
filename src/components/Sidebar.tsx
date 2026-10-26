import React from 'react';
import { 
  ShoppingCart, 
  Store, 
  ClipboardList, 
  RotateCcw, 
  FileSpreadsheet, 
  Box, 
  Users, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Video, 
  Search, 
  Smartphone, 
  ChevronRight,
  Edit3,
  Home
} from 'lucide-react';
import { ActiveSidebarTab, BrandingSettings, SidebarBannerSettings } from '../types/pos';

interface SidebarProps {
  activeTab: ActiveSidebarTab;
  setActiveTab: (tab: ActiveSidebarTab) => void;
  branding: BrandingSettings;
  sidebarBanner: SidebarBannerSettings;
  onOpenSettings: (tab?: 'branding' | 'sidebar' | 'banner' | 'desktop') => void;
  onOpenDailyHisab: () => void;
  onOpenSalesHistory: () => void;
  onOpenStockModal: () => void;
  onOpenReportsModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  branding,
  sidebarBanner,
  onOpenSettings,
  onOpenDailyHisab,
  onOpenSalesHistory,
  onOpenStockModal,
  onOpenReportsModal,
}) => {
  const menuItems: { id: ActiveSidebarTab; label: string; icon: React.ReactNode; action?: () => void }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'Sale', label: 'Sales / POS', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'Purchase', label: 'Purchase Entry', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'Purchase Orders', label: 'Purchase Orders', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'Stock Management', label: 'Stock Management', icon: <Box className="w-4 h-4" /> },
    { id: 'Sales History', label: 'Sales History', icon: <ClipboardList className="w-4 h-4" />, action: onOpenSalesHistory },
    { id: 'Sales Return', label: 'Sales Return', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'Total Stock', label: 'Total Stock', icon: <Box className="w-4 h-4" />, action: onOpenStockModal },
    { id: 'Customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'Suppliers', label: 'Suppliers', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'Daily Hisab', label: 'Daily Hisab', icon: <Calendar className="w-4 h-4" />, action: onOpenDailyHisab },
    { id: 'Reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, action: onOpenReportsModal },
    { id: 'CCTV Cameras', label: 'CCTV Cameras', icon: <Video className="w-4 h-4" /> },
    { id: 'Google Search', label: 'Google Search', icon: <Search className="w-4 h-4" /> },
    { id: 'Device Management', label: 'Device Management', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-[236px] h-[914px] shrink-0 bg-[#061224] text-slate-300 flex flex-col justify-between select-none border-r border-slate-800/60 overflow-hidden">
      
      {/* Menu Navigation */}
      <div className="p-2 space-y-0.5 overflow-y-auto max-h-[690px]">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.action) item.action();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#00b852] text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      {/* Bottom Promotional Picture & Footer Status */}
      <div className="p-2.5 space-y-1.5 mt-auto bg-[#061224]">
        
        {/* Replaceable Sidebar Picture (Requirement 3) */}
        <div 
          onClick={() => onOpenSettings('sidebar')}
          className="relative rounded-2xl overflow-hidden cursor-pointer group border border-emerald-600/40 bg-[#082e1c] h-[135px] flex flex-col justify-between p-2.5 text-center shadow-md hover:ring-2 hover:ring-[#00b852] transition-all"
          title="Click to Change Sidebar Picture in Settings"
        >
          {/* Background image: Default cropped artwork or custom image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-102"
            style={{ 
              backgroundImage: `url(${sidebarBanner.image || '/products/sidebar_banner_art.png'})`,
              backgroundSize: sidebarBanner.fit || 'cover'
            }}
          />

          {/* Edit Badge overlay on hover */}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-emerald-300 p-1 rounded-full text-[9px] z-10">
            <Edit3 className="w-3 h-3" />
          </div>

          {/* Pill text button at bottom */}
          <div className="relative z-10 mt-auto">
            <div className="inline-block px-3 py-0.5 rounded-full bg-[#00b852] text-white text-[10px] font-bold shadow-xs">
              {sidebarBanner.pillText || branding.sidebarBadgeText || branding.softwareName || 'WAQAS MART'}
            </div>
          </div>
        </div>

        {/* Sidebar Footer System Tag */}
        <div className="px-1.5 py-0.5 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00b852] shrink-0"></span>
          <span className="font-bold text-slate-200 truncate">
            {branding.sidebarFooterName || branding.softwareName || 'WAQAS MART'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 shrink-0">POS System</span>
        </div>

      </div>

    </aside>
  );
};
