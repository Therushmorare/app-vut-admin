import React from 'react';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Active Agreements</h3>
          <CheckCircle className="w-5 h-5" style={{ color: COLORS.success }} />
        </div>
        <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.active}</p>
      </div>

      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Expired</h3>
          <XCircle className="w-5 h-5" style={{ color: COLORS.danger }} />
        </div>
        <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.expired}</p>
      </div>
      
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Funding Windows</h3>
          <DollarSign className="w-5 h-5" style={{ color: COLORS.info }} />
        </div>
        <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{stats.totalWindows}</p>
      </div>
    </div>
  );
}