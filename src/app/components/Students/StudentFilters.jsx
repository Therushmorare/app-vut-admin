"use client"

import React from 'react';
import { Search, BookOpen, Building2 } from 'lucide-react';

const STUDENTS_PER_PAGE = 30;

const StudentsFilter = ({ filters, onFilterChange, onClearFilters, currentPage, totalStudents, searchTerm, onSearchChange }) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <BookOpen size={16} className="mr-1" />
              Programme
            </label>
            <select
              value={filters.programme}
              onChange={(e) => onFilterChange('programme', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0245A3] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All programmes</option>
              <option value="National Certificate: IT Systems Support">National Certificate: IT Systems Support</option>
              <option value="National Diploma: Software Development">National Diploma: Software Development</option>
              <option value="Certificate: Data Analytics">Certificate: Data Analytics</option>
              <option value="Diploma: Business Administration">Diploma: Business Administration</option>
              <option value="Certificate: Project Management">Certificate: Project Management</option>
              <option value="Higher Certificate: Marketing">Higher Certificate: Marketing</option>
              <option value="National Diploma: Human Resources">National Diploma: Human Resources</option>
              <option value="Certificate: Financial Management">Certificate: Financial Management</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Building2 size={16} className="mr-1" />
              Faculty
            </label>
            <select
              value={filters.faculty}
              onChange={(e) => onFilterChange('faculty', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0245A3] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All faculties</option>
              <option value="Faculty of Information Technology">Faculty of Information Technology</option>
              <option value="Faculty of Business Management">Faculty of Business Management</option>
              <option value="Faculty of Engineering">Faculty of Engineering</option>
              <option value="Faculty of Commerce">Faculty of Commerce</option>
              <option value="Faculty of Humanities">Faculty of Humanities</option>
              <option value="Faculty of Education">Faculty of Education</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {Math.min(((currentPage - 1) * STUDENTS_PER_PAGE) + 1, totalStudents)} to {Math.min(currentPage * STUDENTS_PER_PAGE, totalStudents)} of {totalStudents.toLocaleString()} students
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsFilter;