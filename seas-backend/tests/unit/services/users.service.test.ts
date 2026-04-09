import bcrypt from 'bcrypt';
import { usersService } from '../../../src/modules/users/users.service';
import { usersRepository } from '../../../src/modules/users/users.repository';
import { ApiError } from '../../../src/common/errors/ApiError';
import { USER_MESSAGES } from '../../../src/modules/users/users.constants';

jest.mock('../../../src/modules/users/users.repository');
jest.mock('bcrypt');

const UserRole = {
  ADMIN: 'admin',
  CANDIDATE: 'candidate',
} as const;

const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

describe('UsersService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@test.com', firstName: 'John', lastName: 'Doe', role: UserRole.CANDIDATE, status: UserStatus.ACTIVE },
        { id: '2', email: 'user2@test.com', firstName: 'Jane', lastName: 'Smith', role: UserRole.ADMIN, status: UserStatus.ACTIVE },
      ];
      
      (usersRepository.findAll as jest.Mock).mockResolvedValue({
        data: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await usersService.getAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter users by role', async () => {
      (usersRepository.findAll as jest.Mock).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await usersService.getAll({ role: UserRole.ADMIN as any });

      expect(usersRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        status: undefined,
        role: UserRole.ADMIN as any,
      });
    });
  });

  describe('getById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: '1', email: 'test@test.com', password: 'hashed', firstName: 'John', lastName: 'Doe' };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersService.getById('1');

      expect(result.email).toBe('test@test.com');
      expect(result.password).toBeUndefined();
    });

    it('should throw not found error if user does not exist', async () => {
      (usersRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(usersService.getById('999')).rejects.toThrow(ApiError);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const mockUser = { id: '1', email: 'test@test.com', firstName: 'John', lastName: 'Doe' };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.update as jest.Mock).mockResolvedValue({ ...mockUser, firstName: 'Updated' });

      const result = await usersService.update('1', { firstName: 'Updated' });

      expect(result.firstName).toBe('Updated');
    });

    it('should throw not found error if user does not exist', async () => {
      (usersRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(usersService.update('999', { firstName: 'New' })).rejects.toThrow(ApiError);
    });
  });

  describe('activate', () => {
    it('should activate user successfully', async () => {
      const mockUser = { id: '1', status: UserStatus.PENDING };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.update as jest.Mock).mockResolvedValue({ ...mockUser, status: UserStatus.ACTIVE });

      await usersService.activate('1');

      expect(usersRepository.update).toHaveBeenCalledWith('1', { status: UserStatus.ACTIVE });
    });

    it('should throw error if user already active', async () => {
      const mockUser = { id: '1', status: UserStatus.ACTIVE };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(usersService.activate('1')).rejects.toThrow(USER_MESSAGES.ALREADY_ACTIVE);
    });
  });

  describe('deactivate', () => {
    it('should deactivate user successfully', async () => {
      const mockUser = { id: '1', status: UserStatus.ACTIVE };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.update as jest.Mock).mockResolvedValue({ ...mockUser, status: UserStatus.INACTIVE });

      await usersService.deactivate('1');

      expect(usersRepository.update).toHaveBeenCalledWith('1', { status: UserStatus.INACTIVE });
    });

    it('should throw error if user already inactive', async () => {
      const mockUser = { id: '1', status: UserStatus.INACTIVE };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(usersService.deactivate('1')).rejects.toThrow(USER_MESSAGES.ALREADY_INACTIVE);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const mockUser = { id: '1' };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.delete as jest.Mock).mockResolvedValue(true);

      await usersService.delete('1');

      expect(usersRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const mockUser = { id: '1', password: 'hashed' };
      (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed');
      (usersRepository.update as jest.Mock).mockResolvedValue(true);

      await usersService.updatePassword('1', 'newpassword');

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 12);
    });
  });
});