import crypto from 'crypto';

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const generateCandidateNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CAND-${timestamp}-${random}`;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUuid = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export default { generateId, generateCandidateNumber, isValidUuid };