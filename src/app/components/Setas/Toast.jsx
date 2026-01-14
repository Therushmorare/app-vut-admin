import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: COLORS.success, icon: CheckCircle },
    error: { bg: COLORS.danger, icon: XCircle },
    info: { bg: COLORS.info, icon: Info }
  };

  const { bg, icon: Icon } = config[type] || config.success;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div 
        className="flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-5 h-5" />
        <p className="font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="ml-2 hover:opacity-80"
        >
          ×
        </button>
      </div>
    </div>
  );
}