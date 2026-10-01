import React, { useState } from 'react';
import { COMPATIBILITY_DATABASE, checkPartsCompatibility } from '../../services/compatibilityEngine';
import { V158CompatibilityItem } from '../../types/v158';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  Layers,
  Cpu,
} from 'lucide-react';

interface CompatibilityCenterViewProps {
  currentBoardCode?: string;
  currentModel?: string;
  isArabic?: boolean;
}

export const CompatibilityCenterView: React.FC<CompatibilityCenterViewProps> = ({
  currentBoardCode = 'SM-S928B-REV-01',
  currentModel = 'Galaxy S24 Ultra',
  isArabic = true,
}) => {
  const [search, setSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filtered = COMPATIBILITY_DATABASE.filter((item) => {
    const matchSearch =
      !search ||
      item.sourcePartSku.toLowerCase().includes(search.toLowerCase()) ||
      item.targetModel.toLowerCase().includes(search.toLowerCase()) ||
      item.targetBoardCode.toLowerCase().includes(search.toLowerCase());

    const matchCat = filterCategory === 'ALL' || item.partCategory === filterCategory;
    return matchSearch && matchCat;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED_COMPATIBLE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isArabic ? 'متوافق مؤكد (VERIFIED)' : 'VERIFIED COMPATIBLE'}
          </span>
        );
      case 'LIKELY_COMPATIBLE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isArabic ? 'متوافق مرجح (LIKELY)' : 'LIKELY COMPATIBLE'}
          </span>
        );
      case 'INCOMPATIBLE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {isArabic ? 'غير متوافق إطلاقاً (INCOMPATIBLE)' : 'INCOMPATIBLE'}
          </span>
        );
      case 'POSSIBLE':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/40">
            {isArabic ? 'محتمل (POSSIBLE)' : 'POSSIBLE'}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              {isArabic
                ? 'مركز التوافق ومطابقة القطع الهندسية (V158 Compatibility Engine)'
                : 'V158 FUSION Cross-Model Compatibility Engine'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'فحص التوافق الميكانيكي، الكهربائي، ونقاط الموصلات وتشفير البرمجيات عبر الموديلات واللوحات'
              : 'Multi-dimensional verification of physical fit, electrical specs, connector pinout & firmware dependency'}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بكود SKU، الموديل المستهدف، أو كود اللوحة..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'IC', 'SCREEN', 'CONNECTOR', 'PASSIVE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'الكل'
                : cat === 'IC'
                ? 'دوائر متكاملة IC'
                : cat === 'SCREEN'
                ? 'شاشات'
                : cat === 'CONNECTOR'
                ? 'موصلات FPC'
                : 'مكثفات ودايودات'}
            </button>
          ))}
        </div>
      </div>

      {/* Compatibility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-900 border rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all ${
              item.status === 'VERIFIED_COMPATIBLE'
                ? 'border-emerald-500/40'
                : item.status === 'INCOMPATIBLE'
                ? 'border-rose-500/40'
                : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <span className="font-mono text-sm font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {item.sourcePartSku}
                  </span>
                  <div className="text-xs text-slate-300 font-bold mt-1">
                    الطراز المستهدف: {item.targetModel} ({item.targetBoardCode})
                  </div>
                </div>

                <div className="text-left space-y-1">
                  {getStatusBadge(item.status)}
                  <span className="font-mono text-[10px] text-slate-400 block text-left">
                    ثقة: {item.confidencePercent}%
                  </span>
                </div>
              </div>

              {/* 4 Multi-dimensional Verification Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    item.physicalFit
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span className="text-[11px] font-sans">تطابق الحجم واللحام:</span>
                  <span className="font-bold">{item.physicalFit ? '✓ مطابق' : '✗ غير مطابق'}</span>
                </div>

                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    item.electricalCompatible
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span className="text-[11px] font-sans">التوافق الكهربائي:</span>
                  <span className="font-bold">{item.electricalCompatible ? '✓ آمن' : '✗ خطر'}</span>
                </div>

                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    item.connectorCompatible
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span className="text-[11px] font-sans">تطابق الموصل Pinout:</span>
                  <span className="font-bold">{item.connectorCompatible ? '✓ متطابق' : '✗ مختلف'}</span>
                </div>

                <div
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    !item.firmwareDependency
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <span className="text-[11px] font-sans">تشفير البرمجيات:</span>
                  <span className="font-bold">{item.firmwareDependency ? 'تشفير برمجي' : 'حر / مستقل'}</span>
                </div>
              </div>

              {/* Evidence notes */}
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800 leading-relaxed font-sans mb-2">
                {isArabic ? item.evidenceNotesAr : item.evidenceNotesEn}
              </p>

              {/* Warnings */}
              {item.warningsAr && item.warningsAr.length > 0 && (
                <div className="space-y-1">
                  {item.warningsAr.map((w, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/30 flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
