"use client"

import React, { useState } from 'react';
import PayslipModal from './Payslip';
import { X, Edit2, Save, User, Phone, Mail, MapPin, GraduationCap, Briefcase, DollarSign, FileText, Upload, Download, Send, CheckCircle, Eye } from 'lucide-react';

const StudentProfileModal = ({ student, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPayslip, setShowPayslip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: student?.name || 'Bokamoso Simelane',
    studentNumber: student?.studentNumber || 'STU2024001',
    idNumber: student?.idNumber || '9501234567089',
    passportNumber: student?.passportNumber || 'N/A',
    dateOfBirth: student?.dateOfBirth || '1995-01-15',
    gender: bio?.gender || 'Male',
    race: student?.race || 'African',
    nationality: student?.nationality || 'South African',
    disability: student?.disability || 'None',
    homeLanguage: student?.homeLanguage || 'English',
    status: student?.status || 'Active',
    

    physicalAddress: student?.address || '123 Main Street, Johannesburg, 2000',
    postalAddress: student?.address || 'P.O. Box 456, Johannesburg, 2001',
    universityEmail: student?.email || 'bokamoso@university.ac.za',
    personalEmail: student?.email || 'bokamoso.personal@gmail.com',
    cellPhone: student?.phone || '+27 82 123 4567',
    altPhone: student?.altPhone || '+27 11 234 5678',
    nextOfKinName: student?.nextOfKinName || 'Nombuso Simelane',
    nextOfKinRelation: student?.nextOfKinRelation || 'Aunt',
    nextOfKinPhone: student?.nextOfKinPhone || '+27 83 987 6543',
    nextOfKinEmail: student?.nextOfKinEmail || 'nombuso.simelane@example.com',
    
    // Academic Progress
    highestQualification: student?.highestQualification || 'Grade 12 (Matric)',
    nqfLevel: student?.nqfLevel || 'NQF Level 5',
    programme: student?.programme || 'Business Administration',
    enrollmentStatus: student?.status || 'Active',
    modulesCompleted: student?.modulesCompleted || '8/12',
    unitStandardsProgress: student?.unitStandardsProgress || '15/20 Competent',
    creditsAchieved: student?.creditsAchieved || '120/180',
    attendance: student?.attendance || 85,
    academicWarnings: student?.academicWarnings || 'None',
    
    // SETA Programme Details
    learnerships: student?.learnerships || 'Skills Programme in Business Management',
    setaName: student?.setaName || 'FP&M SETA',
    setaCode: student?.setaCode || 'FPMSETA001',
    assessorName: student?.assessorName || 'Dr. Sarah Smith',
    assessorRegNo: student?.assessorRegNo || 'ASS-2024-001',
    moderatorName: student?.moderatorName || 'Prof. Mike Johnson',
    moderatorRegNo: student?.moderatorRegNo || 'MOD-2024-001',
    programmeStartDate: student?.startDate || '2024-01-15',
    programmeEndDate: student?.endDate || '2025-12-15',
    programmeStatus: student?.compliance || 'Active',
    
    // Workplace Placement
    employerName: student?.employer || 'Tech Solutions Ltd',
    supervisorName: student?.supervisor || 'Jabulane Maphisa',
    supervisorContact: student?.supervisorContact || '+27 11 555 0123',
    employerSdl: student?.employerSdl || 'SDL123456789',
    workplaceAddress: student?.workplaceAddress || '456 Business Park, Sandton, 2196',
    placementStartDate: student?.placementStart || '2025-11-01',
    placementEndDate: student?.placementEnd || '2026-11-01',
    hoursLogged: student?.hoursLogged || '850/2000',
    placementStatus: student?.placementStatus || 'Active',
    
    // Financial Info
    fundingType: student?.fundingType || 'Learnership Stipend',
    monthlyStipend: student?.stipendAmount || 'R 3,500',
    totalPaid: student?.totalPaid || 'R 35,000',
    bankName: student?.bankName || 'Standard Bank',
    accountNumber: student?.accountNumber || '****5678',
    stipendStatus: student?.stipendStatus || 'Paid',
    lastPaymentDate: student?.lastPayment || '2025-12-01',
    nextPaymentDate: student?.nextPayment || '2026-01-01',
    
    // Compliance Documents
    learnerAgreement: student?.learnerAgreement || 'Uploaded - Verified',
    idCopy: student?.idCopy || 'Uploaded - Verified',
    proofOfResidence: student?.proofOfResidence || 'Uploaded - Verified',
    priorQualifications: student?.priorQualifications || 'Uploaded - Verified',
    cv: student?.cv || 'Uploaded',
    portfolioOfEvidence: student?.portfolioOfEvidence || 'In Progress',
    assessorReports: student?.assessorReports || '3 Uploaded',
    timesheet: student?.timesheet || 'Up to Date',
    payslipHistory: student?.payslipHistory || '10 Generated',
    complianceStatus: student?.complianceStatus || 'Compliant'
  });

  const userAvatar = "";
  const userName = formData.fullName;
  const size = 'lg';   

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...student, ...formData });
    setIsEditing(false);
  };

  const handleUpload = (docType) => {
    alert(`Upload functionality for ${docType} - integrate with file upload service`);
  };

  const handleGeneratePayslip = () => {
    alert('Generating payslip PDF...');
  };

  const handleSendEmail = () => {
    alert(`Sending email to ${formData.universityEmail}...`);
  };

  const tabs = [
    { key: 'personal', label: 'Personal Info', icon: User },
    { key: 'contact', label: 'Contact Info', icon: Phone },
    { key: 'academic', label: 'Academic Progress', icon: GraduationCap },
    { key: 'seta', label: 'SETA Programme', icon: FileText },
    { key: 'workplace', label: 'Workplace', icon: Briefcase },
    { key: 'financial', label: 'Financial', icon: DollarSign },
    { key: 'documents', label: 'Compliance', icon: CheckCircle }
  ];

  const renderField = (label, value, field, type = 'text', options = {}) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing && !options.readOnly ? (
        options.select ? (
          <select
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#201c52]"
          >
            {options.selectOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#201c52]"
          />
        )
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{value}</p>
      )}
    </div>
  );

  const renderDocumentField = (label, status, docType) => (
    <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <p className="text-sm text-gray-600">{status}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert(`Viewing ${docType}...`)}
            className="p-2 text-[#201c52] hover:bg-[#201c52] hover:bg-opacity-10 rounded-md transition-colors"
            title="View Document"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0245A3]">Personal Information</h3>
              {isEditing && (
                <button
                  onClick={() => handleUpload('ID Document')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#f8a528] text-[#0245A3] rounded-md hover:bg-opacity-90 text-sm font-medium"
                >
                  <Upload size={14} />
                  Upload ID/Passport
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Full Legal Name', formData.fullName, 'fullName')}
              {renderField('Student Number', formData.studentNumber, 'studentNumber')}
              {renderField('ID Number', formData.idNumber, 'idNumber')}
              {renderField('Passport Number', formData.passportNumber, 'passportNumber')}
              {renderField('Date of Birth', formData.dateOfBirth, 'dateOfBirth', 'date')}
              {renderField('Gender', formData.gender, 'gender', 'text', { 
                select: true, 
                selectOptions: ['Male', 'Female', 'Other', 'Prefer not to say'] 
              })}
              {renderField('Race/Population Group', formData.race, 'race', 'text', {
                select: true,
                selectOptions: ['African', 'Coloured', 'Indian/Asian', 'White', 'Other']
              })}
              {renderField('Nationality', formData.nationality, 'nationality')}
              {renderField('Disability Status', formData.disability, 'disability')}
              {renderField('Home Language', formData.homeLanguage, 'homeLanguage')}
              {renderField('Status', formData.status, 'status', 'text', {
                select: true,
                selectOptions: ['Active', 'Suspended', 'Graduated', 'Withdrawn']
              })}
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0245A3]">Contact Information</h3>
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0245A3] text-white rounded-md hover:bg-opacity-90 text-sm font-medium"
              >
                <Send size={14} />
                Send Email
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                {renderField('Physical Address', formData.physicalAddress, 'physicalAddress')}
              </div>
              <div className="md:col-span-2">
                {renderField('Postal Address', formData.postalAddress, 'postalAddress')}
              </div>
              {renderField('University Email', formData.universityEmail, 'universityEmail', 'email')}
              {renderField('Personal Email', formData.personalEmail, 'personalEmail', 'email')}
              {renderField('Cell Phone', formData.cellPhone, 'cellPhone', 'tel')}
              {renderField('Alternative Phone', formData.altPhone, 'altPhone', 'tel')}
            </div>
            
            <h4 className="text-md font-semibold text-[#0245A3] mt-6 mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Next of Kin Name', formData.nextOfKinName, 'nextOfKinName')}
              {renderField('Relationship', formData.nextOfKinRelation, 'nextOfKinRelation')}
              {renderField('Phone Number', formData.nextOfKinPhone, 'nextOfKinPhone', 'tel')}
              {renderField('Email Address', formData.nextOfKinEmail, 'nextOfKinEmail', 'email')}
            </div>
          </div>
        );
      
      case 'academic':
        return (
          <div>
            <h3 className="text-lg font-semibold text-[#0245A3] mb-4">Academic Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Highest Qualification', formData.highestQualification, 'highestQualification')}
              {renderField('NQF Level', formData.nqfLevel, 'nqfLevel')}
              {renderField('Current Programme', formData.programme, 'programme')}
              {renderField('Enrollment Status', formData.enrollmentStatus, 'enrollmentStatus', 'text', {
                select: true,
                selectOptions: ['Active', 'Completed', 'Withdrawn', 'Deferred']
              })}
              {renderField('Modules Progress', formData.modulesCompleted, 'modulesCompleted')}
              {renderField('Unit Standards', formData.unitStandardsProgress, 'unitStandardsProgress')}
              {renderField('Credits Achieved', formData.creditsAchieved, 'creditsAchieved')}
              <div className="md:col-span-2">
              </div>
            </div>
            {isEditing && (
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-[#0245A3] text-white rounded-md hover:bg-opacity-90 text-sm font-medium">
                  Add Module Results
                </button>
              </div>
            )}
          </div>
        );
      
      case 'seta':
        return (
          <div>
            <h3 className="text-lg font-semibold text-[#0245A3] mb-4">SETA Programme Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Learnership/Skills Programme', formData.learnerships, 'learnerships')}
              {renderField('SETA Name', formData.setaName, 'setaName')}
              {renderField('SETA Code', formData.setaCode, 'setaCode')}
              {renderField('Assessor Name', formData.assessorName, 'assessorName')}
              {renderField('Assessor Registration No.', formData.assessorRegNo, 'assessorRegNo')}
              {renderField('Moderator Name', formData.moderatorName, 'moderatorName')}
              {renderField('Moderator Registration No.', formData.moderatorRegNo, 'moderatorRegNo')}
              {renderField('Programme Start Date', formData.programmeStartDate, 'programmeStartDate', 'date')}
              {renderField('Programme End Date', formData.programmeEndDate, 'programmeEndDate', 'date')}
              {renderField('Programme Status', formData.programmeStatus, 'programmeStatus', 'text', {
                select: true,
                selectOptions: ['Active', 'Completed', 'Withdrawn']
              })}
            </div>
            {isEditing && (
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#f8a528] text-[#0245A3] rounded-md hover:bg-opacity-90 text-sm font-medium">
                  Upload Learner Agreement
                </button>
              </div>
            )}
          </div>
        );
      
      case 'workplace':
        return (
          <div>
            <h3 className="text-lg font-semibold text-[#0245A3] mb-4">Workplace Placement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Employer/Company Name', formData.employerName, 'employerName')}
              {renderField('Supervisor Name', formData.supervisorName, 'supervisorName')}
              {renderField('Supervisor Contact', formData.supervisorContact, 'supervisorContact', 'tel')}
              {renderField('Employer SDL Number', formData.employerSdl, 'employerSdl')}
              <div className="md:col-span-2">
                {renderField('Workplace Address', formData.workplaceAddress, 'workplaceAddress')}
              </div>
              {renderField('Placement Start Date', formData.placementStartDate, 'placementStartDate', 'date')}
              {renderField('Placement End Date', formData.placementEndDate, 'placementEndDate', 'date')}
              {renderField('Hours Logged/Required', formData.hoursLogged, 'hoursLogged')}
              {renderField('Placement Status', formData.placementStatus, 'placementStatus', 'text', {
                select: true,
                selectOptions: ['Active', 'Completed', 'Pending Verification']
              })}
            </div>
            {isEditing && (
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-[#f8a528] text-[#0245A3] rounded-md hover:bg-opacity-90 text-sm font-medium">
                  Upload Logbook
                </button>
                <button className="px-4 py-2 bg-[#0245A3] text-white rounded-md hover:bg-opacity-90 text-sm font-medium">
                  Approve Hours
                </button>
              </div>
            )}
          </div>
        );
      
      case 'financial':
        return (
          <div>
            <h3 className="text-lg font-semibold text-[#0245A3] mb-4">Financial Information & Stipend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Funding Type', formData.fundingType, 'fundingType', 'text', {
                select: true,
                selectOptions: ['Learnership', 'Bursary', 'Internship', 'WIL', 'Discretionary Grant']
              })}
              {renderField('Monthly Stipend Amount', formData.monthlyStipend, 'monthlyStipend')}
              {renderField('Total Paid to Date', formData.totalPaid, 'totalPaid', 'text', { readOnly: true })}
              {renderField('Bank Name', formData.bankName, 'bankName')}
              {renderField('Account Number (Masked)', formData.accountNumber, 'accountNumber', 'text', { readOnly: true })}
              {renderField('Payment Status', formData.stipendStatus, 'stipendStatus', 'text', {
                select: true,
                selectOptions: ['Paid', 'Pending', 'Overdue', 'On Hold']
              })}
              {renderField('Last Payment Date', formData.lastPaymentDate, 'lastPaymentDate', 'date')}
              {renderField('Next Payment Date', formData.nextPaymentDate, 'nextPaymentDate', 'date')}
            </div>
            {/* PaySlip Management Section
            <div className="mt-6 p-4 bg-blue-50 border border-[#0245A3] rounded-lg">
              <h4 className="text-md font-semibold text-[#0245A3] mb-3">Payslip Management</h4>
              <p className="text-sm text-gray-700 mb-3">Generate and manage student payslips based on attendance and stipend data.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPayslip(true)}
                  className="px-4 py-2 bg-[#f8a528] text-[#0245A3] rounded-md hover:bg-opacity-90 text-sm font-semibold flex items-center gap-2"
                >
                  <FileText size={16} />
                  Generate Payslip
                </button>
                <button className="px-4 py-2 bg-[#0245A3] text-white rounded-md hover:bg-opacity-90 text-sm font-medium flex items-center gap-2">
                  <Download size={16} />
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-opacity-90 text-sm font-medium flex items-center gap-2">
                  <Send size={16} />
                  Email Payslip
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Payslip History: {formData.payslipHistory}</p>
            </div>*/}
          </div>
        );
      
      case 'documents':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#0245A3]">Compliance Documents</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Overall Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  formData.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-700' :
                  formData.complianceStatus === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {formData.complianceStatus}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {renderDocumentField('SETA Learner Agreement', formData.learnerAgreement, 'Learner Agreement')}
              {renderDocumentField('ID/Passport Copy', formData.idCopy, 'ID Copy')}
              {renderDocumentField('Proof of Residence', formData.proofOfResidence, 'Proof of Residence')}
              {renderDocumentField('Certified Prior Qualifications', formData.priorQualifications, 'Prior Qualifications')}
              {renderDocumentField('Curriculum Vitae (CV)', formData.cv, 'CV')}
              {renderDocumentField('Assessor & Moderator Reports', formData.assessorReports, 'Reports')}
              {renderDocumentField('Hours-Worked Logs', formData.timesheet, 'Work Logs')}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-lg">
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const AvatarComponent = ({ size = 'md' }) => {
    const sizes = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    if (userAvatar) {
      return (
        <img 
          src={userAvatar} 
          alt={userName}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div className={`${sizes[size]} bg-[#0245A3] rounded-full flex items-center justify-center text-white font-semibold`}>
        {getInitials(userName)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl h-full w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#201c52] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <AvatarComponent size="lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.fullName}</h2>
              <p className="text-blue-100">{formData.studentNumber} • {formData.programme}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#f8a528] text-[#201c52] rounded-md hover:bg-opacity-90 transition-colors font-semibold"
              >
                <Save size={16} />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-blue-900 rounded-md hover:bg-opacity-30 transition-colors"
              >
                <Edit2 size={16} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#201c52] px-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 transition-all duration-200 border-none cursor-pointer text-md ${
                    isActive 
                      ? 'bg-[#f8a528] text-[#0245A3] font-semibold shadow-md' 
                      : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-[#f8a528] hover:font-medium'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {renderTabContent()}
        </div>
      </div>

      {showPayslip && (
        <PayslipModal
          student={formData}
          onClose={() => setShowPayslip(false)}
        />
      )}
    </div>
  );
};

export default StudentProfileModal;