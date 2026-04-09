import bcrypt from 'bcrypt';
import { AppDataSource } from '../index';
import { User, UserRole, UserStatus } from '../entities/User';

export const seedAdminUser = async (): Promise<User> => {
  const userRepository = AppDataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@seas.com' },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = userRepository.create({
    email: 'admin@seas.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  });

  await userRepository.save(adminUser);
  return adminUser;
};