import React, { useState } from 'react';
import {
  BoardData,
  BoardSide,
  ComponentItem,
  DiagnosticAgentStep,
  FaultPath,
  MeasurementPoint,
  WorkshopCase,
} from '../types';
import { DIAGNOSTIC_STAGES, DiagnosticWorkflowState, generateAgentStep } from '../utils/diagnosticAgent';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Camera,
  Layers,
  ArrowLeft,
  ArrowRight,
  Send,
  Zap,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileText,
  ShoppingBag,
} from 'lucide-react';

interface DiagnosticWorkflowViewProps {
  board: BoardData;
  activeCase?: WorkshopCase;
  faultPath: FaultPath;
  onOpenMacroCamera: () => void;
  onOpenBoardview: () => void;
  onOpenInventory: () => void;
  onOpenInvoice: () => void;
  onRecordMeasurement: (record: {
    pointId: string;
    componentRef: string;
    value: number | 'SHORT' | 'OPEN';
    unit: string;
    evaluation: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN';
    note?: string;
  }) => void;
}

export const DiagnosticWorkflowView: React.FC<DiagnosticWorkflowViewProps> = ({
  board,
  activeCase,
  faultPath,
  onOpenMacroCamera,
  onOpenBoardview,
  onOpenInventory,
  onOpenInvoice,
  onRecordMeasurement,
}) => {
  // Determine starting point based on fault path
  const initialRegionId = faultPath === 'CHARGING' ? 'charging' : faultPath === 'DISPLAY' ? 'display' : 'power';
  const defaultComp = board.components.find((c) => c.regionId === initialRegionId) || board.components[0];
  const defaultMeasurement = board.measurementPoints.find((m) => m.componentRef === defaultComp.ref) || board.measurementPoints[0];

  const [workflowState, setWorkflowState] = useState<DiagnosticWorkflowState>({
    currentStage: 6, // Typically technician enters at measurement/diagnostic stage
    board,
    side: defaultComp.side,
    faultPath,
    targetRegionId: initialRegionId,
    targetComponentRef: defaultComp.ref,
    selectedMeasurementPoint: defaultMeasurement,
    isBoardVerified: true,
    isImageQualityApproved: true,
    historySteps: [],
  });

  const [readingInput, setReadingInput] = useState<string>('');
  const [safetyChecked, setSafetyChecked] = useState<boolean>(false);
  const [showDeepDrawer, setShowDeepDrawer] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const step: DiagnosticAgentStep = generateAgentStep(workflowState);
  const measurement = workflowState.selectedMeasurementPoint;

  const handleStageSelect = (stageNum: number) => {
    setWorkflowState((prev) => ({
      ...prev,
      currentStage: stageNum,
    }));
  };

  const handleNextStep = () => {
    if (workflowState.currentStage < 10) {
      setWorkflowState((prev) => ({
        ...prev,
        currentStage: prev.currentStage + 1,
      }));
    }
  };

  const handlePrevStep = () => {
    if (workflowState.currentStage > 1) {
      setWorkflowState((prev) => ({
        ...prev,
        currentStage: prev.currentStage - 1,
      }));
    }
  };

  const handleSubmitReading = async (type: 'VALUE' | 'SHORT' | 'OPEN') => {
    if (!safetyChecked) {
      alert('يجب تأكيد شروط السلامة الكهربائية قبل تسجيل القراءة!');
      return;
    }

    let recordedValue: number | 'SHORT' | 'OPEN';
    let evaluation: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN' = 'PASS';

    if (type === 'SHORT') {
      recordedValue = 'SHORT';
      evaluation = 'SHORT';
    } else if (type === 'OPEN') {
      recordedValue = 'OPEN';
      evaluation = 'FAIL';
    } else {
      const num = parseFloat(readingInput);
      if (isNaN(num)) {
        alert('يرجى إدخال قيمة رقمية صحيحة للقراءة.');
        return;
      }
      recordedValue = num;
      if (measurement) {
        if (measurement.expectedMin !== undefined && measurement.expectedMax !== undefined) {
          evaluation = num >= measurement.expectedMin && num <= measurement.expectedMax ? 'PASS' : 'FAIL';
        } else if (measurement.nominalValue !== undefined) {
          const diff = Math.abs(num - measurement.nominalValue);
          evaluation = diff <= measurement.nominalValue * 0.1 ? 'PASS' : 'FAIL';
        }
      }
    }

    setIsSubmitting(true);

    // Call backend API for grounded AI guidance
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: board.id,
          boardCode: board.boardCode,
          faultPath,
          currentStage: workflowState.currentStage,
          targetComponentRef: workflowState.targetComponentRef,
          lastReading: recordedValue,
          unit: measurement?.unit || '',
          evaluation,
          safetyConfirmed: safetyChecked,
        }),
      });
      const data = await res.json();
      if (data.recommendationAr) {
        setAiInsight(data.recommendationAr);
      }
    } catch (err) {
      console.warn('Backend call failed, using deterministic evaluation:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Save measurement in case records
    if (measurement) {
      onRecordMeasurement({
        pointId: measurement.id,
        componentRef: measurement.componentRef,
        value: recordedValue,
        unit: measurement.unit,
        evaluation,
      });
    }

    // Advance workflow state to INTERPRET_READING stage (8)
    setWorkflowState((prev) => ({
      ...prev,
      currentStage: 8,
      lastReading: recordedValue,
      lastReadingEvaluation: evaluation,
      historySteps: [
        ...prev.historySteps,
        {
          stage: prev.currentStage,
          actionAr: `تسجيل قياس ${measurement?.nameAr || 'المكوّن'}: ${recordedValue} ${measurement?.unit || ''}`,
          readingRecorded: recordedValue,
          resultEvaluation: evaluation,
        },
      ],
    }));
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 10-Stage Visual Workflow Stepper Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[760px] relative">
          {/* Track Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
          {DIAGNOSTIC_STAGES.map((s) => {
            const isPassed = s.stage < workflowState.currentStage;
            const isCurrent = s.stage === workflowState.currentStage;
            return (
              <button
                key={s.stage}
                onClick={() => handleStageSelect(s.stage)}
                className="flex flex-col items-center gap-1.5 z-10 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/25 scale-110 shadow-lg shadow-amber-500/30'
                      : isPassed
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {isPassed ? '✓' : s.stage}
                </div>
                <span
                  className={`text-[10px] whitespace-nowrap font-medium transition-colors ${
                    isCurrent
                      ? 'text-amber-400 font-bold'
                      : isPassed
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {s.titleAr.split('.')[1]?.trim() || s.titleAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus Card (Section 5.8: النتيجة مختصرة ومنضبطة) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Primary Operational Card */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800/90 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Glowing accent border */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 opacity-80" />

          {/* Top Header of Card */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400 font-black font-mono text-xs">
                {step.targetSummary}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                المرحلة: {step.stageTitleAr}
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenBoardview}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>عرض البورد فيو</span>
              </button>
              <button
                onClick={onOpenMacroCamera}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>كاميرا Macro</span>
              </button>
            </div>
          </div>

          {/* Section 5.8 Disciplined Target Info Grid */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 mb-5 space-y-3 font-mono">
            <div className="flex items-center justify-between text-sm border-b border-slate-800/60 pb-2">
              <span className="text-slate-400 font-sans">المكوّن المستهدف:</span>
              <span className="font-bold text-amber-400 font-mono text-base bg-amber-500/10 px-2 py-0.5 rounded">
                {step.componentRef}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-b border-slate-800/60 pb-2">
              <span className="text-slate-400 font-sans">الموقع الجغرافي:</span>
              <span className="text-slate-200 font-sans">{step.locationAr}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-sans">الحالة التشغيلية:</span>
              <span className="text-emerald-400 font-sans flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {step.statusAr}
              </span>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 mb-5">
            <h4 className="text-xs font-black text-amber-400 mb-2 flex items-center gap-1.5 font-sans">
              <Zap className="w-4 h-4" />
              <span>الإجراء المطلوب تنفيذه الآن:</span>
            </h4>
            <p className="text-sm font-bold text-slate-100 leading-relaxed whitespace-pre-line font-sans">
              {step.currentActionAr}
            </p>

            {/* Probe Guides */}
            {measurement && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 bg-red-950/30 border border-red-500/30 p-2.5 rounded-xl text-red-200">
                  <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-red-400 font-bold block">مجس الآفوميتر الأحمر (+):</span>
                    <span className="font-sans font-semibold">{measurement.redProbe}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-slate-200">
                  <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">مجس الآفوميتر الأسود (-):</span>
                    <span className="font-sans font-semibold">{measurement.blackProbe}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Measurement Entry Gate */}
          {step.readingInputNeeded ? (
            <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 mb-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span>سجل القراءة المقاسة على شاشة الآفوميتر:</span>
                  {measurement && (
                    <span className="font-mono text-amber-400 font-black">
                      ({measurement.unit})
                    </span>
                  )}
                </label>
                {measurement && (
                  <span className="text-xs text-slate-400 font-mono">
                    المتوقع: {measurement.nominalValue ?? `${measurement.expectedMin} - ${measurement.expectedMax}`} {measurement.unit}
                  </span>
                )}
              </div>

              {/* Input row + Quick short / open buttons */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={readingInput}
                  onChange={(e) => setReadingInput(e.target.value)}
                  placeholder={`أدخل القيمة المقاسة (${measurement?.unit || ''})...`}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleSubmitReading('VALUE')}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد القراءة</span>
                </button>
              </div>

              {/* Quick status shortcut buttons for multimeters */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">أو حدد النتيجة مباشرة:</span>
                <button
                  onClick={() => handleSubmitReading('SHORT')}
                  className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  ⚠️ شورت كامل (0.00V / Beep)
                </button>
                <button
                  onClick={() => handleSubmitReading('OPEN')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  مسار مقطوع (OL / Open Line)
                </button>
              </div>

              {/* Mandatory Safety Confirmation Checkbox */}
              <div className="flex items-start gap-2.5 pt-3 border-t border-amber-500/20">
                <input
                  type="checkbox"
                  id="safetyCheck"
                  checked={safetyChecked}
                  onChange={(e) => setSafetyChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 mt-0.5 cursor-pointer"
                />
                <label htmlFor="safetyCheck" className="text-xs text-amber-200/90 leading-relaxed cursor-pointer">
                  {measurement?.safetyWarningAr ||
                    'أؤكد أنني راعيت شروط السلامة: فصل البطارية والشاحن عند فحص المقاومة والدايود، والتأكد من ثبات المجسات منعاً لإحداث قصر.'}
                </label>
              </div>
            </div>
          ) : (
            /* Navigation between steps when no input is waiting */
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mb-5">
              <button
                onClick={handlePrevStep}
                disabled={workflowState.currentStage <= 1}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الخطوة السابقة</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={workflowState.currentStage >= 10}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>الانتقال للخطوة التالية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* AI Grounded Insight Banner if available */}
          {aiInsight && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in duration-300">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-400 block mb-0.5">
                  توصية الوكيل الذكي (Grounded Diagnostic Insight):
                </span>
                <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
                  {aiInsight}
                </p>
              </div>
            </div>
          )}

          {/* Collapsible Deep Explanation Accordion (Section 5.8: يظهر الشرح التفصيلي في قسم قابل للفتح) */}
          <div className="mt-5 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowDeepDrawer((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/60 hover:bg-slate-950 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>الشرح الهندسي التفصيلي للمرحلة وتوثيق الدائرة</span>
              </span>
              {showDeepDrawer ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>
            {showDeepDrawer && (
              <div className="p-4 bg-slate-950/90 text-xs text-slate-300 leading-relaxed border-t border-slate-800 space-y-2.5">
                <p>{step.deepExplanationAr}</p>
                {measurement && (
                  <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-[11px] text-slate-400">
                    <div>• المسار: {measurement.conditions.powerState}</div>
                    <div>• ماذا يعني الفشل: {measurement.failureMeaningAr}</div>
                    <div>• التوثيق المرجعي: {measurement.verificationStatus}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Case Info & Workshop Shortcuts */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Case Card */}
          {activeCase && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">رقم الحالة / الكود</span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    {activeCase.caseNumber}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {activeCase.status === 'IN_PROGRESS' ? 'قيد الفحص' : activeCase.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">العميل: </span>
                  <span className="font-bold text-slate-200">{activeCase.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400">الهاتف: </span>
                  <span className="font-mono text-slate-300">{activeCase.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400">الجهاز: </span>
                  <span className="font-semibold text-slate-200">{activeCase.deviceBrand} {activeCase.deviceModel}</span>
                </div>
                <div>
                  <span className="text-slate-400">الشكوى: </span>
                  <p className="text-slate-300 mt-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] leading-relaxed">
                    {activeCase.complaintAr}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Workshop Operations Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              عمليات الصيانة والمخزون:
            </h4>

            <button
              onClick={onOpenInventory}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>مطابقة وفحص قطع الغيار المتوافقة</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={onOpenInvoice}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>إصدار الفاتورة وتقرير الصيانة المعتمد</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
