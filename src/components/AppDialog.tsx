import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export type DialogType = 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';

export interface AppDialogOptions {
  title: string;
  message: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AppDialogProps {
  isOpen: boolean;
  options: AppDialogOptions | null;
  onClose: () => void;
}

export const AppDialog: React.FC<AppDialogProps> = ({ isOpen, options, onClose }) => {
  if (!isOpen || !options) return null;

  const type = options.type || 'INFO';

  const getIcon = () => {
    switch (type) {
      case 'DANGER':
        return <XCircle className="w-6 h-6 text-rose-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      case 'INFO':
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'DANGER':
        return 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25';
      case 'WARNING':
        return 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25';
      case 'SUCCESS':
        return 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25';
      case 'INFO':
      default:
        return 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/25';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 shrink-0">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{options.title}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
              {options.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80">
          {options.cancelLabel && (
            <button
              onClick={() => {
                if (options.onCancel) options.onCancel();
                onClose();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {options.cancelLabel}
            </button>
          )}

          <button
            onClick={() => {
              if (options.onConfirm) options.onConfirm();
              onClose();
            }}
            className={`px-5 py-2 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer ${getButtonColor()}`}
          >
            {options.confirmLabel || 'موافق'}
          </button>
        </div>
      </div>
    </div>
  );
};
