import React, { useState, useEffect } from 'react';
import { MessageSquare, Download, Send, Clock, User, FileText, X, TrendingUp, AlertCircle } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

const mapLogType = (logType) => {
  switch (logType.toUpperCase()) {
    case 'STATUS_UPDATE': return 'Status Change';
    case 'ISSUE': return 'Issue';
    case 'UPDATE': return 'Update';
    default: return 'Comment';
  }
};

const CommentLog = ({ agreementId, agreementRef, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState('Comment');
  const [userName] = useState('Current User');

  useEffect(() => {
    fetchComments();
  }, [agreementId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        'https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/all-activity-logs'
      );

      const data = await res.json();

      // Filter logs for this agreement
      const filtered = data.filter(
        log => log.agreement_id === agreementId
      );

      // Map API → UI model
      const mapped = filtered
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((log, idx) => ({
          id: `${log.agreement_id}-${idx}`,
          text: log.comment,
          type: mapLogType(log.log_type),
          userName: log.logger,
          timestamp: log.created_at,
          agreementRef
        }));

      setComments(mapped);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    }
  };

  const getTimeDifference = (timestamp, previousTimestamp) => {
    if (!previousTimestamp) return null;
    
    const diff = new Date(previousTimestamp) - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h later`;
    if (hours > 0) return `${hours}h ${minutes % 60}m later`;
    if (minutes > 0) return `${minutes}m later`;
    return 'Just now';
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const adminId = sessionStorage.getItem("admin_id");
    if (!adminId) {
      alert("Admin session expired. Please log in again.");
      return;
    }

    if (!agreementId) {
      console.error("Missing agreementId");
      return;
    }

    const payload = {
      administrator_id: adminId,
      agreement_id: agreementId,
      log_type: commentType, // ✅ DO NOT transform
      comment: newComment
    };

    // Optimistic UI entry
    const optimisticEntry = {
      id: `tmp-${Date.now()}`,
      text: newComment,
      type: commentType,
      userName,
      timestamp: new Date().toISOString(),
      agreementRef
    };

    setComments(prev => [optimisticEntry, ...prev]);
    setNewComment("");

    try {
      const res = await fetch(
        "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/agreements/activity-log",
        {
          method: "POST",
          credentials: "include", // ✅ REQUIRED
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data?.message || "Failed to log activity");
      }

      // ✅ Best practice: re-sync from backend
      await fetchComments();

    } catch (err) {
      console.error("Error logging activity:", err);

      // rollback optimistic update
      setComments(prev =>
        prev.filter(c => c.id !== optimisticEntry.id)
      );

      alert("Failed to save comment. Please try again.");
    }
  };

  const handleExport = () => {
    const content = [
      `SETA AGREEMENT ACTIVITY LOG`,
      `${'='.repeat(80)}`,
      `Agreement Reference: ${agreementRef}`,
      `Export Date: ${new Date().toLocaleString()}`,
      `Total Entries: ${comments.length}`,
      `\n${'='.repeat(80)}\n`,
      ...comments.map((c, i) => {
        const timeDiff = i < comments.length - 1 ? getTimeDifference(c.timestamp, comments[i + 1].timestamp) : null;
        return (
          `[${new Date(c.timestamp).toLocaleString()}] ${c.type.toUpperCase()}\n` +
          `User: ${c.userName}\n` +
          (timeDiff ? `Time Since Previous: ${timeDiff}\n` : '') +
          `${c.text}\n` +
          `${'-'.repeat(80)}`
        );
      })
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agreementRef}_log_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Status Change': return COLORS.info;
      case 'Issue': return COLORS.danger;
      case 'Update': return COLORS.warning;
      default: return COLORS.secondary;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Status Change': return <Clock className="w-4 h-4" />;
      case 'Issue': return <AlertCircle className="w-4 h-4" />;
      case 'Update': return <TrendingUp className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{ backgroundColor: COLORS.bgWhite }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: COLORS.border, backgroundColor: COLORS.primary }}>
          <div>
            <h2 className="text-xl font-bold text-white">Activity Log</h2>
            <p className="text-sm text-white opacity-80">{agreementRef}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-6 border-b" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgLight }}>
          <div className="flex gap-3 mb-3">
            <select
              value={commentType}
              onChange={(e) => setCommentType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            >
              <option>Comment</option>
              <option>Status Change</option>
              <option>Issue</option>
              <option>Update</option>
            </select>
          </div>
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment or note..."
              className="flex-1 px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
              rows="2"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-md"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: COLORS.bgLight }}>
                <MessageSquare className="w-8 h-8" style={{ color: COLORS.border }} />
              </div>
              <p className="text-gray-500 font-medium">No activity yet</p>
              <p className="text-sm text-gray-400 mt-1">Start by adding your first comment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => {
                const timeDiff = index < comments.length - 1 
                  ? getTimeDifference(comment.timestamp, comments[index + 1].timestamp)
                  : null;
                
                return (
                  <div key={comment.id} className="relative">
                    {index < comments.length - 1 && (
                      <div 
                        className="absolute left-4 top-12 bottom-0 w-0.5" 
                        style={{ backgroundColor: COLORS.border }}
                      />
                    )}
                    
                    {/* Time Difference Badge */}
                    {timeDiff && (
                      <div className="flex items-center gap-2 ml-12 mb-2">
                        <div className="flex-1 h-px" style={{ backgroundColor: COLORS.border }}></div>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          style={{ 
                            backgroundColor: `${COLORS.info}15`,
                            color: COLORS.info
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          {timeDiff}
                        </span>
                        <div className="flex-1 h-px" style={{ backgroundColor: COLORS.border }}></div>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm"
                        style={{ backgroundColor: getTypeColor(comment.type), color: 'white' }}
                      >
                        {getTypeIcon(comment.type)}
                      </div>
                      <div className="flex-1">
                        <div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm" style={{ color: COLORS.primary }}>
                                {comment.userName}
                              </span>
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${getTypeColor(comment.type)}20`,
                                  color: getTypeColor(comment.type)
                                }}
                              >
                                {comment.type}
                              </span>
                            </div>
                            <span className="text-xs font-medium" style={{ color: COLORS.text }}>
                              {new Date(comment.timestamp).toLocaleString('en-ZA', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {comments.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgLight }}>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Total entries: <strong style={{ color: COLORS.primary }}>{comments.length}</strong></span>
              <span>Last updated: <strong style={{ color: COLORS.primary }}>
                {new Date(comments[0].timestamp).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
              </strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentLog;