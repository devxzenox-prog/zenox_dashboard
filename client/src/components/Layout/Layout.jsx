import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background-primary">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-60'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
