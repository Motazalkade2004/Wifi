import React, { useState } from 'react';
import { BoardData, CaseStatus, FaultPath, WorkshopCase } from '../types';
import { BOARDS_CATALOG } from '../data/boards';
import {
  Smartphone,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  FileText,
  User,
  Phone,
} from 'lucide-react';

interface CasesListViewProps {
  cases: WorkshopCase[];
  activeCaseId?: string;
  onSelectCase: (c: WorkshopCase) => void;
  onCreateCase: (c: WorkshopCase) => void;
  onOpenInvoiceForCase: (c: WorkshopCase) => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onCreateCase,
  onOpenInvoiceForCase,
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // Form states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>(BOARDS_CATALOG[0].id);
  const [faultPath, setFaultPath] = useState<FaultPath>('CHARGING');
  const [complaintAr, setComplaintAr] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(180);

  const filtered = cases.filter((c) => {
    const matchSearch =
      !search ||
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.customerPhone.includes(search) ||
      c.deviceModel.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const board = BOARDS_CATALOG.find((b) => b.id === selectedBoardId) || BOARDS_CATALOG[0];

    const newCase: WorkshopCase = {
      id: `CASE-${Date.now()}`,
      caseNumber: `NY-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      deviceBrand: board.brand,
      deviceModel: board.model,
      boardCode: board.boardCode,
      faultPath,
      status: 'OPEN',
      complaintAr: complaintAr || 'فحص عام وإصلاح عطل',
      intakeDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      currentStepIndex: 0,
      assignedTechnician: 'نادر (فني ورشة قلب اليمن)',
      estimatedCost,
      measurements: [],
      auditLog: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          actionType: 'STATUS_CHANGE',
          author: 'TECHNICIAN',
          descriptionAr: `استقبال الهاتف وتثبيت هوية اللوحة ${board.boardCode}.`,
        },
      ],
    };

    onCreateCase(newCase);
    setShowNewModal(false);
    setCustomerName('');
    setCustomerPhone('');
    setComplaintAr('');
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              إدارة واستقبال حالات الأجهزة (Workshop Intake & Cases)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            سجل أجهزة العملاء، الشكاوى، متابعة مسارات الأعطال والتحقق من تقدم الإصلاح
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>استقبال جهاز جديد</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الحالة، اسم العميل، الهاتف، أو الموديل..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_PART', 'REPAIRED', 'CLOSED'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL'
                  ? 'الكل'
                  : st === 'OPEN'
                  ? 'مفتوحة'
                  : st === 'IN_PROGRESS'
                  ? 'قيد العمل'
                  : st === 'WAITING_PART'
                  ? 'انتظار قطعة'
                  : st === 'REPAIRED'
                  ? 'تم الإصلاح'
                  : 'مغلقة'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Cases List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const isSelected = activeCaseId === c.id;
          return (
            <div
              key={c.id}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-amber-500/70 ring-1 ring-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-sm font-black text-amber-400 block">
                      {c.caseNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{c.intakeDate}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'REPAIRED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : c.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {c.status === 'IN_PROGRESS'
                      ? 'قيد الفحص'
                      : c.status === 'REPAIRED'
                      ? 'تم الإصلاح'
                      : 'مفتوحة'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex items-center gap-2 text-slate-200">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-bold">{c.customerName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">({c.customerPhone})</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Smartphone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{c.deviceBrand} {c.deviceModel}</span>
                    <span className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">
                      {c.boardCode}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-slate-500 block mb-1">الشكوى ومسار العطل ({c.faultPath}):</span>
                    {c.complaintAr}
                  </div>

                  {c.measurements.length > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>القياسات الموثقة:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.measurements.length} قياس مسجل
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenInvoiceForCase(c)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الفاتورة</span>
                </button>

                <button
                  onClick={() => onSelectCase(c)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <span>متابعة التشخيص</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Case Intake Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-500" />
              <span>استقبال هاتف جديد في الورشة</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم العميل:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="محمد عبدالله"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">رقم الهاتف:</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="771234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">طراز الهاتف واللوحة:</label>
                  <select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {BOARDS_CATALOG.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.brand} {b.model} ({b.boardCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">مسار العطل:</label>
                  <select
                    value={faultPath}
                    onChange={(e) => setFaultPath(e.target.value as FaultPath)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CHARGING">مسار الشحن (Charging)</option>
                    <option value="POWER">مسار الباور والإقلاع (Power)</option>
                    <option value="DISPLAY">مسار الشاشة والإضاءة (Display)</option>
                    <option value="AUDIO">مسار الصوت (Audio)</option>
                    <option value="NETWORK">مسار الشبكة (Network)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">شكوى العميل:</label>
                <textarea
                  rows={3}
                  value={complaintAr}
                  onChange={(e) => setComplaintAr(e.target.value)}
                  placeholder="وصف المشكلة وظروف ظهور العطل..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
                >
                  تأكيد واستقبال الجهاز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
