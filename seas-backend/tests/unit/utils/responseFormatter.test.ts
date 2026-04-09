import { successResponse, errorResponse, paginatedResponse } from '../../../src/common/utils/responseFormatter';

describe('Response Formatter Utility', () => {
  describe('successResponse', () => {
    it('should format a success response with data and default message', () => {
      const data = { id: 1, name: 'Test' };
      const response = successResponse(data);
      
      expect(response).toEqual({
        success: true,
        message: 'Success',
        data
      });
    });

    it('should format a success response with custom message', () => {
      const data = { id: 1 };
      const message = 'Custom success';
      const response = successResponse(data, message);
      
      expect(response).toEqual({
        success: true,
        message,
        data
      });
    });
  });

  describe('errorResponse', () => {
    it('should format an error response with message', () => {
      const message = 'Something went wrong';
      const response = errorResponse(message);
      
      expect(response).toEqual({
        success: false,
        message,
        data: null,
        errors: undefined
      });
    });

    it('should format an error response with errors object', () => {
      const message = 'Validation failed';
      const errors = [{ field: 'email', message: 'required' }];
      const response = errorResponse(message, errors);
      
      expect(response).toEqual({
        success: false,
        message,
        data: null,
        errors
      });
    });
  });

  describe('paginatedResponse', () => {
    it('should format a paginated response', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
      
      const response = paginatedResponse(items, pagination);
      
      expect(response).toEqual({
        success: true,
        message: 'Success',
        data: {
          items,
          pagination
        }
      });
    });
  });
});
