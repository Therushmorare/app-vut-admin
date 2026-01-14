import React from 'react';
import { FileText } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';
import DocumentItem from './DocumentItem';

export default function DocumentsList({ documents, onView, onDownload, onDelete }) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: COLORS.primary }} />
        <p className="text-sm text-gray-500">No documents uploaded yet</p>
        <p className="text-xs text-gray-400 mt-1">Upload your first document using the button above</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: COLORS.primary }}>
        <FileText className="w-4 h-4" />
        Uploaded Documents ({documents.length})
      </h4>
      <div className="space-y-2">
        {documents.map(doc => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onView={() => onView(doc)}
            onDownload={() => onDownload(doc)}
            onDelete={() => onDelete(doc)}
          />
        ))}
      </div>
    </div>
  );
}