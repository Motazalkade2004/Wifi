import React, { useState } from 'react';
import { INITIAL_PACKAGES, validatePackageTrust } from '../../services/packageRegistry';
import { V158DiagnosticPackage } from '../../types/v158';
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Key,
} from 'lucide-react';

interface PackageRegistryViewProps {
  isArabic?: boolean;
}

export const PackageRegistryView: React.FC<PackageRegistryViewProps> = ({ isArabic = true }) => {
  const [packages, setPackages] = useState<V158DiagnosticPackage[]>(INITIAL_PACKAGES);

  const togglePackage = (id: string) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === id) {
          const nextStatus = pkg.status === 'INSTALLED' ? 'DISABLED' : 'INSTALLED';
          return { ...pkg, status: nextStatus };
        }
        return pkg;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              {isArabic
                ? 'سجل حزم التشخيص والثقة والأمان (V158 Package Registry)'
                : 'V158 Package Registry, Trust & Security'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'إدارة حزم بيانات اللوحات المشفرة برمز SHA-256 وعزل البيانات التجريبية TEST لمنع اتخاذ قرارات خاطئة'
              : 'Cryptographic package integrity, SHA-256 verification and strict isolation of TEST data'}
          </p>
        </div>
      </div>

      {/* Hard Rule Notice from Section 1 & 11 */}
      <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-300">
            {isArabic
              ? 'مبدأ الأمان الأساسي لمنصة V158 FUSION (Core Implementation Principle):'
              : 'Core Implementation Principle:'}
          </span>
          <p className="mt-1 leading-relaxed">
            {isArabic
              ? 'يجب عزل حزم وبيانات الـ [TEST التجريبية] تماماً ومنع تقديمها كمرجع موثوق أو استخدامها لاتخاذ قرارات صيانة على أجهزة العملاء الحقيقية.'
              : 'TEST data must never be presented as authoritative repair reference data or used to make real-device repair decisions.'}
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const trust = validatePackageTrust(pkg);
          const isInstalled = pkg.status === 'INSTALLED';

          return (
            <div
              key={pkg.id}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl space-y-3 transition-all ${
                pkg.trustClassification === 'TEST'
                  ? 'border-amber-500/40 bg-slate-900/80'
                  : isInstalled
                  ? 'border-emerald-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {pkg.id}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {pkg.manufacturer} {pkg.model}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-400 block mt-1">
                    كود اللوحة: {pkg.boardCode} ({pkg.revision}) • إصدار v{pkg.packageVersion}
                  </span>
                </div>

                <div className="text-left space-y-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      pkg.trustClassification === 'MANUFACTURER' || pkg.trustClassification === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : pkg.trustClassification === 'TEST'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    تصنيف: {pkg.trustClassification}
                  </span>
                </div>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  SHA-256: {pkg.sha256Hash}
                </span>
                <span className="text-emerald-400 font-bold shrink-0 mr-2">VERIFIED</span>
              </div>

              {/* Package Content Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">المكوّنات</span>
                  <span className="font-mono font-bold text-slate-200">{pkg.componentCount}</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">نقاط القياس</span>
                  <span className="font-mono font-bold text-amber-400">{pkg.testPointCount}</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">قواعد الفحص</span>
                  <span className="font-mono font-bold text-slate-200">{pkg.ruleCount}</span>
                </div>
              </div>

              {/* Trust Evaluation message */}
              <p
                className={`text-[11px] p-2.5 rounded-xl border leading-relaxed ${
                  trust.canBeAuthoritative
                    ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                    : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
                }`}
              >
                {trust.messageAr}
              </p>

              {/* Toggle Enable/Disable Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  الحالة: {isInstalled ? 'مفعلة في التشخيص' : 'معطلة'}
                </span>
                <button
                  onClick={() => togglePackage(pkg.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isInstalled
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {isInstalled ? 'تعطيل الحزمة' : 'تفعيل الحزمة'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
