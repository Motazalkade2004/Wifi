import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { X, ShieldCheck, User, Cpu, Activity, Clock, Filter } from 'lucide-react';

interface AuditTrailModalProps {
  entries: AuditLogEntry[];
  caseNumber?: string;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  entries,
  caseNumber,
  onClose,
}) => {
  const [filterAuthor, setFilterAuthor] = useState<'ALL' | 'TECHNICIAN' | 'AI_AGENT' | 'SYSTEM'>('ALL');

  const filteredEntries = entries.filter((e) => {
    return filterAuthor === 'ALL' || e.author === filterAuthor;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                سجل التدقيق الهندسي للورشة (Audit Trail Log)
              </h3>
              {caseNumber && (
                <span className="text-xs text-slate-400 font-mono">الحالة: {caseNumber}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-bold">
            <Filter className="w-3.5 h-3.5" />
            تصفية السجل:
          </span>
          {(['ALL', 'TECHNICIAN', 'AI_AGENT', 'SYSTEM'] as const).map((auth) => (
            <button
              key={auth}
              onClick={() => setFilterAuthor(auth)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterAuthor === auth
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {auth === 'ALL'
                ? 'الكل'
                : auth === 'TECHNICIAN'
                ? 'الفني البشري'
                : auth === 'AI_AGENT'
                ? 'توصيات الذكاء'
                : 'النظام'}
            </button>
          ))}
        </div>

        {/* Timeline Log */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              لا توجد سجلات مطابقة في هذا التصنيف.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    entry.author === 'TECHNICIAN'
                      ? 'bg-blue-500/20 text-blue-400'
                      : entry.author === 'AI_AGENT'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {entry.author === 'TECHNICIAN' ? (
                    <User className="w-4 h-4" />
                  ) : entry.author === 'AI_AGENT' ? (
                    <Cpu className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      {entry.author === 'TECHNICIAN'
                        ? 'إجراء يدوي من الفني'
                        : entry.author === 'AI_AGENT'
                        ? 'توصية الذكاء الاصطناعي'
                        : 'فحص النظام التلقائي'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {entry.descriptionAr}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
