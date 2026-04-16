import { documentsRepository } from './documents.repository';
import { applicationsRepository } from '../applications/applications.repository';
import { ApiError } from '../../common/errors/ApiError';
import { Document, DocumentType, DocumentStatus, UserRole } from '../../database';
import { DOCUMENT_MESSAGES } from './documents.constants';
import fs from 'fs';

const UPLOAD_DIR = 'uploads/documents';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const documentsService = {
  async upload(applicationId: string, type: DocumentType, file: Express.Multer.File): Promise<Document> {
    const application = await applicationsRepository.findById(applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw ApiError.badRequest('Invalid file type. Allowed: PDF, JPEG, PNG');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw ApiError.badRequest('File too large. Maximum size: 10MB');
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const existing = await documentsRepository.findByApplicationAndType(applicationId, type);
    let doc: Document;
    if (existing) {
      if (existing.filePath && fs.existsSync(existing.filePath)) {
        fs.unlinkSync(existing.filePath);
      }
      doc = (await documentsRepository.updateFilePath(existing.id, file.path, file.originalname))!;
    } else {
      doc = await documentsRepository.create({
        applicationId,
        type,
        filename: file.originalname,
        filePath: file.path,
      });
    }
    return doc;
  },

  async getByApplicationId(applicationId: string, userId?: string, role?: string): Promise<Document[]> {
    const application = await applicationsRepository.findById(applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(DOCUMENT_MESSAGES.FORBIDDEN);
    }
    return await documentsRepository.findByApplicationId(applicationId);
  },

  async verify(id: string, status: DocumentStatus, notes?: string): Promise<Document> {
    const doc = await documentsRepository.findById(id);
    if (!doc) {
      throw ApiError.notFound(DOCUMENT_MESSAGES.NOT_FOUND);
    }
    const updated = await documentsRepository.updateStatus(id, status, notes);
    return updated!;
  },

  async delete(id: string, userId?: string, role?: string): Promise<void> {
    const doc = await documentsRepository.findById(id);
    if (!doc) {
      throw ApiError.notFound(DOCUMENT_MESSAGES.NOT_FOUND);
    }
    const application = await applicationsRepository.findById(doc.applicationId);
    if (!application) {
      throw ApiError.notFound('Application not found');
    }
    if (role !== UserRole.ADMIN && application.userId !== userId) {
      throw ApiError.forbidden(DOCUMENT_MESSAGES.FORBIDDEN);
    }
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }
    await documentsRepository.delete(id);
  },
};

export default documentsService;