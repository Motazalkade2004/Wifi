import { CompatibilityStatus, V158CompatibilityItem } from '../types/v158';

export const COMPATIBILITY_DATABASE: V158CompatibilityItem[] = [
  {
    id: 'COMPAT-001',
    sourcePartSku: 'IC-OVP-FPF2895',
    targetModel: 'Galaxy S24 Ultra',
    targetBoardCode: 'SM-S928B-REV-01',
    partCategory: 'IC',
    status: 'VERIFIED_COMPATIBLE',
    confidencePercent: 100,
    physicalFit: true,
    electricalCompatible: true,
    connectorCompatible: true,
    firmwareDependency: false,
    evidenceNotesAr: 'متطابق بنسبة 100%: حزمة WLCSP-12، جهد عمل 28V، تيار أقصى 5A، تم اختباره والتأكد منه في مخطط سامسونج الرسمي.',
    evidenceNotesEn: '100% Verified Match: WLCSP-12 footprint, 28V max input, 5A peak current, confirmed by Samsung official schematics.',
    warningsAr: ['احرص على استخدام حرارة تركيب لا تتجاوز 260°C لتفادي تلف رقاقة السيليكون.'],
    warningsEn: ['Rework soldering profile must not exceed 260°C to protect delicate die.'],
  },
  {
    id: 'COMPAT-002',
    sourcePartSku: 'IC-OVP-FPF2895',
    targetModel: 'Galaxy S23 Ultra',
    targetBoardCode: 'SM-S918B-REV-0.4',
    partCategory: 'IC',
    status: 'VERIFIED_COMPATIBLE',
    confidencePercent: 100,
    physicalFit: true,
    electricalCompatible: true,
    connectorCompatible: true,
    firmwareDependency: false,
    evidenceNotesAr: 'شريحة الحماية OVP في S23 Ultra مطابقة تماماً لنفس الباكدج ونقاط اللحام والتوصيل.',
    evidenceNotesEn: 'OVP IC in S23 Ultra uses exact same pinout and thermal profile.',
  },
  {
    id: 'COMPAT-003',
    sourcePartSku: 'IC-OVP-FPF2895',
    targetModel: 'Galaxy A54 5G',
    targetBoardCode: 'SM-A546B-REV-0.3',
    partCategory: 'IC',
    status: 'LIKELY_COMPATIBLE',
    confidencePercent: 88,
    physicalFit: true,
    electricalCompatible: true,
    connectorCompatible: true,
    firmwareDependency: false,
    evidenceNotesAr: 'متوافق كهربائياً وميكانيكياً؛ أقصى تيار مدعوم 5A يفي بمتطلبات الشحن 25W للجهاز.',
    evidenceNotesEn: 'Electrically and mechanically compatible; 5A capacity comfortably covers 25W fast charge.',
    warningsAr: ['تحقق من اتجاه النقطة الدليلية (Pin 1 Dot) قبل التثبيت.'],
  },
  {
    id: 'COMPAT-004',
    sourcePartSku: 'CAP-0402-10UF-25V',
    targetModel: 'Galaxy S24 Ultra',
    targetBoardCode: 'SM-S928B-REV-01',
    partCategory: 'PASSIVE' as any,
    status: 'VERIFIED_COMPATIBLE',
    confidencePercent: 100,
    physicalFit: true,
    electricalCompatible: true,
    connectorCompatible: true,
    firmwareDependency: false,
    evidenceNotesAr: 'مكثف 0402 10µF 25V X5R معتمد كبديل مطابق لمكثف C2150.',
    evidenceNotesEn: '0402 10uF 25V X5R capacitor certified as direct drop-in replacement for C2150.',
  },
  {
    id: 'COMPAT-005',
    sourcePartSku: 'CAP-0402-10UF-25V',
    targetModel: 'iPhone 15 Pro',
    targetBoardCode: 'IPHONE-15P-MLB-REV-1.0',
    partCategory: 'PASSIVE' as any,
    status: 'VERIFIED_COMPATIBLE',
    confidencePercent: 100,
    physicalFit: true,
    electricalCompatible: true,
    connectorCompatible: true,
    firmwareDependency: false,
    evidenceNotesAr: 'متطابق مع مكثف C3100 على مسار PP_VBUS_USBC.',
    evidenceNotesEn: 'Identical physical footprint and voltage rating for iPhone 15 Pro C3100 VBUS capacitor.',
  },
  {
    id: 'COMPAT-006',
    sourcePartSku: 'FPC-CONN-S24U-CHG',
    targetModel: 'Galaxy S23 Ultra',
    targetBoardCode: 'SM-S918B-REV-0.4',
    partCategory: 'CHARGING_PORT',
    status: 'INCOMPATIBLE',
    confidencePercent: 99,
    physicalFit: false,
    electricalCompatible: false,
    connectorCompatible: false,
    firmwareDependency: false,
    evidenceNotesAr: 'غير متوافق إطلاقاً: موصل S24 Ultra يحتوي على 40 بن بمسافة 0.35mm بينما S23 Ultra يستخدم موصل 48 بن.',
    evidenceNotesEn: 'Known Incompatibility: S24 Ultra uses 40-pin header (0.35mm pitch) whereas S23 Ultra uses 48-pin header.',
    warningsAr: ['تحذير حاسم: يمنع محاولة تركيب الموصل بالقوة لتفادي تكسير قواعد اللحام على البوردة!'],
  },
  {
    id: 'COMPAT-007',
    sourcePartSku: 'DISP-OLED-S24U-ORIG',
    targetModel: 'Galaxy S23 Ultra',
    targetBoardCode: 'SM-S918B-REV-0.4',
    partCategory: 'SCREEN',
    status: 'INCOMPATIBLE',
    confidencePercent: 100,
    physicalFit: false,
    electricalCompatible: false,
    connectorCompatible: false,
    firmwareDependency: true,
    evidenceNotesAr: 'غير متوافق: شاشة S24 Ultra مسطحة تماماً (Flat Display) بينما S23 Ultra منحنية (Curved Edge)، والكونكتر مختلف تماماً.',
    evidenceNotesEn: 'Incompatible: S24 Ultra is a flat display while S23 Ultra is curved edge with completely different FPC pinout.',
  },
];

/**
 * Checks parts compatibility for a target phone model & board code.
 */
export function checkPartsCompatibility(
  partSku: string,
  targetBoardCode: string,
  targetModel: string
): V158CompatibilityItem {
  const match = COMPATIBILITY_DATABASE.find(
    (c) =>
      c.sourcePartSku.toLowerCase() === partSku.toLowerCase() &&
      (c.targetBoardCode.toLowerCase() === targetBoardCode.toLowerCase() ||
        c.targetModel.toLowerCase().includes(targetModel.toLowerCase()))
  );

  if (match) return match;

  return {
    id: `COMPAT-AUTO-${Date.now()}`,
    sourcePartSku: partSku,
    targetModel,
    targetBoardCode,
    partCategory: 'IC',
    status: 'NOT_VERIFIED',
    confidencePercent: 0,
    physicalFit: false,
    electricalCompatible: false,
    connectorCompatible: false,
    firmwareDependency: false,
    evidenceNotesAr: 'لا توجد أدلة هندسية أو تجارب معملية مسجلة للتحقق من توافق هذه القطعة مع هذا الطراز.',
    evidenceNotesEn: 'No empirical verification or schematic evidence on file for this combination.',
    warningsAr: ['تنبيه: يجب فحص المخطط الهندسي وأبعاد اللحام يدوياً قبل التركيب.'],
  };
}
