import { generateId, generateCandidateNumber, isValidUuid } from '../../../src/common/utils/idGenerator';

describe('ID Generator Utility', () => {
  describe('generateId', () => {
    it('should generate a valid UUID', () => {
      const id = generateId();
      expect(isValidUuid(id)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateCandidateNumber', () => {
    it('should generate a candidate number starting with CAND-', () => {
      const candidateNumber = generateCandidateNumber();
      expect(candidateNumber).toMatch(/^CAND-[A-Z0-9]+-[A-Z0-9]+$/);
    });

    it('should generate different candidate numbers', () => {
      const num1 = generateCandidateNumber();
      const num2 = generateCandidateNumber();
      expect(num1).not.toBe(num2);
    });
  });

  describe('isValidUuid', () => {
    it('should return true for valid UUID', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUuid(validUuid)).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      const invalidUuid = 'not-a-uuid';
      expect(isValidUuid(invalidUuid)).toBe(false);
    });
  });
});
