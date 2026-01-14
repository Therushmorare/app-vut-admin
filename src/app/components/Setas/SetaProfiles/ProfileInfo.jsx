import React from 'react';
import { Calendar, User } from 'lucide-react';
import { COLORS } from '../../../utils/helpers';

export default function ProfileInfo({ profile }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Financial Year
          </p>
          <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
            {profile.financialYear}
          </p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            Contact Person
          </p>
          <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
            {profile.contactPerson || 'N/A'}
          </p>
        </div>
      </div>
      
      {profile.programTypes && profile.programTypes.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-semibold">PROGRAM TYPES</p>
          <div className="flex flex-wrap gap-2">
            {profile.programTypes.map(type => (
              <span 
                key={type} 
                className="px-4 py-2 rounded-full text-xs font-bold shadow-sm" 
                style={{ backgroundColor: COLORS.info + '20', color: COLORS.info }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}