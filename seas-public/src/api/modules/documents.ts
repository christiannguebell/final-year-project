import apiClient from '../client';
import type { Document, DocumentType } from '../types/entities';
import type { PaginatedParams, PaginatedResponse } from '../types/api';

export interface UploadDocumentPayload {
  type: DocumentType;
  file: File;
}

export interface ListDocumentsParams extends PaginatedParams {
  type?: DocumentType;
}

export const documentsApi = {
  async upload(data: UploadDocumentPayload) {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('file', data.file);
    const response = await apiClient.uploadFile<Document>('/documents', formData);
    return response.data;
  },

  async list(params?: ListDocumentsParams) {
    const response = await apiClient.get<PaginatedResponse<Document>>('/documents', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  async download(id: string) {
    const response = await apiClient.download(`/documents/${id}/download`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  },
};

export default documentsApi;