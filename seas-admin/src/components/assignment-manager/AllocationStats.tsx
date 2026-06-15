import { Users, DoorOpen, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

export default function AllocationStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-left-3 duration-300">
      
      {/* Candidates Box */}
      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden flex flex-col justify-between h-[180px]">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Candidates
          </p>
          <p className="text-4xl font-headline font-black text-primary tracking-tight">
            12,480
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-extrabold mt-2">
          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Check className="w-2.5 h-2.5" />
          </div>
          Verified Profiles
        </div>
        {/* Silhouette Watermark */}
        <Users className="absolute bottom-4 right-4 w-20 h-20 text-slate-100 pointer-events-none -mr-2 -mb-2 opacity-50 shrink-0" />
      </div>

      {/* Capacity Box */}
      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden flex flex-col justify-between h-[180px]">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Capacity
          </p>
          <p className="text-4xl font-headline font-black text-primary tracking-tight">
            14,200
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-700 font-extrabold mt-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">trending_up</span>
          +12% Buffer Room
        </div>
        {/* Silhouette Watermark */}
        <DoorOpen className="absolute bottom-4 right-4 w-20 h-20 text-slate-100 pointer-events-none -mr-2 -mb-2 opacity-50 shrink-0" />
      </div>

      {/* Unassigned Box */}
      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden flex flex-col justify-between h-[180px]">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Unassigned
          </p>
          <p className="text-4xl font-headline font-black text-primary tracking-tight">
            9,112
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-extrabold mt-2">
          <div className="w-4 h-4 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 animate-pulse">
            <AlertCircle className="w-2.5 h-2.5" />
          </div>
          Pending Allocation
        </div>
        {/* Silhouette Watermark */}
        <FileSpreadsheet className="absolute bottom-4 right-4 w-20 h-20 text-slate-100 pointer-events-none -mr-2 -mb-2 opacity-50 shrink-0" />
      </div>

    </div>
  );
}
