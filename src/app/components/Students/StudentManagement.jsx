"use client"
import React, { useState, useMemo, useEffect } from 'react';
import StudentsFilter from './StudentFilters';
import StudentsTable from './StudentTable';
import Pagination from './Pagination';
import StatsCards from './StatsCards';
import StudentProfileModal from './StudentProfile';
import { generateStudents } from '../../utils/studentData';

const STUDENTS_PER_PAGE = 30;

export default function StudentManagementSystem() {
  const [allStudents] = useState(() => generateStudents(150));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    programme: '',
    faculty: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'studentNr', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
  }, [searchTerm]);

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

    if (filters.programme) {
      filtered = filtered.filter(s => s.programme === filters.programme);
    }
    if (filters.faculty) {
      filtered = filtered.filter(s => s.faculty === filters.faculty);
    }


    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
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
              console.log('Updated student:', updatedStudent);
              setSelectedStudent(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export { StudentManagementSystem };