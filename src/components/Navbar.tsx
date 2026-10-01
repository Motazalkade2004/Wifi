import React from 'react';
import { BoardData, WorkshopCase } from '../types';
import { BOARDS_CATALOG } from '../data/boards';
import {
  Smartphone,
  Cpu,
  Layers,
  Camera,
  Package,
  FileText,
  Activity,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  ChevronDown,
  Zap,
  ShieldCheck,
  Plus,
  Volume2,
} from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

export type MainTab = 'HOME' | 'DIAGNOSIS' | 'BOARDVIEW' | 'COMPATIBILITY' | 'CASES';

export type ActiveTab =
  | 'HOME'
  | 'DIAGNOSIS'
  | 'EVIDENCE'
  | 'SMART_TEST'
  | 'REPAIR_PLAN'
  | 'REPAIR_FLOW'
  | 'BOARDVIEW'
  | 'MACRO_CAMERA'
  | 'CATALOG'
  | 'COMPATIBILITY'
  | 'PACKAGES'
  | 'INVENTORY'
  | 'CASES'
  | 'INVOICES'
  | 'AUDIT_LOG'
  | 'SETTINGS';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentBoard: BoardData;
  onBoardChange: (board: BoardData) => void;
  activeCase?: WorkshopCase;
  onOpenCaseModal: () => void;
  isOnline: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentBoard,
  onBoardChange,
  activeCase,
  onOpenCaseModal,
  isOnline,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800/80 backdrop-blur-md px-3 sm:px-4 py-2.5 shadow-md">
      <div className="flex items-center justify-between gap-2">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => {
              sounds.playClick();
              onTabChange('HOME');
            }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-transform shrink-0"
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1
                onClick={() => {
                  sounds.playClick();
                  onTabChange('HOME');
                }}
                className="text-sm font-black text-slate-100 tracking-tight cursor-pointer hover:text-amber-400 transition-colors"
              >
                قلب اليمن فون
              </h1>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Nader Complete
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              نظام تشخيص ومطابقة لوحات الهواتف الذكية (Schematic & Boardview OS)
            </p>
          </div>
        </div>

        {/* Center / Right: Active Board Selector & Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Board Selector Dropdown */}
          <div className="relative">
            <select
              value={currentBoard.id}
              onChange={(e) => {
                const b = BOARDS_CATALOG.find((x) => x.id === e.target.value);
                if (b) {
                  sounds.playClick();
                  onBoardChange(b);
                }
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-2.5 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-amber-500 appearance-none pl-7 cursor-pointer max-w-[130px] sm:max-w-[200px] truncate"
              title="اختر طراز اللوحة للعمل عليها"
            >
              {BOARDS_CATALOG.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.brand} {b.model} ({b.boardCode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
          </div>

          {/* Active Case Chip */}
          {activeCase && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCaseModal();
              }}
              className="px-2 py-1 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-[11px] flex items-center gap-1 text-slate-300 transition-colors cursor-pointer shrink-0"
              title={`الجهاز النشط: ${activeCase.deviceModel} - العميل: ${activeCase.customerName}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-amber-400 font-bold">{activeCase.caseNumber}</span>
            </button>
          )}

          {/* Quick New Case Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCaseModal();
            }}
            className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="استقبال جهاز صيانة جديد"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Online / Offline status */}
          <div
            title={isOnline ? 'متصل بالشبكة — المزامنة جاهزة' : 'وضع غير متصل — العمل محلي 100%'}
            className={`p-1.5 rounded-xl border text-[11px] flex items-center gap-1 shrink-0 ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleTheme();
            }}
            title="تبديل النمط المضيء / الداكن"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
