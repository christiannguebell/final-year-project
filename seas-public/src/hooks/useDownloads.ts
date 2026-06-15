import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { examsApi } from '../api/modules/exams';
import { resultsApi } from '../api/modules/results';
import { paymentsApi } from '../api/modules/payments';
import { applicationsApi } from '../api/modules/applications';
import { documentsApi } from '../api/modules/documents';
import { downloadPdfFromApi } from '../utils/downloadBlob';

function handleDownloadError(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Download failed. Please try again later.';
  toast.error(message);
}

export function useDownloadAdmissionSlip() {
  return useMutation({
    mutationFn: () => downloadPdfFromApi(() => examsApi.getAdmissionSlip(), 'admission-slip.pdf'),
    onSuccess: () => toast.success('Admission slip downloaded'),
    onError: handleDownloadError,
  });
}

export function useDownloadResultReport() {
  return useMutation({
    mutationFn: () => downloadPdfFromApi(() => resultsApi.getMyResultReport(), 'result-report.pdf'),
    onSuccess: () => toast.success('Result report downloaded'),
    onError: handleDownloadError,
  });
}

export function useDownloadPaymentSummary(applicationId?: string) {
  return useMutation({
    mutationFn: () => {
      if (!applicationId) {
        throw new Error('Select an application to download the payment summary');
      }
      return downloadPdfFromApi(
        () => paymentsApi.getApplicationSummary(applicationId),
        'payment-summary.pdf'
      );
    },
    onSuccess: () => toast.success('Payment summary downloaded'),
    onError: handleDownloadError,
  });
}

export function useDownloadAdmissionLetter(applicationId?: string) {
  return useMutation({
    mutationFn: () => {
      if (!applicationId) {
        throw new Error('No approved application found for admission letter download');
      }
      return downloadPdfFromApi(
        () => applicationsApi.getAdmissionLetter(applicationId),
        'admission-letter.pdf'
      );
    },
    onSuccess: () => toast.success('Admission letter downloaded'),
    onError: handleDownloadError,
  });
}

export function useRequestCounselling() {
  return useMutation({
    mutationFn: (data: { preferredDate: string; preferredTime: string; topic?: string }) =>
      applicationsApi.requestCounselling(data),
    onSuccess: () => toast.success('Counselling request submitted. Check notifications for updates.'),
    onError: handleDownloadError,
  });
}

export function useDownloadScanningGuide() {
  return useMutation({
    mutationFn: () =>
      downloadPdfFromApi(() => documentsApi.getScanningGuide(), 'document-scanning-guide.pdf'),
    onSuccess: () => toast.success('Scanning guide downloaded'),
    onError: handleDownloadError,
  });
}
