"use client"
import React, { useState, useMemo } from 'react';
import { Search, User, CheckCircle } from 'lucide-react';
import { COLORS } from '../../utils/helpers';
import axios from 'axios';

export default function LearnerAllocationForm({ 
  fundingWindow, 
  agreement, 
  program,
  allStudents, 
  allocatedLearners, 
  onSubmit, 
  onCancel 
}) {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [filterProgramme, setFilterProgramme] = useState('');

  const allocatedStudentIds = allocatedLearners.map(l => l.studentId);
  
  const remainingSlots = fundingWindow.slots_available - allocatedLearners.filter(l => l.fundingWindowId === fundingWindow.funding_window_id).length;

  const faculties = [...new Set(allStudents.map(s => s.faculty).filter(Boolean))];
  const programmes = [...new Set(allStudents.map(s => s.programme).filter(Boolean))];

  const availableStudents = useMemo(() => {
    return allStudents.filter(student => {
      if (student.status !== 'Pending') return false;
      if (allocatedStudentIds.includes(student.id)) return false;
      

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          student.first_name?.toLowerCase().includes(search) ||
          student.id?.toLowerCase().includes(search) ||
          student.student_number?.toLowerCase().includes(search) ||
          student.email?.toLowerCase().includes(search) ||
          student.ID_number?.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      if (filterFaculty && student.faculty !== filterFaculty) return false;

      if (filterProgramme && student.programme !== filterProgramme) return false;

      return true;
    });
  }, [allStudents, searchTerm, filterFaculty, filterProgramme, allocatedStudentIds]);

  const handleToggleStudent = (student) => {
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      if (selectedStudents.length >= remainingSlots) {
        alert(`You can only allocate ${remainingSlots} more learner(s)`);
        return;
      }
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one learner');
      return;
    }

    try {
      const payload = {
        administrator_id: sessionStorage.getItem('admin_id'), // or from auth context
        students: selectedStudents.map(s => ({
          student_id: s.id
        }))
      };

      await axios.post(
        `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/programmes/${program.programme_id}/allocate-learners`,
        payload,
        { withCredentials: true }
      );

      // optional: update UI cache
      const allocations = selectedStudents.map(student => ({
        fundingWindowId: fundingWindow.funding_window_id,
        agreementId: agreement.agreement_id,
        programmeId: program.programme_id,
        studentId: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        programme: student.programme
      }));

      onSubmit(allocations);
    } catch (err) {
      console.error("Allocation failed:", err);
      alert(
        err.response?.data?.message ||
        "Failed to allocate learners"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Window Info */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
        <h3 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
          {fundingWindow.funding_window_name}
        </h3>
          <p className="text-sm text-gray-600">
            {agreement.name} - {agreement.reference_number}
          </p>
        <div className="mt-2 flex gap-4 text-sm">
          <span>
            <strong>Available Slots:</strong> {remainingSlots}
          </span>
          <span>
            <strong>Selected:</strong> {selectedStudents.length}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, student number, ID, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: COLORS.border }}
          >
            <option value="">All Faculties</option>
            {faculties.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>

          <select
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: COLORS.border }}
          >
            <option value="">All Programmes</option>
            {programmes.map(programme => (
              <option key={programme} value={programme}>{programme}</option>
            ))}
          </select>
        </div>

        {(searchTerm || filterFaculty || filterProgramme) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {availableStudents.length} student(s)
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterFaculty('');
                setFilterProgramme('');
              }}
              className="text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Student List */}
      <div className="border rounded-lg max-h-96 overflow-y-auto" style={{ borderColor: COLORS.border }}>
        {availableStudents.length > 0 ? (
          <div className="divide-y" style={{ divideColor: COLORS.border }}>
            {availableStudents.map(student => {
              const isSelected = selectedStudents.find(s => s.id === student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => handleToggleStudent(student)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <User className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-semibold" style={{ color: COLORS.primary }}>
                          {student.first_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {student.id} • {student.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {student.programme}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>{student.faculty}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No available students found</p>
            {(searchTerm || filterFaculty || filterProgramme) && (
              <p className="text-sm mt-1">Try adjusting your filters</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedStudents.length === 0}
          className="flex-1 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: COLORS.success }}
        >
          Allocate {selectedStudents.length} Learner(s)
        </button>
      </div>
    </div>
  );
}