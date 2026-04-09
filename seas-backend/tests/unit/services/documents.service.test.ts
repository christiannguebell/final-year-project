import { documentsService } from '../../../src/modules/documents/documents.service';
import { documentsRepository } from '../../../src/modules/documents/documents.repository';
import { applicationsRepository } from '../../../src/modules/applications/applications.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { DocumentType, DocumentStatus, UserRole } from '../../../src/database';
import fs from 'fs';

jest.mock('../../../src/modules/documents/documents.repository');
jest.mock('../../../src/modules/applications/applications.repository');
jest.mock('fs');

describe('DocumentsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should throw not found if application does not exist', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue(null);

      const mockFile = { path: '/uploads/test.pdf', originalname: 'test.pdf' } as Express.Multer.File;
      await expect(
        documentsService.upload('app1', DocumentType.ID_CARD, mockFile)
      ).rejects.toThrow(ApiError);
    });

    it('should upload document successfully', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1' });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (documentsRepository.findByApplicationAndType as jest.Mock).mockResolvedValue(null);
      (documentsRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        applicationId: 'app1',
        type: DocumentType.ID_CARD,
        filePath: '/uploads/documents/test.pdf',
      });

      const mockFile = { path: '/uploads/documents/test.pdf', originalname: 'test.pdf' } as Express.Multer.File;
      await documentsService.upload('app1', DocumentType.ID_CARD, mockFile);

      expect(result.type).toBe(DocumentType.ID_CARD);
    });

    it('should replace existing document', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1' });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (documentsRepository.findByApplicationAndType as jest.Mock).mockResolvedValue({
        id: '1',
        filePath: '/uploads/old.pdf',
      });
      (documentsRepository.updateFilePath as jest.Mock).mockResolvedValue({
        id: '1',
        filePath: '/uploads/new.pdf',
      });

      const mockFile = { path: '/uploads/new.pdf', originalname: 'new.pdf' } as Express.Multer.File;
      await documentsService.upload('app1', DocumentType.ID_CARD, mockFile);

      expect(fs.unlinkSync).toHaveBeenCalledWith('/uploads/old.pdf');
    });
  });

  describe('getByApplicationId', () => {
    it('should return documents for application', async () => {
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1', userId: '1' });
      (documentsRepository.findByApplicationId as jest.Mock).mockResolvedValue([
        { id: '1', type: DocumentType.ID_CARD },
      ]);

      await documentsService.getByApplicationId('app1', '1', UserRole.CANDIDATE);

      expect(result).toHaveLength(1);
    });
  });

  describe('verify', () => {
    it('should verify document', async () => {
      (documentsRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
      (documentsRepository.updateStatus as jest.Mock).mockResolvedValue({
        id: '1',
        status: DocumentStatus.VERIFIED,
      });

      await documentsService.verify('1', DocumentStatus.VERIFIED);

      expect(result.status).toBe(DocumentStatus.VERIFIED);
    });
  });

  describe('delete', () => {
    it('should delete document and file', async () => {
      (documentsRepository.findById as jest.Mock).mockResolvedValue({
        id: '1',
        applicationId: 'app1',
        filePath: '/uploads/test.pdf',
      });
      (applicationsRepository.findById as jest.Mock).mockResolvedValue({ id: 'app1', userId: '1' });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (documentsRepository.delete as jest.Mock).mockResolvedValue(true);

      await documentsService.delete('1', '1', UserRole.CANDIDATE);

      expect(fs.unlinkSync).toHaveBeenCalledWith('/uploads/test.pdf');
    });
  });
});