import React, { useState } from 'react';
import { V158SmartNextTest } from '../../types/v158';
import {
  Zap,
  TrendingUp,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface SmartNextTestViewProps {
  candidates: V158SmartNextTest[];
  onExecuteTest: (test: V158SmartNextTest) => void;
  onOverrideTest: (test: V158SmartNextTest, reason: string) => void;
  isArabic?: boolean;
}

export const SmartNextTestView: React.FC<SmartNextTestViewProps> = ({
  candidates,
  onExecuteTest,
  onOverrideTest,
  isArabic = true,
}) => {
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [selectedForOverride, setSelectedForOverride] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              {isArabic
                ? 'محرك الفحص الذكي التالي (Smart Next Test Engine)'
                : 'V158 FUSION Smart Next Test Engine'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'ترشيح نقطة الفحص ذات العائد المعلوماتي الأعلى مع مراعاة السلامة والجهد'
              : 'Recommends highest information gain test point to collapse diagnostic uncertainty'}
          </p>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-3">
        {candidates.map((t) => {
          const isTopPriority = t.priority === 1;

          return (
            <div
              key={t.testPointId}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition-all ${
                isTopPriority
                  ? 'border-amber-500/70 ring-1 ring-amber-500/30'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-black ${
                        isTopPriority
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      الأولوية #{t.priority}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{t.testPointName}</span>
                    <span className="font-mono text-xs text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      [{t.componentRef}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {isArabic ? t.reasonAr : t.reasonEn}
                  </p>
                </div>

                {/* Information Gain Metric */}
                <div className="text-left shrink-0 font-mono">
                  <span className="text-[10px] text-slate-500 block">العائد المعلوماتي:</span>
                  <span className="text-base font-black text-emerald-400">
                    +{Math.round(t.expectedInformationGain * 100)}%
                  </span>
                </div>
              </div>

              {/* Conditions & Safety Stats Row */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">نوع الفحص والوحدة:</span>
                  <span className="font-mono font-bold text-amber-400">{t.measurementType} ({t.unit})</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">الشرط الكهربائي:</span>
                  <span className="font-semibold text-slate-200">{t.condition}</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">مستوى السلامة والوقت:</span>
                  <span
                    className={`font-bold ${
                      t.safetyLevel === 'SAFE' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {t.safetyLevel} (~{t.estimatedEffortSeconds}s)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => setSelectedForOverride(t.testPointId)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  {isArabic ? 'تجاوز التوصية يدوياً (Override)' : 'Override with Reason'}
                </button>

                <button
                  onClick={() => onExecuteTest(t)}
                  className={`px-5 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTopPriority
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>{isArabic ? 'تنفيذ هذا الفحص الآن' : 'Execute Test Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Override reason drawer */}
              {selectedForOverride === t.testPointId && (
                <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-[11px] text-slate-300 block font-bold">
                    سبب تجاوز الفحص المقترح وتسجيله في سجل التدقيق:
                  </label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="مثال: المكوّن مغطى بمادة حماية Resin، سأفحص النقطة البديلة..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedForOverride(null)}
                      className="px-3 py-1 text-slate-400 text-xs"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        onOverrideTest(t, overrideReason);
                        setSelectedForOverride(null);
                        setOverrideReason('');
                      }}
                      className="px-4 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold"
                    >
                      تأكيد التجاوز
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
