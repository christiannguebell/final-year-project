import { useState, useEffect } from 'react';
import { Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';

import AllocationStats from '@/components/assignment-manager/AllocationStats';
import LogicParameters from '@/components/assignment-manager/LogicParameters';
import ProcessingStatus from '@/components/assignment-manager/ProcessingStatus';
import LiveLogs from '@/components/assignment-manager/LiveLogs';
import type { LogItem } from '@/components/assignment-manager/LiveLogs';

import { useAutoAllocate, useExamSessions } from '@/hooks/useExams';

const INITIAL_LOGS: LogItem[] = [
  {
    timestamp: '14:02:11',
    actionType: 'BATCH_ALLOCATE',
    description: 'Successfully assigned 450 candidates to London Central (Zone A)',
    status: 'SUCCESS'
  },
  {
    timestamp: '14:02:08',
    actionType: 'RE-ROUTE',
    description: 'Cambridge South over capacity; re-routing 12 overflow to Newmarket',
    status: 'ROUTED'
  },
  {
    timestamp: '14:01:55',
    actionType: 'ACCESSIBILITY_LOCK',
    description: 'Dedicated seating locked for ID #44211 (Wheelchair Access)',
    status: 'SUCCESS'
  }
];

export default function AssignmentManager() {
  const allocateMutation = useAutoAllocate();
  const { data: sessionsData } = useExamSessions();
  const activeSession = sessionsData?.items?.[0];
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [progress, setProgress] = useState(72);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eta, setEta] = useState('02M 45S');
  const [currentTask, setCurrentTask] = useState('Assigning 1,450 candidates to Manchester Digital Hub');

  const handleExecuteAssignment = () => {
    if (isProcessing) return;
    if (!activeSession) {
      toast.error('Create an exam session before running auto-allocation.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setEta('04M 12S');
    setCurrentTask('Initializing allocation engine...');
    toast.success('Auto-allocation engine started successfully!');

    allocateMutation.mutate(
      { sessionId: activeSession.id },
      {
        onSuccess: (data) => {
          const assigned = (data as { assigned?: number })?.assigned ?? 0;
          toast.success(`Allocated ${assigned} candidate(s) successfully`);
        },
        onError: () => toast.error('Auto-allocation failed. Check centers and approved applications.'),
      }
    );

    // Add initial execution log
    const startTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [
      {
        timestamp: startTime,
        actionType: 'ENGINE_START',
        description: 'Auto-allocation engine initialized. Running proximity and accessibility algorithms.',
        status: 'SUCCESS'
      },
      ...prev
    ]);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 8;
        const timeString = new Date().toLocaleTimeString('en-GB', { hour12: false });
        
        if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setEta('00M 00S');
          setCurrentTask('All allocations completed successfully.');
          
          setLogs(prevLogs => [
            {
              timestamp: timeString,
              actionType: 'ALLOCATE_COMPLETE',
              description: 'Successfully allocated all 9,112 pending candidates across registered centers.',
              status: 'SUCCESS'
            },
            ...prevLogs
          ]);
          toast.success('Auto-allocation execution completed successfully!');
          return 100;
        }

        // Mid-way task descriptions and updates
        if (next === 24) {
          setCurrentTask('Optimizing candidate proximity to Sector 7A venues...');
          setEta('03M 10S');
          setLogs(prevLogs => [
            {
              timestamp: timeString,
              actionType: 'PROXIMITY_MATCH',
              description: 'Optimizing distance matrices; 3,210 candidates matched within 10-mile radius.',
              status: 'SUCCESS'
            },
            ...prevLogs
          ]);
        } else if (next === 48) {
          setCurrentTask('Resolving accessibility seating priorities...');
          setEta('02M 05S');
          setLogs(prevLogs => [
            {
              timestamp: timeString,
              actionType: 'ACCESSIBILITY_LOCK',
              description: 'Locked 142 terminals for candidates requiring adaptive infrastructure.',
              status: 'SUCCESS'
            },
            ...prevLogs
          ]);
        } else if (next === 72) {
          setCurrentTask('Balancing workloads at Manchester Digital Hub...');
          setEta('01M 15S');
          setLogs(prevLogs => [
            {
              timestamp: timeString,
              actionType: 'LOAD_BALANCING',
              description: 'Manchester Digital Hub workload balanced. 1,450 candidates locked.',
              status: 'SUCCESS'
            },
            ...prevLogs
          ]);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* Top Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Assignment Manager
          </h2>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
            Global Exam Cycle: Fall 2024 • Phase 02 (Allocation)
          </p>
        </div>

        {/* System Health */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm">
          <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            System Health:
          </span>
          <span className="text-xs font-extrabold text-emerald-700">
            Ready for Processing
          </span>
        </div>
      </div>

      {/* Row 1: Stats & Execution Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Stats Column (col-span 8) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <AllocationStats />
        </div>

        {/* Right Execution Card Column (col-span 4) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-950 text-white p-6 rounded-xl border border-slate-900 shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] hover:border-slate-800 transition-all duration-300">
            <div className="space-y-2 relative z-10">
              <h3 className="font-headline font-black text-base tracking-tight text-white">
                Initialize Auto-Allocation
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm">
                Deploy the heuristic engine to match candidate accessibility needs with regional center proximity.
              </p>
            </div>
            
            <button 
              onClick={handleExecuteAssignment}
              disabled={isProcessing}
              className="mt-6 w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-2 relative z-10 font-headline uppercase tracking-wider"
            >
              <Zap className={`w-4 h-4 ${isProcessing ? 'animate-bounce text-yellow-300' : ''}`} />
              {isProcessing ? 'Processing...' : 'Execute Assignment'}
            </button>

            {/* Glowing blur background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          </div>
        </div>

      </div>

      {/* Row 2: Parameters & Progress Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <div>
          <LogicParameters />
        </div>

        <div>
          <ProcessingStatus 
            progress={progress}
            isProcessing={isProcessing}
            eta={eta}
            currentTask={currentTask}
          />
        </div>

      </div>

      {/* Row 3: Transaction Logs */}
      <div>
        <LiveLogs logs={logs} />
      </div>

    </div>
  );
}
