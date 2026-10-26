import React from 'react';
import { X, Video, ShieldCheck, RefreshCw, Radio } from 'lucide-react';

interface CctvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CctvModal: React.FC<CctvModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const cameras = [
    { id: 'CAM-01', name: 'Main POS Cash Counter', status: 'LIVE', res: '1080p 30fps' },
    { id: 'CAM-02', name: 'Front Entrance & Shutter', status: 'LIVE', res: '1080p 30fps' },
    { id: 'CAM-03', name: 'Aisle 1 - Groceries & Oils', status: 'LIVE', res: '720p 25fps' },
    { id: 'CAM-04', name: 'Back Warehouse & Stock In', status: 'LIVE', res: '1080p 30fps' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-700 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 text-white">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-tight text-white">
                  Supermarket CCTV Security Surveillance
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE NVR
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected IP Security Cameras & Cash Drawer Motion Monitor
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

        {/* 4-Camera Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {cameras.map((cam, idx) => (
            <div key={cam.id} className="rounded-2xl bg-black border border-slate-800 p-3 relative flex flex-col justify-between h-44 overflow-hidden shadow-inner group">
              <div className="flex items-center justify-between text-[11px] z-10">
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  {cam.id}: {cam.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-600/80 text-white text-[9px] font-bold">
                  REC
                </span>
              </div>

              {/* Simulation Visual Frame */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="text-center font-mono text-xs">
                  <div className="text-4xl mb-1">📹</div>
                  <div>FEED STREAM ACTIVE</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono z-10 mt-auto">
                <span>{new Date().toLocaleTimeString()}</span>
                <span>{cam.res}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Hikvision / Dahua NVR Gateway • 4/4 Channels Active</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            Close Feed
          </button>
        </div>

      </div>
    </div>
  );
};
