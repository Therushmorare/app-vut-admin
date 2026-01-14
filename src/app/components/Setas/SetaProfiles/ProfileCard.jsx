import React from 'react';
import { COLORS } from '../../../utils/helpers';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import DocumentsSection from './DocumentsSection';

export default function ProfileCard({
  profile,
  agreement,
  documents,
  stats,
  isExpanded,
  logs,
  logFilter,
  setLogFilter,
  logDateFilter,
  setLogDateFilter,
  onEdit,
  onDelete,
  onToggleDocuments,
  onFileUpload,
  onViewDocument,
  onDownloadDocument,
  onDeleteDocument,
  onExportLogs,
  getActionIcon,
  getActionColor
}) {
  return (
    <div 
      className="rounded-xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl" 
      style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}
    >
      <ProfileHeader
        profile={profile}
        agreement={agreement}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      <div className="p-6">
        <ProfileInfo profile={profile} />
        
        <DocumentsSection
          profile={profile}
          documents={documents}
          stats={stats}
          isExpanded={isExpanded}
          onToggle={() => onToggleDocuments(profile.id)}
          onFileUpload={onFileUpload}
          onViewDocument={onViewDocument}
          onDownloadDocument={onDownloadDocument}
          onDeleteDocument={onDeleteDocument}
          logs={logs}
          logFilter={logFilter}
          setLogFilter={setLogFilter}
          logDateFilter={logDateFilter}
          setLogDateFilter={setLogDateFilter}
          onExportLogs={onExportLogs}
          getActionIcon={getActionIcon}
          getActionColor={getActionColor}
        />
      </div>
    </div>
  );
}