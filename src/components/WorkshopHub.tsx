import React, { useState } from 'react';
import { AuditLogEntry, BoardData, InvoiceRecord, WorkshopCase } from '../types';
import { CasesListView } from './CasesListView';
import { InvoicesView } from './InvoicesView';
import { SettingsView } from './SettingsView';
import { Smartphone, FileText, Activity, Settings, Clock } from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

export type WorkshopSubTab = 'CASES' | 'INVOICES' | 'AUDIT' | 'SETTINGS';

interface WorkshopHubProps {
  cases: WorkshopCase[];
  activeCase?: WorkshopCase;
  invoices: InvoiceRecord[];
  auditEntries: AuditLogEntry[];
  currentBoard: BoardData;
  isOnline: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSelectCase: (c: WorkshopCase) => void;
  onNewCase: () => void;
  onSelectInvoice: (inv: InvoiceRecord) => void;
  onOpenInvoiceModal: () => void;
  initialSubTab?: WorkshopSubTab;
}

export const WorkshopHub: React.FC<WorkshopHubProps> = ({
  cases,
  activeCase,
  invoices,
  auditEntries,
  currentBoard,
  isOnline,
  isDarkMode,
  onToggleTheme,
  onSelectCase,
  onNewCase,
  onSelectInvoice,
  onOpenInvoiceModal,
  initialSubTab = 'CASES',
}) => {
  const [subTab, setSubTab] = useState<WorkshopSubTab>(initialSubTab);

  const subTabs = [
    {
      id: 'CASES' as WorkshopSubTab,
      label: 'بطاقات واستقبال الحالات',
      icon: Smartphone,
    },
    {
      id: 'INVOICES' as WorkshopSubTab,
      label: 'الفواتير والتقارير المعتمدة (QR)',
      icon: FileText,
    },
    {
      id: 'AUDIT' as WorkshopSubTab,
      label: 'سجل التدقيق الهندسي (Audit)',
      icon: Activity,
    },
    {
      id: 'SETTINGS' as WorkshopSubTab,
      label: 'إعدادات الورشة والمزامنة',
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full pb-6">
      {/* Top Segment Controller */}
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
        {subTab === 'CASES' && (
          <CasesListView
            cases={cases}
            activeCaseId={activeCase?.id}
            onSelectCase={onSelectCase}
            onCreateCase={() => onNewCase()}
            onOpenInvoiceForCase={(c) => {
              const matchedInv = invoices.find((inv) => inv.caseId === c.id) || invoices[0];
              onSelectInvoice(matchedInv);
              onOpenInvoiceModal();
            }}
          />
        )}

        {subTab === 'INVOICES' && (
          <InvoicesView
            invoices={invoices}
            onOpenInvoiceDetails={(inv) => {
              onSelectInvoice(inv);
              onOpenInvoiceModal();
            }}
          />
        )}

        {subTab === 'AUDIT' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100">
                    سجل التدقيق الهندسي والقرارات الميدانية
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    توثيق تسلسلي غير قابل للتعديل لجميع القياسات وتجاوزات الفني وتوصيات النظام
                  </p>
                </div>
              </div>
              {activeCase && (
                <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-slate-950 text-amber-400 border border-slate-800">
                  {activeCase.caseNumber}
                </span>
              )}
            </div>

            {auditEntries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد سجلات تدقيق حتى الآن للجهاز الحالي
              </div>
            ) : (
              <div className="space-y-2.5">
                {auditEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-start justify-between gap-3 text-right"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-amber-400 shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">
                          {entry.descriptionAr}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span className="font-mono">{entry.timestamp}</span>
                          <span>•</span>
                          <span className="text-amber-400">
                            {entry.author === 'TECHNICIAN'
                              ? 'فني الصيانة'
                              : entry.author === 'AI_AGENT'
                              ? 'وكيل التشخيص'
                              : 'النظام الأساسي'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {entry.actionType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {subTab === 'SETTINGS' && (
          <SettingsView
            currentBoard={currentBoard}
            isDarkMode={isDarkMode}
            isOnline={isOnline}
            onToggleTheme={onToggleTheme}
          />
        )}
      </div>
    </div>
  );
};
