// src/components/TaskFilters.tsx
import { useState } from "react";

interface TaskFiltersProps {
  onFilterChange: (filters: {
    status: "all" | "active" | "completed";
    network: "all" | "home" | "away";
    priority: "all" | "high" | "medium" | "low";
  }) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [filters, setFilters] = useState({
    status: "all" as const,
    network: "all" as const,
    priority: "all" as const,
  });

  const handleFilterChange = (
    key: "status" | "network" | "priority",
    value: string,
  ) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Network</label>
          <select
            value={filters.network}
            onChange={(e) => handleFilterChange("network", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="home">Home</option>
            <option value="away">Away</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
