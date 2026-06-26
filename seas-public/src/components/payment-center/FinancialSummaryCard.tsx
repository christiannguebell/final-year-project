import { Download } from 'lucide-react';

import { useDownloadPaymentSummary } from '../../hooks/useDownloads';



interface FinancialSummaryCardProps {

  applicationId?: string;

  totalInvoiced: number;

  totalPaid: number;

  balanceDue: number;

}



export default function FinancialSummaryCard({

  applicationId,

  totalInvoiced,

  totalPaid,

  balanceDue,

}: FinancialSummaryCardProps) {

  const downloadSummary = useDownloadPaymentSummary(applicationId);



  return (

    <section className="rounded-xl bg-surface-container-low p-7">

      <div className="space-y-4">

        <div className="flex justify-between text-sm font-medium">

          <span className="text-on-surface-variant">Total Invoiced</span>

          <span className="font-bold text-primary">FCFA {totalInvoiced.toFixed(2)}</span>

        </div>

        <div className="flex justify-between text-sm font-medium">

          <span className="text-on-surface-variant">Total Paid</span>

          <span className="font-bold text-secondary">FCFA {totalPaid.toFixed(2)}</span>

        </div>



        <div className="mt-2 flex items-end justify-between border-t border-outline-variant/30 pt-5">

          <div>

            <p className="mb-1.5 text-[10px] font-bold tracking-widest text-primary uppercase">Balance Due</p>

            <p className="text-3xl font-black tracking-tighter text-primary">FCFA {balanceDue.toFixed(2)}</p>

          </div>

          <button

            type="button"

            onClick={() => downloadSummary.mutate()}

            disabled={!applicationId || downloadSummary.isPending}

            className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-2.5 text-primary shadow-sm transition-all hover:bg-white disabled:opacity-50"

            aria-label="Download payment summary PDF"

          >

            <Download size={20} />

          </button>

        </div>

      </div>

    </section>

  );

}

