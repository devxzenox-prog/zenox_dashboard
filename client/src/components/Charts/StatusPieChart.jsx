import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  pending: '#f59e0b',
  waiting: '#3b82f6',
  approved: '#10b981',
  rejected: '#ef4444'
};

export const StatusPieChart = ({ data }) => {
  const chartData = data?.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: COLORS[item.status]
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            background: '#12121a', 
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#f8fafc' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-text-secondary text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
