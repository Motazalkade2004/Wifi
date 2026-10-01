/**
 * V158 FUSION - Core Domain Types & Vocabulary
 * Defined strictly according to V158 FUSION Formal Technical Proposal (Version 1.0)
 * Appendix B - Minimum Domain Status Vocabulary
 */

export type MeasurementStatus =
  | 'PASS'
  | 'FAIL_LOW'
  | 'FAIL_HIGH'
  | 'WARNING'
  | 'NO_REFERENCE'
  | 'INVALID'
  | 'MISMATCH'
  | 'UNKNOWN';

export type DataTrust =
  | 'VERIFIED'
  | 'MANUFACTURER'
  | 'SERVICE_DATA'
  | 'MEASURED'
  | 'TECHNICIAN'
  | 'COMMUNITY'
  | 'TEST'
  | 'UNKNOWN';

export type DiagnosisStatus =
  | 'CONFIRMED'
  | 'PROBABLE'
  | 'POSSIBLE'
  | 'INCONCLUSIVE';

export type CompatibilityStatus =
  | 'VERIFIED_COMPATIBLE'
  | 'LIKELY_COMPATIBLE'
  | 'POSSIBLE'
  | 'NOT_VERIFIED'
  | 'INCOMPATIBLE';

export type PackageStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'INSTALLED'
  | 'DISABLED'
  | 'REJECTED';

export type RepairAction =
  | 'INSPECT'
  | 'MEASURE'
  | 'ISOLATE'
  | 'REPLACE_COMPONENT'
  | 'REPAIR_TRACE'
  | 'REBALL'
  | 'REWORK'
  | 'CLEAN'
  | 'REASSEMBLE'
  | 'FUNCTIONAL_TEST';

export type MeasurementType =
  | 'DC_VOLTAGE'
  | 'AC_VOLTAGE'
  | 'RESISTANCE'
  | 'CONTINUITY'
  | 'DIODE_VOLTAGE'
  | 'CURRENT'
  | 'TEMPERATURE'
  | 'FREQUENCY';

export type MeasurementCondition =
  | 'POWER_OFF'
  | 'BATTERY_CONNECTED'
  | 'BATTERY_DISCONNECTED'
  | 'CHARGER_CONNECTED'
  | 'CHARGER_DISCONNECTED'
  | 'POWER_ON_IDLE'
  | 'POWER_ON_LOAD';

export type EvidenceSource =
  | 'MEASUREMENT'
  | 'RULE'
  | 'NET_RELATION'
  | 'COMPONENT_RELATION'
  | 'SEQUENCE'
  | 'USER_INPUT'
  | 'BOARD_DATA';

export type BootMode =
  | 'NORMAL'
  | 'RECOVERY'
  | 'FASTBOOT'
  | 'EDL_9008'
  | 'ODIN_DOWNLOAD'
  | 'DISCONNECTED';

// Core Entities (Section 14)
export interface V158TestPoint {
  id: string;
  name: string;
  nameAr: string;
  boardRevisionId: string;
  side: 'TOP' | 'BOTTOM';
  xMm: number;
  yMm: number;
  netId: string;
  componentRef?: string;
  padDiameterMm: number;
  descriptionAr: string;
  descriptionEn: string;
}

export interface V158MeasurementReference {
  id: string;
  boardRevisionId: string;
  testPointId: string;
  measurementType: MeasurementType;
  condition: MeasurementCondition;
  unit: string;
  nominalValue?: number;
  minValue?: number;
  maxValue?: number;
  tolerancePercent?: number;
  trustLevel: DataTrust;
  provenance: string;
  safetyWarningAr?: string;
  safetyWarningEn?: string;
}

export interface V158MeasurementRecord {
  id: string;
  caseId: string;
  testPointId: string;
  boardRevisionId: string;
  measurementType: MeasurementType;
  condition: MeasurementCondition;
  measuredValue: number | 'SHORT' | 'OPEN';
  unit: string;
  status: MeasurementStatus;
  deviationPercent?: number;
  severity?: 'NORMAL' | 'WARNING' | 'CRITICAL';
  anomalyExplanationAr?: string;
  anomalyExplanationEn?: string;
  technicianNote?: string;
  timestamp: string;
  isBeforeRepair: boolean;
}

export interface V158Evidence {
  id: string;
  source: EvidenceSource;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  weight: number; // 0.0 to 1.0
  supportsCandidateRef: string;
  contradictsCandidateRef?: string;
  timestamp: string;
}

export interface V158DiagnosisCandidate {
  componentRef: string;
  netId?: string;
  componentNameAr: string;
  componentNameEn: string;
  confidenceScore: number; // 0 to 100%
  status: DiagnosisStatus;
  explanationAr: string;
  explanationEn: string;
  supportingEvidence: V158Evidence[];
  contradictingEvidence: V158Evidence[];
  isConfirmedLocation: boolean;
}

export interface V158SmartNextTest {
  testPointId: string;
  testPointName: string;
  componentRef: string;
  measurementType: MeasurementType;
  condition: MeasurementCondition;
  priority: number; // 1 (highest) to 10
  expectedInformationGain: number; // 0.0 to 1.0
  estimatedEffortSeconds: number;
  safetyLevel: 'SAFE' | 'MEDIUM_RISK' | 'HIGH_VOLTAGE';
  reasonAr: string;
  reasonEn: string;
  unit: string;
}

export interface V158RepairStep {
  stepNumber: number;
  action: RepairAction;
  targetComponentRef: string;
  descriptionAr: string;
  descriptionEn: string;
  warningAr?: string;
  warningEn?: string;
  requiredTestPointId?: string;
  completed: boolean;
}

export interface V158RepairPlan {
  id: string;
  caseId: string;
  suspectedFault: string;
  targetComponentRef: string;
  steps: V158RepairStep[];
  requiredPostTests: string[]; // testPoint IDs
  beforeMeasurements: V158MeasurementRecord[];
  afterMeasurements: V158MeasurementRecord[];
  isValidationCompleted: boolean;
}

export interface V158CompatibilityItem {
  id: string;
  sourcePartSku: string;
  targetModel: string;
  targetBoardCode: string;
  partCategory: 'BATTERY' | 'CHARGING_PORT' | 'CHARGING_FLEX' | 'IC' | 'SIM_HOLDER' | 'POWER_FLEX' | 'SCREEN';
  status: CompatibilityStatus;
  confidencePercent: number;
  physicalFit: boolean;
  electricalCompatible: boolean;
  connectorCompatible: boolean;
  firmwareDependency: boolean;
  evidenceNotesAr: string;
  evidenceNotesEn: string;
  warningsAr?: string[];
  warningsEn?: string[];
}

export interface V158DiagnosticPackage {
  id: string;
  packageVersion: string;
  manufacturer: string;
  model: string;
  boardCode: string;
  revision: string;
  trustClassification: DataTrust;
  sha256Hash: string;
  installedAt: string;
  status: PackageStatus;
  componentCount: number;
  testPointCount: number;
  ruleCount: number;
}

export interface V158DeviceConnection {
  isConnected: boolean;
  bootMode: BootMode;
  serialNumber?: string;
  modelDetected?: string;
  boardDetected?: string;
  androidVersion?: string;
  securityPatch?: string;
  batteryLevel?: number;
  isAuthorized: boolean;
  unsupportedOperations: string[];
}
