import React, { useState } from 'react';
import { BoardData, FaultPath, WorkshopCase } from '../types';
import { BOARDS_CATALOG } from '../data/boards';
import { Plus, X, Search, Smartphone, User, Phone, FileText, CheckCircle2, Clock } from 'lucide-react';

interface CaseManagerModalProps {
  cases: WorkshopCase[];
  activeCaseId?: string;
  onSelectCase: (c: WorkshopCase) => void;
  onCreateCase: (newCase: WorkshopCase) => void;
  onClose: () => void;
}

export const CaseManagerModal: React.FC<CaseManagerModalProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onCreateCase,
  onClose,
}) => {
  const [showNewForm, setShowNewForm] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  // Form fields
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>(BOARDS_CATALOG[0].id);
  const [faultPath, setFaultPath] = useState<FaultPath>('CHARGING');
  const [complaintAr, setComplaintAr] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(150);

  const filteredCases = cases.filter((c) => {
    return (
      !search ||
      c.customerName.includes(search) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.deviceModel.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('يرجى ملء اسم العميل ورقم الهاتف');
      return;
    }

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
      assignedTechnician: 'نادر (فني ورشة قلب اليمن)',
      estimatedCost,
      measurements: [],
      auditLog: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          actionType: 'STATUS_CHANGE',
          author: 'TECHNICIAN',
          descriptionAr: `استقبال الجهاز في الورشة ومطابقة كود اللوحة ${board.boardCode}.`,
        },
      ],
    };

    onCreateCase(newCase);
    setShowNewForm(false);
    onSelectCase(newCase);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              {showNewForm ? 'استقبال جهاز جديد وتسجيل حالة' : 'إدارة حالات واستقبال الأجهزة'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {showNewForm ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    اسم العميل:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد عبدالكريم"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    رقم الهاتف:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="770000000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    طراز الهاتف وكود اللوحة المعتمدة:
                  </label>
                  <select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {BOARDS_CATALOG.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.brand} {b.model} ({b.boardCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    مسار العطل الرئيسي:
                  </label>
                  <select
                    value={faultPath}
                    onChange={(e) => setFaultPath(e.target.value as FaultPath)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CHARGING">مسار الشحن و OVP (Charging)</option>
                    <option value="POWER">مسار الباور والإقلاع (Power / Boot)</option>
                    <option value="DISPLAY">مسار الشاشة والإضاءة (Display / Backlight)</option>
                    <option value="AUDIO">مسار الصوت والسماعات (Audio Codec)</option>
                    <option value="NETWORK">مسار الشبكة والمودم (RF / Baseband)</option>
                    <option value="BOOTLOOP">مسار إعادة التشغيل المتكرر (Bootloop)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  شكوى العميل وظروف حدوث العطل:
                </label>
                <textarea
                  rows={3}
                  value={complaintAr}
                  onChange={(e) => setComplaintAr(e.target.value)}
                  placeholder="مثال: توقف الجهاز عن الشحن بعد استخدام شاحن سيارة تجاري، لا يسحب أي تيار..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25"
                >
                  حفظ وفتح جلسة التشخيص
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث بالاسم أو رقم الحالة..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>استقبال جهاز</span>
                </button>
              </div>

              {/* Case list */}
              <div className="space-y-2.5">
                {filteredCases.map((c) => {
                  const isSelected = activeCaseId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectCase(c);
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-amber-400">
                            {c.caseNumber}
                          </span>
                          <span className="font-bold text-xs text-slate-200">
                            {c.customerName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ({c.customerPhone})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {c.deviceBrand} {c.deviceModel} — {c.boardCode}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-md">
                          الشكوى: {c.complaintAr}
                        </p>
                      </div>

                      <div className="text-left space-y-1.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'REPAIRED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {c.status === 'IN_PROGRESS' ? 'قيد الفحص' : c.status === 'REPAIRED' ? 'تم الإصلاح' : 'مفتوحة'}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {c.intakeDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
