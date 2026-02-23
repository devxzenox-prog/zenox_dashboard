import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export const CategoryChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
        <XAxis type="number" stroke="#94a3b8" />
        <YAxis dataKey="category" type="category" stroke="#94a3b8" width={80} />
        <Tooltip 
          contentStyle={{ 
            background: '#12121a', 
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#f8fafc' }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
