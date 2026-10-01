import React, { useState } from 'react';
import {
  BoardData,
  ComponentItem,
  FaultPath,
  QualityGateResult,
  WorkshopCase,
} from '../types';
import {
  V158DiagnosisCandidate,
  V158RepairPlan,
  V158SmartNextTest,
} from '../types/v158';
import { DiagnosticWorkflowView } from './DiagnosticWorkflowView';
import { EvidenceDiagnosisView } from './v158/EvidenceDiagnosisView';
import { SmartNextTestView } from './v158/SmartNextTestView';
import { RepairPlanView } from './v158/RepairPlanView';
import { RepairFlowStepper } from './RepairFlowStepper';
import { Zap, Activity, Target, Wrench, GitFork } from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

export type DiagnosticSubTab = 'WORKFLOW_10' | 'EVIDENCE' | 'SMART_TEST' | 'REPAIR_PLAN' | 'FLOW_7';

interface DiagnosticHubProps {
  board: BoardData;
  activeCase?: WorkshopCase;
  faultPath: FaultPath;
  diagnosticCandidates: V158DiagnosisCandidate[];
  smartNextTests: V158SmartNextTest[];
  repairPlan: V158RepairPlan;
  selectedComponent: ComponentItem;
  initialSubTab?: DiagnosticSubTab;
  onOpenMacroCamera: () => void;
  onOpenBoardview: () => void;
  onOpenInventory: () => void;
  onOpenInvoice: () => void;
  onRecordMeasurement: (record: {
    pointId: string;
    componentRef: string;
    value: number | 'SHORT' | 'OPEN';
    unit: string;
    evaluation: 'PASS' | 'FAIL' | 'SHORT' | 'OPEN';
    note?: string;
  }) => void;
  onSelectComponent: (comp: ComponentItem) => void;
  onToggleRepairStep: (stepNumber: number) => void;
  onRecordPostTest: (testPointId: string, value: number | 'SHORT' | 'OPEN') => void;
  onCompleteCase: () => void;
  onOverrideTest: (test: V158SmartNextTest, reason: string) => void;
}

export const DiagnosticHub: React.FC<DiagnosticHubProps> = ({
  board,
  activeCase,
  faultPath,
  diagnosticCandidates,
  smartNextTests,
  repairPlan,
  selectedComponent,
  initialSubTab = 'WORKFLOW_10',
  onOpenMacroCamera,
  onOpenBoardview,
  onOpenInventory,
  onOpenInvoice,
  onRecordMeasurement,
  onSelectComponent,
  onToggleRepairStep,
  onRecordPostTest,
  onCompleteCase,
  onOverrideTest,
}) => {
  const [subTab, setSubTab] = useState<DiagnosticSubTab>(initialSubTab);

  const subTabs = [
    {
      id: 'WORKFLOW_10' as DiagnosticSubTab,
      label: 'المساعد الموجه (10 خطوات)',
      icon: Zap,
    },
    {
      id: 'EVIDENCE' as DiagnosticSubTab,
      label: 'محرك الأدلة والتفسير',
      icon: Activity,
    },
    {
      id: 'SMART_TEST' as DiagnosticSubTab,
      label: 'الفحص الذكي التالي',
      icon: Target,
    },
    {
      id: 'REPAIR_PLAN' as DiagnosticSubTab,
      label: 'خطة الإصلاح والمقارنة',
      icon: Wrench,
    },
    {
      id: 'FLOW_7' as DiagnosticSubTab,
      label: 'المسار المتسلسل',
      icon: GitFork,
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full pb-6">
      {/* Top Android Material Pill Segment Controller */}
      <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-sm">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                sounds.playClick();
                setSubTab(t.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* View Content */}
      <div className="flex-1 flex flex-col">
        {subTab === 'WORKFLOW_10' && (
          <DiagnosticWorkflowView
            board={board}
            activeCase={activeCase}
            faultPath={faultPath}
            onOpenMacroCamera={onOpenMacroCamera}
            onOpenBoardview={onOpenBoardview}
            onOpenInventory={onOpenInventory}
            onOpenInvoice={onOpenInvoice}
            onRecordMeasurement={onRecordMeasurement}
          />
        )}

        {subTab === 'EVIDENCE' && (
          <EvidenceDiagnosisView
            candidates={diagnosticCandidates}
            onSelectCandidate={(c) => {
              const comp = board.components.find((cmp) => cmp.ref === c.componentRef);
              if (comp) onSelectComponent(comp);
              setSubTab('REPAIR_PLAN');
            }}
            onOpenSmartNextTest={() => setSubTab('SMART_TEST')}
          />
        )}

        {subTab === 'SMART_TEST' && (
          <SmartNextTestView
            candidates={smartNextTests}
            onExecuteTest={(t) => {
              const comp = board.components.find((c) => c.ref === t.componentRef);
              if (comp) onSelectComponent(comp);
              setSubTab('WORKFLOW_10');
            }}
            onOverrideTest={onOverrideTest}
          />
        )}

        {subTab === 'REPAIR_PLAN' && (
          <RepairPlanView
            plan={repairPlan}
            onToggleStep={onToggleRepairStep}
            onRecordPostTest={onRecordPostTest}
            onCompleteCase={onCompleteCase}
          />
        )}

        {subTab === 'FLOW_7' && activeCase && (
          <RepairFlowStepper
            board={board}
            activeCase={activeCase}
            targetComponent={selectedComponent}
            measurementPoint={board.measurementPoints.find(
              (m) => m.componentRef === selectedComponent.ref
            )}
            onOpenMacroCamera={onOpenMacroCamera}
            onOpenBoardview={onOpenBoardview}
            onOpenInventory={onOpenInventory}
            onOpenInvoice={onOpenInvoice}
            onRecordMeasurement={onRecordMeasurement}
            onUpdateCaseStep={() => {}}
            onCompleteRepair={onCompleteCase}
          />
        )}
      </div>
    </div>
  );
};
