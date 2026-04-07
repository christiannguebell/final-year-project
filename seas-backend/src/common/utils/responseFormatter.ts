export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: unknown;
}

export const successResponse = <T = unknown>(
  data: T,
  message = 'Success'
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (
  message: string,
  errors?: unknown,
  data: null = null
): ApiResponse => {
  return {
    success: false,
    message,
    data,
    errors
  };
};

export const paginatedResponse = <T>(
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
  message = 'Success'
): ApiResponse => {
  return {
    success: true,
    message,
    data: {
      items: data,
      pagination
    }
  };
};

export default { successResponse, errorResponse, paginatedResponse };