import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Monitor, 
  Upload, 
  RotateCcw, 
  Check, 
  HardDrive, 
  Building, 
  Sliders,
  FileCheck
} from 'lucide-react';
import { BrandingSettings, SidebarBannerSettings, SaleBannerSettings } from '../../types/pos';
import { DEFAULT_BRANDING, DEFAULT_SIDEBAR_BANNER, DEFAULT_SALE_BANNER } from '../../data/posData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'branding' | 'sidebar' | 'banner' | 'desktop';
  branding: BrandingSettings;
  setBranding: (b: BrandingSettings) => void;
  sidebarBanner: SidebarBannerSettings;
  setSidebarBanner: (s: SidebarBannerSettings) => void;
  saleBanner: SaleBannerSettings;
  setSaleBanner: (b: SaleBannerSettings) => void;
  onResetFactoryData: () => void;
  onResetStockToZero?: () => void;
  onResetHisabToZero?: () => void;
  onRemoveAllProducts?: () => void;
  onLoadDemoProducts?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'branding',
  branding,
  setBranding,
  sidebarBanner,
  setSidebarBanner,
  saleBanner,
  setSaleBanner,
  onResetFactoryData,
  onResetStockToZero,
  onResetHisabToZero,
  onRemoveAllProducts,
  onLoadDemoProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'sidebar' | 'banner' | 'desktop'>(initialTab);
  
  // Temporary edit buffers for cancellation capability
  const [tempBranding, setTempBranding] = useState<BrandingSettings>({ ...branding });
  const [tempSidebar, setTempSidebar] = useState<SidebarBannerSettings>({ ...sidebarBanner });
  const [tempSaleBanner, setTempSaleBanner] = useState<SaleBannerSettings>({ ...saleBanner });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle local file uploads for Sidebar Banner
  const handleSidebarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempSidebar((prev) => ({
          ...prev,
          image: reader.result as string,
          isCustom: true,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local file uploads for Sale Banner
  const handleSaleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempSaleBanner((prev) => ({
          ...prev,
          image: reader.result as string,
          isCustom: true,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    setBranding(tempBranding);
    localStorage.setItem('waqas_pos_branding', JSON.stringify(tempBranding));
    setSaveSuccessMsg('Branding and Software Name updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveSidebar = () => {
    setSidebarBanner(tempSidebar);
    localStorage.setItem('waqas_pos_sidebar_banner', JSON.stringify(tempSidebar));
    setSaveSuccessMsg('Sidebar picture and settings saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveSaleBanner = () => {
    setSaleBanner(tempSaleBanner);
    localStorage.setItem('waqas_pos_sale_banner', JSON.stringify(tempSaleBanner));
    setSaveSuccessMsg('Sale banner picture and text saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const restoreSidebarDefault = () => {
    setTempSidebar({ ...DEFAULT_SIDEBAR_BANNER });
    setSidebarBanner({ ...DEFAULT_SIDEBAR_BANNER });
    localStorage.removeItem('waqas_pos_sidebar_banner');
    setSaveSuccessMsg('Restored original sidebar picture!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const restoreSaleBannerDefault = () => {
    setTempSaleBanner({ ...DEFAULT_SALE_BANNER });
    setSaleBanner({ ...DEFAULT_SALE_BANNER });
    localStorage.removeItem('waqas_pos_sale_banner');
    setSaveSuccessMsg('Restored original sale banner picture!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00b852] flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                POS System Settings — WAQAS SOFTWARE
              </h2>
              <p className="text-[11px] text-slate-400">
                Custom Branding, Replaceable Promotional Pictures & Windows Desktop Config
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('branding')}
            className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'branding'
                ? 'border-[#00b852] text-[#00b852]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Software Name & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('sidebar')}
            className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'sidebar'
                ? 'border-[#00b852] text-[#00b852]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>2. Sidebar Promotional Picture</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'banner'
                ? 'border-[#00b852] text-[#00b852]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Bottom Sale Banner Picture</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`pb-3 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'desktop'
                ? 'border-[#00b852] text-[#00b852]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>4. Windows Desktop EXE</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: BRANDING & SOFTWARE NAME (Requirement 2) */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Software Display Name (Default: WAQAS SOFTWARE)
                  </label>
                  <input
                    type="text"
                    value={tempBranding.softwareName}
                    onChange={(e) => setTempBranding({ ...tempBranding, softwareName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00b852]"
                  />
                </div>

                {/* Quick Presets Buttons */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Quick Preset Names:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['WAQAS SOFTWARE', 'WAQAS COMPUTER SOFTWARE', 'WAQAS MART', 'AL-MADINA SUPERMARKET'].map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setTempBranding({ ...tempBranding, softwareName: name, sidebarFooterName: name })}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:border-[#00b852] font-semibold text-[11px] transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Header Tagline / Slogan
                    </label>
                    <input
                      type="text"
                      value={tempBranding.tagline}
                      onChange={(e) => setTempBranding({ ...tempBranding, tagline: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Sidebar Pill Text
                    </label>
                    <input
                      type="text"
                      value={tempBranding.sidebarBadgeText}
                      onChange={(e) => setTempBranding({ ...tempBranding, sidebarBadgeText: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Store Address (On Receipts)
                    </label>
                    <input
                      type="text"
                      value={tempBranding.storeAddress}
                      onChange={(e) => setTempBranding({ ...tempBranding, storeAddress: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Store Phone / Helpline
                    </label>
                    <input
                      type="text"
                      value={tempBranding.storePhone}
                      onChange={(e) => setTempBranding({ ...tempBranding, storePhone: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* Branding Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTempBranding({ ...branding })}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBranding}
                  className="px-5 py-2 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Branding Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIDEBAR PROMOTIONAL PICTURE (Requirement 3) */}
          {activeTab === 'sidebar' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  
                  {/* Live Sidebar Preview */}
                  <div className="w-48 shrink-0 rounded-2xl bg-gradient-to-b from-[#063820] to-[#032012] p-3 text-center border border-emerald-500/40 relative overflow-hidden shadow-md">
                    {tempSidebar.image && (
                      <div
                        className="absolute inset-0 opacity-40 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${tempSidebar.image})`,
                          backgroundSize: tempSidebar.fit || 'cover',
                        }}
                      />
                    )}
                    <div className="relative z-10 space-y-2 py-1">
                      <h4 className="text-white font-black text-xs whitespace-pre-line leading-tight">
                        {tempSidebar.heading}
                      </h4>
                      <div className="text-2xl">🛒🥦</div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#00b852] text-white text-[10px] font-bold">
                        {tempSidebar.pillText || tempBranding.sidebarBadgeText}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        Choose Picture from Computer (PNG, JPG, JPEG)
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleSidebarFileUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00b852] file:text-white hover:file:bg-[#009c45] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Or Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={tempSidebar.image}
                        onChange={(e) => setTempSidebar({ ...tempSidebar, image: e.target.value, isCustom: true })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Card Heading</label>
                        <input
                          type="text"
                          value={tempSidebar.heading}
                          onChange={(e) => setTempSidebar({ ...tempSidebar, heading: e.target.value })}
                          className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Picture Fit</label>
                        <select
                          value={tempSidebar.fit}
                          onChange={(e: any) => setTempSidebar({ ...tempSidebar, fit: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-slate-300 text-xs"
                        >
                          <option value="cover">Cover (Fill & Crop)</option>
                          <option value="contain">Contain (Fit Whole)</option>
                          <option value="fill">Fill (Stretch)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={restoreSidebarDefault}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default Picture</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTempSidebar({ ...sidebarBanner })}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSidebar}
                    className="px-5 py-2 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Sidebar Picture</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOTTOM SALE BANNER PICTURE (Requirement 4) */}
          {activeTab === 'banner' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                
                {/* Live Banner Preview */}
                <div className="rounded-2xl bg-gradient-to-r from-[#063f25] via-[#094d2f] to-[#04331d] text-white p-4 flex items-center justify-between relative overflow-hidden shadow-sm">
                  {tempSaleBanner.image && (
                    <div
                      className="absolute inset-0 opacity-30 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${tempSaleBanner.image})`,
                        backgroundSize: tempSaleBanner.fit || 'cover',
                      }}
                    />
                  )}
                  <div className="relative z-10 leading-tight">
                    <h4 className="text-base font-black text-white">{tempSaleBanner.heading}</h4>
                    <p className="text-xs text-emerald-200 font-semibold mt-0.5">{tempSaleBanner.subtitle}</p>
                  </div>
                  <div className="relative z-10 text-3xl">🧺🥦🍅</div>
                </div>

                {/* Banner Controls */}
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Upload Picture from Computer (PNG, JPG, JPEG)
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleSaleBannerFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00b852] file:text-white hover:file:bg-[#009c45] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Or Banner Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={tempSaleBanner.image}
                      onChange={(e) => setTempSaleBanner({ ...tempSaleBanner, image: e.target.value, isCustom: true })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Banner Heading</label>
                      <input
                        type="text"
                        value={tempSaleBanner.heading}
                        onChange={(e) => setTempSaleBanner({ ...tempSaleBanner, heading: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={tempSaleBanner.subtitle}
                        onChange={(e) => setTempSaleBanner({ ...tempSaleBanner, subtitle: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={restoreSaleBannerDefault}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Original Picture</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTempSaleBanner({ ...saleBanner })}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSaleBanner}
                    className="px-5 py-2 rounded-xl bg-[#00b852] hover:bg-[#009c45] text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Banner Picture</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WINDOWS DESKTOP APP & PACKAGING (Requirement 7) */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    🪟
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Windows Desktop Compatibility & Packaging Guide
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Compatible with Windows 10 & Windows 11 (64-bit / 32-bit)
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      1. Method A: Desktop App via Nativefier / Electron EXE
                    </span>
                    <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                      npx nativefier --name "WAQAS SOFTWARE" "http://localhost:3000" --icon icon.ico
                    </pre>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">
                      2. Method B: Windows 10/11 PWA App (One-Click Chrome/Edge Install)
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Open this application in Google Chrome or Microsoft Edge on your POS machine, click the "Install App" icon in the address bar. It creates a dedicated Windows taskbar & desktop shortcut with zero browser tabs!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Offline Database & Storage Status</span>
                      <span className="text-slate-500 text-[11px]">Local IndexedDB / LocalStorage active. Works 100% without active internet.</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Operational
                    </span>
                  </div>
                </div>

                {/* Reset Data Danger Zone */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  {/* Remove All Products (User's specific requirement: is app pehle say kuch naho etam) */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <div>
                      <span className="font-bold text-rose-900 block text-xs">Remove All Items / Empty Inventory (تمام پروڈکٹس ختم کریں)</span>
                      <span className="text-rose-700 text-[11px]">Remove all products from the catalog so the app starts with 0 items. You can add your own items from scratch.</span>
                    </div>
                    {onRemoveAllProducts && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('کیا آپ تمام پروڈکٹس کو کیٹلاگ سے ختم کرنا چاہتے ہیں تاکہ ایپ میں پہلے سے کوئی آئٹم نہ ہو؟\nAre you sure you want to remove ALL products from the store?')) {
                            onRemoveAllProducts();
                            onClose();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        Remove All Items
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div>
                      <span className="font-bold text-amber-900 block text-xs">Set All Stock to 0 (اسٹاک زیرو کریں)</span>
                      <span className="text-amber-700 text-[11px]">Set current inventory quantity of all products to 0 without deleting products.</span>
                    </div>
                    {onResetStockToZero && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('کیا آپ تمام پراڈکٹس کا اسٹاک 0 کرنا چاہتے ہیں؟\nAre you sure you want to set stock of all products to 0?')) {
                            onResetStockToZero();
                            onClose();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        Set Stock to 0
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <div>
                      <span className="font-bold text-purple-900 block text-xs">Reset All Accounts & Hisab to 0 (تمام حساب زیرو کریں)</span>
                      <span className="text-purple-700 text-[11px]">Clear all completed sales, billing history, held bills, and supplier ledger balances.</span>
                    </div>
                    {onResetHisabToZero && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('کیا آپ تمام سیلز اور یومیہ حساب 0 کرنا چاہتے ہیں؟\nAre you sure you want to reset all accounts and sales history to 0?')) {
                            onResetHisabToZero();
                            onClose();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        Reset Hisab to 0
                      </button>
                    )}
                  </div>

                  {/* Load Sample Demo Products on demand */}
                  {onLoadDemoProducts && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div>
                        <span className="font-bold text-emerald-900 block text-xs">Load Sample Products (ڈیمو آئٹمز لوڈ کریں)</span>
                        <span className="text-emerald-700 text-[11px]">Load standard supermarket sample items for testing if ever needed.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Load standard supermarket sample products for testing?')) {
                            onLoadDemoProducts();
                            onClose();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        Load Sample Items
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="font-bold text-rose-700 block text-xs">Full Software Reset (0 Items & 0 Hisab)</span>
                      <span className="text-slate-500 text-[11px]">Completely wipe all store data and start completely fresh.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset all software data completely? All items and records will be set to 0.')) {
                          onResetFactoryData();
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 border border-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Factory Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
