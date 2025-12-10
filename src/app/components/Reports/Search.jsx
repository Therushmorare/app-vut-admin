"use client"
import React, { useState, useMemo } from 'react';
import { Search, User, Building2, FileText, Calendar, Download, Eye } from 'lucide-react';
import { COLORS, formatDate } from '../../utils/helpers';

export default function LearnerSearch({
  placements = [],
  allocatedLearners = [],
  companies = [],
  agreements = [],
  filters = {},
  onQuickAction
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLearners = useMemo(() => {
    let results = allocatedLearners;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(learner => {
        const fullName = `${learner.firstName || ''} ${learner.lastName || ''}`.toLowerCase();
        const studentId = (learner.studentId || '').toLowerCase();
        const idNumber = (learner.idNumber || '').toLowerCase();
        const email = (learner.email || '').toLowerCase();
        
        return (
          fullName.includes(search) ||
          studentId.includes(search) ||
          idNumber.includes(search) ||
          email.includes(search)
        );
      });
    }

    if (filters.faculty) {
      results = results.filter(l => l.faculty === filters.faculty);
    }

    if (filters.seta) {
      results = results.filter(l => l.agreementId === filters.seta);
    }

    if (filters.programme) {
      results = results.filter(l => l.programme === filters.programme);
    }

    if (filters.fundingWindow) {
      results = results.filter(l => l.fundingWindowId === filters.fundingWindow);
    }

    if (filters.status) {
      const placedLearnerIds = placements.map(p => p.learnerId);
      if (filters.status === 'Unplaced') {
        results = results.filter(l => !placedLearnerIds.includes(l.id));
      } else {
        results = results.filter(l => {
          const placement = placements.find(p => p.learnerId === l.id);
          return placement && placement.status === filters.status;
        });
      }
    }

    if (filters.hostCompany) {
      const companyPlacements = placements.filter(p => p.companyId === filters.hostCompany);
      const learnerIds = companyPlacements.map(p => p.learnerId);
      results = results.filter(l => learnerIds.includes(l.id));
    }

    if (filters.year) {
      results = results.filter(l => {
        const placement = placements.find(p => p.learnerId === l.id);
        if (!placement) return false;
        const year = new Date(placement.startDate).getFullYear();
        return year.toString() === filters.year;
      });
    }

    return results;
  }, [allocatedLearners, searchTerm, filters, placements]);

  const totalPages = Math.ceil(filteredLearners.length / itemsPerPage);
  const paginatedLearners = filteredLearners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const enrichedLearners = paginatedLearners.map(learner => {
    const placement = placements.find(p => p.learnerId === learner.id);
    const company = placement ? companies.find(c => c.id === placement.companyId) : null;
    const agreement = agreements.find(a => a.id === learner.agreementId);
    
    return {
      ...learner,
      placement,
      company,
      agreement
    };
  });

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'Terminated': 'bg-red-100 text-red-800',
      'Unplaced': 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Student ID', 'Faculty', 'Programme', 'SETA', 'Status', 'Host Company', 'Start Date', 'End Date'];
    const rows = enrichedLearners.map(l => [
      `${l.firstName} ${l.lastName}`,
      l.studentId || '',
      l.faculty || '',
      l.programme || '',
      l.agreement?.setaName || '',
      l.placement?.status || 'Unplaced',
      l.company?.companyName || '',
      l.placement?.startDate || '',
      l.placement?.endDate || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learners-search-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="rounded-lg p-4 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, student number, ID number, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
            />
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredLearners.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.success }}
          >
            <Download className="w-5 h-5" />
            <span>Export Results</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Found {filteredLearners.length} learner{filteredLearners.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Results */}
      {enrichedLearners.length > 0 ? (
        <>
          <div className="rounded-lg shadow-sm border overflow-hidden" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: COLORS.bgLight }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Learner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Programme</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">SETA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Host Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Dates</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                  {enrichedLearners.map(learner => (
                    <tr key={learner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                            <User className="w-5 h-5" style={{ color: COLORS.primary }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: COLORS.primary }}>
                              {learner.firstName} {learner.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{learner.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                          {learner.programme || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{learner.faculty || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm" style={{ color: COLORS.primary }}>
                          {learner.agreement?.setaName || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(learner.placement?.status || 'Unplaced')}`}>
                          {learner.placement?.status || 'Unplaced'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {learner.company ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                                {learner.company.companyName}
                              </p>
                              <p className="text-xs text-gray-500">{learner.company.industrySector}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not placed</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {learner.placement ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(learner.placement.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(learner.placement.endDate)}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onQuickAction && onQuickAction('view', learner)}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-[#d08a00] hover:text-white hover:border-[#d08a00] rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 rounded-lg shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLearners.length)} of {filteredLearners.length}
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
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          currentPage === pageNum ? 'text-white' : 'hover:bg-gray-50'
                        }`}
                        style={{ 
                          backgroundColor: currentPage === pageNum ? COLORS.primary : 'transparent',
                          color: currentPage === pageNum ? 'white' : COLORS.text
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
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
        <div className="rounded-lg p-12 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
            No results found
          </h3>
          <p className="text-gray-600">
            {searchTerm || Object.values(filters).some(v => v !== '') 
              ? 'Try adjusting your search or filters' 
              : 'Start by searching for learners or applying filters'}
          </p>
        </div>
      )}
    </div>
  );
}