export const APPLICATION_MESSAGES = {
  NOT_FOUND: 'Application not found',
  FORBIDDEN: 'You can only access your own applications',
  ALREADY_SUBMITTED: 'Application already submitted',
  ALREADY_APPROVED: 'Application already approved',
  ALREADY_REJECTED: 'Application already rejected',
  CANNOT_EDIT: 'Cannot edit submitted application',
  CANNOT_SUBMIT: 'Cannot submit application in current status',
  CREATED: 'Application created successfully',
  SUBMITTED: 'Application submitted successfully',
  APPROVED: 'Application approved successfully',
  REJECTED: 'Application rejected successfully',
} as const;

export default { APPLICATION_MESSAGES };