// src/components/AddTaskForm.tsx
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task } from '../types';
import ClientOnly from './ClientOnly';

export default function AddTaskForm() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium' as Task['priority'],
    networkTrigger: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      networkTrigger: '',
    });
    setIsOpen(false);
  };

  return (
    <ClientOnly>
      <div className="bg-white shadow rounded-lg p-6">
        {/* Rest of the component remains the same */}
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Task
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields remain the same */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  priority: e.target.value as Task['priority']
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="networkTrigger" className="block text-sm font-medium text-gray-700">
                Network Trigger
              </label>
              <select
                id="networkTrigger"
                value={formData.networkTrigger}
                onChange={(e) => setFormData({ ...formData, networkTrigger: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">No trigger</option>
                <option value="home">At Home</option>
                <option value="away">Away from Home</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Task
              </button>
            </div>
          </form>
        )}
      </div>
    </ClientOnly>
  );
}