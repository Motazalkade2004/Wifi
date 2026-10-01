import React, { useState } from 'react';
import { BoardData, BoardSide, ComponentItem, QualityGateResult } from '../types';
import { BoardviewCanvas } from './BoardviewCanvas';
import { MacroCameraView } from './MacroCameraView';
import { ImageAnnotationViewer } from './ImageAnnotationViewer';
import { PhoneCatalogView } from './PhoneCatalogView';
import { Layers, Camera, PenTool, Smartphone } from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

export type SchematicsSubTab = 'BOARDVIEW' | 'MACRO_CAMERA' | 'ANNOTATION' | 'CATALOG';

interface SchematicsHubProps {
  board: BoardData;
  activeSide: BoardSide;
  onSideChange: (side: BoardSide) => void;
  selectedComponent: ComponentItem;
  onSelectComponent: (comp: ComponentItem) => void;
  onSelectBoard: (board: BoardData) => void;
  onCaptureApproved: (img: string, quality: QualityGateResult) => void;
  initialSubTab?: SchematicsSubTab;
}

export const SchematicsHub: React.FC<SchematicsHubProps> = ({
  board,
  activeSide,
  onSideChange,
  selectedComponent,
  onSelectComponent,
  onSelectBoard,
  onCaptureApproved,
  initialSubTab = 'BOARDVIEW',
}) => {
  const [subTab, setSubTab] = useState<SchematicsSubTab>(initialSubTab);

  const subTabs = [
    {
      id: 'BOARDVIEW' as SchematicsSubTab,
      label: 'خريطة البورد فيو',
      icon: Layers,
    },
    {
      id: 'MACRO_CAMERA' as SchematicsSubTab,
      label: 'كاميرا الماكرو وبوابة الجودة',
      icon: Camera,
    },
    {
      id: 'ANNOTATION' as SchematicsSubTab,
      label: 'الميكروسكوب والتأشير',
      icon: PenTool,
    },
    {
      id: 'CATALOG' as SchematicsSubTab,
      label: 'كتالوج الهواتف والمواصفات',
      icon: Smartphone,
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
        {subTab === 'BOARDVIEW' && (
          <div className="h-[750px] w-full">
            <BoardviewCanvas
              board={board}
              activeSide={activeSide}
              onSideChange={onSideChange}
              selectedComponentRef={selectedComponent.ref}
              onSelectComponent={onSelectComponent}
            />
          </div>
        )}

        {subTab === 'MACRO_CAMERA' && (
          <MacroCameraView
            board={board}
            targetComponent={selectedComponent}
            onCaptureApproved={onCaptureApproved}
            onBack={() => setSubTab('BOARDVIEW')}
          />
        )}

        {subTab === 'ANNOTATION' && (
          <div className="h-[700px] w-full">
            <ImageAnnotationViewer
              imageUrl="/sample_board_macro.jpg"
              componentRef={selectedComponent.ref}
            />
          </div>
        )}

        {subTab === 'CATALOG' && (
          <PhoneCatalogView
            onSelectBoard={onSelectBoard}
          />
        )}
      </div>
    </div>
  );
};
