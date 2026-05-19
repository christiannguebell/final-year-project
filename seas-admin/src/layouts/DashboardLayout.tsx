import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl h-16 flex justify-between items-center px-8 max-w-[1920px] mx-auto glass-nav border-b border-outline-variant/15">
        <div className="text-lg font-bold text-primary tracking-tighter font-headline">SEAS Admin</div>
        <div className="hidden md:flex space-x-8 items-center font-headline font-semibold tracking-tight">
          <Link to="#" className="text-on-surface-variant hover:text-primary-container transition-opacity duration-300">System Logs</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary-container transition-opacity duration-300">Settings</Link>
        </div>
        <div className="flex items-center space-x-6">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:opacity-80 transition-opacity">notifications</span>
          <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-on-primary font-bold bg-primary uppercase">A</div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* Side Navigation Bar */}
        <aside className="h-[calc(100vh-64px)] w-64 bg-surface-container-low flex flex-col p-4 space-y-2 sticky top-16 border-r border-outline-variant/15">
          <div className="px-2 py-4 mb-4">
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">A</div>
              <div className="text-primary font-headline font-bold text-sm">Operations</div>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link to="/" className="flex items-center space-x-3 p-3 bg-surface-container-lowest text-secondary rounded-lg shadow-sm font-bold transition-all duration-200 ease-in-out">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-body text-sm font-medium">Dashboard</span>
            </Link>
            <Link to="/candidates" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">group</span>
              <span className="font-body text-sm font-medium">Candidates</span>
            </Link>
            <Link to="/applications" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-body text-sm font-medium">Review Queue</span>
            </Link>
            <Link to="/applications" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">verified</span>
              <span className="font-body text-sm font-medium">Verification</span>
            </Link>
            <Link to="#" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">event</span>
              <span className="font-body text-sm font-medium">Exams & Logistics</span>
            </Link>
            <Link to="#" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-body text-sm font-medium">Results Processing</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 bg-surface p-8 md:p-12 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
