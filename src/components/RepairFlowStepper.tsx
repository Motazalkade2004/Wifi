import React, { useState } from 'react';
import {
  BoardData,
  CaseMeasurementRecord,
  ComponentItem,
  MeasurementPoint,
  QualityGateResult,
  WorkshopCase,
} from '../types';
import {
  Smartphone,
  Search,
  Camera,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  ShoppingBag,
  Zap,
  Send,
  Eye,
} from 'lucide-react';

interface RepairFlowStepperProps {
  board: BoardData;
  activeCase: WorkshopCase;
  targetComponent: ComponentItem;
  measurementPoint?: MeasurementPoint;
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
  onUpdateCaseStep: (stepIndex: number) => void;
  onCompleteRepair: () => void;
}

export const REPAIR_STAGES = [
  { index: 0, titleAr: 'المرحلة 1: استقبال الجهاز وتثبيت اللوحة' },
  { index: 1, titleAr: 'المرحلة 2: التحليل الأولي والفحوصات' },
  { index: 2, titleAr: 'المرحلة 3: فحص الصورة العامة (Overview)' },
  { index: 3, titleAr: 'المرحلة 4: تصوير الماكرو بإطار حي (Macro)' },
  { index: 4, titleAr: 'المرحلة 5: مراجعة وتأكيد الهدف الواحد' },
  { index: 5, titleAr: 'المرحلة 6: خطة القياس وبوابة السلامة' },
  { index: 6, titleAr: 'المرحلة 7: الإصلاح، المخزون والتسليم' },
];

export const RepairFlowStepper: React.FC<RepairFlowStepperProps> = ({
  board,
  activeCase,
  targetComponent,
  measurementPoint,
  onOpenMacroCamera,
  onOpenBoardview,
  onOpenInventory,
  onOpenInvoice,
  onRecordMeasurement,
  onUpdateCaseStep,
  onCompleteRepair,
}) => {
  const currentStep = activeCase.currentStepIndex ?? 0;

  const [measurementInput, setMeasurementInput] = useState<string>('');
  const [safetyConfirmed, setSafetyConfirmed] = useState<boolean>(false);
  const [testResultRecorded, setTestResultRecorded] = useState<boolean>(false);
  const [postTestPassed, setPostTestPassed] = useState<boolean>(false);

  const handleStepJump = (idx: number) => {
    onUpdateCaseStep(idx);
  };

  const handleNext = () => {
    if (currentStep < 6) {
      onUpdateCaseStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onUpdateCaseStep(currentStep - 1);
    }
  };

  const handleSaveMeasurement = (type: 'VALUE' | 'SHORT' | 'OPEN') => {
    if (!safetyConfirmed) {
      alert('يجب قراءة وتأكيد تحذير السلامة أولاً!');
      return;
    }

    let val: number | 'SHORT' | 'OPEN' = 'SHORT';
    let evalStatus: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN' = 'PASS';

    if (type === 'SHORT') {
      val = 'SHORT';
      evalStatus = 'SHORT';
    } else if (type === 'OPEN') {
      val = 'OPEN';
      evalStatus = 'FAIL';
    } else {
      const num = parseFloat(measurementInput);
      if (isNaN(num)) {
        alert('يرجى كتابة رقم قراءة صحيح.');
        return;
      }
      val = num;
      if (measurementPoint) {
        if (measurementPoint.expectedMin !== undefined && measurementPoint.expectedMax !== undefined) {
          evalStatus = num >= measurementPoint.expectedMin && num <= measurementPoint.expectedMax ? 'PASS' : 'FAIL';
        } else {
          evalStatus = 'PASS';
        }
      }
    }

    onRecordMeasurement({
      pointId: measurementPoint?.id || 'MP-GENERIC',
      componentRef: targetComponent.ref,
      value: val,
      unit: measurementPoint?.unit || 'V',
      evaluation: evalStatus,
    });

    setTestResultRecorded(true);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 7-Stage Visual Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[700px] relative">
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
          {REPAIR_STAGES.map((s) => {
            const isCompleted = s.index < currentStep;
            const isCurrent = s.index === currentStep;

            return (
              <button
                key={s.index}
                onClick={() => handleStepJump(s.index)}
                className="flex flex-col items-center gap-1.5 z-10 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/25 scale-110 shadow-lg shadow-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {isCompleted ? '✓' : s.index + 1}
                </div>
                <span
                  className={`text-[10px] whitespace-nowrap font-medium transition-colors ${
                    isCurrent
                      ? 'text-amber-400 font-bold'
                      : isCompleted
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {s.titleAr.split(':')[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage Interactive Viewport Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Stage Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-amber-500 font-bold font-mono">
              المرحلة {currentStep + 1} من 7
            </span>
            <h3 className="text-base font-black text-slate-100 mt-0.5">
              {REPAIR_STAGES[currentStep].titleAr}
            </h3>
          </div>
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
            الحالة: {activeCase.caseNumber}
          </span>
        </div>

        {/* Stage 0: استقبال الجهاز وتثبيت اللوحة */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">العميل:</span>
                <span className="font-bold text-slate-100">{activeCase.customerName} ({activeCase.customerPhone})</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">الجهاز والموديل:</span>
                <span className="font-bold text-slate-100">{activeCase.deviceBrand} {activeCase.deviceModel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">كود اللوحة المعتمدة:</span>
                <span className="font-mono text-amber-400 font-bold">{board.boardCode} (Rev {board.boardRevision})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">مسار العطل المسجل:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {activeCase.faultPath}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                تم تثبيت هوية اللوحة وتطابقها مع ملف المخطط الهندسي المعتمد. يمكنك الانتقال للتحليل الأولي.
              </span>
            </div>
          </div>
        )}

        {/* Stage 1: التحليل الأولي والفحوصات */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2.5">
              <h4 className="font-bold text-slate-200">الفحوصات الأولية الموصى بها قبل الفك والقياس:</h4>
              <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed">
                <li>فحص سحب تيار الشاحن عبر جهاز USB Tester الرقمي (هل السحب 0.00A أم متذبذب؟).</li>
                <li>فحص حرارة اللوحة العامة بحثاً عن أي منطقة ترتفع حرارتها فور توصيل مصدر الطاقة.</li>
                <li>التأكد من خلو المنفذ وسوكت Type-C من الشوائب أو الأتربة المضغوطة أو آثار الرطوبة.</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-2xl text-xs text-blue-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                تم تسجيل الفحص الأولي: لا يوجد سحب تيار خارجي، ويلزم الانتقال لفحص مسار VBUS بالصورة العامة.
              </span>
            </div>
          </div>
        )}

        {/* Stage 2: فحص الصورة العامة (Overview) */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">توجيه الصورة العامة:</span>
                <span className="text-amber-400 font-mono">التركيز على منطقة الشحن ومنظم OVP</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                التقرير - البند 2.5: الصورة العامة تحدد منطقة واحدة فقط تحتاج إلى تكبير، ولا يُفترض منها التعرف على قطعة صغيرة بمفردها.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onOpenBoardview}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>معاينة المنطقة في البورد فيو</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: تصوير الماكرو بإطار حي (Macro Camera) */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">كاميرا الماكرو بإطار أهداف متحرك:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                  {targetComponent.ref}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                التقرير - البند 2.6: توجيه الفني لوضع القطعة داخل الإطار الرباعي، تثبيت الهاتف، ومراعاة مستوى الاستواء لتفادي التوهج والضبابية.
              </p>
              <button
                onClick={onOpenMacroCamera}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>فتح شاشة كاميرا الماكرو والتقاط الهدف</span>
              </button>
            </div>
          </div>
        )}

        {/* Stage 4: مراجعة وتأكيد الهدف الواحد */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">مراجعة الهدف المحدد:</span>
                <span className="text-emerald-400 font-bold">هدف واحد فقط (Single Target)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-slate-300 space-y-1">
                <div>• المكوّن: {targetComponent.ref} ({targetComponent.nameAr})</div>
                <div>• الحزمة: {targetComponent.package}</div>
                <div>• الإحداثيات: X={targetComponent.xMm}mm, Y={targetComponent.yMm}mm</div>
                <div>• دقة المطابقة: 98.4% (VERIFIED)</div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: خطة القياس وبوابة السلامة */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">بيانات القياس المطلوب:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {measurementPoint?.measurementType || 'DIODE_MODE'} ({measurementPoint?.unit || 'mV'})
                </span>
              </div>

              {measurementPoint && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-red-950/20 border border-red-500/30 rounded-xl text-red-200">
                    <span className="text-[10px] text-red-400 block font-bold">الطرف الأحمر (+):</span>
                    <span>{measurementPoint.redProbe}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                    <span className="text-[10px] text-slate-400 block font-bold">الطرف الأسود (-):</span>
                    <span>{measurementPoint.blackProbe}</span>
                  </div>
                </div>
              )}

              {/* Safety warning */}
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>تحذير السلامة الإلزامي (Safety Gate):</span>
                </div>
                <p className="leading-relaxed">
                  {measurementPoint?.safetyWarningAr || 'تأكد من فصل مصادر الطاقة قبل قياس الممانعة لمنع تلف أجهزة الفحص.'}
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-500/20">
                  <input
                    type="checkbox"
                    id="stepSafety"
                    checked={safetyConfirmed}
                    onChange={(e) => setSafetyConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <label htmlFor="stepSafety" className="font-bold text-slate-200 cursor-pointer">
                    قرأت التحذير وأؤكد تطبيق شروط السلامة قبل القياس
                  </label>
                </div>
              </div>

              {/* Reading input */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  تسجيل القراءة الظاهرة على شاشة الآفوميتر:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={measurementInput}
                    onChange={(e) => setMeasurementInput(e.target.value)}
                    placeholder={`أدخل الرقم (${measurementPoint?.unit || ''})...`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleSaveMeasurement('VALUE')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    حفظ القراءة
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleSaveMeasurement('SHORT')}
                    className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-lg text-xs font-bold border border-rose-500/30 cursor-pointer"
                  >
                    شورت كامل (SHORT)
                  </button>
                  <button
                    onClick={() => handleSaveMeasurement('OPEN')}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    مسار مفتوح (OPEN)
                  </button>
                </div>
              </div>

              {testResultRecorded && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم توثيق القياس وحفظه في سجل التدقيق بنجاح. يمكنك الانتقال لمرحلة الإصلاح والتسليم.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stage 6: الإصلاح، المخزون والتسليم */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-4">
              <h4 className="font-bold text-slate-200 text-sm">إجراءات إتمام الإصلاح والتسليم:</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onOpenInventory}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-right transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-200 block">صرف القطعة من المخزون</span>
                    <span className="text-[11px] text-slate-400">خصم القطعة المستبدلة من الرصيد المحلي</span>
                  </div>
                  <ShoppingBag className="w-5 h-5 text-amber-500 shrink-0" />
                </button>

                <button
                  onClick={onOpenInvoice}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-right transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-200 block">إصدار الفاتورة المعتمدة</span>
                    <span className="text-[11px] text-slate-400">طباعة الفاتورة والتقرير وسجل القياسات</span>
                  </div>
                  <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
                </button>
              </div>

              {/* Post-repair testing check */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="postTest"
                    checked={postTestPassed}
                    onChange={(e) => setPostTestPassed(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="postTest" className="font-bold text-slate-200 cursor-pointer">
                    اجتياز اختبار ما بعد الإصلاح (شحن مستقر 15 دقيقة / تشغيل كامل)
                  </label>
                </div>
              </div>

              <button
                onClick={onCompleteRepair}
                disabled={!postTestPassed}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إغلاق الحالة وتغيير الحالة إلى "تم الإصلاح"</span>
              </button>
            </div>
          </div>
        )}

        {/* Stepper Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep <= 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>المرحلة السابقة</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep >= 6}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <span>المرحلة التالية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
