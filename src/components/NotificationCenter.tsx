// src/components/NotificationCenter.tsx
import { useState, useEffect } from 'react';
import { notificationService, Notification as AppNotification } from '../services/NotificationService';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);

  // Check if notifications are supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsNotificationsSupported('Notification' in window);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = notificationService.addListener((notification) => {
      setNotifications(prev => [notification, ...prev]);

      if (isNotificationsSupported) {
        const notificationApi = window.Notification;
        if (notificationApi.permission === 'granted') {
          try {
            new notificationApi(notification.title, {
              body: notification.message,
              icon: '/favicon.ico'
            });
          } catch (error) {
            console.log('Error showing notification:', error);
          }
        }
      }
    });

    return unsubscribe;
  }, [isNotificationsSupported]);

  const requestNotificationPermission = async () => {
    if (isNotificationsSupported) {
      const notificationApi = window.Notification;
      if (notificationApi.permission !== 'granted') {
        try {
          await notificationApi.requestPermission();
        } catch (error) {
          console.log('Error requesting notification permission:', error);
        }
      }
    }
  };

  // Only request permission if notifications are supported
  useEffect(() => {
    if (isNotificationsSupported) {
      requestNotificationPermission();
    }
  }, [isNotificationsSupported]);

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="sr-only">View notifications</span>
          <svg 
            className="h-6 w-6" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 w-96 max-w-sm bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                        {notification.whatsappStatus && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            notification.whatsappStatus === 'sent' 
                              ? 'bg-green-100 text-green-800'
                              : notification.whatsappStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            WhatsApp: {notification.whatsappStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications(prev => 
                          prev.filter(n => n.id !== notification.id)
                        );
                      }}
                      className="ml-4 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}