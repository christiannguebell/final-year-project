import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import env from '../config/env';
import { STORAGE_KEYS, API_TIMEOUT } from '../config/constants';
import type { ApiResponse } from '../types/api';

class ApiClient {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: env.API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      async (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              if (response.accessToken) {
                localStorage.setItem(STORAGE_KEYS.TOKEN, response.accessToken);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
                if (error.config) {
                  error.config.headers.Authorization = `Bearer ${response.accessToken}`;
                  return this.client.request(error.config);
                }
              }
            } catch {
              this.clearAuth();
              window.location.href = '/login';
            }
          } else {
            this.clearAuth();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  private async refreshToken(refreshToken: string) {
    const response = await this.client.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  }

  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get<ApiResponse<T>>(url, config);
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post<ApiResponse<T>>(url, data, config);
  }

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put<ApiResponse<T>>(url, data, config);
  }

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.patch<ApiResponse<T>>(url, data, config);
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete<ApiResponse<T>>(url, config);
  }

  uploadFile<T = unknown>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  download(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Blob>> {
    return this.client.get(url, {
      ...config,
      responseType: 'blob',
    }) as Promise<AxiosResponse<Blob>>;
  }
}

export const apiClient = new ApiClient();
export default apiClient;