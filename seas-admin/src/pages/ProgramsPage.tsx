import { Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';
import { ProgramCard } from '@/components/ProgramCard';

export default function ProgramsPage() {
  const { data, isLoading } = usePrograms({ limit: 50 });
  const programs = data?.items || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="architect-card p-6 border-b-2 border-primary transition-all hover:translate-y-[-2px]">
          <div className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mb-2">Total Programs</div>
          <div className="text-3xl font-headline font-extrabold text-primary">{isLoading ? '...' : programs.length}</div>
          <div className="flex items-center gap-1 mt-2 text-secondary font-bold text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Active programs</span>
          </div>
        </div>
        <div className="architect-card p-6 border-b-2 border-primary transition-all hover:translate-y-[-2px]">
          <div className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mb-2">Active</div>
          <div className="text-3xl font-headline font-extrabold text-secondary">
            {isLoading ? '...' : programs.filter(p => p.isActive).length}
          </div>
          <div className="flex items-center gap-1 mt-2 text-secondary font-bold text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Currently running</span>
          </div>
        </div>
        <div className="architect-card p-6 border-b-2 border-primary transition-all hover:translate-y-[-2px]">
          <div className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mb-2">Total Candidates</div>
          <div className="text-3xl font-headline font-extrabold text-primary">
            {isLoading ? '...' : programs.reduce((acc) => acc + 0, 0)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-secondary font-bold text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Across all programs</span>
          </div>
        </div>
        <div className="architect-card p-6 border-b-2 border-primary transition-all hover:translate-y-[-2px]">
          <div className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mb-2">Avg. Capacity</div>
          <div className="text-3xl font-headline font-extrabold text-primary">82%</div>
          <div className="flex items-center gap-1 mt-2 text-secondary font-bold text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Optimal fill rate</span>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-xl font-headline font-bold text-primary">Active Programs</h2>
            <p className="text-on-surface-variant text-sm">Manage academic programs and capacity</p>
          </div>
          <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-on-surface-variant">Loading programs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.id}>
                <ProgramCard program={{ ...p, applicants: 0, capacity: 100, deadline: p.createdAt }} />
              </div>
            ))}
          
            <button className="bg-surface-container-low/50 p-6 rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-primary-container transition-all min-h-[240px]">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-primary-container" />
              </div>
              <div className="font-headline font-bold text-on-surface-variant/70 group-hover:text-primary">Add Program</div>
              <div className="text-xs text-on-surface-variant/50">Expand the curriculum</div>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
