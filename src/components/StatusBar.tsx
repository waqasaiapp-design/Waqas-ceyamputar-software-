import React, { useState } from 'react';
import { Lock, Unlock, Database } from 'lucide-react';

interface StatusBarProps {
  deviceCode: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ deviceCode }) => {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <footer className="w-[1536px] h-[34px] bg-[#071120] text-slate-300 px-4 flex items-center justify-between text-[11px] font-medium border-t border-slate-800 select-none shrink-0 z-30">
      
      {/* Left: Online Status & Device ID */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-[#00b852]"></span>
          <span className="font-semibold text-white">Online</span>
        </div>

        <div className="flex items-center gap-1 font-mono text-slate-300">
          <span className="text-slate-400">Device ID:</span>
          <span className="text-white font-semibold">{deviceCode || 'WM-001'}</span>
        </div>
      </div>

      {/* Center: App Lock Action */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsLocked(!isLocked)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-300 hover:text-white transition-colors"
          title="Click to toggle terminal lock"
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-semibold">App Locked</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>App Locked</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Date & Time */}
      <div className="flex items-center gap-2 font-mono text-slate-300 text-[11px]">
        <span>26 Oct 2026 12:45 PM</span>
      </div>

    </footer>
  );
};
