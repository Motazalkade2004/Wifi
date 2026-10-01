import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileMode: boolean;
  onToggleMode: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isMobileMode,
  onToggleMode,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start w-full">
      {/* Top Subtle Device Viewport Switcher for Workshop Desktop Displays */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800/80 px-3 py-1.5 flex items-center justify-between text-xs z-50 print:hidden select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200 text-[11px] sm:text-xs">
            تطبيق قلب اليمن فون — الإصدار الهندسي المعتمد (Android Play Store Edition)
          </span>
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] border border-amber-500/30">
            v2.6 PRO
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={onToggleMode}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isMobileMode
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="عرض بحجم شاشة الهاتف الذكي"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">شاشة الهاتف</span>
          </button>
          <button
            onClick={onToggleMode}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isMobileMode
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="عرض ورشة كامل الشاشة"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">كامل الشاشة</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Canvas Container */}
      <main
        className={`w-full flex-1 flex flex-col transition-all duration-300 ${
          isMobileMode
            ? 'max-w-md md:max-w-lg mx-auto shadow-2xl bg-slate-950 border-x border-slate-800/80 min-h-[calc(100vh-38px)]'
            : 'max-w-7xl mx-auto px-2 sm:px-4 min-h-[calc(100vh-38px)]'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
