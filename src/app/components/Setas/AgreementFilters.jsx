import React from 'react';
import { COLORS } from '../../utils/helpers';

export default function AgreementFilters({ 
  filterStatus, 
  filterFaculty, 
  setFilterStatus, 
  setFilterFaculty,
  filteredCount,
  totalCount
}) {
  return (
    <div className="rounded-lg p-6 mb-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS.border }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        <div>
          <select
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS.border }}
          >
            <option value="">All Faculties</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="IT & Computing">IT & Computing</option>
            <option value="Health Sciences">Health Sciences</option>
            <option value="Applied Sciences">Applied Sciences</option>
          </select>
        </div>
      </div>
      
      {(filterStatus || filterFaculty) && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} agreements
          </p>
          <button
            onClick={() => {
              setFilterStatus('');
              setFilterFaculty('');
            }}
            className="text-sm px-4 py-2 rounded-lg hover:bg-gray-100"
            style={{ color: COLORS.text }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}