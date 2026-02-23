import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiClock, FiPhone, FiCheckCircle, FiXCircle, FiDollarSign, FiTrendingUp, FiActivity, FiMenu, FiX } from 'react-icons/fi';
import { leadService } from '../api';
import { CategoryChart, StatusPieChart, RevenueChart } from '../components/Charts';
import { CardSkeleton } from '../components/UI';
import Header from '../components/Layout/Header';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const StatCard = ({ icon: Icon, label, value, color, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group relative overflow-hidden cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="glass-card p-4 sm:p-5 relative overflow-hidden h-full">
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
      <div className="flex items-center justify-between relative z-10">
        <div className="min-w-0 flex-1">
          <p className="text-text-secondary text-[10px] sm:text-xs uppercase tracking-wider font-medium truncate">{label}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 truncate">{value}</p>
        </div>
        <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 ${color.split(' ')[0]}/20`}>
          <Icon className={`w-5 sm:w-6 h-5 sm:h-6 ${color.split(' ')[1]}`} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color}`} />
    </div>
  </motion.div>
);

const ChartCard = ({ title, icon: Icon, children, delay, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`glass-card p-4 sm:p-6 relative overflow-hidden ${className}`}
  >
    <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-accent-primary/10 to-transparent rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-accent-primary" />
      </div>
      <h3 className="text-sm sm:text-lg font-semibold truncate">{title}</h3>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

const MobileStatsCarousel = ({ stats }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const statItems = [
    { icon: FiUsers, label: 'Total Leads', value: stats?.total || 0, color: 'from-blue-500 to-cyan-400 text-blue-400' },
    { icon: FiClock, label: 'Pending', value: stats?.pending || 0, color: 'from-amber-500 to-orange-400 text-amber-400' },
    { icon: FiPhone, label: 'Waiting', value: stats?.waiting || 0, color: 'from-blue-500 to-indigo-400 text-blue-400' },
    { icon: FiCheckCircle, label: 'Approved', value: stats?.approved || 0, color: 'from-emerald-500 to-green-400 text-emerald-400' },
    { icon: FiXCircle, label: 'Rejected', value: stats?.rejected || 0, color: 'from-red-500 to-rose-400 text-red-400' },
    { icon: FiDollarSign, label: 'Revenue', value: formatINR(stats?.revenue || 0), color: 'from-purple-500 to-violet-400 text-purple-400' },
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `${-currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {statItems.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-1">
              <StatCard
                icon={item.icon}
                label={item.label}
                value={item.value}
                color={item.color}
                delay={index * 0.1}
              />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {statItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-accent-primary' : 'bg-accent-primary/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInsights, setShowInsights] = useState(false);

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
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const conversionRate = stats && stats.total > 0 
    ? ((stats.approved / stats.total) * 100).toFixed(1) 
    : 0;
  
  const avgDealValue = stats && stats.approved > 0 
    ? stats.revenue / stats.approved 
    : 0;

  const hasData = stats?.total > 0;

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />
      <div className="p-3 sm:p-4 md:p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-text-secondary text-xs sm:text-sm">Here is what is happening with your leads today.</p>
        </motion.div>

        {/* Mobile Carousel / Desktop Grid */}
        <div className="block lg:hidden mb-6">
          {loading ? (
            <CardSkeleton />
          ) : (
            <MobileStatsCarousel stats={stats} />
          )}
        </div>

        {/* Desktop Stats Grid */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 md:mb-8">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <StatCard icon={FiUsers} label="Total Leads" value={stats?.total || 0} color="from-blue-500 to-cyan-400 text-blue-400" delay={0} />
              <StatCard icon={FiClock} label="Pending" value={stats?.pending || 0} color="from-amber-500 to-orange-400 text-amber-400" delay={0.1} />
              <StatCard icon={FiPhone} label="Waiting" value={stats?.waiting || 0} color="from-blue-500 to-indigo-400 text-blue-400" delay={0.2} />
              <StatCard icon={FiCheckCircle} label="Approved" value={stats?.approved || 0} color="from-emerald-500 to-green-400 text-emerald-400" delay={0.3} />
              <StatCard icon={FiXCircle} label="Rejected" value={stats?.rejected || 0} color="from-red-500 to-rose-400 text-red-400" delay={0.4} />
              <StatCard icon={FiDollarSign} label="Total Revenue" value={formatINR(stats?.revenue || 0)} color="from-purple-500 to-violet-400 text-purple-400" delay={0.5} />
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <ChartCard title="Leads by Category" icon={FiActivity} delay={0.6}>
            <div className="h-[200px] sm:h-[250px] md:h-[280px]">
              {hasData && chartData?.categoryData?.length > 0 ? (
                <CategoryChart data={chartData.categoryData} />
              ) : (
                <div className="h-full flex items-center justify-center text-text-secondary text-xs sm:text-sm text-center px-2">
                  No leads yet. Add your first lead to see data.
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Status Distribution" icon={FiCheckCircle} delay={0.7}>
            <div className="h-[200px] sm:h-[250px] md:h-[280px]">
              {hasData && chartData?.statusData?.length > 0 ? (
                <StatusPieChart data={chartData.statusData} />
              ) : (
                <div className="h-full flex items-center justify-center text-text-secondary text-xs sm:text-sm text-center px-2">
                  No leads yet. Add your first lead to see data.
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Monthly Revenue" icon={FiDollarSign} delay={0.8} className="lg:col-span-2">
            <div className="h-[200px] sm:h-[250px] md:h-[280px]">
              {hasData && chartData?.revenueData?.length > 0 ? (
                <RevenueChart data={chartData.revenueData} />
              ) : (
                <div className="h-full flex items-center justify-center text-text-secondary text-xs sm:text-sm text-center px-2">
                  No revenue yet. Approve some leads to see revenue data.
                </div>
              )}
            </div>
          </ChartCard>

          {/* Quick Stats Card - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card p-4 sm:p-6 hidden md:block"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <FiTrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-accent-primary" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold">Quick Insights</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-background-primary/50 rounded-xl">
                <span className="text-text-secondary text-xs sm:text-sm">Conversion Rate</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-xl">{conversionRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-background-primary/50 rounded-xl">
                <span className="text-text-secondary text-xs sm:text-sm">Avg Deal Value</span>
                <span className="text-accent-primary font-bold text-sm sm:text-xl">{formatINR(avgDealValue)}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-background-primary/50 rounded-xl">
                <span className="text-text-secondary text-xs sm:text-sm">Total Leads</span>
                <span className="text-blue-400 font-bold text-sm sm:text-xl">{stats?.total || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Insights Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="md:hidden mt-4"
        >
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full glass-card p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-accent-primary" />
              </div>
              <span className="font-semibold">Quick Insights</span>
            </div>
            <motion.div
              animate={{ rotate: showInsights ? 180 : 0 }}
              className="text-text-secondary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-4 mt-2 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background-primary/50 rounded-xl">
                    <span className="text-text-secondary text-sm">Conversion Rate</span>
                    <span className="text-emerald-400 font-bold">{conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-primary/50 rounded-xl">
                    <span className="text-text-secondary text-sm">Avg Deal Value</span>
                    <span className="text-accent-primary font-bold">{formatINR(avgDealValue)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-primary/50 rounded-xl">
                    <span className="text-text-secondary text-sm">Total Leads</span>
                    <span className="text-blue-400 font-bold">{stats?.total || 0}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
