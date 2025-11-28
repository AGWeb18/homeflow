import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-light text-slate-900 font-sans relative">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex sticky top-0" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <Sidebar className="h-full w-full border-r-0" onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <span className="font-bold text-slate-900">HomeFlow</span>
            </div>
            <div 
                className="w-8 h-8 rounded-full bg-cover bg-center border border-slate-200"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD85Be7djUR21K0mjcoLQXgQA_OSxiYXQpjvuwDX2kdNwtc4kb4Tp2giG1ivavmdVbFuXgLjxBh1D8Br1TTATO9hO-lw1wEGxApdNYQdjskqCRYnSDqD8bvpKR3QXYR4kLh8F9hy1_jskDn3yLYQyaH7dVfCONGAg4sUIjK8xJ5YkF4YzOSbfdDhC0ZOwfxqnXAL28WJBh2A1-unSvpVfsZVsS0SV9KkR_ks656wL8brJTbH2eCteKxWbZ6vwESmiL6HrPsWVRCAmE")' }}
            ></div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <Outlet />
          <Analytics />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;