import React from 'react';
import { COLORS } from '../../../utils/helpers';
import FileUploadSection from './FileUploadSection';

export default function ProgrammeItem({ 
  programme, 
  index, 
  progIndex,
  errors, 
  canRemove,
  onChange, 
  onRemove,
  onFileChange,
  onRemoveFile
}) {
  return (
    <div
      className="mb-6 p-6 border rounded-lg bg-gray-50"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium" style={{ color: COLORS.primary }}>
          Programme {index + 1}
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm px-3 py-1 rounded hover:bg-red-50"
            style={{ color: COLORS.danger }}
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Programme Name *
          </label>
          <input
            type="text"
            value={programme.programmeName}
            onChange={(e) => onChange('programmeName', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
            style={{ borderColor: errors[`programme_${progIndex}_name`] ? COLORS.danger : COLORS.border }}
            placeholder="e.g., Advanced Engineering Learnership"
          />
          {errors[`programme_${progIndex}_name`] && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors[`programme_${progIndex}_name`]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Required Number Of Students
          </label>
          <input
            type="number"
            value={programme.requiredNumStudents}
            onChange={(e) => onChange('requiredNumStudents', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
            style={{ borderColor: COLORS.border }}
            min="1"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Duration (months)
          </label>
          <input
            type="number"
            value={programme.programmeDuration}
            onChange={(e) => onChange('programmeDuration', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
            style={{ borderColor: COLORS.border }}
            min="1"
            placeholder="12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Budget Allocation (ZAR) *
          </label>
          <input
            type="number"
            value={programme.budgetAllocation}
            onChange={(e) => onChange('budgetAllocation', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
            style={{ borderColor: errors[`programme_${progIndex}_budget`] ? COLORS.danger : COLORS.border }}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          {errors[`programme_${progIndex}_budget`] && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors[`programme_${progIndex}_budget`]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Required Documents
          </label>
          <textarea
            rows="3"
            value={programme.requiredDocs}
            onChange={(e) => onChange('requiredDocs', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
            style={{ borderColor: COLORS.border }}
            placeholder="List required documents (one per line)..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Timesheet Template
          </label>
          <FileUploadSection
            programmeId={programme.id}
            timesheetTemplate={programme.timesheetTemplate}
            onFileChange={onFileChange}
            onRemoveFile={onRemoveFile}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Notes
          </label>
          <textarea
            rows="2"
            value={programme.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
            style={{ borderColor: COLORS.border }}
            placeholder="Add programme notes..."
          />
        </div>
      </div>
    </div>
  );
}