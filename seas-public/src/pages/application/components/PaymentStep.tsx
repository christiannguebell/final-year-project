import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application, Payment } from '../../../types/application';
import { PaymentCenterContent } from '../../../components/payment-center';
import type { PaymentHistoryItem } from '../../../components/payment-center';
import { format } from 'date-fns';

const APPLICATION_FEE = 50;

interface PaymentStepProps {
  onNext: (data: Partial<Application>) => void;
  onBack: () => void;
  data: Partial<Application>;
}

export const PaymentStep = ({ onNext, onBack, data }: PaymentStepProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState(APPLICATION_FEE.toString());
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!data.id) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get<Payment[]>(`/payments/application/${data.id}`);
        setPayments(response.data.data || []);
      } catch {
        console.error('Failed to fetch payments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [data.id]);

  const pendingPayment = payments.find((p) => p.status === 'pending');
  const verifiedPayments = payments.filter((p) => p.status === 'verified');

  const handleCreatePayment = async () => {
    if (!data.id) {
      toast.error('Application not initialized');
      return;
    }
    try {
      const response = await apiClient.post<Payment>('/payments', {
        applicationId: data.id,
        amount: APPLICATION_FEE,
        paymentDate: new Date().toISOString(),
        method: 'BANK_TRANSFER',
      });
      if (response.data.data) {
        setPayments([...payments, response.data.data]);
      }
    } catch {
      toast.error('Failed to create payment record');
    }
  };

  const handleSubmitProof = async () => {
    if (!pendingPayment || !receiptFile) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('receipt', receiptFile);
    if (transactionId) formData.append('transactionId', transactionId);
    if (amount) formData.append('amount', amount);

    try {
      const response = await apiClient.uploadFile<Payment>(
        `/payments/${pendingPayment.id}/receipt`,
        formData
      );
      if (response.data.data) {
        setPayments(payments.map((p) => (p.id === pendingPayment.id ? response.data.data! : p)));
      }
      toast.success('Payment proof submitted');
    } catch {
      toast.error('Failed to upload receipt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-on-surface-variant">Loading payment information...</p>
      </div>
    );
  }

  if (!pendingPayment && verifiedPayments.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-center">
          <p className="mb-2 font-headline text-2xl font-bold text-primary">Application Fee</p>
          <p className="mb-6 text-on-surface-variant">
            A non-refundable application fee of FCFA {APPLICATION_FEE.toFixed(2)} is required.
          </p>
          <button
            type="button"
            onClick={handleCreatePayment}
            className="rounded-lg bg-primary px-8 py-4 font-bold text-white"
          >
            Proceed to Payment
          </button>
          <button type="button" onClick={onBack} className="mt-4 block w-full text-sm font-bold text-on-surface-variant">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const history: PaymentHistoryItem[] = payments.map((payment) => ({
    id: payment.id,
    title: 'Application Fee',
    date: payment.createdAt
      ? format(new Date(payment.createdAt), 'MMM dd, yyyy')
      : format(new Date(payment.paymentDate), 'MMM dd, yyyy'),
    transactionId: (payment as Payment & { transactionId?: string }).transactionId ?? payment.notes,
    amount: payment.amount,
    status: payment.status as PaymentHistoryItem['status'],
  }));

  const totalInvoiced = pendingPayment?.amount ?? APPLICATION_FEE;
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max(totalInvoiced - totalPaid, 0);
  const verified = verifiedPayments.length > 0;

  return (
    <div className="space-y-8">
      <PaymentCenterContent
        applicationId={data.id}
        transactionId={transactionId}
        amount={amount}
        receiptFile={receiptFile}
        onTransactionIdChange={setTransactionId}
        onAmountChange={setAmount}
        onFileSelect={setReceiptFile}
        onSubmitProof={handleSubmitProof}
        isSubmitting={isSubmitting}
        canSubmit={!!pendingPayment}
        statusLabel={verified ? 'Verified' : 'Pending Verification'}
        referenceId={data.id?.slice(0, 12).toUpperCase()}
        payments={history}
        totalInvoiced={totalInvoiced}
        totalPaid={totalPaid}
        balanceDue={balanceDue}
        showProofForm={!!pendingPayment && !verified}
      />

      <div className="mx-auto flex max-w-6xl justify-between gap-4 px-4">
        <button type="button" onClick={onBack} className="font-bold text-primary hover:underline">
          Go Back
        </button>
        <button
          type="button"
          onClick={() => onNext({})}
          disabled={payments.length === 0}
          className={`flex items-center gap-2 rounded-lg px-8 py-4 font-extrabold text-white ${
            verified ? 'bg-secondary' : 'cursor-not-allowed bg-outline-variant opacity-50'
          }`}
        >
          Continue to Review
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
