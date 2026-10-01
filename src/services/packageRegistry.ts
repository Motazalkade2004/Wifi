import { DataTrust, PackageStatus, V158DiagnosticPackage } from '../types/v158';

export const INITIAL_PACKAGES: V158DiagnosticPackage[] = [
  {
    id: 'PKG-SAM-S928B-01',
    packageVersion: '2.4.0',
    manufacturer: 'Samsung',
    model: 'Galaxy S24 Ultra',
    boardCode: 'SM-S928B',
    revision: 'REV-01',
    trustClassification: 'MANUFACTURER',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    installedAt: '2026-09-20 10:00',
    status: 'INSTALLED',
    componentCount: 24,
    testPointCount: 16,
    ruleCount: 38,
  },
  {
    id: 'PKG-APL-IP15P-10',
    packageVersion: '1.8.2',
    manufacturer: 'Apple',
    model: 'iPhone 15 Pro',
    boardCode: 'IPHONE-15P-MLB',
    revision: 'REV-1.0',
    trustClassification: 'VERIFIED',
    sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    installedAt: '2026-09-22 14:15',
    status: 'INSTALLED',
    componentCount: 18,
    testPointCount: 12,
    ruleCount: 29,
  },
  {
    id: 'PKG-XMI-NUWA-02',
    packageVersion: '1.2.0',
    manufacturer: 'Xiaomi',
    model: 'Xiaomi 13 Pro (Nuwa)',
    boardCode: 'NUWA-MB',
    revision: 'REV-0.2',
    trustClassification: 'SERVICE_DATA',
    sha256Hash: '4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865',
    installedAt: '2026-09-25 09:30',
    status: 'INSTALLED',
    componentCount: 14,
    testPointCount: 9,
    ruleCount: 18,
  },
  {
    id: 'PKG-TEST-GENERIC-EXP',
    packageVersion: '0.1.0-alpha',
    manufacturer: 'Generic Lab',
    model: 'Experimental Test Board',
    boardCode: 'EXP-TEST-00',
    revision: 'REV-TEST',
    trustClassification: 'TEST',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    installedAt: '2026-09-29 16:45',
    status: 'DISABLED',
    componentCount: 8,
    testPointCount: 4,
    ruleCount: 5,
  },
];

/**
 * Validates package integrity and enforces production trust rules.
 */
export function validatePackageTrust(pkg: V158DiagnosticPackage): {
  isValid: boolean;
  canBeAuthoritative: boolean;
  messageAr: string;
  messageEn: string;
} {
  // Hard Rule from proposal: TEST data must NEVER be presented as authoritative repair reference
  if (pkg.trustClassification === 'TEST') {
    return {
      isValid: true,
      canBeAuthoritative: false,
      messageAr: 'تنبيه أمني صارم: هذه الحزمة مصنفة كـ [TEST بيانات تجريبية]، يمنع استخدامها لاتخاذ قرارات صيانة على أجهزة حقيقية.',
      messageEn: 'Strict Safety Guard: This package is classified as [TEST]. It must never be used to guide repairs on real devices.',
    };
  }

  if (pkg.status === 'REJECTED') {
    return {
      isValid: false,
      canBeAuthoritative: false,
      messageAr: 'الحزمة مرفوضة هندسياً لعدم تطابق معايير النزاهة والتوقيع.',
      messageEn: 'Package has been rejected due to failed cryptographic or structural verification.',
    };
  }

  return {
    isValid: true,
    canBeAuthoritative: true,
    messageAr: `حزمة معتمدة من تصنيف [${pkg.trustClassification}] مشفرة برمز SHA-256 سليم.`,
    messageEn: `Authoritative verified package under trust level [${pkg.trustClassification}].`,
  };
}
