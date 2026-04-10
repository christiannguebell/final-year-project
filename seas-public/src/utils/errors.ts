import { AxiosError } from 'axios';
import type { ApiResponse, ApiError as ApiErrorType } from '../types/api';

export class ApiException extends Error {
  code?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.errors = errors;
  }
}

export function handleApiError(error: unknown): ApiException {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiResponse;
    if (response?.message) {
      return new ApiException(
        response.message,
        response.errors as string | undefined,
        response.errors as Record<string, string[]> | undefined
      );
    }
    if (error.code === 'ECONNABORTED') {
      return new ApiException('Request timeout. Please try again.');
    }
    if (!error.response) {
      return new ApiException('Network error. Please check your connection.');
    }
    return new ApiException(error.message);
  }
  if (error instanceof Error) {
    return new ApiException(error.message);
  }
  return new ApiException('An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  return handleApiError(error).message;
}