import { useState, useEffect } from 'react';
import { PlusCircle, Info, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../api/client';
import type { Application, AcademicRecord } from '../../../types/application';

export const AcademicRecordsStep = ({ onNext, onBack, data }: { onNext: (data: Partial<Application>) => void, onBack: () => void, data: Partial<Application> }) => {
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newRecord, setNewRecord] = useState<Partial<AcademicRecord>>({
    institution: '',
    degree: '',
    startDate: '',
    endDate: '',
    grade: '',
    fieldOfStudy: ''
  });

  useEffect(() => {
    const fetchRecords = async () => {
      if (!data.id) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get<AcademicRecord[]>(`/academic-records/application/${data.id}`);
        setRecords(response.data?.data || []);
      } catch {
        console.error('Failed to fetch academic records');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [data.id]);

  const handleSaveEntry = async () => {
    if (!newRecord.institution || !newRecord.degree) {
      toast.error('Institution and Degree are required');
      return;
    }

    if (!data.id) {
      toast.error('Application not initialized. Please go back to Step 1.');
      return;
    }

    try {
      const response = await apiClient.post<AcademicRecord>('/academic-records', {
        ...newRecord,
        applicationId: data.id,
      });
      if (response.data?.data) {
        setRecords([...records, response.data.data]);
      }
      toast.success('Academic record saved');
      } catch {
        toast.error('Failed to save academic record');
        return;
      }

    setIsAdding(false);
    setNewRecord({ institution: '', degree: '', startDate: '', endDate: '', grade: '', fieldOfStudy: '' });
  };

  const removeRecord = async (id: string) => {
    try {
      await apiClient.delete(`/academic-records/${id}`);
      setRecords(records.filter(r => r.id !== id));
      toast.success('Record removed');
     } catch {
       toast.error('Failed to delete record');
     }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-bold">Loading academic records...</p>
      </div>
    );
  }

  const handleContinue = () => {
    if (records.length === 0) {
      toast.error('Please add at least one academic record');
      return;
    }
    onNext({ academicRecords: records });
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Step 2 of 6</span>
          <h1 className="text-3xl font-extrabold text-primary font-headline tracking-tight">Academic Records</h1>
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-16 bg-secondary rounded-full"></div>
          <div className="h-1.5 w-16 bg-secondary rounded-full"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 w-16 bg-outline-variant/30 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-surface-container-low p-6 rounded-xl space-y-4 shadow-sm border border-outline-variant/5">
            <h3 className="text-lg font-bold text-primary font-headline">Submission Guidelines</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Please provide details of all post-secondary education institutions attended. You will need to upload official transcripts for each entry in the next step.
            </p>
            <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-secondary/10">
              <Info size={16} className="text-secondary mt-0.5" />
              <p className="text-xs text-on-surface-variant">Include institutions even if a degree was not conferred.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient border border-outline-variant/5">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary font-headline">Educational History</h2>
                {!isAdding && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 text-sm font-bold text-secondary hover:opacity-80 transition-opacity"
                  >
                    <PlusCircle size={18} />
                    Add Another
                  </button>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                      <th className="px-4 py-3 first:rounded-l-lg">Institution</th>
                      <th className="px-4 py-3">Degree</th>
                      <th className="px-4 py-3 text-right last:rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-on-surface-variant opacity-50 italic text-sm">
                          No educational records added yet.
                        </td>
                      </tr>
                    ) : (
                      records.map((record) => (
                        <tr key={record.id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-4 py-4">
                            <div className="font-bold text-sm text-primary">{record.institution}</div>
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{record.fieldOfStudy}</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">{record.degree}</td>
                          <td className="px-4 py-4 text-right">
                            <button 
                              onClick={() => record.id && removeRecord(record.id)}
                              className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {isAdding && (
            <div className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-primary/10">
              <h3 className="text-lg font-bold text-primary font-headline mb-6">New Academic Entry</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Institution Name</label>
                    <input 
                      type="text" 
                      value={newRecord.institution}
                      onChange={e => setNewRecord({...newRecord, institution: e.target.value})}
                      placeholder="e.g., Stanford University" 
                      className="w-full bg-surface-container-lowest border-b-2 border-primary focus:ring-0 focus:outline-none p-3 text-sm transition-all shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Degree Type</label>
                    <select 
                      value={newRecord.degree}
                      onChange={e => setNewRecord({...newRecord, degree: e.target.value})}
                      className="w-full bg-surface-container-lowest border-b-2 border-primary focus:ring-0 focus:outline-none p-3 text-sm appearance-none shadow-sm"
                    >
                      <option value="">Select Degree</option>
                      <option value="Bachelors">Bachelors Degree</option>
                      <option value="Masters">Masters Degree</option>
                      <option value="PhD">PhD / Doctorate</option>
                      <option value="Secondary">Secondary School</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Major / Field of Study</label>
                    <input 
                      type="text" 
                      value={newRecord.fieldOfStudy}
                      onChange={e => setNewRecord({...newRecord, fieldOfStudy: e.target.value})}
                      placeholder="e.g., Civil Engineering" 
                      className="w-full bg-surface-container-lowest border-b-2 border-primary focus:ring-0 focus:outline-none p-3 text-sm shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Start Date</label>
                    <input 
                      type="date" 
                      value={newRecord.startDate}
                      onChange={e => setNewRecord({...newRecord, startDate: e.target.value})}
                      className="w-full bg-surface-container-lowest border-b-2 border-primary focus:ring-0 focus:outline-none p-3 text-sm shadow-sm" 
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Graduation / End Date</label>
                    <input 
                      type="date" 
                      value={newRecord.endDate}
                      onChange={e => setNewRecord({...newRecord, endDate: e.target.value})}
                      className="w-full bg-surface-container-lowest border-b-2 border-primary focus:ring-0 focus:outline-none p-3 text-sm shadow-sm" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">GPA / Final Grade</label>
                    <input 
                      type="text" 
                      value={newRecord.grade}
                      onChange={e => setNewRecord({...newRecord, grade: e.target.value})}
                      placeholder="e.g., 3.8/4.0 or Upper Second Class" 
                      className="w-full bg-surface-container-lowest border-b-2 border-primary focus:ring-0 focus:outline-none p-3 text-sm shadow-sm" 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-2.5 text-sm font-bold text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEntry}
                    className="ml-4 px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-lg shadow-md hover:opacity-90 transition-all active:scale-95"
                   >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 border-t border-outline-variant/10">
            <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold hover:underline transition-all">
              Previous Step
            </button>
            <button 
              onClick={handleContinue}
              className="px-12 py-4 bg-gradient-to-br from-secondary to-[#0e7144] text-white font-extrabold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              Continue to Program
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
