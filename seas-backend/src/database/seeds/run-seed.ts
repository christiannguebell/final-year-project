import 'reflect-metadata';
import { AppDataSource } from '../index';
import { Program, ProgramStatus } from '../entities/Program';
import { User, UserRole, UserStatus } from '../entities/User';
import bcrypt from 'bcrypt';

const programs = [
  {
    name: 'Civil Engineering',
    code: 'CIVIL-01',
    description: 'Study the design, construction, and maintenance of the built environment, including roads, bridges, dams, and buildings.',
    degreeLevel: "Bachelor's",
    durationYears: 5,
    entryRequirements: 'Mathematics, Physics, Chemistry at A-level or equivalent. Minimum average of 14/20.',
    status: ProgramStatus.ACTIVE,
  },
  {
    name: 'Electrical & Electronics Engineering',
    code: 'EEE-01',
    description: 'Focus on the study of electricity, electronics, and electromagnetism, covering power systems, signal processing, and control systems.',
    degreeLevel: "Bachelor's",
    durationYears: 5,
    entryRequirements: 'Mathematics, Physics at A-level or equivalent. Minimum average of 14/20.',
    status: ProgramStatus.ACTIVE,
  },
  {
    name: 'Mechanical Engineering',
    code: 'MECH-01',
    description: 'The study of mechanics, thermodynamics, and materials science applied to design and manufacturing of mechanical systems.',
    degreeLevel: "Bachelor's",
    durationYears: 5,
    entryRequirements: 'Mathematics, Physics, Industrial Technology. Minimum average of 14/20.',
    status: ProgramStatus.ACTIVE,
  },
  {
    name: 'Computer Engineering',
    code: 'COMP-01',
    description: 'Bridging hardware and software engineering, covering embedded systems, computer architecture, and software development.',
    degreeLevel: "Bachelor's",
    durationYears: 5,
    entryRequirements: 'Mathematics, Physics, Computer Science at A-level. Minimum average of 15/20.',
    status: ProgramStatus.ACTIVE,
  },
  {
    name: 'Industrial & Manufacturing Engineering',
    code: 'IME-01',
    description: 'Optimize complex processes and systems in manufacturing, focusing on production efficiency, quality control, and supply chain management.',
    degreeLevel: "Bachelor's",
    durationYears: 5,
    entryRequirements: 'Mathematics, Physics, Industrial Technology. Minimum average of 13/20.',
    status: ProgramStatus.ACTIVE,
  },
  {
    name: 'Master of Structural Engineering',
    code: 'MSE-01',
    description: 'Advanced study in structural analysis, earthquake engineering, and sustainable construction techniques for postgraduate candidates.',
    degreeLevel: "Master's",
    durationYears: 2,
    entryRequirements: 'Bachelor\'s degree in Civil or Structural Engineering. Minimum GPA of 3.0/4.0.',
    status: ProgramStatus.ACTIVE,
  },
];

const adminUser = {
  email: 'admin@seas.cm',
  password: 'Admin@1234',
  firstName: 'SEAS',
  lastName: 'Administrator',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
};

async function runSeed() {
  console.log('🌱 Starting database seed...');

  await AppDataSource.initialize();
  console.log('✅ Database connected');

  // Seed Programs
  const programRepo = AppDataSource.getRepository(Program);
  let created = 0, skipped = 0;
  for (const p of programs) {
    const existing = await programRepo.findOne({ where: { code: p.code } });
    if (existing) {
      skipped++;
      continue;
    }
    await programRepo.save(programRepo.create(p));
    created++;
  }
  console.log(`📚 Programs: ${created} created, ${skipped} already existed`);

  // Seed Admin
  const userRepo = AppDataSource.getRepository(User);
  const existingAdmin = await userRepo.findOne({ where: { email: adminUser.email } });
  if (existingAdmin) {
    console.log('👤 Admin user already exists, skipping');
  } else {
    const hashed = await bcrypt.hash(adminUser.password, 12);
    await userRepo.save(userRepo.create({ ...adminUser, password: hashed } as any));
    console.log(`👤 Admin user created: ${adminUser.email} / ${adminUser.password}`);
  }

  await AppDataSource.destroy();
  console.log('🎉 Seed complete!');
}

runSeed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
