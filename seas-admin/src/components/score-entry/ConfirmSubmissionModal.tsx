import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ConfirmSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  entryCount?: number;
  subjectList?: string[];
}

export default function ConfirmSubmissionModal({ isOpen, onClose, onConfirm, isLoading = false, entryCount = 0, subjectList = [] }: ConfirmSubmissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-outline-variant/15 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Core Layout */}
        <div className="p-8 space-y-6 flex-1">
          
          {/* Header check circle */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm relative">
              <div className="absolute inset-0 rounded-full border border-emerald-200/50 animate-ping opacity-25" />
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-headline font-extrabold text-primary tracking-tight">
              Confirm Final Submission
            </h3>
            
            <p className="text-on-surface-variant text-xs leading-relaxed max-w-sm">
              You are about to finalize the submission for <strong className="text-primary font-bold">{subjectList.length > 0 ? subjectList.join(', ') : 'selected subjects'}</strong>. This action will save the scores and make them available for publication.
            </p>
          </div>

          {/* Diagnostic Metrics box */}
          <div className="bg-slate-50 border border-outline-variant/10 rounded-lg p-5 space-y-3 font-medium text-xs">
            <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/10 pb-2.5">
              <span>Candidate Count:</span>
              <span className="font-extrabold text-primary">{entryCount} Student{entryCount === 1 ? '' : 's'}</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/10 pb-2.5">
              <span>Validation Status:</span>
              <span className="flex items-center gap-1 text-emerald-700 font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                All Checks Passed
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span>Protocol Integrity:</span>
              <span className="font-extrabold text-primary font-mono text-[10px]">SEAS-Standard 2.0</span>
            </div>
          </div>

          {/* Left-Bordered Warning Notice */}
          <div className="bg-rose-50/50 border-l-4 border-rose-500 rounded-r-lg p-4 flex gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed text-rose-950 font-medium">
              <strong className="font-bold text-rose-800">Security Warning:</strong> This action is irreversible within the current evaluation window. Technical overrides require department head authorization.
            </div>
          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="bg-slate-50 border-t border-outline-variant/10 p-5 px-8 flex justify-end items-center gap-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 border border-outline-variant/20 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-all"
          >
            CANCEL
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                SUBMITTING...
              </>
            ) : (
              'CONFIRM SUBMISSION'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
