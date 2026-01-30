import React, { useState, useEffect } from 'react';
import { X, Bell, BellOff, Check, Trash2, Clock } from 'lucide-react';

const NotificationsModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(new Date().toISOString());

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const logsRes = await fetch('https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/user-logs');
      const logsData = await logsRes.json();

      const newLogs = logsData.logs.filter(l => new Date(l.created_at) > new Date(lastChecked));

      const newNotifs = newLogs.map((l, idx) => {
        let title = '';
        if (l.action_type === 'New student created an account') {
          title = 'New Student Registered';
        } else if (l.action_type.toLowerCase().includes('upload')) {
          title = 'New Upload';
        } else {
          title = 'System Activity';
        }

        return {
          id: `log-${idx}-${l.user_id}`,
          type: l.user_type.toLowerCase(),
          icon: Bell,
          title,
          message: l.action_type,
          time: new Date(l.created_at).toLocaleTimeString(),
          isRead: false,
          priority: 'medium',
          expanded: false
        };
      });

      setNotifications(prev => [...newNotifs, ...prev]);
      setUnreadCount(prev => prev + newNotifs.length);
      setLastChecked(new Date().toISOString());

    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => prev - 1);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="text-green-700" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <BellOff size={48} className="mb-3" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 border rounded-lg ${n.isRead ? 'bg-white border-gray-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock size={12} className="mr-1" />
                      {n.time}
                    </div>
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)} className="p-1.5 hover:bg-green-100 rounded transition-colors">
                      <Check size={14} className="text-gray-500 hover:text-green-700" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button onClick={clearAll} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Clear All</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;