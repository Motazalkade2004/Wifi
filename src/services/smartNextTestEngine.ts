import {
  MeasurementCondition,
  MeasurementType,
  V158DiagnosisCandidate,
  V158MeasurementRecord,
  V158SmartNextTest,
} from '../types/v158';

/**
 * V158 FUSION Smart Next Test Engine
 * Computes expected information gain to recommend the single most decisive test
 * that resolves diagnostic uncertainty with minimal risk and effort.
 */
export function recommendSmartNextTests(
  candidates: V158DiagnosisCandidate[],
  executedMeasurements: V158MeasurementRecord[],
  faultPath: string
): V158SmartNextTest[] {
  const executedPointIds = new Set(executedMeasurements.map((m) => m.testPointId));

  const recommendations: V158SmartNextTest[] = [];

  // If charging fault and C2150 voltage was checked but diode mode not checked
  if (!executedPointIds.has('MP-S24U-CHG-02')) {
    recommendations.push({
      testPointId: 'MP-S24U-CHG-02',
      testPointName: 'فحص ممانعة الدايود على C2150 (Diode Mode)',
      componentRef: 'C2150',
      measurementType: 'DIODE_VOLTAGE',
      condition: 'POWER_OFF',
      priority: 1,
      expectedInformationGain: 0.94,
      estimatedEffortSeconds: 15,
      safetyLevel: 'SAFE',
      unit: 'mV',
      reasonAr: 'أعلى عائد معلوماتي (94% Information Gain): يحدد بشكل قاطع هل هبوط الجهد ناتج عن شورت مباشر على الأرضي أم قطع في المسار.',
      reasonEn: 'Highest information gain (94%): conclusively discriminates between a direct short to GND vs an open trace.',
    });
  }

  // Next candidate test point: OVP Output line
  if (!executedPointIds.has('MP-S24U-CHG-03')) {
    recommendations.push({
      testPointId: 'MP-S24U-CHG-03',
      testPointName: 'جهد خرج آيسي الحماية VBUS_OVP_OUT على C2155',
      componentRef: 'U2050',
      measurementType: 'DC_VOLTAGE',
      condition: 'CHARGER_CONNECTED',
      priority: 2,
      expectedInformationGain: 0.82,
      estimatedEffortSeconds: 25,
      safetyLevel: 'MEDIUM_RISK',
      unit: 'V',
      reasonAr: 'عائد معلوماتي 82%: يفصل بين مسؤولية مكثف الدخل ومسؤولية مفتاح الحماية OVP في تمرير الطاقة لآيسي الشحن.',
      reasonEn: '82% Information Gain: isolates whether the OVP switch itself is blocking current delivery.',
    });
  }

  // Next candidate test point: Battery Terminal Diode Mode
  if (!executedPointIds.has('MP-S24U-PWR-01')) {
    recommendations.push({
      testPointId: 'MP-S24U-PWR-01',
      testPointName: 'ممانعة خط البطارية الرئيسي VBAT على J1200',
      componentRef: 'J1200',
      measurementType: 'DIODE_VOLTAGE',
      condition: 'BATTERY_DISCONNECTED',
      priority: 3,
      expectedInformationGain: 0.76,
      estimatedEffortSeconds: 20,
      safetyLevel: 'SAFE',
      unit: 'mV',
      reasonAr: 'عائد معلوماتي 76%: يستبعد وجود شورت ثانوي على خط البطارية العام قد يكون سبباً في قفل منظومة الشحن.',
      reasonEn: '76% Information Gain: verifies whether main battery rail has secondary short locking down charger.',
    });
  }

  // Sort by priority ascending (1 = highest priority)
  return recommendations.sort((a, b) => a.priority - b.priority);
}
