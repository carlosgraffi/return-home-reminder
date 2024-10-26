// src/services/NotificationService.ts
import { Task } from '../types';

export type NotificationType = 'network-change' | 'task-reminder' | 'task-due';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  task?: Task;
  whatsappStatus?: 'pending' | 'sent' | 'failed';
}

class NotificationService {
  private listeners: ((notification: Notification) => void)[] = [];
  private notifications: Notification[] = [];

  addListener(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify(notification: Notification) {
    this.notifications.push(notification);
    this.listeners.forEach(listener => listener(notification));

    // Simulate WhatsApp message
    this.simulateWhatsAppMessage(notification);
  }

  private simulateWhatsAppMessage(notification: Notification) {
    // In real implementation, this would call WhatsApp Business API
    console.log('Sending WhatsApp message:', notification.message);

    // Simulate message delivery
    setTimeout(() => {
      const updatedNotification = {
        ...notification,
        whatsappStatus: 'sent' as const
      };
      this.notifications = this.notifications.map(n => 
        n.id === notification.id ? updatedNotification : n
      );
      this.listeners.forEach(listener => listener(updatedNotification));
    }, 2000);
  }

  notifyNetworkChange(isHomeNetwork: boolean, ssid: string) {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'network-change',
      title: 'Network Changed',
      message: `Connected to ${isHomeNetwork ? 'home' : 'away'} network: ${ssid}`,
      timestamp: new Date(),
      whatsappStatus: 'pending'
    };
    this.notify(notification);
  }

  notifyTaskReminder(task: Task, isHomeNetwork: boolean) {
    if (
      (task.networkTrigger === 'home' && isHomeNetwork) ||
      (task.networkTrigger === 'away' && !isHomeNetwork)
    ) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'task-reminder',
        title: 'Task Reminder',
        message: `Don't forget: ${task.title}`,
        timestamp: new Date(),
        task,
        whatsappStatus: 'pending'
      };
      this.notify(notification);
    }
  }

  getNotifications() {
    return this.notifications;
  }

  clearNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.listeners.forEach(listener => 
      listener({ ...this.notifications[0], type: 'task-reminder' })
    );
  }
}

export const notificationService = new NotificationService();