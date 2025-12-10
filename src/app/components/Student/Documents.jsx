"use client"

import React, { useState, useEffect } from 'react';

const DocumentUpload = ({ student, onUpdate, showToast }) => {
  const [documents, setDocuments] = useState({
    idDocument: null,
    proofOfResidence: null,
    academicTranscript: null,
    cv: null,
    setaAgreement: null,
    placementAgreement: null
  });

  const [uploadedDocs, setUploadedDocs] = useState(student.uploadedDocuments || {});

  useEffect(() => {
    if (student.uploadedDocuments) {
      setUploadedDocs(student.uploadedDocuments);
    }
  }, [student]);

  const requiredDocuments = [
    { key: 'idDocument', label: 'ID Document / Passport', icon: FileText, required: true },
    { key: 'proofOfResidence', label: 'Proof of Residence', icon: FileText, required: true },
    { key: 'academicTranscript', label: 'Academic Transcript', icon: GraduationCap, required: true },
    { key: 'cv', label: 'Curriculum Vitae (CV)', icon: FileText, required: true }
  ];

  const agreementDocuments = [
    { 
      key: 'setaAgreement', 
      label: 'SETA Agreement', 
      icon: Award, 
      required: !!student.setaAllocation,
      downloadable: true,
      available: !!student.setaAllocation
    },
    { 
      key: 'placementAgreement', 
      label: 'Placement Agreement', 
      icon: Building2, 
      required: !!student.placement,
      downloadable: true,
      available: !!student.placement
    }
  ];

  const handleFileSelect = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }

      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showToast('Only PDF, JPG, and PNG files are allowed', 'error');
        return;
      }

      setDocuments(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleUpload = (key) => {
    if (!documents[key]) return;

    const uploaded = {
      ...uploadedDocs,
      [key]: {
        name: documents[key].name,
        size: documents[key].size,
        uploadDate: new Date().toISOString(),
        status: 'Pending Verification'
      }
    };

    setUploadedDocs(uploaded);
    setDocuments(prev => ({ ...prev, [key]: null }));

    const allRequiredDocsUploaded = requiredDocuments.every(doc => uploaded[doc.key]);
    onUpdate({
      ...student,
      uploadedDocuments: uploaded,
      documentsComplete: allRequiredDocsUploaded
    });

    showToast('Document uploaded successfully!', 'success');
  };

  const handleDownload = (key) => {
    showToast('Document download started', 'success');
  };

  const handleSignAgreement = (key) => {
    const updated = {
      ...uploadedDocs,
      [key]: {
        ...uploadedDocs[key],
        signed: true,
        signedDate: new Date().toISOString(),
        status: 'Signed'
      }
    };

    setUploadedDocs(updated);

    if (key === 'setaAgreement') {
      onUpdate({ ...student, uploadedDocuments: updated, setaAgreementSigned: true });
    } else if (key === 'placementAgreement') {
      onUpdate({ ...student, uploadedDocuments: updated, placementAgreementSigned: true });
    }

    showToast('Agreement signed successfully!', 'success');
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending Verification': 'bg-yellow-100 text-yellow-800',
      'Verified': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Signed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
          Required Documents
        </h2>
        <div className="space-y-4">
          {requiredDocuments.map(doc => {
            const Icon = doc.icon;
            const uploaded = uploadedDocs[doc.key];
            const selected = documents[doc.key];

            return (
              <div key={doc.key} className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                    <Icon className="w-6 h-6" style={{ color: COLORS.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold" style={{ color: COLORS.primary }}>
                        {doc.label}
                      </h3>
                      {doc.required && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </div>

                    {uploaded ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" style={{ color: COLORS.success }} />
                          <span className="text-sm text-gray-600">{uploaded.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(uploaded.status)}`}>
                            {uploaded.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Uploaded: {formatDate(uploaded.uploadDate)}
                        </p>
                      </div>
                    ) : selected ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{selected.name}</span>
                        <button
                          onClick={() => handleUpload(doc.key)}
                          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                          style={{ backgroundColor: COLORS.success }}
                        >
                          Upload
                        </button>
                        <button
                          onClick={() => setDocuments(prev => ({ ...prev, [doc.key]: null }))}
                          className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                          style={{ color: COLORS.text }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id={doc.key}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileSelect(doc.key, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={doc.key}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          <Upload className="w-4 h-4" />
                          Select File
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF, JPG, or PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agreements */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
          Agreements
        </h2>
        <div className="space-y-4">
          {agreementDocuments.map(doc => {
            const Icon = doc.icon;
            const uploaded = uploadedDocs[doc.key];

            if (!doc.available) {
              return (
                <div key={doc.key} className="border rounded-lg p-4 bg-gray-50" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-200">
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400">{doc.label}</h3>
                      <p className="text-sm text-gray-500">Not available yet</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={doc.key} className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                    <Icon className="w-6 h-6" style={{ color: COLORS.primary }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                      {doc.label}
                    </h3>

                    {uploaded?.signed ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" style={{ color: COLORS.success }} />
                          <span className="text-sm font-medium text-green-600">Signed</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Signed on: {formatDate(uploaded.signedDate)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownload(doc.key)}
                          className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 border"
                          style={{ color: COLORS.text, borderColor: COLORS.border }}
                        >
                          <Download className="w-4 h-4 inline mr-2" />
                          Download
                        </button>
                        <button
                          onClick={() => handleSignAgreement(doc.key)}
                          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                          style={{ backgroundColor: COLORS.success }}
                        >
                          Sign Agreement
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timesheets & Payslips - Only show if placement is active */}
      {student.placement && student.placementAgreementSigned && (
        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
            Timesheets & Payslips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6" style={{ color: COLORS.info }} />
                <h3 className="font-semibold" style={{ color: COLORS.primary }}>
                  Monthly Timesheet
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Download, complete, and upload your monthly timesheet.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast('Timesheet template downloaded', 'success')}
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 border"
                  style={{ color: COLORS.text, borderColor: COLORS.border }}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Template
                </button>
                <label className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 cursor-pointer" style={{ backgroundColor: COLORS.info }}>
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload
                  <input type="file" className="hidden" accept=".pdf" />
                </label>
              </div>
            </div>

            <div className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-6 h-6" style={{ color: COLORS.success }} />
                <h3 className="font-semibold" style={{ color: COLORS.primary }}>
                  Payslips
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                View and download your monthly payslips.
              </p>
              <button
                onClick={() => showToast('Viewing payslip history', 'success')}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: COLORS.success }}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                View Payslips
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;