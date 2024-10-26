// src/types/index.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  networkTrigger?: string;
}

export interface NetworkStatus {
  connected: boolean;
  ssid?: string;
  isHomeNetwork: boolean;
}