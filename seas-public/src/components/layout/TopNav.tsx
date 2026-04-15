import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../../providers';

export default function TopNav() {
  const { user } = useAuth();
  
  return (
    <nav className="fixed top-0 w-full z-50 glass h-16 flex justify-between items-center px-8 border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-primary tracking-tighter font-headline">SEAS Exam Management</span>
        <div className="hidden md:flex gap-6">
          {['Admissions', 'Programs', 'Resources', 'Help'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-on-surface-variant hover:text-primary font-semibold font-headline transition-colors duration-300 text-sm"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-all duration-300 active:scale-95">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-all duration-300 active:scale-95">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary leading-none">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Candidate'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              {user?.role === 'candidate' ? 'ID: Verified Candidate' : 'Candidate Portal'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border border-outline-variant/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </nav>
  );
}
