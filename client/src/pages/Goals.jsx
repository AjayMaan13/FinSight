import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { goalAPI } from '../services/api';
import GoalForm from '../components/goals/GoalForm';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(null); // This should be inside the component

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await goalAPI.getAll();
      console.log('Goals response:', response.data); // Add this line to debug
      setGoals(response.data.goals || []);
      setError(null);
    } catch (err) {
      setError('Failed to load goals');
      console.error('Error fetching goals:', err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.round((current / target) * 100);
  };

  const formatCurrency = (amount) => {
    // Convert string to number if needed
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) return '$0.00';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

 const UpdateProgressForm = ({ goal, onSuccess, onCancel }) => {
  const initialAmount = typeof goal.currentAmount === 'string' 
    ? parseFloat(goal.currentAmount) || 0 
    : goal.currentAmount || 0;
    
  const [amount, setAmount] = useState(initialAmount.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updatedGoal = {
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
        currentAmount: parseFloat(amount)
      };
      
      await goalAPI.update(goal.id, updatedGoal);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-900 text-red-300 p-3 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-300">Current Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          step="0.01"
          min="0"
          max={goal.targetAmount}
        />
        <p className="mt-1 text-sm text-gray-400">
          Target: {formatCurrency(goal.targetAmount)}
        </p>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Progress'}
        </button>
      </div>
    </form>
  );
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
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);

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
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span>{formatCurrency(goal.targetAmount)}</span>
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="text-sm text-gray-400">
                      <div className="flex justify-between mb-1">
                        <span>Deadline:</span>
                        <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="text-blue-400">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => setUpdatingGoal(goal)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300"
                      >
                        Update Progress
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{goal.category}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          goal.priority === 'high' ? 'bg-red-900 text-red-300' : 
                          goal.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' : 
                          'bg-green-900 text-green-300'
                        }`}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                );
              })
            )}
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <GoalForm
                onSuccess={() => {
                  setShowAddModal(false);
                  fetchGoals();
                }}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        )}

        {/* Update Progress Modal */}
        {updatingGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Update Progress for {updatingGoal.name}</h3>
                <button 
                  onClick={() => setUpdatingGoal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <UpdateProgressForm 
                goal={updatingGoal}
                onSuccess={() => {
                  setUpdatingGoal(null);
                  fetchGoals();
                }} 
                onCancel={() => setUpdatingGoal(null)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;