"use client";
import React from 'react';
import { COLORS } from '../utils/helpers';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
        <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.primary }}>{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border font-medium hover:bg-gray-50"
            style={{ borderColor: COLORS.border, color: COLORS.primary }}
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
  );
};

export default ConfirmDialog;