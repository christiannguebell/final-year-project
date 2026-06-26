import { CloudUpload } from 'lucide-react';

interface SubmitPaymentProofCardProps {
  transactionId: string;
  amount: string;
  receiptFile: File | null;
  onTransactionIdChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onFileSelect: (file: File) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function SubmitPaymentProofCard({
  transactionId,
  amount,
  receiptFile,
  onTransactionIdChange,
  onAmountChange,
  onFileSelect,
  onSubmit,
  isLoading,
  disabled,
}: SubmitPaymentProofCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
      <h2 className="mb-6 font-headline text-xl font-bold text-primary">Submit Payment Proof</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => onTransactionIdChange(e.target.value)}
              placeholder="e.g. TXN992831200"
              className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-high p-3 font-medium transition-colors focus:border-secondary focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
              Amount Paid (FCFA)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="250.00"
              className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-high p-3 font-medium transition-colors focus:border-secondary focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
            Upload Receipt (PDF/JPG)
          </label>
          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-10 transition-colors hover:bg-surface-container-high">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
            <CloudUpload className="mb-3 text-outline transition-colors group-hover:text-primary" size={40} />
            <p className="text-sm font-semibold text-primary">
              {receiptFile ? receiptFile.name : 'Click to upload or drag and drop'}
            </p>
            <p className="mt-1.5 text-xs font-medium text-on-surface-variant">Maximum file size 5MB</p>
          </label>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isLoading || !receiptFile}
          className="w-full rounded-lg bg-primary py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Confirm Submission'}
        </button>
      </div>
    </section>
  );
}
