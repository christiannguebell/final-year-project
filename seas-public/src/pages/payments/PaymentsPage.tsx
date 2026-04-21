import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  Smartphone,
  CloudUpload,
  Clock,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Download,
  Wallet,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { usePayments, useCreatePayment, usePaymentsByApplication, useUploadPaymentReceipt } from '../../hooks/usePayments';
import type { Payment, PaymentStatus } from '../../types/entities';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';

export default function PaymentsPage() {
  const { id: applicationId } = useParams();
  const isStandalone = !applicationId;

  if (isStandalone) {
    return <PaymentsListPage />;
  }
  return <ApplicationPaymentPage applicationId={applicationId} />;
}

function PaymentsListPage() {
  const navigate = useNavigate();
  const { data: payments } = usePayments();
  const paymentList: Payment[] = (payments as Payment[]) || [];

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />
      <main className="ml-64 pt-24 pb-12 px-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-2"
              >
                Payment History
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-on-surface-variant text-lg max-w-2xl leading-relaxed"
              >
                View all your payment transactions and their status.
              </motion.p>
            </div>
          </div>

          {paymentList.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-12 text-center">
              <Wallet className="w-16 h-16 text-outline mx-auto mb-4" />
              <h3 className="text-xl font-headline font-bold text-primary mb-2">No Payments Yet</h3>
              <p className="text-on-surface-variant mb-6">You haven't made any payments yet.</p>
              <button
                onClick={() => navigate('/applications')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-headline font-bold text-sm"
              >
                View Applications
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {paymentList.map((payment) => (
                  <PaymentListCard key={payment.id} payment={payment} />
                ))}
              </div>
            </div>
)}
        </main>
      </div>
  );
}

function PaymentListCard({ payment }: { payment: Payment }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          payment.status === PaymentStatus.VERIFIED ? 'bg-secondary' :
          payment.status === PaymentStatus.PENDING ? 'bg-primary-container' :
          'bg-error/10'
        }`}>
          {payment.status === PaymentStatus.VERIFIED && <CheckCircle2 size={20} className="text-white" />}
          {payment.status === PaymentStatus.PENDING && <RefreshCw size={20} className="text-white" />}
          {payment.status === PaymentStatus.REJECTED && <XCircle size={20} className="text-error" />}
        </div>
        <div>
          <h4 className="font-headline font-bold text-primary">Application Fee</h4>
          <p className="text-sm text-on-surface-variant">
            {formatDate(payment.createdAt)} • {payment.transactionId || 'No transaction ID'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-2xl font-black text-primary">${payment.amount.toFixed(2)}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
            payment.status === PaymentStatus.VERIFIED ? 'bg-secondary/10 text-secondary' :
            payment.status === PaymentStatus.PENDING ? 'bg-primary-container/10 text-primary-container' :
            'bg-error/10 text-error'
          }`}>
            {payment.status}
          </span>
        </div>
        <ArrowRight className="text-outline" size={20} />
      </div>
    </motion.div>
  );
}

function ApplicationPaymentPage({ applicationId }: { applicationId: string }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'BANK_TRANSFER' | 'MOBILE_MONEY'>('BANK_TRANSFER');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { data: payments } = usePaymentsByApplication(applicationId);
  const paymentList: Payment[] = (payments as Payment[]) || [];
  const pendingPayment = paymentList.find(p => p.status === PaymentStatus.PENDING);
  const verifiedPayments = paymentList.filter(p => p.status === PaymentStatus.VERIFIED);

  const totalInvoiced = pendingPayment ? pendingPayment.amount : Number(amount) || 0;
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = totalInvoiced - totalPaid;

  const createPayment = useCreatePayment();
  const uploadReceipt = useUploadPaymentReceipt();

  const handleCreatePayment = async () => {
    if (!applicationId || !amount) return;
    try {
      await createPayment.mutateAsync({
        applicationId,
        amount: Number(amount),
        method: selectedMethod,
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to create payment:', error);
    }
  };

  const handleSubmitProof = async () => {
    if (!pendingPayment || !receiptFile) return;
    try {
      await uploadReceipt.mutateAsync({
        paymentId: pendingPayment.id,
        receiptFile,
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload receipt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />
      <main className="ml-64 pt-24 pb-12 px-10">
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-2"
            >
              Complete Your Payment
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-on-surface-variant text-lg max-w-2xl leading-relaxed"
            >
              Make your payment via bank transfer or mobile money, then upload the proof for verification.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {!pendingPayment ? (
                <PaymentAmountForm
                  amount={amount}
                  setAmount={setAmount}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  onSubmit={handleCreatePayment}
                  isLoading={createPayment.isPending}
                />
              ) : (
                <PaymentProofForm
                  transactionId={transactionId}
                  setTransactionId={setTransactionId}
                  amount={amount}
                  setAmount={setAmount}
                  receiptFile={receiptFile}
                  setReceiptFile={setReceiptFile}
                  fileInputRef={fileInputRef}
                  onSubmit={handleSubmitProof}
                  isLoading={uploadReceipt.isPending}
                />
              )}
              <PaymentInstructions />
            </div>

            <div className="space-y-8">
              {pendingPayment && (
                <PaymentStatusCard 
                  status={pendingPayment.status} 
                  transactionId={pendingPayment.transactionId}
                  amount={pendingPayment.amount}
                />
              )}
              <PaymentSummary
                totalInvoiced={totalInvoiced}
                totalPaid={totalPaid}
                balanceDue={balanceDue}
              />
              <PaymentHistory payments={paymentList} />
            </div>
          </div>
        </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        active
          ? 'bg-white text-secondary font-bold shadow-sm shadow-black/5'
          : 'text-on-surface-variant font-medium hover:bg-surface-container-high'
      }`}
    >
      <span className={active ? 'text-secondary' : 'text-outline-variant'}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function PaymentAmountForm({
  amount,
  setAmount,
  selectedMethod,
  setSelectedMethod,
  onSubmit,
  isLoading,
}: {
  amount: string;
  setAmount: (value: string) => void;
  selectedMethod: 'BANK_TRANSFER' | 'MOBILE_MONEY';
  setSelectedMethod: (method: 'BANK_TRANSFER' | 'MOBILE_MONEY') => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-6 font-headline flex items-center gap-2">
        <Wallet className="text-secondary" size={24} />
        Enter Payment Amount
      </h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedMethod('BANK_TRANSFER')}
              className={`p-4 rounded-lg border-2 transition-all ${
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
              className={`p-4 rounded-lg border-2 transition-all ${
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

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-surface-container-high border-b-2 border-primary focus:border-secondary focus:outline-none transition-colors p-3 rounded-t-lg font-medium"
            placeholder="e.g. 250.00"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={isLoading || !amount}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Proceed to Upload Proof'}
        </motion.button>
      </div>
    </section>
  );
}

function PaymentProofForm({
  transactionId,
  setTransactionId,
  amount,
  setAmount,
  receiptFile,
  setReceiptFile,
  fileInputRef,
  onSubmit,
  isLoading,
}: {
  transactionId: string;
  setTransactionId: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  receiptFile: File | null;
  setReceiptFile: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-6 font-headline">Submit Payment Proof</h2>
      <div className="space-y-6">
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
          disabled={isLoading || !receiptFile}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50"
        >
          {isLoading ? 'Uploading...' : 'Submit for Verification'}
        </motion.button>
      </div>
    </section>
  );
}

function PaymentInstructions() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
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
    </section>
  );
}

function PaymentStatusCard({ status, transactionId, amount }: { status: string; transactionId?: string; amount: number }) {
  const statusLabel = status === PaymentStatus.PENDING ? 'Pending Verification' : status === PaymentStatus.VERIFIED ? 'Verified' : 'Rejected';

  return (
    <section className="bg-primary text-on-primary rounded-xl p-8 shadow-lg overflow-hidden relative">
      <div className="relative z-10">
        <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Payment Status</p>
        <h3 className="text-3xl font-extrabold mb-5 font-headline tracking-tight">{statusLabel}</h3>
        <div className="flex flex-wrap items-center gap-6 text-xs font-medium opacity-90">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {amount ? `$${amount.toFixed(2)}` : 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <ClipboardList size={16} />
            Ref: {transactionId || 'N/A'}
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
          <span className="text-on-surface-variant">Total Invoiced</span>
          <span className="font-bold text-primary">${totalInvoiced.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-on-surface-variant">Total Paid</span>
          <span className="font-bold text-secondary">${totalPaid.toFixed(2)}</span>
        </div>

        <div className="pt-5 mt-2 border-t border-outline-variant/30 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Balance Due</p>
            <p className="text-3xl font-black text-primary tracking-tighter">${balanceDue.toFixed(2)}</p>
          </div>
          <button className="bg-surface-container-lowest p-2.5 rounded-lg text-primary hover:bg-white transition-all shadow-sm border border-outline-variant/10">
            <Download size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

function PaymentHistory({ payments }: { payments: Payment[] }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (payments.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-8 font-headline">Payment History</h2>
        <p className="text-on-surface-variant text-sm">No payments yet</p>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-8 font-headline">Payment History</h2>
      <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/20">
        {payments.map((payment) => (
          <div key={payment.id} className="relative pl-10">
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
              payment.status === PaymentStatus.VERIFIED ? 'bg-secondary' :
              payment.status === PaymentStatus.PENDING ? 'bg-primary-container' :
              'bg-error/10'
            }`}>
              {payment.status === PaymentStatus.VERIFIED && <CheckCircle2 size={14} className="text-white" />}
              {payment.status === PaymentStatus.PENDING && <RefreshCw size={14} className="text-white" />}
              {payment.status === PaymentStatus.REJECTED && <XCircle size={14} className="text-error" />}
            </div>
            <div className={payment.status === PaymentStatus.REJECTED ? 'opacity-60' : ''}>
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="font-bold text-sm text-primary">Application Fee</h4>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  payment.status === PaymentStatus.VERIFIED ? 'bg-secondary/10 text-secondary' :
                  payment.status === PaymentStatus.PENDING ? 'bg-primary-container/10 text-primary-container' :
                  'bg-error/10 text-error'
                }`}>
                  {payment.status}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">
                {formatDate(payment.createdAt)} • {payment.transactionId || 'N/A'}
              </p>
              <p className="text-sm font-bold mt-2 text-primary">${payment.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}