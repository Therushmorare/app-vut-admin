"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Eye, X, FileText, Users, MapPin, Phone, Mail, Briefcase, List } from 'lucide-react';
import { COLORS, generateId } from '../../utils/helpers';
import HostCompanyForm from './HostCompanyForm';
import LearnerPlacementForm from './LearnerPlacement';
import Toast from '../ToastNotifications';
import ConfirmDialog from '../ConfirmDialogue';
import PlacementTable, { PlacementStats } from './Table';
import axios from 'axios';

export default function HostCompanyManagement({ allStudents = [] }) {
  const [companies, setCompanies] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [allocatedLearners, setAllocatedLearners] = useState([]);
  const [aStudents, setAllStudents] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterSETA, setFilterSETA] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('companies');

//locl storage load and save
  useEffect(() => {
    loadData();
    fetchCompanies();
    fetchAgreements();
    fetchAllocatedLearners();
    fetchAllStudents();
  }, []);

    const fetchCompanies = async () => {
    try {
      const res = await axios.get(
        'https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/host-companies', // replace with API_BASE if needed
        { withCredentials: true }
      );

      if (res.status === 200 && res.data?.companies) {
        setCompanies(res.data.companies);

        // Optional: Save to localStorage for offline use
        if (typeof window !== 'undefined') {
          localStorage.setItem('host-companies', JSON.stringify(res.data.companies));
        }

        // Optionally show a success toast
        setToast({ type: 'success', message: 'Host companies loaded successfully' });
      } else {
        console.warn('Unexpected API response', res);
      }
    } catch (err) {
      console.error('Failed to load host companies:', err);
      setToast({ type: 'error', message: 'Failed to load host companies' });
    }
  };

  const fetchAgreements = async () => {
    try {
      const res = await axios.get(
        'https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/setaAgreements',
        { withCredentials: true }
      );

      if (res.status === 200 && Array.isArray(res.data)) {
        setAgreements(res.data);

        if (typeof window !== 'undefined') {
          localStorage.setItem('seta-agreements', JSON.stringify(res.data));
        }

        setToast({ type: 'success', message: 'SETA agreements loaded successfully' });
      } else {
        console.warn('Unexpected agreements response:', res.data);
      }
    } catch (err) {
      console.error('Failed to load SETA Agreements:', err);
      setToast({ type: 'error', message: 'Failed to load SETA Agreements' });
    }
  };

  const fetchAllocatedLearners = async () => {
    try {
      const res = await axios.get(
        'https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/learner-allocations',
        { withCredentials: true }
      );

      if (res.status === 200 && Array.isArray(res.data.allocations)) {
        setAllocatedLearners(res.data.allocations);

        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'allocated-learners',
            JSON.stringify(res.data.allocations)
          );
        }

        setToast({ type: 'success', message: 'Allocated learners loaded successfully' });
      } else {
        console.warn('Unexpected allocated learners response:', res.data);
      }
    } catch (err) {
      console.error('Failed to load Allocated Learners:', err);
      setToast({ type: 'error', message: 'Failed to load Allocated Learners' });
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await axios.get(
        'https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/students',
        { withCredentials: true }
      );

      if (res.status === 200 && Array.isArray(res.data.students)) {
        setAllStudents(res.data.students);

        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'all-students',
            JSON.stringify(res.data.students)
          );
        }

        setToast({ type: 'success', message: 'Students loaded successfully' });
      } else {
        console.warn('Unexpected Students response:', res.data);
      }
    } catch (err) {
      console.error('Failed to load Students:', err);
      setToast({ type: 'error', message: 'Failed to load Students' });
    }
  };

  const loadData = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const companiesData = localStorage.getItem('host-companies');
      const placementsData = localStorage.getItem('learner-placements');
      const learnersData = localStorage.getItem('allocated-learners');
      const agreementsData = localStorage.getItem('seta-agreements');
      const studentData = localStorage.getItem('all-students');

      if (companiesData) setCompanies(JSON.parse(companiesData));
      if (placementsData) setPlacements(JSON.parse(placementsData));
      if (learnersData) setAllocatedLearners(JSON.parse(learnersData));
      if (agreementsData) setAgreements(JSON.parse(agreementsData));
      if (studentData) setAllStudents(JSON.parse(studentData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveCompanies = (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('host-companies', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving companies:', error);
    }
  };

  const savePlacements = (data) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('learner-placements', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving placements:', error);
    }
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

  // Company handlers
  const handleCreateCompany = (data) => {
    const newCompany = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    const updated = [...companies, newCompany];
    setCompanies(updated);
    saveCompanies(updated);
    closeModal();
    showToast('Host company created successfully!');
  };

  const handleUpdateCompany = (data) => {
    const updated = companies.map(c => 
      c.id === selectedItem.id ? { ...c, ...data } : c
    );
    setCompanies(updated);
    saveCompanies(updated);
    closeModal();
    showToast('Company updated successfully!');
  };

  const handleDeleteCompany = (company) => {
    setConfirmDialog({
      title: 'Delete Host Company',
      message: `Are you sure you want to delete ${company.company_name}? This will also remove all learner placements at this company.`,
      onConfirm: () => {
        const updatedCompanies = companies.filter(c => c.company_id !== company.company_id);
        const updatedPlacements = placements.filter(p => p.company_id !== company.company_id);
        
        setCompanies(updatedCompanies);
        setPlacements(updatedPlacements);
        
        saveCompanies(updatedCompanies);
        savePlacements(updatedPlacements);
        
        setConfirmDialog(null);
        showToast('Company deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const toggleCompanyExpanded = (companyId) => {
  setExpandedCompanies(prev => 
    prev.includes(companyId) 
      ? prev.filter(id => id !== companyId)
      : [...prev, companyId]
  );
};

  // Placement handlers
  const handleCreatePlacement = (data) => {
    if (Array.isArray(data)) {
      //Multiple placements
      const newPlacements = data.map(placement => ({
        id: generateId(),
        ...placement,
        createdAt: new Date().toISOString()
      }));
      const updated = [...placements, ...newPlacements];
      setPlacements(updated);
      savePlacements(updated);
      closeModal();
      showToast(`${newPlacements.length} learner placement${newPlacements.length > 1 ? 's' : ''} created successfully!`);
    } else {
      //Single placement
      const newPlacement = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString()
      };
      const updated = [...placements, newPlacement];
      setPlacements(updated);
      savePlacements(updated);
      closeModal();
      showToast('Learner placement created successfully!');
    }
  };

  const handleUpdatePlacement = (data) => {
    const updated = placements.map(p =>
      p.placement_id === selectedItem.placement_id? { ...p, ...data } : p
    );
    setPlacements(updated);
    savePlacements(updated);
    closeModal();
    showToast('Placement updated successfully!');
  };

  const handleDeletePlacement = (placement) => {
    setConfirmDialog({
      title: 'Delete Placement',
      message: `Are you sure you want to delete this learner placement?`,
      onConfirm: () => {
        const updated = placements.filter(p => p.placement_id !== placement.placement_id);
        setPlacements(updated);
        savePlacements(updated);
        setConfirmDialog(null);
        showToast('Placement deleted successfully!');
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  //get learners in seta not yet placed
  const getAvailableLearners = (programmeId) => {
    if (!programmeId) return [];

    // Normalize programmeId for comparison
    const normalizedProgrammeId = programmeId.trim().toLowerCase();

    // learners already placed anywhere
    const placedStudentIds = new Set(
      placements.map(p => p.student_id?.trim().toLowerCase())
    );

    return allocatedLearners.filter(allocation => {
      const allocationProgrammeId = allocation.programme_id?.trim().toLowerCase();
      const studentId = allocation.student_id?.trim().toLowerCase();

      return (
        allocationProgrammeId === normalizedProgrammeId &&
        !placedStudentIds.has(studentId)
      );
    });
  };

  const stats = useMemo(() => {
    const totalCompanies = companies.length;
    const totalPlacements = placements.length;
    const activePlacements = placements.filter(p => p.status === 'Active').length;
    const totalCapacity = companies.reduce((sum, c) => sum + parseInt(c.learnerCapacity || 0), 0);
    
    return { totalCompanies, totalPlacements, activePlacements, totalCapacity };
  }, [companies, placements]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = searchTerm === '' || 
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = filterSector === '' || company.industry === filterSector;
      const matchesSETA = filterSETA === '' || company.agreement_id === filterSETA;
      
      return matchesSearch && matchesSector && matchesSETA;
    });
  }, [companies, searchTerm, filterSector, filterSETA]);

  const getMouBadgeColor = (status) => {
    switch(status) {
      case 'Signed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPlacementsByCompany = (companyId) => {
    return placements.filter(p => p.company_id === companyId);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="max-w-7xl mx-auto">

        {/* Tabs - ADD THIS SECTION */}
        <div className="mb-6">
          <div className="border-b" style={{ borderColor: COLORS.border }}>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'companies' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span>Host Companies</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('placements')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'placements' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  <span>All Placements</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                    {placements.length}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Companies</h3>
              <Building2 className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.totalCompanies}</p>
          </div>
          
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Placements</h3>
              <Users className="w-5 h-5" style={{ color: COLORS.success }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.activePlacements}</p>
          </div>
          
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Placements</h3>
              <Briefcase className="w-5 h-5" style={{ color: COLORS.info }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.totalPlacements}</p>
          </div>
          
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Capacity</h3>
              <Users className="w-5 h-5" style={{ color: COLORS.secondary }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.totalCapacity}</p>
          </div>
        </div>

        {/* Conditional Rendering based on Active Tab */}
        {activeTab === 'companies' ? (
          <>
            {/* Search and Filters */}
            <div className="rounded-lg p-6 mb-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by company name, registration, or contact..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: COLORS.border }}
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterSETA}
                    onChange={(e) => setFilterSETA(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.border }}
                  >
                    <option value="">All SETAs</option>
                    {agreements.filter(a => a.status === 'Active').map(agreement => (
                      <option key={agreement.agreement_id} value={agreement.agreement_id}>
                        {agreement.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.border }}
                  >
                    <option value="">All Sectors</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              {(searchTerm || filterSector || filterSETA) && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredCompanies.length} of {companies.length} companies
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSector('');
                      setFilterSETA('');
                    }}
                    className="text-sm px-4 py-2 rounded-lg hover:bg-gray-100"
                    style={{ color: COLORS.text }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6 flex justify-end">
              <button
                onClick={() => openModal('createCompany')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md"
                style={{ backgroundColor: COLORS.success }}
              >
                <Plus className="w-5 h-5" />
                Add Host Company
              </button>
            </div>

            {/* Companies Grid */}
            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCompanies.map((company) => {
                  const companyPlacements = getPlacementsByCompany(company.id);
                  const activePlacements = companyPlacements.filter(p => p.status === 'Active').length;
                  const agreement = agreements.find(a => a.id === company.agreement_id);
                  
                  return (
                    <div key={company.company_id} className="rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1" style={{ color: COLORS.primary }}>
                            {company.company_name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{company.registration_number}</p>
                          {/*<div className="flex flex-wrap gap-2 mb-2">
                            {agreement && (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                                {agreement.name}
                              </span>
                            )}
                          </div>*/}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('viewCompany', company)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.text }}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('editCompany', company)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.secondary }}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            style={{ color: COLORS.danger }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{company.industry}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{company.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{company.contact_person}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{company.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: COLORS.border }}>
                        <div>
                          <p className="text-xs text-gray-600">Capacity / Active</p>
                          <p className="text-lg font-bold" style={{ color: COLORS.primary }}>
                            {company.student_capacity} / {activePlacements}
                          </p>
                        </div>
                        <button
                          onClick={() => openModal('createPlacement', company)}
                          className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                          style={{ backgroundColor: COLORS.info, color: 'white' }}
                          disabled={activePlacements >= parseInt(company.student_capacity)}
                        >
                          Place Learner
                        </button>
                      </div>

                      {companyPlacements.length > 0 && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                      <button
                        onClick={() => toggleCompanyExpanded(company.company_id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                          Current Placements ({companyPlacements.length})
                        </h4>
                        <span className="text-xs" style={{ color: COLORS.text }}>
                          {expandedCompanies.includes(company.company_id) ? '▼ Hide' : '▶ View'}
                        </span>
                      </button>
                      
                      {expandedCompanies.includes(company.company_id) && (
                        <div className="mt-2 space-y-2">
                          {companyPlacements.map(placement => {
                            const learner = allocatedLearners.find(l => l.id === placement.learnerId);
                            return (
                              <div key={placement.id} className="flex items-center justify-between text-sm p-2 rounded" style={{ backgroundColor: COLORS.bgLight }}>
                                <span className="font-medium">
                                  {learner ? `${learner.firstName} ${learner.lastName}` : 'Unknown Learner'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  placement.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                  placement.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {placement.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
              </div>
            ) : (
              <div className="rounded-lg p-12 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
                <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
                  {searchTerm || filterSector ? 'No companies found' : 'No host companies yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterSector 
                    ? 'Try adjusting your filters' 
                    : 'Add your first host company to start managing placements'}
                </p>
                {!(searchTerm || filterSector) && (
                  <button
                    onClick={() => openModal('createCompany')}
                    className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
                    style={{ backgroundColor: COLORS.success }}
                  >
                    Add Host Company
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
            /* ALL PLACEMENTS VIEW */
            <div>
              <PlacementStats placements={placements} />
              <PlacementTable 
                placements={placements}
                allocatedLearners={allocatedLearners}
                companies={companies}
                onView={(placement) => openModal('viewPlacement', placement)}
                onEdit={(placement) => openModal('editPlacement', placement)}
                onDelete={handleDeletePlacement}
              />
            </div>
          )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.bgWhite }}>
              <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
                <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                  {modalType === 'createCompany' && 'Add Host Company'}
                  {modalType === 'editCompany' && 'Edit Host Company'}
                  {modalType === 'viewCompany' && 'Company Details'}
                  {modalType === 'createPlacement' && 'Place Learner'}
                  {modalType === 'editPlacement' && 'Edit Placement'}
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
                {modalType === 'createCompany' && (
                  <HostCompanyForm
                    agreements={agreements}
                    onSubmit={handleCreateCompany}
                    onCancel={closeModal}
                  />
                )}

                {modalType === 'editCompany' && selectedItem && (
                  <HostCompanyForm
                    company={selectedItem}
                    agreements={agreements}
                    onSubmit={handleUpdateCompany}
                    onCancel={closeModal}
                  />
                )}

                {modalType === 'viewCompany' && selectedItem && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 mb-1">SETA Agreement</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>
                          {agreements.find(a => a.agreement_id === selectedItem.agreement_id)?.name || 'N/A'} - 
                          {agreements.find(a => a.agreement_id === selectedItem.agreement_id)?.reference_number || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Company Name</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.registration_number}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Industry Sector</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Learner Capacity</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.student_capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Contact Person</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.contact_person}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>{selectedItem.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Confirmation Letter</p>
                        <p className="font-semibold" style={{ color: selectedItem.confirmation ? COLORS.success : COLORS.danger }}>
                          {selectedItem.confirmation ? 'Received' : 'Not Received'}
                        </p>
                      </div>
                    </div>
                    
                    {selectedItem.notes && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="text-sm" style={{ color: COLORS.primary }}>{selectedItem.notes}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={closeModal}
                      className="w-full px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
                      style={{ backgroundColor: COLORS.text }}
                    >
                      Close
                    </button>
                  </div>
                )}

                {modalType === 'createPlacement' && selectedItem && (
                  <LearnerPlacementForm
                    companyId={selectedItem.company_id}
                    availableLearners={getAvailableLearners(selectedItem.programme_id)}
                    studentInfo={aStudents}
                    onSubmit={handleCreatePlacement}
                    onCancel={closeModal}
                  />
                  )}
                {modalType === 'editPlacement' && selectedItem && (
                  <LearnerPlacementForm
                    placement={selectedItem}
                    companyId={selectedItem.company_id}
                    availableLearners={[
                      ...getAvailableLearners(selectedItem.programme_id),
                      selectedItem // ensure current learner stays selectable
                    ]}
                    studentInfo={aStudents}
                    onSubmit={handleUpdatePlacement}
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