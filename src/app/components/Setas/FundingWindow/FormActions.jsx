import React from 'react';
import { COLORS } from '../../../utils/helpers';

export default function FormActions({ 
  isEditMode, 
  onCancel, 
  onSubmit 
}) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50"
        style={{ borderColor: COLORS.border, color: COLORS.primary }}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
        style={{ backgroundColor: COLORS.success }}
      >
        {isEditMode ? 'Update Window' : 'Create Funding Window'}
      </button>
    </div>
  );
}