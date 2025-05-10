// src/components/goals/GoalForm.jsx
import { useState, useEffect } from 'react';
import { createGoal, updateGoal } from '../../services/api';

const GoalForm = ({ onSuccess, onCancel, editingGoal }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingGoal) {
      setForm({
        name: editingGoal.name || '',
        description: editingGoal.description || '',
        targetAmount: editingGoal.targetAmount || '',
        currentAmount: editingGoal.currentAmount || '',
        targetDate: editingGoal.targetDate ? new Date(editingGoal.targetDate).toISOString().split('T')[0] : '',
        category: editingGoal.category || '',
        priority: editingGoal.priority || 'medium'
      });
    }
  }, [editingGoal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formattedData = {
        ...form,
        targetAmount: parseFloat(form.targetAmount),
        currentAmount: parseFloat(form.currentAmount || 0)
      };
      
      if (editingGoal) {
        await updateGoal(editingGoal.id, formattedData);
      } else {
        await createGoal(formattedData);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {error && <div className="bg-red-900 text-red-300 p-3 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-300">Goal Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Emergency Fund"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe your goal..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Target Amount</label>
          <input
            type="number"
            name="targetAmount"
            value={form.targetAmount}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
            min="0.01"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Current Amount</label>
          <input
            type="number"
            name="currentAmount"
            value={form.currentAmount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Target Date</label>
          <input
            type="date"
            name="targetDate"
            value={form.targetDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="savings">Savings</option>
            <option value="investment">Investment</option>
            <option value="debt">Debt Payoff</option>
            <option value="purchase">Major Purchase</option>
            <option value="emergency">Emergency Fund</option>
            <option value="retirement">Retirement</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;