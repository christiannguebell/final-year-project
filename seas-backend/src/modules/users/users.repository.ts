import { AppDataSource } from '../../database';
import { User, UserRole, UserStatus } from '../../database';
import { Like, FindOptionsWhere } from 'typeorm';

export interface UserSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    return AppDataSource.getRepository(User).findOne({ where: { id } });
  },

  async findByEmail(email: string): Promise<User | null> {
    return AppDataSource.getRepository(User).findOne({
      where: { email: email.toLowerCase() },
    });
  },

  async findAll(params: UserSearchParams): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, search, status, role } = params;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User> = {};
    
    if (status) {
      where.status = status;
    }
    if (role) {
      where.role = role;
    }

    let queryBuilder = AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where(where);

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  },

  async create(data: Partial<User>): Promise<User> {
    const user = AppDataSource.getRepository(User).create(data);
    return AppDataSource.getRepository(User).save(user);
  },

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await AppDataSource.getRepository(User).update(id, data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(User).delete(id);
    return (result.affected ?? 0) > 0;
  },

  async count(where?: FindOptionsWhere<User>): Promise<number> {
    return AppDataSource.getRepository(User).count({ where });
  },
};

export default usersRepository;