import BroadcastStats from '@/components/broadcast-center/BroadcastStats';
import CreateBroadcastForm from '@/components/broadcast-center/CreateBroadcastForm';
import RecentBroadcasts from '@/components/broadcast-center/RecentBroadcasts';
import { useNavigate } from 'react-router-dom';

export default function BroadcastCenter() {
  const navigate = useNavigate();

  const handleViewAnalytics = () => {
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* Top Header Panel */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Broadcast Center
          </h2>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Design and deploy critical system-wide communications across digital touchpoints for the engineering academic community.
          </p>
        </div>
        <button 
          onClick={handleViewAnalytics}
          className="px-5 py-2.5 bg-white text-primary border border-outline-variant/30 hover:bg-slate-50 transition-colors font-bold text-xs rounded-lg shadow-sm"
        >
          View Analytics
        </button>
      </div>

      {/* Top Indicators */}
      <BroadcastStats />

      {/* Bottom Main Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Broadcast form pane */}
        <div className="lg:col-span-5">
          <CreateBroadcastForm />
        </div>

        {/* Recent Broadcasts queue pane */}
        <div className="lg:col-span-7">
          <RecentBroadcasts />
        </div>
      </div>

    </div>
  );
}
