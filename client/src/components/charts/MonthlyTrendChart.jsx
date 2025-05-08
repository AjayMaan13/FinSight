// src/components/charts/MonthlyTrendChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MonthlyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">No monthly data available</p>
      </div>
    );
  }

  // Format the data
  const formattedData = data.map(item => ({
    name: months[item.month - 1],
    Income: item.income,
    Expenses: item.expense,
    Balance: item.balance
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
          <YAxis tick={{ fill: '#ccc' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
            formatter={(value) => new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value)}
          />
          <Legend />
          <Bar dataKey="Income" fill="#4ade80" />
          <Bar dataKey="Expenses" fill="#f87171" />
          <Bar dataKey="Balance" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;