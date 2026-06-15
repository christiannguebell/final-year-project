interface ProcessingStatusProps {
  progress: number;
  isProcessing: boolean;
  eta: string;
  currentTask: string;
}

export default function ProcessingStatus({ progress, isProcessing, eta, currentTask }: ProcessingStatusProps) {
  // Let's divide 100 into 8 segments
  const totalSegments = 8;
  const filledSegments = Math.round((progress / 100) * totalSegments);

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm space-y-6 flex flex-col h-full justify-between animate-in fade-in slide-in-from-right-3 duration-300">
      
      {/* Header and percentage */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h3 className="font-headline font-bold text-base text-primary">Engine Processing Status</h3>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Current Queue <span className="text-[8px]">•</span> Center Load Balancing
          </p>
        </div>
        <p className="text-4xl font-headline font-black text-primary tracking-tight shrink-0">
          {progress}%
        </p>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isFilled = idx < filledSegments;
            return (
              <div 
                key={idx} 
                className={`h-4 rounded transition-all duration-300 ${
                  isFilled 
                    ? isProcessing 
                      ? 'bg-emerald-600 animate-pulse' 
                      : 'bg-emerald-600' 
                    : 'bg-slate-100 border border-outline-variant/5'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Detail Block */}
      <div className="bg-slate-50 border border-outline-variant/10 rounded-lg p-4 flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isProcessing ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'}`} />
        <p className="text-xs text-primary leading-normal font-medium flex-1">
          {isProcessing ? (
            <span>Assigning candidates...</span>
          ) : (
            <span>{currentTask}</span>
          )}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pt-2 border-t border-outline-variant/10">
        <span>ETA: {eta}</span>
        <span>V4.2 HEURISTIC ACTIVE</span>
      </div>

    </div>
  );
}
