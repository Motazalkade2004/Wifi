import React, { useState } from 'react';
import { MASTER_PHONE_CATALOG } from '../data/phoneCatalog';
import { BoardData, PhoneCatalogItem } from '../types';
import { BOARDS_CATALOG } from '../data/boards';
import {
  Smartphone,
  Search,
  CheckCircle2,
  FileCode,
  Layers,
  Battery,
  Zap,
  Cpu,
  Monitor,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

interface PhoneCatalogViewProps {
  onSelectBoard: (board: BoardData) => void;
}

export const PhoneCatalogView: React.FC<PhoneCatalogViewProps> = ({ onSelectBoard }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const filteredCatalog = MASTER_PHONE_CATALOG.filter((item) => {
    const matchSearch =
      !search ||
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.modelNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.boardCodes.some((code) => code.toLowerCase().includes(search.toLowerCase()));

    const matchBrand = selectedBrand === 'ALL' || item.brand === selectedBrand;
    return matchSearch && matchBrand;
  });

  const handleLoadBoard = (item: PhoneCatalogItem) => {
    // Find matching board data package or fallback
    const matched =
      BOARDS_CATALOG.find((b) => item.boardCodes.includes(b.boardCode)) ||
      BOARDS_CATALOG.find((b) => b.brand.toLowerCase() === item.brand.toLowerCase()) ||
      BOARDS_CATALOG[0];

    onSelectBoard(matched);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              قاعدة بيانات الأجهزة والكتالوجات الهندسية (Master Phone Catalog)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            كتالوج الأجهزة المعتمد، أرقام الموديلات، أكواد اللوحات، مواصفات الشحن والبطاريات، والأعطال الشائعة
          </p>
        </div>

        {/* Brand Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {['ALL', 'Samsung', 'Apple', 'Xiaomi', 'Huawei'].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {brand === 'ALL' ? 'كل الشركات' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالموديل (S24 Ultra, iPhone 15, Nuwa) أو كود اللوحة..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCatalog.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              {/* Header: Model & Board Codes */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {item.brand}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      إصدار: {item.releaseYear}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mt-1">
                    {item.model}
                  </h4>
                  <span className="text-xs font-mono text-slate-400 block mt-0.5">
                    {item.modelNumber}
                  </span>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">أكواد اللوحات:</span>
                  {item.boardCodes.map((bc) => (
                    <span
                      key={bc}
                      className="block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] font-bold text-amber-300"
                    >
                      {bc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hardware Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">المعالج:</span>
                    <span className="font-semibold text-slate-200 truncate block text-[11px]">
                      {item.chipset}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">منفذ الشحن:</span>
                    <span className="font-semibold text-slate-200 truncate block text-[11px]">
                      {item.chargingPort}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">البطارية:</span>
                    <span className="font-semibold text-slate-200 truncate block text-[11px]">
                      {item.batteryCapacity}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">الشاشة:</span>
                    <span className="font-semibold text-slate-200 truncate block text-[11px]">
                      {item.screenSpecs}
                    </span>
                  </div>
                </div>
              </div>

              {/* Common Repair Faults */}
              <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80 mb-4">
                <span className="text-[11px] font-bold text-amber-400 block mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  أبرز الأعطال الشائعة في الورشة:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
                  {item.commonFaultsAr.map((fault, idx) => (
                    <li key={idx}>{fault}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  المخطط متوفر
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  بورد فيو مفعل
                </span>
              </div>

              <button
                onClick={() => handleLoadBoard(item)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>تحميل اللوحة لبدء الفحص</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
