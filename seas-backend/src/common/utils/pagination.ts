export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getPaginationParams = (page = 1, limit = 10): { page: number; limit: number; offset: number } => {
  const normalizedPage = Math.max(1, Number(page));
  const normalizedLimit = Math.min(100, Math.max(1, Number(limit)));
  const offset = (normalizedPage - 1) * normalizedLimit;
  
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

export default { getPaginationParams, createPaginatedResponse };