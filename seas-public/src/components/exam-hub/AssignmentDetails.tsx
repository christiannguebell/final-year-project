import { useMyExamAssignment } from '../../hooks/useExams';

export default function AssignmentDetails() {
  const { data: assignment, isLoading, isError } = useMyExamAssignment();

  if (isLoading) {
    return (
      <div className="md:col-span-8 bg-white rounded-xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)] overflow-hidden p-8">
        <p className="text-on-surface-variant">Loading exam assignment...</p>
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="md:col-span-8 bg-white rounded-xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)] overflow-hidden p-8">
        <h2 className="text-xl font-bold text-primary mb-2">Assignment Details</h2>
        <p className="text-on-surface-variant">
          No exam assignment found yet. Complete your application and wait for allocation.
        </p>
      </div>
    );
  }

  const center = assignment.center as { name?: string; address?: string; city?: string; location?: string } | undefined;
  const session = assignment.session as { name?: string; examDate?: string } | undefined;
  const examDate = assignment.examTime || session?.examDate;
  const examDateObj = examDate ? new Date(examDate) : null;

  const examData = {
    center: center?.name || 'Exam Center',
    centerAddress: [center?.address || center?.location, center?.city].filter(Boolean).join(', '),
    date: examDateObj
      ? examDateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'To be announced',
    arrivalTime: examDateObj
      ? new Date(examDateObj.getTime() - 30 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : 'TBA',
    sessionStart: examDateObj
      ? examDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : 'TBA',
    sessionEnd: examDateObj
      ? new Date(examDateObj.getTime() + 3 * 60 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : 'TBA',
    duration: '180 Minutes',
    seatNumber: (assignment as { seatNumber?: string }).seatNumber || 'Pending',
    status: 'Exam Confirmed',
  };

  return (
    <div className="md:col-span-8 bg-white rounded-xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)] overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary">Assignment Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Exam Center</p>
            <p className="text-lg font-bold text-primary leading-tight">{examData.center}</p>
            <p className="text-sm text-on-surface-variant mt-0.5">{examData.centerAddress}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Examination Date</p>
            <p className="text-lg font-bold text-primary leading-tight">{examData.date}</p>
            <p className="text-sm text-on-surface-variant mt-0.5">Arrival Time: {examData.arrivalTime}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Session Time</p>
            <p className="text-2xl font-extrabold text-primary">{examData.sessionStart} — {examData.sessionEnd}</p>
            <p className="text-sm text-on-surface-variant mt-0.5">Duration: {examData.duration}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Seat Number</p>
            <div className="mt-1">
              <span className="inline-block border-2 border-primary text-primary font-extrabold text-2xl px-4 py-1 rounded-lg tracking-wider">
                {examData.seatNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block animate-pulse" />
              Status: {examData.status}
            </span>
            <span className="text-xs font-semibold text-secondary">Document Ready</span>
          </div>
          <div className="flex h-2.5 gap-1.5 mt-1">
            <div className="flex-1 bg-secondary rounded-full" />
            <div className="flex-1 bg-secondary rounded-full" />
            <div className="flex-1 bg-secondary rounded-full" />
            <div className="flex-1 bg-primary rounded-full" />
            <div className="flex-1 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
