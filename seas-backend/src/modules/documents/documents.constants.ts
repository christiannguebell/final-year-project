export const DOCUMENT_MESSAGES = {
  NOT_FOUND: 'Document not found',
  FORBIDDEN: 'You can only access documents from your applications',
  UPLOAD_FAILED: 'File upload failed',
  INVALID_TYPE: 'Invalid document type',
  CREATED: 'Document uploaded successfully',
  VERIFIED: 'Document verified successfully',
  REJECTED: 'Document rejected successfully',
  DELETED: 'Document deleted successfully',
} as const;

export const ALLOWED_DOCUMENT_TYPES = ['id_card', 'passport', 'photo', 'certificate', 'transcript', 'other'] as const;

export default { DOCUMENT_MESSAGES, ALLOWED_DOCUMENT_TYPES };