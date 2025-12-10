"use client"

import React, { useMemo } from 'react';

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
