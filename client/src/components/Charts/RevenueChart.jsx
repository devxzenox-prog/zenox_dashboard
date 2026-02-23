import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip 
          contentStyle={{ 
            background: '#12121a', 
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#f8fafc' }}
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#6366f1" 
          strokeWidth={3}
          dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
