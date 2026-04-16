import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProgramStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'enum', enum: ProgramStatus, default: ProgramStatus.ACTIVE })
  status!: ProgramStatus;

  @Column({ name: 'degree_level', nullable: true })
  degreeLevel!: string;

  @Column({ name: 'duration_years' })
  durationYears!: number;

  @Column({ name: 'entry_requirements', nullable: true })
  entryRequirements!: string;

  @Column({ name: 'application_deadline', nullable: true })
  applicationDeadline!: Date;

  @Column({ name: 'application_fee', type: 'decimal', precision: 10, scale: 2, default: 50 })
  applicationFee!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}