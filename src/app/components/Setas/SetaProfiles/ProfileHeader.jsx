import React from 'react';
import { Edit, Trash2, FileText } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';

export default function ProfileHeader({ profile, agreement, onEdit, onDelete }) {
  return (
    <div className="p-6 border-b-2" style={{ backgroundColor: COLORS.bgLight, borderColor: COLORS.border }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {profile.profileName}
          </h3>
          {agreement && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{agreement.name} - {agreement.reference_number}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(profile)}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ backgroundColor: COLORS.secondary + '20', color: COLORS.secondary }}
            title="Edit Profile"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(profile)}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ backgroundColor: COLORS.danger + '20', color: COLORS.danger }}
            title="Delete Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {profile.description && (
        <p className="text-sm text-gray-600 italic border-l-4 pl-3 py-1" style={{ borderColor: COLORS.info }}>
          {profile.description}
        </p>
      )}
    </div>
  );
}