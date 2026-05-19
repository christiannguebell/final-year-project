import { ArrowLeft, CheckCircle, XCircle, Download, ZoomIn, ZoomOut, FileText, Mail, Phone, MapPin, Calendar, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationById, useApproveApplication, useRejectApplication } from '@/hooks/useApplications';
import type { Document } from '@/types/entities';
import { cn } from '@/lib/utils';
import env from '@/config/env';

interface DocumentWithStatus extends Document {
  status?: string;
}

export default function VerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [viewingDocument, setViewingDocument] = useState<{ url: string; name: string } | null>(null);

  const { data: appData, isLoading: appLoading } = useApplicationById(id || '');
  
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const application = appData;

  const isLoading = appLoading;

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

  const getDocumentUrl = (filePath: string) => {
    return `${env.API_BASE_URL.replace('/api', '')}/${filePath}`;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'photo': 'Photo ID',
      'id_card': 'ID Card',
      'academic_record': 'Academic Record',
      'certificate': 'Certificate',
      'transcript': 'Transcript',
    };
    return labels[type] || type.replace('_', ' ');
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
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Application Verification</h2>
          <p className="text-on-surface-variant mt-1">Review ID: {application?.id?.slice(-8)}</p>
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
              <DataField label="Full Name" value={`${application?.candidate?.firstName || ''} ${application?.candidate?.lastName || ''}`.trim()} />
              <DataField label="Email" value={application?.candidate?.email || 'N/A'} icon={Mail} />
              <DataField label="Phone" value={application?.candidate?.phone || 'N/A'} icon={Phone} />
              <DataField label="Date of Birth" value={application?.candidate?.profile?.dateOfBirth ? new Date(application.candidate.profile.dateOfBirth).toLocaleDateString() : 'N/A'} icon={Calendar} />
              <DataField label="Gender" value={application?.candidate?.profile?.gender || 'N/A'} />
              <DataField label="Nationality" value={application?.candidate?.profile?.nationality || 'N/A'} icon={MapPin} />
              <DataField label="Address" value={application?.candidate?.profile?.address || 'N/A'} className="col-span-2" />
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
              {application?.candidate?.profile?.profilePhoto && (
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
                      <button
                        onClick={() => application?.candidate?.profile?.profilePhoto && setViewingDocument({ url: getDocumentUrl(application.candidate.profile.profilePhoto), name: 'Photo ID' })}
                        className="p-1 hover:bg-slate-100 rounded text-primary"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={getDocumentUrl(application.candidate.profile.profilePhoto)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 flex justify-center">
                    <img 
                      src={getDocumentUrl(application.candidate.profile.profilePhoto)} 
                      alt="Candidate Photo" 
                      style={{ width: `${zoom}%`, maxWidth: '100%' }}
                      className="rounded"
                    />
                  </div>
                </div>
              )}
               {application?.documents && application.documents.map((doc: DocumentWithStatus) => (
                 <div key={doc.id} className="flex items-center justify-between p-4 border border-outline-variant/10 rounded-lg hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                       <FileText className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                       <p className="text-sm font-semibold text-primary">{getDocumentTypeLabel(doc.type)}</p>
                       <p className="text-xs text-on-surface-variant">{doc.fileName}</p>
                       <span className={cn(
                         "inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold",
                         doc.status === 'approved' ? 'bg-secondary-container text-secondary' :
                         doc.status === 'rejected' ? 'bg-error-container text-error' :
                         'bg-yellow-100 text-yellow-700'
                       )}>
                         {doc.status}
                       </span>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => setViewingDocument({ url: getDocumentUrl(doc.filePath), name: getDocumentTypeLabel(doc.type) })}
                       className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-primary"
                       title="View"
                     >
                       <Eye className="w-4 h-4" />
                     </button>
                     <a
                       href={getDocumentUrl(doc.filePath)}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                       title="Download"
                     >
                       <Download className="w-4 h-4" />
                     </a>
                     <button
                       onClick={() => console.log('Approve document:', doc.id)}
                       className="p-2 hover:bg-secondary-container/20 rounded-lg transition-colors text-secondary"
                       title="Approve"
                     >
                       <CheckCircle className="w-4 h-4" />
                     </button>
                     <button
                       onClick={() => console.log('Reject document:', doc.id)}
                       className="p-2 hover:bg-error-container/20 rounded-lg transition-colors text-error"
                       title="Reject"
                     >
                       <XCircle className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               ))}
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

        {/* Document Viewer Modal */}
        {viewingDocument && (
          <DocumentViewerModal
            url={viewingDocument.url}
            name={viewingDocument.name}
            onClose={() => setViewingDocument(null)}
          />
        )}
      </div>
    </div>
  );
}

// Document Viewer Modal
function DocumentViewerModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
          <h3 className="text-lg font-bold text-primary font-headline">{name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-50">
          {isImage ? (
            <img 
              src={url} 
              alt={name}
              className="max-w-full max-h-[70vh] object-contain rounded shadow-lg"
            />
          ) : (
            <iframe 
              src={url} 
              title={name}
              className="w-full h-[70vh] rounded border-0"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/10 flex justify-end">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, icon: Icon, className }: { label: string; value: string; icon?: React.ElementType; className?: string }) {
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
