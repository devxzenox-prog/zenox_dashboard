import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiPlus, FiClock, FiPhone, FiCheckCircle, FiXCircle, 
  FiBarChart2, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/zenox-logo.svg';

const menuItems = [
  { path: '/', icon: FiGrid, label: 'Dashboard' },
  { path: '/add-lead', icon: FiPlus, label: 'Add Lead' },
  { path: '/pending', icon: FiClock, label: 'Pending' },
  { path: '/waiting', icon: FiPhone, label: 'Waiting' },
  { path: '/approved', icon: FiCheckCircle, label: 'Approved' },
  { path: '/rejected', icon: FiXCircle, label: 'Rejected' },
  { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      className="fixed left-0 top-0 h-screen bg-background-secondary border-r border-accent-primary/20 z-40 flex flex-col"
    >
      <div className="p-4 flex items-center gap-3 h-16">
        <img 
          src={logo} 
          alt="ZENOX" 
          className="w-10 h-10 rounded-xl flex-shrink-0 object-contain"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-heading font-bold text-xl text-text-primary whitespace-nowrap neon-text"
            >
              Zenox Network
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) {
                setCollapsed(true);
              }
            }}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200
              ${isActive 
                ? 'bg-accent-primary/20 text-accent-primary border-l-2 border-accent-primary' 
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-accent-primary/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg transition-shadow"
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.div>
      </button>
    </motion.aside>
  );
};

export default Sidebar;
