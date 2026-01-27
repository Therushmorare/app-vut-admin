"use client"
import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, ChevronDown, ChevronUp, Building2, User, Calendar, Mail, Phone } from 'lucide-react';
import { COLORS, formatDate } from '../../utils/helpers';

export default function PlacementTable({ 
  placements = [], 
  allocatedLearners = [], 
  companies = [],
  students = [],
  onEdit,
  onDelete,
  onView
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const enrichedPlacements = useMemo(() => {
    return placements.map(placement => {
      const learner = students.find(
        s => s.id === placement.student_id
      );

      const company = companies.find(
        c => c.company_id === placement.company_id || c.id === placement.company_id
      );

      return {
        ...placement,

        // normalize fields WITHOUT breaking existing usage
        learner,
        company,

        // keep camelCase aliases your UI already uses
        learnerId: placement.student_id,
        companyId: placement.company_id,
        startDate: placement.start_date,
        endDate: placement.end_date
      };
    });
  }, [placements, students, companies]);

  const filteredPlacements = useMemo(() => {
    return enrichedPlacements.filter(item => {
      const { learner, company } = item;

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const learnerName = learner
          ? `${learner.first_name ?? learner.firstName} ${learner.last_name ?? learner.lastName}`.toLowerCase()
          : '';

        const studentId =
          learner?.student_number?.toLowerCase() ||
          learner?.studentId?.toLowerCase() ||
          '';
        const companyName = company?.company_name?.toLowerCase() || '';
        if (!learnerName.includes(search) && 
            !studentId.includes(search) && 
            !companyName.includes(search)) {
          return false;
        }
      }

      if (filterStatus && item.status !== filterStatus) return false;

      if (filterCompany && item.company_id !== filterCompany) return false;

      return true;
    });
  }, [enrichedPlacements, searchTerm, filterStatus, filterCompany]);

  const sortedPlacements = useMemo(() => {
    if (!sortField) return filteredPlacements;

    return [...filteredPlacements].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
      case 'learner':
        aVal = a.learner
          ? `${a.learner.first_name ?? a.learner.firstName} ${a.learner.last_name ?? a.learner.lastName}`
          : '';
        bVal = b.learner
          ? `${b.learner.first_name ?? b.learner.firstName} ${b.learner.last_name ?? b.learner.lastName}`
          : '';
        break;

      case 'company':
        aVal = a.company?.company_name || a.company?.companyName || '';
        bVal = b.company?.company_name || b.company?.companyName || '';
        break;

      case 'startDate':
        aVal = new Date(a.start_date ?? a.startDate);
        bVal = new Date(b.start_date ?? b.startDate);
        break;

      case 'endDate':
        aVal = new Date(a.end_date ?? a.endDate);
        bVal = new Date(b.end_date ?? b.endDate);
        break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPlacements, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedPlacements.length / itemsPerPage);
  const paginatedPlacements = sortedPlacements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" style={{ color: COLORS.primary }} /> : 
      <ChevronDown className="w-4 h-4" style={{ color: COLORS.primary }} />;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'Terminated': 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by learner name, student ID, or company..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          <div>
            <select
              value={filterCompany}
              onChange={(e) => {
                setFilterCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company.company_id} value={company.company_id}>
                  {company.company_name || company.companyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterStatus || filterCompany) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {sortedPlacements.length} of {placements.length} placements
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setFilterCompany('');
                setCurrentPage(1);
              }}
              className="text-sm px-4 py-2 rounded-lg hover:bg-gray-100"
              style={{ color: COLORS.text }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm border overflow-hidden" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        {paginatedPlacements.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: COLORS.bgLight }}>
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('learner')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Learner</span>
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Company</span>
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Start Date</span>
                        <SortIcon field="startDate" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('endDate')}
                    >
                      <div className="flex items-center gap-2">
                        <span>End Date</span>
                        <SortIcon field="endDate" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                  {paginatedPlacements.map((item) => {
                    const { learner, company } = item;
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                              <User className="w-5 h-5" style={{ color: COLORS.primary }} />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: COLORS.primary }}>
                                {learner ? `${learner.first_name} ${learner.last_name}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {learner?.id || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium" style={{ color: COLORS.primary }}>
                                {company?.company_name || 'Unknown'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {company?.industry || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(item.startDate)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(item.endDate)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: COLORS.border }}>
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedPlacements.length)} of {sortedPlacements.length} placements
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          currentPage === i + 1 
                            ? 'text-white' 
                            : 'hover:bg-gray-50'
                        }`}
                        style={{ 
                          backgroundColor: currentPage === i + 1 ? COLORS.primary : 'transparent',
                          color: currentPage === i + 1 ? 'white' : COLORS.text
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
              No placements found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus || filterCompany
                ? 'Try adjusting your filters'
                : 'Placements will appear here once learners are placed at companies'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlacementStats({ placements }) {
  const stats = {
    total: placements.length,
    active: placements.filter(p => p.status === 'Active').length,
    completed: placements.filter(p => p.status === 'Completed').length,
    onHold: placements.filter(p => p.status === 'On Hold').length,
    terminated: placements.filter(p => p.status === 'Terminated').length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <p className="text-xs text-gray-600 mb-1">Total</p>
        <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{stats.total}</p>
      </div>
      
      <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <p className="text-xs text-gray-600 mb-1">Active</p>
        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
      </div>
      
      <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <p className="text-xs text-gray-600 mb-1">Completed</p>
        <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
      </div>
      
      <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <p className="text-xs text-gray-600 mb-1">On Hold</p>
        <p className="text-2xl font-bold text-yellow-600">{stats.onHold}</p>
      </div>
      
      <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <p className="text-xs text-gray-600 mb-1">Terminated</p>
        <p className="text-2xl font-bold text-red-600">{stats.terminated}</p>
      </div>
    </div>
  );
}