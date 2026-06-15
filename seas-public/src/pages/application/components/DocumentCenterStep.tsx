import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application } from '../../../types/application';
import { DocumentCenterContent } from '../../../components/document-center';
import type { DocumentFile } from '../../../components/document-center/DocumentUploadCard';
import type { DocumentTypeId } from '../../../components/document-center/documentTypes';
import { DOCUMENT_TYPES } from '../../../components/document-center/documentTypes';

interface ApiDocument {
  id: string;
  name?: string;
  fileName?: string;
  type: string;
  url?: string;
  filePath?: string;
  fileSize?: number;
  createdAt?: string;
}

function mapDocument(doc: ApiDocument): DocumentFile {
  const sizeMb = doc.fileSize ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB` : undefined;
  const uploaded = doc.createdAt
    ? `UPLOADED ${new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`
    : undefined;

  return {
    id: doc.id,
    name: doc.name ?? doc.fileName ?? 'Document',
    url: doc.url ?? doc.filePath,
    meta: [sizeMb, uploaded].filter(Boolean).join(' • '),
  };
}

export const DocumentCenterStep = ({
  onNext,
  onBack,
  data,
}: {
  onNext: (data: Partial<Application>) => void;
  onBack: () => void;
  data: Partial<Application>;
}) => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [uploadingType, setUploadingType] = useState<DocumentTypeId | null>(null);
  const [uploadingState, setUploadingState] = useState<{
    type: DocumentTypeId;
    name: string;
    progress: number;
  } | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      if (!data.id) return;
      try {
        const response = await apiClient.get<ApiDocument[]>(`/documents/application/${data.id}`);
        setDocuments(response.data?.data || []);
      } catch {
        console.error('Failed to fetch documents');
      }
    };
    fetchDocs();
  }, [data.id]);

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  const documentsByType = DOCUMENT_TYPES.reduce<Record<string, DocumentFile | undefined>>((acc, docType) => {
    const match = documents.find((d) => d.type === docType.id);
    if (match) acc[docType.id] = mapDocument(match);
    return acc;
  }, {});

  const clearProgress = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    setUploadingState(null);
    setUploadingType(null);
  };

  const handleUpload = async (type: DocumentTypeId, file: File) => {
    if (!data.id) {
      toast.error('Application not initialized. Please go back and select a program.');
      return;
    }

    setUploadingType(type);
    setUploadingState({ type, name: file.name, progress: 12 });

    progressTimer.current = setInterval(() => {
      setUploadingState((prev) => {
        if (!prev) return prev;
        const next = Math.min(prev.progress + 18, 92);
        return { ...prev, progress: next };
      });
    }, 200);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('applicationId', data.id);
    formData.append('type', type);

    try {
      const response = await apiClient.uploadFile<ApiDocument>('/documents/upload', formData);
      if (response.data?.data) {
        setDocuments((prev) => [...prev.filter((d) => d.type !== type), response.data.data!]);
      }
      setUploadingState((prev) => (prev ? { ...prev, progress: 100 } : prev));
      toast.success('Document uploaded successfully');
    } catch {
      toast.error('Upload failed');
    } finally {
      clearProgress();
    }
  };

  const deleteDoc = async (id: string) => {
    try {
      await apiClient.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document removed');
    } catch {
      toast.error('Delete failed');
    }
  };

  const getMissingDocuments = () => DOCUMENT_TYPES.filter((doc) => !documentsByType[doc.id]);

  const handleContinue = () => {
    const missing = getMissingDocuments();
    if (missing.length > 0) {
      toast.error(`Please upload required documents: ${missing.map((d) => d.label).join(', ')}`);
      return;
    }
    onNext({});
  };

  return (
    <DocumentCenterContent
      documentsByType={documentsByType}
      uploadingType={uploadingType}
      uploadingState={uploadingState}
      onUpload={handleUpload}
      onDelete={deleteDoc}
      onCancelUpload={clearProgress}
      onContinue={handleContinue}
      onBack={onBack}
      onSaveForLater={() => {
        toast.success('Progress saved');
        navigate('/applications');
      }}
      canContinue={getMissingDocuments().length === 0}
    />
  );
};
