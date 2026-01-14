import { CheckCircle2, AlertCircle, Info, AlertTriangle, Clock } from 'lucide-react';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: number) => void;
  onClick?: () => void;
}

// Icon mapping based on type
const iconMap = {
  success: { Icon: CheckCircle2, color: 'text-green-500' },
  error: { Icon: AlertCircle, color: 'text-red-500' },
  warning: { Icon: AlertTriangle, color: 'text-orange-500' },
  info: { Icon: Info, color: 'text-blue-500' },
};

export default function NotificationItem({
  notification,
  onMarkRead,
  onClick,
}: NotificationItemProps) {
  const { Icon, color } = iconMap[notification.notification_type] || iconMap.info;

  const handleClick = () => {
    // Mark as read if not already
    if (!notification.is_read && onMarkRead) {
      onMarkRead(notification.id);
    }

    // Navigate if there's a link
    if (notification.link && onClick) {
      onClick();
      window.location.href = notification.link;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b border-slate-700/50 transition-all cursor-pointer ${
        notification.is_read
          ? 'bg-slate-900 hover:bg-slate-800'
          : 'bg-slate-800 hover:bg-slate-700'
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold ${notification.is_read ? 'text-gray-300' : 'text-white'}`}>
              {notification.title}
            </h4>
            
            {/* Unread badge */}
            {!notification.is_read && (
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
            )}
          </div>

          <p className={`text-sm mt-1 ${notification.is_read ? 'text-gray-500' : 'text-gray-400'}`}>
            {notification.message}
          </p>

          {/* Time */}
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>hace {notification.time_since}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
