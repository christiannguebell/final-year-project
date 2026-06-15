import { Bell, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers';
import { openSupportEmail } from '../../config/navigation';

const tabs = ['Dashboard', 'Score Breakdown', 'Ranking', 'Admissions'];

interface ResultTopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ResultTopNav({ activeTab, onTabChange }: ResultTopNavProps) {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass h-16 flex justify-between items-center px-8 border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-primary tracking-tighter font-headline">
          SEAS Results Portal
        </span>
        <div className="hidden md:flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-1.5 text-sm font-semibold font-headline rounded-md transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-secondary border-b-2 border-secondary rounded-none'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/notifications"
          className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-surface-container-low active:scale-95"
        >
          <Bell className="h-5 w-5" />
        </Link>
        <button
          type="button"
          onClick={() => openSupportEmail()}
          className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-surface-container-low active:scale-95"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
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
