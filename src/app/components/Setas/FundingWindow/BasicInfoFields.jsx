import React from 'react';
import { COLORS } from '../../../utils/helpers';

export default function BasicInfoFields({ formData, errors, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Funding Window Name *
        </label>
        <input
          type="text"
          value={formData.windowName}
          onChange={(e) => onChange('windowName', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.windowName ? COLORS.danger : COLORS.border }}
          placeholder="e.g., Q1 2025 Intake"
        />
        {errors.windowName && (
          <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
            {errors.windowName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Contract Start Date *
        </label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.startDate ? COLORS.danger : COLORS.border }}
        />
        {errors.startDate && (
          <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
            {errors.startDate}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Contract End Date *
        </label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.endDate ? COLORS.danger : COLORS.border }}
        />
        {errors.endDate && (
          <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
            {errors.endDate}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Number of Learners *
        </label>
        <input
          type="number"
          value={formData.numLearners}
          onChange={(e) => onChange('numLearners', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.numLearners ? COLORS.danger : COLORS.border }}
          min="1"
        />
        {errors.numLearners && (
          <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
            {errors.numLearners}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Financial Year
        </label>
        <input
          type="text"
          value={formData.financialYear}
          onChange={(e) => onChange('financialYear', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: COLORS.border }}
          placeholder="e.g., 2024/2025"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Slots Available *
        </label>
        <input
          type="number"
          value={formData.slotsAvailable}
          onChange={(e) => onChange('slotsAvailable', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.slotsAvailable ? COLORS.danger : COLORS.border }}
          min="1"
        />
        {errors.slotsAvailable && (
          <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
            {errors.slotsAvailable}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Budget Allocation (ZAR) *
        </label>
        <input
          type="number"
          value={formData.budgetAllocation}
          onChange={(e) => onChange('budgetAllocation', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.budgetAllocation ? COLORS.danger : COLORS.border }}
          min="0"
          step="0.01"
        />
        {errors.budgetAllocation && (
          <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
            {errors.budgetAllocation}
          </p>
        )}
      </div>
    </div>
  );
}