"use client"
import React from 'react';
import { User, Calendar, Briefcase, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { COLORS, formatDate } from '../../utils/helpers';

export default function PlacementDisplay({ 
  placements, 
  allocatedLearners, 
  companies,
  onEdit,
  onDelete 
}) {
  
  const getPlacementDetails = (placement) => {
    const learner = allocatedLearners.find(l => l.id === placement.learnerId);
    const company = companies.find(c => c.id === placement.companyId);
    
    return {
      learner,
      company,
      placement
    };
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

  if (placements.length === 0) {
    return (
      <div className="rounded-lg p-12 text-center" style={{ backgroundColor: COLORS.bgWhite }}>
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
          No placements yet
        </h3>
        <p className="text-gray-600">
          Placements will appear here once learners are placed at host companies
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {placements.map(placement => {
        const { learner, company } = getPlacementDetails(placement);
        
        if (!learner || !company) return null;

        return (
          <div 
            key={placement.id} 
            className="rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
            style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                  <User className="w-6 h-6" style={{ color: COLORS.primary }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: COLORS.primary }}>
                    {learner.firstName} {learner.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {learner.studentId || learner.id} • {learner.programme}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(placement.status)}`}>
                  {placement.status}
                </span>
                <button
                  onClick={() => onEdit(placement)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.secondary }}
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(placement)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.danger }}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Company Info */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-sm" style={{ color: COLORS.primary }}>
                  {company.companyName}
                </span>
              </div>
              <p className="text-xs text-gray-600">{company.address}</p>
            </div>

            {/* Placement Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">Start Date</span>
                </div>
                <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                  {formatDate(placement.startDate)}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">End Date</span>
                </div>
                <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                  {formatDate(placement.endDate)}
                </p>
              </div>
            </div>

            {/* Supervisor Details */}
            <div className="border-t pt-4" style={{ borderColor: COLORS.border }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: COLORS.primary }}>
                Workplace Supervisor
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{placement.supervisorName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{placement.supervisorEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{placement.supervisorPhone}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {placement.notes && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                <p className="text-sm text-gray-600">{placement.notes}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
