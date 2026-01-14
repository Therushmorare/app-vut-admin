import { useState } from 'react';
import { Eye, Download, Upload, Trash2, Activity } from 'lucide-react';
import { COLORS } from './helpers';

export default function useDocumentManager(profiles) {
  const [expandedProfile, setExpandedProfile] = useState(null);
  const [logFilter, setLogFilter] = useState('all');
  const [logDateFilter, setLogDateFilter] = useState('all');
  const [uploadingProfile, setUploadingProfile] = useState(null);

  const logActivity = (action, profile, doc, additionalData = {}) => {
    const activityLog = {
      action,
      profileId: profile.id,
      profileName: profile.profileName,
      documentName: doc.name,
      documentSize: doc.size,
      documentId: doc.id,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      userRole: 'Administrator',
      ...additionalData
    };
    
    const existingLogs = JSON.parse(localStorage.getItem('document-logs') || '[]');
    localStorage.setItem('document-logs', JSON.stringify([...existingLogs, activityLog]));
  };

  const handleViewDocument = (profile, doc) => {
    logActivity('VIEW', profile, doc);
    window.open('#', '_blank');
  };

  const handleDownloadDocument = (profile, doc) => {
    logActivity('DOWNLOAD', profile, doc);
    
    const link = document.createElement('a');
    link.href = '#';
    link.download = doc.name;
    link.click();
  };

  const handleDeleteDocument = (profile, doc) => {
    if (!window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      return;
    }

    logActivity('DELETE', profile, doc);

    const updatedProfiles = profiles.map(p => {
      if (p.id === profile.id) {
        return {
          ...p,
          documents: (p.documents || []).filter(d => d.id !== doc.id)
        };
      }
      return p;
    });

    localStorage.setItem('seta-profiles', JSON.stringify(updatedProfiles));
    
    setExpandedProfile(null);
    setTimeout(() => setExpandedProfile(profile.id), 0);
  };

  const handleFileUpload = (profile, event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    const newDocuments = files.map((file, index) => {
      const doc = {
        id: Date.now() + index,
        name: file.name,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        type: getFileType(file.name),
        file: file
      };

      logActivity('UPLOAD', profile, doc, {
        originalFileName: file.name,
        fileType: file.type
      });

      return doc;
    });

    const updatedProfiles = profiles.map(p => {
      if (p.id === profile.id) {
        return {
          ...p,
          documents: [...(p.documents || []), ...newDocuments]
        };
      }
      return p;
    });

    localStorage.setItem('seta-profiles', JSON.stringify(updatedProfiles));
    
    setUploadingProfile(null);
    
    setExpandedProfile(null);
    setTimeout(() => setExpandedProfile(profile.id), 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      pdf: 'PDF',
      doc: 'Word',
      docx: 'Word',
      xls: 'Excel',
      xlsx: 'Excel',
      ppt: 'PowerPoint',
      pptx: 'PowerPoint',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image'
    };
    return types[ext] || 'File';
  };

  const exportLogs = (profile, format = 'csv') => {
    const allLogs = JSON.parse(localStorage.getItem('document-logs') || '[]');
    let profileLogs = allLogs.filter(log => log.profileId === profile.id);
    
    if (logFilter !== 'all') {
      profileLogs = profileLogs.filter(log => log.action === logFilter);
    }
    
    if (logDateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      if (logDateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (logDateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      } else if (logDateFilter === '90days') {
        filterDate.setDate(now.getDate() - 90);
      }
      
      profileLogs = profileLogs.filter(log => new Date(log.timestamp) >= filterDate);
    }
    
    if (profileLogs.length === 0) {
      alert('No logs available for the selected filters');
      return;
    }

    if (format === 'csv') {
      const headers = ['Date', 'Time', 'Action', 'Document Name', 'Document Size', 'User', 'User Role'];
      const rows = profileLogs.map(log => {
        const date = new Date(log.timestamp);
        return [
          date.toLocaleDateString(),
          date.toLocaleTimeString(),
          log.action,
          log.documentName,
          log.documentSize || 'N/A',
          log.user,
          log.userRole || 'N/A'
        ];
      });
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.profileName}_document_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(profileLogs, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.profileName}_document_logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const getDocumentLogs = (profileId) => {
    const allLogs = JSON.parse(localStorage.getItem('document-logs') || '[]');
    let logs = allLogs.filter(log => log.profileId === profileId);
    
    if (logFilter !== 'all') {
      logs = logs.filter(log => log.action === logFilter);
    }
    
    if (logDateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      if (logDateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (logDateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      } else if (logDateFilter === '90days') {
        filterDate.setDate(now.getDate() - 90);
      }
      
      logs = logs.filter(log => new Date(log.timestamp) >= filterDate);
    }
    
    return logs;
  };

  const getLogStats = (profileId) => {
    const allLogs = JSON.parse(localStorage.getItem('document-logs') || '[]');
    const logs = allLogs.filter(log => log.profileId === profileId);
    
    return {
      total: logs.length,
      views: logs.filter(l => l.action === 'VIEW').length,
      downloads: logs.filter(l => l.action === 'DOWNLOAD').length,
      uploads: logs.filter(l => l.action === 'UPLOAD').length,
      deletes: logs.filter(l => l.action === 'DELETE').length,
      lastActivity: logs.length > 0 ? new Date(logs[logs.length - 1].timestamp) : null
    };
  };

  const getActionIcon = (action) => {
    switch(action) {
      case 'VIEW':
        return <Eye className="w-4 h-4" style={{ color: COLORS.info }} />;
      case 'DOWNLOAD':
        return <Download className="w-4 h-4" style={{ color: COLORS.success }} />;
      case 'UPLOAD':
        return <Upload className="w-4 h-4" style={{ color: COLORS.secondary }} />;
      case 'DELETE':
        return <Trash2 className="w-4 h-4" style={{ color: COLORS.danger }} />;
      default:
        return <Activity className="w-4 h-4" style={{ color: COLORS.text }} />;
    }
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'VIEW':
        return COLORS.info;
      case 'DOWNLOAD':
        return COLORS.success;
      case 'UPLOAD':
        return COLORS.secondary;
      case 'DELETE':
        return COLORS.danger;
      default:
        return COLORS.text;
    }
  };

  const toggleDocuments = (profileId) => {
    setExpandedProfile(expandedProfile === profileId ? null : profileId);
  };

  return {
    expandedProfile,
    logFilter,
    setLogFilter,
    logDateFilter,
    setLogDateFilter,
    uploadingProfile,
    setUploadingProfile,
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
  };
}