import { getPaginationParams, createPaginatedResponse } from '../../../src/common/utils/pagination';

describe('Pagination Utility', () => {
  describe('getPaginationParams', () => {
    it('should return default values for no input', () => {
      const result = getPaginationParams();

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it('should return custom page and limit', () => {
      const result = getPaginationParams(2, 20);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(20);
    });

    it('should handle negative page', () => {
      const result = getPaginationParams(-1, 10);

      expect(result.page).toBe(1);
    });

    it('should handle zero limit', () => {
      const result = getPaginationParams(1, 0);

      expect(result.limit).toBe(1);
    });

    it('should cap limit at 100', () => {
      const result = getPaginationParams(1, 200);

      expect(result.limit).toBe(100);
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create paginated response', () => {
      const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const result = createPaginatedResponse(items, 15, 1, 10);

      expect(result.data).toHaveLength(3);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });

    it('should handle last page correctly', () => {
      const items = [{ id: '1' }];
      const result = createPaginatedResponse(items, 10, 2, 5);

      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(true);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should handle empty data', () => {
      const result = createPaginatedResponse([], 0, 1, 10);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });
});