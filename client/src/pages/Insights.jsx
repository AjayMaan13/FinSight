import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Insights = () => {
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', income: 5000, expenses: 3200, savings: 1800 },
    { month: 'Feb', income: 5200, expenses: 3500, savings: 1700 },
    { month: 'Mar', income: 4800, expenses: 2900, savings: 1900 },
    { month: 'Apr', income: 5500, expenses: 3800, savings: 1700 },
    { month: 'May', income: 5000, expenses: 3100, savings: 1900 },
  ]);

  const [categoryData, setCategoryData] = useState([
    { name: 'Food & Dining', value: 800, color: '#0088FE' },
    { name: 'Transportation', value: 300, color: '#00C49F' },
    { name: 'Shopping', value: 450, color: '#FFBB28' },
    { name: 'Utilities', value: 250, color: '#FF8042' },
    { name: 'Entertainment', value: 200, color: '#8884d8' },
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
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return '💡';
      default:
        return '📊';
    }
  };

  const getInsightColor = (type) => {
    switch(type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-900';
      case 'success':
        return 'border-green-500 bg-green-900';
      case 'info':
        return 'border-blue-500 bg-blue-900';
      default:
        return 'border-gray-500 bg-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Financial Insights</h1>
          <p className="mt-1 text-sm text-gray-400">
            Analyze your spending patterns and get personalized recommendations
          </p>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-lg border p-6 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{getInsightIcon(insight.type)}</span>
                <div>
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" tick={{ fill: '#ccc' }} />
                  <YAxis tick={{ fill: '#ccc' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="income" fill="#4ade80" />
                  <Bar dataKey="expenses" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Spending by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;