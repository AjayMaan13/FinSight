// src/components/charts/BalanceForecastChart.jsx
// 30-day balance forecast with a 95% confidence band, powered by the ML service.
import {
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

const currency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const BalanceForecastChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">Not enough history to forecast yet</p>
      </div>
    );
  }

  // Recharts stacks the band as [lower baseline] + [range] so the shaded area
  // sits between lower and upper bounds.
  const chartData = data.map((p) => ({
    date: p.date.slice(5), // MM-DD
    balance: p.balance,
    lower: p.lower,
    range: Math.max(p.upper - p.lower, 0),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" tick={{ fill: '#ccc', fontSize: 11 }} interval={4} />
          <YAxis tick={{ fill: '#ccc' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
            formatter={(value, name) =>
              name === 'range' ? null : [currency(value), 'Projected balance']
            }
          />
          {/* Invisible baseline up to `lower`, then a shaded `range` band. */}
          <Area dataKey="lower" stackId="band" stroke="none" fill="transparent" isAnimationActive={false} />
          <Area
            dataKey="range"
            stackId="band"
            stroke="none"
            fill="#60a5fa"
            fillOpacity={0.18}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceForecastChart;
