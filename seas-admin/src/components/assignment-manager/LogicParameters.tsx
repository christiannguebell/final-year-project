import { Compass, Accessibility, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function LogicParameters() {
  const handleEditRules = () => {
    toast.success('Opening allocation rules policy manager...');
  };

  const rules = [
    {
      title: 'Proximity Optimization',
      description: 'Radius capped at 25 miles from candidate registered address.',
      status: 'ACTIVE',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <Compass className="w-5 h-5 text-indigo-600" />
    },
    {
      title: 'Accessibility Matching',
      description: 'Automatic priority for candidates requiring adaptive infrastructure.',
      status: 'ACTIVE',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <Accessibility className="w-5 h-5 text-indigo-600" />
    },
    {
      title: 'Spillover Logic',
      description: "Direct to 'Satellite Centers' if primary capacity exceeds 95%.",
      status: 'FALLBACK',
      statusClass: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <Layers className="w-5 h-5 text-slate-500" />
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm space-y-6 flex flex-col h-full justify-between animate-in fade-in slide-in-from-left-3 duration-300">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-headline font-bold text-base text-primary">Allocation Logic Parameters</h3>
        <button 
          onClick={handleEditRules}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors hover:underline"
        >
          Edit Rules
        </button>
      </div>

      {/* Rules list */}
      <div className="space-y-4 flex-1">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex gap-4 p-4 border border-outline-variant/10 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant/15 flex items-center justify-center shadow-sm shrink-0">
              {rule.icon}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-primary">{rule.title}</h4>
                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold tracking-wider uppercase ${rule.statusClass} shrink-0`}>
                  {rule.status}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-normal font-medium">
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
