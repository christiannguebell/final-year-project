import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useLogout } from '../hooks/useAuth';
import { openSupportEmail } from '../config/navigation';

const DashboardLayout: React.FC = () => {
  const logout = useLogout();

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl h-16 flex justify-between items-center px-8 max-w-[1920px] mx-auto glass-nav">
        <Link to="/dashboard" className="text-lg font-bold text-primary tracking-tighter font-headline">
          SEAS Platform
        </Link>
        <div className="hidden md:flex space-x-8 items-center font-headline font-semibold tracking-tight">
          <Link to="/applications" className="text-on-surface-variant hover:text-primary-container transition-opacity duration-300">
            Admissions
          </Link>
          <Link to="/programs" className="text-on-surface-variant hover:text-primary-container transition-opacity duration-300">
            Programs
          </Link>
          <Link to="/exams" className="text-on-surface-variant hover:text-primary-container transition-opacity duration-300">
            Resources
          </Link>
          <button
            type="button"
            onClick={() => openSupportEmail()}
            className="text-on-surface-variant hover:text-primary-container transition-opacity duration-300"
          >
            Help
          </button>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/notifications" className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:opacity-80 transition-opacity">
            notifications
          </Link>
          <Link to="/profile" className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:opacity-80 transition-opacity">
            settings
          </Link>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-primary-container overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-on-primary font-bold bg-primary uppercase">U</div>
          </Link>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        <aside className="h-[calc(100vh-64px)] w-64 bg-surface-container-low flex flex-col p-4 space-y-2 sticky top-16 border-r border-outline-variant/15">
          <div className="px-2 py-4 mb-4">
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">S</div>
              <div className="text-primary font-headline font-bold text-sm">Candidate Portal</div>
            </div>
            <div className="text-xs text-on-surface-variant font-medium pl-11">Engineering & Sciences</div>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center space-x-3 p-3 bg-surface-container-lowest text-secondary rounded-lg shadow-sm font-bold transition-all duration-200 ease-in-out">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-body text-sm font-medium">Dashboard</span>
            </Link>
            <Link to="/applications" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">description</span>
              <span className="font-body text-sm font-medium">Application</span>
            </Link>
            <Link to="/payments" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-body text-sm font-medium">Payments</span>
            </Link>
            <Link to="/exams" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">school</span>
              <span className="font-body text-sm font-medium">Exam Hub</span>
            </Link>
            <Link to="/results" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-body text-sm font-medium">Results</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-lg">
              <span className="material-symbols-outlined">person</span>
              <span className="font-body text-sm font-medium">Profile</span>
            </Link>
          </nav>

          <div className="mt-auto pt-4 space-y-1">
            <button
              type="button"
              onClick={() => openSupportEmail()}
              className="flex w-full items-center space-x-3 rounded-lg p-3 text-on-surface-variant transition-all duration-200 ease-in-out hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined">contact_support</span>
              <span className="font-body text-sm font-medium">Support</span>
            </button>
            <button
              type="button"
              onClick={() => logout.mutate()}
              className="w-full flex items-center space-x-3 p-3 text-error hover:bg-error-container/50 transition-all duration-200 ease-in-out rounded-lg"
            >
              <span className="material-symbols-outlined text-error">logout</span>
              <span className="font-body text-sm font-medium text-error flex-1 text-left">Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-surface p-8 md:p-12 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
