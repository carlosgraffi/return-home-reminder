// src/hooks/useNetworkStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { NetworkStatus } from '../types';
import { notificationService } from '../services/NotificationService';
import { useLocalStorage } from './useLocalStorage';
import { Task } from '../types';

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: true,
    ssid: 'Home Network',
    isHomeNetwork: true,
  });

  const [tasks] = useLocalStorage<Task[]>('tasks', []);

  const handleNetworkChange = useCallback((newStatus: NetworkStatus) => {
    setNetworkStatus(newStatus);

    // Notify about network change
    notificationService.notifyNetworkChange(
      newStatus.isHomeNetwork,
      newStatus.ssid
    );

    // Check for relevant tasks and send notifications
    tasks.forEach(task => {
      if (!task.completed) {
        notificationService.notifyTaskReminder(task, newStatus.isHomeNetwork);
      }
    });
  }, [tasks]);

  useEffect(() => {
    const simulateNetworkChange = () => {
      const networks = [
        { ssid: 'Home Network', isHomeNetwork: true },
        { ssid: 'Coffee Shop', isHomeNetwork: false },
        { ssid: 'Office Network', isHomeNetwork: false },
      ];

      const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
      handleNetworkChange({
        connected: true,
        ...randomNetwork,
      });
    };

    if (typeof window !== 'undefined') {
      const button = document.createElement('button');
      button.innerHTML = 'Simulate Network Change';
      button.className = 'fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 text-sm font-medium';
      button.onclick = simulateNetworkChange;
      document.body.appendChild(button);

      return () => {
        document.body.removeChild(button);
      };
    }
  }, [handleNetworkChange]);

  return networkStatus;
}