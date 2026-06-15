import { Zap, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function QuickAllocationCard() {
  const handleRun = () => {
    toast.success('Running seat allocation diagnostics...');
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-outline-variant/15 shadow-sm h-full flex flex-col justify-between space-y-4">
      
      <div className="space-y-3">
        <div className="w-10 h-10 bg-secondary-container/20 text-secondary rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 fill-secondary" />
        </div>
        <div>
          <h4 className="text-sm font-headline font-black text-primary">Quick Allocation</h4>
          <p className="text-xs text-on-surface-variant/80 mt-1 leading-normal">
            Automatically balance proctor ratios and center capacity for the current examination term.
          </p>
        </div>
      </div>

      <button 
        onClick={handleRun}
        className="flex items-center gap-1 text-xs font-black text-secondary hover:underline transition-colors uppercase tracking-wider text-left pt-2"
      >
        Run Diagnostics
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>
  );
}
