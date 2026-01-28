"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Search, FolderOpen, File, Flag, CheckCircle, Download, Eye, Filter, X, ChevronRight, AlertCircle } from 'lucide-react';
import axios from "axios";

const COLORS = {
  primary: '#201C52',
  secondary: '#D08A00',
  text: '#002F6E',
  accent: '#8B745A',
  danger: '#DB282F',
  info: '#0076C0',
  success: '#009862',
  warning: '#FFDB00',
  bgLight: '#F9F9F9',
  bgWhite: '#FFFFFF',
  textDark: '#000000',
  textMedium: '#505050',
  border: '#B9B9B9'
};

const StudentDocumentManager = () => {
  const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, documentsRes] = await Promise.all([
          axios.get("https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/students"),
          axios.get("https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/studentDocuments")
        ]);

        const studentsData = studentsRes.data.students || [];
        const documentsData = documentsRes.data.result || [];

        const studentMap = {};
        studentsData.forEach(s => studentMap[s.id] = s);

        const mapFolder = (docType) => {
          if (!docType) return "Miscellaneous";

          const type = docType.toLowerCase();

          if (["iddocument","proofofresidence","medicalcertificate"].includes(type)) 
            return "Personal Documents";

          if (["academictranscript","matriccertificate","assessmentresults"].includes(type)) 
            return "Academic Records";

          if (["employmentcontract","setaagreement"].includes(type)) 
            return "Employment & SETA Documents";

          if (["timesheet","monthlyreport"].includes(type)) 
            return "Progress Reports";

          if (["cv","bankstatement"].includes(type))
            return "Financial Documents";

          return "Miscellaneous";
        };

        const normalizedDocuments = documentsData.map(doc => {
          const student = studentMap[doc.user_id];
          return {
            id: doc.document_id,
            studentId: doc.user_id,
            studentNr: student?.student_number || "N/A",
            studentName: student ? `${student.first_name} ${student.last_name}` : "Unknown",
            documentType: doc.doc_type || "Unknown",
            folder: mapFolder(doc.doc_type),
            uploadDate: doc.uploaded_at || "N/A",
            status: doc.status || "pending",
            fileName: doc.document || "Unnamed Document",
            fileSize: doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : "N/A",
            programme: student?.programme || "N/A",
            faculty: student?.faculty || "N/A",
            displayType: doc.doc_type
              .replace(/([A-Z])/g, ' $1') // insert space before capital letters
              .replace(/^./, str => str.toUpperCase()) // capitalize first letter
          };
        });

        setStudents(studentsData);
        setDocuments(normalizedDocuments);
      } catch (err) {
        console.error("Failed to fetch students/documents:", err);
      }
    };

    fetchData();
  }, []);

  const folders = useMemo(() => {
    const folderSet = new Set(documents.map(doc => doc.folder).filter(Boolean));
    return ["all", ...Array.from(folderSet).sort()];
  }, [documents]);

  const documentTypes = useMemo(() => {
    const typeSet = new Set(
      documents.map(doc => doc.documentType).filter(Boolean)
    );
    return ["all", ...Array.from(typeSet).sort()];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch =
        searchTerm === "" ||
        (
          (doc.fileName && doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (doc.studentName && doc.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (doc.studentNr && doc.studentNr.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );

      const matchesFolder =
        selectedFolder === "all" || doc.folder === selectedFolder;

      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;

      const matchesType =
        documentTypeFilter === "all" ||
        doc.documentType === documentTypeFilter;

      const matchesStudent =
        !selectedStudent || doc.studentId === selectedStudent;

      return (
        matchesSearch &&
        matchesFolder &&
        matchesStatus &&
        matchesType &&
        matchesStudent
      );
    });
  }, [
    documents,
    searchTerm,
    selectedFolder,
    statusFilter,
    documentTypeFilter,
    selectedStudent
  ]);

  const folderStats = useMemo(() => {
    const stats = {};
    documents.forEach(doc => {
      if (!doc.folder || !doc.status) return;

      if (!stats[doc.folder]) {
        stats[doc.folder] = { total: 0, flagged: 0, approved: 0, pending: 0 };
      }
      stats[doc.folder].total++;
      stats[doc.folder][doc.status] = (stats[doc.folder][doc.status] || 0) + 1;
    });
    return stats;
  }, [documents]);

  const handleStatusChange = (docId, newStatus) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return COLORS.success;
      case "flagged":
        return COLORS.danger;
      case "pending":
        return COLORS.warning;
      default:
        return COLORS.textMedium;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />;
      case "flagged":
        return <Flag size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="max-w-7xl mx-auto">

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: COLORS.bgWhite, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: COLORS.textMedium, marginBottom: '8px' }}>Total Documents</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.primary }}>{documents.length}</div>
        </div>
        <div style={{ backgroundColor: COLORS.bgWhite, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: COLORS.textMedium, marginBottom: '8px' }}>Pending Review</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.warning }}>
            {documents.filter(d => d.status === 'pending').length}
          </div>
        </div>
        <div style={{ backgroundColor: COLORS.bgWhite, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: COLORS.textMedium, marginBottom: '8px' }}>Flagged</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.danger }}>
            {documents.filter(d => d.status === 'flagged').length}
          </div>
        </div>
        <div style={{ backgroundColor: COLORS.bgWhite, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: COLORS.textMedium, marginBottom: '8px' }}>Approved</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: COLORS.success }}>
            {documents.filter(d => d.status === 'approved').length}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Sidebar - Folders */}
        <div style={{ backgroundColor: COLORS.bgWhite, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.primary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderOpen size={18} />
            Document Folders
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {folders.map(folder => {
              const stats = folder === 'all'
                ? {
                    total: documents.length,
                    pending: documents.filter(d => d.status === 'pending').length,
                    approved: documents.filter(d => d.status === 'approved').length,
                    flagged: documents.filter(d => d.status === 'flagged').length,
                  }
                : folderStats[folder] || { total: 0, pending: 0, approved: 0, flagged: 0 };
              
              return (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  style={{
                    padding: '12px',
                    backgroundColor: selectedFolder === folder ? COLORS.primary : 'transparent',
                    color: selectedFolder === folder ? COLORS.bgWhite : COLORS.text,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {folder === 'all' ? 'All Documents' : folder}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {stats.flagged > 0 && (
                      <span style={{
                        backgroundColor: COLORS.danger,
                        color: COLORS.bgWhite,
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: '600'
                      }}>
                        {stats.flagged}
                      </span>
                    )}
                    <span style={{
                      backgroundColor: selectedFolder === folder ? 'rgba(255,255,255,0.2)' : COLORS.bgLight,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {stats.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Student Filter */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${COLORS.border}` }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary, marginBottom: '12px' }}>
              Filter by Student
            </h4>
            <select
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value ? parseInt(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: COLORS.bgWhite,
                color: COLORS.text
              }}
            >
              <option value="">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.student_number} - {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Search and Filters */}
          <div style={{ backgroundColor: COLORS.bgWhite, padding: '20px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: showFilters ? '16px' : '0' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMedium }} />
                <input
                  type="text"
                  placeholder="Search by student number, name, or filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: showFilters ? COLORS.primary : COLORS.bgWhite,
                  color: showFilters ? COLORS.bgWhite : COLORS.text,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Filter size={18} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${COLORS.border}` }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: COLORS.textMedium, marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: COLORS.textMedium, marginBottom: '6px' }}>
                    Document Type
                  </label>
                  <select
                    value={documentTypeFilter}
                    onChange={(e) => setDocumentTypeFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    {documentTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Active Filters */}
          {(selectedStudent || statusFilter !== 'all' || documentTypeFilter !== 'all' || searchTerm) && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {selectedStudent && (
                <span style={{
                  backgroundColor: COLORS.info,
                  color: COLORS.bgWhite,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Student: {students.find(s => s.id === selectedStudent)?.name}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSelectedStudent(null)} />
                </span>
              )}
              {statusFilter !== 'all' && (
                <span style={{
                  backgroundColor: getStatusColor(statusFilter),
                  color: COLORS.bgWhite,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Status: {statusFilter}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setStatusFilter('all')} />
                </span>
              )}
              {documentTypeFilter !== 'all' && (
                <span style={{
                  backgroundColor: COLORS.secondary,
                  color: COLORS.bgWhite,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Type: {documentTypeFilter}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setDocumentTypeFilter('all')} />
                </span>
              )}
            </div>
          )}

          {/* Document Count */}
          <div style={{ marginBottom: '16px', color: COLORS.textMedium, fontSize: '14px' }}>
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>

          {/* Documents List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredDocuments.length === 0 ? (
              <div style={{
                backgroundColor: COLORS.bgWhite,
                padding: '60px',
                borderRadius: '8px',
                border: `1px solid ${COLORS.border}`,
                textAlign: 'center',
                color: COLORS.textMedium
              }}>
                <File size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>No documents found matching your criteria</p>
              </div>
            ) : (
              filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    backgroundColor: COLORS.bgWhite,
                    padding: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.border}`,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: COLORS.bgLight,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.text
                    }}>
                      <File size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>
                          {doc.fileName}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          color: COLORS.bgWhite,
                          fontWeight: '600'
                        }}>
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textMedium, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span>{doc.studentNr} - {doc.studentName}</span>
                        <span>•</span>
                        <span>{doc.documentType}</span>
                        <span>•</span>
                        <span>{doc.folder}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>Uploaded: {doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      backgroundColor: getStatusColor(doc.status) + '20',
                      color: getStatusColor(doc.status),
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getStatusIcon(doc.status)}
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </div>

                    <button
                      onClick={() => handleStatusChange(doc.id, 'flagged')}
                      disabled={doc.status === 'flagged'}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: doc.status === 'flagged' ? COLORS.bgLight : COLORS.bgWhite,
                        color: doc.status === 'flagged' ? COLORS.textMedium : COLORS.danger,
                        border: `1px solid ${doc.status === 'flagged' ? COLORS.border : COLORS.danger}`,
                        borderRadius: '6px',
                        cursor: doc.status === 'flagged' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        opacity: doc.status === 'flagged' ? 0.5 : 1
                      }}
                      title="Flag document"
                    >
                      <Flag size={14} />
                      Flag
                    </button>

                    <button
                      onClick={() => handleStatusChange(doc.id, 'approved')}
                      disabled={doc.status === 'approved'}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: doc.status === 'approved' ? COLORS.bgLight : COLORS.success,
                        color: doc.status === 'approved' ? COLORS.textMedium : COLORS.bgWhite,
                        border: `1px solid ${doc.status === 'approved' ? COLORS.border : COLORS.success}`,
                        borderRadius: '6px',
                        cursor: doc.status === 'approved' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        opacity: doc.status === 'approved' ? 0.5 : 1
                      }}
                      title="Approve document"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>

                    <button
                      style={{
                        padding: '8px',
                        backgroundColor: COLORS.bgWhite,
                        color: COLORS.info,
                        border: `1px solid ${COLORS.info}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="View document"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      style={{
                        padding: '8px',
                        backgroundColor: COLORS.bgWhite,
                        color: COLORS.text,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Download document"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentDocumentManager;