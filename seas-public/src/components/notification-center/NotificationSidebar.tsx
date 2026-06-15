import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { openSupportEmail } from '../../config/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: FileText, label: 'My Applications', path: '/applications' },
  { icon: Calendar, label: 'Exam Schedule', path: '/exams' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/profile' },
];

export default function NotificationSidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 fixed left-0 top-16 bg-surface-container-low flex flex-col p-4 space-y-2 border-r border-outline-variant/10">
      {/* Branding */}
      <div className="px-4 py-5 mb-2">
        <h3 className="text-primary font-headline font-extrabold text-base leading-tight">
          Engineering Portal
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mt-0.5">
          SEAS Admissions
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out hover:translate-x-1',
                isActive
                  ? 'bg-white text-secondary shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-200/50 font-medium'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'fill-secondary/20')} />
              <span className="text-sm">{item.label}</span>
              {/* Unread badge for Notifications */}
              {item.label === 'Notifications' && !isActive && (
                <span className="ml-auto w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Help Center */}
      <div className="mt-auto pb-2">
        <button
          type="button"
          onClick={() => openSupportEmail('Help Center')}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant/40 py-2.5 text-sm font-semibold text-on-surface-variant transition-all duration-200 hover:bg-white active:scale-95"
        >
          Help Center
        </button>
      </div>
    </aside>
  );
}
