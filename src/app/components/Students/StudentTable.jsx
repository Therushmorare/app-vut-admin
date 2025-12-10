"use client"

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import StudentRow from './StudentRow';

const StudentsTable = ({ students, onClearFilters, onQuickAction }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#201c52] bg-opacity-5 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  <span>Student</span>
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  <span>Programme / Faculty</span>
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onQuickAction={onQuickAction}
              />
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No students found matching your criteria</p>
          <button onClick={onClearFilters} className="text-[#5F9BEA] hover:text-[#201c52] font-medium">
            Clear filters to see all students
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;