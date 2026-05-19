import React, { useState } from 'react';
import { 
  ChevronRight, 
  Printer, 
  CheckCircle, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  MapPin, 
  GraduationCap,
  Terminal,
  Clock,
  User,
  XCircle,
  Flag,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Candidate } from '@/src/constants';
import { cn } from '@/src/lib/utils';

export const ApplicationDetail: React.FC<{ candidate: Candidate, onBack: () => void }> = ({ candidate, onBack }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'academic' | 'program'>('bio');

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      {/* Header & Breadcrumbs */}
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <button onClick={onBack} className="hover:text-primary transition-colors">Applications</button>
            <ChevronRight size={12} />
            <span>Engineering Master's</span>
            <ChevronRight size={12} />
            <span className="text-primary font-bold">Review ID: {candidate.appId.split('-').pop()}</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight">Application Verification</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-semibold rounded-lg shadow-sm ring-1 ring-slate-200/50 hover:bg-slate-50 transition-all">
            <Printer size={16} />
            Print Case
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            <CheckCircle size={16} />
            Finalize Decision
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Candidate Data */}
        <section className="col-span-5 flex flex-col gap-6">
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary text-2xl font-bold ring-4 ring-slate-50">
                {candidate.initials}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-extrabold text-primary font-headline tracking-tight">{candidate.name}</h3>
                  <span className="px-3 py-1 bg-secondary-container text-secondary text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {candidate.status === 'PENDING' ? 'In Review' : candidate.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500 mt-1">{candidate.appId}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    {candidate.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <GraduationCap size={12} />
                    {candidate.program}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tabs */}
          <div className="bg-white rounded-xl shadow-sm flex flex-col min-h-[400px]">
            <div className="flex border-b border-slate-100 px-6">
              <TabButton 
                label="Bio Data" 
                active={activeTab === 'bio'} 
                onClick={() => setActiveTab('bio')} 
              />
              <TabButton 
                label="Academic Records" 
                active={activeTab === 'academic'} 
                onClick={() => setActiveTab('academic')} 
              />
              <TabButton 
                label="Program Selection" 
                active={activeTab === 'program'} 
                onClick={() => setActiveTab('program')} 
              />
            </div>
            
            <div className="p-8 space-y-8">
              {activeTab === 'bio' && (
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 animate-in fade-in slide-in-from-left-4 duration-300">
                  <DataField label="Legal First Name" value={candidate.name.split(' ')[0]} />
                  <DataField label="Legal Last Name" value={candidate.name.split(' ')[1]} />
                  <DataField label="Date of Birth" value={candidate.dob} />
                  <DataField label="Nationality" value={candidate.nationality} />
                  <div className="col-span-2">
                    <DataField label="Contact Email" value={candidate.email} />
                  </div>
                  <div className="col-span-2">
                    <DataField label="Residential Address" value={candidate.address} />
                  </div>
                  
                  {/* Competencies */}
                  <div className="col-span-2 bg-slate-50 p-5 rounded-lg mt-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Terminal size={14} />
                      Technical Competencies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.technicalCompetencies.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-white border border-slate-200 text-[11px] font-bold text-primary rounded shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Verification Panel */}
        <section className="col-span-7 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Viewing:</label>
              <select className="bg-slate-100 border-none text-sm font-bold text-primary py-1.5 pl-4 pr-10 rounded-lg focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                <option>Bachelor's Degree Certificate</option>
                <option>National ID Card</option>
                <option>Official Transcripts</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ZoomOut size={18} /></button>
              <span className="text-xs font-bold text-slate-700 px-2">100%</span>
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ZoomIn size={18} /></button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Download size={18} /></button>
            </div>
          </div>

          {/* Document Viewer mock */}
          <div className="bg-slate-200 rounded-xl overflow-hidden shadow-inner aspect-[4/5] flex flex-col relative group">
            <div className="flex-1 bg-white m-6 shadow-2xl p-12 overflow-y-auto no-scrollbar relative flex flex-col items-center justify-center text-center font-serif text-slate-800 border-[12px] border-slate-100">
               <div className="w-24 h-24 mb-6 opacity-20"><GraduationCap size={96} /></div>
               <h1 className="text-3xl font-light mb-4">University of Engineering Excellence</h1>
               <p className="italic text-base mb-8">This is to certify that</p>
               <h2 className="text-4xl font-bold mb-8 uppercase tracking-widest text-slate-900">{candidate.name}</h2>
               <p className="text-lg max-w-lg leading-relaxed mb-12">
                 has successfully completed the prescribed course of study and passed the necessary examinations for the degree of
               </p>
               <h3 className="text-2xl font-bold mb-16 text-slate-900 italic">Bachelor of Technology in Robotics</h3>
               <div className="w-full flex justify-between px-10 mt-12 border-t pt-8 border-slate-200 font-sans font-bold text-[10px]">
                 <div>REGISTRAR</div>
                 <div>CHANCELLOR</div>
               </div>
            </div>

            {/* Verification Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl flex items-center justify-between border border-white/50">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase text-primary tracking-tighter">Document Status</p>
                  <p className="text-[10px] font-medium text-slate-400">Unverified • Added 2 days ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-xl shadow-lg shadow-secondary/10 hover:scale-105 transition-transform">
                  <CheckCircle size={14} />
                  Approve Document
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors">
                  <XCircle size={14} />
                  Reject
                </button>
                <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-primary hover:text-white transition-all">
                  <Flag size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Activity Log</h4>
            <div className="space-y-4">
              {candidate.activityLog.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-2 h-2 rounded-full", log.isPending ? "bg-slate-300" : "bg-secondary")}></div>
                    {i < candidate.activityLog.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1"></div>}
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold", log.isPending ? "text-slate-400 italic" : "text-primary")}>
                      {log.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {log.date} {log.user && `by ${log.user}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-4 text-sm font-semibold transition-all border-b-2",
      active ? "text-primary border-primary font-bold" : "text-slate-400 border-transparent hover:text-primary"
    )}
  >
    {label}
  </button>
);

const DataField = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-primary">{value}</p>
    <div className="h-[1px] w-full bg-slate-100"></div>
  </div>
);
