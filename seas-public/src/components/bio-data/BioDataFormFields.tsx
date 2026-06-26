import { Calendar, User, Globe, IdCard, Fingerprint } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { BioDataFormValues } from './types';

interface BioDataFormFieldsProps {
  register: UseFormRegister<BioDataFormValues>;
}

export default function BioDataFormFields({ register }: BioDataFormFieldsProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6">
      {/* Row 1: Date of Birth + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Date of Birth
          </label>
          <div className="flex items-center gap-3 border border-outline-variant/30 rounded-lg px-3 py-2.5 bg-surface-container-low focus-within:border-primary transition-colors">
            <Calendar size={18} className="text-on-surface-variant flex-shrink-0" />
            <input
              type="date"
              {...register('dateOfBirth')}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Gender
          </label>
          <div className="flex items-center gap-3 border border-outline-variant/30 rounded-lg px-3 py-2.5 bg-surface-container-low focus-within:border-primary transition-colors">
            <User size={18} className="text-on-surface-variant flex-shrink-0" />
            <select
              {...register('gender')}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-sm appearance-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Nationality + ID Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Nationality
          </label>
          <div className="flex items-center gap-3 border border-outline-variant/30 rounded-lg px-3 py-2.5 bg-surface-container-low focus-within:border-primary transition-colors">
            <Globe size={18} className="text-on-surface-variant flex-shrink-0" />
            <input
              type="text"
              placeholder="Country of Citizenship"
              {...register('nationality')}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-sm placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Identification Type
          </label>
          <div className="flex items-center gap-3 border border-outline-variant/30 rounded-lg px-3 py-2.5 bg-surface-container-low focus-within:border-primary transition-colors">
            <IdCard size={18} className="text-on-surface-variant flex-shrink-0" />
            <select
              {...register('idType')}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-sm appearance-none"
            >
              <option value="passport">Passport</option>
              <option value="national_id">National ID Card</option>
              <option value="drivers_license">Driver's License</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 3: ID Number */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
          ID Number / Document Reference
        </label>
        <div className="flex items-center gap-3 border border-outline-variant/30 rounded-lg px-3 py-2.5 bg-surface-container-high focus-within:border-primary transition-colors">
          <Fingerprint size={18} className="text-on-surface-variant flex-shrink-0" />
          <input
            type="text"
            placeholder="Enter identification number"
            {...register('idNumber')}
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-sm placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>
    </div>
  );
}
