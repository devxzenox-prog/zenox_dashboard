import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px)`
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: mousePos.x * 0.02,
          y: mousePos.y * 0.02,
        }}
        transition={{ type: 'tween', duration: 0.5 }}
        className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-primary/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: mousePos.x * -0.01,
          y: mousePos.y * -0.01,
        }}
        transition={{ type: 'tween', duration: 0.5 }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-secondary/15 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          x: mousePos.x * 0.015,
          y: mousePos.y * 0.015,
        }}
        transition={{ type: 'tween', duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-accent-primary/5 to-transparent rounded-full blur-[100px]"
      />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent"
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-lg"
      >
        {/* Card Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-2xl opacity-40 blur-sm" />
        
        <div className="relative bg-background-secondary/80 backdrop-blur-xl border border-accent-primary/20 rounded-2xl p-10">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl blur-lg opacity-50" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-3xl font-heading">Z</span>
              </div>
              {/* Animated ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-2xl border border-dashed border-accent-primary/30"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-heading font-bold bg-gradient-to-r from-white via-accent-primary to-white bg-clip-text text-transparent"
            >
              Zenox
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary mt-2 text-sm tracking-wide"
            >
              Lead Management Dashboard
            </motion.p>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-text-secondary text-sm">Enter your credentials to access your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent-primary transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background-primary/50 border border-accent-primary/20 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all duration-300"
                    placeholder="admin@zenox.com"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent-primary transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background-primary/50 border border-accent-primary/20 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative group overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_100%] animate-gradient-x" />
              <div className="relative py-4 flex items-center justify-center gap-2 text-white font-semibold">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiLogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </div>
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
            </motion.button>
          </form>

          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent-primary/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent-secondary/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent-secondary/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent-primary/30 rounded-br-2xl" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
