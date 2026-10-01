import {
  DataTrust,
  MeasurementCondition,
  MeasurementStatus,
  MeasurementType,
  V158MeasurementRecord,
  V158MeasurementReference,
} from '../types/v158';

export interface EvaluationResult {
  status: MeasurementStatus;
  deviationPercent?: number;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  explanationAr: string;
  explanationEn: string;
  normalizedValue: number | 'SHORT' | 'OPEN';
  referenceMatched?: V158MeasurementReference;
}

/**
 * Normalizes input value and unit to standard engineering base (V, Ω, A, °C, Hz).
 */
export function normalizeMeasurementUnit(val: number, unit: string): { normalizedVal: number; standardUnit: string } {
  const cleanUnit = unit.trim().toLowerCase();
  switch (cleanUnit) {
    case 'mv':
      return { normalizedVal: val / 1000, standardUnit: 'V' };
    case 'v':
      return { normalizedVal: val, standardUnit: 'V' };
    case 'kω':
    case 'kohm':
    case 'k':
      return { normalizedVal: val * 1000, standardUnit: 'Ω' };
    case 'mω':
    case 'mohm':
      return { normalizedVal: val * 1000000, standardUnit: 'Ω' };
    case 'ω':
    case 'ohm':
      return { normalizedVal: val, standardUnit: 'Ω' };
    case 'ma':
      return { normalizedVal: val / 1000, standardUnit: 'A' };
    case 'a':
      return { normalizedVal: val, standardUnit: 'A' };
    default:
      return { normalizedVal: val, standardUnit: unit };
  }
}

/**
 * V158 FUSION Measurement Engine 2.0
 * Evaluates measured readings against board-revision-specific trusted references.
 */
export function evaluateMeasurement(
  caseId: string,
  boardRevisionId: string,
  testPointId: string,
  measurementType: MeasurementType,
  condition: MeasurementCondition,
  measuredValue: number | 'SHORT' | 'OPEN',
  inputUnit: string,
  referencesCatalog: V158MeasurementReference[]
): EvaluationResult {
  // 1. Locate strictly matching revision reference
  const matchingRef = referencesCatalog.find(
    (r) =>
      r.boardRevisionId.toLowerCase() === boardRevisionId.toLowerCase() &&
      r.testPointId.toLowerCase() === testPointId.toLowerCase() &&
      r.measurementType === measurementType &&
      r.condition === condition
  );

  // If no reference exists, comply with hard rule: DO NOT convert silently to PASS/FAIL
  if (!matchingRef) {
    return {
      status: 'NO_REFERENCE',
      severity: 'WARNING',
      explanationAr: `لا يوجد مرجع هندسي موثق لنقطة [${testPointId}] على إصدار اللوحة [${boardRevisionId}] في وضع (${condition}).`,
      explanationEn: `No authoritative reference exists for test point [${testPointId}] on board revision [${boardRevisionId}] under condition (${condition}).`,
      normalizedValue: measuredValue,
    };
  }

  // 2. Hard Security Rule: TEST data must never be presented as authoritative production reference
  if (matchingRef.trustLevel === 'TEST') {
    return {
      status: 'WARNING',
      severity: 'WARNING',
      explanationAr: `تنبيه أمني: المرجع المتوفر مصنف كـ [TEST بيانات تجريبية]، ويمنع النظام اعتماده لاتخاذ قرار صيانة نهائي.`,
      explanationEn: `Security Alert: The available reference is classified as [TEST data] and must not be used as authoritative repair reference.`,
      normalizedValue: measuredValue,
      referenceMatched: matchingRef,
    };
  }

  // 3. Handle categorical values (SHORT / OPEN)
  if (measuredValue === 'SHORT') {
    const isShortExpected = matchingRef.nominalValue === 0 || matchingRef.minValue === 0;
    return {
      status: isShortExpected ? 'PASS' : 'FAIL_LOW',
      severity: isShortExpected ? 'NORMAL' : 'CRITICAL',
      explanationAr: isShortExpected
        ? 'قراءة قصر (Short/0Ω) مطابقة للمسار الأرضي المقصود.'
        : 'قصر غير طبيعي (Short to GND / 0.00V) على خط التغذية؛ يشير إلى احتراق مكثف توازي أو تلف شريحة داخلية.',
      explanationEn: isShortExpected
        ? 'Short reading (0Ω) matches intended ground net.'
        : 'Abnormal short circuit to GND on power rail; indicates shorted capacitor or defective IC.',
      normalizedValue: 'SHORT',
      referenceMatched: matchingRef,
    };
  }

  if (measuredValue === 'OPEN') {
    const isOpenExpected = matchingRef.nominalValue === undefined && matchingRef.maxValue === undefined;
    return {
      status: isOpenExpected ? 'PASS' : 'FAIL_HIGH',
      severity: isOpenExpected ? 'NORMAL' : 'CRITICAL',
      explanationAr: isOpenExpected
        ? 'مسار مفتوح (Open Line / OL) متطابق مع المرجع.'
        : 'انقطاع صريح في المسار (Open Line / OL)؛ يشير إلى قطع في خط الفلكس أو تفحم ملف التوصيل.',
      explanationEn: isOpenExpected
        ? 'Open Line (OL) matches expected high-Z state.'
        : 'Open Line detected where continuity is expected; trace rupture or open coil.',
      normalizedValue: 'OPEN',
      referenceMatched: matchingRef,
    };
  }

  // 4. Handle numeric measurements with unit normalization
  const { normalizedVal } = normalizeMeasurementUnit(measuredValue, inputUnit);
  const refNorm = matchingRef.nominalValue !== undefined
    ? normalizeMeasurementUnit(matchingRef.nominalValue, matchingRef.unit).normalizedVal
    : undefined;
  const refMin = matchingRef.minValue !== undefined
    ? normalizeMeasurementUnit(matchingRef.minValue, matchingRef.unit).normalizedVal
    : undefined;
  const refMax = matchingRef.maxValue !== undefined
    ? normalizeMeasurementUnit(matchingRef.maxValue, matchingRef.unit).normalizedVal
    : undefined;

  let deviationPercent: number | undefined;
  if (refNorm && refNorm !== 0) {
    deviationPercent = Number((((normalizedVal - refNorm) / refNorm) * 100).toFixed(1));
  }

  // Range evaluation
  if (refMin !== undefined && normalizedVal < refMin) {
    return {
      status: 'FAIL_LOW',
      deviationPercent,
      severity: 'CRITICAL',
      explanationAr: `القراءة (${measuredValue} ${inputUnit}) أقل بكثير من الحد الأدنى المسموح (${matchingRef.minValue} ${matchingRef.unit}). هبوط جهد أو ممانعة منخفضة.`,
      explanationEn: `Measured reading (${measuredValue} ${inputUnit}) is lower than minimum allowed threshold (${matchingRef.minValue} ${matchingRef.unit}). Rail droop or leakage.`,
      normalizedValue: normalizedVal,
      referenceMatched: matchingRef,
    };
  }

  if (refMax !== undefined && normalizedVal > refMax) {
    return {
      status: 'FAIL_HIGH',
      deviationPercent,
      severity: 'CRITICAL',
      explanationAr: `القراءة (${measuredValue} ${inputUnit}) أعلى من الحد الأقصى المسموح (${matchingRef.maxValue} ${matchingRef.unit}). يشير إلى جهد زائد أو ممانعة مرتفعة.`,
      explanationEn: `Measured reading (${measuredValue} ${inputUnit}) exceeds maximum allowed threshold (${matchingRef.maxValue} ${matchingRef.unit}). Overvoltage or high impedance.`,
      normalizedValue: normalizedVal,
      referenceMatched: matchingRef,
    };
  }

  // Tolerance check
  const tolerance = matchingRef.tolerancePercent || 10;
  if (deviationPercent !== undefined && Math.abs(deviationPercent) > tolerance) {
    return {
      status: 'WARNING',
      deviationPercent,
      severity: 'WARNING',
      explanationAr: `القراءة (${measuredValue} ${inputUnit}) تنحرف بنسبة (${deviationPercent}%) عن القيمة الاسمية المعتمدة (${matchingRef.nominalValue} ${matchingRef.unit}).`,
      explanationEn: `Measured reading (${measuredValue} ${inputUnit}) deviates by (${deviationPercent}%) from nominal reference (${matchingRef.nominalValue} ${matchingRef.unit}).`,
      normalizedValue: normalizedVal,
      referenceMatched: matchingRef,
    };
  }

  return {
    status: 'PASS',
    deviationPercent: deviationPercent || 0,
    severity: 'NORMAL',
    explanationAr: `القراءة (${measuredValue} ${inputUnit}) سليمة وضمن النطاق الهندسي المعتمد (مرجع موثق: ${matchingRef.provenance}).`,
    explanationEn: `Reading (${measuredValue} ${inputUnit}) matches trusted reference range (Provenance: ${matchingRef.provenance}).`,
    normalizedValue: normalizedVal,
    referenceMatched: matchingRef,
  };
}
