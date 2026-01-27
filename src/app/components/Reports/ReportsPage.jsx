"use client"
import React, { useState, useEffect } from 'react';
import { BarChart3, FileDown, Filter, TrendingUp } from 'lucide-react';
import { COLORS } from '../../utils/helpers';
import ReportsDashboard from '../../components/Reports/ReportsDashboard';
import AdvancedFilters from '../../components/Reports/Filters';
import ExportManager from '../../components/Reports/Exports';
import LearnerSearch from '../../components/Reports/Search';
import Charts from '../../components/Reports/Charts';
import Toast from '../../components/ToastNotifications';
import StudentProfileModal from '../../components/Students/StudentProfile';
import axios from 'axios';

const ReportsPage = () =>{
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [allocatedLearners, setAllocatedLearners] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [fundingWindows, setFundingWindows] = useState([]);
  const [aStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // ADD THIS
  const [showProfileModal, setShowProfileModal] = useState(false); // ADD THIS
  const [filters, setFilters] = useState({
    faculty: '',
    seta: '',
    programme: '',
    fundingWindow: '',
    status: '',
    documentComplete: '',
    timesheetComplete: '',
    hostCompany: '',
    year: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCompanies();
    fetchAgreements();
    fetchFundingWindows();
    fetchAllocatedLearners();
    fetchAllStudents();
    fetchPlacements();
    loadData();
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
  
  const fetchFundingWindows = async () => {
    try {
      const res = await axios.get(
        `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/getFundingWindows/`,
        { withCredentials: true }
      );

      // res.data is already the array of funding windows
      setFundingWindows(res.data ?? []);
    } catch (err) {
      console.error("Failed to load Funding Windows:", err);
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
  
  const fetchPlacements = async () => {
    try {
      const res = await axios.get(
        'https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/learner-placements',
        { withCredentials: true }
      );

      if (res.status === 200 && Array.isArray(res.data.placements)) {
        setPlacements(res.data.placements);

        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'learner-placements',
            JSON.stringify(res.data.placements)
          );
        }

        setToast({ type: 'success', message: 'Student Placements loaded successfully' });
      } else {
        console.warn('Unexpected Placements response:', res.data);
      }
    } catch (err) {
      console.error('Failed to load Placements:', err);
      setToast({ type: 'error', message: 'Failed to load Placements' });
    }
  };
  
  const loadData = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const companiesData = localStorage.getItem('host-companies');
      const placementsData = localStorage.getItem('learner-placements');
      const learnersData = localStorage.getItem('allocated-learners');
      const agreementsData = localStorage.getItem('seta-agreements');
      const windowsData = localStorage.getItem('funding-windows');
      const studentData = localStorage.getItem('all-students');

      if (companiesData) setCompanies(JSON.parse(companiesData));
      if (placementsData) setPlacements(JSON.parse(placementsData));
      if (learnersData) setAllocatedLearners(JSON.parse(learnersData));
      if (agreementsData) setAgreements(JSON.parse(agreementsData));
      if (windowsData) setFundingWindows(JSON.parse(windowsData));
      if (studentData) setAllStudents(JSON.parse(studentData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleQuickAction = (action, learner) => {
  if (action === 'view') {

    const mappedStudent = {
      name: `${learner.firstName} ${learner.lastName}`,
      studentNumber: learner.studentId,
      idNumber: learner.idNumber,
      email: learner.email,
      phone: learner.cellPhone || learner.phoneNumber,
      programme: learner.programme,
      faculty: learner.faculty,
      dateOfBirth: learner.dateOfBirth,
      gender: learner.gender,
      race: learner.race,
      nationality: learner.nationality,
      disability: learner.disability,
      homeLanguage: learner.homeLanguage,
      status: learner.status,
      

      physicalAddress: learner.physicalAddress,
      postalAddress: learner.postalAddress,
      personalEmail: learner.personalEmail,
      altPhone: learner.alternativePhone,
      nextOfKinName: learner.nextOfKinName,
      nextOfKinRelation: learner.nextOfKinRelation,
      nextOfKinPhone: learner.nextOfKinPhone,
      nextOfKinEmail: learner.nextOfKinEmail,

      employer: learner.company?.companyName,
      supervisor: learner.placement?.supervisorName,
      supervisorContact: learner.placement?.supervisorContact,
      startDate: learner.placement?.startDate,
      endDate: learner.placement?.endDate,
      compliance: learner.placement?.status,

      setaName: learner.agreement?.setaName,
      learnerships: learner.agreement?.programmeName,
      agreementNumber: learner.agreement?.agreementNumber
    };
    
    setSelectedStudent(mappedStudent);
    setShowProfileModal(true);
  }
};

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'search', name: 'Search', icon: Filter },
    { id: 'export', name: 'Export', icon: FileDown }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="max-w-7xl mx-auto">

        {/* Mobile-Responsive Tabs */}
        <div className="mb-6">
          <div className="border-b overflow-x-auto" style={{ borderColor: COLORS.border }}>
            <div className="flex min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <ReportsDashboard
              companies={companies}
              placements={placements}
              allocatedLearners={allocatedLearners}
              agreements={agreements}
              fundingWindows={fundingWindows}
              students={aStudents}
            />
          )}

          {activeTab === 'analytics' && (
            <Charts
              companies={companies}
              placements={placements}
              allocatedLearners={allocatedLearners}
              agreements={agreements}
              fundingWindows={fundingWindows}
              students={aStudents}
            />
          )}

          {activeTab === 'search' && (
            <>
              <AdvancedFilters
                companies={companies}
                agreements={agreements}
                fundingWindows={fundingWindows}
                allocatedLearners={allocatedLearners}
                students={aStudents}
                onFilterChange={handleFilterChange}
              />
              <LearnerSearch
                placements={placements}
                allocatedLearners={allocatedLearners}
                companies={companies}
                agreements={agreements}
                filters={filters}
                students={aStudents}
                onSearch={handleSearch}
                onQuickAction={handleQuickAction}
            />
            </>
          )}

          {activeTab === 'export' && (
            <ExportManager
              companies={companies}
              placements={placements}
              allocatedLearners={allocatedLearners}
              agreements={agreements}
              fundingWindows={fundingWindows}
              filters={filters}
              students={aStudents}
              onExport={showToast}
            />
          )}
        </div>

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Student Profile Modal */}
        {showProfileModal && selectedStudent && (
          <StudentProfileModal
            student={selectedStudent}
            onClose={() => {
              setShowProfileModal(false);
              setSelectedStudent(null);
            }}
            onSave={(updatedStudent) => {
              console.log('Saving student:', updatedStudent);
              setShowProfileModal(false);
              setSelectedStudent(null);
              showToast('Student profile updated successfully', 'success');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ReportsPage;