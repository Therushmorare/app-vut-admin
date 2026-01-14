import React from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';
import UploadSection from './UploadSection';
import DocumentsList from './DocumentsList';
import ActivityLogs from './ActivityLogs';

export default function DocumentsSection({
  profile,
  documents,
  stats,
  isExpanded,
  onToggle,
  onFileUpload,
  onViewDocument,
  onDownloadDocument,
  onDeleteDocument,
  logs,
  logFilter,
  setLogFilter,
  logDateFilter,
  setLogDateFilter,
  onExportLogs,
  getActionIcon,
  getActionColor
}) {
  return (
    <div className="border-t-2 pt-4" style={{ borderColor: COLORS.border }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md"
        style={{ backgroundColor: COLORS.primary + '10' }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: COLORS.primary }}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: COLORS.primary }}>
              Documents & Activity
            </p>
            <p className="text-xs text-gray-500">
              {documents.length} documents • {stats.total} activities
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" style={{ color: COLORS.primary }} />
        ) : (
          <ChevronDown className="w-5 h-5" style={{ color: COLORS.primary }} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <UploadSection profile={profile} onFileUpload={onFileUpload} />
          
          <DocumentsList
            documents={documents}
            onView={(doc) => onViewDocument(profile, doc)}
            onDownload={(doc) => onDownloadDocument(profile, doc)}
            onDelete={(doc) => onDeleteDocument(profile, doc)}
          />

          <ActivityLogs
            logs={logs}
            profile={profile}
            logFilter={logFilter}
            setLogFilter={setLogFilter}
            logDateFilter={logDateFilter}
            setLogDateFilter={setLogDateFilter}
            onExportLogs={onExportLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
          />
        </div>
      )}
    </div>
  );
}