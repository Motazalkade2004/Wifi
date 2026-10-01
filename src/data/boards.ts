import { BoardData } from '../types';

export const BOARDS_CATALOG: BoardData[] = [
  {
    id: 'sm-s928b',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    regionalVersion: 'Global (SM-S928B / DS)',
    boardCode: 'SM-S928B-REV-01',
    boardRevision: '0.1',
    dimensions: {
      widthMm: 98.0,
      heightMm: 46.0,
    },
    thicknessMm: 1.0,
    layers: 10,
    availableSides: ['TOP', 'BOTTOM'],
    lastUpdated: '2026-09-30',
    sourceDocument: 'Samsung Service Schematic & Boardview Level 3 — Official Verified',
    fiducials: [
      { id: 'FID-S24-1', name: 'ثقب التثبيت الشمالي (Screw Hole A)', type: 'SCREW_HOLE', xMm: 5.0, yMm: 5.0, radiusMm: 1.5, side: 'TOP' },
      { id: 'FID-S24-2', name: 'موصل البطارية الرئيسي J1200', type: 'CONNECTOR', xMm: 16.5, yMm: 18.0, radiusMm: 2.5, side: 'BOTTOM' },
      { id: 'FID-S24-3', name: 'موصل الفلكس السفلي J1001', type: 'CONNECTOR', xMm: 8.0, yMm: 34.0, radiusMm: 3.0, side: 'BOTTOM' },
      { id: 'FID-S24-4', name: 'شيلد المعالج والذاكرة (AP Shield Can)', type: 'SHIELD_CORNER', xMm: 52.0, yMm: 22.0, radiusMm: 4.0, side: 'TOP' },
      { id: 'FID-S24-5', name: 'موصل الشاشة الرئيسي J3001', type: 'CONNECTOR', xMm: 78.0, yMm: 14.0, radiusMm: 2.8, side: 'TOP' }
    ],
    regions: [
      {
        id: 'charging',
        nameAr: 'دائرة الشحن ومنظم OVP',
        nameEn: 'Charging & OVP Circuit',
        color: '#f59e0b', // Amber
        bounds: { xMm: 4.0, yMm: 24.0, widthMm: 28.0, heightMm: 19.0 },
        side: 'BOTTOM'
      },
      {
        id: 'power',
        nameAr: 'إدارة الطاقة الرئيسية (Main PMIC)',
        nameEn: 'Main Power Management (PMIC)',
        color: '#8b5cf6', // Violet
        bounds: { xMm: 32.0, yMm: 12.0, widthMm: 26.0, heightMm: 28.0 },
        side: 'BOTTOM'
      },
      {
        id: 'display',
        nameAr: 'تغذية الشاشة والإضاءة',
        nameEn: 'Display & OLED Bias Power',
        color: '#06b6d4', // Cyan
        bounds: { xMm: 70.0, yMm: 8.0, widthMm: 24.0, heightMm: 20.0 },
        side: 'TOP'
      },
      {
        id: 'ap',
        nameAr: 'المعالج المركزي والذاكرة (AP/UFS)',
        nameEn: 'Application Processor & UFS',
        color: '#ef4444', // Red
        bounds: { xMm: 40.0, yMm: 8.0, widthMm: 28.0, heightMm: 30.0 },
        side: 'TOP'
      },
      {
        id: 'audio',
        nameAr: 'مكبر ومحرك الصوت (Audio Amp)',
        nameEn: 'Audio Codec & Smart PA',
        color: '#10b981', // Emerald
        bounds: { xMm: 62.0, yMm: 28.0, widthMm: 22.0, heightMm: 16.0 },
        side: 'BOTTOM'
      },
      {
        id: 'rf',
        nameAr: 'الشبكة والمودم (RF Transceiver)',
        nameEn: 'RF Front-End & Transceiver',
        color: '#ec4899', // Pink
        bounds: { xMm: 72.0, yMm: 26.0, widthMm: 24.0, heightMm: 18.0 },
        side: 'TOP'
      }
    ],
    components: [
      // Charging Region (BOTTOM)
      {
        ref: 'C2150',
        nameAr: 'مكثف تنعيم خط VBUS الرئيسي 5V',
        type: 'CAPACITOR',
        package: '0402 (1005 Metric)',
        value: '10µF 25V X5R',
        side: 'BOTTOM',
        xMm: 14.8,
        yMm: 31.2,
        widthMm: 1.0,
        heightMm: 0.6,
        net: 'VBUS_5V_IN',
        regionId: 'charging',
        description: 'مكثف رئيسي على دخل الشاحن القادم من فلكس الشحن السفلي، حرج جداً في فحص أعطال الشحن وعدم الإحساس بالشاحن.',
        polarity: '+'
      },
      {
        ref: 'C2151',
        nameAr: 'مكثف ترشيح ثانوي لخط VBUS',
        type: 'CAPACITOR',
        package: '0201 (0603 Metric)',
        value: '1µF 16V',
        side: 'BOTTOM',
        xMm: 17.2,
        yMm: 31.2,
        widthMm: 0.7,
        heightMm: 0.4,
        net: 'VBUS_5V_IN',
        regionId: 'charging'
      },
      {
        ref: 'U2050',
        nameAr: 'آيسي حماية الجهد العالي (OVP Load Switch)',
        type: 'IC',
        package: 'WLCSP-12',
        value: 'FPF2895 / OVP Switch',
        side: 'BOTTOM',
        xMm: 18.5,
        yMm: 28.0,
        widthMm: 2.2,
        heightMm: 1.8,
        pinCount: 12,
        pin1Position: 'TOP_LEFT',
        net: 'VBUS_OVP_OUT',
        regionId: 'charging',
        description: 'يفصل الشاحن فوراً إذا تجاوز الجهد 5.8V أو عند حدوث ارتفاع مفاجئ في التيار.'
      },
      {
        ref: 'D2001',
        nameAr: 'دايود حماية كبت الجهد العابر (TVS Diode)',
        type: 'DIODE',
        package: 'SOD-923',
        value: 'ESD5V3U1U',
        side: 'BOTTOM',
        xMm: 12.4,
        yMm: 33.5,
        widthMm: 1.0,
        heightMm: 0.5,
        net: 'VBUS_5V_IN',
        regionId: 'charging',
        description: 'يحمي اللوحة من الصدمات الكهربائية الساكنة؛ عرضه للشورت عند استخدام شواحن مقلدة.'
      },
      {
        ref: 'J1001',
        nameAr: 'كونكتر الفلكس الموصل للبوردة السفلية',
        type: 'CONNECTOR',
        package: 'FPC 40-Pin Header',
        value: '40 Pins Pitch 0.35mm',
        side: 'BOTTOM',
        xMm: 8.0,
        yMm: 34.0,
        widthMm: 8.5,
        heightMm: 2.2,
        pinCount: 40,
        net: 'VBUS / USB_DP / USB_DM',
        regionId: 'charging'
      },
      {
        ref: 'L2005',
        nameAr: 'ملف الشحن السريع Buck-Boost Coil',
        type: 'INDUCTOR',
        package: 'SMD Power Inductor 2520',
        value: '1.0µH 5.2A',
        side: 'BOTTOM',
        xMm: 22.4,
        yMm: 33.2,
        widthMm: 2.5,
        heightMm: 2.0,
        net: 'V_SYS_CHG',
        regionId: 'charging',
        description: 'ملف القدرة المسؤول عن تحويل جهد الشاحن لتغذية المنظومة وشحن البطارية.'
      },
      // Main Power (BOTTOM)
      {
        ref: 'U2000',
        nameAr: 'آيسي الطاقة الرئيسي (Main PMIC)',
        type: 'IC',
        package: 'BGA-182',
        value: 'S2MPS24 / Samsung PMIC',
        side: 'BOTTOM',
        xMm: 42.0,
        yMm: 24.0,
        widthMm: 6.8,
        heightMm: 6.5,
        pinCount: 182,
        pin1Position: 'TOP_LEFT',
        net: 'VBAT_MAIN / VDD_BUCK',
        regionId: 'power',
        description: 'قلب الطاقة في الجهاز؛ يولد جهود التشغيل للمعالج والرامات والمودم والشاشة.'
      },
      {
        ref: 'L2001',
        nameAr: 'ملف خرج تغذية المعالج الرئيسي VDD_CORE_0V8',
        type: 'INDUCTOR',
        package: 'Power Inductor 2016',
        value: '0.47µH 6.5A',
        side: 'BOTTOM',
        xMm: 37.0,
        yMm: 18.5,
        widthMm: 2.0,
        heightMm: 1.6,
        net: 'VDD_CORE_0V8',
        regionId: 'power',
        description: 'جهد نواة المعالج 0.82V؛ قصر هذا الخط يتسبب في سحب عالي وموت الجهاز تماماً.'
      },
      {
        ref: 'L2002',
        nameAr: 'ملف جهد الرامات VDD_LPDDR5X_1V1',
        type: 'INDUCTOR',
        package: 'Power Inductor 2016',
        value: '0.68µH 4.5A',
        side: 'BOTTOM',
        xMm: 37.0,
        yMm: 22.0,
        widthMm: 2.0,
        heightMm: 1.6,
        net: 'VDD_RAM_1V1',
        regionId: 'power'
      },
      {
        ref: 'L2003',
        nameAr: 'ملف جهد النظام الرئيسي VDD_MODEM_0V75',
        type: 'INDUCTOR',
        package: 'Power Inductor 2016',
        value: '0.47µH 5.0A',
        side: 'BOTTOM',
        xMm: 37.0,
        yMm: 25.5,
        widthMm: 2.0,
        heightMm: 1.6,
        net: 'VDD_MODEM_0V75',
        regionId: 'power'
      },
      {
        ref: 'J1200',
        nameAr: 'موصل البطارية الرئيسي (Battery FPC)',
        type: 'CONNECTOR',
        package: 'Header FPC 8-Pin High Current',
        value: 'VBAT 10A Peak',
        side: 'BOTTOM',
        xMm: 16.5,
        yMm: 18.0,
        widthMm: 5.5,
        heightMm: 2.5,
        pinCount: 8,
        net: 'VBAT_4V2 / BATT_ID / BATT_NTC',
        regionId: 'power'
      },
      {
        ref: 'TP201',
        nameAr: 'نقطة اختبار خط زر التشغيل (PWRON_KEY)',
        type: 'TESTPOINT',
        package: 'Round Copper Pad 0.8mm',
        value: '1.8V Pull-up',
        side: 'BOTTOM',
        xMm: 28.5,
        yMm: 16.0,
        widthMm: 0.8,
        heightMm: 0.8,
        net: 'PMIC_PWRON_N',
        regionId: 'power',
        description: 'نقطة تشغيل اللوحة خارج الشاسيه عبر لمسها بالأرضي لبدء إقلاع الباور.'
      },
      // Display Region (TOP)
      {
        ref: 'J3001',
        nameAr: 'كونكتر الشاشة الديناميكية AMOLED FPC',
        type: 'CONNECTOR',
        package: 'Fine Pitch FPC 60-Pin',
        value: 'MIPI DSI 4-Lane / AVDD / ELVDD',
        side: 'TOP',
        xMm: 78.0,
        yMm: 14.0,
        widthMm: 12.0,
        heightMm: 2.8,
        pinCount: 60,
        net: 'MIPI_DSI / VDD_OLED',
        regionId: 'display'
      },
      {
        ref: 'C3010',
        nameAr: 'مكثف تغذية شاشة العرض الرقمي 1.8V VDD_IO',
        type: 'CAPACITOR',
        package: '0402',
        value: '4.7µF 6.3V',
        side: 'TOP',
        xMm: 73.0,
        yMm: 11.5,
        widthMm: 1.0,
        heightMm: 0.5,
        net: 'VDD_IO_1V8_DISP',
        regionId: 'display'
      },
      {
        ref: 'U3000',
        nameAr: 'آيسي مولد جهود شاشات الأوليد (OLED PMIC Boost)',
        type: 'IC',
        package: 'BGA-24',
        value: 'TI TPS65633',
        side: 'TOP',
        xMm: 76.0,
        yMm: 20.0,
        widthMm: 2.8,
        heightMm: 2.4,
        pinCount: 24,
        net: 'AVDD_7V / ELVDD_4V6 / ELVSS_-4V',
        regionId: 'display'
      },
      // Processor Region (TOP)
      {
        ref: 'U1000',
        nameAr: 'المعالج المركزي Snapdragon 8 Gen 3 for Galaxy',
        type: 'IC',
        package: 'PoP (Package on Package) BGA-1150',
        value: 'SM8650-AC + 12GB LPDDR5X',
        side: 'TOP',
        xMm: 52.0,
        yMm: 22.0,
        widthMm: 14.5,
        heightMm: 14.0,
        pinCount: 1150,
        pin1Position: 'TOP_LEFT',
        net: 'CPU_CORE / GPU_CORE / AP_RESET',
        regionId: 'ap'
      },
      {
        ref: 'U1001',
        nameAr: 'ذاكرة التخزين السريع UFS 4.0 Storage',
        type: 'IC',
        package: 'BGA-153',
        value: '512GB UFS 4.0',
        side: 'TOP',
        xMm: 41.0,
        yMm: 22.0,
        widthMm: 9.0,
        heightMm: 11.5,
        pinCount: 153,
        net: 'VDDI_UFS_1V2 / VCC_UFS_2V5',
        regionId: 'ap'
      },
      // Audio Region (BOTTOM)
      {
        ref: 'U6000',
        nameAr: 'آيسي ومضخم الصوت الذكي Smart Audio PA',
        type: 'IC',
        package: 'QFN-32',
        value: 'Cirrus Logic CS35L45',
        side: 'BOTTOM',
        xMm: 70.0,
        yMm: 34.0,
        widthMm: 3.2,
        heightMm: 3.2,
        pinCount: 32,
        net: 'SPK_OUT_P / SPK_OUT_M',
        regionId: 'audio'
      },
      {
        ref: 'L6001',
        nameAr: 'ملف ترشيح مخرج السماعة السفلية',
        type: 'INDUCTOR',
        package: '0805',
        value: '10µH Ferrite',
        side: 'BOTTOM',
        xMm: 65.5,
        yMm: 35.0,
        widthMm: 2.0,
        heightMm: 1.2,
        net: 'SPK_FILTER_LINE',
        regionId: 'audio'
      }
    ],
    measurementPoints: [
      {
        id: 'MP-S24U-CHG-01',
        nameAr: 'جهد دخل الشحن الرئيسي VBUS على C2150',
        componentRef: 'C2150',
        regionId: 'charging',
        side: 'BOTTOM',
        measurementType: 'DC_VOLTAGE',
        unit: 'V',
        redProbe: 'الطرف الموجب لمكثف C2150 (المواجه لجهة آيسي OVP)',
        blackProbe: 'أرضي اللوحة (GND شاسيه موصل الشحن أو شيلد الحماية)',
        conditions: {
          batteryConnected: false,
          chargerConnected: true,
          powerState: 'Standby / إدخال كابل شاحن أصلي 5V/9V',
          deviceState: 'اللوحة موصولة بالفلكس السفلي فقط والشاحن متصل'
        },
        expectedMin: 4.95,
        expectedMax: 5.25,
        nominalValue: 5.1,
        failureMeaningAr: 'انقطاع جهد 5V أو انخفاضه لأقل من 4.5V يدل على: تلف كابل الشاحن، أو تلف سوكت Type-C بالسفلي، أو قطع في خط الفلكس الرابط J1001، أو شورت مباشر على دايود الحماية D2001.',
        nextStepPassAr: 'الجهد سليم (5V)؛ انتقل لقياس جهد خرج آيسي الحماية OVP U2050 للتأكد من تمرير التيار.',
        nextStepFailAr: 'افصل الشاحن فوراً، ثم قِس ممانعة (Diode Mode) على C2150 لتحديد هل يوجد قصر (Short) على الأرضي.',
        safetyWarningAr: 'تنبيه سلامة إلزامي: احرص على عدم ملامسة الطرف الأحمر لأرضي الشيلد بجوار المكثف أثناء وجود 5V لتفادي شرارة كهربائية!',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      },
      {
        id: 'MP-S24U-CHG-02',
        nameAr: 'ممانعة خط VBUS_IN بالدايود (Diode Mode)',
        componentRef: 'C2150',
        regionId: 'charging',
        side: 'BOTTOM',
        measurementType: 'DIODE_MODE',
        unit: 'mV',
        redProbe: 'أرضي اللوحة GND (عكس الأطراف: مجس أحمر على الأرضي)',
        blackProbe: 'الطرف الموجب لمكثف C2150 (المجس الأسود على الخط المفحوص)',
        conditions: {
          batteryConnected: false,
          chargerConnected: false,
          powerState: 'OFF تماماً / منزوع الطاقة بالكامل',
          deviceState: 'جهاز بارد بدون أي مصدر تيار خارجي'
        },
        expectedMin: 460,
        expectedMax: 540,
        nominalValue: 505,
        failureMeaningAr: 'قراءة 000-015 mV تعني شورت صريح في المكثف أو الدايود D2001 أو آيسي OVP. قراءة OL (Open Line) تعني قطع مسار الفلكس من السوكت السفلي.',
        nextStepPassAr: 'الممانعة سليمة (505mV)؛ مسار الشحن سليم وخالٍ من القصر.',
        nextStepFailAr: 'إذا كانت القراءة 0.00V، قم برفع الدايود D2001 وافحص مجدداً لإزالة سبب القصر.',
        safetyWarningAr: 'تنبيه: يجب فصل الشاحن والبطارية تماماً! قياس الدايود بوجود جهد يتلف الآفوميتر ويعطي قراءات خاطئة.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      },
      {
        id: 'MP-S24U-PWR-01',
        nameAr: 'ممانعة خط البطارية الرئيسي VBAT_MAIN',
        componentRef: 'J1200',
        regionId: 'power',
        side: 'BOTTOM',
        measurementType: 'DIODE_MODE',
        unit: 'mV',
        redProbe: 'أرضي اللوحة GND',
        blackProbe: 'رجل الموجب (Pin 1 & 2) لكونكتر البطارية J1200',
        conditions: {
          batteryConnected: false,
          chargerConnected: false,
          powerState: 'OFF تماماً',
          deviceState: 'اللوحة مفصولة عن الباور سبلاي والبطارية'
        },
        expectedMin: 380,
        expectedMax: 460,
        nominalValue: 420,
        failureMeaningAr: 'قراءة صفرية (Beep / 000mV) تدل على شورت أولي في خط البطارية الرئيسي يمنع تشغيل الجهاز ويسحب تياراً كاملاً من الباور سبلاي.',
        nextStepPassAr: 'الخط سليم من القصر الأولي؛ انتقل لفحص مفتاح التشغيل PWRON على النقطة TP201.',
        nextStepFailAr: 'شورت على خط VBAT؛ افحص مكثفات التوازي المحيطة بآيسي الباور U2000 باستخدام الكاميرا الحرارية أو التبريد بالروزين.',
        safetyWarningAr: 'لا تقم بتركيب بطارية مشحونة في حال كان الخط في وضع شورت لتفادي انتفاخ البطارية أو اشتعالها.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      },
      {
        id: 'MP-S24U-PWR-02',
        nameAr: 'جهد مفتاح الباور PMIC_PWRON على TP201',
        componentRef: 'TP201',
        regionId: 'power',
        side: 'BOTTOM',
        measurementType: 'DC_VOLTAGE',
        unit: 'V',
        redProbe: 'نقطة النحاس TP201',
        blackProbe: 'أرضي اللوحة GND',
        conditions: {
          batteryConnected: true,
          chargerConnected: false,
          powerState: 'Battery Connected / Standby',
          deviceState: 'البطارية موصولة أو الباور سبلاي مضبوط على 4.0V'
        },
        expectedMin: 1.75,
        expectedMax: 1.85,
        nominalValue: 1.8,
        failureMeaningAr: 'غياب جهد 1.8V عن زر الباور يعني تلف آيسي الباور U2000 في توليد جهد الاستعداد VREG_L6_1P8 أو تلف مسار زر التشغيل.',
        nextStepPassAr: 'الجهد 1.8V موجود؛ اللوحة مستعدة للإقلاع عند الضغط على زر التشغيل (هبوط الجهد إلى 0V).',
        nextStepFailAr: 'افحص خرج منظم الاستعداد LDO داخل آيسي الباور الرئيسي.',
        safetyWarningAr: 'احذر انزلاق المجس من نقطة TP201 إلى خطوط مجاورة أثناء تشغيل الباور سبلاي.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      },
      {
        id: 'MP-S24U-PWR-03',
        nameAr: 'جهد معالج التطبيقات VDD_CORE على L2001',
        componentRef: 'L2001',
        regionId: 'power',
        side: 'BOTTOM',
        measurementType: 'DC_VOLTAGE',
        unit: 'V',
        redProbe: 'طرف خرج الملف L2001',
        blackProbe: 'أرضي اللوحة GND',
        conditions: {
          batteryConnected: true,
          chargerConnected: false,
          powerState: 'Active Booting / الجهاز في حالة الإقلاع',
          deviceState: 'تم الضغط على زر الباور وبدء سحب التيار (300mA - 800mA)'
        },
        expectedMin: 0.78,
        expectedMax: 0.86,
        nominalValue: 0.82,
        failureMeaningAr: 'إذا كان الجهد 0V رغم سحب تيار منخفض، فهذا يدل على عطل بدائرة Buck Converter أو تلف آيسي الباور أو عدم تلقي إشارة تمكين EN من المعالج.',
        nextStepPassAr: 'جهد المعالج سليم؛ الجهاز يعمل في مرحلة الإقلاع بنجاح.',
        nextStepFailAr: 'قِس مقاومة الملف بالنسبة للأرضي للتأكد هل المعالج به شورت داخلي.',
        safetyWarningAr: 'جهد حساس ودقيق؛ استخدم مجسات مدببة دقيقة (0.5mm Needle Probes).',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      },
      {
        id: 'MP-S24U-DSP-01',
        nameAr: 'جهد تغذية شاشة الأوليد الرقمية VDD_IO 1.8V',
        componentRef: 'C3010',
        regionId: 'display',
        side: 'TOP',
        measurementType: 'DC_VOLTAGE',
        unit: 'V',
        redProbe: 'الطرف الموجب لمكثف C3010',
        blackProbe: 'أرضي اللوحة GND',
        conditions: {
          batteryConnected: true,
          chargerConnected: false,
          powerState: 'Device Screen ON',
          deviceState: 'الجهاز قيد التشغيل مع محاولة إضاءة الشاشة'
        },
        expectedMin: 1.76,
        expectedMax: 1.84,
        nominalValue: 1.8,
        failureMeaningAr: 'غياب 1.8V يؤدي إلى شاشة سوداء تماماً مع استجابة الاهتزاز والصوت.',
        nextStepPassAr: 'جهد الشاشة الرقمي سليم؛ انتقل لفحص جهود التغذية المزدوجة +AVDD و -ELVSS على U3000.',
        nextStepFailAr: 'افحص خرج منظم شاشة الأوليد بآيسي الباور الثانوي.',
        safetyWarningAr: 'احذر لمس خطوط الداتا عالية السرعة MIPI أثناء القياس.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      }
    ]
  },
  {
    id: 'apple-iphone-15-pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    regionalVersion: 'A3102 / A2848 (Global & US)',
    boardCode: 'IPHONE-15P-MLB-REV-1.0',
    boardRevision: '1.0',
    dimensions: {
      widthMm: 92.0,
      heightMm: 38.0,
    },
    thicknessMm: 1.2,
    layers: 12,
    availableSides: ['TOP', 'BOTTOM'],
    lastUpdated: '2026-09-30',
    sourceDocument: 'Apple Service Guide Boardview & ZXW Schematic Reference — Tier 1 Verified',
    fiducials: [
      { id: 'FID-IP15-1', name: 'موصل البطارية J1000', type: 'CONNECTOR', xMm: 12.0, yMm: 16.0, radiusMm: 2.2, side: 'BOTTOM' },
      { id: 'FID-IP15-2', name: 'موصل الفلكس السفلي Type-C J2000', type: 'CONNECTOR', xMm: 6.0, yMm: 28.0, radiusMm: 2.5, side: 'BOTTOM' },
      { id: 'FID-IP15-3', name: 'شيلد معالج A17 Pro Can', type: 'SHIELD_CORNER', xMm: 48.0, yMm: 18.0, radiusMm: 4.0, side: 'TOP' }
    ],
    regions: [
      {
        id: 'charging',
        nameAr: 'منظومة الشحن و USB-C Type-C',
        nameEn: 'USB-C Charging & Tigris/Hydra',
        color: '#f59e0b',
        bounds: { xMm: 4.0, yMm: 20.0, widthMm: 24.0, heightMm: 16.0 },
        side: 'BOTTOM'
      },
      {
        id: 'power',
        nameAr: 'إدارة الطاقة الرئيسية (PMIC A17)',
        nameEn: 'Main PMIC & VDD_MAIN',
        color: '#8b5cf6',
        bounds: { xMm: 28.0, yMm: 10.0, widthMm: 26.0, heightMm: 24.0 },
        side: 'BOTTOM'
      },
      {
        id: 'ap',
        nameAr: 'معالج A17 Pro والذاكرة NVMe',
        nameEn: 'A17 Pro & NVMe Storage',
        color: '#ef4444',
        bounds: { xMm: 38.0, yMm: 6.0, widthMm: 32.0, heightMm: 26.0 },
        side: 'TOP'
      }
    ],
    components: [
      {
        ref: 'C3100',
        nameAr: 'مكثف خط الشحن الرئيسي PP_VBUS_USBC',
        type: 'CAPACITOR',
        package: '0402',
        value: '10µF 25V',
        side: 'BOTTOM',
        xMm: 14.2,
        yMm: 26.5,
        widthMm: 1.0,
        heightMm: 0.5,
        net: 'PP_VBUS_USBC',
        regionId: 'charging'
      },
      {
        ref: 'U3000',
        nameAr: 'آيسي الشحن وإدارة USB-C (Hydra IC)',
        type: 'IC',
        package: 'BGA-48',
        value: 'Apple Custom Hydra Controller',
        side: 'BOTTOM',
        xMm: 18.0,
        yMm: 24.0,
        widthMm: 3.5,
        heightMm: 3.0,
        pinCount: 48,
        net: 'PP_VBUS / CC1 / CC2',
        regionId: 'charging'
      },
      {
        ref: 'C2001',
        nameAr: 'مكثف رئيسي على خط تغذية النظام PP_VDD_MAIN',
        type: 'CAPACITOR',
        package: '0603',
        value: '47µF 10V',
        side: 'BOTTOM',
        xMm: 34.0,
        yMm: 16.0,
        widthMm: 1.6,
        heightMm: 0.8,
        net: 'PP_VDD_MAIN',
        regionId: 'power'
      },
      {
        ref: 'U2000',
        nameAr: 'آيسي الباور الرئيسي PMIC (Dialog/Apple)',
        type: 'IC',
        package: 'BGA-220',
        value: 'Apple 338S00918 PMIC',
        side: 'BOTTOM',
        xMm: 40.0,
        yMm: 18.0,
        widthMm: 6.5,
        heightMm: 6.5,
        pinCount: 220,
        net: 'PP_VDD_MAIN / PP_VDD_CPU',
        regionId: 'power'
      }
    ],
    measurementPoints: [
      {
        id: 'MP-IP15-CHG-01',
        nameAr: 'جهد دخل الشاحن PP_VBUS_USBC على C3100',
        componentRef: 'C3100',
        regionId: 'charging',
        side: 'BOTTOM',
        measurementType: 'DC_VOLTAGE',
        unit: 'V',
        redProbe: 'موجب المكثف C3100',
        blackProbe: 'أرضي الشيلد GND',
        conditions: {
          batteryConnected: false,
          chargerConnected: true,
          powerState: 'Charger Plugged (USB-PD 5V/9V)',
          deviceState: 'كابل تايب سي متصل'
        },
        expectedMin: 4.85,
        expectedMax: 5.25,
        nominalValue: 5.0,
        failureMeaningAr: 'غياب الجهد يدل على قطع فلكس الموصل السفلي أو تلف كابل الشاحن أو تفحم مسار VBUS.',
        nextStepPassAr: 'الجهد 5V موجود؛ افحص خط كشف الشاحن CC1/CC2 المتصل بآيسي Hydra.',
        nextStepFailAr: 'افحص الفلكس السفلي وسوكت Type-C بدقة تحت الميكروسكوب.',
        safetyWarningAr: 'تنبيه: آيفون 15 برو يدعم الشحن السريع حتى 27W؛ تأكد من قياس نقطة الدخل بدقة.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      },
      {
        id: 'MP-IP15-PWR-01',
        nameAr: 'ممانعة خط النظام العام PP_VDD_MAIN على C2001',
        componentRef: 'C2001',
        regionId: 'power',
        side: 'BOTTOM',
        measurementType: 'DIODE_MODE',
        unit: 'mV',
        redProbe: 'أرضي اللوحة GND',
        blackProbe: 'الطرف الموجب لمكثف C2001',
        conditions: {
          batteryConnected: false,
          chargerConnected: false,
          powerState: 'OFF تماماً',
          deviceState: 'جهاز مفصول عن أي مصدر طاقة'
        },
        expectedMin: 320,
        expectedMax: 440,
        nominalValue: 385,
        failureMeaningAr: 'قراءة 0.00V تعني قصر كامل في خط VDD_MAIN، وهو أشهر عطل موت مفاجئ في أجهزة الآيفون.',
        nextStepPassAr: 'الممانعة طبيعية (385mV)؛ لا يوجد قصر على خط التغذية الرئيسي.',
        nextStepFailAr: 'حدد المكثف المحروق على خط VDD_MAIN بحقن جهد 1.2V-2.0V بالباور سبلاي واستخدام الكاميرا الحرارية.',
        safetyWarningAr: 'لا تحقن أكثر من 3.5V على خط VDD_MAIN لتجنب إتلاف دوائر الآيسيهات المتصلة به مباشرة!',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      }
    ]
  },
  {
    id: 'xiaomi-13-pro',
    brand: 'Xiaomi',
    model: 'Xiaomi 13 Pro',
    regionalVersion: 'Global (2210132G)',
    boardCode: 'NUWA-MB-REV-0.2',
    boardRevision: '0.2',
    dimensions: {
      widthMm: 94.0,
      heightMm: 42.0,
    },
    thicknessMm: 1.0,
    layers: 10,
    availableSides: ['TOP', 'BOTTOM'],
    lastUpdated: '2026-09-30',
    sourceDocument: 'Xiaomi Engineering Schematics Nuwa — Verified',
    fiducials: [
      { id: 'FID-MI13-1', name: 'موصل البطارية المزدوج J1101', type: 'CONNECTOR', xMm: 15.0, yMm: 16.0, radiusMm: 2.5, side: 'BOTTOM' },
      { id: 'FID-MI13-2', name: 'موصل الفلكس الرئيسي J1002', type: 'CONNECTOR', xMm: 8.0, yMm: 32.0, radiusMm: 3.0, side: 'BOTTOM' },
      { id: 'FID-MI13-3', name: 'شيلد المعالج سنابدراجون 8 الجيل 2', type: 'SHIELD_CORNER', xMm: 50.0, yMm: 20.0, radiusMm: 4.0, side: 'TOP' }
    ],
    regions: [
      {
        id: 'charging',
        nameAr: 'دائرة الشحن الفائق Surge P2 (120W HyperCharge)',
        nameEn: 'Surge P2 Fast Charging Circuit',
        color: '#f59e0b',
        bounds: { xMm: 6.0, yMm: 22.0, widthMm: 26.0, heightMm: 18.0 },
        side: 'BOTTOM'
      },
      {
        id: 'power',
        nameAr: 'إدارة الطاقة Qualcomm PM8550',
        nameEn: 'Qualcomm PM8550 PMIC Cluster',
        color: '#8b5cf6',
        bounds: { xMm: 32.0, yMm: 10.0, widthMm: 28.0, heightMm: 26.0 },
        side: 'BOTTOM'
      },
      {
        id: 'ap',
        nameAr: 'المعالج Snapdragon 8 Gen 2',
        nameEn: 'Snapdragon 8 Gen 2 Core',
        color: '#ef4444',
        bounds: { xMm: 42.0, yMm: 8.0, widthMm: 28.0, heightMm: 28.0 },
        side: 'TOP'
      }
    ],
    components: [
      {
        ref: 'C2201',
        nameAr: 'مكثف دخل شحن الهايبر شارج VBUS_IN',
        type: 'CAPACITOR',
        package: '0402',
        value: '10µF 35V',
        side: 'BOTTOM',
        xMm: 16.0,
        yMm: 30.0,
        widthMm: 1.0,
        heightMm: 0.5,
        net: 'VBUS_CHG_IN',
        regionId: 'charging'
      },
      {
        ref: 'U2200',
        nameAr: 'آيسي شحن شاومي الذاتي Xiaomi Surge P2',
        type: 'IC',
        package: 'BGA-64',
        value: 'Surge P2 Custom IC',
        side: 'BOTTOM',
        xMm: 20.0,
        yMm: 26.0,
        widthMm: 3.8,
        heightMm: 3.5,
        pinCount: 64,
        net: 'V_SURGE_OUT',
        regionId: 'charging'
      }
    ],
    measurementPoints: [
      {
        id: 'MP-MI13-CHG-01',
        nameAr: 'ممانعة خط VBUS على مكثف الدخل C2201',
        componentRef: 'C2201',
        regionId: 'charging',
        side: 'BOTTOM',
        measurementType: 'DIODE_MODE',
        unit: 'mV',
        redProbe: 'أرضي اللوحة GND',
        blackProbe: 'موجب مكثف C2201',
        conditions: {
          batteryConnected: false,
          chargerConnected: false,
          powerState: 'OFF تماماً',
          deviceState: 'جهاز مفصول كلياً'
        },
        expectedMin: 480,
        expectedMax: 560,
        nominalValue: 515,
        failureMeaningAr: 'قراءة غير طبيعية تشير إلى عطل بآيسي Surge P2 أو دايود الحماية من التيارات العالية.',
        nextStepPassAr: 'الممانعة سليمة (515mV)؛ دائرة الدخل خالية من الشورت.',
        nextStepFailAr: 'افحص مكثفات الفلترة المحيطة بشريحة Surge P2.',
        safetyWarningAr: 'شاومي 13 برو يدعم تيارات شحن عالية حتى 120W؛ تأكد من سلامة اللحامات وعدم وجود كربون.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      }
    ]
  },
  {
    id: 'redmi-note-12-4g',
    brand: 'Xiaomi',
    model: 'Redmi Note 12 4G',
    regionalVersion: 'Global (TAPAS / 23021RAAEG)',
    boardCode: 'TAPAS-MB-REV-0.1',
    boardRevision: '0.1',
    dimensions: {
      widthMm: 90.0,
      heightMm: 40.0,
    },
    thicknessMm: 0.9,
    layers: 8,
    availableSides: ['TOP', 'BOTTOM'],
    lastUpdated: '2026-09-30',
    sourceDocument: 'Redmi Schematic & Service Reference Tapas — Workshop Verified',
    fiducials: [
      { id: 'FID-RN12-1', name: 'موصل البطارية J101', type: 'CONNECTOR', xMm: 14.0, yMm: 15.0, radiusMm: 2.2, side: 'BOTTOM' },
      { id: 'FID-RN12-2', name: 'موصل الشاشة J201', type: 'CONNECTOR', xMm: 74.0, yMm: 14.0, radiusMm: 2.8, side: 'TOP' }
    ],
    regions: [
      {
        id: 'charging',
        nameAr: 'دائرة الشحن PM6225 / OVP',
        nameEn: 'PM6225 Charging & OVP',
        color: '#f59e0b',
        bounds: { xMm: 8.0, yMm: 22.0, widthMm: 24.0, heightMm: 16.0 },
        side: 'BOTTOM'
      },
      {
        id: 'power',
        nameAr: 'آيسي الطاقة Qualcomm PM6225',
        nameEn: 'Qualcomm PM6225 PMIC',
        color: '#8b5cf6',
        bounds: { xMm: 34.0, yMm: 12.0, widthMm: 26.0, heightMm: 24.0 },
        side: 'BOTTOM'
      }
    ],
    components: [
      {
        ref: 'C501',
        nameAr: 'مكثف دخل الشحن 5V VBUS',
        type: 'CAPACITOR',
        package: '0402',
        value: '10µF 16V',
        side: 'BOTTOM',
        xMm: 15.0,
        yMm: 28.0,
        widthMm: 1.0,
        heightMm: 0.5,
        net: 'VBUS_USB_5V',
        regionId: 'charging'
      }
    ],
    measurementPoints: [
      {
        id: 'MP-RN12-CHG-01',
        nameAr: 'جهد دخل VBUS على C501',
        componentRef: 'C501',
        regionId: 'charging',
        side: 'BOTTOM',
        measurementType: 'DC_VOLTAGE',
        unit: 'V',
        redProbe: 'طرف موجب C501',
        blackProbe: 'أرضي GND',
        conditions: {
          batteryConnected: false,
          chargerConnected: true,
          powerState: 'Charger In',
          deviceState: 'الشاحن متصل'
        },
        expectedMin: 4.90,
        expectedMax: 5.25,
        nominalValue: 5.05,
        failureMeaningAr: 'غياب الجهد ناتج عن تلف سوكت الشحن السفلي أو انقطاع الفلكس الرابط.',
        nextStepPassAr: 'الجهد 5V سليم؛ تابع القياس على مكثف خرج OVP.',
        nextStepFailAr: 'افحص الفلكس والسوكت السفلي.',
        safetyWarningAr: 'تأكد من عزل شيلدات التبريد أثناء الفحص.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      }
    ]
  },
  {
    id: 'sm-a546b',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    regionalVersion: 'SM-A546B Global',
    boardCode: 'SM-A546B-REV-0.3',
    boardRevision: '0.3',
    dimensions: {
      widthMm: 91.0,
      heightMm: 41.0,
    },
    thicknessMm: 1.0,
    layers: 10,
    availableSides: ['TOP', 'BOTTOM'],
    lastUpdated: '2026-09-30',
    sourceDocument: 'Samsung A54 Service Manual Schematics — Verified',
    fiducials: [
      { id: 'FID-A54-1', name: 'موصل البطارية J1001', type: 'CONNECTOR', xMm: 16.0, yMm: 18.0, radiusMm: 2.4, side: 'BOTTOM' },
      { id: 'FID-A54-2', name: 'شيلد المعالج إكسينوس 1380', type: 'SHIELD_CORNER', xMm: 48.0, yMm: 20.0, radiusMm: 4.0, side: 'TOP' }
    ],
    regions: [
      {
        id: 'charging',
        nameAr: 'دائرة الشحن 25W Super Fast Charging',
        nameEn: '25W Super Fast Charging Circuit',
        color: '#f59e0b',
        bounds: { xMm: 6.0, yMm: 22.0, widthMm: 24.0, heightMm: 16.0 },
        side: 'BOTTOM'
      },
      {
        id: 'power',
        nameAr: 'آيسي الطاقة Exynos S2MPB02',
        nameEn: 'Exynos S2MPB02 Main PMIC',
        color: '#8b5cf6',
        bounds: { xMm: 32.0, yMm: 12.0, widthMm: 26.0, heightMm: 24.0 },
        side: 'BOTTOM'
      }
    ],
    components: [
      {
        ref: 'C4001',
        nameAr: 'مكثف ترشيح VBUS رئيسي',
        type: 'CAPACITOR',
        package: '0402',
        value: '10µF 25V',
        side: 'BOTTOM',
        xMm: 14.5,
        yMm: 29.0,
        widthMm: 1.0,
        heightMm: 0.5,
        net: 'VBUS_5V',
        regionId: 'charging'
      }
    ],
    measurementPoints: [
      {
        id: 'MP-A54-CHG-01',
        nameAr: 'ممانعة خط VBUS على مكثف C4001',
        componentRef: 'C4001',
        regionId: 'charging',
        side: 'BOTTOM',
        measurementType: 'DIODE_MODE',
        unit: 'mV',
        redProbe: 'أرضي اللوحة GND',
        blackProbe: 'طرف موجب C4001',
        conditions: {
          batteryConnected: false,
          chargerConnected: false,
          powerState: 'OFF',
          deviceState: 'جهاز مفصول عن الطاقة'
        },
        expectedMin: 470,
        expectedMax: 550,
        nominalValue: 510,
        failureMeaningAr: 'قراءة غير طبيعية تشير إلى شورت بآيسي الشحن أو دايود الحماية.',
        nextStepPassAr: 'المسار سليم؛ يمكن توصيل الشاحن وقياس الجهد.',
        nextStepFailAr: 'افحص دايود الحماية ZD4001 وافصله للفحص.',
        safetyWarningAr: 'تأكد من تفريغ المكثفات قبل فحص الممانعة.',
        verificationStatus: 'VERIFIED_SCHEMATIC'
      }
    ]
  }
];

export function getBoardById(id: string): BoardData | undefined {
  return BOARDS_CATALOG.find((b) => b.id === id);
}

export function getBoardByCode(code: string): BoardData | undefined {
  return BOARDS_CATALOG.find((b) => b.boardCode.toLowerCase() === code.toLowerCase());
}
