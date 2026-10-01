export type BoardSide = 'TOP' | 'BOTTOM';

export type ComponentType =
  | 'IC'
  | 'CAPACITOR'
  | 'RESISTOR'
  | 'INDUCTOR'
  | 'DIODE'
  | 'CONNECTOR'
  | 'TESTPOINT'
  | 'FUSE'
  | 'CRYSTAL'
  | 'FILTER';

export type MeasurementType =
  | 'DC_VOLTAGE'
  | 'AC_VOLTAGE'
  | 'DIODE_MODE'
  | 'RESISTANCE'
  | 'CONTINUITY'
  | 'CURRENT'
  | 'TEMPERATURE'
  | 'FREQUENCY';

export interface FiducialLandmark {
  id: string;
  name: string;
  type: 'CONNECTOR' | 'SCREW_HOLE' | 'SHIELD_CORNER' | 'CHIP_CAN';
  xMm: number;
  yMm: number;
  radiusMm?: number;
  side: BoardSide;
}

export interface FunctionalRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  bounds: {
    xMm: number;
    yMm: number;
    widthMm: number;
    heightMm: number;
  };
  side: BoardSide;
}

export interface ComponentItem {
  ref: string;
  nameAr: string;
  type: ComponentType;
  package: string;
  value: string;
  side: BoardSide;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  rotationDeg?: number;
  pinCount?: number;
  pin1Position?: 'TOP_LEFT' | 'BOTTOM_LEFT' | 'TOP_RIGHT' | 'BOTTOM_RIGHT' | 'CENTER';
  net: string;
  regionId: string;
  description?: string;
  polarity?: '+' | '-' | 'PIN1_DOT';
}

export interface MeasurementPoint {
  id: string;
  nameAr: string;
  componentRef: string;
  regionId: string;
  side: BoardSide;
  measurementType: MeasurementType;
  unit: 'V' | 'mV' | 'Ω' | 'kΩ' | 'MΩ' | 'mA' | 'A' | '°C' | 'Hz';
  redProbe: string;
  blackProbe: string;
  conditions: {
    batteryConnected: boolean;
    chargerConnected: boolean;
    powerState: string;
    deviceState: string;
  };
  expectedMin?: number;
  expectedMax?: number;
  nominalValue?: number;
  failureMeaningAr: string;
  nextStepPassAr: string;
  nextStepFailAr: string;
  safetyWarningAr: string;
  macroIllustration?: string;
  verificationStatus: 'VERIFIED_SCHEMATIC' | 'CONFIRMED_WORKSHOP' | 'REFERENCE_PENDING';
}

export interface BoardData {
  id: string;
  brand: string;
  model: string;
  regionalVersion: string;
  boardCode: string;
  boardRevision: string;
  dimensions: {
    widthMm: number;
    heightMm: number;
  };
  thicknessMm: number;
  layers: number;
  availableSides: BoardSide[];
  fiducials: FiducialLandmark[];
  regions: FunctionalRegion[];
  components: ComponentItem[];
  measurementPoints: MeasurementPoint[];
  lastUpdated: string;
  sourceDocument: string;
}

export interface QualityGateResult {
  passed: boolean;
  sharpnessScore: number;
  glareScore: number;
  lightingScore: number;
  framingScore: number;
  failureReasonAr?: string;
  tipsAr?: string;
}

export interface CalibrationBox {
  width: number;
  height: number;
}

export interface CalibrationResult {
  boardId: string;
  side: BoardSide;
  componentRef: string;
  xMm: number;
  yMm: number;
  boxMm: CalibrationBox;
  pixelError: number;
  confidence: 'VERIFIED' | 'SUSPECT' | 'REJECTED';
  reasonAr?: string;
}

export type DiagnosticStageKey =
  | 'IDENTIFY_DEVICE'
  | 'VERIFY_BOARD'
  | 'CHECK_IMAGE_QUALITY'
  | 'LOCATE_REGION'
  | 'LOCATE_COMPONENT'
  | 'SELECT_MEASUREMENT'
  | 'WAIT_FOR_READING'
  | 'INTERPRET_READING'
  | 'SELECT_NEXT_TEST'
  | 'STOP_OR_ESCALATE';

export interface DiagnosticAgentStep {
  stage: number;
  stageKey: DiagnosticStageKey;
  stageTitleAr: string;
  targetSummary: string;
  componentRef: string;
  locationAr: string;
  statusAr: string;
  currentActionAr: string;
  readingInputNeeded: boolean;
  deepExplanationAr: string;
  measurementPointId?: string;
}

export type FaultPath =
  | 'POWER'
  | 'CHARGING'
  | 'DISPLAY'
  | 'AUDIO'
  | 'NETWORK'
  | 'BOOTLOOP';

export type CaseStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_PART'
  | 'REPAIRED'
  | 'CLOSED';

export interface CaseMeasurementRecord {
  id: string;
  timestamp: string;
  pointId: string;
  componentRef: string;
  measurementType: MeasurementType;
  valueRecorded: number | 'SHORT' | 'OPEN' | 'NO_REFERENCE';
  unit: string;
  evaluation: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN' | 'WARNING' | 'INCONCLUSIVE';
  technicianNote?: string;
  safetyConfirmed: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actionType:
    | 'IMAGE_CAPTURE'
    | 'QUALITY_CHECK'
    | 'BOARD_VERIFY'
    | 'MEASUREMENT_RECORD'
    | 'AI_SUGGESTION'
    | 'MANUAL_OVERRIDE'
    | 'STATUS_CHANGE'
    | 'INVENTORY_DEDUCT';
  author: 'TECHNICIAN' | 'AI_AGENT' | 'SYSTEM';
  descriptionAr: string;
  metadata?: Record<string, any>;
}

export interface WorkshopCase {
  id: string;
  caseNumber: string;
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  boardCode: string;
  faultPath: FaultPath;
  status: CaseStatus;
  complaintAr: string;
  intakeDate: string;
  currentStepIndex?: number; // 0 to 6 (7 stages)
  overviewImageUrl?: string;
  macroImageUrl?: string;
  measurements: CaseMeasurementRecord[];
  auditLog: AuditLogEntry[];
  assignedTechnician: string;
  estimatedCost: number;
  partsUsed?: string[];
  postRepairTestingDone?: boolean;
}

export interface InventoryItem {
  sku: string;
  nameAr: string;
  nameEn: string;
  category: 'IC' | 'SCREEN' | 'BATTERY' | 'FPC' | 'CONNECTOR' | 'PASSIVE';
  compatibleModels: string[];
  compatibleBoards: string[];
  stockQty: number;
  minAlertQty: number;
  unitPriceSAR: number;
  locationBin: string;
  supplier?: string;
}

export interface InvoiceRecord {
  id: string;
  caseId: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  boardCode: string;
  parts: {
    sku: string;
    nameAr: string;
    qty: number;
    unitPrice: number;
  }[];
  laborCost: number;
  discount: number;
  taxRate: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  notesAr: string;
  warrantyPeriodDays: number;
}

// Master Phone Catalog interfaces (Sections 2.8 & 4 of report)
export interface PhoneCatalogItem {
  id: string;
  brand: string;
  model: string;
  modelNumber: string;
  releaseYear: number;
  boardCodes: string[];
  chipset: string;
  chargingPort: string;
  batteryCapacity: string;
  screenSpecs: string;
  commonFaultsAr: string[];
  schematicAvailable: boolean;
  boardviewAvailable: boolean;
}

// Image annotation interfaces (Section 2.7 of report)
export interface AnnotationItem {
  id: string;
  type: 'RECT' | 'ARROW' | 'CIRCLE' | 'TEXT';
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  label?: string;
  color: string;
}
