import { Pencil } from 'lucide-react';

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  residence: string;
}

interface PersonalInformationCardProps {
  info: PersonalInfo;
  onEdit?: () => void;
}

export default function PersonalInformationCard({ info, onEdit }: PersonalInformationCardProps) {
  const fields = [
    { label: 'Full Legal Name', value: info.fullName },
    { label: 'Date of Birth', value: info.dateOfBirth },
    { label: 'Email Address', value: info.email },
    { label: 'Contact Number', value: info.phone },
    { label: 'Permanent Residence', value: info.residence, fullWidth: true },
  ];

  return (
    <section className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-8 shadow-ambient md:col-span-7">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-headline text-lg font-extrabold text-primary">Personal Information</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-sm font-bold text-primary-container hover:underline"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className={field.fullWidth ? 'sm:col-span-2' : ''}>
            <p className="mb-1 text-[10px] font-black tracking-widest text-on-surface-variant/60 uppercase">
              {field.label}
            </p>
            <p className="text-sm font-bold text-on-surface">{field.value || 'N/A'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
