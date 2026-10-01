import {
  DiagnosisStatus,
  EvidenceSource,
  V158DiagnosisCandidate,
  V158Evidence,
  V158MeasurementRecord,
} from '../types/v158';

export interface DiagnosticInputContext {
  symptom: string;
  faultPath: string;
  boardRevisionId: string;
  measurements: V158MeasurementRecord[];
  visualObservations?: string[];
}

/**
 * V158 FUSION Evidence & Diagnosis Engine
 * Produces explainable diagnostic conclusions by weighting observations,
 * cross-referencing net relations, and analyzing contradictions.
 */
export function generateDiagnoses(context: DiagnosticInputContext): V158DiagnosisCandidate[] {
  const candidates: V158DiagnosisCandidate[] = [];
  const evidences: V158Evidence[] = [];

  // 1. Process Measurement Evidences
  context.measurements.forEach((m) => {
    if (m.status === 'FAIL_LOW' || m.status === 'FAIL_HIGH') {
      evidences.push({
        id: `EV-M-${m.id}`,
        source: 'MEASUREMENT',
        titleAr: `انحراف في القياس على النقطة [${m.testPointId}]`,
        titleEn: `Measurement anomaly on test point [${m.testPointId}]`,
        descriptionAr: `القراءة المقاسة (${m.measuredValue} ${m.unit}) خارج النطاق المعتمد (الحالة: ${m.status}). ${m.anomalyExplanationAr || ''}`,
        descriptionEn: `Reading (${m.measuredValue} ${m.unit}) outside trusted boundaries (Status: ${m.status}).`,
        weight: 0.85,
        supportsCandidateRef: m.testPointId.includes('CHG') || m.testPointId.includes('2150')
          ? 'C2150'
          : m.testPointId.includes('PWR') || m.testPointId.includes('1200')
          ? 'U2000'
          : 'D2001',
        timestamp: m.timestamp,
      });
    } else if (m.status === 'PASS') {
      // Contradiction evidence: if line is PASS, it contradicts that this component is shorted
      evidences.push({
        id: `EV-PASS-${m.id}`,
        source: 'MEASUREMENT',
        titleAr: `قياس سليم على [${m.testPointId}]`,
        titleEn: `Healthy measurement on [${m.testPointId}]`,
        descriptionAr: `القراءة المقاسة (${m.measuredValue} ${m.unit}) سليمة 100%، مما يستبعد وجود قصر أو قطع في هذا الموضع.`,
        descriptionEn: `Reading (${m.measuredValue} ${m.unit}) is nominal, excluding short or open circuit on this net.`,
        weight: 0.9,
        supportsCandidateRef: 'SYSTEM_HEALTHY',
        contradictsCandidateRef: m.testPointId.includes('2150') ? 'C2150' : 'U2000',
        timestamp: m.timestamp,
      });
    }
  });

  // 2. Process Symptom & Circuit Relationship Rules
  if (context.faultPath === 'CHARGING') {
    evidences.push({
      id: `EV-RULE-CHG`,
      source: 'RULE',
      titleAr: 'قاعدة فحص مسار شحن Type-C',
      titleEn: 'USB-C Charging diagnostic rule',
      descriptionAr: 'عند انعدام سحب التيار والشحن، تكون الأولوية لمكثف الدخل C2150 ودايود الحماية D2001 ثم شريحة OVP.',
      descriptionEn: 'When 0.00A current intake occurs, primary suspects are input cap C2150, TVS diode D2001, then OVP switch.',
      weight: 0.75,
      supportsCandidateRef: 'C2150',
      timestamp: new Date().toISOString(),
    });
  } else if (context.faultPath === 'POWER') {
    evidences.push({
      id: `EV-RULE-PWR`,
      source: 'RULE',
      titleAr: 'قاعدة دائرة الباور والإقلاع',
      titleEn: 'Main PMIC & Booting rule',
      descriptionAr: 'انطفاء الجهاز مع سحب تيار منخفض أو صفارة شورت أولي يرجح تلف آيسي الباور الرئيسي U2000 أو شورت على خط VBAT.',
      descriptionEn: 'Dead boot with initial power draw implicates main PMIC U2000 or VBAT short.',
      weight: 0.8,
      supportsCandidateRef: 'U2000',
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Compile Candidate 1: C2150 (VBUS Filter Cap)
  const c2150Supporting = evidences.filter((e) => e.supportsCandidateRef === 'C2150');
  const c2150Contradicting = evidences.filter((e) => e.contradictsCandidateRef === 'C2150');

  let c2150Score = 0;
  c2150Supporting.forEach((e) => (c2150Score += e.weight * 50));
  c2150Contradicting.forEach((e) => (c2150Score -= e.weight * 60));
  c2150Score = Math.max(0, Math.min(100, Math.round(c2150Score)));

  let c2150Status: DiagnosisStatus = 'INCONCLUSIVE';
  if (c2150Score >= 85 && c2150Contradicting.length === 0) c2150Status = 'CONFIRMED';
  else if (c2150Score >= 65) c2150Status = 'PROBABLE';
  else if (c2150Score >= 35) c2150Status = 'POSSIBLE';

  candidates.push({
    componentRef: 'C2150',
    netId: 'VBUS_5V_IN',
    componentNameAr: 'مكثف ترشيح خط الشحن VBUS 5V',
    componentNameEn: 'VBUS 5V Input Ceramic Filter Capacitor',
    confidenceScore: c2150Score,
    status: c2150Status,
    explanationAr: c2150Status === 'CONFIRMED'
      ? 'تم تأكيد العطل: المكثف C2150 به قصر صريح (Short to GND) يمنع مرور تيار الشاحن ويتسبب في حماية الباور.'
      : c2150Status === 'PROBABLE'
      ? 'احتمال مرتفع: الأدلة والقياسات ترجح شورت أو تسريب على مكثف الدخل C2150.'
      : 'مرشح محتمل: يتطلب إجراء فحص ممانعة إضافي لحسم الحالة.',
    explanationEn: c2150Status === 'CONFIRMED'
      ? 'Confirmed Fault: Capacitor C2150 is shorted to GND, blocking VBUS rail and triggering OVP shutdown.'
      : 'Probable cause supported by voltage drop on charging line.',
    supportingEvidence: c2150Supporting,
    contradictingEvidence: c2150Contradicting,
    isConfirmedLocation: c2150Status === 'CONFIRMED',
  });

  // 4. Compile Candidate 2: U2050 / OVP IC
  const u2050Supporting = evidences.filter((e) => e.supportsCandidateRef === 'U2050');
  const u2050Contradicting = evidences.filter((e) => e.contradictsCandidateRef === 'U2050');
  let u2050Score = context.faultPath === 'CHARGING' ? 55 : 20;

  candidates.push({
    componentRef: 'U2050',
    netId: 'VBUS_OVP_OUT',
    componentNameAr: 'آيسي حماية الجهد العالي OVP Switch',
    componentNameEn: 'Over-Voltage Protection Load Switch IC',
    confidenceScore: u2050Score,
    status: u2050Score >= 70 ? 'PROBABLE' : 'POSSIBLE',
    explanationAr: 'شريحة OVP في مسار الشحن قد تفصل تمرير الجهد بسبب عطل داخلي أو إشارة Enable مفقودة.',
    explanationEn: 'OVP IC might block current delivery due to internal gate failure or missing enable signal.',
    supportingEvidence: u2050Supporting,
    contradictingEvidence: u2050Contradicting,
    isConfirmedLocation: false,
  });

  // 5. Compile Candidate 3: Main PMIC U2000
  if (context.faultPath === 'POWER' || context.measurements.some((m) => m.testPointId.includes('PWR'))) {
    candidates.push({
      componentRef: 'U2000',
      netId: 'VBAT_MAIN',
      componentNameAr: 'آيسي الباور الرئيسي (Main PMIC S2MPS24)',
      componentNameEn: 'Main Power Management IC',
      confidenceScore: 78,
      status: 'PROBABLE',
      explanationAr: 'خلل في مسار إقلاع الباور وخطوط التغذية المنخفضة VDD_CORE.',
      explanationEn: 'Fault in primary power sequencing and VDD_CORE buck converters.',
      supportingEvidence: evidences.filter((e) => e.supportsCandidateRef === 'U2000'),
      contradictingEvidence: evidences.filter((e) => e.contradictsCandidateRef === 'U2000'),
      isConfirmedLocation: false,
    });
  }

  // Sort candidates by explainable confidence score descending
  return candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);
}
