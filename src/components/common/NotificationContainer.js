import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    const iconClasses = "h-5 w-5";
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClasses} text-green-400`} />;
      case 'error':
        return <XCircleIcon className={`${iconClasses} text-red-400`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-400`} />;
      default:
        return <InformationCircleIcon className={`${iconClasses} text-blue-400`} />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border
            ${getBackgroundColor(notification.type)}
            animate-in slide-in-from-right duration-300
          `}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                {notification.title && (
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => removeNotification(notification.id)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
