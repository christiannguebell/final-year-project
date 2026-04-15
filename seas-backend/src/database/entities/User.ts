import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Application } from './Application';
import { CandidateProfile } from './CandidateProfile';

export enum UserRole {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CANDIDATE })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status!: UserStatus;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  resetToken!: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry!: Date;

  @Column({ nullable: true })
  otp!: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry!: Date;

  @Column({ name: 'token_version', default: 0 })
  tokenVersion!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Application, (app) => app.candidate)
  applications!: Application[];

  @OneToOne(() => CandidateProfile, (profile) => profile.user)
  profile!: CandidateProfile;
}