import bcrypt from 'bcrypt';
import { usersRepository } from './users.repository';
import { ApiError } from '../../common/errors/ApiError';
import { User, UserStatus, UserRole } from '../../database';
import { USER_MESSAGES } from './users.constants';
import { getPaginationParams, createPaginatedResponse } from '../../common/utils';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: UserStatus;
  role?: UserRole;
}

export const usersService = {
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: UserStatus;
    role?: UserRole;
  }) {
    const { page, limit } = getPaginationParams(params.page, params.limit);
    const result = await usersRepository.findAll({
      page,
      limit,
      search: params.search,
      status: params.status,
      role: params.role,
    });

    const usersWithoutPassword = result.data.map(({ password: _password, ...user }) => user);
    return createPaginatedResponse(usersWithoutPassword, result.total, page, limit);
  },

  async getById(id: string): Promise<Partial<User>> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async update(id: string, data: UpdateUserData): Promise<Partial<User>> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }



    const updatedUser = await usersRepository.update(id, data);
    if (!updatedUser) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async activate(id: string): Promise<void> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }
    if (user.status === UserStatus.ACTIVE) {
      throw ApiError.badRequest(USER_MESSAGES.ALREADY_ACTIVE);
    }
    await usersRepository.update(id, { status: UserStatus.ACTIVE });
  },

  async deactivate(id: string): Promise<void> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }
    if (user.status === UserStatus.INACTIVE) {
      throw ApiError.badRequest(USER_MESSAGES.ALREADY_INACTIVE);
    }
    await usersRepository.update(id, { status: UserStatus.INACTIVE });
  },

  async delete(id: string): Promise<void> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }
    await usersRepository.delete(id);
  },

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(USER_MESSAGES.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await usersRepository.update(id, { password: hashedPassword });
  },
};

export default usersService;