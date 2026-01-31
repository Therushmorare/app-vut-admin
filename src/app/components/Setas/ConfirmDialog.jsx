import React from 'react';
import { AlertCircle } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full" style={{ backgroundColor: COLORS.danger + '20' }}>
              <AlertCircle className="w-6 h-6" style={{ color: COLORS.danger }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
              {title}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border font-medium hover:bg-gray-50"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90"
              style={{ backgroundColor: COLORS.danger }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}