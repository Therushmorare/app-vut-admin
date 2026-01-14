import React from 'react';
import { Activity, Download } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';
import ActivityLogFilters from './ActivityLogFilters';
import ActivityLogItem from './ActivityLogItem';

export default function ActivityLogs({ 
  logs, 
  profile,
  logFilter, 
  setLogFilter, 
  logDateFilter, 
  setLogDateFilter,
  onExportLogs,
  getActionIcon,
  getActionColor 
}) {
  return (
    <div className="border-t-2 pt-4" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
          <Activity className="w-4 h-4" />
          Activity Logs
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => onExportLogs(profile, 'csv')}
            className="text-xs px-3 py-2 rounded-lg border-2 hover:shadow-md transition-all flex items-center gap-1 font-semibold"
            style={{ color: COLORS.success, borderColor: COLORS.success }}
            title="Export as CSV"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>
      </div>

      <ActivityLogFilters
        logFilter={logFilter}
        setLogFilter={setLogFilter}
        logDateFilter={logDateFilter}
        setLogDateFilter={setLogDateFilter}
      />

      {logs.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {logs.slice().reverse().map((log, index) => (
            <ActivityLogItem
              key={index}
              log={log}
              getActionIcon={getActionIcon}
              getActionColor={getActionColor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: COLORS.primary }} />
          <p className="text-sm text-gray-500">No activity logs found</p>
          <p className="text-xs text-gray-400 mt-1">Logs will appear here when documents are accessed</p>
        </div>
      )}
    </div>
  );
}