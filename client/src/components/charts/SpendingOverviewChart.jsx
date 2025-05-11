import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SpendingOverviewChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">No spending data available</p>
      </div>
    );
  }

  // Format data for the chart
  const formattedData = data.map(item => ({
    month: getMonthName(item.month),
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
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="Income" fill="#10B981" />
          <Bar dataKey="Expenses" fill="#EF4444" />
          <Bar dataKey="Balance" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const getMonthName = (monthNumber) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1] || monthNumber;
};

export default SpendingOverviewChart;