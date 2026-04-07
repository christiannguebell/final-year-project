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

  @Column({ name: 'duration_years' })
  durationYears!: number;

  @Column({ name: 'entry_requirements', nullable: true })
  entryRequirements!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}