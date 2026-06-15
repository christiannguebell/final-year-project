import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function CampusSpatialView() {
  const handlePinClick = (venue: string) => {
    toast.success(`Selected spatial node: ${venue}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg relative h-[300px] flex items-center justify-center p-6 group">
      
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Blueprint Drawing (Isometric Style SVG) */}
      <svg 
        viewBox="0 0 400 200" 
        className="w-full max-w-[500px] h-auto text-sky-400 opacity-60 drop-shadow-[0_0_12px_rgba(56,189,248,0.3)] pointer-events-none"
      >
        {/* Isometric Building Cubes */}
        {/* Hall 1 */}
        <path d="M50 120 L150 70 L250 120 L150 170 Z" fill="rgba(14, 165, 233, 0.1)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M50 120 L50 150 L150 200 L150 170 Z" fill="rgba(14, 165, 233, 0.15)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M250 120 L250 150 L150 200 L150 170 Z" fill="rgba(14, 165, 233, 0.2)" stroke="currentColor" strokeWidth="1.5" />

        {/* Hall 2 */}
        <path d="M180 80 L240 50 L300 80 L240 110 Z" fill="rgba(14, 165, 233, 0.05)" stroke="currentColor" strokeWidth="1.2" />
        <path d="M180 80 L180 100 L240 130 L240 110 Z" fill="rgba(14, 165, 233, 0.1)" stroke="currentColor" strokeWidth="1.2" />
        <path d="M300 80 L300 100 L240 130 L240 110 Z" fill="rgba(14, 165, 233, 0.15)" stroke="currentColor" strokeWidth="1.2" />

        {/* Connecting Paths / Grid overlays */}
        <line x1="150" y1="170" x2="240" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="50" y1="120" x2="180" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      {/* Interactive Floating Pin 1 (Engineering Hall) */}
      <button 
        onClick={() => handlePinClick('Maxwell Engineering Hall')}
        className="absolute top-[52%] left-[42%] -translate-x-1/2 -translate-y-1/2 bg-primary text-white border-2 border-sky-400 p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
        title="Maxwell Engineering Hall"
      >
        <MapPin className="w-5 h-5 text-sky-400 animate-bounce" />
      </button>

      {/* Interactive Floating Pin 2 (Tesla Research) */}
      <button 
        onClick={() => handlePinClick('Tesla Research Annex')}
        className="absolute top-[38%] left-[62%] -translate-x-1/2 -translate-y-1/2 bg-primary text-white border-2 border-sky-400/80 p-1.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
        title="Tesla Research Annex"
      >
        <MapPin className="w-4 h-4 text-sky-400/80" />
      </button>

      {/* Header Overlay Tag */}
      <div className="absolute bottom-6 left-6 bg-slate-900/90 border border-slate-800 text-sky-400 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
        Campus Spatial View - Sector 7A
      </div>

    </div>
  );
}
