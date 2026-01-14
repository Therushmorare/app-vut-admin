import React from 'react';
import { COLORS } from '../../../utils/helpers';

export default function ActivityLogFilters({ logFilter, setLogFilter, logDateFilter, setLogDateFilter }) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      <select
        value={logFilter}
        onChange={(e) => setLogFilter(e.target.value)}
        className="text-xs px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
        style={{ borderColor: COLORS.border }}
      >
        <option value="all">All Actions</option>
        <option value="VIEW">Views Only</option>
        <option value="DOWNLOAD">Downloads Only</option>
        <option value="UPLOAD">Uploads Only</option>
        <option value="DELETE">Deletes Only</option>
      </select>
      <select
        value={logDateFilter}
        onChange={(e) => setLogDateFilter(e.target.value)}
        className="text-xs px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
        style={{ borderColor: COLORS.border }}
      >
        <option value="all">All Time</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
      </select>
    </div>
  );
}