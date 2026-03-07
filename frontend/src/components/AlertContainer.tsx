import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { Alert } from '../types';

interface AlertContainerProps {
  alerts: Alert[];
  onRemove: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'bg-emerald-50 border-emerald-400 text-emerald-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
  warning: 'bg-amber-50 border-amber-400 text-amber-800',
};

const iconColorMap = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

export const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, onRemove }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm">
      {alerts.map((alert) => {
        const Icon = iconMap[alert.type];
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-[slideIn_0.3s_ease-out] ${colorMap[alert.type]}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColorMap[alert.type]}`} />
            <p className="flex-1 text-sm font-medium">{alert.message}</p>
            <button
              onClick={() => onRemove(alert.id)}
              className="flex-shrink-0 p-0.5 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
