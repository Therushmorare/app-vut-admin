import React from 'react';
import { Upload, Plus } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';

export default function UploadSection({ profile, onFileUpload }) {
  return (
    <div className="p-4 rounded-lg border-2 border-dashed transition-all hover:bg-gray-50" style={{ borderColor: COLORS.secondary }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.secondary + '20' }}>
            <Upload className="w-5 h-5" style={{ color: COLORS.secondary }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: COLORS.primary }}>Upload Documents</p>
            <p className="text-xs text-gray-500">PDF, Word, Excel, Images (Max 10MB each)</p>
          </div>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(e) => onFileUpload(profile, e)}
            className="hidden"
          />
          <div className="px-4 py-2 rounded-lg text-white font-semibold transition-all hover:scale-105" style={{ backgroundColor: COLORS.secondary }}>
            <Plus className="w-4 h-4 inline mr-1" />
            Choose Files
          </div>
        </label>
      </div>
    </div>
  );
}