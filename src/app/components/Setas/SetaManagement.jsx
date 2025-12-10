"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { Upload, FileText, AlertCircle, Calendar, Building2, Users, DollarSign, Plus, Edit, Trash2, Eye, X, CheckCircle, Clock, XCircle, Search, Filter, Briefcase } from 'lucide-react';
import { COLORS, formatDate, generateId, checkExpiringSoon } from '../../utils/helpers';
import AgreementForm from './AgreementForm';
import ProfileForm from './ProfileForm';
import FundingWindowForm from './FundingWindow';
import Toast from '../ToastNotifications';
import ConfirmDialog from '../ConfirmDialogue';
import LearnerAllocationForm from './LearnerAllocation';

export default function SETAManagementSystem() {
  const [agreements, setAgreements] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [fundingWindows, setFundingWindows] = useState([]);
  const [activeTab, setActiveTab] = useState('agreements');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [allocatedLearners, setAllocatedLearners] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [expandedWindows, setExpandedWindows] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleGlobalSearch = (event) => {
      setSearchTerm(event.detail);
    };

    window.addEventListener('globalSearchChange', handleGlobalSearch);
    
    if (window.globalSearchTerm !== undefined) {
      setSearchTerm(window.globalSearchTerm);
    }

    return () => {
      window.removeEventListener('globalSearchChange', handleGlobalSearch);
    };
  }, []);

  const loadData = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const agreementsData = localStorage.getItem('seta-agreements');
      const profilesData = localStorage.getItem('seta-profiles');
      const windowsData = localStorage.getItem('seta-windows');
      const learnersData = localStorage.getItem('allocated-learners');
      const studentsData = localStorage.getItem('all-students');

      if (agreementsData) setAgreements(JSON.parse(agreementsData));
      if (profilesData) setProfiles(JSON.parse(profilesData));
      if (windowsData) setFundingWindows(JSON.parse(windowsData));
      if (learnersData) setAllocatedLearners(JSON.parse(learnersData));
      if (studentsData) setAllStudents(JSON.parse(studentsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveAgreements = (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('seta-agreements', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving agreements:', error);
    }
  };

  const saveProfiles = (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('seta-profiles', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  };

  const saveWindows = (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('seta-windows', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving windows:', error);
    }
  };

  const saveLearners = (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('allocated-learners', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving learners:', error);
    }
  };

  const handleAllocateLearners = (allocations) => {
    const updated = [...allocatedLearners, ...allocations];
    setAllocatedLearners(updated);
    saveLearners(updated);
    closeModal();
    showToast(`Successfully allocated ${allocations.length} learner(s)!`);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const handleCreateAgreement = (data) => {
    const newAgreement = {
      id: generateId(),
      ...data,
      hasProfile: false,
      createdAt: new Date().toISOString()
    };
    const updated = [...agreements, newAgreement];
    setAgreements(updated);
    saveAgreements(updated);
    closeModal();
    showToast('Agreement created successfully!');
  };

  const handleUpdateAgreement = (data) => {
    const updated = agreements.map(a => 
      a.id === selectedItem.id ? { ...a, ...data } : a
    );
    setAgreements(updated);
    saveAgreements(updated);
    closeModal();
    showToast('Agreement updated successfully!');
  };

  const handleDeleteAgreement = (agreement) => {
    setConfirmDialog({
      title: 'Delete Agreement',
      message: `Are you sure you want to delete ${agreement.agreementRef}? This will also delete all associated profiles and funding windows.`,
      onConfirm: () => {
        const updatedAgreements = agreements.filter(a => a.id !== agreement.id);
        const updatedProfiles = profiles.filter(p => p.agreementId !== agreement.id);
        const updatedWindows = fundingWindows.filter(w => w.agreementId !== agreement.id);
        
        setAgreements(updatedAgreements);
        setProfiles(updatedProfiles);
        setFundingWindows(updatedWindows);
        
        saveAgreements(updatedAgreements);
        saveProfiles(updatedProfiles);
        saveWindows(updatedWindows);
        
        setConfirmDialog(null);
        showToast('Agreement deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const toggleWindowExpanded = (windowId) => {
  setExpandedWindows(prev => 
    prev.includes(windowId) 
      ? prev.filter(id => id !== windowId)
      : [...prev, windowId]
  );
};

  const handleCreateProfile = (data) => {
    const newProfile = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    const updatedProfiles = [...profiles, newProfile];
    const updatedAgreements = agreements.map(a =>
      a.id === data.agreementId ? { ...a, hasProfile: true } : a
    );
    
    setProfiles(updatedProfiles);
    setAgreements(updatedAgreements);
    saveProfiles(updatedProfiles);
    saveAgreements(updatedAgreements);
    closeModal();
    showToast('Profile created successfully!');
  };

  const handleUpdateProfile = (data) => {
    const updated = profiles.map(p =>
      p.id === selectedItem.id ? { ...p, ...data } : p
    );
    setProfiles(updated);
    saveProfiles(updated);
    closeModal();
    showToast('Profile updated successfully!');
  };

  const handleDeleteProfile = (profile) => {
    setConfirmDialog({
      title: 'Delete Profile',
      message: `Are you sure you want to delete this profile? This will also delete all associated funding windows.`,
      onConfirm: () => {
        const updatedProfiles = profiles.filter(p => p.id !== profile.id);
        const updatedWindows = fundingWindows.filter(w => w.agreementId !== profile.agreementId);
        const updatedAgreements = agreements.map(a =>
          a.id === profile.agreementId ? { ...a, hasProfile: false } : a
        );
        
        setProfiles(updatedProfiles);
        setFundingWindows(updatedWindows);
        setAgreements(updatedAgreements);
        
        saveProfiles(updatedProfiles);
        saveWindows(updatedWindows);
        saveAgreements(updatedAgreements);
        
        setConfirmDialog(null);
        showToast('Profile deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleCreateWindow = (data) => {
    const newWindow = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    const updated = [...fundingWindows, newWindow];
    setFundingWindows(updated);
    saveWindows(updated);
    closeModal();
    showToast('Funding window created successfully!');
  };

  const handleUpdateWindow = (data) => {
    const updated = fundingWindows.map(w =>
      w.id === selectedItem.id ? { ...w, ...data } : w
    );
    setFundingWindows(updated);
    saveWindows(updated);
    closeModal();
    showToast('Funding window updated successfully!');
  };

  const handleDeleteWindow = (window) => {
    setConfirmDialog({
      title: 'Delete Funding Window',
      message: `Are you sure you want to delete ${window.windowName}?`,
      onConfirm: () => {
        const updated = fundingWindows.filter(w => w.id !== window.id);
        setFundingWindows(updated);
        saveWindows(updated);
        setConfirmDialog(null);
        showToast('Funding window deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const stats = useMemo(() => {
    const active = agreements.filter(a => a.status === 'Active').length;
    const pending = agreements.filter(a => a.status === 'Pending').length;
    const expired = agreements.filter(a => a.status === 'Expired').length;
    const totalWindows = fundingWindows.length;
    
    return { active, pending, expired, totalWindows };
  }, [agreements, fundingWindows]);

  const filteredAgreements = useMemo(() => {
    return agreements.filter(agreement => {
      if (!searchTerm && !filterStatus && !filterFaculty) return true;
      
      const search = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        agreement.setaName?.toLowerCase().includes(search) ||
        agreement.agreementRef?.toLowerCase().includes(search) ||
        agreement.faculty?.toLowerCase().includes(search) ||
        agreement.status?.toLowerCase().includes(search) ||
        agreement.startDate?.toLowerCase().includes(search) ||
        agreement.endDate?.toLowerCase().includes(search);
      
      const matchesStatus = filterStatus === '' || agreement.status === filterStatus;
      const matchesFaculty = filterFaculty === '' || agreement.faculty === filterFaculty;
      
      return matchesSearch && matchesStatus && matchesFaculty;
    });
  }, [agreements, searchTerm, filterStatus, filterFaculty]);

  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return profiles;
    
    const search = searchTerm.toLowerCase();
    return profiles.filter(profile => {
      const agreement = agreements.find(a => a.id === profile.agreementId);
      return (
        profile.profileName?.toLowerCase().includes(search) ||
        profile.financialYear?.toLowerCase().includes(search) ||
        profile.contactPerson?.toLowerCase().includes(search) ||
        profile.description?.toLowerCase().includes(search) ||
        agreement?.setaName?.toLowerCase().includes(search) ||
        agreement?.agreementRef?.toLowerCase().includes(search)
      );
    });
  }, [profiles, searchTerm, agreements]);

  const filteredFundingWindows = useMemo(() => {
    if (!searchTerm) return fundingWindows;
    
    const search = searchTerm.toLowerCase();
    return fundingWindows.filter(window => {
      const agreement = agreements.find(a => a.id === window.agreementId);
      const windowLearners = allocatedLearners.filter(l => l.fundingWindowId === window.id);
      
      return (
        window.windowName?.toLowerCase().includes(search) ||
        window.programmeName?.toLowerCase().includes(search) ||
        window.startDate?.toLowerCase().includes(search) ||
        window.endDate?.toLowerCase().includes(search) ||
        agreement?.setaName?.toLowerCase().includes(search) ||
        agreement?.agreementRef?.toLowerCase().includes(search) ||
        windowLearners.some(l => 
          l.firstName?.toLowerCase().includes(search) ||
          l.lastName?.toLowerCase().includes(search) ||
          l.studentId?.toLowerCase().includes(search)
        )
      );
    });
  }, [fundingWindows, searchTerm, agreements, allocatedLearners]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Expired': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredData = () => {
    switch(activeTab) {
      case 'agreements': return filteredAgreements;
      case 'profiles': return filteredProfiles;
      case 'funding': return filteredFundingWindows;
      default: return [];
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="max-w-7xl mx-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Agreements</h3>
              <CheckCircle className="w-5 h-5" style={{ color: COLORS.success }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.active}</p>
          </div>

          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Expired</h3>
              <XCircle className="w-5 h-5" style={{ color: COLORS.danger }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.expired}</p>
          </div>
          
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Funding Windows</h3>
              <DollarSign className="w-5 h-5" style={{ color: COLORS.info }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.totalWindows}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b" style={{ borderColor: COLORS.border }}>
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('agreements')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'agreements' 
                  ? 'border-b-2' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'agreements' ? { 
                borderColor: COLORS.text, 
                color: COLORS.text 
              } : {}}
            >
              SETA Agreements ({agreements.length})
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'profiles' 
                  ? 'border-b-2' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'profiles' ? { 
                borderColor: COLORS.text, 
                color: COLORS.text 
              } : {}}
            >
              SETA Profiles ({profiles.length})
            </button>
            <button
              onClick={() => setActiveTab('funding')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'funding' 
                  ? 'border-b-2' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'funding' ? { 
                borderColor: COLORS.text, 
                color: COLORS.text 
              } : {}}
            >
              Funding Windows ({fundingWindows.length})
            </button>
          </div>
        </div>

        {/* Search results indicator */}
        {searchTerm && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: COLORS.bgWhite }}>
            <p className="text-sm text-gray-600">
              Found <span className="font-bold" style={{ color: COLORS.primary }}>{filteredData.length}</span> result(s) for "{searchTerm}"
            </p>
          </div>
        )}

        {/* Filters - Only show on agreements tab */}
        {activeTab === 'agreements' && (
          <div className="rounded-lg p-6 mb-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.border }}
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>
                <select
                  value={filterFaculty}
                  onChange={(e) => setFilterFaculty(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.border }}
                >
                  <option value="">All Faculties</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="IT & Computing">IT & Computing</option>
                  <option value="Health Sciences">Health Sciences</option>
                  <option value="Applied Sciences">Applied Sciences</option>
                </select>
              </div>
            </div>
            
            {(filterStatus || filterFaculty) && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredAgreements.length} of {agreements.length} agreements
                </p>
                <button
                  onClick={() => {
                    setFilterStatus('');
                    setFilterFaculty('');
                  }}
                  className="text-sm px-4 py-2 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.text }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex justify-end">
          {activeTab === 'agreements' && (
            <button
              onClick={() => openModal('createAgreement')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md"
              style={{ backgroundColor: COLORS.text }}
            >
              <Upload className="w-5 h-5" />
              Upload SETA Agreement
            </button>
          )}
          
          {activeTab === 'profiles' && (
            <button
              onClick={() => {
                const activeAgreements = agreements.filter(a => a.status === 'Active' && !a.hasProfile);
                if (activeAgreements.length === 0) {
                  showToast('No active agreements available for profile creation', 'error');
                  return;
                }
                openModal('createProfile');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md"
              style={{ backgroundColor: COLORS.success }}
            >
              <Plus className="w-5 h-5" />
              Create SETA Profile
            </button>
          )}
          
          {activeTab === 'funding' && (
            <button
              onClick={() => {
                if (profiles.length === 0) {
                  showToast('Create a SETA profile first', 'error');
                  return;
                }
                openModal('createWindow');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md"
              style={{ backgroundColor: COLORS.success }}
            >
              <Plus className="w-5 h-5" />
              Add Funding Window
            </button>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'agreements' && (
          <>
            {filteredAgreements.length > 0 ? (
              <div className="rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.bgWhite }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: COLORS.primary }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Agreement Ref</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">SETA Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Faculty</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Period</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Profile</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ divideColor: COLORS.border }}>
                      {filteredAgreements.map((agreement) => (
                        <tr key={agreement.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" style={{ color: COLORS.text }} />
                              <span className="font-medium" style={{ color: COLORS.primary }}>
                                {agreement.agreementRef}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium" style={{ color: COLORS.primary }}>
                            {agreement.setaName}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{agreement.faculty}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div>{agreement.startDate}</div>
                            <div className="text-xs">to {agreement.endDate}</div>
                            {checkExpiringSoon(agreement.endDate) && (
                              <div className="flex items-center gap-1 mt-1 text-orange-600">
                                <AlertCircle className="w-3 h-3" />
                                <span className="text-xs">Expiring soon</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(agreement.status)}`}>
                              {getStatusIcon(agreement.status)}
                              {agreement.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {agreement.hasProfile ? (
                              <span className="text-green-600 text-sm flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Created
                              </span>
                            ) : (
                              <button
                                onClick={() => openModal('createProfile', agreement)}
                                disabled={agreement.status !== 'Active'}
                                className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ color: COLORS.text, borderColor: COLORS.text }}
                              >
                                Create Profile
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openModal('viewAgreement', agreement)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                style={{ color: COLORS.text }}
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openModal('editAgreement', agreement)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                style={{ color: COLORS.secondary }}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAgreement(agreement)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                style={{ color: COLORS.danger }}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-12 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
                <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
                  {searchTerm || filterStatus || filterFaculty ? 'No agreements found' : 'No agreements yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus || filterFaculty 
                    ? 'Try adjusting your search or filters' 
                    : 'Upload your first SETA agreement to get started'}
                </p>
                {!(searchTerm || filterStatus || filterFaculty) && (
                  <button
                    onClick={() => openModal('createAgreement')}
                    className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
                    style={{ backgroundColor: COLORS.text }}
                  >
                    Upload Agreement
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'profiles' && (
          <>
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfiles.map(profile => {
                  const agreement = agreements.find(a => a.id === profile.agreementId);
                  return (
                    <div key={profile.id} className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>{profile.profileName}</h3>
                          {agreement && (
                            <p className="text-sm text-gray-600">{agreement.setaName} - {agreement.agreementRef}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('editProfile', profile)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.secondary }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.danger }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{profile.description || 'No description'}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Financial Year</p>
                          <p className="font-medium" style={{ color: COLORS.primary }}>{profile.financialYear}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Contact</p>
                          <p className="font-medium" style={{ color: COLORS.primary }}>{profile.contactPerson || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profile.programTypes?.map(type => (
                          <span key={type} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS.bgLight, color: COLORS.text }}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg p-12 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
                <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
                  {searchTerm ? 'No profiles found' : 'No profiles yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search' : 'Create a profile from an active SETA agreement'}
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'funding' && (
          <>
            {filteredFundingWindows.length > 0 ? (
              <div className="space-y-6">
                {filteredFundingWindows.map(window => {
                  const agreement = agreements.find(a => a.id === window.agreementId);
                  const windowLearners = allocatedLearners.filter(l => l.fundingWindowId === window.id);
                  const remainingSlots = window.slotsAvailable - windowLearners.length;
                  
                  return (
                    <div key={window.id} className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>{window.windowName}</h3>
                          {agreement && (
                            <p className="text-sm text-gray-600">{agreement.setaName} - {agreement.agreementRef}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('allocateLearners', { window, agreement })}
                            disabled={remainingSlots === 0}
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: COLORS.success }}
                          >
                            Allocate Learners
                          </button>
                          <button
                            onClick={() => openModal('editWindow', window)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.secondary }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWindow(window)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.danger }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Contract Period</p>
                          <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                            {window.startDate} to {window.endDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Slots</p>
                          <p className="text-xl font-bold" style={{ color: COLORS.primary }}>{window.slotsAvailable}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Allocated</p>
                          <p className="text-xl font-bold" style={{ color: COLORS.info }}>{windowLearners.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Remaining</p>
                          <p className="text-xl font-bold" style={{ color: remainingSlots > 0 ? COLORS.success : COLORS.danger }}>
                            {remainingSlots}
                          </p>
                        </div>
                      </div>

                      {windowLearners.length > 0 && (
                        <div className="border-t pt-4 mt-4" style={{ borderColor: COLORS.border }}>
                          <button
                            onClick={() => toggleWindowExpanded(window.id)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                              Allocated Learners ({windowLearners.length})
                            </h4>
                            <span className="text-xs" style={{ color: COLORS.text }}>
                              {expandedWindows.includes(window.id) ? '▼ Hide' : '▶ View'}
                            </span>
                          </button>
                          
                          {expandedWindows.includes(window.id) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              {windowLearners.map(learner => (
                                <div key={learner.studentId} className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                                  <p className="font-medium" style={{ color: COLORS.primary }}>
                                    {learner.firstName} {learner.lastName}
                                  </p>
                                  <p className="text-xs text-gray-600">{learner.studentId} • {learner.programme}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {window.programmeName && (
                        <div className="border-t pt-4 mt-4" style={{ borderColor: COLORS.border }}>
                          <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Programme Details</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Programme Name</p>
                              <p className="font-medium" style={{ color: COLORS.primary }}>{window.programmeName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Duration</p>
                              <p className="font-medium" style={{ color: COLORS.primary }}>{window.programmeDuration} months</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg p-12 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
                <DollarSign className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
                  {searchTerm ? 'No funding windows found' : 'No funding windows yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search' : 'Add a funding window to manage learner allocations'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgWhite }}>
              <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
                <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                  {modalType === 'createAgreement' && 'Upload SETA Agreement'}
                  {modalType === 'editAgreement' && 'Edit Agreement'}
                  {modalType === 'viewAgreement' && 'Agreement Details'}
                  {modalType === 'createProfile' && 'Create SETA Profile'}
                  {modalType === 'editProfile' && 'Edit SETA Profile'}
                  {modalType === 'createWindow' && 'Add Funding Window'}
                  {modalType === 'editWindow' && 'Edit Funding Window'}
                  {modalType === 'allocateLearners' && 'Allocate Learners'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.primary }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {modalType === 'createAgreement' && (
                  <AgreementForm
                    onSubmit={handleCreateAgreement}
                    onCancel={closeModal}
                  />
                )}

                {modalType === 'editAgreement' && selectedItem && (
                  <AgreementForm
                    agreement={selectedItem}
                    onSubmit={handleUpdateAgreement}
                    onCancel={closeModal}
                  />
                )}

                {modalType === 'viewAgreement' && selectedItem && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">SETA Name</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.setaName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Agreement Reference</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.agreementRef}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Faculty</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.faculty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedItem.status)}`}>
                          {getStatusIcon(selectedItem.status)}
                          {selectedItem.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Start Date</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">End Date</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.endDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
                        style={{ backgroundColor: COLORS.text }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {modalType === 'createProfile' && (
                  <div>
                    {selectedItem ? (
                      <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: COLORS.bgLight }}>
                        <p className="text-sm text-gray-600">Creating profile for:</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>
                          {selectedItem.setaName} - {selectedItem.agreementRef}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                          Select Agreement *
                        </label>
                        <select
                          className="w-full px-4 py-2 border rounded-lg"
                          style={{ borderColor: COLORS.border }}
                          onChange={(e) => {
                            const agreement = agreements.find(a => a.id === e.target.value);
                            setSelectedItem(agreement);
                          }}
                        >
                          <option value="">Choose an active agreement...</option>
                          {agreements
                            .filter(a => a.status === 'Active' && !a.hasProfile)
                            .map(a => (
                              <option key={a.id} value={a.id}>
                                {a.setaName} - {a.agreementRef}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    
                    {selectedItem && (
                      <ProfileForm
                        agreementId={selectedItem.id}
                        onSubmit={handleCreateProfile}
                        onCancel={closeModal}
                      />
                    )}
                  </div>
                )}

                {modalType === 'editProfile' && selectedItem && (
                  <ProfileForm
                    profile={selectedItem}
                    agreementId={selectedItem.agreementId}
                    onSubmit={handleUpdateProfile}
                    onCancel={closeModal}
                  />
                )}

                {modalType === 'allocateLearners' && selectedItem && (
                  <LearnerAllocationForm
                    fundingWindow={selectedItem.window}
                    agreement={selectedItem.agreement}
                    allStudents={allStudents}
                    allocatedLearners={allocatedLearners}
                    onSubmit={handleAllocateLearners}
                    onCancel={closeModal}
                  />
                )}

                {modalType === 'createWindow' && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                        Select Agreement *
                      </label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ borderColor: COLORS.border }}
                        onChange={(e) => {
                          const agreement = agreements.find(a => a.id === e.target.value);
                          setSelectedItem(agreement);
                        }}
                      >
                        <option value="">Choose an agreement with a profile...</option>
                        {agreements
                          .filter(a => a.hasProfile)
                          .map(a => (
                            <option key={a.id} value={a.id}>
                              {a.setaName} - {a.agreementRef}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    {selectedItem && (
                      <FundingWindowForm
                        agreementId={selectedItem.id}
                        onSubmit={handleCreateWindow}
                        onCancel={closeModal}
                      />
                    )}
                  </div>
                )}

                {modalType === 'editWindow' && selectedItem && (
                  <FundingWindowForm
                    window={selectedItem}
                    agreementId={selectedItem.agreementId}
                    onSubmit={handleUpdateWindow}
                    onCancel={closeModal}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Confirm Dialog */}
        {confirmDialog && (
          <ConfirmDialog
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            onCancel={confirmDialog.onCancel}
          />
        )}
      </div>
    </div>
  );
}