import React, { useState, useEffect, useMemo } from 'react';
import {
  AuditLogEntry,
  BoardData,
  BoardSide,
  ComponentItem,
  FaultPath,
  InventoryItem,
  InvoiceRecord,
  QualityGateResult,
  WorkshopCase,
} from './types';
import {
  V158DiagnosisCandidate,
  V158MeasurementRecord,
  V158RepairPlan,
  V158SmartNextTest,
} from './types/v158';
import { BOARDS_CATALOG } from './data/boards';
import { INITIAL_INVENTORY, INITIAL_INVOICES, INITIAL_WORKSHOP_CASES } from './data/initialWorkshopState';
import { ActiveTab, Navbar } from './components/Navbar';
import { MobileFrame } from './components/MobileFrame';
import { MobileBottomTabBar } from './components/MobileBottomTabBar';
import { DashboardView } from './components/DashboardView';
import { DiagnosticHub, DiagnosticSubTab } from './components/DiagnosticHub';
import { SchematicsHub, SchematicsSubTab } from './components/SchematicsHub';
import { CompatibilityHub, CompatibilitySubTab } from './components/CompatibilityHub';
import { WorkshopHub, WorkshopSubTab } from './components/WorkshopHub';
import { DeviceConnectionBar } from './components/v158/DeviceConnectionBar';
import { CaseManagerModal } from './components/CaseManagerModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { AppDialog, AppDialogOptions } from './components/AppDialog';
import { sounds } from './utils/audioFeedback';
import { generateDiagnoses } from './services/evidenceEngine';
import { recommendSmartNextTests } from './services/smartNextTestEngine';

export default function App() {
  const [currentBoard, setCurrentBoard] = useState<BoardData>(BOARDS_CATALOG[0]);
  const [activeSide, setActiveSide] = useState<BoardSide>('BOTTOM');
  const [activeTab, setActiveTab] = useState<ActiveTab>('HOME');

  // Sub-tab state memory for Hub components
  const [diagnosticSubTab, setDiagnosticSubTab] = useState<DiagnosticSubTab>('WORKFLOW_10');
  const [schematicsSubTab, setSchematicsSubTab] = useState<SchematicsSubTab>('BOARDVIEW');
  const [compatibilitySubTab, setCompatibilitySubTab] = useState<CompatibilitySubTab>('CROSS_REF');
  const [workshopSubTab, setWorkshopSubTab] = useState<WorkshopSubTab>('CASES');

  // Mobile Viewport mode (Mobile responsive by default)
  const [isMobileMode, setIsMobileMode] = useState<boolean>(true);

  // Workshop Cases state
  const [cases, setCases] = useState<WorkshopCase[]>(INITIAL_WORKSHOP_CASES);
  const [activeCase, setActiveCase] = useState<WorkshopCase | undefined>(INITIAL_WORKSHOP_CASES[0]);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState<boolean>(false);

  // Inventory and Invoices state
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | undefined>(INITIAL_INVOICES[0]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // AppDialog system
  const [dialogOptions, setDialogOptions] = useState<AppDialogOptions | null>(null);

  // Selected Target Component on Board
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem>(() => {
    return (
      BOARDS_CATALOG[0].components.find((c) => c.ref === 'C2150') ||
      BOARDS_CATALOG[0].components[0]
    );
  });

  // Online / Offline Detection
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Structured Repair Plan state (Proposal Section 10)
  const [repairPlan, setRepairPlan] = useState<V158RepairPlan>({
    id: 'RPLAN-001',
    caseId: 'CASE-2026-001',
    suspectedFault: 'قصر صريح على مكثف دخل الشحن VBUS 5V',
    targetComponentRef: 'C2150',
    steps: [
      {
        stepNumber: 1,
        action: 'ISOLATE',
        targetComponentRef: 'C2150',
        descriptionAr: 'عزل اللوحة تماماً وفصل البطارية ورفع فلكس الشحن السفلي لتجنب أي تغذية راجعة.',
        descriptionEn: 'Isolate mainboard and disconnect battery and sub-board flex.',
        warningAr: 'تأكد من تفريغ الشحنات الساكنة عبر لمس أرضي شيلد الحماية.',
        completed: true,
      },
      {
        stepNumber: 2,
        action: 'REPLACE_COMPONENT',
        targetComponentRef: 'C2150',
        descriptionAr: 'إزالة مكثف التصفية المحروق C2150 وتركيب مكثف بديل معتمد 10µF 25V 0402 بحرارة 240°C.',
        descriptionEn: 'Desolder shorted capacitor C2150 and solder verified replacement 10uF 25V.',
        warningAr: 'لا تفرط في تسخين البوردة لتجنب تحرك آيسي OVP المجاور U2050.',
        completed: false,
      },
      {
        stepNumber: 3,
        action: 'CLEAN',
        targetComponentRef: 'C2150',
        descriptionAr: 'تنظيف منطقة اللحام بكحول إيزوبروبيلي نقي (IPA 99.9%) وإزالة رواسب الفلكس.',
        descriptionEn: 'Clean solder area with pure Isopropyl alcohol and inspect under microscope.',
        completed: false,
      },
      {
        stepNumber: 4,
        action: 'MEASURE',
        targetComponentRef: 'C2150',
        descriptionAr: 'إجراء فحص الممانعة البعدي للتأكد من زوال القصر (المتوقع > 480mV في وضع الدايود).',
        descriptionEn: 'Conduct mandatory post-repair diode measurement (expected > 480mV).',
        requiredTestPointId: 'MP-S24U-CHG-01',
        completed: false,
      },
    ],
    requiredPostTests: ['MP-S24U-CHG-01', 'MP-S24U-PWR-01'],
    beforeMeasurements: [
      {
        id: 'M-BEF-01',
        caseId: 'CASE-2026-001',
        testPointId: 'MP-S24U-CHG-01',
        boardRevisionId: 'SM-S928B-REV-01',
        measurementType: 'DC_VOLTAGE',
        condition: 'CHARGER_CONNECTED',
        measuredValue: 0.12,
        unit: 'V',
        status: 'FAIL_LOW',
        timestamp: '2026-09-30 14:45',
        isBeforeRepair: true,
      },
    ],
    afterMeasurements: [],
    isValidationCompleted: false,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update selected board when active case changes
  const handleSelectCase = (c: WorkshopCase) => {
    setActiveCase(c);
    const matchedBoard = BOARDS_CATALOG.find((b) => b.boardCode === c.boardCode) || BOARDS_CATALOG[0];
    setCurrentBoard(matchedBoard);
    const defaultComp = matchedBoard.components[0];
    setSelectedComponent(defaultComp);
    setActiveSide(defaultComp.side);
  };

  const handleCreateCase = (newCase: WorkshopCase) => {
    setCases((prev) => [newCase, ...prev]);
    setActiveCase(newCase);
    const matchedBoard = BOARDS_CATALOG.find((b) => b.boardCode === newCase.boardCode) || BOARDS_CATALOG[0];
    setCurrentBoard(matchedBoard);
    sounds.playSuccessChime();
  };

  const handleUpdateStock = (sku: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const newQty = Math.max(0, item.stockQty + delta);
          return { ...item, stockQty: newQty };
        }
        return item;
      })
    );
    sounds.playClick();
  };

  const handleRecordMeasurement = (record: {
    pointId: string;
    componentRef: string;
    value: number | 'SHORT' | 'OPEN';
    unit: string;
    evaluation: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN';
    note?: string;
  }) => {
    if (!activeCase) return;

    if (record.evaluation === 'SHORT') {
      sounds.playContinuityBeep(600);
    } else if (record.evaluation === 'PASS') {
      sounds.playSuccessChime();
    } else {
      sounds.playWarningAlert();
    }

    const newRecord = {
      id: `MREC-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      pointId: record.pointId,
      componentRef: record.componentRef,
      measurementType: 'DIODE_MODE' as any,
      valueRecorded: record.value,
      unit: record.unit,
      evaluation: record.evaluation,
      safetyConfirmed: true,
      technicianNote: record.note,
    };

    const newAuditEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      actionType: 'MEASUREMENT_RECORD',
      author: 'TECHNICIAN',
      descriptionAr: `تسجيل قياس ${record.componentRef}: القيمة ${record.value} ${record.unit} (التقييم: ${record.evaluation})`,
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            measurements: [...c.measurements, newRecord],
            auditLog: [...c.auditLog, newAuditEntry],
          };
        }
        return c;
      })
    );

    setActiveCase((prev) =>
      prev
        ? {
            ...prev,
            measurements: [...prev.measurements, newRecord],
            auditLog: [...prev.auditLog, newAuditEntry],
          }
        : undefined
    );
  };

  const handleCaptureApproved = (capturedImg: string, qualityResult: QualityGateResult) => {
    sounds.playCameraShutter();
    setActiveTab('DIAGNOSIS');
    setDiagnosticSubTab('WORKFLOW_10');
    if (activeCase) {
      const audit: AuditLogEntry = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        actionType: 'IMAGE_CAPTURE',
        author: 'TECHNICIAN',
        descriptionAr: `اعتماد صورة ماكرو عالية الدقة للمكوّن ${selectedComponent.ref} (درجة الحدة: ${qualityResult.sharpnessScore}%).`,
      };
      setActiveCase((prev) =>
        prev ? { ...prev, auditLog: [...prev.auditLog, audit] } : undefined
      );
    }
  };

  const handleToggleRepairStep = (stepNumber: number) => {
    setRepairPlan((prev) => ({
      ...prev,
      steps: prev.steps.map((s) =>
        s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s
      ),
    }));
    sounds.playClick();
  };

  const handleRecordPostTest = (testPointId: string, value: number | 'SHORT' | 'OPEN') => {
    const postRecord: V158MeasurementRecord = {
      id: `M-POST-${Date.now()}`,
      caseId: activeCase?.id || 'CASE-01',
      testPointId,
      boardRevisionId: currentBoard.boardCode,
      measurementType: 'DC_VOLTAGE',
      condition: 'CHARGER_CONNECTED',
      measuredValue: value,
      unit: 'V',
      status: 'PASS',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isBeforeRepair: false,
    };

    setRepairPlan((prev) => ({
      ...prev,
      afterMeasurements: [postRecord],
      isValidationCompleted: true,
    }));
    sounds.playSuccessChime();
  };

  const handleCompleteRepair = () => {
    if (!activeCase) return;

    sounds.playSuccessChime();

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            status: 'REPAIRED',
            postRepairTestingDone: true,
          };
        }
        return c;
      })
    );

    setActiveCase((prev) =>
      prev
        ? {
            ...prev,
            status: 'REPAIRED',
            postRepairTestingDone: true,
          }
        : undefined
    );

    setDialogOptions({
      title: 'اكتمل الإصلاح وتوثيق الجهاز بنجاح ✓',
      message: `تم التحقق الهندسي وتغيير حالة هاتف [ ${activeCase.deviceModel} ] إلى "تم الإصلاح".\nيمكنك الآن استخراج الفاتورة المعتمدة وتسليم الجهاز للعميل.`,
      type: 'SUCCESS',
      confirmLabel: 'عرض وطباعة الفاتورة',
      onConfirm: () => {
        setSelectedInvoice(invoices[0]);
        setIsInvoiceModalOpen(true);
      },
    });
  };

  // Compute Evidence & Diagnoses Candidates dynamically
  const diagnosticCandidates = useMemo(() => {
    const measurementsV158: V158MeasurementRecord[] = (activeCase?.measurements || []).map((m) => ({
      id: m.id,
      caseId: activeCase?.id || '',
      testPointId: m.pointId,
      boardRevisionId: currentBoard.boardCode,
      measurementType: m.measurementType as any,
      condition: 'CHARGER_CONNECTED',
      measuredValue: m.valueRecorded === 'NO_REFERENCE' ? 'OPEN' : m.valueRecorded,
      unit: m.unit,
      status: m.evaluation === 'SHORT' || m.evaluation === 'FAIL' ? 'FAIL_LOW' : 'PASS',
      timestamp: m.timestamp,
      isBeforeRepair: true,
    }));

    return generateDiagnoses({
      symptom: activeCase?.complaintAr || 'لا يوجد شحن أو سحب تيار',
      faultPath: activeCase?.faultPath || 'CHARGING',
      boardRevisionId: currentBoard.boardCode,
      measurements: measurementsV158,
    });
  }, [activeCase?.measurements, activeCase?.complaintAr, activeCase?.faultPath, currentBoard.boardCode]);

  // Compute Smart Next Test recommendations
  const smartNextTests = useMemo(() => {
    const measurementsV158: V158MeasurementRecord[] = (activeCase?.measurements || []).map((m) => ({
      id: m.id,
      caseId: activeCase?.id || '',
      testPointId: m.pointId,
      boardRevisionId: currentBoard.boardCode,
      measurementType: m.measurementType as any,
      condition: 'CHARGER_CONNECTED',
      measuredValue: m.valueRecorded === 'NO_REFERENCE' ? 'OPEN' : m.valueRecorded,
      unit: m.unit,
      status: m.evaluation === 'SHORT' || m.evaluation === 'FAIL' ? 'FAIL_LOW' : 'PASS',
      timestamp: m.timestamp,
      isBeforeRepair: true,
    }));

    return recommendSmartNextTests(diagnosticCandidates, measurementsV158, activeCase?.faultPath || 'CHARGING');
  }, [diagnosticCandidates, activeCase?.measurements, activeCase?.faultPath]);

  // Handle global tab navigation with smart sub-tab routing
  const handleNavigateTab = (tab: ActiveTab) => {
    sounds.playClick();
    if (tab === 'EVIDENCE') {
      setActiveTab('DIAGNOSIS');
      setDiagnosticSubTab('EVIDENCE');
    } else if (tab === 'SMART_TEST') {
      setActiveTab('DIAGNOSIS');
      setDiagnosticSubTab('SMART_TEST');
    } else if (tab === 'REPAIR_PLAN') {
      setActiveTab('DIAGNOSIS');
      setDiagnosticSubTab('REPAIR_PLAN');
    } else if (tab === 'REPAIR_FLOW') {
      setActiveTab('DIAGNOSIS');
      setDiagnosticSubTab('FLOW_7');
    } else if (tab === 'MACRO_CAMERA') {
      setActiveTab('BOARDVIEW');
      setSchematicsSubTab('MACRO_CAMERA');
    } else if (tab === 'CATALOG') {
      setActiveTab('BOARDVIEW');
      setSchematicsSubTab('CATALOG');
    } else if (tab === 'INVENTORY') {
      setActiveTab('COMPATIBILITY');
      setCompatibilitySubTab('INVENTORY');
    } else if (tab === 'PACKAGES') {
      setActiveTab('COMPATIBILITY');
      setCompatibilitySubTab('PACKAGES');
    } else if (tab === 'INVOICES') {
      setActiveTab('CASES');
      setWorkshopSubTab('INVOICES');
    } else if (tab === 'AUDIT_LOG') {
      setActiveTab('CASES');
      setWorkshopSubTab('AUDIT');
    } else if (tab === 'SETTINGS') {
      setActiveTab('CASES');
      setWorkshopSubTab('SETTINGS');
    } else {
      setActiveTab(tab);
    }
  };

  const allAuditEntries = activeCase?.auditLog || [];

  return (
    <MobileFrame
      isMobileMode={isMobileMode}
      onToggleMode={() => setIsMobileMode((m) => !m)}
    >
      <div
        dir="rtl"
        className={`flex-1 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 ${
          isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
        }`}
      >
        {/* Top Android Material App Bar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={handleNavigateTab}
          currentBoard={currentBoard}
          onBoardChange={(b) => {
            setCurrentBoard(b);
            setSelectedComponent(b.components[0]);
            setActiveSide(b.components[0].side);
            sounds.playClick();
          }}
          activeCase={activeCase}
          onOpenCaseModal={() => setIsCaseModalOpen(true)}
          isOnline={isOnline}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((d) => !d)}
        />

        {/* Live ADB / Device Connection Bar */}
        <div className="px-3 pt-2.5 w-full">
          <DeviceConnectionBar />
        </div>

        {/* Main Application Workspace Body */}
        <div className="flex-1 px-3 py-3 w-full flex flex-col">
          {/* TAB 1: HOME (الرئيسية) */}
          {activeTab === 'HOME' && (
            <DashboardView
              cases={cases}
              activeCase={activeCase}
              currentBoard={currentBoard}
              onNavigateTab={handleNavigateTab}
              onSelectCase={handleSelectCase}
              onNewCase={() => setIsCaseModalOpen(true)}
            />
          )}

          {/* TAB 2: DIAGNOSIS (التشخيص الموجه والمحاكي) */}
          {(activeTab === 'DIAGNOSIS' ||
            activeTab === 'EVIDENCE' ||
            activeTab === 'SMART_TEST' ||
            activeTab === 'REPAIR_PLAN' ||
            activeTab === 'REPAIR_FLOW') && (
            <DiagnosticHub
              board={currentBoard}
              activeCase={activeCase}
              faultPath={activeCase?.faultPath || 'CHARGING'}
              diagnosticCandidates={diagnosticCandidates}
              smartNextTests={smartNextTests}
              repairPlan={repairPlan}
              selectedComponent={selectedComponent}
              initialSubTab={diagnosticSubTab}
              onOpenMacroCamera={() => {
                setActiveTab('BOARDVIEW');
                setSchematicsSubTab('MACRO_CAMERA');
              }}
              onOpenBoardview={() => {
                setActiveTab('BOARDVIEW');
                setSchematicsSubTab('BOARDVIEW');
              }}
              onOpenInventory={() => {
                setActiveTab('COMPATIBILITY');
                setCompatibilitySubTab('INVENTORY');
              }}
              onOpenInvoice={() => {
                setSelectedInvoice(invoices[0]);
                setIsInvoiceModalOpen(true);
              }}
              onRecordMeasurement={handleRecordMeasurement}
              onSelectComponent={(cmp) => {
                setSelectedComponent(cmp);
                setActiveSide(cmp.side);
              }}
              onToggleRepairStep={handleToggleRepairStep}
              onRecordPostTest={handleRecordPostTest}
              onCompleteCase={handleCompleteRepair}
              onOverrideTest={(t, reason) => {
                sounds.playWarningAlert();
                if (activeCase) {
                  const audit: AuditLogEntry = {
                    id: `AUD-OVR-${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                    actionType: 'MANUAL_OVERRIDE',
                    author: 'TECHNICIAN',
                    descriptionAr: `تجاوز يدوي للفحص المقترح [${t.testPointName}]. السبب المسجل: ${reason || 'تقدير الفني'}`,
                  };
                  setActiveCase((prev) => (prev ? { ...prev, auditLog: [...prev.auditLog, audit] } : undefined));
                }
              }}
            />
          )}

          {/* TAB 3: BOARDVIEW & CAMERA (المخططات والكاميرا) */}
          {(activeTab === 'BOARDVIEW' ||
            activeTab === 'MACRO_CAMERA' ||
            activeTab === 'CATALOG') && (
            <SchematicsHub
              board={currentBoard}
              activeSide={activeSide}
              onSideChange={setActiveSide}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onSelectBoard={(b) => {
                setCurrentBoard(b);
                setSelectedComponent(b.components[0]);
                setActiveSide(b.components[0].side);
              }}
              onCaptureApproved={handleCaptureApproved}
              initialSubTab={schematicsSubTab}
            />
          )}

          {/* TAB 4: COMPATIBILITY & INVENTORY (بنك التوافق والمخزون) */}
          {(activeTab === 'COMPATIBILITY' ||
            activeTab === 'INVENTORY' ||
            activeTab === 'PACKAGES') && (
            <CompatibilityHub
              currentBoardCode={currentBoard.boardCode}
              currentModel={currentBoard.model}
              inventory={inventory}
              onUpdateStock={handleUpdateStock}
              initialSubTab={compatibilitySubTab}
            />
          )}

          {/* TAB 5: CASES & WORKSHOP (الحالات والفواتير وسجل الورشة) */}
          {(activeTab === 'CASES' ||
            activeTab === 'INVOICES' ||
            activeTab === 'AUDIT_LOG' ||
            activeTab === 'SETTINGS') && (
            <WorkshopHub
              cases={cases}
              activeCase={activeCase}
              invoices={invoices}
              auditEntries={allAuditEntries}
              currentBoard={currentBoard}
              isDarkMode={isDarkMode}
              isOnline={isOnline}
              onToggleTheme={() => setIsDarkMode((d) => !d)}
              onSelectCase={handleSelectCase}
              onNewCase={() => setIsCaseModalOpen(true)}
              onSelectInvoice={setSelectedInvoice}
              onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
              initialSubTab={workshopSubTab}
            />
          )}
        </div>

        {/* Bottom Android Navigation Bar (5 Core Sections) */}
        <MobileBottomTabBar
          activeTab={activeTab}
          onTabChange={handleNavigateTab}
        />

        {/* Modal: Case Manager (New Case & Edit) */}
        {isCaseModalOpen && (
          <CaseManagerModal
            cases={cases}
            activeCaseId={activeCase?.id}
            onSelectCase={handleSelectCase}
            onCreateCase={handleCreateCase}
            onClose={() => setIsCaseModalOpen(false)}
          />
        )}

        {/* Modal: Official Invoice & Technical Report */}
        {isInvoiceModalOpen && (
          <InvoiceModal
            invoice={selectedInvoice}
            activeCase={activeCase}
            onClose={() => setIsInvoiceModalOpen(false)}
          />
        )}

        {/* Modal: Audit Trail Modal */}
        {isAuditModalOpen && (
          <AuditTrailModal
            entries={allAuditEntries}
            caseNumber={activeCase?.caseNumber}
            onClose={() => setIsAuditModalOpen(false)}
          />
        )}

        {/* Custom Confirmation / Alert Dialog (AppDialog) */}
        {dialogOptions && (
          <AppDialog
            isOpen={Boolean(dialogOptions)}
            options={dialogOptions}
            onClose={() => setDialogOptions(null)}
          />
        )}
      </div>
    </MobileFrame>
  );
}
