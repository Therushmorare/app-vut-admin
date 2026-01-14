import React, { useState } from 'react';
import { FileText, Eye, Edit, Trash2, AlertCircle, CheckCircle, Clock, XCircle, MessageSquare } from 'lucide-react';
import { COLORS, checkExpiringSoon, getStatusColor } from '../../utils/helpers';
import CommentLog from './CommentLog';

const getStatusIcon = (status) => {
  switch(status) {
    case 'Active': return <CheckCircle className="w-4 h-4" />;
    case 'Pending': return <Clock className="w-4 h-4" />;
    case 'Expired': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

export default function AgreementsTable({ agreements, onView, onEdit, onDelete, onCreateProfile }) {
  const [selectedAgreementForLog, setSelectedAgreementForLog] = useState(null);
  const [showCommentLog, setShowCommentLog] = useState(false);

  return (
    <>
      <div className="rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: COLORS.primary }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Agreement Ref</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">SETA Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Faculty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Period</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Profile</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Activity Log</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: COLORS.border }}>
              {agreements.map((agreement) => (
                <tr key={agreement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: COLORS.text }} />
                      <span className="font-medium" style={{ color: COLORS.primary }}>
                        {agreement.agreementRef}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: COLORS.primary }}>
                    {agreement.setaName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{agreement.faculty}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{agreement.startDate}</div>
                    <div className="text-xs">to {agreement.endDate}</div>
                    {checkExpiringSoon(agreement.endDate) && (
                      <div className="flex items-center gap-1 mt-1 text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs">Expiring soon</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(agreement.status)}`}>
                      {getStatusIcon(agreement.status)}
                      {agreement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {agreement.hasProfile ? (
                      <span className="text-green-600 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Created
                      </span>
                    ) : (
                      <button
                        onClick={() => onCreateProfile(agreement)}
                        disabled={agreement.status !== 'Active'}
                        className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: COLORS.text, borderColor: COLORS.text }}
                      >
                        Create Profile
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(agreement)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        style={{ color: COLORS.text }}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(agreement)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        style={{ color: COLORS.secondary }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(agreement)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        style={{ color: COLORS.danger }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="ml-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAgreementForLog(agreement);
                          setShowCommentLog(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        style={{ color: COLORS.info }}
                        title="Activity Log"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCommentLog && selectedAgreementForLog && (
        <CommentLog
          agreementId={selectedAgreementForLog.id}
          agreementRef={selectedAgreementForLog.agreementRef}
          onClose={() => {
            setShowCommentLog(false);
            setSelectedAgreementForLog(null);
          }}
        />
      )}
    </>
  );
}