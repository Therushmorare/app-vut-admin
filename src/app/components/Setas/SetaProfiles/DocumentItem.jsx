import React from 'react';
import { FileText, Eye, Download, X } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';

export default function DocumentItem({ document, onView, onDownload, onDelete }) {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-[1.02]"
      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgLight }}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.info + '20' }}>
          <FileText className="w-5 h-5" style={{ color: COLORS.info }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: COLORS.primary }}>
            {document.name}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }}></span>
              {document.size}
            </span>
            <span>•</span>
            <span>{document.type}</span>
            <span>•</span>
            <span>Uploaded {document.uploadDate}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: COLORS.info + '20', color: COLORS.info }}
          title="View Document"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={onDownload}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: COLORS.success + '20', color: COLORS.success }}
          title="Download Document"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: COLORS.danger + '20', color: COLORS.danger }}
          title="Delete Document"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}