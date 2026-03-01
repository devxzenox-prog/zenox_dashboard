import { motion } from 'framer-motion';

export const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled, type = 'button' }) => {
  const baseStyles = 'font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:shadow-glow',
    secondary: 'border border-accent-primary/30 text-text-primary hover:bg-accent-primary/10',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2.5 rounded-lg',
    lg: 'px-6 py-3 rounded-lg'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const PremiumSelect = ({ value, onChange, options, placeholder, className = '', icon: Icon }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        )}
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full appearance-none cursor-pointer
            bg-background-primary/60 backdrop-blur-sm
            border border-accent-primary/20 rounded-lg
            py-2.5 px-3 ${Icon ? 'pl-10' : 'pl-3'} pr-10
            text-sm text-text-primary
            focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20
            transition-all duration-300
            hover:border-accent-primary/40
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            backgroundSize: '16px'
          }}
        >
          {placeholder && (
            <option value="" disabled className="bg-background-secondary">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              className="bg-background-secondary py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {/* Custom arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
