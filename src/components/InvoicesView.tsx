import React, { useState } from 'react';
import { InvoiceRecord, WorkshopCase } from '../types';
import {
  FileText,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  QrCode,
  DollarSign,
  User,
  Smartphone,
  Eye,
} from 'lucide-react';

interface InvoicesViewProps {
  invoices: InvoiceRecord[];
  onOpenInvoiceDetails: (inv: InvoiceRecord) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onOpenInvoiceDetails,
}) => {
  const [search, setSearch] = useState<string>('');

  const filtered = invoices.filter((inv) => {
    return (
      !search ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerPhone.includes(search) ||
      inv.deviceModel.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPaid = invoices
    .filter((i) => i.paymentStatus === 'PAID')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              سجل الفواتير والتقارير الفنية المعتمدة
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            إصدار فواتير الإصلاح، تفصيل أجور اللحام وقطع الغيار، والتوثيق برمز الاستجابة السريعة QR
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
          <div className="px-3 py-1">
            <span className="text-[10px] text-slate-500 block">عدد الفواتير</span>
            <span className="font-mono font-bold text-slate-200">{invoices.length}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="px-3 py-1">
            <span className="text-[10px] text-slate-500 block">إجمالي التحصيل</span>
            <span className="font-mono font-black text-emerald-400">{totalPaid} ر.س</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث برقم الفاتورة، اسم العميل، الهاتف، أو الموديل..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <span className="font-mono text-sm font-black text-amber-400 block">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{inv.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  مدفوع ومكتمل
                </span>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-slate-200">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-bold">{inv.customerName}</span>
                  <span className="text-slate-500 font-mono text-[11px]">({inv.customerPhone})</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{inv.deviceModel}</span>
                  <span className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400">
                    {inv.boardCode}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1.5 text-[11px]">
                  <span className="text-slate-400 block font-bold">القطع المستبدلة:</span>
                  {inv.parts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <span>• {p.nameAr}</span>
                      <span className="font-mono">{p.qty * p.unitPrice} ر.س</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>أجور الفحص والتركيب:</span>
                    <span className="font-mono">{inv.laborCost} ر.س</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">الإجمالي الكلي:</span>
                <span className="font-mono font-black text-lg text-emerald-400">
                  {inv.total} ر.س
                </span>
              </div>

              <button
                onClick={() => onOpenInvoiceDetails(inv)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة وطباعة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
