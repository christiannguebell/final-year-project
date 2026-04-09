import { AppDataSource } from '../index';
import { Program } from '../entities/Program';

export const seedTestProgram = async (): Promise<Program> => {
  const programRepository = AppDataSource.getRepository(Program);

  const existing = await programRepository.findOne({
    where: { code: 'TEST-PROG' },
  });

  if (existing) {
    return existing;
  }

  const program = programRepository.create({
    name: 'Test Computer Science',
    code: 'TEST-PROG',
    description: 'Test program for integration tests',
    durationYears: 4,
  });

  await programRepository.save(program);
  return program;
};