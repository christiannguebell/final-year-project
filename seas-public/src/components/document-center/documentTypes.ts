export const DOCUMENT_TYPES = [
  {
    id: 'id_card',
    label: 'National ID / Passport',
    description: 'Upload a clear scan of your valid government-issued identification.',
    required: true,
  },
  {
    id: 'transcript',
    label: 'Academic Transcripts',
    description: 'Include all semesters from your most recently completed degree.',
    required: true,
  },
  {
    id: 'certificate',
    label: 'Degrees & Diplomas',
    description: 'Official degree certificates or provisional letters of completion.',
    required: true,
    allowMultiple: true,
  },
] as const;

export type DocumentTypeId = (typeof DOCUMENT_TYPES)[number]['id'];
