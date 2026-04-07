import { AppDataSource } from '../../database';
import { CandidateProfile, Gender } from '../../database';

export interface CreateCandidateDto {
  userId: string;
  candidateNumber: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePhoto?: string;
}

export const candidatesRepository = {
  async findById(id: string): Promise<CandidateProfile | null> {
    return AppDataSource.getRepository(CandidateProfile).findOne({
      where: { id } as any,
      relations: ['user'],
    });
  },

  async findByUserId(userId: string): Promise<CandidateProfile | null> {
    return AppDataSource.getRepository(CandidateProfile).findOne({
      where: { userId } as any,
      relations: ['user'],
    });
  },

  async findByCandidateNumber(candidateNumber: string): Promise<CandidateProfile | null> {
    return AppDataSource.getRepository(CandidateProfile).findOne({
      where: { candidateNumber } as any,
      relations: ['user'],
    });
  },

  async create(data: CreateCandidateDto): Promise<CandidateProfile> {
    const repo = AppDataSource.getRepository(CandidateProfile);
    const profile = repo.create(data as any);
    return await repo.save(profile) as unknown as CandidateProfile;
  },

  async updateById(id: string, data: Partial<CandidateProfile>): Promise<CandidateProfile | null> {
    await AppDataSource.getRepository(CandidateProfile).update(id, data as any);
    return this.findById(id);
  },

  async deleteProfile(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(CandidateProfile).delete(id);
    return (result.affected ?? 0) > 0;
  },

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await AppDataSource.getRepository(CandidateProfile).count({
      where: { userId } as any,
    });
    return count > 0;
  },
};

export default candidatesRepository;