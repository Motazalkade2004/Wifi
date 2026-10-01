import React from 'react';
import { InvoiceRecord, WorkshopCase } from '../types';
import { X, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface InvoiceModalProps {
  invoice?: InvoiceRecord;
  activeCase?: WorkshopCase;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  activeCase,
  onClose,
}) => {
  const customerName = invoice?.customerName || activeCase?.customerName || 'عميل نقدي';
  const customerPhone = invoice?.customerPhone || activeCase?.customerPhone || '770000000';
  const deviceModel = invoice?.deviceModel || activeCase?.deviceModel || 'Galaxy S24 Ultra';
  const boardCode = invoice?.boardCode || activeCase?.boardCode || 'SM-S928B-REV-01';
  const invoiceNumber = invoice?.invoiceNumber || `INV-NY-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = invoice?.date || new Date().toISOString().replace('T', ' ').slice(0, 16);
  const parts = invoice?.parts || [
    { sku: 'CAP-0402-10UF-25V', nameAr: 'مكثف تصفية دخل الشحن VBUS C2150', qty: 1, unitPrice: 20 },
    { sku: 'DIODE-TVS-ESD5V3', nameAr: 'دايود حماية كبت الجهد D2001', qty: 1, unitPrice: 30 },
  ];
  const laborCost = invoice?.laborCost ?? (activeCase?.estimatedCost ? activeCase.estimatedCost - 50 : 100);
  const partsTotal = parts.reduce((sum, p) => sum + p.qty * p.unitPrice, 0);
  const grandTotal = invoice?.total ?? (partsTotal + laborCost);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              فاتورة الصيانة والتقرير الهندسي المعتمد
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الفاتورة / تصدير PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0">
          {/* Brand Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                قلب اليمن فون — Nader Complete
              </h1>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                مركز الهندسة المتخصصة لصيانة لوحات الهواتف الذكية (Level 3 Boardview & Schematics)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                صنعاء — الجمهورية اليمنية | خدمة العملاء: 777-000000
              </p>
            </div>
            <div className="text-left font-mono">
              <span className="text-lg font-black block text-amber-600">{invoiceNumber}</span>
              <span className="text-xs text-slate-500 block">{dateStr}</span>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                مدفوع ومكتمل (PAID)
              </span>
            </div>
          </div>

          {/* Customer & Device Information */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs">
            <div>
              <span className="text-slate-500 block">اسم العميل:</span>
              <span className="font-bold text-slate-900 text-sm">{customerName}</span>
              <span className="font-mono text-slate-600 block mt-0.5">{customerPhone}</span>
            </div>
            <div>
              <span className="text-slate-500 block">الهاتف وكود اللوحة:</span>
              <span className="font-bold text-slate-900 text-sm">{deviceModel}</span>
              <span className="font-mono text-slate-600 block mt-0.5">{boardCode}</span>
            </div>
          </div>

          {/* Parts Used Table */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              قطع الغيار والمكوّنات المستبدلة:
            </h4>
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">البيان / القطعة</th>
                  <th className="py-2.5 px-3">كود SKU</th>
                  <th className="py-2.5 px-3 text-center">الكمية</th>
                  <th className="py-2.5 px-3 text-left">السعر</th>
                  <th className="py-2.5 px-3 text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.nameAr}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{p.sku}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{p.qty}</td>
                    <td className="py-2.5 px-3 text-left font-mono">{p.unitPrice} ر.س</td>
                    <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-900">
                      {p.qty * p.unitPrice} ر.س
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <td colSpan={4} className="py-2.5 px-3 font-semibold text-slate-700">
                    أجور الفحص الهندسي واللحام المجهري والتركيب:
                  </td>
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-900">
                    {laborCost} ر.س
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measurements Audit Section (Section 5.8: توثيق القياسات بالفاتورة) */}
          {activeCase && activeCase.measurements.length > 0 && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[11px]">
              <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>سجل القياسات الهندسية الموثقة (Audit Trail):</span>
              </h5>
              <div className="space-y-1 font-mono text-slate-600">
                {activeCase.measurements.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                    <span>
                      {m.pointId} ({m.componentRef}) — وضع {m.measurementType}
                    </span>
                    <span className="font-bold text-slate-900">
                      {m.valueRecorded} {m.unit} [{m.evaluation}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals Breakdown */}
          <div className="flex items-end justify-between border-t-2 border-slate-900 pt-4 mb-6">
            <div className="text-xs text-slate-500 space-y-1">
              <p>• الضمان الفني: 30 يوماً على المكونات المستبدلة.</p>
              <p>• لا يشمل الضمان الكسر أو السوائل أو استخدام شواحن غير مطابقة.</p>
            </div>
            <div className="text-left space-y-1 font-mono">
              <div className="text-xs text-slate-500">
                المجموع الكلي:
              </div>
              <div className="text-2xl font-black text-slate-950">
                {grandTotal} <span className="text-sm font-sans font-bold">ريال سعودي</span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Stamp */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-500">
            <div>
              <span>توقيع الفني المعتمد: ________________</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <QrCode className="w-8 h-8 text-slate-800" />
              <span>مصدق إلكترونياً بنظام قلب اليمن فون</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
