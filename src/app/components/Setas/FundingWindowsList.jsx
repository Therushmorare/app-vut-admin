import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function FundingWindowsList({ 
  windows, 
  agreements, 
  allocatedLearners,
  expandedWindows,
  onToggleExpand,
  onAllocate, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="space-y-6">
      {windows.map(window => {
        const agreement = agreements.find(a => a.funding_window_id === window.agreement_id);
        const windowLearners = allocatedLearners.filter(l => l.fundingWindowId === window.funding_window_id);
        const remainingSlots = window.slots_available - windowLearners.length;
        const isExpanded = expandedWindows.includes(window.funding_window_id);
        
        return (
          <div key={window.funding_window_id} className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>{window.windowName}</h3>
                {agreement && (
                  <p className="text-sm text-gray-600">{agreement.name} - {agreement.reference_number}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAllocate({ window, agreement })}
                  disabled={remainingSlots === 0}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.success }}
                >
                  Allocate Learners
                </button>
                <button
                  onClick={() => onEdit(window)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.secondary }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(window)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.danger }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract Period</p>
                <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                  {window.start_data} to {window.end_date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Slots</p>
                <p className="text-xl font-bold" style={{ color: COLORS.primary }}>{window.slots_available}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Allocated</p>
                <p className="text-xl font-bold" style={{ color: COLORS.info }}>{windowLearners.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Remaining</p>
                <p className="text-xl font-bold" style={{ color: remainingSlots > 0 ? COLORS.success : COLORS.danger }}>
                  {remainingSlots}
                </p>
              </div>
            </div>

            {windowLearners.length > 0 && (
              <div className="border-t pt-4 mt-4" style={{ borderColor: COLORS.border }}>
                <button
                  onClick={() => onToggleExpand(window.funding_window_id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                    Allocated Learners ({windowLearners.length})
                  </h4>
                  <span className="text-xs" style={{ color: COLORS.text }}>
                    {isExpanded ? '▼ Hide' : '▶ View'}
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {windowLearners.map(learner => (
                      <div key={learner.studentId} className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                        <p className="font-medium" style={{ color: COLORS.primary }}>
                          {learner.firstName} {learner.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{learner.studentId} • {learner.programme}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {window.programmeName && (
              <div className="border-t pt-4 mt-4" style={{ borderColor: COLORS.border }}>
                <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Programme Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Programme Name</p>
                    <p className="font-medium" style={{ color: COLORS.primary }}>{window.programmeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium" style={{ color: COLORS.primary }}>{window.programmeDuration} months</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}