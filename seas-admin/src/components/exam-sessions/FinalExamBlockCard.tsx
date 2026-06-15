import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function FinalExamBlockCard() {
  const handleManage = () => {
    toast.success('Loading exam window configuration...');
  };

  return (
    <div className="bg-primary-container text-white p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      {/* Blueprint drawing effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="space-y-4 max-w-xl">
        <div className="space-y-1">
          <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
            Final Examination Block
          </h3>
          <p className="text-blue-200 text-xs font-medium max-w-md">
            Upcoming major assessment window covering 14 departments and 4,200 eligible candidates.
          </p>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-3xl font-headline font-black text-white">May 15 — May 30</h2>
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
            Academic Term 2024
          </p>
        </div>
      </div>

      <button 
        onClick={handleManage}
        className="px-6 py-3 bg-secondary hover:opacity-90 active:scale-95 text-white font-bold text-xs tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5 shrink-0"
      >
        <Calendar className="w-4 h-4" />
        Manage Window
      </button>

    </div>
  );
}
