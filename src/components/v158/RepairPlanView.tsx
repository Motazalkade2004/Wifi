import React, { useState } from 'react';
import { V158MeasurementRecord, V158RepairPlan, V158RepairStep } from '../../types/v158';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  RotateCcw,
} from 'lucide-react';

interface RepairPlanViewProps {
  plan: V158RepairPlan;
  onToggleStep: (stepNumber: number) => void;
  onRecordPostTest: (testPointId: string, value: number | 'SHORT' | 'OPEN') => void;
  onCompleteCase: () => void;
  isArabic?: boolean;
}

export const RepairPlanView: React.FC<RepairPlanViewProps> = ({
  plan,
  onToggleStep,
  onRecordPostTest,
  onCompleteCase,
  isArabic = true,
}) => {
  const [postTestInput, setPostTestInput] = useState<string>('5.10');

  const allStepsCompleted = plan.steps.every((s) => s.completed);
  const postTestCompleted = plan.afterMeasurements.length > 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              {isArabic
                ? 'خطة الإصلاح الهندسية والتحقق البعدي (Repair Plan & Post-Validation)'
                : 'V158 FUSION Repair Plan & Post-Repair Validation'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'خطوات صيانة منظمة مع تحذيرات ومقارنة القياسات الإلزامية قبل وبعد الإصلاح'
              : 'Structured repair procedure with mandatory before/after measurement comparability'}
          </p>
        </div>
      </div>

      {/* Target Component & Fault Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400">العطل المستهدف للإصلاح:</span>
          <h4 className="text-sm font-bold text-slate-100">
            {plan.suspectedFault} [{plan.targetComponentRef}]
          </h4>
        </div>
        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
          {plan.steps.filter((s) => s.completed).length} / {plan.steps.length} خطوات مكتملة
        </span>
      </div>

      {/* Ordered Repair Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-300">
          خطوات الإصلاح الإجرائية المعتمدة (Ordered Steps):
        </h4>

        <div className="space-y-2.5">
          {plan.steps.map((step) => (
            <div
              key={step.stepNumber}
              onClick={() => onToggleStep(step.stepNumber)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                step.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  step.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step.completed ? '✓' : step.stepNumber}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                    {step.action}
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {isArabic ? step.descriptionAr : step.descriptionEn}
                  </span>
                </div>

                {step.warningAr && (
                  <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    ⚠️ {isArabic ? step.warningAr : step.warningEn}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Before / After Measurement Comparison (Section 10: Before/after measurements comparison) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-100">
              مقارنة القياسات الإلزامية قبل وبعد الإصلاح (Before / After Comparison):
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            معيار إتمام إلزامي
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Before Repair Measurement */}
          <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-rose-400 font-bold block">
              القياس قبل الإصلاح (BEFORE REPAIR):
            </span>
            <div className="font-mono text-sm font-black text-rose-300">
              VBUS C2150: 0.12 V [FAIL / SHORT]
            </div>
            <p className="text-[11px] text-slate-400">
              هبوط جهد كامل وشورت مباشر منع وصول طاقة الشاحن.
            </p>
          </div>

          {/* After Repair Measurement */}
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">
              القياس بعد استبدال القطعة (AFTER REPAIR):
            </span>
            {postTestCompleted ? (
              <div className="font-mono text-sm font-black text-emerald-300">
                VBUS C2150: {plan.afterMeasurements[0].measuredValue} {plan.afterMeasurements[0].unit} [PASS / VERIFIED]
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={postTestInput}
                    onChange={(e) => setPostTestInput(e.target.value)}
                    placeholder="سجل القراءة بعد الإصلاح (مثال: 5.10 V)..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                  <button
                    onClick={() => onRecordPostTest('MP-S24U-CHG-01', parseFloat(postTestInput))}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    تأكيد الفحص البعدي
                  </button>
                </div>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              {postTestCompleted ? 'تم استعادة الجهد الاسمي 5V بنجاح.' : 'أدخل القراءة للتأكد من زوال العطل.'}
            </p>
          </div>
        </div>
      </div>

      {/* Final Case Completion Button */}
      <button
        onClick={onCompleteCase}
        disabled={!allStepsCompleted || !postTestCompleted}
        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>إتمام وتسليم الحالة بناءً على المعايير الهندسية المستوفاة</span>
      </button>
    </div>
  );
};
