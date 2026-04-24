import type { AxiosError } from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Smartphone,
  CloudUpload,
  ClipboardList,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Download,
  Wallet,
  Clock,
  Info,
} from 'lucide-react';
import { usePaymentsByApplication, useCreatePayment, useUploadPaymentReceipt } from '../../hooks/usePayments';
import { PaymentStatus } from '../../types/entities';
import { format } from 'date-fns';
import type { Payment } from '../../types/entities';

export default function ApplicationPaymentPage() {
  const { id: applicationId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'BANK_TRANSFER' | 'MOBILE_MONEY'>('BANK_TRANSFER');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { data: paymentList = [] } = usePaymentsByApplication(applicationId || '');
  const pendingPayment = paymentList.find(p => p.status === PaymentStatus.PENDING);
  const verifiedPayments = paymentList.filter(p => p.status === PaymentStatus.VERIFIED);

  // A submission is blocked if there's a pending payment that already has a receipt uploaded
  const isSubmissionBlocked = !!pendingPayment?.receiptFile;

  const totalInvoiced = pendingPayment ? pendingPayment.amount : Number(amount) || 0;
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = totalInvoiced - totalPaid;

  const createPayment = useCreatePayment();
  const uploadReceipt = useUploadPaymentReceipt();

  // Redirect if already paid
  useEffect(() => {
    if (paymentList.length > 0 && balanceDue <= 0 && !pendingPayment) {
      navigate('/dashboard');
    }
  }, [paymentList, balanceDue, pendingPayment, navigate]);

  const handlePaymentSubmit = async () => {
    if (!applicationId || !amount) return;

    console.log('Submitting payment...', { applicationId, amount, transactionId, selectedMethod });

    try {
      let paymentId = pendingPayment?.id;

      if (!paymentId) {
        console.log('No pending payment found, creating new one...');
        const newPayment = await createPayment.mutateAsync({
          applicationId,
          amount: Number(amount),
          method: selectedMethod,
          paymentDate: new Date().toISOString(),
          transactionId: transactionId || undefined,
        });
        console.log('Payment created:', newPayment);
        if (newPayment.data) {
          paymentId = newPayment.data.id;
        }
      }

      console.log('Payment ID to use:', paymentId);

      if (receiptFile && paymentId) {
        console.log('Uploading receipt file:', receiptFile.name);
        await uploadReceipt.mutateAsync({
          paymentId,
          receiptFile,
          transactionId,
          amount,
        });
        console.log('Receipt uploaded successfully');
      }

      console.log('Redirecting to dashboard in 1.5s...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Payment submission failed:', error);
      // Log more details about the error if available
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error response data:', axiosError.response.data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to My Applications</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-primary tracking-tight mb-4">
            Payment Center
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-medium">
            Complete your examination fees by following the instructions below and uploading your proof of payment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Instructions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            <PaymentSubmissionForm
              amount={amount}
              setAmount={setAmount}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              receiptFile={receiptFile}
              setReceiptFile={setReceiptFile}
              fileInputRef={fileInputRef}
              onSubmit={handlePaymentSubmit}
              isLoading={createPayment.isPending || uploadReceipt.isPending}
              isUpdate={!!pendingPayment}
              isBlocked={isSubmissionBlocked}
            />
            <PaymentInstructions />
          </motion.div>

          {/* Right Column: Status & History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <StatusCard pendingPayment={pendingPayment} />
            <PaymentSummary totalInvoiced={totalInvoiced} totalPaid={totalPaid} balanceDue={balanceDue} />
            <PaymentHistory paymentList={paymentList} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PaymentSubmissionForm({
  amount,
  setAmount,
  transactionId,
  setTransactionId,
  selectedMethod,
  setSelectedMethod,
  receiptFile,
  setReceiptFile,
  fileInputRef,
  onSubmit,
  isLoading,
  isUpdate,
  isBlocked,
}: {
  amount: string;
  setAmount: (value: string) => void;
  transactionId: string;
  setTransactionId: (value: string) => void;
  selectedMethod: 'BANK_TRANSFER' | 'MOBILE_MONEY';
  setSelectedMethod: (method: 'BANK_TRANSFER' | 'MOBILE_MONEY') => void;
  receiptFile: File | null;
  setReceiptFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: () => void;
  isLoading: boolean;
  isUpdate: boolean;
  isBlocked?: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary font-headline flex items-center gap-2">
          <Wallet className="text-secondary" size={24} />
          {isBlocked ? 'Payment Pending Verification' : isUpdate ? 'Update Payment Proof' : 'Submit Payment Proof'}
        </h2>
        {isBlocked && (
          <span className="bg-secondary-container text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Under Review
          </span>
        )}
      </div>

      {isBlocked ? (
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 text-center">
          <Clock className="mx-auto text-secondary mb-4" size={40} />
          <p className="text-on-surface font-bold mb-2 text-lg">Submission Locked</p>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto leading-relaxed">
            You have already submitted a payment proof. Please wait for the administrator to verify it.
            You will be notified once the status changes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedMethod('BANK_TRANSFER')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMethod === 'BANK_TRANSFER'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <p className="font-bold text-sm text-primary">Bank Transfer</p>
                <p className="text-xs text-on-surface-variant mt-1">via EFT/ TT</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('MOBILE_MONEY')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMethod === 'MOBILE_MONEY'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <p className="font-bold text-sm text-primary flex items-center gap-2">
                  <Smartphone size={16} /> Mobile
                </p>
                <p className="text-xs text-on-surface-variant mt-1">USSD/ QR Code</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-primary focus:border-secondary focus:outline-none transition-colors p-3 rounded-t-lg font-medium"
                placeholder="e.g. TXN992831200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Amount Paid (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-primary focus:border-secondary focus:outline-none transition-colors p-3 rounded-t-lg font-medium"
                placeholder="250.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Upload Receipt (PDF/JPG/PNG)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && setReceiptFile(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <motion.div
              whileHover={{ backgroundColor: 'var(--color-surface-container-high)' }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-low transition-colors cursor-pointer group"
            >
              <CloudUpload className="text-outline group-hover:text-primary mb-3 transition-colors" size={40} />
              <p className="text-sm font-semibold text-primary">
                {receiptFile ? receiptFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-on-surface-variant mt-1.5 font-medium">Maximum file size 5MB</p>
            </motion.div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={isLoading || !amount}
            className="w-full bg-primary text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isUpdate ? 'Update Submission' : 'Submit for Verification'}
          </motion.button>
        </div>
      )}
    </div>
  );
}

function PaymentInstructions() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 font-headline">
        <Info className="text-secondary" size={24} />
        Payment Instructions
      </h2>
      <div className="space-y-6">
        <div className="p-5 bg-surface-container-low rounded-lg">
          <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-wider">Bank Transfer (EFT)</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-on-surface-variant mb-1">Bank Name</p>
              <p className="font-semibold text-primary">Institutional Trust Bank</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Account Name</p>
              <p className="font-semibold text-primary">SEAS EXAM FUND</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Account Number</p>
              <p className="font-semibold text-primary">0049-2281-9902-11</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Swift Code</p>
              <p className="font-semibold text-primary">SEASENGXX</p>
            </div>
          </div>
        </div>

        <div className="p-5 border-l-4 border-secondary bg-secondary/5 rounded-r-lg">
          <h3 className="font-bold text-secondary mb-2 flex items-center gap-2">
            <Smartphone size={18} /> Mobile Payment
          </h3>
          <p className="text-sm text-on-surface leading-relaxed">
            Use Merchant Code <span className="font-mono font-bold bg-secondary/10 px-1 rounded">#882*19#</span> or scan the QR code available at university kiosks.
            Use your <span className="font-semibold text-primary">Candidate ID</span> as the reference.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ pendingPayment }: { pendingPayment?: Payment }) {
  return (
    <section className="bg-primary text-on-primary rounded-xl p-8 shadow-lg overflow-hidden relative">
      <div className="relative z-10">
        <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Current Status</p>
        <h3 className="text-3xl font-extrabold mb-5 font-headline tracking-tight">
          {pendingPayment ? (
            pendingPayment.status === PaymentStatus.PENDING ? 'Pending Verification' :
            pendingPayment.status === PaymentStatus.VERIFIED ? 'Verified' : 'Rejected'
          ) : 'No Pending Payment'}
        </h3>
        <div className="flex flex-wrap items-center gap-6 text-xs font-medium opacity-90">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {pendingPayment?.updatedAt ? `Updated ${format(new Date(pendingPayment.updatedAt), 'HH:mm')}` : 'Ready to start'}
          </div>
          <div className="flex items-center gap-2">
            <ClipboardList size={16} />
            Ref: {pendingPayment?.transactionId || 'N/A'}
          </div>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 opacity-10">
        <Wallet className="w-40 h-40" />
      </div>
    </section>
  );
}

function PaymentSummary({ totalInvoiced, totalPaid, balanceDue }: { totalInvoiced: number; totalPaid: number; balanceDue: number }) {
  return (
    <section className="bg-surface-container-low rounded-xl p-7">
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-on-surface-variant font-semibold">Total Invoiced</span>
          <span className="font-bold text-primary">${totalInvoiced.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-on-surface-variant font-semibold">Total Paid</span>
          <span className="font-bold text-secondary">${totalPaid.toFixed(2)}</span>
        </div>

        <div className="pt-5 mt-2 border-t border-outline-variant/30 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Balance Due</p>
            <p className="text-3xl font-black text-primary tracking-tighter">${balanceDue.toFixed(2)}</p>
          </div>
          <button className="bg-surface-container-lowest p-2.5 rounded-lg text-primary hover:bg-white transition-all shadow-sm border border-outline-variant/10 group">
            <Download size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

function PaymentHistory({ paymentList }: { paymentList: Payment[] }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-8 font-headline">Payment History</h2>
      {paymentList.length === 0 ? (
        <p className="text-on-surface-variant text-sm font-medium italic">No payment records found.</p>
      ) : (
        <div className="space-y-10 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/20">
          {paymentList.map((payment) => (
            <div key={payment.id} className="relative pl-10">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  payment.status === PaymentStatus.VERIFIED ? 'bg-secondary' :
                  payment.status === PaymentStatus.PENDING ? 'bg-primary-container' :
                  'bg-error/10'
                }`}>
                {payment.status === PaymentStatus.VERIFIED && <CheckCircle2 size={14} className="text-on-secondary" />}
                {payment.status === PaymentStatus.PENDING && <RefreshCw size={14} className="text-white animate-spin-slow" />}
                {payment.status === PaymentStatus.REJECTED && <XCircle size={14} className="text-error" />}
              </div>
              <div className={payment.status === PaymentStatus.REJECTED ? 'opacity-60' : ''}>
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-bold text-sm text-primary">Application Fee</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    payment.status === PaymentStatus.VERIFIED ? 'text-secondary' :
                    payment.status === PaymentStatus.PENDING ? 'text-primary-container' :
                    'text-error'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant font-medium">
                  {payment.createdAt ? format(new Date(payment.createdAt), 'MMM dd, yyyy') : 'N/A'} • {payment.transactionId || 'N/A'}
                </p>
                <p className="text-sm font-bold mt-2 text-primary">${payment.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}