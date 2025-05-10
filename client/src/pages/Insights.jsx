import { useState } from 'react';
import { Link } from 'react-router-dom';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import ExpensesByCategoryChart from '../components/charts/ExpensesByCategoryChart';

const Insights = () => {
  const [monthlyData] = useState([
    { month: 1, income: 5000, expense: 3200, balance: 1800 },
    { month: 2, income: 5200, expense: 3500, balance: 1700 },
    { month: 3, income: 4800, expense: 2900, balance: 1900 },
    { month: 4, income: 5500, expense: 3800, balance: 1700 },
    { month: 5, income: 5000, expense: 3100, balance: 1900 },
  ]);

  const [categoryData] = useState([
    { category: 'Food & Dining', total: 800 },
    { category: 'Transportation', total: 300 },
    { category: 'Shopping', total: 450 },
    { category: 'Utilities', total: 250 },
    { category: 'Entertainment', total: 200 },
  ]);

  const insights = [
    {
      type: 'warning',
      title: 'Spending Alert',
      message: 'Your shopping expenses increased by 25% this month compared to last month.'
    },
    {
      type: 'success',
      title: 'Savings Goal',
      message: 'Great job! You\'re on track to meet your emergency fund goal by December.'
    },
    {
      type: 'info',
      title: 'Budget Tip',
      message: 'Consider reducing dining out expenses by $200 to increase your monthly savings.'
    }
  ];

  const getInsightIcon = (type) => {
    switch(type) {
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const getInsightColor = (type) => {
    switch(type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/50';
      case 'success':
        return 'border-green-500 bg-green-900/50';
      case 'info':
        return 'border-blue-500 bg-blue-900/50';
      default:
        return 'border-gray-500 bg-gray-900/50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Financial Insights</h1>
              <p className="mt-1 text-sm text-gray-400">
                Analyze your spending patterns and get personalized recommendations
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

        {/* Insights Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-lg border p-6 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">{insight.title}</h3>
                  <p className="mt-1 text-sm text-gray-300">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Trends */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Monthly Trends</h3>
            <MonthlyTrendChart data={monthlyData} />
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Expenses by Category</h3>
            <ExpensesByCategoryChart data={categoryData} />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Average Monthly Spending
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      $3,320
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Highest Expense Category
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      Food & Dining
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Savings Rate
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      36%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;