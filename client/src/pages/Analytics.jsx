import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { leadService } from '../api';
import { CategoryChart, StatusPieChart, RevenueChart } from '../components/Charts';
import { CardSkeleton } from '../components/UI';
import Header from '../components/Layout/Header';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          leadService.getStats(),
          leadService.getChartData()
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const conversionRate = stats ? ((stats.approved / stats.total) * 100).toFixed(1) : 0;
  const rejectionRate = stats ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0;
  const avgDealValue = stats?.approved > 0 ? (stats.revenue / stats.approved).toFixed(2) : 0;

  return (
    <div className="min-h-screen">
      <Header title="Analytics" />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5"
              >
                <p className="text-text-secondary text-sm mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-emerald-400">{conversionRate}%</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5"
              >
                <p className="text-text-secondary text-sm mb-1">Rejection Rate</p>
                <p className="text-2xl font-bold text-red-400">{rejectionRate}%</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5"
              >
                <p className="text-text-secondary text-sm mb-1">Avg Deal Value</p>
                <p className="text-2xl font-bold text-purple-400">₹{parseFloat(avgDealValue).toLocaleString('en-IN')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-5"
              >
                <p className="text-text-secondary text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-accent-primary">₹{(stats?.revenue || 0).toLocaleString('en-IN')}</p>
              </motion.div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Leads by Category</h3>
            {chartData?.categoryData ? (
              <CategoryChart data={chartData.categoryData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-text-secondary">No data available</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            {chartData?.statusData ? (
              <StatusPieChart data={chartData.statusData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-text-secondary">No data available</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            {chartData?.revenueData?.length > 0 ? (
              <RevenueChart data={chartData.revenueData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-text-secondary">No revenue data available</div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
