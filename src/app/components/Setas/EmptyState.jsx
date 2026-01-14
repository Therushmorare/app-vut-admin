import React from 'react';
import { FileText, Building2, DollarSign } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

const icons = {
  FileText,
  Building2,
  DollarSign
};

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  const Icon = icons[icon] || FileText;
  
  return (
    <div className="rounded-lg p-12 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
      <Icon className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
      <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
        {title}
      </h3>
      <p className="text-gray-600 mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
          style={{ backgroundColor: COLORS.text }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}