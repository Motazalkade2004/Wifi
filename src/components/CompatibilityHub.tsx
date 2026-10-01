import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { CompatibilityCenterView } from './v158/CompatibilityCenterView';
import { InventoryTab } from './InventoryTab';
import { PackageRegistryView } from './v158/PackageRegistryView';
import { Cpu, Package, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

export type CompatibilitySubTab = 'CROSS_REF' | 'INVENTORY' | 'PACKAGES';

interface CompatibilityHubProps {
  currentBoardCode: string;
  currentModel: string;
  inventory: InventoryItem[];
  onUpdateStock: (sku: string, delta: number) => void;
  initialSubTab?: CompatibilitySubTab;
}

export const CompatibilityHub: React.FC<CompatibilityHubProps> = ({
  currentBoardCode,
  currentModel,
  inventory,
  onUpdateStock,
  initialSubTab = 'CROSS_REF',
}) => {
  const [subTab, setSubTab] = useState<CompatibilitySubTab>(initialSubTab);

  const subTabs = [
    {
      id: 'CROSS_REF' as CompatibilitySubTab,
      label: 'بنك بدائل وتوافق الآيسيات',
      icon: Cpu,
    },
    {
      id: 'INVENTORY' as CompatibilitySubTab,
      label: 'مخزون قطع الغيار والـ SKU',
      icon: Package,
    },
    {
      id: 'PACKAGES' as CompatibilitySubTab,
      label: 'حزم اللوحات والأمان (SHA-256)',
      icon: ShieldCheck,
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
        {subTab === 'CROSS_REF' && (
          <CompatibilityCenterView
            currentBoardCode={currentBoardCode}
            currentModel={currentModel}
          />
        )}

        {subTab === 'INVENTORY' && (
          <InventoryTab
            inventory={inventory}
            onUpdateStock={onUpdateStock}
            selectedBoardCode={currentBoardCode}
          />
        )}

        {subTab === 'PACKAGES' && (
          <PackageRegistryView />
        )}
      </div>
    </div>
  );
};
