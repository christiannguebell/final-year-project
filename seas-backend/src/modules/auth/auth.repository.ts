import { AppDataSource } from '../../database';
import { User, UserRole, UserStatus } from '../../database';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return AppDataSource.getRepository(User).findOne({
      where: { email: email.toLowerCase() },
    });
  },

  async findById(id: string): Promise<User | null> {
    return AppDataSource.getRepository(User).findOne({
      where: { id },
    });
  },

  async createUser(data: CreateUserDto): Promise<User> {
    const repository = AppDataSource.getRepository(User);
    const user = repository.create({
      email: data.email.toLowerCase(),
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || UserRole.CANDIDATE,
      status: UserStatus.PENDING,
    });
    return repository.save(user);
  },

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await AppDataSource.getRepository(User).update(id, data);
    return this.findById(id);
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await AppDataSource.getRepository(User).delete(id);
    return (result.affected ?? 0) > 0;
  },
};

export default authRepository;