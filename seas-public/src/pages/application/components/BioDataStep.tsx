/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { Calendar, User, Globe, IdCard, Fingerprint, MapPin, Save } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application } from '../../../types/application';

interface BioDataForm {
  dateOfBirth: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export const BioDataStep = ({ onNext, data }: { onNext: (data: Partial<Application>) => void, data: Partial<Application> }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<BioDataForm>({
    defaultValues: {
      dateOfBirth: (data.candidate as any)?.profile?.dateOfBirth?.split('T')[0] || data.candidate?.dateOfBirth?.split('T')[0] || '',
      gender: (data.candidate as any)?.profile?.gender || data.candidate?.gender || '',
      nationality: (data.candidate as any)?.profile?.nationality || data.candidate?.nationality || '',
      idType: (data.candidate as any)?.profile?.idType || 'national_id',
      idNumber: (data.candidate as any)?.profile?.idNumber || '',
      address: (data.candidate as any)?.profile?.address || data.candidate?.address || '',
      city: (data.candidate as any)?.profile?.city || data.candidate?.city || '',
      country: (data.candidate as any)?.profile?.country || data.candidate?.country || '',
      zipCode: (data.candidate as any)?.profile?.zipCode || '',
    }
  });

  const onSubmit = async (formData: BioDataForm) => {
    try {
      await apiClient.put('/candidates', formData);
      
      let applicationId = data.id;
      if (!applicationId) {
        const response = await apiClient.post<Application>('/applications', { programId: null });
        if (response.data?.data?.id) {
          applicationId = response.data.data.id;
        }
      }
      
      if (!applicationId) {
        throw new Error('Failed to create application');
      }
      
      toast.success('Foundational profile saved');
      onNext({ id: applicationId, candidate: { profile: formData } as any });
    } catch (error: unknown) {
      console.error('Failed to save bio data', error);
      toast.error('Failed to initialize application. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Application Portal</h1>
            <p className="text-on-surface-variant">Please provide your foundational information to begin your engineering journey.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Step 1 of 6</span>
            <div className="text-xl font-bold text-primary">Bio Data</div>
          </div>
        </div>

        <div className="flex items-center w-full gap-2">
          <div className="h-2 flex-1 rounded-full bg-secondary"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-outline-variant/30 text-xs"></div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-ambient space-y-8 border border-outline-variant/5 transition-all hover:shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date of Birth</label>
              <div className="bg-surface-container-high rounded-md flex items-center px-4 border-b-2 border-transparent focus-within:border-primary transition-all">
                <Calendar size={20} className="text-on-surface-variant mr-3" />
                <input 
                  type="date" 
                  {...register('dateOfBirth')}
                  className="w-full bg-transparent border-none py-3 focus:ring-0 text-on-surface font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gender</label>
              <div className="bg-surface-container-high rounded-md flex items-center px-4 border-b-2 border-transparent focus-within:border-primary transition-all">
                <User size={20} className="text-on-surface-variant mr-3" />
                <select 
                  {...register('gender')}
                  className="w-full bg-transparent border-none py-3 focus:ring-0 text-on-surface font-medium appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nationality</label>
              <div className="bg-surface-container-high rounded-md flex items-center px-4 border-b-2 border-transparent focus-within:border-primary transition-all">
                <Globe size={20} className="text-on-surface-variant mr-3" />
                <input 
                  type="text" 
                  placeholder="Country of Citizenship" 
                  {...register('nationality')}
                  className="w-full bg-transparent border-none py-3 focus:ring-0 text-on-surface font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Identification Type</label>
              <div className="bg-surface-container-high rounded-md flex items-center px-4 border-b-2 border-transparent focus-within:border-primary transition-all">
                <IdCard size={20} className="text-on-surface-variant mr-3" />
                <select 
                  {...register('idType')}
                  className="w-full bg-transparent border-none py-3 focus:ring-0 text-on-surface font-medium appearance-none"
                >
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID Card</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ID Number / Document Reference</label>
            <div className="bg-surface-container-high rounded-md flex items-center px-4 border-b-2 border-transparent focus-within:border-primary transition-all">
              <Fingerprint size={20} className="text-on-surface-variant mr-3" />
              <input 
                type="text" 
                placeholder="Enter identification number" 
                {...register('idNumber')}
                className="w-full bg-transparent border-none py-3 focus:ring-0 text-on-surface font-medium" 
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-headline font-bold text-primary flex items-center gap-2">
              <MapPin size={20} className="text-secondary" />
              Residential Address
            </h3>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-md p-1 border-b-2 border-transparent focus-within:border-primary transition-all shadow-sm">
                <textarea 
                  placeholder="Full residential street address..." 
                  rows={3} 
                  {...register('address')}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm p-3" 
                />
              </div>
              <div className="bg-surface-container-lowest rounded-md p-1 border-b-2 border-transparent focus-within:border-primary transition-all shadow-sm">
                <input 
                  type="text" 
                  placeholder="City / Province" 
                  {...register('city')}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm p-3" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-surface-container-lowest rounded-md p-1 border-b-2 border-transparent focus-within:border-primary transition-all shadow-sm">
                  <input 
                    type="text" 
                    placeholder="Country" 
                    {...register('country')}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm p-3" 
                  />
                </div>
                <div className="bg-surface-container-lowest rounded-md p-1 border-b-2 border-transparent focus-within:border-primary transition-all shadow-sm">
                  <input 
                    type="text" 
                    placeholder="Zip Code" 
                    {...register('zipCode')}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm p-3" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white p-6 rounded-xl relative overflow-hidden flex-1 flex flex-col justify-end shadow-lg">
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-lg mb-2">Technical Standards</h4>
              <p className="text-xs opacity-80 leading-relaxed">Please ensure all bio-data matches your official government-issued documents. Discrepancies may delay your examination scheduling.</p>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div className="md:col-span-12 flex justify-between items-center mt-4 pt-8 border-t border-outline-variant/15">
          <button type="button" className="text-primary font-headline font-bold hover:underline transition-all">
            Cancel Application
          </button>
          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 rounded-lg bg-primary text-white font-headline font-bold shadow-lg shadow-primary/10 hover:translate-y-[-1px] active:scale-95 transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save size={18} />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
