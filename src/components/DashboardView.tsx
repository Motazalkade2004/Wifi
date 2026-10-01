import React, { useState } from 'react';
import { BoardData, WorkshopCase } from '../types';
import { MASTER_PHONE_CATALOG } from '../data/phoneCatalog';
import { BOARDS_CATALOG } from '../data/boards';
import {
  Smartphone,
  Cpu,
  Camera,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Plus,
  Zap,
  Activity,
  Package,
  Wrench,
  Search,
  ShieldCheck,
  ChevronLeft,
  FileText,
  Radio,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

interface DashboardViewProps {
  cases: WorkshopCase[];
  activeCase?: WorkshopCase;
  currentBoard: BoardData;
  onNavigateTab: (tab: any) => void;
  onSelectCase: (c: WorkshopCase) => void;
  onNewCase: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  activeCase,
  currentBoard,
  onNavigateTab,
  onSelectCase,
  onNewCase,
}) => {
  const inProgressCases = cases.filter((c) => c.status === 'IN_PROGRESS');
  const openCases = cases.filter((c) => c.status === 'OPEN');
  const repairedCases = cases.filter((c) => c.status === 'REPAIRED');

  const [searchQuery, setSearchQuery] = useState('');

  // Filtered phone catalog / IC lookup results
  const searchResults = searchQuery.trim()
    ? MASTER_PHONE_CATALOG.filter(
        (p) =>
          p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.chipset.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.boardCodes.some((code) =>
            code.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  return (
    <div className="flex flex-col gap-3.5 w-full pb-8">
      {/* Workshop Hero Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                فني معتمد: م. نادر (قلب اليمن)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Play Store Release</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 mt-1.5 tracking-tight">
              ورشة قلب اليمن فون للهندسة المتقدمة
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              نظام تشخيص ومطابقة لوحات الهواتف الذكية (Schematic & Boardview Level 3 OS)
            </p>
          </div>

          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 shrink-0">
            <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Quick Workshop Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-2 sm:p-2.5 rounded-2xl border border-slate-800/60 text-center">
            <span className="text-[10px] text-slate-400 block">قيد الفحص</span>
            <span className="font-mono text-sm sm:text-base font-black text-amber-400">
              {inProgressCases.length} أجهزة
            </span>
          </div>
          <div className="bg-slate-950/70 p-2 sm:p-2.5 rounded-2xl border border-slate-800/60 text-center">
            <span className="text-[10px] text-slate-400 block">بانتظار البدء</span>
            <span className="font-mono text-sm sm:text-base font-black text-blue-400">
              {openCases.length} أجهزة
            </span>
          </div>
          <div className="bg-slate-950/70 p-2 sm:p-2.5 rounded-2xl border border-slate-800/60 text-center">
            <span className="text-[10px] text-slate-400 block">تم إصلاحها</span>
            <span className="font-mono text-sm sm:text-base font-black text-emerald-400">
              {repairedCases.length} أجهزة
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search Bar for Schematics, ICs, and Phones */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن موديل، كود لوحة، آيسي (مثلاً: S24 Ultra, PCA9468, PM6150)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
        </div>

        {/* Live Search Quick Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-30 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1.5">
            <div className="text-[10px] text-slate-400 px-2 font-bold">
              نتائج الكتالوج والمخططات:
            </div>
            {searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setSearchQuery('');
                  onNavigateTab('CATALOG');
                }}
                className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {item.brand} {item.model}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {item.boardCodes.join(' • ')}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.chipset}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6 Core Action Tiles Grid (الأدوات السريعة للورشة) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300">أدوات الفحص والتشخيص السريعة:</h3>
          <span className="text-[10px] text-slate-500">مكتبة قلب اليمن الهندسية</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* 1. Diagnostic Wizard */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('DIAGNOSIS');
            }}
            className="p-3 bg-slate-900 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-right transition-all shadow-md flex flex-col justify-between h-24 sm:h-28 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-100 block">التشخيص الموجه</span>
              <span className="text-[10px] text-slate-400">الوكيل المنظم (10 مراحل)</span>
            </div>
          </button>

          {/* 2. Boardview Canvas */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('BOARDVIEW');
            }}
            className="p-3 bg-slate-900 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-cyan-500/50 rounded-2xl text-right transition-all shadow-md flex flex-col justify-between h-24 sm:h-28 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-100 block">خريطة البورد فيو</span>
              <span className="text-[10px] text-slate-400">مخطط اللوحة وتتبع المسار</span>
            </div>
          </button>

          {/* 3. Macro Camera & Quality Gate */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('MACRO_CAMERA');
            }}
            className="p-3 bg-slate-900 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-right transition-all shadow-md flex flex-col justify-between h-24 sm:h-28 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-100 block">كاميرا الماكرو</span>
              <span className="text-[10px] text-slate-400">إطار حي وبوابة جودة</span>
            </div>
          </button>

          {/* 4. IC Cross-Ref Compatibility Bank */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('COMPATIBILITY');
            }}
            className="p-3 bg-slate-900 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-orange-500/50 rounded-2xl text-right transition-all shadow-md flex flex-col justify-between h-24 sm:h-28 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-100 block">بنك التوافق والبدائل</span>
              <span className="text-[10px] text-slate-400">مطابقة الآيسيات بين الهواتف</span>
            </div>
          </button>

          {/* 5. Invoices & Reports */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('INVOICES');
            }}
            className="p-3 bg-slate-900 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-blue-500/50 rounded-2xl text-right transition-all shadow-md flex flex-col justify-between h-24 sm:h-28 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-100 block">الفواتير والتقارير</span>
              <span className="text-[10px] text-slate-400">طباعة بـ QR وضمان معتمد</span>
            </div>
          </button>

          {/* 6. New Case Intake */}
          <button
            onClick={() => {
              sounds.playClick();
              onNewCase();
            }}
            className="p-3 bg-slate-900 hover:bg-slate-850 active:scale-95 border border-slate-800 hover:border-purple-500/50 rounded-2xl text-right transition-all shadow-md flex flex-col justify-between h-24 sm:h-28 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-100 block">استقبال هاتف</span>
              <span className="text-[10px] text-slate-400">تسجيل بيانات العطل</span>
            </div>
          </button>
        </div>
      </div>

      {/* Active Device & Board in Hand Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 sm:p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">
                {currentBoard.brand} {currentBoard.model}
              </span>
              <span className="font-mono text-[10px] text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {currentBoard.boardCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              أبعاد اللوحة: {currentBoard.dimensions.widthMm} × {currentBoard.dimensions.heightMm} mm • {currentBoard.components.length} مكوّن هندسي
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigateTab('CATALOG');
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <span>تغيير</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Current Active Case Card */}
      {activeCase && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h4 className="text-xs font-black text-slate-200">
                الجهاز النشط حالياً على طاولة الفحص:
              </h4>
            </div>
            <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {activeCase.caseNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">العميل:</span>
              <span className="font-bold text-slate-100">{activeCase.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">مسار العطل:</span>
              <span className="font-bold text-amber-400">{activeCase.faultPath}</span>
            </div>
            <div className="col-span-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-500 block">الشكوى المسجلة:</span>
              {activeCase.complaintAr}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              القياسات المسجلة: {activeCase.measurements.length}
            </span>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigateTab('DIAGNOSIS');
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 cursor-pointer"
            >
              <span>متابعة الفحص الموجه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Common Repair Pathways Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-200">مسارات الأعطال الشائعة بالورشة:</h4>
          </div>
          <span className="text-[10px] text-slate-500">اختر مساراً للبدء الفوري</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: 'CHARGING', label: 'دائرة الشحن', color: 'from-amber-500/20 text-amber-400 border-amber-500/30' },
            { id: 'POWER', label: 'دائرة الباور', color: 'from-red-500/20 text-red-400 border-red-500/30' },
            { id: 'DISPLAY', label: 'الشاشة والإضاءة', color: 'from-blue-500/20 text-blue-400 border-blue-500/30' },
            { id: 'AUDIO', label: 'دائرة الصوت', color: 'from-emerald-500/20 text-emerald-400 border-emerald-500/30' },
            { id: 'NETWORK', label: 'الشبكة والـ RF', color: 'from-purple-500/20 text-purple-400 border-purple-500/30' },
            { id: 'BOOTLOOP', label: 'ريستارت متكرر', color: 'from-cyan-500/20 text-cyan-400 border-cyan-500/30' },
          ].map((path) => (
            <button
              key={path.id}
              onClick={() => {
                sounds.playClick();
                onNavigateTab('DIAGNOSIS');
              }}
              className={`p-2.5 rounded-2xl bg-gradient-to-b bg-slate-950 border ${path.color} text-center hover:scale-105 active:scale-95 transition-all cursor-pointer`}
            >
              <span className="text-xs font-bold block">{path.label}</span>
              <span className="text-[9px] font-mono opacity-70 block mt-0.5">{path.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Workshop Activity & Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200">سجل الإجراءات الأخيرة بالورشة:</h4>
          </div>
          <button
            onClick={() => onNavigateTab('AUDIT_LOG')}
            className="text-[11px] text-amber-400 hover:underline font-bold"
          >
            عرض الكل
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {activeCase?.auditLog.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/70 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200 block text-[11px]">
                  {log.descriptionAr}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300">
                {log.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
