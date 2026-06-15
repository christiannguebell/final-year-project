import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import { ProgramSelectionFooter } from '../../components/program-selection';
import { PaymentCenterContent } from '../../components/payment-center';
import type { PaymentHistoryItem } from '../../components/payment-center';
import {
  usePayments,
  usePaymentsByApplication,
  useCreatePayment,
  useUploadPaymentReceipt,
} from '../../hooks/usePayments';
import { PaymentStatus } from '../../types/entities';
import type { Payment } from '../../types/entities';

export default function PaymentsPage() {
  const { id: applicationId } = useParams();

  if (applicationId) {
    return <ApplicationPaymentPage applicationId={applicationId} />;
  }

  return <StandalonePaymentCenterPage />;
}

function mapPaymentToHistoryItem(payment: Payment, title = 'Application Fee'): PaymentHistoryItem {
  return {
    id: payment.id,
    title,
    date: payment.createdAt
      ? format(new Date(payment.createdAt), 'MMM dd, yyyy')
      : 'N/A',
    transactionId: payment.transactionId,
    amount: payment.amount,
    status: payment.status,
  };
}

function StandalonePaymentCenterPage() {
  const navigate = useNavigate();
  const { data: paymentList = [], isLoading } = usePayments();
  const uploadReceipt = useUploadPaymentReceipt();
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const pendingPayment = paymentList.find((p) => p.status === PaymentStatus.PENDING);

  const handleSubmitProof = async () => {
    if (!pendingPayment || !receiptFile) {
      navigate('/applications');
      return;
    }
    try {
      await uploadReceipt.mutateAsync({
        paymentId: pendingPayment.id,
        receiptFile,
        transactionId,
        amount,
      });
      window.location.reload();
    } catch {
      // toast handled by api client
    }
  };
  const verifiedPayments = paymentList.filter((p) => p.status === PaymentStatus.VERIFIED);

  const history: PaymentHistoryItem[] = paymentList.map((p) => mapPaymentToHistoryItem(p));
  const totalInvoiced = paymentList.reduce((sum, p) => sum + p.amount, 0) || 325;
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max(totalInvoiced - totalPaid, 0);

  const latestStatus = pendingPayment
    ? 'Pending Verification'
    : verifiedPayments.length
      ? 'Verified'
      : 'No Payments Yet';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNav />
      <Sidebar activeSection="payments" />

      <main className="ml-64 flex-1 px-10 pt-24 pb-12">
        {isLoading ? (
          <p className="text-on-surface-variant">Loading payments...</p>
        ) : paymentList.length === 0 ? (
          <div className="space-y-8">
            <PaymentCenterContent
              transactionId={transactionId}
              amount={amount}
              receiptFile={receiptFile}
              onTransactionIdChange={setTransactionId}
              onAmountChange={setAmount}
              onFileSelect={setReceiptFile}
              onSubmitProof={() => navigate('/applications')}
              statusLabel="No Payments Yet"
              referenceId="SEAS-2024-001"
              payments={[
                {
                  id: 'demo-1',
                  title: 'Application Fee',
                  date: 'May 12, 2024',
                  transactionId: 'TXN882710',
                  amount: 50,
                  status: PaymentStatus.VERIFIED,
                },
                {
                  id: 'demo-2',
                  title: 'Semester 1 Exam Fee',
                  date: 'Oct 24, 2024',
                  transactionId: 'TXN992831',
                  amount: 200,
                  status: PaymentStatus.PENDING,
                },
                {
                  id: 'demo-3',
                  title: 'Lab Certification',
                  date: 'Oct 22, 2024',
                  transactionId: 'TXN991002',
                  amount: 75,
                  status: PaymentStatus.REJECTED,
                },
              ]}
              totalInvoiced={325}
              totalPaid={50}
              balanceDue={275}
              canSubmit={false}
            />
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/applications')}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                Go to Applications to Make a Payment
              </button>
            </div>
          </div>
        ) : (
          <PaymentCenterContent
            applicationId={pendingPayment?.applicationId}
            transactionId={transactionId}
            amount={amount || pendingPayment?.amount.toString() || ''}
            receiptFile={receiptFile}
            onTransactionIdChange={setTransactionId}
            onAmountChange={setAmount}
            onFileSelect={setReceiptFile}
            onSubmitProof={handleSubmitProof}
            isSubmitting={uploadReceipt.isPending}
            statusLabel={latestStatus}
            statusUpdatedAt="Updated recently"
            referenceId={pendingPayment?.applicationId?.slice(0, 12).toUpperCase()}
            payments={history}
            totalInvoiced={totalInvoiced}
            totalPaid={totalPaid}
            balanceDue={balanceDue}
            showProofForm={!!pendingPayment}
            canSubmit={!!pendingPayment}
          />
        )}
      </main>

      <div className="ml-64">
        <ProgramSelectionFooter />
      </div>
    </div>
  );
}

function ApplicationPaymentPage({ applicationId }: { applicationId: string }) {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { data: paymentList = [] } = usePaymentsByApplication(applicationId);
  const pendingPayment = paymentList.find((p) => p.status === PaymentStatus.PENDING);
  const verifiedPayments = paymentList.filter((p) => p.status === PaymentStatus.VERIFIED);

  const createPayment = useCreatePayment();
  const uploadReceipt = useUploadPaymentReceipt();

  const handleCreatePayment = async () => {
    if (!applicationId || !amount) return;
    try {
      await createPayment.mutateAsync({
        applicationId,
        amount: Number(amount),
        method: 'BANK_TRANSFER',
        paymentDate: new Date().toISOString(),
      });
      window.location.reload();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Payment submission failed:', axiosError.response?.data);
    }
  };

  const handleSubmitProof = async () => {
    if (!pendingPayment || !receiptFile) return;
    try {
      await uploadReceipt.mutateAsync({
        paymentId: pendingPayment.id,
        receiptFile,
        transactionId,
        amount,
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload receipt:', error);
    }
  };

  const history = paymentList.map((p) => mapPaymentToHistoryItem(p));
  const totalInvoiced = pendingPayment?.amount ?? (Number(amount) || 0);
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max(totalInvoiced - totalPaid, 0);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNav />
      <Sidebar />

      <main className="ml-64 flex-1 px-10 pt-24 pb-12">
        {!pendingPayment && verifiedPayments.length === 0 ? (
          <section className="mx-auto max-w-xl rounded-xl bg-surface-container-lowest p-8 shadow-sm">
            <h2 className="mb-6 font-headline text-xl font-bold text-primary">Enter Payment Amount</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="250.00"
              className="mb-4 w-full rounded-t-lg border-b-2 border-primary bg-surface-container-high p-3"
            />
            <button
              type="button"
              onClick={handleCreatePayment}
              disabled={createPayment.isPending || !amount}
              className="w-full rounded-lg bg-primary py-4 font-bold text-white disabled:opacity-50"
            >
              {createPayment.isPending ? 'Processing...' : 'Proceed to Upload Proof'}
            </button>
          </section>
        ) : (
          <PaymentCenterContent
            applicationId={applicationId}
            transactionId={transactionId}
            amount={amount || pendingPayment?.amount.toString() || ''}
            receiptFile={receiptFile}
            onTransactionIdChange={setTransactionId}
            onAmountChange={setAmount}
            onFileSelect={setReceiptFile}
            onSubmitProof={handleSubmitProof}
            isSubmitting={uploadReceipt.isPending}
            statusLabel={pendingPayment ? 'Pending Verification' : 'Verified'}
            referenceId={applicationId.slice(0, 12).toUpperCase()}
            payments={history}
            totalInvoiced={totalInvoiced}
            totalPaid={totalPaid}
            balanceDue={balanceDue}
            showProofForm={!!pendingPayment}
          />
        )}
      </main>

      <div className="ml-64">
        <ProgramSelectionFooter />
      </div>
    </div>
  );
}
