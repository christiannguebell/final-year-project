import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Context selection: 'broadcasts' | 'logistics' | 'results' | 'default'
  let context = 'default';
  let headerTitle = 'SEAS Admin';
  let sidebarGroupLabel = 'Operations';

  if (path.startsWith('/broadcasts')) {
    context = 'broadcasts';
    headerTitle = 'SEAS Broadcasts';
    sidebarGroupLabel = 'Communications';
  } else if (path.startsWith('/exam-centers') || path.startsWith('/exam-sessions') || path.startsWith('/assignment-manager')) {
    context = 'logistics';
    headerTitle = 'SEAS Logistics';
    sidebarGroupLabel = 'Infrastructure';
  } else if (path.startsWith('/results-publication') || path.startsWith('/score-entry')) {
    context = 'results';
    headerTitle = 'SEAS Results Portal';
    sidebarGroupLabel = 'Results Release';
  }

  // Active check helper
  const isActive = (targetPath: string) => {
    if (targetPath === '/' && path === '/') return true;
    if (targetPath !== '/' && path.startsWith(targetPath)) return true;
    return false;
  };

  const getLinkClass = (targetPath: string) => {
    const baseClass = "flex items-center space-x-3 p-3 transition-all duration-200 ease-in-out rounded-lg font-bold text-sm";
    const activeClass = "bg-primary text-white shadow-sm";
    const inactiveClass = "text-on-surface-variant hover:bg-surface-container-high hover:text-primary";
    
    return `${baseClass} ${isActive(targetPath) ? activeClass : inactiveClass}`;
  };

  const renderSidebarLinks = () => {
    switch (context) {
      case 'broadcasts':
        return (
          <>
            <Link to="/" className={getLinkClass('/')}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body">Dashboard</span>
            </Link>
            <Link to="/broadcasts" className={getLinkClass('/broadcasts')}>
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span className="font-body">Broadcasts</span>
            </Link>
            <Link to="/applications" className={getLinkClass('/applications')}>
              <span className="material-symbols-outlined text-[20px]">groups</span>
              <span className="font-body">Targeting</span>
            </Link>
          </>
        );
      case 'logistics':
        return (
          <>
            <Link to="/" className={getLinkClass('/')}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body">Dashboard</span>
            </Link>
            <Link to="/exam-sessions" className={getLinkClass('/exam-sessions')}>
              <span className="material-symbols-outlined text-[20px]">event</span>
              <span className="font-body">Exam Sessions</span>
            </Link>
            <Link to="/exam-centers" className={getLinkClass('/exam-centers')}>
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span className="font-body">Exam Centers</span>
            </Link>
            <Link to="/assignment-manager" className={getLinkClass('/assignment-manager')}>
              <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
              <span className="font-body">Assignment Manager</span>
            </Link>
          </>
        );
      case 'results':
        return (
          <>
            <Link to="/" className={getLinkClass('/')}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body">Dashboard</span>
            </Link>
            <Link to="/score-entry" className={getLinkClass('/score-entry')}>
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span className="font-body">Score Entry</span>
            </Link>
            <Link to="/results-publication" className={getLinkClass('/results-publication')}>
              <span className="material-symbols-outlined text-[20px]">publish</span>
              <span className="font-body">Publication</span>
            </Link>
            <Link to="/applications" className={getLinkClass('/applications')}>
              <span className="material-symbols-outlined text-[20px]">archive</span>
              <span className="font-body">Archived Applications</span>
            </Link>
          </>
        );
      default:
        return (
          <>
            <Link to="/" className={getLinkClass('/')}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body">Dashboard</span>
            </Link>
            <Link to="/candidates" className={getLinkClass('/candidates')}>
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="font-body">Candidates</span>
            </Link>
            <Link to="/applications" className={getLinkClass('/applications')}>
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <span className="font-body">Review Queue</span>
            </Link>
            <Link to="/programs" className={getLinkClass('/programs')}>
              <span className="material-symbols-outlined text-[20px]">school</span>
              <span className="font-body">Programs</span>
            </Link>
            <Link to="/broadcasts" className={getLinkClass('/broadcasts')}>
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span className="font-body">Broadcast Center</span>
            </Link>
            <Link to="/exam-sessions" className={getLinkClass('/exam-sessions')}>
              <span className="material-symbols-outlined text-[20px]">event</span>
              <span className="font-body">Logistics</span>
            </Link>
            <Link to="/results-publication" className={getLinkClass('/results-publication')}>
              <span className="material-symbols-outlined text-[20px]">publish</span>
              <span className="font-body">Results Publication</span>
            </Link>
          </>
        );
    }
  };

  const renderHeaderTabs = () => {
    if (context === 'logistics') {
      return (
        <div className="hidden md:flex space-x-6 items-center text-sm font-bold font-headline">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/exam-centers" className={path.startsWith('/exam-centers') ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Exam Centers</Link>
          <Link to="/exam-sessions" className={path.startsWith('/exam-sessions') ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Exam Sessions</Link>
          <Link to="/assignment-manager" className={path.startsWith('/assignment-manager') ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Assignment Manager</Link>
          <Link to="/" className={path === '/' ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Analytics</Link>
        </div>
      );
    }
    if (context === 'results') {
      return (
        <div className="hidden md:flex space-x-6 items-center text-sm font-bold font-headline">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/score-entry" className={path.startsWith('/score-entry') ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Score Entry</Link>
          <Link to="/results-publication" className={path.startsWith('/results-publication') ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Publication</Link>
          <Link to="/programs" className={path.startsWith('/programs') ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Settings</Link>
        </div>
      );
    }
    return (
      <div className="hidden md:flex space-x-6 items-center text-sm font-bold font-headline">
        <Link to="/applications" className="text-on-surface-variant hover:text-primary transition-colors">System Logs</Link>
        <Link to="/programs" className="text-on-surface-variant hover:text-primary transition-colors">Settings</Link>
      </div>
    );
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl h-16 flex justify-between items-center px-8 max-w-[1920px] mx-auto glass-nav border-b border-outline-variant/15 shadow-sm">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-lg font-bold text-primary tracking-tighter font-headline">{headerTitle}</Link>
          {renderHeaderTabs()}
        </div>
        <div className="flex items-center space-x-6">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:opacity-80 transition-opacity">notifications</span>
          <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full flex items-center justify-center text-on-primary font-bold bg-primary uppercase">A</div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* Side Navigation Bar */}
        <aside className="h-[calc(100vh-64px)] w-64 bg-surface-container-low flex flex-col p-4 space-y-2 sticky top-16 border-r border-outline-variant/15 select-none">
          <div className="px-2 py-4 mb-2">
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold font-headline">A</div>
              <div className="text-primary font-headline font-bold text-xs uppercase tracking-wider">{sidebarGroupLabel}</div>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            {renderSidebarLinks()}
          </nav>

          {/* Bottom Action buttons */}
          <div className="pt-4 border-t border-outline-variant/10 space-y-2">
            {context === 'logistics' && (
              <button
                onClick={() => navigate('/exam-sessions')}
                className="w-full py-2.5 px-4 bg-slate-900 text-white font-bold text-xs rounded-lg shadow hover:bg-slate-800 transition-all mb-2 flex items-center justify-center font-headline uppercase tracking-wider"
              >
                New Session
              </button>
            )}
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/admin/login';
              }}
              className="w-full flex items-center space-x-3 p-3 text-error hover:bg-error-container/20 rounded-lg text-sm font-bold transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-body">Logout</span>
            </button>
          </div>
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

