// src/pages/index.tsx
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';

export default function Home() {
  const networkStatus = useNetworkStatus();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Network Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            networkStatus.isHomeNetwork 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {networkStatus.isHomeNetwork ? 'Home Network' : 'Away'}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Connected to: {networkStatus.ssid}
        </p>
      </div>

      <AddTaskForm />
      <TaskList />
    </div>
  );
}