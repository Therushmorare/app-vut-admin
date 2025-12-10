"use client"

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { COLORS } from '../utils/helpers';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? COLORS.success : type === 'error' ? COLORS.danger : COLORS.info;

  return (
    <div 
      className="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 animate-slide-in"
      style={{ backgroundColor: bgColor }}
    >
      {type === 'success' && <CheckCircle className="w-5 h-5" />}
      {type === 'error' && <XCircle className="w-5 h-5" />}
      {type === 'info' && <AlertCircle className="w-5 h-5" />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-75">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;