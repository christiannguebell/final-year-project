import { MapPin } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { BioDataFormValues } from './types';

interface ResidentialAddressCardProps {
  register: UseFormRegister<BioDataFormValues>;
}

export default function ResidentialAddressCard({ register }: ResidentialAddressCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6 space-y-3">
      <h3 className="font-headline font-bold text-primary flex items-center gap-2 text-base">
        <MapPin size={18} className="text-secondary" />
        Residential Address
      </h3>

      <textarea
        placeholder="Full residential street address..."
        rows={3}
        {...register('address')}
        className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-on-surface-variant/50"
      />

      <input
        type="text"
        placeholder="City / Province"
        {...register('city')}
        className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
      />

      <input
        type="text"
        placeholder="Postal / Zip Code"
        {...register('zipCode')}
        className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
      />
    </div>
  );
}
