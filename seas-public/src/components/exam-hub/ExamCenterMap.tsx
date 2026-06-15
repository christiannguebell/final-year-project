import { ExternalLink } from 'lucide-react';

export default function ExamCenterMap() {
  return (
    <div className="md:col-span-4 bg-white rounded-xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)] overflow-hidden flex flex-col">
      {/* Map image — dark campus satellite view */}
      <div className="relative flex-1 min-h-[200px] bg-[#1a2a3a]">
        {/* Simulated map grid */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,200,150,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,200,150,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
        {/* Building blocks representation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
          {/* Roads */}
          <rect x="0" y="90" width="300" height="20" fill="rgba(255,255,255,0.06)" />
          <rect x="130" y="0" width="16" height="200" fill="rgba(255,255,255,0.06)" />
          <rect x="0" y="150" width="300" height="12" fill="rgba(255,255,255,0.04)" />
          {/* Buildings */}
          <rect x="20" y="20" width="90" height="60" rx="4" fill="rgba(4,109,64,0.3)" stroke="rgba(4,109,64,0.6)" strokeWidth="1" />
          <rect x="30" y="30" width="30" height="20" rx="2" fill="rgba(4,109,64,0.4)" />
          <rect x="65" y="30" width="35" height="20" rx="2" fill="rgba(4,109,64,0.4)" />
          <rect x="30" y="55" width="70" height="18" rx="2" fill="rgba(4,109,64,0.25)" />
          
          <rect x="160" y="15" width="120" height="65" rx="4" fill="rgba(0,25,60,0.5)" stroke="rgba(100,150,255,0.3)" strokeWidth="1" />
          <rect x="170" y="25" width="45" height="15" rx="2" fill="rgba(100,150,255,0.2)" />
          <rect x="220" y="25" width="50" height="15" rx="2" fill="rgba(100,150,255,0.2)" />
          <rect x="170" y="45" width="100" height="25" rx="2" fill="rgba(100,150,255,0.15)" />
          
          <rect x="20" y="115" width="100" height="50" rx="4" fill="rgba(30,50,80,0.5)" stroke="rgba(100,150,200,0.2)" strokeWidth="1" />
          <rect x="160" y="115" width="70" height="25" rx="4" fill="rgba(30,50,80,0.4)" stroke="rgba(100,150,200,0.2)" strokeWidth="1" />
          <rect x="240" y="115" width="45" height="45" rx="4" fill="rgba(30,50,80,0.4)" stroke="rgba(100,150,200,0.2)" strokeWidth="1" />
          
          <rect x="20" y="170" width="260" height="20" rx="4" fill="rgba(20,40,70,0.3)" />
          
          {/* Target pin — Hall of Science */}
          <circle cx="75" cy="50" r="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <circle cx="75" cy="50" r="7" fill="white" />
          <circle cx="75" cy="50" r="3.5" fill="#046d40" />
        </svg>
        {/* Pulse ring around pin */}
        <div className="absolute top-[45px] left-[66px] w-7 h-7 rounded-full border-2 border-white/40 animate-ping" />
      </div>

      {/* Info panel */}
      <div className="p-5 border-t border-outline-variant/10">
        <h3 className="font-bold text-primary text-sm">Interactive Directions</h3>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          Navigate to Hall of Science via public transit or campus shuttle.
        </p>
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-secondary font-bold text-sm mt-3 hover:underline group"
        >
          Open in Maps
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}
