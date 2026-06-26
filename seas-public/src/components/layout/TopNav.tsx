import { useTranslation } from 'react-i18next';
import { Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers';
import { cn } from '../../lib/utils';
import { openSupportEmail } from '../../config/navigation';

interface TopNavProps {
  activeNav?: string;
}

export default function TopNav({ activeNav }: TopNavProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const NAV_ITEMS = [
    { label: t('nav.applications'), path: '/applications' },
    { label: t('nav.programs'), path: '/programs' },
    { label: t('nav.exams'), path: '/exams' },
    { label: t('nav.help'), action: 'help' as const },
  ] as const;

  return (
    <nav className="glass fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant/10 px-8">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="font-headline text-lg font-bold tracking-tighter text-primary">
          SEAS Exam Management
        </Link>
        <div className="hidden gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            const className = cn(
              'font-headline text-sm font-semibold transition-colors duration-300',
              isActive
                ? 'border-b-2 border-secondary pb-0.5 text-secondary'
                : 'text-on-surface-variant hover:text-primary'
            );

            if ('action' in item) {
              return (
                <button key={item.label} type="button" onClick={() => openSupportEmail()} className={className}>
                  {item.label}
                </button>
              );
            }

            return (
              <Link key={item.label} to={item.path} className={className}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/notifications"
          className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-surface-container-low active:scale-95"
        >
          <Bell className="h-5 w-5" />
        </Link>
        <Link
          to="/profile"
          className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-surface-container-low active:scale-95"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm leading-none font-bold text-primary">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Candidate'}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              {user?.role === 'candidate' ? 'ID: Verified Candidate' : 'Candidate Portal'}
            </p>
          </div>
          <Link
            to="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/20 bg-primary/10 text-xs font-bold text-primary uppercase"
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Link>
        </div>
      </div>
    </nav>
  );
}
