import React from 'react';
import { ActiveTab } from './Navbar';
import {
  Home,
  Zap,
  Layers,
  Cpu,
  FileText,
} from 'lucide-react';
import { sounds } from '../utils/audioFeedback';

interface MobileBottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Map any active sub-tab to its parent primary tab for active indicator highlighting
  const getPrimaryTab = (tab: ActiveTab): string => {
    if (tab === 'HOME') return 'HOME';
    if (
      tab === 'DIAGNOSIS' ||
      tab === 'EVIDENCE' ||
      tab === 'SMART_TEST' ||
      tab === 'REPAIR_PLAN' ||
      tab === 'REPAIR_FLOW'
    )
      return 'DIAGNOSIS';
    if (tab === 'BOARDVIEW' || tab === 'MACRO_CAMERA' || tab === 'CATALOG')
      return 'BOARDVIEW';
    if (tab === 'COMPATIBILITY' || tab === 'INVENTORY' || tab === 'PACKAGES')
      return 'COMPATIBILITY';
    if (tab === 'CASES' || tab === 'INVOICES' || tab === 'AUDIT_LOG' || tab === 'SETTINGS')
      return 'CASES';
    return 'HOME';
  };

  const primaryActive = getPrimaryTab(activeTab);

  const navItems = [
    {
      id: 'HOME' as ActiveTab,
      key: 'HOME',
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'DIAGNOSIS' as ActiveTab,
      key: 'DIAGNOSIS',
      label: 'التشخيص',
      icon: Zap,
    },
    {
      id: 'BOARDVIEW' as ActiveTab,
      key: 'BOARDVIEW',
      label: 'المخططات',
      icon: Layers,
    },
    {
      id: 'COMPATIBILITY' as ActiveTab,
      key: 'COMPATIBILITY',
      label: 'التوافق',
      icon: Cpu,
    },
    {
      id: 'CASES' as ActiveTab,
      key: 'CASES',
      label: 'الورشة',
      icon: FileText,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-1 flex items-center justify-around shrink-0 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = primaryActive === item.key;
        return (
          <button
            key={item.key}
            onClick={() => {
              sounds.playClick();
              onTabChange(item.id);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer group ${
              isActive
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 scale-110 shadow-xs shadow-amber-500/10'
                  : 'group-hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1 font-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
