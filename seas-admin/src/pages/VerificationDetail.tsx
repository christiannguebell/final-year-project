import { ArrowLeft, CheckCircle, XCircle, Download, ZoomIn, ZoomOut, FileText, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCandidateById } from '@/hooks/useCandidates';
import { useApplicationById, useApproveApplication, useRejectApplication } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

export default function VerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);

  const { data: candidateData, isLoading: candidateLoading } = useCandidateById(id || '');
  const { data: appData, isLoading: appLoading } = useApplicationById(id || '');
  
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const candidate = candidateData?.data;
  const application = appData?.data;

  const isLoading = candidateLoading || appLoading;

  const handleApprove = () => {
    if (application?.id) {
      approveMutation.mutate(application.id);
    }
  };

  const handleReject = () => {
    if (application?.id) {
      rejectMutation.mutate(application.id);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant">Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Verification Detail</h2>
          <p className="text-on-surface-variant mt-1">Review candidate application and documents</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleReject}
            disabled={rejectMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 bg-error-container text-error rounded-lg hover:bg-error hover:text-white transition-all text-sm font-bold shadow-sm disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button 
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-all text-sm font-bold shadow-sm disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Candidate Bio */}
          <div className="architect-card p-8">
            <h3 className="text-xl font-headline font-bold text-primary mb-6">Candidate Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <DataField label="Full Name" value={`${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim()} />
              <DataField label="Email" value={candidate?.email || 'N/A'} icon={Mail} />
              <DataField label="Phone" value={candidate?.phone || 'N/A'} icon={Phone} />
              <DataField label="Date of Birth" value={candidate?.dateOfBirth ? new Date(candidate.dateOfBirth).toLocaleDateString() : 'N/A'} icon={Calendar} />
              <DataField label="Gender" value={candidate?.gender || 'N/A'} />
              <DataField label="Nationality" value={candidate?.nationality || 'N/A'} icon={MapPin} />
              <DataField label="Address" value={candidate?.address || 'N/A'} className="col-span-2" />
            </div>
          </div>

          {/* Program Info */}
          <div className="architect-card p-8">
            <h3 className="text-xl font-headline font-bold text-primary mb-6">Program Application</h3>
            <div className="space-y-4">
              <DataField label="Program" value={application?.program?.name || 'N/A'} />
              <DataField label="Status" value={application?.status || 'N/A'} />
              <DataField label="Submitted" value={application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Not submitted'} />
            </div>
          </div>

          {/* Documents */}
          <div className="architect-card p-8">
            <h3 className="text-xl font-headline font-bold text-primary mb-6">Documents</h3>
            <div className="space-y-4">
              {candidate?.photoUrl && (
                <div className="border border-outline-variant/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-primary">Photo ID</span>
                    <div className="flex gap-2">
                      <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1 hover:bg-slate-100 rounded">
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-on-surface-variant">{zoom}%</span>
                      <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 hover:bg-slate-100 rounded">
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 flex justify-center">
                    <img 
                      src={candidate.photoUrl} 
                      alt="Candidate Photo" 
                      style={{ width: `${zoom}%`, maxWidth: '100%' }}
                      className="rounded"
                    />
                  </div>
                </div>
              )}
              <DocumentItem name="ID Card" fileName="id_card.pdf" />
              <DocumentItem name="Academic Record" fileName="academic_record.pdf" />
              <DocumentItem name="Certificate" fileName="certificate.pdf" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Status Card */}
          <div className={cn(
            "p-6 rounded-xl border-l-4",
            application?.status === 'approved' ? "bg-secondary-container border-secondary" :
            application?.status === 'rejected' ? "bg-error-container border-error" :
            "bg-surface-container-low border-primary"
          )}>
            <h3 className="font-headline font-bold text-lg mb-2">Application Status</h3>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                application?.status === 'approved' ? "bg-secondary" :
                application?.status === 'rejected' ? "bg-error" :
                "bg-yellow-500 animate-pulse"
              )}></div>
              <span className="font-bold text-sm">{application?.status?.replace('_', ' ') || 'Unknown'}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="architect-card p-6">
            <h3 className="font-headline font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">View Full Application</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Contact Candidate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, icon: Icon, className }: { label: string; value: string; icon?: any; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-on-surface-variant" />}
        <p className="text-sm font-semibold text-primary">{value}</p>
      </div>
    </div>
  );
}

function DocumentItem({ name, fileName }: { name: string; fileName: string }) {
  return (
    <div className="flex items-center justify-between p-4 border border-outline-variant/10 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{name}</p>
          <p className="text-xs text-on-surface-variant">{fileName}</p>
        </div>
      </div>
      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
