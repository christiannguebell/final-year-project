export const PAYMENT_MESSAGES = {
  NOT_FOUND: 'Payment not found',
  FORBIDDEN: 'You can only access payments from your applications',
  ALREADY_VERIFIED: 'Payment already verified',
  ALREADY_REJECTED: 'Payment already rejected',
  CREATED: 'Payment recorded successfully',
  VERIFIED: 'Payment verified successfully',
  REJECTED: 'Payment rejected successfully',
  DELETED: 'Payment deleted successfully',
} as const;

export default { PAYMENT_MESSAGES };