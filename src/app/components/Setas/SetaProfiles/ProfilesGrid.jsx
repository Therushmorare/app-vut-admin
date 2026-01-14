import React from 'react';
import ProfileCard from './ProfileCard';
import useDocumentManager from '../../../utils/documentManager';

export default function ProfilesGrid({ profiles, agreements, onEdit, onDelete }) {
  const {
    expandedProfile,
    logFilter,
    setLogFilter,
    logDateFilter,
    setLogDateFilter,
    toggleDocuments,
    handleViewDocument,
    handleDownloadDocument,
    handleDeleteDocument,
    handleFileUpload,
    exportLogs,
    getDocumentLogs,
    getLogStats,
    getActionIcon,
    getActionColor
  } = useDocumentManager(profiles);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profiles.map(profile => {
        const agreement = agreements.find(a => a.id === profile.agreementId);
        const isExpanded = expandedProfile === profile.id;
        const documents = profile.documents || [];
        const logs = getDocumentLogs(profile.id);
        const stats = getLogStats(profile.id);
        
        return (
          <ProfileCard
            key={profile.id}
            profile={profile}
            agreement={agreement}
            documents={documents}
            stats={stats}
            isExpanded={isExpanded}
            logs={logs}
            logFilter={logFilter}
            setLogFilter={setLogFilter}
            logDateFilter={logDateFilter}
            setLogDateFilter={setLogDateFilter}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleDocuments={toggleDocuments}
            onFileUpload={handleFileUpload}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={handleDeleteDocument}
            onExportLogs={exportLogs}
            getActionIcon={getActionIcon}
            getActionColor={getActionColor}
          />
        );
      })}
    </div>
  );
}