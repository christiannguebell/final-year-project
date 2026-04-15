import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('candidate_profiles')
export class CandidateProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'candidate_number', unique: true })
  candidateNumber!: string;

  @Column({ nullable: true })
  dateOfBirth!: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender!: Gender;

  @Column({ nullable: true })
  nationality!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  country!: string;

  @Column({ name: 'profile_photo', nullable: true })
  profilePhoto!: string;

  @Column({ name: 'id_type', nullable: true })
  idType!: string;

  @Column({ name: 'id_number', nullable: true })
  idNumber!: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}