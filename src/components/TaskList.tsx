// src/components/TaskList.tsx
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task } from '../types';
import ClientOnly from './ClientOnly';
import TaskFilters from './TaskFilters';
import TaskSummary from './TaskSummary';

export default function TaskList() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filters, setFilters] = useState({
    status: 'all' as const,
    network: 'all' as const,
    priority: 'all' as const,
  });

  // Add activeFilters state to show which filters are currently applied
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Update active filters
    const active = [];
    if (newFilters.status !== 'all') active.push(`Status: ${newFilters.status}`);
    if (newFilters.network !== 'all') active.push(`Network: ${newFilters.network}`);
    if (newFilters.priority !== 'all') active.push(`Priority: ${newFilters.priority}`);
    setActiveFilters(active);
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      network: 'all',
      priority: 'all',
    });
    setActiveFilters([]);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'active' && task.completed) return false;
    }

    if (filters.network !== 'all') {
      if (filters.network === 'home' && task.networkTrigger !== 'home') return false;
      if (filters.network === 'away' && task.networkTrigger !== 'away') return false;
    }

    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <ClientOnly>
      <div className="space-y-6">
        <TaskSummary 
          tasks={tasks}
          onQuickFilter={handleFilterChange}
        />

        <TaskFilters onFilterChange={handleFilterChange} />

        {activeFilters.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {filter}
                </span>
              ))}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg divide-y">
          {sortedTasks.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              {tasks.length === 0 
                ? 'No tasks yet. Add a task to get started!'
                : 'No tasks match the selected filters.'}
            </p>
          ) : (
            sortedTasks.map(task => (
              // ... Rest of the task rendering code remains the same ...
              <div 
                key={task.id} 
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className={`font-medium ${
                      task.completed ? 'line-through text-gray-400' : ''
                    }`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-500">{task.description}</p>
                    )}
                    {task.networkTrigger && (
                      <p className="text-xs text-gray-400 mt-1">
                        Trigger: {task.networkTrigger}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ClientOnly>
  );
}