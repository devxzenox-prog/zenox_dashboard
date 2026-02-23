import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    warning: (message) => addToast(message, 'warning')
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheck className="w-5 h-5" />;
      case 'error': return <FiX className="w-5 h-5" />;
      case 'warning': return <FiAlertCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
      case 'error': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'warning': return 'bg-amber-500/20 border-amber-500 text-amber-400';
      default: return '';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getStyles(t.type)} backdrop-blur-md min-w-[280px]`}
            >
              {getIcon(t.type)}
              <span className="text-sm font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
