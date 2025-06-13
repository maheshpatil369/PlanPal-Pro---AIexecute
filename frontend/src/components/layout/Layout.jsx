import React, { useState } from 'react';
import Header from './Header.jsx';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <div className="flex">
        <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} />
        {/* Adjust main content margin:
            - Always have margin on md+ screens.
            - On smaller screens, if sidebar is open, it might overlay or push.
              For now, let's assume it overlays and main content doesn't get a margin.
              If it were to push, we'd add a conditional margin like:
              `className={`flex-1 transition-all duration-300 ease-in-out ${isMobileSidebarOpen ? 'ml-64' : 'ml-0'} md:ml-64`}`
              But for an overlaying sidebar, the main content margin is simpler.
        */}
        <main className={`flex-1 transition-all duration-300 ease-in-out md:ml-64`}>
          <div className="p-6 pt-20 md:pt-6"> {/* Added pt-20 for mobile header height, md:pt-6 to reset */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;