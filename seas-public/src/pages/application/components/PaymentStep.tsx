import { useState, useEffect } from 'react';
import { CreditCard, Upload, ArrowRight, Loader2, DollarSign, FileText, Shield } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application, Payment } from '../../../types/application';

interface PaymentStepProps {
  onNext: (data: Partial<Application>) => void;
  onBack: () => void;
  data: Partial<Application>;
}

const APPLICATION_FEE = 50.00;

export const PaymentStep = ({ onNext, onBack, data }: PaymentStepProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!data.id) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get<Payment[]>(`/payments/application/${data.id}`);
        setPayments(response.data.data || []);
      } catch (error: any) {
        console.error('Failed to fetch payments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [data.id]);

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
      });
      if (response.data.data) {
        setPayments([...payments, response.data.data]);
      }
      toast.success('Payment record created');
    } catch (error: any) {
      toast.error('Failed to create payment record');
    }
  };

  const handleUploadReceipt = async (paymentId: string, file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await apiClient.uploadFile<Payment>(`/payments/${paymentId}/receipt`, formData);
      if (response.data.data) {
        setPayments(payments.map(p => p.id === paymentId ? response.data.data! : p));
      }
      toast.success('Receipt uploaded successfully');
    } catch (error: any) {
      toast.error('Failed to upload receipt');
    } finally {
      setIsUploading(false);
    }
  };

  const verifiedPayment = payments.find(p => p.status === 'verified');
  const pendingPayments = payments.filter(p => p.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-bold">Loading payment information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2 font-bold uppercase tracking-widest text-[10px]">
          <span>Step 5 of 6</span>
          <span className="h-px w-8 bg-outline-variant/30"></span>
        </div>
        <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-4 text-center md:text-left">Application Fee</h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed text-center md:text-left">
          A non-refundable application fee of ${APPLICATION_FEE.toFixed(2)} is required. Please upload your payment proof to proceed.
        </p>
      </header>

      <div className="mb-12 flex gap-2 h-1.5 max-w-md mx-auto md:mx-0">
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-secondary rounded-full"></div>
        <div className="flex-1 bg-primary rounded-full"></div>
        <div className="flex-1 bg-outline-variant/30 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {verifiedPayment ? (
            <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <Check size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">Payment Verified</h3>
                  <p className="text-sm text-on-surface-variant">Your application fee has been verified. You may proceed to submit your application.</p>
                </div>
              </div>
            </div>
          ) : pendingPayments.length > 0 ? (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-bold text-primary">Payment pending verification</p>
                      <p className="text-xs text-on-surface-variant">Amount: ${payment.amount.toFixed(2)}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase">
                      Pending
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadReceipt(payment.id, file);
                      }}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <p className="text-xs font-bold text-primary uppercase">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto text-outline-variant mb-2" />
                        <p className="text-sm font-semibold text-primary">Click to upload payment receipt</p>
                        <p className="text-xs text-on-surface-variant mt-1">PDF, PNG or JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <DollarSign size={20} className="text-secondary" />
                    Application Fee
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">Pay to proceed with your application</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">${APPLICATION_FEE.toFixed(2)}</p>
                </div>
              </div>
              <button 
                onClick={handleCreatePayment}
                className="w-full bg-primary py-4 rounded-lg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <CreditCard size={20} />
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl shadow-sm">
            <h4 className="font-headline font-bold text-primary mb-4 flex items-center gap-2">
              <Shield size={20} className="text-secondary" />
              Payment Security
            </h4>
            <ul className="space-y-3">
              {[
                'Secure payment processing',
                'Receipts verified within 24-48 hours',
                'Keep your payment receipt for records'
              ].map((text, i) => (
                <li key={i} className="flex gap-2 items-start text-xs text-on-surface-variant">
                  <Check size={14} className="text-secondary shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl shadow-sm">
            <h4 className="font-headline font-bold text-primary mb-4 flex items-center gap-2">
              <FileText size={20} className="text-secondary" />
              Accepted Methods
            </h4>
            <p className="text-xs text-on-surface-variant">
              Bank transfer, mobile money, or credit/debit card payments are accepted. Upload your receipt after payment.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={() => onNext({})}
              disabled={!verifiedPayment}
              className={`w-full py-4 rounded-lg font-extrabold flex items-center justify-center gap-2 transition-all ${
                verifiedPayment 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:translate-y-[-2px]' 
                  : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
              }`}
            >
              Confirm and Continue
              <ArrowRight size={20} />
            </button>
            <button onClick={onBack} className="w-full bg-transparent py-3 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Check = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);