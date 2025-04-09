'use client';

import { Bell, Check, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  // Example notifications data - in a real app, this would come from an API
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Course Purchase',
      message: 'John Doe purchased "Introduction to Web Development"',
      type: 'success',
      isRead: false,
      createdAt: '2024-04-09T10:00:00Z'
    },
    {
      id: '2',
      title: 'Course Update Required',
      message: 'Your course "Digital Marketing Fundamentals" needs to be updated',
      type: 'info',
      isRead: false,
      createdAt: '2024-04-09T09:30:00Z'
    },
    {
      id: '3',
      title: 'Payment Failed',
      message: 'Payment processing failed for order #12345',
      type: 'error',
      isRead: true,
      createdAt: '2024-04-09T09:00:00Z'
    }
  ];

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              View and manage your notifications
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50 text-gray-700 bg-white"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${getNotificationStyles(notification.type)} ${
                      !notification.isRead ? 'border-l-4' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <button className="text-gray-400 hover:text-gray-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 