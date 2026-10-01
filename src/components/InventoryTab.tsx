import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import { BOARDS_CATALOG } from '../data/boards';
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Plus,
  Minus,
  Filter,
  Check,
  Building,
} from 'lucide-react';

interface InventoryTabProps {
  inventory: InventoryItem[];
  onUpdateStock: (sku: string, delta: number) => void;
  selectedBoardCode?: string;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  onUpdateStock,
  selectedBoardCode,
}) => {
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [filterBySelectedBoard, setFilterBySelectedBoard] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        !search ||
        item.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.compatibleModels.some((m) => m.toLowerCase().includes(search.toLowerCase()));

      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;

      const matchBoard =
        !filterBySelectedBoard ||
        !selectedBoardCode ||
        item.compatibleBoards.some(
          (b) => b.toLowerCase() === selectedBoardCode.toLowerCase()
        );

      return matchSearch && matchCat && matchBoard;
    });
  }, [inventory, search, categoryFilter, filterBySelectedBoard, selectedBoardCode]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-100">
              مخزون قطع غيار الورشة ومحرك التوافق
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            إدارة القطع الإلكترونية، الشاشات، الآيسيهات والكونكترات مع فحص التوافق الهندسي مع اللوحة
          </p>
        </div>

        {/* Filter by Active Board Toggle */}
        {selectedBoardCode && (
          <button
            onClick={() => setFilterBySelectedBoard((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              filterBySelectedBoard
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>عرض المتوافق مع اللوحة الحالية ({selectedBoardCode}) فقط</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، كود SKU، أو طراز الهاتف..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'IC', 'PASSIVE', 'SCREEN', 'CONNECTOR', 'FPC'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'الكل'
                : cat === 'IC'
                ? 'دوائر متكاملة IC'
                : cat === 'PASSIVE'
                ? 'مكثفات ودايودات'
                : cat === 'SCREEN'
                ? 'شاشات أصلية'
                : cat === 'CONNECTOR'
                ? 'كونكترات'
                : 'فلكسات'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLowStock = item.stockQty <= item.minAlertQty;
          const isCompatibleWithActive = selectedBoardCode
            ? item.compatibleBoards.some((b) => b.toLowerCase() === selectedBoardCode.toLowerCase())
            : false;

          return (
            <div
              key={item.sku}
              className={`bg-slate-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all ${
                isCompatibleWithActive
                  ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* SKU Badge & Stock Status */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {item.sku}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCompatibleWithActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        متطابق 100%
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isLowStock
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.stockQty} قطعة
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-1 leading-snug">
                  {item.nameAr}
                </h4>
                <span className="text-[11px] font-mono text-slate-500 block mb-3">
                  {item.nameEn}
                </span>

                {/* Compatibility tags */}
                <div className="space-y-1.5 mb-3 text-[11px]">
                  <div className="text-slate-400">
                    <span>الهواتف المتوافقة: </span>
                    <span className="text-slate-300 font-semibold">
                      {item.compatibleModels.join(' • ')}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    <span>اللوحات المدعومة: </span>
                    <span className="text-amber-400/90 font-mono">
                      {item.compatibleBoards.join(', ')}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    <span>موقع التخزين: </span>
                    <span className="text-slate-300">{item.locationBin}</span>
                  </div>
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">السعر للقطعة</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {item.unitPriceSAR} ر.س
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => onUpdateStock(item.sku, -1)}
                    disabled={item.stockQty <= 0}
                    title="صرف قطعة (منع الرصيد السالب)"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-bold text-slate-200 min-w-6 text-center">
                    {item.stockQty}
                  </span>
                  <button
                    onClick={() => onUpdateStock(item.sku, 1)}
                    title="إضافة رصيد للمخزون"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
