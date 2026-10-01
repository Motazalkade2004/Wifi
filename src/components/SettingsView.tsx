import React from 'react';
import { BoardData } from '../types';
import { BOARDS_CATALOG } from '../data/boards';
import {
  Settings,
  ShieldAlert,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Layers,
  Database,
  CheckCircle2,
  Cpu,
  RefreshCw,
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isOnline: boolean;
  currentBoard: BoardData;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onToggleTheme,
  isOnline,
  currentBoard,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              إعدادات النظام وإدارة الورشة (Workshop Settings)
            </h3>
            <p className="text-xs text-slate-400">
              ضبط معايير السلامة، المزامنة السحابية Offline-First، وحزم بيانات اللوحات المعتمدة
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Offline & Cloud Sync Section (Section 5.9 of report) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-100">المزامنة والتشغيل دون اتصال (Offline-First)</h4>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {isOnline ? 'متصل بالسيرفر' : 'وضع أوفلاين محلي'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              يعمل تطبيق <strong className="text-amber-400 font-bold">قلب اليمن فون</strong> بنظام محلي كامل؛ تُحفظ القياسات والصور والحالات داخل التخزين المحلي فوراً بدون اشتراط اتصال دائم بالإنترنت.
            </p>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">حالة طابور المزامنة:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  كافة الحالات متزامنة ومحفوظة
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">تخزين القياسات والصور:</span>
                <span className="font-mono text-slate-300">IndexedDB / LocalStore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Gate Protocol (Section 2.3 & 5.7 of report) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-slate-100">بروتوكول بوابات السلامة الهندسية</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400">
              مفعّل إجبارياً
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              يمنع النظام الفني المبتدئ من حفظ أي قراءة أو فحص قبل قراءة وتأكيد تحذير السلامة الخاص بكل مسار كهربائي:
            </p>
            <ul className="text-slate-400 space-y-1 list-disc list-inside text-[11px]">
              <li>فصل الشاحن والبطارية تماماً قبل قياسات الدايود والمقاومة.</li>
              <li>التحقق من عدم حدوث تلامس بين أطراف المكثفات والأرضي المباشر.</li>
              <li>الالتزام بترميز المجسات (المجس الأحمر للخط المقاس، والأسود للأرضي GND).</li>
            </ul>
          </div>
        </div>

        {/* Board Packages Manager (Section 5.1 of report) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-100">حزم بيانات اللوحات المحملة في النظام</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {BOARDS_CATALOG.length} حزم لوحات معتمدة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BOARDS_CATALOG.map((b) => (
              <div
                key={b.id}
                className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{b.brand} {b.model}</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    Rev {b.boardRevision}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">{b.boardCode}</div>
                <div className="text-[10px] text-slate-500">
                  {b.components.length} مكوّن • {b.measurementPoints.length} نقطة قياس موثقة
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
