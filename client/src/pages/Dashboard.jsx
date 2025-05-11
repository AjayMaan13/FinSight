// src/pages/Dashboard.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { transactionAPI, goalAPI } from "../services/api";
import SpendingOverviewChart from '../components/charts/SpendingOverviewChart';
import { 
  getTransactions, 
  getTransactionSummary,
  getMonthlyTrends,
  getGoals 
} from "../services/api";

// Chart placeholder component
const ChartPlaceholder = () => (
  <div className="flex items-center justify-center h-56 bg-gray-800 rounded-lg border border-gray-700">
    <div className="text-center">
      <p className="text-gray-400 mb-2">Monthly Spending Trend</p>
      <div className="relative h-32 w-64">
        {/* Fake chart bars */}
        <div className="absolute bottom-0 left-0 w-8 h-16 bg-blue-500 rounded-t-sm"></div>
        <div className="absolute bottom-0 left-12 w-8 h-24 bg-blue-500 rounded-t-sm"></div>
        <div className="absolute bottom-0 left-24 w-8 h-12 bg-blue-500 rounded-t-sm"></div>
        <div className="absolute bottom-0 left-36 w-8 h-28 bg-blue-500 rounded-t-sm"></div>
        <div className="absolute bottom-0 left-48 w-8 h-20 bg-blue-500 rounded-t-sm"></div>
      </div>
    </div>
  </div>
);

// Add Transaction Modal Component
const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedData = {
        ...form,
        amount: parseFloat(form.amount),
      };

      const response = await transactionAPI.create(formattedData);
      console.log('Transaction created:', response.data); // Debug log

      setForm({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        type: "expense",
      });

      // Call the success callback which will refresh dashboard data
      onSuccess();
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Add Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                step="0.01"
                min="0.01"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // State variables
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savingsProgress: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [categories, setCategories] = useState([
    'Food & Drink',
    'Groceries',
    'Transportation',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Other'
  ]);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Add a new state for goal data
  const [goalData, setGoalData] = useState({
    totalCurrent: 0,
    totalTarget: 10000, // default value
    progress: 0
  });

  // Update fetchDashboardData to include goal calculations
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch transaction summary with better error handling
      try {
        const summaryRes = await transactionAPI.getSummary();
        console.log('Summary response:', summaryRes.data); // Debug log

        setSummary({
          balance: summaryRes.data.balance || 0,
          income: summaryRes.data.totalIncome || 0,
          expenses: summaryRes.data.totalExpenses || 0,
          savingsProgress: 0
        });
      } catch (summaryError) {
        console.error('Error fetching summary:', summaryError);
        // Set default values if summary fails
        setSummary({
          balance: 0,
          income: 0,
          expenses: 0,
          savingsProgress: 0
        });
      }

      // Fetch recent transactions
      try {
        const transactionsRes = await transactionAPI.getAll({ limit: 5, sort: 'date', order: 'DESC' });
        console.log('Transactions response:', transactionsRes.data); // Debug log
        setRecentTransactions(transactionsRes.data.transactions || []);
      } catch (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        setRecentTransactions([]);
      }

      // Fetch monthly trends
      try {
        const trendsRes = await transactionAPI.getMonthlyTrends();
        console.log('Trends response:', trendsRes.data); // Debug log
        setMonthlyData(trendsRes.data || []);
      } catch (trendsError) {
        console.error('Error fetching trends:', trendsError);
        setMonthlyData([]);
      }

      // Fetch goals for savings progress
      try {
        const goalsRes = await goalAPI.getAll();
        console.log('Goals response:', goalsRes.data); // Debug log

        if (goalsRes.data.goals && goalsRes.data.goals.length > 0) {
          const totalTarget = goalsRes.data.goals.reduce((sum, goal) => sum + parseFloat(goal.targetAmount || 0), 0);
          const totalCurrent = goalsRes.data.goals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount || 0), 0);
          const progress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

          setGoalData({
            totalCurrent,
            totalTarget,
            progress
          });

          setSummary(prev => ({ ...prev, savingsProgress: progress }));
        }
      } catch (goalsError) {
        console.error('Error fetching goals:', goalsError);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    setShowAddTransaction(false);
    fetchDashboardData(); // Refresh data after adding transaction
  };

  const handleExport = () => {
    // For now, just show an alert
    // Later you can implement actual CSV export
    alert("Export functionality coming soon!");
  };



  return (
    <div>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Here's your financial overview for May 2025
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => setShowAddTransaction(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              >
                Add Transaction
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Account Balance Card */}
            <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Account Balance
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-white">
                          ${loading ? '...' : summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/transactions"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    View all transactions
                  </Link>
                </div>
              </div>
            </div>

            {/* Monthly Spending Card */}
            <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Monthly Spending
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-white">
                          ${loading ? '...' : summary.expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/insights"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    View spending trends
                  </Link>
                </div>
              </div>
            </div>

            {/* Savings Goal Card */}
            <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Savings Goal Progress
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-white">
                          {loading ? '...' : `${summary.savingsProgress}%`}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-700">
                      <div
                        style={{ width: `${summary.savingsProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-400">
                        ${loading ? '...' : goalData.totalCurrent.toLocaleString('en-US', { minimumFractionDigits: 0 })} / ${loading ? '...' : goalData.totalTarget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/goals"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    View all goals
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Recent Transactions */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Chart Section */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Spending Overview
                </h3>
                <div className="mt-2">
                  {loading ? (
                    <div className="flex items-center justify-center h-56">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <SpendingOverviewChart data={monthlyData} />
                  )}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Recent Transactions
                </h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-700">
                    {loading ? (
                      <li className="py-4 text-center text-gray-400">Loading...</li>
                    ) : recentTransactions.length === 0 ? (
                      <li className="py-4 text-center text-gray-400">No transactions yet</li>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <li key={transaction.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className={`flex-shrink-0 rounded-md p-2 ${transaction.type === 'income' ? "bg-green-500" : "bg-red-500"
                              }`}>
                              <svg
                                className="h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {transaction.type === 'income' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                )}
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-400 truncate">
                                {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                              </p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                                }`}>
                                {transaction.type === 'income' ? "+" : "-"}$
                                {Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-700 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/transactions"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    View all transactions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-8 bg-gray-800 shadow rounded-lg border border-gray-700 p-5">
            <h2 className="text-xl font-semibold text-white mb-4">
              AI-Powered Financial Insights
            </h2>
            <div className="rounded-md bg-blue-900 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-300">
                    Based on your spending patterns, you could save $250 this
                    month by reducing restaurant expenses.
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <Link
                      to="/insights"
                      className="whitespace-nowrap font-medium text-blue-400 hover:text-blue-300"
                    >
                      Details <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-white mb-2">
                Coming Soon Features
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Smart spending analysis by category
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Budget recommendations based on your habits
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Automated detection of unusual transactions
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Predictive financial forecasting
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default Dashboard;