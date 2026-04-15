import { useState, useEffect } from 'react';
import { BadgeCheck, Calendar, School, Award, FileText, Info, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { Application } from '../../../types/application';

export const ReviewSubmitStep = ({ onBack, data }: { onBack: () => void, data: Partial<Application> }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [declared, setDeclared] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFullData = async () => {
      if (data.id) {
        try {
          const response = await apiClient.get<Application>(`/applications/${data.id}`);
          setApplication(response.data.data);
        } catch (error: any) {
          console.error('Failed to reload application for review');
        }
      }
    };
    fetchFullData();
  }, [data.id]);

  const handleSubmit = async () => {
    if (!declared) {
      toast.error('Please accept the declaration');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/applications/${data.id}/submit`);
      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Submission failed. Please check all steps.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin w-10 h-10 text-primary mb-4" />
        <p className="text-on-surface-variant font-bold">Compiling your portfolio...</p>
      </div>
    );
  }

  const candidateName = `${application.candidate?.firstName || ''} ${application.candidate?.lastName || ''}`.trim() || 'Candidate';

  return (
    <div className="max-w-5xl mx-auto px-4">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-secondary font-bold text-xs mb-2 uppercase tracking-widest">
          <BadgeCheck size={14} />
          <span>Final Verification</span>
        </div>
        <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-4 text-center md:text-left">Review & Submission</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed text-center md:text-left">Please verify all information provided. Once submitted, your application enters the verification phase and cannot be modified.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <section className="md:col-span-12 bg-surface-container-low p-6 rounded-xl flex items-center justify-between border border-outline-variant/10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                 {application.candidate?.firstName?.[0] || '?'}{application.candidate?.lastName?.[0] || '?'}
              </div>
              <div>
                 <h2 className="text-xl font-bold text-primary">{candidateName}</h2>
                 <p className="text-xs text-on-surface-variant font-medium">Draft Application ID: {application.id?.split('-')[0]}</p>
              </div>
           </div>
           <div className="px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20">
              Draft Status
           </div>
        </section>

        <section className="md:col-span-7 bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-extrabold text-primary flex items-center gap-2">
              <Info size={18} className="text-secondary" />
              General Information
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1">Identity Provided</p>
              <p className="text-sm text-on-surface font-bold capitalize">{application.candidate?.profile?.idType?.replace('_', ' ') || 'Not specified'}: {application.candidate?.profile?.idNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1">Date of Birth</p>
              <p className="text-sm text-on-surface font-bold">{application.candidate?.profile?.dateOfBirth ? new Date(application.candidate.profile.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1">Nationality</p>
               <p className="text-sm text-on-surface font-bold">{application.candidate?.profile?.nationality || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1">Residence</p>
              <p className="text-sm text-on-surface font-bold">{application.candidate?.profile?.address}, {application.candidate?.profile?.city}, {application.candidate?.profile?.country}</p>
            </div>
          </div>
        </section>

        <section className="md:col-span-5 bg-primary text-white p-8 rounded-xl overflow-hidden relative shadow-lg">
          <div className="absolute -right-12 -top-12 opacity-10">
            <School size={160} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2">
               <Award size={18} className="text-secondary-container" />
               Academic Goal
            </h3>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-6 border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-container mb-2">Program Code: {application.program?.code || 'WAITING'}</p>
              <p className="text-xl font-headline font-extrabold leading-tight">{application.program?.name || 'No Program Selected'}</p>
            </div>
            <div className="flex items-start gap-3">
               <Calendar size={18} className="text-secondary-container shrink-0" />
               <div>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Enrollment Cycle</p>
                  <p className="text-sm font-bold">Academic Session 2024/2025</p>
               </div>
            </div>
          </div>
        </section>

        <section className="md:col-span-12 bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/5">
          <h3 className="text-lg font-headline font-extrabold text-primary mb-6 flex items-center gap-2">
             <School size={18} className="text-secondary" />
             Educational Credentials
          </h3>
          <div className="space-y-4">
            {application.academicRecords?.map((record: any, i: number) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-surface-container-low rounded-lg border border-outline-variant/5 group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">{record.degree}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{record.institution}</p>
                    <p className="text-[10px] text-on-surface-variant/70 mt-1 uppercase tracking-wider">{record.fieldOfStudy} • Grade: {record.grade}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-secondary/10 self-start">
                  <Check size={12} className="text-secondary" />
                  <span className="text-[10px] font-black text-primary uppercase">Record Linked</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-12 bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-outline-variant/5">
          <h3 className="text-lg font-headline font-extrabold text-primary mb-6">Review Documents ({application.documents?.length || 0})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {application.documents?.map((doc: any, i: number) => (
              <div key={i} className="p-4 border border-outline-variant/20 rounded-xl bg-surface-container-low transition-colors flex items-center gap-3">
                <FileText size={18} className="text-primary shrink-0" />
                <div className="overflow-hidden">
                   <p className="text-xs font-bold text-primary truncate capitalize">{doc.type?.replace('_', ' ')}</p>
                   <p className="text-[10px] text-on-surface-variant/60 font-medium">Uploaded Document</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 bg-white p-8 rounded-xl shadow-xl border-t-8 border-secondary">
        <h3 className="text-xl font-headline font-bold text-primary mb-4 italic">Candidate Declaration</h3>
        <div className="flex items-start gap-4 p-5 bg-surface-container-low rounded-lg mb-8 border-l-4 border-primary">
          <input 
            type="checkbox" 
            id="declaration" 
            checked={declared}
            onChange={e => setDeclared(e.target.checked)}
            className="w-5 h-5 mt-1 rounded border-outline-variant text-secondary focus:ring-secondary transition-all cursor-pointer" 
          />
          <label htmlFor="declaration" className="text-sm text-on-surface-variant leading-relaxed select-none cursor-pointer font-medium">
            I {candidateName}, hereby declare that the information provided is accurate and all documents uploaded are genuine copies of the originals. I understand that any misrepresentation will result in immediate disqualification and possible legal action under institutional bylaws.
          </label>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold hover:underline transition-all">
            <ArrowLeft size={18} /> Review Previous Steps
          </button>
          <button 
             onClick={handleSubmit}
             disabled={isSubmitting || !declared}
             className={`px-12 py-4 rounded-lg font-extrabold uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${declared ? 'bg-gradient-to-br from-secondary to-primary hover:translate-y-[-2px]' : 'bg-outline-variant opacity-50 cursor-not-allowed'}`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
              <>Submit Final Application <ArrowRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
