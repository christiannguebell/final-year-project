import { Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers';

const tabs = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Exams', path: '/exams' },
  { label: 'Results', path: '/results' },
];

export default function NotificationTopNav() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 glass h-16 flex justify-between items-center px-8 border-b border-outline-variant/10">
      {/* Brand */}
      <div className="flex items-center gap-10">
        <span className="text-lg font-bold text-primary tracking-tighter font-headline">
          SEAS Candidate Portal
        </span>
        <div className="hidden md:flex gap-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.label}
                to={tab.path}
                className={`px-4 py-1.5 text-sm font-semibold font-headline rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary rounded-none'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="relative rounded-full p-2 text-primary transition-all duration-300 hover:bg-surface-container-low active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-error" />
        </Link>
        <Link
          to="/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/20 bg-primary/10 text-xs font-bold text-primary uppercase"
        >
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </Link>
      </div>
    </nav>
  );
}
