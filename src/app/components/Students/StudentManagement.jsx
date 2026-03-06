"use client"
import React, { useState, useMemo, useEffect } from 'react';
import StudentsFilter from './StudentFilters';
import StudentsTable from './StudentTable';
import Pagination from './Pagination';
import StatsCards from './StatsCards';
import StudentProfileModal from './StudentProfile';
import { generateStudents } from '../../utils/studentData';
import { COLORS, generateId, checkExpiringSoon } from '../../utils/helpers';
import { Upload, Plus } from 'lucide-react';
import Modal from '../Setas/Modal';
import EmptyState from '../Setas/EmptyState';
import Toast from '../Setas/Toast';
import ConfirmDialog from '../Setas/ConfirmDialog';

const STUDENTS_PER_PAGE = 30;

export default function StudentManagementSystem() {
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    programme: '',
    faculty: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'studentNr', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  /* -------------------- NEW: Modal Controls -------------------- */
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedFile(null);
  };
  /* ------------------------------------------------------------- */

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const students = await generateStudents();
        setAllStudents(students);
      } catch (error) {
        console.error('Student API integration failed:', error);
        setAllStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Global search listener
  useEffect(() => {
    const handleGlobalSearch = (event) => {
      setSearchTerm(event.detail);
      setCurrentPage(1);
    };

    window.addEventListener('globalSearchChange', handleGlobalSearch);

    if (window.globalSearchTerm !== undefined) {
      setSearchTerm(window.globalSearchTerm);
    }

    return () => {
      window.removeEventListener('globalSearchChange', handleGlobalSearch);
    };
  }, []);

  // Save students
  useEffect(() => {
    if (typeof window !== 'undefined' && allStudents.length > 0) {
      localStorage.setItem('all-students', JSON.stringify(allStudents));
    }
  }, [allStudents]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...allStudents];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(student => {
        const nameMatch = student.name?.toLowerCase().includes(search);
        const studentNrMatch = student.studentNr?.toLowerCase().includes(search);
        const emailMatch = student.email?.toLowerCase().includes(search);
        const programmeMatch = student.programme?.toLowerCase().includes(search);
        const facultyMatch = student.faculty?.toLowerCase().includes(search);
        const idMatch = student.idNumber?.toLowerCase().includes(search);
        const setaMatch = student.seta?.toLowerCase().includes(search);
        const employerMatch = student.employer?.toLowerCase().includes(search);
        return nameMatch || studentNrMatch || emailMatch || programmeMatch || facultyMatch || idMatch || setaMatch || employerMatch;
      });
    }

    if (filters.programme) filtered = filtered.filter(s => s.programme === filters.programme);
    if (filters.faculty) filtered = filtered.filter(s => s.faculty === filters.faculty);

    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = aVal?.toLowerCase();
        bVal = bVal?.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allStudents, searchTerm, filters, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / STUDENTS_PER_PAGE);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * STUDENTS_PER_PAGE,
    currentPage * STUDENTS_PER_PAGE
  );

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ programme: '', faculty: '' });
    setCurrentPage(1);
  };

  const handleQuickAction = (action, student) => {
    if (action === 'view') {
      setSelectedStudent(student);
    }
  };

  if (loading) return <p>Loading students...</p>;

  const handleUploadStudents = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first.");
      return;
    }

    const adminId = sessionStorage.getItem("admin_id");
    if (!adminId) {
      alert("Admin session expired. Please log in again.");
      return;
    }

    console.log("Uploading file:", selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(
        `https://seta-api-3g5xl.ondigitalocean.app/api/administrators/importStudents/${adminId}`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // if using cookies
        }
      );

      console.log("Server responded with status:", res.status);

      if (!res.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {
          // ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Upload response:", data);

      alert(`Upload completed.\nImported: ${data.imported_rows}\nFailed: ${data.failed_rows}`);

      closeModal();
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Upload failed. Please check your CSV format.");
    }
  };
  
  const getModalTitle = () => {
    const titles = {
      uploadStudents: 'Upload Students (CSV)'
    };
    return titles[modalType] || '';
  };

  const renderModalContent = () => {
    switch(modalType) {

      case 'uploadStudents':
        return (
          <div className="space-y-6">

            <div
              className="rounded-lg p-4 text-sm"
              style={{ backgroundColor: COLORS.bgLight }}
            >
              <p className="font-medium mb-2" style={{ color: COLORS.primary }}>
                CSV Format Requirements:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>First Name</li>
                <li>Last Name</li>
                <li>ID Number</li>
                <li>Email</li>
                <li>Phone Number</li>
                <li>Programme</li>
              </ul>
            </div>

            <div className="space-y-3">
              <label
                className="block text-sm font-medium"
                style={{ color: COLORS.primary }}
              >
                Upload CSV File *
              </label>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${selectedFile ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"}
                `}
                style={{ borderColor: selectedFile ? "#16a34a" : COLORS.border }}
                onClick={() => document.getElementById("csvUploadInput").click()}
              >
                <input
                  id="csvUploadInput"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />

                {!selectedFile ? (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium text-gray-700">
                      Click to upload your CSV file
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Only .csv files allowed
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-green-600 font-semibold text-lg">
                      {selectedFile.name}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to replace file
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
                style={{ backgroundColor: COLORS.text }}
              >
                Cancel
              </button>

              <button
                onClick={handleUploadStudents}
                disabled={!selectedFile}
                className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: COLORS.primary }}
              >
                Upload
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => openModal('uploadStudents')}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md mb-4"
          style={{ backgroundColor: COLORS.text }}
        >
          <Upload className="w-5 h-5" />
          Upload Students
        </button>

        <StatsCards students={filteredAndSortedStudents} />

        <StudentsFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          currentPage={currentPage}
          totalStudents={filteredAndSortedStudents.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <StudentsTable
          students={paginatedStudents}
          sortConfig={sortConfig}
          onSort={handleSort}
          onClearFilters={handleClearFilters}
          onQuickAction={handleQuickAction}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {selectedStudent && (
          <StudentProfileModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onSave={(updatedStudent) => {
              setSelectedStudent(null);
            }}
          />
        )}

        {/* Modal Render */}
        {showModal && (
          <Modal
            isOpen={showModal}
            title={getModalTitle()}
            onClose={closeModal}
          >
            {renderModalContent()}
          </Modal>
        )}

      </div>
    </div>
  );
}

export { StudentManagementSystem };