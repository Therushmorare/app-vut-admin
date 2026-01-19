import React from 'react';
import { Upload, X } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';

export default function FileUploadSection({ 
  programmeId, 
  timesheetTemplate, 
  onFileChange, 
  onRemoveFile 
}) {
  if (timesheetTemplate) {
    return (
      <div className="border rounded-lg p-4 bg-white" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#e0f2fe' }}
            >
              <Upload className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {timesheetTemplate.name}
              </p>
              <p className="text-xs text-gray-500">
                {(timesheetTemplate.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          {/* Pass programmeId here */}
          <button
            type="button"
            onClick={() => onRemoveFile(programmeId)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            style={{ color: COLORS.danger }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed rounded-lg p-6 bg-white text-center"
      style={{ borderColor: COLORS.border }}
    >
      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: COLORS.text }} />
      <p className="text-sm text-gray-600 mb-1">
        Upload timesheet template
      </p>
      <p className="text-xs text-gray-500 mb-3">
        Excel, PDF, or Word documents
      </p>

      <input
        type="file"
        accept=".xlsx,.xls,.pdf,.docx,.doc"
        className="hidden"
        id={`file-upload-${programmeId}`}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(programmeId, file); //pass programmeId
        }}
      />

      <button
        type="button"
        onClick={() => {
          const input = document.getElementById(`file-upload-${programmeId}`);
          if (input) input.click();
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
        style={{ backgroundColor: COLORS.primary }}
      >
        Choose File
      </button>
    </div>
  );
}