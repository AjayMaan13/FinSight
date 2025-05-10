import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      target: 10000,
      current: 6500,
      deadline: '2024-12-31',
      category: 'savings'
    },
    {
      id: 2,
      title: 'Vacation Fund',
      target: 3000,
      current: 1200,
      deadline: '2024-08-31',
      category: 'travel'
    },
    {
      id: 3,
      title: 'New Car',
      target: 25000,
      current: 8000,
      deadline: '2025-06-30',
      category: 'purchase'
    }
  ]);

  const calculateProgress = (current, target) => {
    return Math.round((current / target) * 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
              <p className="mt-1 text-sm text-gray-400">
                Track your savings goals and financial targets
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Goal
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target);
            const progressColor = getProgressColor(progress);
            
            return (
              <div
                key={goal.id}
                className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-400">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    {goal.category}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>${goal.current.toLocaleString()}</span>
                    <span>${goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`${progressColor} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">{progress}%</span>
                  <div className="text-sm text-gray-400">
                    ${(goal.target - goal.current).toLocaleString()} to go
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Goals;