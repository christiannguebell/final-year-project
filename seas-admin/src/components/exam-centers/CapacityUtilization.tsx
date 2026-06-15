import { BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function CapacityUtilization() {
  const handleViewTrends = () => {
    toast.success('Loading historical utilization trends...');
  };

  return (
    <div className="bg-primary text-white p-6 rounded-xl shadow-lg border border-primary/20 flex flex-col justify-between h-[300px]">
      
      {/* Header */}
      <div>
        <h3 className="text-md font-headline font-bold text-white mb-4">Capacity Utilization</h3>
        
        {/* Progress items */}
        <div className="space-y-4">
          {/* Morning */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-blue-200">
              <span>Morning Session (08:00)</span>
              <span>92%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          {/* Afternoon */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-blue-200">
              <span>Afternoon Session (13:00)</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Evening */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-blue-200">
              <span>Evening Session (17:00)</span>
              <span>15%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-400 h-full rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button 
        onClick={handleViewTrends}
        className="w-full py-2.5 bg-white/10 hover:bg-white/15 active:bg-white/5 border border-white/20 rounded-lg text-xs font-bold tracking-wider uppercase transition-all mt-4 flex items-center justify-center gap-1.5"
      >
        <BarChart3 className="w-3.5 h-3.5" />
        View Capacity Trends
      </button>

    </div>
  );
}
