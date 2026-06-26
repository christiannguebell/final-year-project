/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useApplicationById } from '../../../hooks/useApplications';
import type { Application, Payment } from '../../../types/application';
import type { Document } from '../../../types/entities';
import { ApplicationReviewContent } from '../../../components/application-review';
import type { PersonalInfo, SelectedProgramInfo, ReviewDocument } from '../../../components/application-review';

export const ReviewSubmitStep = ({ data }: { onBack: () => void; data: Partial<Application> }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declared, setDeclared] = useState(false);
  const navigate = useNavigate();

  const { data: application, isLoading, isError, error } = useApplicationById(data.id || '');

  useEffect(() => {
    if (isError) {
      const msg = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to load application';
      toast.error(msg);
    }
  }, [isError, error]);

  const validateSubmission = (app: Application) => {
    const errors: string[] = [];
    if (!app.programId) errors.push('No program selected');
    if (!app.academicRecords?.length) errors.push('No academic records');
    if (!app.documents || app.documents.length < 3) errors.push('Missing required documents');
    if (!app.payments?.length) errors.push('Application fee not paid');
    const verifiedPayment = app.payments?.find((p: Payment) => p.status === 'verified');
    if (!verifiedPayment) errors.push('Application fee not verified');
    return errors.length ? errors : null;
  };

  const handleSubmit = async () => {
    if (!declared) {
      toast.error('Please accept the declaration');
      return;
    }

    if (!application) return;

    if (application.status !== 'draft') {
      toast.error(`Cannot submit: application is already ${application.status.replace('_', ' ')}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const validationErrors = validateSubmission(application);
      if (validationErrors) {
        toast.error(`Cannot submit: ${validationErrors.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      await apiClient.post(`/applications/${data.id}/submit`);
      toast.success('Application submitted successfully!');
      navigate('/application/success', { state: { id: data.id } });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Submission failed. Please check all steps.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-on-surface-variant">Compiling your portfolio...</p>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-on-surface-variant font-bold">Could not load application for review.</p>
        <p className="text-xs text-on-surface-variant">It may belong to a different account, or your session may have expired.</p>
        <button
          onClick={() => navigate('/applications')}
          className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm"
        >
          Go to My Applications
        </button>
      </div>
    );
  }

  const profile = (application.candidate as any)?.profile ?? {};
  const candidateName =
    `${application.candidate?.firstName || ''} ${application.candidate?.lastName || ''}`.trim() || 'Candidate';

  const currentYear = new Date().getFullYear();

  const personalInfo: PersonalInfo = {
    fullName: candidateName,
    dateOfBirth: profile.dateOfBirth
      ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'N/A',
    email: application.candidate?.email ?? 'N/A',
    phone: profile.phone ?? application.candidate?.phone ?? 'N/A',
    residence: [profile.address, profile.city, profile.country].filter(Boolean).join(', ') || 'N/A',
  };

  const program: SelectedProgramInfo = {
    code: application.program?.code || 'PENDING',
    name: application.program?.name || 'No Program Selected',
    enrollmentTerm: `Fall Semester ${currentYear + 1}`,
    campus: 'Main Research Campus, SEAS',
  };

  const documents: ReviewDocument[] =
    application.documents?.map((doc: Document, index) => ({
      id: doc.id ?? String(index),
      label: String(doc.type ?? 'Document').replace(/_/g, ' '),
      fileName: doc.fileName ?? 'Uploaded document',
      uploadedAt: doc.createdAt
        ? `Uploaded ${new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : undefined,
      fileSize: doc.fileSize ? `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB` : undefined,
    })) ?? [];

  return (
    <ApplicationReviewContent
      personalInfo={personalInfo}
      program={program}
      academicRecords={application.academicRecords ?? []}
      documents={documents}
      candidateName={candidateName}
      declared={declared}
      onDeclaredChange={setDeclared}
      onBack={() => navigate('/applications')}
      onEditPersonal={() => data.id && navigate(`/application/edit/${data.id}`)}
      onEditAcademic={() => data.id && navigate(`/application/edit/${data.id}`)}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
