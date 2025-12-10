"use client"

import React, { useMemo } from 'react';
import { Users, BookOpen, Building2 } from 'lucide-react';

const StatsCards = ({ students }) => {
  const stats = useMemo(() => {
    const total = students.length;

    const facultyCounts = students.reduce((acc, student) => {
      const faculty = student.faculty || 'Unknown';
      acc[faculty] = (acc[faculty] || 0) + 1;
      return acc;
    }, {});

    const programmeCounts = students.reduce((acc, student) => {
      const programme = student.programme || 'Unknown';
      acc[programme] = (acc[programme] || 0) + 1;
      return acc;
    }, {});
    
    const topFaculties = Object.entries(facultyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topProgrammes = Object.entries(programmeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { 
      total,
      facultyCounts,
      programmeCounts,
      topFaculties,
      topProgrammes
    };
  }, [students]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Students */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-4xl font-bold text-[#0245A3]">{stats.total}</p>
          </div>
          <div className="w-16 h-16 bg-[#0245A3] bg-opacity-10 rounded-full flex items-center justify-center">
            <Users className="text-white" size={32} />
          </div>
        </div>
        <p className="text-xs text-gray-500">Currently enrolled students</p>
      </div>

      {/* Students by Faculty */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">By Faculty</p>
            <p className="text-2xl font-bold text-[#0245A3]">{Object.keys(stats.facultyCounts).length}</p>
            <p className="text-xs text-gray-500 mb-3">Faculties</p>
          </div>
          <div className="w-16 h-16 bg-[#3A6F47] bg-opacity-10 rounded-full flex items-center justify-center">
            <Building2 className="text-white" size={32} />
          </div>
        </div>
        
        <div className="space-y-2">
          {stats.topFaculties.length > 0 ? (
            stats.topFaculties.map(([faculty, count]) => (
              <div key={faculty} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate flex-1 mr-2" title={faculty}>
                  {faculty.length > 25 ? faculty.substring(0, 25) + '...' : faculty}
                </span>
                <span className="font-semibold text-[#0245A3] whitespace-nowrap">{count}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">No faculty data</p>
          )}
        </div>
      </div>

      {/* Students by Programme */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">By Programme</p>
            <p className="text-2xl font-bold text-[#0245A3]">{Object.keys(stats.programmeCounts).length}</p>
            <p className="text-xs text-gray-500 mb-3">Programmes</p>
          </div>
          <div className="w-16 h-16 bg-[#f8a528] bg-opacity-10 rounded-full flex items-center justify-center">
            <BookOpen className="text-white" size={32} />
          </div>
        </div>
        
        <div className="space-y-2">
          {stats.topProgrammes.length > 0 ? (
            stats.topProgrammes.map(([programme, count]) => (
              <div key={programme} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate flex-1 mr-2" title={programme}>
                  {programme.length > 25 ? programme.substring(0, 25) + '...' : programme}
                </span>
                <span className="font-semibold text-[#0245A3] whitespace-nowrap">{count}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">No programme data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;