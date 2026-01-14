import React from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: COLORS.primary }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}