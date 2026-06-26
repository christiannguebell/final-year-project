/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application } from '../../../types/application';
import {
  BioDataHeader,
  BioDataFormFields,
  ResidentialAddressCard,
  TechnicalStandardsCard,
  BioDataFooter,
} from '../../../components/bio-data';
import type { BioDataFormValues } from '../../../components/bio-data';

const TOTAL_STEPS = 5;
const CURRENT_STEP = 1;

export const BioDataStep = ({
  onNext,
  data,
}: {
  onNext: (data: Partial<Application>) => void;
  data: Partial<Application>;
}) => {
  const navigate = useNavigate();

  const { register, handleSubmit, getValues, formState: { isSubmitting } } = useForm<BioDataFormValues>({
    defaultValues: {
      dateOfBirth: (data.candidate as any)?.profile?.dateOfBirth?.split('T')[0] || data.candidate?.dateOfBirth?.split('T')[0] || '',
      gender: (data.candidate as any)?.profile?.gender || data.candidate?.gender || '',
      nationality: (data.candidate as any)?.profile?.nationality || data.candidate?.nationality || '',
      idType: (data.candidate as any)?.profile?.idType || 'passport',
      idNumber: (data.candidate as any)?.profile?.idNumber || '',
      address: (data.candidate as any)?.profile?.address || data.candidate?.address || '',
      city: (data.candidate as any)?.profile?.city || data.candidate?.city || '',
      country: (data.candidate as any)?.profile?.country || data.candidate?.country || '',
      zipCode: (data.candidate as any)?.profile?.zipCode || '',
    },
  });

  const saveCandidateData = async (formData: BioDataFormValues) => {
    await apiClient.put('/candidates', formData);
  };

  const onSubmit = async (formData: BioDataFormValues) => {
    try {
      await saveCandidateData(formData);
      toast.success('Foundational profile saved');
      onNext({ candidate: { profile: formData } as any });
    } catch (error: unknown) {
      console.error('Failed to save bio data', error);
      toast.error('Failed to save candidate information. Please try again.');
    }
  };

  const handleSaveDraft = async () => {
    const formData = getValues();
    try {
      await saveCandidateData(formData);
      toast.success('Draft saved successfully');
    } catch {
      toast.error('Failed to save draft. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with step indicator and progress bar */}
      <BioDataHeader
        currentStep={CURRENT_STEP}
        totalSteps={TOTAL_STEPS}
        stepLabel="Bio Data"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Two-column layout: form fields (left) + address & info cards (right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Main form fields */}
          <div className="md:col-span-8">
            <BioDataFormFields register={register} />
          </div>

          {/* Right: Residential address + Technical Standards */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <ResidentialAddressCard register={register} />
            <TechnicalStandardsCard />
          </div>
        </div>

        {/* Footer: Cancel / Save Draft / Save & Continue */}
        <BioDataFooter
          onCancel={() => navigate('/applications')}
          onSaveDraft={handleSaveDraft}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
