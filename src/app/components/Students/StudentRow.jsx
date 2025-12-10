"use client"

import React from 'react';
import { Eye, FileText } from 'lucide-react';

const StudentRow = ({ student, onQuickAction }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img src={student.avatar} alt={student.name} className="w-full h-full object-cover  " />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-[#201c52]">{student.name}</h4>
          <p className="text-xs text-[#201c52] font-mono">{student.studentNr}</p>
        </div>
      </div>
    </td>

    <td className="p-4">
      <div className="text-sm text-gray-700">{student.programme}</div>
      <div className="text-xs text-[#d08a00] mt-1">{student.faculty}</div>
    </td>

    <td className="p-4">
      <div className="text-sm text-[#201c52]">{student.email}</div>
    </td>

    <td className="p-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onQuickAction('view', student)}
          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-[#d08a00] hover:text-white hover:border-[#d08a00] rounded-md transition-colors"
          title="View Details"
        >
          <Eye size={14} className="mr-1.5" />
          View
        </button>
      </div>
    </td>
  </tr>
);

export default StudentRow;