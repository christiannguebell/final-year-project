import { LayoutDashboard, FileText, CreditCard, GraduationCap, BarChart3, HelpCircle, LogOut, School, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLogout } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Application', path: '/applications' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: School, label: 'Exam Hub', path: '/exams' },
  { icon: BarChart3, label: 'Results', path: '/results' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const { mutate: logout } = useLogout();
  const location = useLocation();

  return (
    <aside className="h-screen w-64 fixed left-0 top-16 bg-surface-container-low flex flex-col p-4 space-y-2 border-r border-outline-variant/10">
      <div className="px-4 py-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-primary font-headline font-bold text-base leading-tight">Candidate Portal</h3>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Engineering & Sciences</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out scale-100 hover:translate-x-1",
                isActive
                  ? "bg-white text-secondary shadow-sm font-bold"
                  : "text-slate-600 hover:bg-slate-200/50 font-medium"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-secondary/20")} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-outline-variant/15 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-200/50 transition-all duration-200 ease-in-out scale-100 hover:translate-x-1">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Support</span>
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 transition-all duration-200 ease-in-out scale-100 hover:translate-x-1"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
