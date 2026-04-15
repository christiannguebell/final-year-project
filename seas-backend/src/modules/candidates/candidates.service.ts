import { candidatesRepository } from './candidates.repository';
import { ApiError } from '../../common/errors/ApiError';
import { CandidateProfile, Gender } from '../../database';
import { CANDIDATE_MESSAGES } from './candidates.constants';
import { generateCandidateNumber } from '../../common/utils';

interface CreateCandidateData {
  userId: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface UpdateCandidateData {
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePhoto?: string;
  idType?: string;
  idNumber?: string;
  zipCode?: string;
}

export const candidatesService = {
  async create(data: CreateCandidateData): Promise<CandidateProfile> {
    const exists = await candidatesRepository.existsByUserId(data.userId);
    if (exists) {
      throw ApiError.conflict(CANDIDATE_MESSAGES.ALREADY_EXISTS);
    }

    const candidateNumber = generateCandidateNumber();
    const createData = {
      userId: data.userId,
      candidateNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      nationality: data.nationality,
      address: data.address,
      city: data.city,
      country: data.country,
    };
    return await candidatesRepository.create(createData);
  },

  async getById(id: string): Promise<CandidateProfile> {
    const profile = await candidatesRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound(CANDIDATE_MESSAGES.NOT_FOUND);
    }
    return profile;
  },

  async getByUserId(userId: string): Promise<CandidateProfile> {
    const profile = await candidatesRepository.findByUserId(userId);
    if (!profile) {
      throw ApiError.notFound(CANDIDATE_MESSAGES.NOT_FOUND);
    }
    return profile;
  },

  /**
   * Upsert: creates the profile if it doesn't exist, updates it if it does.
   * This allows the Bio Data step to work on first visit without a prior POST.
   */
  async upsert(userId: string, data: UpdateCandidateData): Promise<CandidateProfile> {
    const existing = await candidatesRepository.findByUserId(userId);
    if (!existing) {
      const candidateNumber = generateCandidateNumber();
      return await candidatesRepository.create({
        userId,
        candidateNumber,
        ...data,
      } as any);
    }
    const updated = await candidatesRepository.updateById(existing.id, data);
    return updated!;
  },

  async update(id: string, data: UpdateCandidateData): Promise<CandidateProfile> {
    const profile = await candidatesRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound(CANDIDATE_MESSAGES.NOT_FOUND);
    }
    const updated = await candidatesRepository.updateById(id, data);
    return updated!;
  },

  async updateProfilePhoto(id: string, photoPath: string): Promise<CandidateProfile> {
    const profile = await candidatesRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound(CANDIDATE_MESSAGES.NOT_FOUND);
    }
    const updated = await candidatesRepository.updateById(id, { profilePhoto: photoPath });
    return updated!;
  },

  async delete(id: string): Promise<void> {
    const profile = await candidatesRepository.findById(id);
    if (!profile) {
      throw ApiError.notFound(CANDIDATE_MESSAGES.NOT_FOUND);
    }
    await candidatesRepository.deleteProfile(id);
  },
};

export default candidatesService;