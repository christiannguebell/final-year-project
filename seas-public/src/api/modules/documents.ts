import apiClient from '../client';
import type { Document, DocumentType } from '@/types/entities';

export interface UploadDocumentPayload {
  applicationId: string;
  type: DocumentType;
  file: File;
}

export const documentsApi = {
  async upload(data: UploadDocumentPayload) {
    const formData = new FormData();
    formData.append('document', data.file);
    formData.append('applicationId', data.applicationId);
    formData.append('type', data.type);
    const response = await apiClient.uploadFile<Document>('/documents/upload', formData);
    return response.data;
  },

  async list(applicationId: string) {
    const response = await apiClient.get<Document[]>(`/documents/application/${applicationId}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  },

  async getScanningGuide() {
    const response = await apiClient.download('/documents/scanning-guide');
    return response.data;
  },
};

export default documentsApi;
