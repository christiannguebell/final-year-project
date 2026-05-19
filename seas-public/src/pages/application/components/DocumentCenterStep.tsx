import { useState, useEffect } from 'react';
import { BadgeCheck, FileText, Eye, Trash2, CloudUpload, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application } from '../../../types/application';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  status: string;
}

export const DocumentCenterStep = ({ onNext, onBack, data }: { onNext: (data: Partial<Application>) => void, onBack: () => void, data: Partial<Application> }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      if (data.id) {
        try {
          const response = await apiClient.get<Document[]>(`/documents/application/${data.id}`);
          setDocuments(response.data?.data || []);
         } catch {
           console.error('Failed to fetch documents');
         }
      }
    };
    fetchDocs();
  }, [data.id]);

  const handleUpload = async (file: File, type: string) => {
    if (!data.id) {
      toast.error('Application not initialized. Please go back and select a program.');
      return;
    }

    setIsUploading(type);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('applicationId', data.id);
    formData.append('type', type);

    try {
      const response = await apiClient.uploadFile<Document>('/documents/upload', formData);
      if (response.data?.data) {
        setDocuments([...documents, response.data.data]);
      }
      toast.success(`${type.replace('_', ' ')} uploaded successfully`);
       } catch {
          toast.error('Upload failed');
       } finally {
      setIsUploading(null);
    }
  };

  const deleteDoc = async (id: string) => {
    try {
      await apiClient.delete(`/documents/${id}`);
      setDocuments(documents.filter(d => d.id !== id));
      toast.success('Document removed');
     } catch {
       toast.error('Delete failed');
     }
  };

  const getDocByType = (type: string) => documents.find(d => d.type === type);

  const docTypes = [
    { id: 'id_card', label: 'National ID / Passport', description: 'Upload a clear scan of your valid government-issued identification.', required: true },
    { id: 'transcript', label: 'Academic Transcripts', description: 'Include all semesters from your most recently completed degree.', required: true },
    { id: 'certificate', label: 'Degrees & Diplomas', description: 'Official degree certificates or provisional letters of completion.', required: true }
  ];

  const getMissingDocuments = () => {
    return docTypes.filter(doc => !getDocByType(doc.id));
  };

  const handleContinue = () => {
    const missing = getMissingDocuments();
    if (missing.length > 0) {
      toast.error(`Please upload required documents: ${missing.map(d => d.label).join(', ')}`);
      return;
    }
    onNext({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2 font-bold uppercase tracking-widest text-[10px]">
          <span>Step 4 of 6</span>
          <span className="h-px w-8 bg-outline-variant/30"></span>
        </div>
        <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-4 text-center md:text-left">Document Center</h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed text-center md:text-left">Please upload high-resolution documents for institutional verification. Supported formats: PDF, JPEG, PNG (Max 10MB).</p>
      </header>

      <div className="mb-12 flex gap-2 h-1.5 max-w-md mx-auto md:mx-0">
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-primary rounded-full"></div>
        <div className="flex-1 bg-outline-variant/30 rounded-full"></div>
        <div className="flex-1 bg-outline-variant/30 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {docTypes.map((docType) => {
            const uploadedDoc = getDocByType(docType.id);
            return (
              <section key={docType.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline font-bold text-primary text-lg flex items-center gap-2">
                      {uploadedDoc ? <BadgeCheck className="text-secondary" /> : <FileText className="text-primary" />}
                      {docType.label}
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-1">{docType.description}</p>
                  </div>
                  {uploadedDoc && (
                    <span className="flex items-center gap-1.5 bg-secondary-container/30 text-secondary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                      COMPLETED
                    </span>
                  )}
                </div>
                
                {uploadedDoc ? (
                  <div className="bg-surface-container-low rounded-lg p-4 flex items-center justify-between border border-secondary/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm">
                        <FileText size={24} className="text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{uploadedDoc.name}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Verified Format • Ready for Review</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={uploadedDoc.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <Eye size={20} />
                      </a>
                      <button onClick={() => deleteDoc(uploadedDoc.id)} className="p-2 hover:bg-error-container/50 hover:text-error rounded-lg text-on-surface-variant transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative bg-surface-bright border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, docType.id);
                      }}
                      disabled={isUploading !== null}
                    />
                    {isUploading === docType.id ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                        <p className="text-xs font-bold text-primary uppercase">Uploading Documents...</p>
                      </div>
                    ) : (
                      <>
                        <CloudUpload size={40} className="mx-auto text-outline-variant group-hover:text-primary transition-colors mb-3" />
                        <p className="text-primary font-semibold text-sm mb-1">Drag and drop or click to upload</p>
                        <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">PDF, PNG or JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <h4 className="font-headline font-bold text-xl mb-4">Verification Rules</h4>
            <ul className="space-y-4">
              {[
                'Documents must be in high resolution (300 DPI+).',
                'Ensure all four corners of the document are visible.',
                'Translations must be from certified authorities.'
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="p-1 bg-secondary-container rounded-full mt-1">
                    <Check size={10} className="text-secondary" />
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={handleContinue}
              className="w-full bg-secondary py-4 rounded-lg text-white font-headline font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:translate-y-[-2px] transition-all active:scale-95"
            >
              Confirm and Continue
              <ArrowRight size={20} />
            </button>
            <button onClick={onBack} className="w-full bg-transparent py-3 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors">
              Go Back
            </button>
          </div>
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
