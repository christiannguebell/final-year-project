import { Info, Smartphone } from 'lucide-react';

export default function PaymentInstructionsCard() {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-primary">
        <Info className="text-secondary" size={24} />
        Payment Instructions
      </h2>

      <div className="space-y-6">
        <div className="rounded-lg bg-surface-container-low p-5">
          <h3 className="mb-3 text-sm font-bold tracking-wider text-primary uppercase">Bank Transfer (EFT)</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="mb-1 text-on-surface-variant">Bank Name</p>
              <p className="font-semibold text-primary">Institutional Trust Bank</p>
            </div>
            <div>
              <p className="mb-1 text-on-surface-variant">Account Name</p>
              <p className="font-semibold text-primary">SEAS EXAM FUND</p>
            </div>
            <div>
              <p className="mb-1 text-on-surface-variant">Account Number</p>
              <p className="font-semibold text-primary">0049-2281-9902-11</p>
            </div>
            <div>
              <p className="mb-1 text-on-surface-variant">Swift Code</p>
              <p className="font-semibold text-primary">SEASENGXX</p>
            </div>
          </div>
        </div>

        <div className="rounded-r-lg border-l-4 border-secondary bg-secondary/5 p-5">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-secondary">
            <Smartphone size={18} />
            Mobile Payment
          </h3>
          <p className="text-sm leading-relaxed text-on-surface">
            Use Merchant Code <span className="rounded bg-secondary/10 px-1 font-mono font-bold">#882*19#</span> or
            scan the QR code available at university kiosks. Use your{' '}
            <span className="font-semibold text-primary">Candidate ID</span> as the reference.
          </p>
        </div>
      </div>
    </section>
  );
}
