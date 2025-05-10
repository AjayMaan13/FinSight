import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';


const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      // Mock data - since we don't have a backend yet
      // Later this can be replaced with: const response = await getGoals();
      const mockGoals = [
        {
          id: 1,
          name: 'Emergency Fund',
          target: 10000,
          current: 6500,
          deadline: '2024-12-31',
          category: 'savings'
        },
        {
          id: 2,
          name: 'Vacation Fund',
          target: 5000,
          current: 1500,
          deadline: '2024-08-31',
          category: 'travel'
        },
        {
          id: 3,
          name: 'New Car',
          target: 20000,
          current: 3000,
          deadline: '2025-06-30',
          category: 'purchase'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGoals(mockGoals);
      setError(null);
    } catch (err) {
      setError('Failed to load goals');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current, target) => {
    return Math.round((current / target) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
                Set and track your financial goals to stay on top of your savings
              </p>
            </div>
            <Link 
              to="/dashboard" 
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Add Goal Button and Error State */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Goal
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Goals Grid - Matching Dashboard Style */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="mt-4 text-gray-400">No goals yet. Start by adding your first financial goal!</p>
              </div>
            ) : (
              goals.map((goal) => {
                const progress = calculateProgress(goal.current, goal.target);
                
                return (
                  <div
                    key={goal.id}
                    className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6 hover:border-gray-600 transition-colors"
                  >
                    {/* Goal Header */}
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-lg font-semibold text-white truncate pr-2">
                        {goal.name}
                      </h3>
                      <span className="text-2xl font-bold text-gray-300">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formatCurrency(goal.current)}</span>
                        <span>{formatCurrency(goal.target)}</span>
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="text-sm text-gray-400">
                      <div className="flex justify-between mb-1">
                        <span>Deadline:</span>
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="text-blue-400">{formatCurrency(goal.target - goal.current)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Add Goal Modal (Placeholder) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Create New Goal</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400">Goal creation form coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;