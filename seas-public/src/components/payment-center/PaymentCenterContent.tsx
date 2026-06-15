import PaymentCenterHeader from './PaymentCenterHeader';
import PaymentInstructionsCard from './PaymentInstructionsCard';
import SubmitPaymentProofCard from './SubmitPaymentProofCard';
import CurrentStatusCard from './CurrentStatusCard';
import PaymentHistoryList, { type PaymentHistoryItem } from './PaymentHistoryList';
import FinancialSummaryCard from './FinancialSummaryCard';

interface PaymentCenterContentProps {
  applicationId?: string;
  transactionId: string;
  amount: string;
  receiptFile: File | null;
  onTransactionIdChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onFileSelect: (file: File) => void;
  onSubmitProof: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  statusLabel?: string;
  statusUpdatedAt?: string;
  referenceId?: string;
  payments: PaymentHistoryItem[];
  totalInvoiced: number;
  totalPaid: number;
  balanceDue: number;
  showProofForm?: boolean;
}

export default function PaymentCenterContent({
  applicationId,
  transactionId,
  amount,
  receiptFile,
  onTransactionIdChange,
  onAmountChange,
  onFileSelect,
  onSubmitProof,
  isSubmitting,
  canSubmit = true,
  statusLabel = 'Pending Verification',
  statusUpdatedAt,
  referenceId,
  payments,
  totalInvoiced,
  totalPaid,
  balanceDue,
  showProofForm = true,
}: PaymentCenterContentProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <PaymentCenterHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <PaymentInstructionsCard />
          {showProofForm && (
            <SubmitPaymentProofCard
              transactionId={transactionId}
              amount={amount}
              receiptFile={receiptFile}
              onTransactionIdChange={onTransactionIdChange}
              onAmountChange={onAmountChange}
              onFileSelect={onFileSelect}
              onSubmit={onSubmitProof}
              isLoading={isSubmitting}
              disabled={!canSubmit}
            />
          )}
        </div>

        <div className="space-y-8">
          <CurrentStatusCard statusLabel={statusLabel} updatedAt={statusUpdatedAt} referenceId={referenceId} />
          <PaymentHistoryList payments={payments} />
          <FinancialSummaryCard
            applicationId={applicationId}
            totalInvoiced={totalInvoiced}
            totalPaid={totalPaid}
            balanceDue={balanceDue}
          />
        </div>
      </div>
    </div>
  );
}
