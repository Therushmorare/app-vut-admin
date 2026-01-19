"use client"
import React, { useState, useMemo, useEffect } from 'react';
import axios from "axios";
import { Upload, Plus } from 'lucide-react';
import { COLORS, generateId, checkExpiringSoon } from '../../utils/helpers';
import StatsCards from './StatsCards';
import TabNavigation from './TabNavigation';
import SearchResults from './SearchResults';
import AgreementFilters from './AgreementFilters';
import AgreementsTable from './AgreementsTable';
import ProfilesGrid from './SetaProfiles/ProfilesGrid';
import FundingWindowsList from './FundingWindowsList';
import EmptyState from './EmptyState';
import Modal from './Modal';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import AgreementForm from './AgreementForm';
import ProfileForm from './ProfileForm';
import FundingWindowForm from './FundingWindow/FundingWindow';
import LearnerAllocationForm from './LearnerAllocation';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  return [value, setStoredValue];
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://seta-management-api-fvzc9.ondigitalocean.app";

export default function SETAManagementSystem() {
  
  const [agreements, setAgreements] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [fundingWindows, setFundingWindows] = useLocalStorage('seta-windows', []);
  const [allocatedLearners, setAllocatedLearners] = useLocalStorage('allocated-learners', []);
  const [allStudents, setAllStudents] = useLocalStorage('all-students', []);
  
  const [activeTab, setActiveTab] = useState('agreements');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [expandedWindows, setExpandedWindows] = useState([]);

  useEffect(() => {
    const handleGlobalSearch = (event) => setSearchTerm(event.detail);
    window.addEventListener('globalSearchChange', handleGlobalSearch);

    if (window.globalSearchTerm !== undefined) {
      setSearchTerm(window.globalSearchTerm);
    }

    const fetchAgreements = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/administrators/setaAgreements`,
          { withCredentials: true }
        );

        setAgreements(res.data.setas);
      } catch (err) {
        console.error("Failed to load SETA agreements:", err);
      }
    };

    fetchAgreements();

    const fetchProfiles = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/administrators/setas`,
          { withCredentials: true}
        );

        setProfiles(res.data);
      } catch (err) {
        console.error("Failed to load SETA Profiles:", err);
      }
    }

    fetchProfiles();

    return () => {
      window.removeEventListener('globalSearchChange', handleGlobalSearch);
    };
  }, []);

  const stats = useMemo(() => ({
    active: agreements.filter(a => a.status === 'Active').length,
    pending: agreements.filter(a => a.status === 'Pending').length,
    expired: agreements.filter(a => a.status === 'Expired').length,
    totalWindows: fundingWindows.length
  }), [agreements, fundingWindows]);

  const filteredAgreements = useMemo(() => {
    return agreements.filter(agreement => {
      if (!searchTerm && !filterStatus && !filterFaculty) return true;
      
      const search = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        agreement.name?.toLowerCase().includes(search) ||
        agreement.reference_number?.toLowerCase().includes(search) ||
        agreement.faculty?.toLowerCase().includes(search) ||
        agreement.status?.toLowerCase().includes(search) ||
        agreement.start_period?.toLowerCase().includes(search) ||
        agreement.end_period?.toLowerCase().includes(search);
      
      const matchesStatus = !filterStatus || agreement.status === filterStatus;
      const matchesFaculty = !filterFaculty || agreement.faculty === filterFaculty;
      
      return matchesSearch && matchesStatus && matchesFaculty;
    });
  }, [agreements, searchTerm, filterStatus, filterFaculty]);

  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return profiles;
    const search = searchTerm.toLowerCase();
    return profiles.filter(profile => {
      const agreement = agreements.find(a => a.id === profile.agreement_id);
      return (
        profile.name?.toLowerCase().includes(search) ||
        profile.financial_year?.toLowerCase().includes(search) ||
        profile.seta_email?.toLowerCase().includes(search) ||
        profile.description?.toLowerCase().includes(search) ||
        agreement?.name?.toLowerCase().includes(search) ||
        agreement?.reference_number?.toLowerCase().includes(search)
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


  const showToast = (message, type = 'success') => setToast({ message, type });
  
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
    setAgreements([...agreements, newAgreement]);
    closeModal();
    showToast('Agreement created successfully!');
  };

  const handleUpdateAgreement = (data) => {
    setAgreements(agreements.map(a => 
      a.id === selectedItem.id ? { ...a, ...data } : a
    ));
    closeModal();
    showToast('Agreement updated successfully!');
  };

  const handleDeleteAgreement = (agreement) => {
    setConfirmDialog({
      title: 'Delete Agreement',
      message: `Are you sure you want to delete ${agreement.agreementRef}? This will also delete all associated profiles and funding windows.`,
      onConfirm: () => {
        setAgreements(agreements.filter(a => a.id !== agreement.id));
        setProfiles(profiles.filter(p => p.agreementId !== agreement.id));
        setFundingWindows(fundingWindows.filter(w => w.agreementId !== agreement.id));
        setConfirmDialog(null);
        showToast('Agreement deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleCreateProfile = (data) => {
    const newProfile = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    setProfiles([...profiles, newProfile]);
    setAgreements(agreements.map(a =>
      a.id === data.agreementId ? { ...a, hasProfile: true } : a
    ));
    closeModal();
    showToast('Profile created successfully!');
  };

  const handleUpdateProfile = (data) => {
    setProfiles(profiles.map(p =>
      p.id === selectedItem.id ? { ...p, ...data } : p
    ));
    closeModal();
    showToast('Profile updated successfully!');
  };

  const handleDeleteProfile = (profile) => {
    setConfirmDialog({
      title: 'Delete Profile',
      message: 'Are you sure you want to delete this profile? This will also delete all associated funding windows.',
      onConfirm: () => {
        setProfiles(profiles.filter(p => p.id !== profile.id));
        setFundingWindows(fundingWindows.filter(w => w.agreementId !== profile.agreementId));
        setAgreements(agreements.map(a =>
          a.id === profile.agreementId ? { ...a, hasProfile: false } : a
        ));
        setConfirmDialog(null);
        showToast('Profile deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleCreateWindow = (data) => {
    setFundingWindows([...fundingWindows, {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    }]);
    closeModal();
    showToast('Funding window created successfully!');
  };

  const handleUpdateWindow = (data) => {
    setFundingWindows(fundingWindows.map(w =>
      w.id === selectedItem.id ? { ...w, ...data } : w
    ));
    closeModal();
    showToast('Funding window updated successfully!');
  };

  const handleDeleteWindow = (window) => {
    setConfirmDialog({
      title: 'Delete Funding Window',
      message: `Are you sure you want to delete ${window.windowName}?`,
      onConfirm: () => {
        setFundingWindows(fundingWindows.filter(w => w.id !== window.id));
        setConfirmDialog(null);
        showToast('Funding window deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleAllocateLearners = (allocations) => {
    setAllocatedLearners([...allocatedLearners, ...allocations]);
    closeModal();
    showToast(`Successfully allocated ${allocations.length} learner(s)!`);
  };

  const toggleWindowExpanded = (windowId) => {
    setExpandedWindows(prev => 
      prev.includes(windowId) ? prev.filter(id => id !== windowId) : [...prev, windowId]
    );
  };

  const getFilteredData = () => {
    switch(activeTab) {
      case 'agreements': return filteredAgreements;
      case 'profiles': return filteredProfiles;
      case 'funding': return filteredFundingWindows;
      default: return [];
    }
  };

  const renderActionButton = () => {
    if (activeTab === 'agreements') {
      return (
        <button
          onClick={() => openModal('createAgreement')}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md"
          style={{ backgroundColor: COLORS.text }}
        >
          <Upload className="w-5 h-5" />
          Upload SETA Agreement
        </button>
      );
    }
    
    if (activeTab === 'profiles') {
      return (
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
      );
    }
    
    if (activeTab === 'funding') {
      return (
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
      );
    }
  };

  const getModalTitle = () => {
    const titles = {
      createAgreement: 'Upload SETA Agreement',
      editAgreement: 'Edit Agreement',
      viewAgreement: 'Agreement Details',
      createProfile: 'Create SETA Profile',
      editProfile: 'Edit SETA Profile',
      createWindow: 'Add Funding Window',
      editWindow: 'Edit Funding Window',
      allocateLearners: 'Allocate Learners'
    };
    return titles[modalType] || '';
  };

  const renderModalContent = () => {
    switch(modalType) {
      case 'createAgreement':
        return <AgreementForm onSubmit={handleCreateAgreement} onCancel={closeModal} />;
      
      case 'editAgreement':
        return <AgreementForm agreement={selectedItem} onSubmit={handleUpdateAgreement} onCancel={closeModal} />;
      
      case 'viewAgreement':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">SETA Name</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Agreement Reference</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.reference_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Faculty</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.faculty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.start_period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">End Date</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.end_period}</p>
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
        );
      
      case 'createProfile':
        return (
          <div>
            {selectedItem ? (
              <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: COLORS.bgLight }}>
                <p className="text-sm text-gray-600">Creating profile for:</p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>
                  {selectedItem.name} - {selectedItem.reference_number}
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
                  onChange={(e) => setSelectedItem(agreements.find(a => a.id === e.target.value))}
                >
                  <option value="">Choose an active agreement...</option>
                  {agreements.filter(a => a.status === 'Active' && !a.hasProfile).map(a => (
                    <option key={a.id} value={a.id}>{a.name} - {a.reference_number}</option>
                  ))}
                </select>
              </div>
            )}
            {selectedItem && <ProfileForm agreementId={selectedItem.agreement_id} onSubmit={handleCreateProfile} onCancel={closeModal} />}
          </div>
        );
      
      case 'editProfile':
        return <ProfileForm profile={selectedItem} agreementId={selectedItem.agreement_id} onSubmit={handleUpdateProfile} onCancel={closeModal} />;
      
      case 'createWindow':
        return (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Select Agreement *
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
                onChange={(e) => setSelectedItem(agreements.find(a => a.id === e.target.value))}
              >
                <option value="">Choose an agreement with a profile...</option>
                {agreements.filter(a => a.hasProfile).map(a => (
                  <option key={a.id} value={a.id}>{a.setaName} - {a.agreementRef}</option>
                ))}
              </select>
            </div>
            {selectedItem && <FundingWindowForm agreementId={selectedItem.id} onSubmit={handleCreateWindow} onCancel={closeModal} />}
          </div>
        );
      
      case 'editWindow':
        return <FundingWindowForm window={selectedItem} agreementId={selectedItem.agreementId} onSubmit={handleUpdateWindow} onCancel={closeModal} />;
      
      case 'allocateLearners':
        return (
          <LearnerAllocationForm
            fundingWindow={selectedItem.window}
            agreement={selectedItem.agreement}
            allStudents={allStudents}
            allocatedLearners={allocatedLearners}
            onSubmit={handleAllocateLearners}
            onCancel={closeModal}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="max-w-7xl mx-auto">
        <StatsCards stats={stats} />
        
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{ 
            agreements: agreements.length, 
            profiles: profiles.length, 
            funding: fundingWindows.length 
          }}
        />

        {searchTerm && <SearchResults count={getFilteredData().length} searchTerm={searchTerm} />}

        {activeTab === 'agreements' && (
          <AgreementFilters
            filterStatus={filterStatus}
            filterFaculty={filterFaculty}
            setFilterStatus={setFilterStatus}
            setFilterFaculty={setFilterFaculty}
            filteredCount={filteredAgreements.length}
            totalCount={agreements.length}
          />
        )}

        <div className="mb-6 flex justify-end">
          {renderActionButton()}
        </div>

        {/* Agreements Tab */}
        {activeTab === 'agreements' && (
          filteredAgreements.length > 0 ? (
            <AgreementsTable
              agreements={filteredAgreements}
              onView={(a) => openModal('viewAgreement', a)}
              onEdit={(a) => openModal('editAgreement', a)}
              onDelete={handleDeleteAgreement}
              onCreateProfile={(a) => openModal('createProfile', a)}
            />
          ) : (
            <EmptyState
              icon="FileText"
              title={searchTerm || filterStatus || filterFaculty ? 'No agreements found' : 'No agreements yet'}
              description={searchTerm || filterStatus || filterFaculty ? 'Try adjusting your search or filters' : 'Upload your first SETA agreement to get started'}
              actionLabel={!(searchTerm || filterStatus || filterFaculty) ? 'Upload Agreement' : null}
              onAction={() => openModal('createAgreement')}
            />
          )
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          filteredProfiles.length > 0 ? (
            <ProfilesGrid
              profiles={filteredProfiles}
              agreements={agreements}
              onEdit={(p) => openModal('editProfile', p)}
              onDelete={handleDeleteProfile}
            />
          ) : (
            <EmptyState
              icon="Building2"
              title={searchTerm ? 'No profiles found' : 'No profiles yet'}
              description={searchTerm ? 'Try adjusting your search' : 'Create a profile from an active SETA agreement'}
            />
          )
        )}

        {/* Funding Windows Tab */}
        {activeTab === 'funding' && (
          filteredFundingWindows.length > 0 ? (
            <FundingWindowsList
              windows={filteredFundingWindows}
              agreements={agreements}
              allocatedLearners={allocatedLearners}
              expandedWindows={expandedWindows}
              onToggleExpand={toggleWindowExpanded}
              onAllocate={(data) => openModal('allocateLearners', data)}
              onEdit={(w) => openModal('editWindow', w)}
              onDelete={handleDeleteWindow}
            />
          ) : (
            <EmptyState
              icon="DollarSign"
              title={searchTerm ? 'No funding windows found' : 'No funding windows yet'}
              description={searchTerm ? 'Try adjusting your search' : 'Add a funding window to manage learner allocations'}
            />
          )
        )}

        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={getModalTitle()}
        >
          {renderModalContent()}
        </Modal>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {confirmDialog && <ConfirmDialog {...confirmDialog} />}
      </div>
    </div>
  );
}