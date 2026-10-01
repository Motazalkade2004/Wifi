import React, { useState, useRef, useMemo } from 'react';
import { BoardData, BoardSide, ComponentItem, ComponentType } from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Search,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Compass,
} from 'lucide-react';

interface BoardviewCanvasProps {
  board: BoardData;
  activeSide: BoardSide;
  onSideChange: (side: BoardSide) => void;
  selectedComponentRef?: string;
  onSelectComponent: (comp: ComponentItem) => void;
  highlightedRegionId?: string;
  redProbePosition?: string;
  blackProbePosition?: string;
  showTileMagnifier?: boolean;
}

export const BoardviewCanvas: React.FC<BoardviewCanvasProps> = ({
  board,
  activeSide,
  onSideChange,
  selectedComponentRef,
  onSelectComponent,
  highlightedRegionId,
  redProbePosition,
  blackProbePosition,
  showTileMagnifier = true,
}) => {
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<ComponentType | 'ALL'>('ALL');
  const [showRegions, setShowRegions] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter components for currently viewed side
  const sideComponents = useMemo(() => {
    return board.components.filter((c) => {
      const matchSide = c.side === activeSide;
      const matchFilter = filterType === 'ALL' || c.type === filterType;
      const matchSearch =
        !searchQuery ||
        c.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.net.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSide && matchFilter && matchSearch;
    });
  }, [board.components, activeSide, filterType, searchQuery]);

  const activeRegions = useMemo(() => {
    return board.regions.filter((r) => r.side === activeSide);
  }, [board.regions, activeSide]);

  const activeFiducials = useMemo(() => {
    return board.fiducials.filter((f) => f.side === activeSide);
  }, [board.fiducials, activeSide]);

  const selectedComp = useMemo(() => {
    return board.components.find((c) => c.ref === selectedComponentRef);
  }, [board.components, selectedComponentRef]);

  // Coordinate scaling to SVG viewBox (100mm -> 1000px coordinate system)
  const svgWidth = board.dimensions.widthMm * 10;
  const svgHeight = board.dimensions.heightMm * 10;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.6), 4.5));
  };

  const handleResetView = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
  };

  const handleFocusComponent = (comp: ComponentItem) => {
    onSelectComponent(comp);
    // Center view on this component
    const centerX = (board.dimensions.widthMm / 2 - comp.xMm) * 8 * zoom;
    const centerY = (board.dimensions.heightMm / 2 - comp.yMm) * 8 * zoom;
    setPan({ x: centerX, y: centerY });
  };

  const getComponentColor = (type: ComponentType, isSelected: boolean) => {
    if (isSelected) return '#fbbf24'; // Bright Amber
    switch (type) {
      case 'IC':
        return '#334155'; // Dark Slate
      case 'CAPACITOR':
        return '#b45309'; // Ceramic Brown / Terracotta
      case 'RESISTOR':
        return '#1e293b'; // Charcoal
      case 'INDUCTOR':
        return '#475569'; // Ferrite Grey
      case 'DIODE':
        return '#dc2626'; // Red
      case 'CONNECTOR':
        return '#0284c7'; // Cyan Header
      case 'TESTPOINT':
        return '#eab308'; // Gold Pad
      default:
        return '#64748b';
    }
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col select-none">
      {/* Top Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md z-20">
        {/* Side switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSideChange('TOP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSide === 'TOP'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الوجه العلوي (TOP)
          </button>
          <button
            onClick={() => onSideChange('BOTTOM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSide === 'BOTTOM'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الوجه السفلي (BOTTOM)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مكوّن (C2150, U2000, L2001)..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2.5 text-xs text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* Component Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-sm scrollbar-none py-0.5">
          {(['ALL', 'IC', 'CAPACITOR', 'RESISTOR', 'INDUCTOR', 'TESTPOINT'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                filterType === cat
                  ? 'bg-slate-700 text-amber-400 border border-slate-600'
                  : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat === 'ALL'
                ? 'الكل'
                : cat === 'IC'
                ? 'دوائر IC'
                : cat === 'CAPACITOR'
                ? 'مكثفات C'
                : cat === 'RESISTOR'
                ? 'مقاومات R'
                : cat === 'INDUCTOR'
                ? 'ملفات L'
                : 'نقاط TP'}
            </button>
          ))}
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowRegions((prev) => !prev)}
            title="إظهار/إخفاء المناطق الوظيفية"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
              showRegions
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">المناطق</span>
          </button>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 4.0))}
              title="تكبير"
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-400 min-w-9 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.6))}
              title="تصغير"
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              title="إعادة ضبط الرؤية"
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded border-r border-slate-800"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Boardview Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className={`relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(51, 65, 85, 0.25) 1px, transparent 0)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.12s ease-out',
          }}
          className="relative transition-transform duration-75"
        >
          {/* SVG Board Rendering */}
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="drop-shadow-2xl overflow-visible"
          >
            <defs>
              {/* Copper Ground Hatch Pattern */}
              <pattern id="pcbCopperHatch" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#047857" strokeWidth="0.8" opacity="0.4" />
              </pattern>
              {/* Gold Pad Hatch */}
              <pattern id="goldPad" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#eab308" />
                <circle cx="2" cy="2" r="0.8" fill="#ca8a04" />
              </pattern>
              {/* Glowing Pulse for Selected Component */}
              <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* PCB Substrate Outer Boundary with Silk Border */}
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              rx="24"
              ry="24"
              fill="#064e3b" // Realistic dark emerald solder mask
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Copper Ground Fill Layer */}
            <rect
              x="6"
              y="6"
              width={svgWidth - 12}
              height={svgHeight - 12}
              rx="20"
              ry="20"
              fill="url(#pcbCopperHatch)"
            />

            {/* Board Code Silkscreen Label */}
            <text
              x={svgWidth / 2}
              y="22"
              fill="#ecfdf5"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="2"
              textAnchor="middle"
              opacity="0.85"
            >
              {board.boardCode} [{activeSide}] — REV {board.boardRevision}
            </text>

            {/* Fiducials & Screw Holes */}
            {activeFiducials.map((fid) => (
              <g key={fid.id} transform={`translate(${fid.xMm * 10}, ${fid.yMm * 10})`}>
                <circle r={((fid.radiusMm || 1.5) * 10) + 4} fill="#0f172a" opacity="0.6" />
                <circle r={(fid.radiusMm || 1.5) * 10} fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                <circle r={((fid.radiusMm || 1.5) * 10) - 4} fill="#020617" />
                <text
                  x="0"
                  y={(fid.radiusMm || 1.5) * 10 + 12}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {fid.id}
                </text>
              </g>
            ))}

            {/* Functional Regions Highlights */}
            {showRegions &&
              activeRegions.map((region) => {
                const isRegionActive = highlightedRegionId === region.id;
                return (
                  <g key={region.id}>
                    <rect
                      x={region.bounds.xMm * 10}
                      y={region.bounds.yMm * 10}
                      width={region.bounds.widthMm * 10}
                      height={region.bounds.heightMm * 10}
                      rx="10"
                      fill={region.color}
                      fillOpacity={isRegionActive ? 0.22 : 0.1}
                      stroke={region.color}
                      strokeWidth={isRegionActive ? 2.5 : 1.2}
                      strokeDasharray={isRegionActive ? '6,3' : '4,4'}
                    />
                    <text
                      x={region.bounds.xMm * 10 + 8}
                      y={region.bounds.yMm * 10 + 16}
                      fill={region.color}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {region.nameAr}
                    </text>
                  </g>
                );
              })}

            {/* Components Rendering */}
            {sideComponents.map((comp) => {
              const isSelected = selectedComponentRef === comp.ref;
              const cx = comp.xMm * 10;
              const cy = comp.yMm * 10;
              const cw = Math.max(comp.widthMm * 10, 8);
              const ch = Math.max(comp.heightMm * 10, 6);
              const compColor = getComponentColor(comp.type, isSelected);

              return (
                <g
                  key={comp.ref}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFocusComponent(comp);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Solder Pads on both sides for passives */}
                  {(comp.type === 'CAPACITOR' || comp.type === 'RESISTOR' || comp.type === 'DIODE') && (
                    <>
                      <rect
                        x={cx - 1}
                        y={cy}
                        width={3}
                        height={ch}
                        fill="#e2e8f0"
                        stroke="#64748b"
                        strokeWidth="0.5"
                      />
                      <rect
                        x={cx + cw - 2}
                        y={cy}
                        width={3}
                        height={ch}
                        fill="#e2e8f0"
                        stroke="#64748b"
                        strokeWidth="0.5"
                      />
                    </>
                  )}

                  {/* Component Main Body */}
                  <rect
                    x={cx}
                    y={cy}
                    width={cw}
                    height={ch}
                    rx={comp.type === 'IC' ? 3 : 1}
                    fill={compColor}
                    stroke={isSelected ? '#f59e0b' : '#1e293b'}
                    strokeWidth={isSelected ? 2.5 : 0.8}
                    filter={isSelected ? 'url(#glowEffect)' : undefined}
                    className="transition-all"
                  />

                  {/* Pin 1 dot for ICs */}
                  {comp.type === 'IC' && comp.pin1Position && (
                    <circle
                      cx={comp.pin1Position.includes('RIGHT') ? cx + cw - 4 : cx + 4}
                      cy={comp.pin1Position.includes('BOTTOM') ? cy + ch - 4 : cy + 4}
                      r="1.8"
                      fill="#f8fafc"
                      opacity="0.9"
                    />
                  )}

                  {/* Component Designator Label */}
                  {((comp.type === 'IC' || comp.type === 'CONNECTOR' || comp.widthMm >= 1.2 || zoom >= 1.4) || isSelected) && (
                    <text
                      x={cx + cw / 2}
                      y={cy + ch / 2 + 3}
                      fill={isSelected ? '#020617' : comp.type === 'CAPACITOR' ? '#fef08a' : '#f8fafc'}
                      fontSize={Math.max(ch * 0.45, 7)}
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {comp.ref}
                    </text>
                  )}

                  {/* Selection Indicator Ring */}
                  {isSelected && (
                    <circle
                      cx={cx + cw / 2}
                      cy={cy + ch / 2}
                      r={Math.max(cw, ch) * 0.9}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,3"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}
                </g>
              );
            })}

            {/* Probe Placement Markers when selected */}
            {selectedComp && (
              <g transform={`translate(${selectedComp.xMm * 10}, ${selectedComp.yMm * 10})`}>
                {/* Red Probe (+) Indicator */}
                <g transform="translate(-16, -16)">
                  <circle r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="2" filter="url(#glowEffect)" />
                  <path d="M-4 0 h8 M0 -4 v8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <text x="14" y="4" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    الطرف الأحمر (+)
                  </text>
                </g>
                {/* Black Probe (-) Indicator at nearest ground */}
                <g transform="translate(36, 26)">
                  <circle r="10" fill="#0f172a" stroke="#ffffff" strokeWidth="2" filter="url(#glowEffect)" />
                  <path d="M-4 0 h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <text x="14" y="4" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    الطرف الأسود (GND)
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Real-time Millimeter Grid Overlay in Corner */}
        <div className="absolute left-4 bottom-4 bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-xl p-2.5 text-[11px] font-mono text-slate-300 flex items-center gap-3 z-10">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>{board.dimensions.widthMm} × {board.dimensions.heightMm} mm</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>قطع الوجه: {sideComponents.length}</div>
          <span className="text-slate-600">|</span>
          <div className="text-emerald-400">المعايرة: نشطة (0.1mm)</div>
        </div>

        {/* Selected Component Quick Action Card */}
        {selectedComp && (
          <div className="absolute right-4 bottom-4 w-80 bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-10 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                    {selectedComp.ref}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{selectedComp.type}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mt-1">{selectedComp.nameAr}</h4>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                {selectedComp.side}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">القيمة / الباكدج:</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedComp.value}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">المسار (Net):</span>
                <span className="font-mono text-amber-400 font-semibold truncate block">
                  {selectedComp.net}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">الإحداثيات الحقيقية:</span>
                <span className="font-mono text-slate-300">
                  X:{selectedComp.xMm}mm Y:{selectedComp.yMm}mm
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">أبعاد القطعة:</span>
                <span className="font-mono text-slate-300">
                  {selectedComp.widthMm}×{selectedComp.heightMm}mm
                </span>
              </div>
            </div>

            {selectedComp.description && (
              <p className="text-[11px] text-slate-400 mb-3 bg-slate-950/40 p-2 rounded-lg border border-slate-800/40 leading-relaxed">
                {selectedComp.description}
              </p>
            )}

            <button
              onClick={() => onSelectComponent(selectedComp)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>بدء القياس وفحص هذا المكوّن</span>
            </button>
          </div>
        )}

        {/* Section 5.5 Overlapping Tile Zoom System (نظام تقطيع المناطق المكبرة) */}
        {showTileMagnifier && selectedComp && (
          <div className="absolute left-4 top-4 w-52 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md z-10 hidden md:block">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5 px-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Eye className="w-3.5 h-3.5" />
                سياق المكوّنات المجاورة (Tile)
              </span>
              <span className="font-mono text-[10px] text-slate-500">4X Macro</span>
            </div>
            {/* Magnified Tile Preview */}
            <div className="w-full h-32 bg-emerald-950/90 border border-emerald-800/50 rounded-xl overflow-hidden relative flex items-center justify-center">
              {/* Contextual neighbors */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-28 h-20 border border-amber-500/40 rounded bg-emerald-900/40 flex items-center justify-center">
                  <div className="w-8 h-4 bg-amber-500 border border-slate-950 rounded-sm flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-[9px] font-mono font-black text-slate-950">
                      {selectedComp.ref}
                    </span>
                  </div>
                  {/* Neighboring simulated passive elements so tech doesn't confuse with adjacent */}
                  <div className="absolute top-1 left-2 w-3 h-2 bg-slate-700 rounded-xs opacity-75" />
                  <div className="absolute bottom-1 right-2 w-4 h-2 bg-amber-800 rounded-xs opacity-75" />
                  <div className="absolute top-1 right-3 w-5 h-2 bg-slate-800 rounded-xs opacity-75" />
                </div>
              </div>
              {/* Crosshair guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-[0.5px] bg-amber-400/30" />
                <div className="h-full w-[0.5px] bg-amber-400/30 absolute" />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
              يعرض المكوّن وسياقه المحيط بدقة لمنع الخلط بين قطعتين متجاورتين.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
