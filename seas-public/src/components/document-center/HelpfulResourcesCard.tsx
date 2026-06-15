import { ExternalLink, FileText, Mail } from 'lucide-react';

import { openAdmissionsEmail } from '../../config/navigation';

import { useDownloadScanningGuide } from '../../hooks/useDownloads';



const RESOURCES = [

  { icon: FileText, label: 'Scanning Guide', action: 'guide' as const },

  { icon: Mail, label: 'Contact Registrar', action: 'email' as const },

];



export default function HelpfulResourcesCard() {

  const downloadGuide = useDownloadScanningGuide();



  return (

    <div className="rounded-xl bg-surface-container-low p-6 shadow-sm">

      <h4 className="mb-4 font-headline font-bold text-primary">Helpful Resources</h4>

      <ul className="space-y-3">

        {RESOURCES.map(({ icon: Icon, label, action }) => (

          <li key={label}>

            <button

              type="button"

              onClick={() =>

                action === 'guide'

                  ? downloadGuide.mutate()

                  : openAdmissionsEmail('Registrar Inquiry')

              }

              disabled={action === 'guide' && downloadGuide.isPending}

              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:opacity-60"

            >

              <span className="flex items-center gap-3">

                <Icon size={16} className="text-secondary" />

                {label}

              </span>

              <ExternalLink size={14} />

            </button>

          </li>

        ))}

      </ul>

    </div>

  );

}

