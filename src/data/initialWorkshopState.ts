import { InventoryItem, InvoiceRecord, WorkshopCase } from '../types';

export const INITIAL_WORKSHOP_CASES: WorkshopCase[] = [
  {
    id: 'CASE-2026-001',
    caseNumber: 'NY-8821',
    customerName: 'محمد أحمد القاسمي',
    customerPhone: '777-123456',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy S24 Ultra',
    boardCode: 'SM-S928B-REV-01',
    faultPath: 'CHARGING',
    status: 'IN_PROGRESS',
    complaintAr: 'الجهاز لا يشحن مطلقاً، لا تظهر علامة الشحن ولا يسحب أي تيار على جهاز التيستر الرقمي (0.00A).',
    intakeDate: '2026-09-30 14:30',
    assignedTechnician: 'نادر (فني ورشة قلب اليمن)',
    estimatedCost: 180,
    measurements: [
      {
        id: 'MREC-001',
        timestamp: '2026-09-30 14:45',
        pointId: 'MP-S24U-CHG-01',
        componentRef: 'C2150',
        measurementType: 'DC_VOLTAGE',
        valueRecorded: 0.12,
        unit: 'V',
        evaluation: 'FAIL',
        safetyConfirmed: true,
        technicianNote: 'جهد خط VBUS مقطوع تماماً (0.12V) مع توصيل شاحن 5V سليم.'
      },
      {
        id: 'MREC-002',
        timestamp: '2026-09-30 14:52',
        pointId: 'MP-S24U-CHG-02',
        componentRef: 'C2150',
        measurementType: 'DIODE_MODE',
        valueRecorded: 'SHORT',
        unit: 'mV',
        evaluation: 'SHORT',
        safetyConfirmed: true,
        technicianNote: 'ممانعة الدايود 0.002V (صفارة مستمرة) — شورت مباشر على خط الدخل.'
      }
    ],
    auditLog: [
      {
        id: 'AUD-001',
        timestamp: '2026-09-30 14:30',
        actionType: 'STATUS_CHANGE',
        author: 'SYSTEM',
        descriptionAr: 'تم استقبال الجهاز وتثبيت بيانات العميل ورقم اللوحة SM-S928B-REV-01.'
      },
      {
        id: 'AUD-002',
        timestamp: '2026-09-30 14:40',
        actionType: 'BOARD_VERIFY',
        author: 'TECHNICIAN',
        descriptionAr: 'تمت مطابقة معالم اللوحة السفلية (BOTTOM) بنجاح عبر فحص موصل البطارية وشيلد الشحن.'
      },
      {
        id: 'AUD-003',
        timestamp: '2026-09-30 14:45',
        actionType: 'MEASUREMENT_RECORD',
        author: 'TECHNICIAN',
        descriptionAr: 'تسجيل قياس الجهد VBUS على C2150: القراءة 0.12V (فشل).'
      },
      {
        id: 'AUD-004',
        timestamp: '2026-09-30 14:52',
        actionType: 'MEASUREMENT_RECORD',
        author: 'TECHNICIAN',
        descriptionAr: 'تسجيل ممانعة الدايود على C2150: قصر صريح (SHORT) على خط VBUS_5V.'
      },
      {
        id: 'AUD-005',
        timestamp: '2026-09-30 14:55',
        actionType: 'AI_SUGGESTION',
        author: 'AI_AGENT',
        descriptionAr: 'الوكيل الذكي: اقتراح فحص دايود الحماية D2001 ومكثف الترشيح C2150 قبل رفع آيسي OVP U2050.'
      }
    ]
  },
  {
    id: 'CASE-2026-002',
    caseNumber: 'NY-8822',
    customerName: 'عبدالله يحيى شرف الدين',
    customerPhone: '733-987654',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro',
    boardCode: 'IPHONE-15P-MLB-REV-1.0',
    faultPath: 'POWER',
    status: 'OPEN',
    complaintAr: 'سقوط الجهاز في ماء خفيف ثم انطفأ فجأة، عند وصله بالباور سبلاي يصدر صفارة حماية وشورت فوري.',
    intakeDate: '2026-09-30 16:10',
    assignedTechnician: 'نادر (فني ورشة قلب اليمن)',
    estimatedCost: 350,
    measurements: [],
    auditLog: [
      {
        id: 'AUD-006',
        timestamp: '2026-09-30 16:10',
        actionType: 'STATUS_CHANGE',
        author: 'SYSTEM',
        descriptionAr: 'استقبال هاتف آيفون 15 برو، مسار عطل: باور رئيسي.'
      }
    ]
  },
  {
    id: 'CASE-2026-003',
    caseNumber: 'NY-8820',
    customerName: 'هشام صالح المريسي',
    customerPhone: '711-554433',
    deviceBrand: 'Xiaomi',
    deviceModel: 'Xiaomi 13 Pro',
    boardCode: 'NUWA-MB-REV-0.2',
    faultPath: 'CHARGING',
    status: 'REPAIRED',
    complaintAr: 'شحن بطيء ومتقطع 120W لا يعمل.',
    intakeDate: '2026-09-29 11:20',
    assignedTechnician: 'نادر (فني ورشة قلب اليمن)',
    estimatedCost: 220,
    measurements: [
      {
        id: 'MREC-003',
        timestamp: '2026-09-29 12:15',
        pointId: 'MP-MI13-CHG-01',
        componentRef: 'C2201',
        measurementType: 'DIODE_MODE',
        valueRecorded: 512,
        unit: 'mV',
        evaluation: 'PASS',
        safetyConfirmed: true,
        technicianNote: 'تم استبدال فلكس الشحن السفلي وتنظيف السوكت وعاد الشحن السريع للعمل.'
      }
    ],
    auditLog: [
      {
        id: 'AUD-007',
        timestamp: '2026-09-29 11:20',
        actionType: 'STATUS_CHANGE',
        author: 'SYSTEM',
        descriptionAr: 'استقبال الجهاز وفحص منفذ التايب سي.'
      },
      {
        id: 'AUD-008',
        timestamp: '2026-09-29 13:00',
        actionType: 'STATUS_CHANGE',
        author: 'TECHNICIAN',
        descriptionAr: 'تم إصلاح العطل بنجاح واختبار الشحن 120W لمدة 30 دقيقة مستقرة.'
      }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    sku: 'IC-OVP-FPF2895',
    nameAr: 'آيسي حماية الشحن OVP Switch FPF2895',
    nameEn: 'OVP Load Switch IC FPF2895',
    category: 'IC',
    compatibleModels: ['Samsung Galaxy S24 Ultra', 'Samsung Galaxy S23 Ultra', 'Samsung Galaxy A54'],
    compatibleBoards: ['SM-S928B-REV-01', 'SM-A546B-REV-03'],
    stockQty: 8,
    minAlertQty: 3,
    unitPriceSAR: 45,
    locationBin: 'درج A-04 (قطع شحن سامسونج)'
  },
  {
    sku: 'IC-PMIC-S2MPS24',
    nameAr: 'آيسي الباور الرئيسي سامسونج S2MPS24',
    nameEn: 'Samsung Main PMIC S2MPS24',
    category: 'IC',
    compatibleModels: ['Samsung Galaxy S24 Ultra', 'Galaxy S24+'],
    compatibleBoards: ['SM-S928B-REV-01'],
    stockQty: 4,
    minAlertQty: 2,
    unitPriceSAR: 120,
    locationBin: 'درج A-01 (آيسيهات باور رئيسية)'
  },
  {
    sku: 'CAP-0402-10UF-25V',
    nameAr: 'مكثف سيراميك SMD 10µF 25V 0402 (شريط 50 قطعة)',
    nameEn: 'SMD Ceramic Capacitor 10uF 25V 0402 Reel',
    category: 'PASSIVE',
    compatibleModels: ['Samsung Galaxy S24 Ultra', 'iPhone 15 Pro', 'Xiaomi 13 Pro'],
    compatibleBoards: ['SM-S928B-REV-01', 'IPHONE-15P-MLB-REV-1.0', 'NUWA-MB-REV-0.2'],
    stockQty: 120,
    minAlertQty: 20,
    unitPriceSAR: 5,
    locationBin: 'درج C-12 (مكثفات تصفية VBUS)'
  },
  {
    sku: 'DIODE-TVS-ESD5V3',
    nameAr: 'دايود حماية الجهد العابر TVS SOD-923',
    nameEn: 'TVS Protection Diode ESD5V3 SOD-923',
    category: 'PASSIVE',
    compatibleModels: ['Samsung Galaxy S24 Ultra', 'Samsung Galaxy A54'],
    compatibleBoards: ['SM-S928B-REV-01', 'SM-A546B-REV-03'],
    stockQty: 35,
    minAlertQty: 10,
    unitPriceSAR: 8,
    locationBin: 'درج C-14 (دايودات حماية)'
  },
  {
    sku: 'FPC-CONN-S24U-CHG',
    nameAr: 'كونكتر فلكس الشحن الرئيسي 40-Pin Header S24 Ultra',
    nameEn: '40-Pin Sub FPC Connector Header S24 Ultra',
    category: 'CONNECTOR',
    compatibleModels: ['Samsung Galaxy S24 Ultra'],
    compatibleBoards: ['SM-S928B-REV-01'],
    stockQty: 12,
    minAlertQty: 4,
    unitPriceSAR: 25,
    locationBin: 'درج D-02 (كونكترات فلكس)'
  },
  {
    sku: 'IC-HYDRA-IP15P',
    nameAr: 'آيسي إدارة شحن وUSB آيفون 15 برو (Hydra Custom IC)',
    nameEn: 'Apple iPhone 15 Pro Hydra Charging IC',
    category: 'IC',
    compatibleModels: ['iPhone 15 Pro', 'iPhone 15 Pro Max'],
    compatibleBoards: ['IPHONE-15P-MLB-REV-1.0'],
    stockQty: 5,
    minAlertQty: 2,
    unitPriceSAR: 140,
    locationBin: 'درج B-03 (آيسيهات آبل)'
  },
  {
    sku: 'DISP-OLED-S24U-ORIG',
    nameAr: 'شاشة أصلية كاملة Samsung Galaxy S24 Ultra Dynamic AMOLED 2X',
    nameEn: 'Original Service Pack S24 Ultra Display Assembly',
    category: 'SCREEN',
    compatibleModels: ['Samsung Galaxy S24 Ultra'],
    compatibleBoards: ['SM-S928B-REV-01'],
    stockQty: 2,
    minAlertQty: 1,
    unitPriceSAR: 950,
    locationBin: 'خزانة الشاشات الأصلية S-01'
  }
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2026-001',
    caseId: 'CASE-2026-003',
    invoiceNumber: 'INV-NY-1049',
    date: '2026-09-29 13:15',
    customerName: 'هشام صالح المريسي',
    customerPhone: '711-554433',
    deviceModel: 'Xiaomi 13 Pro',
    boardCode: 'NUWA-MB-REV-0.2',
    parts: [
      {
        sku: 'FPC-CONN-MI13-CHG',
        nameAr: 'فلكس شحن وسوكت تايب سي شاومي 13 برو',
        qty: 1,
        unitPrice: 120
      }
    ],
    laborCost: 100,
    discount: 0,
    taxRate: 0,
    total: 220,
    paymentStatus: 'PAID',
    notesAr: 'تم الفحص الهندسي للوحة ومعايرة خط VBUS والتأكد من دعم الشاحن فائق السرعة 120W.',
    warrantyPeriodDays: 30
  }
];
