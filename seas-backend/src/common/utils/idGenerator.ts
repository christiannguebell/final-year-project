import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export const generateId = (): string => {
  return uuidv4();
};

export const generateCandidateNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CAND-${timestamp}-${random}`;
};

export const isValidUuid = (id: string): boolean => {
  return uuidValidate(id);
};

export default { generateId, generateCandidateNumber, isValidUuid };