import React, { useState } from 'react';
import { Edit, Trash2, FileText, Download, Eye, ChevronDown, ChevronUp, Clock, User, Activity, Upload, Filter, Calendar, X, Plus } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function ProfilesGrid({ profiles, agreements, onEdit, onDelete }) {
  const [expandedProfile, setExpandedProfile] = useState(null);
  const [logFilter, setLogFilter] = useState('all');
  const [logDateFilter, setLogDateFilter] = useState('all');
  const [uploadingProfile, setUploadingProfile] = useState(null);

  const toggleDocuments = (profileId) => {
    setExpandedProfile(expandedProfile === profileId ? null : profileId);
  };

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

    // Update profile documents
    const updatedProfiles = profiles.map(p => {
      if (p.id === profile.id) {
        return {
          ...p,
          documents: (p.documents || []).filter(d => d.id !== doc.id)
        };
      }
      return p;
    });

    // Save to localStorage
    localStorage.setItem('seta-profiles', JSON.stringify(updatedProfiles));
    
    // Force re-render by toggling expanded state
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

    // Update profile with new documents
    const updatedProfiles = profiles.map(p => {
      if (p.id === profile.id) {
        return {
          ...p,
          documents: [...(p.documents || []), ...newDocuments]
        };
      }
      return p;
    });

    // Save to localStorage
    localStorage.setItem('seta-profiles', JSON.stringify(updatedProfiles));
    
    setUploadingProfile(null);
    
    // Force re-render
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profiles.map(profile => {
        const agreement = agreements.find(a => a.id === profile.agreementId);
        const isExpanded = expandedProfile === profile.id;
        const documents = profile.documents || [];
        const logs = getDocumentLogs(profile.id);
        const stats = getLogStats(profile.id);
        
        return (
          <div key={profile.id} className="rounded-xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            {/* Header Section */}
            <div className="p-6 border-b-2" style={{ backgroundColor: COLORS.bgLight, borderColor: COLORS.border }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.primary }}>{profile.profileName}</h3>
                  {agreement && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{agreement.setaName} - {agreement.agreementRef}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(profile)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: COLORS.secondary + '20', color: COLORS.secondary }}
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(profile)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: COLORS.danger + '20', color: COLORS.danger }}
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {profile.description && (
                <p className="text-sm text-gray-600 italic border-l-4 pl-3 py-1" style={{ borderColor: COLORS.info }}>
                  {profile.description}
                </p>
              )}
            </div>
            
            {/* Info Section */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Financial Year
                  </p>
                  <p className="font-bold text-lg" style={{ color: COLORS.primary }}>{profile.financialYear}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Contact Person
                  </p>
                  <p className="font-bold text-lg" style={{ color: COLORS.primary }}>{profile.contactPerson || 'N/A'}</p>
                </div>
              </div>
              
              {profile.programTypes && profile.programTypes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">PROGRAM TYPES</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.programTypes.map(type => (
                      <span key={type} className="px-4 py-2 rounded-full text-xs font-bold shadow-sm" style={{ backgroundColor: COLORS.info + '20', color: COLORS.info }}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="border-t-2 pt-4" style={{ borderColor: COLORS.border }}>
                <button
                  onClick={() => toggleDocuments(profile.id)}
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
                    {/* Upload Section */}
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
                            onChange={(e) => handleFileUpload(profile, e)}
                            className="hidden"
                          />
                          <div className="px-4 py-2 rounded-lg text-white font-semibold transition-all hover:scale-105" style={{ backgroundColor: COLORS.secondary }}>
                            <Plus className="w-4 h-4 inline mr-1" />
                            Choose Files
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Documents List */}
                    {documents.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: COLORS.primary }}>
                          <FileText className="w-4 h-4" />
                          Uploaded Documents ({documents.length})
                        </h4>
                        <div className="space-y-2">
                          {documents.map(doc => (
                            <div 
                              key={doc.id} 
                              className="flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-[1.02]"
                              style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgLight }}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.info + '20' }}>
                                  <FileText className="w-5 h-5" style={{ color: COLORS.info }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold" style={{ color: COLORS.primary }}>
                                    {doc.name}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }}></span>
                                      {doc.size}
                                    </span>
                                    <span>•</span>
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>Uploaded {doc.uploadDate}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDocument(profile, doc)}
                                  className="p-2 rounded-lg transition-all hover:scale-110"
                                  style={{ backgroundColor: COLORS.info + '20', color: COLORS.info }}
                                  title="View Document"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDownloadDocument(profile, doc)}
                                  className="p-2 rounded-lg transition-all hover:scale-110"
                                  style={{ backgroundColor: COLORS.success + '20', color: COLORS.success }}
                                  title="Download Document"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(profile, doc)}
                                  className="p-2 rounded-lg transition-all hover:scale-110"
                                  style={{ backgroundColor: COLORS.danger + '20', color: COLORS.danger }}
                                  title="Delete Document"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: COLORS.primary }} />
                        <p className="text-sm text-gray-500">No documents uploaded yet</p>
                        <p className="text-xs text-gray-400 mt-1">Upload your first document using the button above</p>
                      </div>
                    )}

                    {/* Activity Logs Section */}
                    <div className="border-t-2 pt-4" style={{ borderColor: COLORS.border }}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                          <Activity className="w-4 h-4" />
                          Activity Logs
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => exportLogs(profile, 'csv')}
                            className="text-xs px-3 py-2 rounded-lg border-2 hover:shadow-md transition-all flex items-center gap-1 font-semibold"
                            style={{ color: COLORS.success, borderColor: COLORS.success }}
                            title="Export as CSV"
                          >
                            <Download className="w-3 h-3" />
                            CSV
                          </button>
                        </div>
                      </div>

                      {/* Log Filters */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <select
                          value={logFilter}
                          onChange={(e) => setLogFilter(e.target.value)}
                          className="text-xs px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                          style={{ borderColor: COLORS.border }}
                        >
                          <option value="all">All Actions</option>
                          <option value="VIEW">Views Only</option>
                          <option value="DOWNLOAD">Downloads Only</option>
                          <option value="UPLOAD">Uploads Only</option>
                          <option value="DELETE">Deletes Only</option>
                        </select>
                        <select
                          value={logDateFilter}
                          onChange={(e) => setLogDateFilter(e.target.value)}
                          className="text-xs px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                          style={{ borderColor: COLORS.border }}
                        >
                          <option value="all">All Time</option>
                          <option value="7days">Last 7 Days</option>
                          <option value="30days">Last 30 Days</option>
                          <option value="90days">Last 90 Days</option>
                        </select>
                      </div>

                      {/* Logs Display */}
                      {logs.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {logs.slice().reverse().map((log, index) => (
                            <div 
                              key={index} 
                              className="p-3 rounded-lg border-l-4 transition-all hover:shadow-md"
                              style={{ 
                                backgroundColor: COLORS.bgLight,
                                borderColor: getActionColor(log.action)
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getActionIcon(log.action)}
                                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ 
                                    backgroundColor: getActionColor(log.action) + '20',
                                    color: getActionColor(log.action)
                                  }}>
                                    {log.action}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm font-semibold mb-1" style={{ color: COLORS.primary }}>
                                {log.documentName}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {log.user} ({log.userRole || 'User'})
                                </span>
                                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                          <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: COLORS.primary }} />
                          <p className="text-sm text-gray-500">No activity logs found</p>
                          <p className="text-xs text-gray-400 mt-1">Logs will appear here when documents are accessed</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}