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

const ReportsPage = () =>{
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [allocatedLearners, setAllocatedLearners] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [fundingWindows, setFundingWindows] = useState([]);
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
    loadData();
  }, []);

  const loadData = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const companiesData = localStorage.getItem('host-companies');
      const placementsData = localStorage.getItem('learner-placements');
      const learnersData = localStorage.getItem('allocated-learners');
      const agreementsData = localStorage.getItem('seta-agreements');
      const windowsData = localStorage.getItem('funding-windows');

      if (companiesData) setCompanies(JSON.parse(companiesData));
      if (placementsData) setPlacements(JSON.parse(placementsData));
      if (learnersData) setAllocatedLearners(JSON.parse(learnersData));
      if (agreementsData) setAgreements(JSON.parse(agreementsData));
      if (windowsData) setFundingWindows(JSON.parse(windowsData));
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
            />
          )}

          {activeTab === 'analytics' && (
            <Charts
              companies={companies}
              placements={placements}
              allocatedLearners={allocatedLearners}
              agreements={agreements}
              fundingWindows={fundingWindows}
            />
          )}

          {activeTab === 'search' && (
            <>
              <AdvancedFilters
                companies={companies}
                agreements={agreements}
                fundingWindows={fundingWindows}
                allocatedLearners={allocatedLearners}
                onFilterChange={handleFilterChange}
              />
              <LearnerSearch
                placements={placements}
                allocatedLearners={allocatedLearners}
                companies={companies}
                agreements={agreements}
                filters={filters}
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