import React from 'react';
import { Clock, User } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';

export default function ActivityLogItem({ log, getActionIcon, getActionColor }) {
  return (
    <div 
      className="p-3 rounded-lg border-l-4 transition-all hover:shadow-md"
      style={{ 
        backgroundColor: COLORS.bgLight,
        borderColor: getActionColor(log.action)
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getActionIcon(log.action)}
          <span className="text-xs font-bold px-2 py-1 rounded" style={{ 
            backgroundColor: getActionColor(log.action) + '20',
            color: getActionColor(log.action)
          }}>
            {log.action}
          </span>
        </div>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(log.timestamp).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: COLORS.primary }}>
        {log.documentName}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {log.user} ({log.userRole || 'User'})
        </span>
        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}