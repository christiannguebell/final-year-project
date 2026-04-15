import { useState, useEffect } from 'react';
import { Search, Filter, Check, Star, ClipboardCheck, Clock, Loader2 } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application, Program } from '../../../types/application';

export const ProgramSelectionStep = ({ onNext, onBack, data }: { onNext: (data: Partial<Application>) => void, onBack: () => void, data: Partial<Application> }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(data.programId);
  const [pendingApplicationId, setPendingApplicationId] = useState<string | undefined>(data.id);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await apiClient.get<Program[]>('/programs');
        setPrograms(response.data.data);
      } catch (error: any) {
        toast.error('Failed to load programs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleSelectProgram = async (programId: string) => {
    if (programId === selectedProgramId) return; // already selected
    setIsSaving(true);
    try {
      let applicationId = pendingApplicationId ?? data.id;

      if (!applicationId) {
        const response = await apiClient.post<Application>('/applications', { programId });
        applicationId = response.data.data.id;
        setPendingApplicationId(applicationId);
      } else {
        await apiClient.put(`/applications/${applicationId}`, { programId });
      }

      // Flush local academic records to DB now that we have an applicationId
      if (data.academicRecords && applicationId) {
        for (const record of data.academicRecords) {
          if (!record.id || record.id.includes('.')) {
            await apiClient.post('/academic-records', { ...record, applicationId, id: undefined });
          }
        }
      }

      setSelectedProgramId(programId);
    } catch {
      toast.error('Failed to save selection');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    if (!selectedProgramId) {
      toast.error('Please select a program to continue');
      return;
    }
    onNext({ id: pendingApplicationId ?? data.id, programId: selectedProgramId });
  };

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-bold">Discovering Academic Paths...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 translate-y-0 opacity-100 transition-all">
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative h-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-outline-variant/30 -translate-y-1/2 -z-10 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-secondary -translate-y-1/2 -z-10 rounded-full"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold mb-2 shadow-md">
              <Check size={16} />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Identity</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold mb-2 shadow-md">
              <Check size={16} />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Academic</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-2 shadow-md scale-110">3</div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Program</span>
          </div>
          <div className="flex flex-col items-center opacity-40">
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold mb-2 border-2 border-outline-variant/20">4</div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Review</span>
          </div>
        </div>
      </div>

      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4">Program Selection</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg">Choose your intended path of study. Ensure your prerequisites align with the program requirements before proceeding.</p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-4 shadow-sm border border-outline-variant/5">
        <div className="relative flex-1 w-full">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search by program name or keyword..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary rounded-lg text-on-surface placeholder:text-on-surface-variant/50 shadow-sm"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary rounded-lg py-3 px-4 pr-10 text-on-surface min-w-[160px] appearance-none shadow-sm font-bold text-xs uppercase tracking-wider">
            <option>All Levels</option>
            <option>Bachelor's</option>
            <option>Master's</option>
            <option>PhD</option>
          </select>
          <button className="bg-surface-container-lowest p-3 rounded-lg text-primary hover:bg-surface-container-high transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <div 
            key={program.id}
            className={`group bg-surface-container-lowest p-8 rounded-xl flex flex-col shadow-ambient hover:shadow-lg transition-all relative overflow-hidden ring-2 ring-transparent hover:ring-primary/10 ${program.id === data.programId ? 'ring-primary border-primary' : ''}`}
          >
            {program.durationYears >= 4 && (
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-secondary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                <Star size={10} fill="currentColor" /> Featured
              </div>
            )}
            <div className="mb-6">
              <div className={`inline-flex px-3 py-1 text-[10px] font-black rounded-full mb-4 uppercase tracking-widest bg-primary-container/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors`}>
                {program.degreeLevel || 'Professional Degree'}
              </div>
              <h3 className="text-xl font-headline font-extrabold text-primary mb-2 line-clamp-1">{program.name}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">{program.description}</p>
            </div>
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-start gap-3">
                <ClipboardCheck size={16} className="text-secondary mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Requirements</p>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{program.entryRequirements}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-secondary mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Duration</p>
                  <p className="text-xs text-on-surface-variant">{program.durationYears} Years Full-time</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleSelectProgram(program.id)}
              disabled={isSaving}
              className={`w-full py-4 rounded-lg font-extrabold text-xs uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                program.id === selectedProgramId 
                  ? 'bg-secondary text-white shadow-secondary/20 cursor-default' 
                  : 'bg-primary text-white hover:bg-on-primary-fixed shadow-primary/20 hover:shadow-xl'
              }`}
            >
              {isSaving && program.id !== selectedProgramId ? <Loader2 className="animate-spin" size={16} /> : (program.id === selectedProgramId ? '✓ Selected' : 'Select Path')}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-between items-center gap-8 border-t border-outline-variant/10 pt-10">
        <button onClick={onBack} className="px-8 py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-outline-variant/20 transition-colors shadow-sm active:scale-95">
          Previous Step
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedProgramId || isSaving}
          className={`px-12 py-4 rounded-lg font-extrabold uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
            selectedProgramId && !isSaving
              ? 'bg-gradient-to-br from-secondary to-primary hover:translate-y-[-2px]'
              : 'bg-outline-variant opacity-50 cursor-not-allowed'
          }`}
        >
          Continue to Documents →
        </button>
      </div>
    </div>
  );
};
