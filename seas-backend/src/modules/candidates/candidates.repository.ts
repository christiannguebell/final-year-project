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

export interface ListCandidatesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  programId?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const candidatesRepository = {
  async findById(id: string): Promise<CandidateProfile | null> {
    return AppDataSource.getRepository(CandidateProfile).findOne({
      where: { id } as any,
      relations: ['user', 'applications', 'applications.program'],
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

  async findAll(options?: ListCandidatesOptions): Promise<PaginatedResult<CandidateProfile>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = AppDataSource.getRepository(CandidateProfile)
      .createQueryBuilder('candidate')
      .leftJoinAndSelect('candidate.user', 'user');

    if (options?.search) {
      queryBuilder.where(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR candidate.candidateNumber LIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('candidate.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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