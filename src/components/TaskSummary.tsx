// src/components/TaskSummary.tsx
import { Task } from '../types';

interface TaskSummaryProps {
  tasks: Task[];
  onQuickFilter: (filter: {
    status: 'all' | 'active' | 'completed';
    network: 'all' | 'home' | 'away';
    priority: 'all' | 'high' | 'medium' | 'low';
  }) => void;
}

export default function TaskSummary({ tasks, onQuickFilter }: TaskSummaryProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  const homeTasks = tasks.filter(task => task.networkTrigger === 'home').length;
  const awayTasks = tasks.filter(task => task.networkTrigger === 'away').length;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div 
          onClick={() => onQuickFilter({ status: 'all', network: 'all', priority: 'all' })}
          className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-gray-700">{totalTasks}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>

        <div 
          onClick={() => onQuickFilter({ status: 'completed', network: 'all', priority: 'all' })}
          className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>

        <div 
          onClick={() => onQuickFilter({ status: 'active', network: 'all', priority: 'high' })}
          className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
          <div className="text-sm text-gray-500">High Priority</div>
        </div>

        <div 
          onClick={() => onQuickFilter({ status: 'all', network: 'home', priority: 'all' })}
          className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-blue-600">{homeTasks}</div>
          <div className="text-sm text-gray-500">Home Tasks</div>
        </div>

        <div 
          onClick={() => onQuickFilter({ status: 'all', network: 'away', priority: 'all' })}
          className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-purple-600">{awayTasks}</div>
          <div className="text-sm text-gray-500">Away Tasks</div>
        </div>
      </div>
    </div>
  );
}