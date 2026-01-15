"use client";

import React from "react";
import { BookOpen, Building2 } from "lucide-react";
import { FACULTIES, PROGRAMMES_BY_FACULTY } from "../../constants/facultiesProgrammes";

const STUDENTS_PER_PAGE = 30;

const StudentsFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  currentPage,
  totalStudents,
}) => {
  const programmes =
    filters.faculty && PROGRAMMES_BY_FACULTY[filters.faculty]
      ? PROGRAMMES_BY_FACULTY[filters.faculty]
      : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FACULTY */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Building2 size={16} className="mr-1" />
            Faculty
          </label>
          <select
            value={filters.faculty}
            onChange={(e) => {
              onFilterChange("faculty", e.target.value);
              onFilterChange("programme", ""); // reset programme
            }}
            className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0245A3] focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All faculties</option>
            {FACULTIES.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>

        {/* PROGRAMME */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <BookOpen size={16} className="mr-1" />
            Programme
          </label>
          <select
            value={filters.programme}
            onChange={(e) => onFilterChange("programme", e.target.value)}
            disabled={!filters.faculty}
            className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0245A3] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          >
            <option value="">
              {filters.faculty ? "All programmes" : "Select faculty first"}
            </option>
            {programmes.map((programme) => (
              <option key={programme} value={programme}>
                {programme}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Clear all filters
        </button>

        <div className="text-sm text-gray-600">
          Showing{" "}
          {Math.min((currentPage - 1) * STUDENTS_PER_PAGE + 1, totalStudents)} to{" "}
          {Math.min(currentPage * STUDENTS_PER_PAGE, totalStudents)} of{" "}
          {totalStudents.toLocaleString()} students
        </div>
      </div>
    </div>
  );
};

export default StudentsFilter;