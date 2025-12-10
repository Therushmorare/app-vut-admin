"use client"

import React, { useState, useEffect } from 'react';
import { 
  Home, FileText, User, Bell, Upload, Download, CheckCircle, 
  Clock, AlertCircle, Building2, GraduationCap, Calendar,
  Mail, Phone, MapPin, X, Eye, File, Award, Briefcase,
  TrendingUp, Activity, DollarSign, Users
} from 'lucide-react';

// Helper functions
const COLORS = {
  primary: '#201c52',
  secondary: '#FF6B35',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  text: '#2C3E50',
  bgLight: '#F8F9FA',
  bgWhite: '#FFFFFF',
  border: '#DEE2E6'
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? COLORS.success : type === 'error' ? COLORS.danger : COLORS.info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="rounded-lg shadow-lg p-4 flex items-center gap-3" style={{ backgroundColor: bgColor }}>
        <CheckCircle className="w-5 h-5 text-white" />
        <p className="text-white font-medium">{message}</p>
        <button onClick={onClose} className="text-white hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Student Dashboard Component
const StudentDashboard = ({ student, onNavigate }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Suspended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const progressSteps = [
    { 
      label: 'Registration', 
      status: 'completed', 
      icon: User,
      description: 'Account created'
    },
    { 
      label: 'Documents', 
      status: student.documentsComplete ? 'completed' : 'pending', 
      icon: FileText,
      description: student.documentsComplete ? 'Verified' : 'Upload required'
    },
    { 
      label: 'SETA Allocation', 
      status: student.setaAllocation ? 'completed' : 'pending', 
      icon: Award,
      description: student.setaAllocation ? 'Allocated' : 'Awaiting allocation'
    },
    { 
      label: 'Placement', 
      status: student.placement ? 'completed' : 'pending', 
      icon: Building2,
      description: student.placement ? 'Placed' : 'Awaiting placement'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.primary }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome back, {student.firstName}!
            </h1>
            <p className="text-blue-100">
              Student Number: {student.studentNumber}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(student.status)}`}>
            {student.status}
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
          Your Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {progressSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isPending = step.status === 'pending';
            
            return (
              <div key={index} className="relative">
                <div className={`rounded-lg p-4 border-2 ${
                  isCompleted ? 'border-green-500 bg-green-50' : 
                  isPending ? 'border-yellow-500 bg-yellow-50' : 
                  'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      isCompleted ? 'bg-green-500' : 
                      isPending ? 'bg-yellow-500' : 
                      'bg-gray-400'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm" style={{ color: COLORS.text }}>
                      {step.label}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 ml-11">{step.description}</p>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <div className={`w-4 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.text }}>Documents</h3>
            <FileText className="w-5 h-5" style={{ color: COLORS.info }} />
          </div>
          <p className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {student.documentsComplete ? '✓' : '0/5'}
          </p>
          <p className="text-sm text-gray-600">
            {student.documentsComplete ? 'All verified' : 'Upload required'}
          </p>
          {!student.documentsComplete && (
            <button
              onClick={() => onNavigate('documents')}
              className="mt-3 w-full px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: COLORS.info }}
            >
              Upload Now
            </button>
          )}
        </div>

        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.text }}>SETA Allocation</h3>
            <Award className="w-5 h-5" style={{ color: COLORS.secondary }} />
          </div>
          <p className="text-lg font-bold mb-2" style={{ color: COLORS.primary }}>
            {student.setaAllocation ? student.setaAllocation.setaName : 'Not Allocated'}
          </p>
          <p className="text-sm text-gray-600">
            {student.setaAllocation ? 'Agreement pending' : 'Awaiting allocation'}
          </p>
        </div>

        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.text }}>Placement</h3>
            <Building2 className="w-5 h-5" style={{ color: COLORS.success }} />
          </div>
          <p className="text-lg font-bold mb-2" style={{ color: COLORS.primary }}>
            {student.placement ? student.placement.companyName : 'Not Placed'}
          </p>
          <p className="text-sm text-gray-600">
            {student.placement ? 'Active placement' : 'Awaiting placement'}
          </p>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Recent Notifications
          </h2>
          <button
            onClick={() => onNavigate('notifications')}
            className="text-sm font-medium"
            style={{ color: COLORS.info }}
          >
            View All
          </button>
        </div>
        {student.notifications && student.notifications.length > 0 ? (
          <div className="space-y-3">
            {student.notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: COLORS.bgLight }}
              >
                <Bell className="w-5 h-5 mt-0.5" style={{ color: COLORS.info }} />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm" style={{ color: COLORS.text }}>
                    {notif.title}
                  </h4>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(notif.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No notifications yet</p>
        )}
      </div>
    </div>
  );
};

// Document Upload Component
const DocumentUpload = ({ student, onSave }) => {
  const [documents, setDocuments] = useState({
    idDocument: null,
    matricCertificate: null,
    proofOfResidence: null,
    cvDocument: null,
    bankStatement: null
  });
  const [uploadStatus, setUploadStatus] = useState({});
  const [toast, setToast] = useState(null);

  const requiredDocs = [
    { key: 'idDocument', label: 'ID Document', icon: FileText },
    { key: 'matricCertificate', label: 'Matric Certificate', icon: Award },
    { key: 'proofOfResidence', label: 'Proof of Residence', icon: MapPin },
    { key: 'cvDocument', label: 'Curriculum Vitae', icon: User },
    { key: 'bankStatement', label: 'Bank Statement (3 months)', icon: DollarSign }
  ];

  const handleFileSelect = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'File size must be less than 5MB', type: 'error' });
        return;
      }
      
      setDocuments(prev => ({ ...prev, [key]: file }));
      setUploadStatus(prev => ({ ...prev, [key]: 'uploaded' }));
      setToast({ message: `${file.name} uploaded successfully`, type: 'success' });
    }
  };

  const handleSubmit = () => {
    const allUploaded = requiredDocs.every(doc => documents[doc.key]);
    
    if (!allUploaded) {
      setToast({ message: 'Please upload all required documents', type: 'error' });
      return;
    }

    const updatedStudent = {
      ...student,
      documentsComplete: true,
      documents: documents,
      notifications: [
        ...student.notifications,
        {
          id: generateId(),
          type: 'success',
          title: 'Documents Submitted',
          message: 'Your documents have been submitted for verification. You will be notified once verified.',
          date: new Date().toISOString(),
          read: false
        }
      ]
    };

    onSave(updatedStudent);
    setToast({ message: 'Documents submitted for verification!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.primary }}>
          Document Upload
        </h2>
        <p className="text-gray-600 mb-6">
          Please upload all required documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
        </p>

        <div className="space-y-4">
          {requiredDocs.map((doc) => {
            const Icon = doc.icon;
            const isUploaded = uploadStatus[doc.key] === 'uploaded';
            
            return (
              <div
                key={doc.key}
                className="border-2 border-dashed rounded-lg p-6 hover:border-blue-400 transition-colors"
                style={{ borderColor: isUploaded ? COLORS.success : COLORS.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: isUploaded ? COLORS.success + '20' : COLORS.bgLight }}
                    >
                      <Icon className="w-6 h-6" style={{ color: isUploaded ? COLORS.success : COLORS.text }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: COLORS.text }}>
                        {doc.label}
                      </h3>
                      {documents[doc.key] && (
                        <p className="text-sm text-gray-600">{documents[doc.key].name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isUploaded && (
                      <CheckCircle className="w-6 h-6" style={{ color: COLORS.success }} />
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect(doc.key, e)}
                        className="hidden"
                      />
                      <div
                        className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90"
                        style={{ backgroundColor: isUploaded ? COLORS.info : COLORS.primary }}
                      >
                        {isUploaded ? 'Replace' : 'Upload'}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!requiredDocs.every(doc => documents[doc.key])}
          className="w-full mt-6 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: COLORS.success }}
        >
          Submit All Documents for Verification
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ student, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student);
  const [toast, setToast] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    setToast({ message: 'Profile updated successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            My Profile
          </h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: isEditing ? COLORS.success : COLORS.info }}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg pb-2 border-b" style={{ color: COLORS.text, borderColor: COLORS.border }}>
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                />
              ) : (
                <p className="text-gray-600">{student.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                />
              ) : (
                <p className="text-gray-600">{student.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                ID Number
              </label>
              <p className="text-gray-600">{student.idNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Student Number
              </label>
              <p className="text-gray-600">{student.studentNumber}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg pb-2 border-b" style={{ color: COLORS.text, borderColor: COLORS.border }}>
              Contact Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                />
              ) : (
                <p className="text-gray-600">{student.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: COLORS.border }}
                />
              ) : (
                <p className="text-gray-600">{student.phone}</p>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-lg pb-2 border-b" style={{ color: COLORS.text, borderColor: COLORS.border }}>
              Academic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                  Faculty
                </label>
                <p className="text-gray-600">{student.faculty}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                  Programme
                </label>
                <p className="text-gray-600">{student.programme}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                  Registration Date
                </label>
                <p className="text-gray-600">{formatDate(student.registrationDate)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                  Status
                </label>
                <p className="text-gray-600">{student.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// Notifications Component
const Notifications = ({ student, onMarkAsRead }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = student.notifications?.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  }) || [];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5" style={{ color: COLORS.info }} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            Notifications
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: filter === 'all' ? COLORS.primary : 'transparent' }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'unread' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: filter === 'unread' ? COLORS.primary : 'transparent' }}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'read' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: filter === 'read' ? COLORS.primary : 'transparent' }}
            >
              Read
            </button>
          </div>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border ${
                  notif.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
                style={{ borderColor: notif.read ? COLORS.border : undefined }}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notif.type)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold" style={{ color: COLORS.text }}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="px-2 py-1 text-xs font-medium text-white rounded-full" style={{ backgroundColor: COLORS.info }}>
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(notif.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
              No notifications
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'You have no unread notifications' : 'No notifications to display'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Student Portal Component
export default function StudentPortal() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      setCurrentStudent(JSON.parse(studentData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (student) => {
    setCurrentStudent(student);
    setIsLoggedIn(true);
    localStorage.setItem('currentStudent', JSON.stringify(student));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentStudent(null);
    localStorage.removeItem('currentStudent');
  };

  const handleSaveStudent = (updatedStudent) => {
    setCurrentStudent(updatedStudent);
    localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const updatedStudents = students.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    );
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  if (!isLoggedIn) {
    // Import and use StudentAuthPage from the provided document
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.bgLight }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: COLORS.primary }}>
            Student Portal
          </h1>
          <p className="text-gray-600 mb-6">Please login or register to continue</p>
          <button
            onClick={() => {
              // Demo login
              const demoStudent = {
                id: 'demo-1',
                studentNumber: 'STU001',
                firstName: 'Demo',
                lastName: 'Student',
                email: 'demo@university.ac.za',
                phone: '+27 12 345 6789',
                faculty: 'Engineering and Technology',
                programme: 'Computer Science',
                status: 'Pending',
                idNumber: '0012315678912',
                registrationDate: new Date().toISOString(),
                documentsComplete: false,
                setaAllocation: null,
                placement: null,
                notifications: []
              };
              handleLogin(demoStudent);
            }}
            className="px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: COLORS.primary }}
          >
            Demo Login
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bgLight }}>
      {/* Header */}
      <header className="shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8" style={{ color: COLORS.primary }} />
              <h1 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                Bokamoso Simelane
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: COLORS.danger }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeView === item.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ backgroundColor: activeView === item.id ? COLORS.primary : COLORS.bgWhite }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeView === 'dashboard' && (
            <StudentDashboard student={currentStudent} onNavigate={setActiveView} />
          )}
          {activeView === 'documents' && (
            <DocumentUpload student={currentStudent} onSave={handleSaveStudent} />
          )}
          {activeView === 'profile' && (
            <StudentProfile student={currentStudent} onSave={handleSaveStudent} />
          )}
          {activeView === 'notifications' && (
            <Notifications student={currentStudent} onMarkAsRead={handleSaveStudent} />
          )}
        </div>
      </div>
    </div>
  );
}