import { AppDataSource } from '../../database';
import { Document, DocumentStatus, DocumentType } from '../../database';

export interface CreateDocumentDto {
  applicationId: string;
  type: DocumentType;
  filename: string;
  filePath: string;
}

export const documentsRepository = {
  async findById(id: string): Promise<Document | null> {
    return AppDataSource.getRepository(Document).findOne({
      where: { id } as any,
      relations: ['application'],
    });
  },

  async findByApplicationId(applicationId: string): Promise<Document[]> {
    return AppDataSource.getRepository(Document).find({
      where: { applicationId } as any,
    });
  },

  async findByApplicationAndType(applicationId: string, type: DocumentType): Promise<Document | null> {
    return AppDataSource.getRepository(Document).findOne({
      where: { applicationId, type } as any,
    });
  },

  async create(data: CreateDocumentDto): Promise<Document> {
    const repo = AppDataSource.getRepository(Document);
    const doc = repo.create({
      ...data,
      status: DocumentStatus.PENDING,
    } as any);
    return await repo.save(doc) as unknown as Document;
  },

  async updateStatus(id: string, status: DocumentStatus, notes?: string): Promise<Document | null> {
    await AppDataSource.getRepository(Document).update(id, {
      status,
      notes,
    } as any);
    return this.findById(id);
  },

  async updateFilePath(id: string, filePath: string, filename: string): Promise<Document | null> {
    await AppDataSource.getRepository(Document).update(id, {
      filePath,
      filename,
      status: DocumentStatus.PENDING,
    } as any);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(Document).delete(id);
    return (result.affected ?? 0) > 0;
  },
};

export default documentsRepository;