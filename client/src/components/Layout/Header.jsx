import { FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-background-secondary/50 backdrop-blur-sm border-b border-accent-primary/20 flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="text-xl font-heading font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
          <FiUser className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
