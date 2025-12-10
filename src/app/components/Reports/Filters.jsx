"use client"
import React, { useState, useMemo } from 'react';
import { Filter, X, RefreshCw } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function AdvancedFilters({
  companies = [],
  agreements = [],
  fundingWindows = [],
  allocatedLearners = [],
  onFilterChange
}) {
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

  const [showFilters, setShowFilters] = useState(true);

  const filterOptions = useMemo(() => {
    const faculties = [...new Set(allocatedLearners.map(l => l.faculty).filter(Boolean))];
    const programmes = [...new Set(allocatedLearners.map(l => l.programme).filter(Boolean))];
    const years = [...new Set(fundingWindows.map(w => {
      const year = new Date(w.startDate).getFullYear();
      return year;
    }).filter(Boolean))].sort((a, b) => b - a);

    return { faculties, programmes, years };
  }, [allocatedLearners, fundingWindows]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      faculty: '',
      seta: '',
      programme: '',
      fundingWindow: '',
      status: '',
      documentComplete: '',
      timesheetComplete: '',
      hostCompany: '',
      year: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="rounded-lg shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h3 className="text-lg font-bold" style={{ color: COLORS.primary }}>Advanced Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              style={{ color: COLORS.text }}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: COLORS.text }}
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {showFilters && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Faculty */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Faculty
              </label>
              <select
                value={filters.faculty}
                onChange={(e) => handleFilterChange('faculty', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All Faculties</option>
                {filterOptions.faculties.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>

            {/* SETA */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                SETA
              </label>
              <select
                value={filters.seta}
                onChange={(e) => handleFilterChange('seta', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All SETAs</option>
                {agreements.filter(a => a.status === 'Active').map(agreement => (
                  <option key={agreement.id} value={agreement.id}>
                    {agreement.setaName}
                  </option>
                ))}
              </select>
            </div>

            {/* Programme */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Programme
              </label>
              <select
                value={filters.programme}
                onChange={(e) => handleFilterChange('programme', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All Programmes</option>
                {filterOptions.programmes.map(programme => (
                  <option key={programme} value={programme}>{programme}</option>
                ))}
              </select>
            </div>

            {/* Funding Window */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Funding Window
              </label>
              <select
                value={filters.fundingWindow}
                onChange={(e) => handleFilterChange('fundingWindow', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All Windows</option>
                {fundingWindows.map(window => (
                  <option key={window.id} value={window.id}>
                    {window.windowName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Placement Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Terminated">Terminated</option>
                <option value="Unplaced">Unplaced</option>
              </select>
            </div>

            {/* Document Completeness */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Document Status
              </label>
              <select
                value={filters.documentComplete}
                onChange={(e) => handleFilterChange('documentComplete', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>

            {/* Timesheet Completeness */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Timesheet Status
              </label>
              <select
                value={filters.timesheetComplete}
                onChange={(e) => handleFilterChange('timesheetComplete', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All</option>
                <option value="upToDate">Up to Date</option>
                <option value="overdue">Overdue</option>
                <option value="notStarted">Not Started</option>
              </select>
            </div>

            {/* Host Company */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Host Company
              </label>
              <select
                value={filters.hostCompany}
                onChange={(e) => handleFilterChange('hostCompany', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">All Years</option>
                {filterOptions.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}