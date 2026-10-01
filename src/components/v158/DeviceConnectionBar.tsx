import React, { useState } from 'react';
import { deviceAdapter } from '../../services/deviceAdapter';
import { BootMode, V158DeviceConnection } from '../../types/v158';
import {
  Usb,
  Battery,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Power,
  Cpu,
} from 'lucide-react';

interface DeviceConnectionBarProps {
  onRefresh?: () => void;
  isArabic?: boolean;
}

export const DeviceConnectionBar: React.FC<DeviceConnectionBarProps> = ({
  onRefresh,
  isArabic = true,
}) => {
  const [device, setDevice] = useState<V158DeviceConnection>(deviceAdapter.getConnection());

  const handleModeSwitch = (mode: BootMode) => {
    deviceAdapter.simulateBootModeChange(mode);
    setDevice(deviceAdapter.getConnection());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl flex items-center justify-center ${
            device.isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
          }`}
        >
          <Usb className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">
              {device.isConnected
                ? `جهاز متصل عبر USB (ADB): ${device.modelDetected}`
                : 'لا يوجد جهاز متصل حالياً عبر كابل USB'}
            </span>
            {device.isConnected && (
              <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded text-amber-400 border border-slate-800">
                SN: {device.serialNumber}
              </span>
            )}
          </div>
          {device.isConnected && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              {device.androidVersion} • بطارية: {device.batteryLevel}% • المصادقة: معتمد وموثق ✓
            </p>
          )}
        </div>
      </div>

      {/* Boot mode switcher simulator */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <span className="text-[10px] text-slate-500 px-1 font-bold">الوضع:</span>
        {(['NORMAL', 'FASTBOOT', 'RECOVERY', 'EDL_9008'] as BootMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeSwitch(mode)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              device.bootMode === mode
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};
