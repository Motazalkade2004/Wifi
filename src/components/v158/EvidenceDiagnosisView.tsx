import React from 'react';
import { V158DiagnosisCandidate, V158Evidence } from '../../types/v158';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Cpu,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface EvidenceDiagnosisViewProps {
  candidates: V158DiagnosisCandidate[];
  onSelectCandidate: (candidate: V158DiagnosisCandidate) => void;
  onOpenSmartNextTest: () => void;
  isArabic?: boolean;
}

export const EvidenceDiagnosisView: React.FC<EvidenceDiagnosisViewProps> = ({
  candidates,
  onSelectCandidate,
  onOpenSmartNextTest,
  isArabic = true,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              {isArabic
                ? 'محرك الأدلة والتشخيص التفسيري (Evidence & Diagnosis Engine)'
                : 'V158 FUSION Evidence & Explainable Diagnosis Engine'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'ترتيب الفرضيات الهندسية المعتمدة على الأدلة المرجعية مع تحليل التناقضات ومستوى الثقة'
              : 'Ranked fault hypotheses backed by weighted empirical evidence and contradiction analysis'}
          </p>
        </div>

        <button
          onClick={onOpenSmartNextTest}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{isArabic ? 'الفحص الذكي التالي (Smart Next Test)' : 'Smart Next Test'}</span>
        </button>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.map((candidate) => {
          const isConfirmed = candidate.status === 'CONFIRMED';
          const isProbable = candidate.status === 'PROBABLE';
          const isPossible = candidate.status === 'POSSIBLE';

          return (
            <div
              key={candidate.componentRef}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition-all ${
                isConfirmed
                  ? 'border-emerald-500/60 ring-1 ring-emerald-500/30'
                  : isProbable
                  ? 'border-amber-500/50'
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {candidate.componentRef}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {isArabic ? candidate.componentNameAr : candidate.componentNameEn}
                    </span>
                    {candidate.netId && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {candidate.netId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {isArabic ? candidate.explanationAr : candidate.explanationEn}
                  </p>
                </div>

                {/* Score & Status Pill */}
                <div className="text-left shrink-0">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                        isConfirmed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isProbable
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : isPossible
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-400">
                    {isArabic ? 'نسبة الثقة:' : 'Confidence:'}{' '}
                    <span className="text-amber-400 font-black text-sm">
                      {candidate.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting Evidences */}
              {candidate.supportingEvidence.length > 0 && (
                <div className="space-y-2 mb-3">
                  <span className="text-[11px] font-bold text-emerald-400 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isArabic ? 'الأدلة الداعمة للفرضية (Supporting Evidence):' : 'Supporting Evidence:'}
                  </span>
                  <div className="space-y-1.5">
                    {candidate.supportingEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-200 block text-[11px]">
                            {isArabic ? ev.titleAr : ev.titleEn}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {isArabic ? ev.descriptionAr : ev.descriptionEn}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0 mr-2">
                          وزن: +{Math.round(ev.weight * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contradicting Evidences (تحليل التناقضات) */}
              {candidate.contradictingEvidence.length > 0 && (
                <div className="space-y-2 mb-3">
                  <span className="text-[11px] font-bold text-rose-400 block flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {isArabic ? 'الأدلة المتناقضة مع الفرضية (Contradictions):' : 'Contradictions:'}
                  </span>
                  <div className="space-y-1.5">
                    {candidate.contradictingEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs flex items-center justify-between text-rose-200"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold block text-[11px]">
                            {isArabic ? ev.titleAr : ev.titleEn}
                          </span>
                          <span className="text-rose-300/80 text-[10px]">
                            {isArabic ? ev.descriptionAr : ev.descriptionEn}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded shrink-0 mr-2">
                          خصم: -{Math.round(ev.weight * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => onSelectCandidate(candidate)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isArabic ? 'تحديد كهدف صيانة وعرض الخطة' : 'Inspect Location & Plan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
