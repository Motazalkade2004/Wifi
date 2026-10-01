import {
  BoardData,
  BoardSide,
  ComponentItem,
  DiagnosticAgentStep,
  DiagnosticStageKey,
  FaultPath,
  MeasurementPoint,
} from '../types';

export interface DiagnosticWorkflowState {
  currentStage: number; // 1 to 10
  board: BoardData;
  side: BoardSide;
  faultPath: FaultPath;
  targetRegionId: string;
  targetComponentRef: string;
  selectedMeasurementPoint?: MeasurementPoint;
  lastReading?: number | 'SHORT' | 'OPEN';
  lastReadingEvaluation?: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN';
  isBoardVerified: boolean;
  isImageQualityApproved: boolean;
  historySteps: {
    stage: number;
    actionAr: string;
    readingRecorded?: any;
    resultEvaluation?: string;
  }[];
}

export const DIAGNOSTIC_STAGES: {
  stage: number;
  key: DiagnosticStageKey;
  titleAr: string;
}[] = [
  { stage: 1, key: 'IDENTIFY_DEVICE', titleAr: '1. تثبيت هوية الجهاز واللوحة' },
  { stage: 2, key: 'VERIFY_BOARD', titleAr: '2. مطابقة معالم اللوحة والوجه' },
  { stage: 3, key: 'CHECK_IMAGE_QUALITY', titleAr: '3. فحص جودة ووضوح الصورة' },
  { stage: 4, key: 'LOCATE_REGION', titleAr: '4. حصر المنطقة الوظيفية للعطل' },
  { stage: 5, key: 'LOCATE_COMPONENT', titleAr: '5. تحديد المكوّن المستهدف (Macro)' },
  { stage: 6, key: 'SELECT_MEASUREMENT', titleAr: '6. تحديد خطة ونقاط القياس' },
  { stage: 7, key: 'WAIT_FOR_READING', titleAr: '7. بوابة تنفيذ وتسجيل القياس' },
  { stage: 8, key: 'INTERPRET_READING', titleAr: '8. تفسير القراءة ومطابقة المرجع' },
  { stage: 9, key: 'SELECT_NEXT_TEST', titleAr: '9. تحديد الفحص التالي أو النتيجة' },
  { stage: 10, key: 'STOP_OR_ESCALATE', titleAr: '10. حسم التشخيص وخطة الإصلاح' },
];

/**
 * Produces disciplined, concise single-step instructions for the technician.
 * Strictly adheres to Section 5.8 of the Handover Report:
 * Never outputs conversational essays or fluff in the primary view.
 */
export function generateAgentStep(state: DiagnosticWorkflowState): DiagnosticAgentStep {
  const currentStageDef = DIAGNOSTIC_STAGES.find((s) => s.stage === state.currentStage) || DIAGNOSTIC_STAGES[0];
  const region = state.board.regions.find((r) => r.id === state.targetRegionId);
  const component = state.board.components.find((c) => c.ref === state.targetComponentRef);
  const measurement = state.selectedMeasurementPoint;

  const sideLabel = state.side === 'TOP' ? 'الوجه العلوي (TOP)' : 'الوجه السفلي (BOTTOM)';
  const regionName = region ? region.nameAr : 'المنطقة العامة';
  const compRef = component ? component.ref : (state.targetComponentRef || 'غير محدد');

  switch (currentStageDef.key) {
    case 'IDENTIFY_DEVICE':
      return {
        stage: 1,
        stageKey: 'IDENTIFY_DEVICE',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: مطابقة الطراز',
        componentRef: compRef,
        locationAr: `${state.board.model} — كود اللوحة: ${state.board.boardCode}`,
        statusAr: 'بانتظار تأكيد الفني لهوية الجهاز وإصداره الإقليمي',
        currentActionAr: `تأكد من مطابقة كود اللوحة (${state.board.boardCode}) مع لوحة الهاتف بين يديك قبل بدء أي فحص.`,
        readingInputNeeded: false,
        deepExplanationAr: `تم جلب المخطط الهندسي المعتمد لجهاز ${state.board.model} إصدار ${state.board.boardRevision}. يمنع النظام الانتقال لتشخيص القطع بدون تثبيت الهوية لتفادي الفحص على مخطط خاطئ.`,
      };

    case 'VERIFY_BOARD':
      return {
        stage: 2,
        stageKey: 'VERIFY_BOARD',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: صورة عامة للوحة',
        componentRef: 'Landmarks / المعالم الثابتة',
        locationAr: `${sideLabel}`,
        statusAr: state.isBoardVerified ? 'تمت مطابقة معالم اللوحة بنجاح' : 'يلزم التقاط صورة عامة للتأكد من الوجه',
        currentActionAr: `وجّه الكاميرا لالتقاط صورة كاملة للوحة من ${sideLabel} للتأكد من الموصلات والشيلدات الرئيسية.`,
        readingInputNeeded: false,
        deepExplanationAr: 'يتحقق النظام من مطابقة 5 علامات هندسية مرجعية (ثقوب البراغي، موصلات FPC، زوايا الشيلدات) لمنع البحث عن قطعة في وجه خاطئ أو في لوحة مقلوبة.',
      };

    case 'CHECK_IMAGE_QUALITY':
      return {
        stage: 3,
        stageKey: 'CHECK_IMAGE_QUALITY',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: جودة التصوير',
        componentRef: compRef,
        locationAr: `${regionName} — ${sideLabel}`,
        statusAr: state.isImageQualityApproved ? 'الصورة معتمدة ومطابقة للمواصفات' : 'فحص الحدة والضوء محلياً',
        currentActionAr: 'افحص وضوح الصورة وتجنب الانعكاس الأبيض القوي المباشر على أرجل القطع.',
        readingInputNeeded: false,
        deepExplanationAr: 'يتم فحص الحدة بمصفوفة لابلاسيان 2D وتحديد نسبة التوهج الشمسي/المجهري. إذا سقط الفحص يرفض النظام فوراً بدون استهلاك الذكاء الاصطناعي.',
      };

    case 'LOCATE_REGION':
      return {
        stage: 4,
        stageKey: 'LOCATE_REGION',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: `الهدف 1 من 1: حصر منطقة ${regionName}`,
        componentRef: region?.nameEn || 'ZONE',
        locationAr: `${regionName} — ${sideLabel}`,
        statusAr: 'تم تحديد المنطقة الهندسية',
        currentActionAr: `ركّز العدسة والمجسات على ${regionName} (المحددة بالإطار الأصفر على اللوحة).`,
        readingInputNeeded: false,
        deepExplanationAr: `بناءً على مسار العطل المختار (${state.faultPath})، فإن نقطة الفشل الأكثر احتمالية تقع داخل ${regionName} المحتوية على ${state.board.components.filter(c => c.regionId === state.targetRegionId).length} مكوّناً.`,
      };

    case 'LOCATE_COMPONENT':
      return {
        stage: 5,
        stageKey: 'LOCATE_COMPONENT',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: مكوّن محدد ومفرد',
        componentRef: compRef,
        locationAr: `${regionName} — ${sideLabel}`,
        statusAr: 'يحتاج تأكيد بالصورة المكبرة (Macro)',
        currentActionAr: `وجّه مجس الفحص إلى المكوّن [ ${compRef} ] الموضح في الصورة المكبرة مع مراقبة المكوّنات المجاورة.`,
        readingInputNeeded: false,
        deepExplanationAr: `المكوّن ${compRef} بحزمة ${component?.package || 'SMD'} بقيمة ${component?.value || 'N/A'}. النظام يوضح القطع المحيطة حتى لا يختلط عليك مع مكثف مجاور.`,
      };

    case 'SELECT_MEASUREMENT':
      return {
        stage: 6,
        stageKey: 'SELECT_MEASUREMENT',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: خطة القياس والسلامة',
        componentRef: compRef,
        locationAr: `${regionName} — ${sideLabel}`,
        statusAr: 'تم إعداد شروط الفحص وأطراف الآفوميتر',
        currentActionAr: measurement
          ? `اضبط الآفوميتر على وضع (${measurement.measurementType === 'DC_VOLTAGE' ? 'الجهد المستمر DC V' : measurement.measurementType === 'DIODE_MODE' ? 'الدايود / الممانعة' : 'المقاومة'}). ضع الطرف الأحمر على: [ ${measurement.redProbe} ] والطرف الأسود على: [ ${measurement.blackProbe} ].`
          : `قِس الممانعة أو الجهد بين طرفي ${compRef}.`,
        readingInputNeeded: false,
        deepExplanationAr: measurement?.safetyWarningAr || 'تأكد من اتباع شروط السلامة بدقة.',
        measurementPointId: measurement?.id,
      };

    case 'WAIT_FOR_READING':
      return {
        stage: 7,
        stageKey: 'WAIT_FOR_READING',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: تسجيل القراءة',
        componentRef: compRef,
        locationAr: `${regionName} — ${sideLabel}`,
        statusAr: 'بوابة إجبارية: أدخل القراءة الظاهرة على شاشة الآفوميتر',
        currentActionAr: measurement
          ? `الإجراء الآن:\nضع المجسات بدقة وسجّل القراءة الظاهرة بوحدة (${measurement.unit}).\nالقيمة المرجعية المتوقعة: ${measurement.nominalValue ?? `${measurement.expectedMin} - ${measurement.expectedMax}`} ${measurement.unit}`
          : `سجّل القراءة المقاسة على ${compRef}.`,
        readingInputNeeded: true,
        deepExplanationAr: 'النظام لا يسمح بتخطي البوابة إلا بعد كتابة الرقم الفعلي المقاس لتسجيله في سجل التدقيق المعتمد للورشة.',
        measurementPointId: measurement?.id,
      };

    case 'INTERPRET_READING':
      const evalStatus = state.lastReadingEvaluation || 'PASS';
      const isPass = evalStatus === 'PASS';
      return {
        stage: 8,
        stageKey: 'INTERPRET_READING',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: `نتيجة القياس: ${state.lastReading ?? 'مسجلة'} (${isPass ? 'مطابق للمرجع ✓' : 'غير طبيعي ✗'})`,
        componentRef: compRef,
        locationAr: `${regionName} — ${sideLabel}`,
        statusAr: isPass ? 'القراءة طبيعية وضمن النطاق المعتمد' : 'تم اكتشاف خلل في هذا المسار',
        currentActionAr: isPass
          ? (measurement?.nextStepPassAr || 'القراءة سليمة؛ انتقل للخطوة التالية.')
          : (measurement?.nextStepFailAr || 'النتيجة تفيد بوجود عطل في هذا المسار.'),
        readingInputNeeded: false,
        deepExplanationAr: isPass
          ? 'المسار الكهربائي سليم من حيث الفولتية والممانعة؛ العطل ليس شورت على هذا المكثف.'
          : (measurement?.failureMeaningAr || 'قيمة غير متوافقة مع المخطط الهندسي.'),
        measurementPointId: measurement?.id,
      };

    case 'SELECT_NEXT_TEST':
      return {
        stage: 9,
        stageKey: 'SELECT_NEXT_TEST',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'الهدف 1 من 1: الخطوة التالية الموجهة',
        componentRef: compRef,
        locationAr: `${regionName}`,
        statusAr: 'ترتيب الفرضيات والخطوة التالية',
        currentActionAr: 'بناءً على النتيجة السابقة، انتقل إلى فحص الخرج أو الانتقال للقطعة البديلة.',
        readingInputNeeded: false,
        deepExplanationAr: 'يقوم الوكيل الذكي بترتيب الأولويات الهندسية بناءً على القراءة الفعلية، دون تخمين قياسات وهمية أو اختراع أسماء قطع.',
      };

    case 'STOP_OR_ESCALATE':
    default:
      return {
        stage: 10,
        stageKey: 'STOP_OR_ESCALATE',
        stageTitleAr: currentStageDef.titleAr,
        targetSummary: 'اكتمال التشخيص / النتيجة النهائية',
        componentRef: compRef,
        locationAr: `${state.board.model}`,
        statusAr: 'جاهز لإصدار أمر العمل وتقرير الفاتورة',
        currentActionAr: 'تم حصر العطل وتوثيق القياسات بنجاح. يمكنك الآن استبدال القطعة المعطوبة من المخزون أو إصدار الفاتورة.',
        readingInputNeeded: false,
        deepExplanationAr: 'تم حفظ كافة القياسات والصور المعايرة في سجل التدقيق غير القابل للتعديل.',
      };
  }
}
