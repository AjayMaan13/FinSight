import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import ExpensesByCategoryChart from '../components/charts/ExpensesByCategoryChart';
import BalanceForecastChart from '../components/charts/BalanceForecastChart';
import { mlAPI } from '../services/api';

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [insightsRes, forecastRes] = await Promise.all([
          mlAPI.getInsights(),
          mlAPI.getForecast({ days: 30 }),
        ]);
        if (cancelled) return;

        const data = insightsRes.data || {};
        setInsights(data.insights || []);
        setSummary(data.summary || {});
        setCategoryData(data.category_breakdown || []);

        // Convert "YYYY-MM" month keys to the numeric month the chart expects.
        const trend = (data.monthly_trend || []).map((m) => ({
          month: parseInt(String(m.month).split('-')[1], 10),
          income: m.income,
          expense: m.expense,
          balance: m.balance,
        }));
        setMonthlyData(trend);
        setForecast((forecastRes.data && forecastRes.data.forecast) || []);
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        setError(
          status === 503
            ? 'The ML service is currently unavailable. Please try again shortly.'
            : 'Failed to load insights. Add some transactions to get started.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const currency = (value) =>
    value == null
      ? '—'
      : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const getInsightIcon = (type) => {
    switch (type) {
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
      default:
        return (
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/50';
      case 'success':
        return 'border-green-500 bg-green-900/50';
      default:
        return 'border-blue-500 bg-blue-900/50';
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
                ML-powered analysis of your spending patterns and forecasts
              </p>
            </div>
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
            <span className="ml-3 text-gray-400">Analyzing your finances…</span>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-yellow-500 bg-yellow-900/40 p-6 text-yellow-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Insights Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
              {insights.map((insight, index) => (
                <div key={index} className={`rounded-lg border p-6 ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">{insight.title}</h3>
                      <p className="mt-1 text-sm text-gray-300">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Forecast */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">
                30-Day Balance Forecast
                <span className="ml-2 text-xs text-gray-400">(shaded = 95% confidence)</span>
              </h3>
              <BalanceForecastChart data={forecast} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-4">Monthly Trends</h3>
                <MonthlyTrendChart data={monthlyData} />
              </div>
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-4">Expenses by Category</h3>
                <ExpensesByCategoryChart data={categoryData} />
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
              <SummaryCard label="Avg Monthly Spending" value={currency(summary.avg_monthly_spending)} />
              <SummaryCard label="Top Expense Category" value={summary.top_category || '—'} />
              <SummaryCard label="Savings Rate" value={summary.savings_rate != null ? `${summary.savings_rate}%` : '—'} />
              <SummaryCard label="Projected Month-End" value={currency(summary.projected_month_end_balance)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
    <div className="p-5">
      <dl>
        <dt className="text-sm font-medium text-gray-400 truncate">{label}</dt>
        <dd className="text-lg font-medium text-white mt-1">{value}</dd>
      </dl>
    </div>
  </div>
);

export default Insights;
