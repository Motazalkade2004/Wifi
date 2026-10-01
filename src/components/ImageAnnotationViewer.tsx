import React, { useState, useRef, useEffect } from 'react';
import { AnnotationItem } from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Square,
  ArrowUpRight,
  Circle,
  Type,
  RotateCcw,
  Download,
  Info,
  PenTool,
} from 'lucide-react';

interface ImageAnnotationViewerProps {
  imageUrl: string;
  componentRef?: string;
  onSaveAnnotation?: (annotations: AnnotationItem[]) => void;
}

export const ImageAnnotationViewer: React.FC<ImageAnnotationViewerProps> = ({
  imageUrl,
  componentRef = 'C2150',
  onSaveAnnotation,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [activeTool, setActiveTool] = useState<'PAN' | 'RECT' | 'ARROW' | 'CIRCLE'>('RECT');
  const [drawColor, setDrawColor] = useState<string>('#f59e0b'); // Amber default
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([
    {
      id: 'ann-1',
      type: 'RECT',
      startX: 280,
      startY: 160,
      endX: 380,
      endY: 240,
      label: `${componentRef} (منطقة الهدف)`,
      color: '#f59e0b',
    },
  ]);

  const [currentDraw, setCurrentDraw] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'PAN') {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - pan.x) / zoom;
      const clickY = (e.clientY - rect.top - pan.y) / zoom;
      setCurrentDraw({ startX: clickX, startY: clickY, endX: clickX, endY: clickY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning && activeTool === 'PAN') {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (currentDraw) {
      const rect = e.currentTarget.getBoundingClientRect();
      const curX = (e.clientX - rect.left - pan.x) / zoom;
      const curY = (e.clientY - rect.top - pan.y) / zoom;
      setCurrentDraw((prev) => (prev ? { ...prev, endX: curX, endY: curY } : null));
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    } else if (currentDraw) {
      const newAnn: AnnotationItem = {
        id: `ann-${Date.now()}`,
        type: activeTool === 'ARROW' ? 'ARROW' : activeTool === 'CIRCLE' ? 'CIRCLE' : 'RECT',
        startX: Math.min(currentDraw.startX, currentDraw.endX),
        startY: Math.min(currentDraw.startY, currentDraw.endY),
        endX: Math.max(currentDraw.startX, currentDraw.endX),
        endY: Math.max(currentDraw.startY, currentDraw.endY),
        color: drawColor,
        label: `فحص يدوي ${annotations.length + 1}`,
      };
      setAnnotations((prev) => [...prev, newAnn]);
      setCurrentDraw(null);
      if (onSaveAnnotation) onSaveAnnotation([...annotations, newAnn]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header & Tools Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-amber-500" />
            <span>معاينة وتكبير الصورة والتعليق اليدوي (Image Annotation Viewer)</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            تكبير عالي الدقة ورسم لتحديد مواضع الخلل (يستخدم للمراجعة البصرية وتوثيق العطل)
          </p>
        </div>

        {/* Annotation Tool Selection */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool('PAN')}
            title="تحريك وسحب الصورة (Pan)"
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTool === 'PAN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('RECT')}
            title="رسم مربع تحديد (Rectangle)"
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTool === 'RECT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('ARROW')}
            title="رسم سهم إشارة (Arrow)"
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTool === 'ARROW' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('CIRCLE')}
            title="رسم دائرة تركيز (Circle)"
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTool === 'CIRCLE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {['#f59e0b', '#ef4444', '#10b981', '#06b6d4'].map((c) => (
            <button
              key={c}
              onClick={() => setDrawColor(c)}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                drawColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70'
              }`}
            />
          ))}
          <button
            onClick={() => setAnnotations([])}
            title="مسح التعليقات"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs mr-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Annotation Interactive Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative w-full h-96 bg-black rounded-2xl overflow-hidden flex items-center justify-center select-none ${
          activeTool === 'PAN' ? 'cursor-grab' : 'cursor-crosshair'
        }`}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          className="relative transition-transform duration-75"
        >
          {/* Main Board Image */}
          <img
            src={imageUrl}
            alt="Board Macro View"
            className="max-w-none w-[640px] h-[360px] object-cover rounded-xl pointer-events-none"
          />

          {/* Rendered Annotations */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {annotations.map((ann) => {
              const w = (ann.endX ?? ann.startX + 40) - ann.startX;
              const h = (ann.endY ?? ann.startY + 30) - ann.startY;
              return (
                <g key={ann.id}>
                  {ann.type === 'RECT' && (
                    <rect
                      x={ann.startX}
                      y={ann.startY}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={ann.color}
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                      rx="4"
                    />
                  )}
                  {ann.type === 'CIRCLE' && (
                    <ellipse
                      cx={ann.startX + w / 2}
                      cy={ann.startY + h / 2}
                      rx={Math.abs(w / 2)}
                      ry={Math.abs(h / 2)}
                      fill="none"
                      stroke={ann.color}
                      strokeWidth="2.5"
                    />
                  )}
                  {ann.type === 'ARROW' && (
                    <line
                      x1={ann.startX}
                      y1={ann.startY}
                      x2={ann.endX}
                      y2={ann.endY}
                      stroke={ann.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}
                  {ann.label && (
                    <text
                      x={ann.startX + 4}
                      y={ann.startY - 6}
                      fill={ann.color}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {ann.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Currently Dragged Annotation Box */}
            {currentDraw && (
              <rect
                x={Math.min(currentDraw.startX, currentDraw.endX)}
                y={Math.min(currentDraw.startY, currentDraw.endY)}
                width={Math.abs(currentDraw.endX - currentDraw.startX)}
                height={Math.abs(currentDraw.endY - currentDraw.startY)}
                fill="none"
                stroke={drawColor}
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            )}
          </svg>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute left-3 bottom-3 flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 z-10 backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3.5))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1.5 text-slate-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.6))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded border-r border-slate-800"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Engineering Note from Report Section 2.7 */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          ملاحظة هندسية (التقرير - البند 2.7): الرسم والتعليق اليدوي يساعد الفني على التوثيق البصري وتحديد المناطق المشبوهة، لكنه لا يُعتمد وحده كإحداثيات Boardview هندسية ما لم يتم التحقق منه عبر مصفوفة المعايرة المرجعية للوحة.
        </p>
      </div>
    </div>
  );
};
