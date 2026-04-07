import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExamSessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('exam_sessions')
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ name: 'exam_date' })
  examDate!: Date;

  @Column({ name: 'registration_start', nullable: true })
  registrationStart!: Date;

  @Column({ name: 'registration_end', nullable: true })
  registrationEnd!: Date;

  @Column({ type: 'enum', enum: ExamSessionStatus, default: ExamSessionStatus.SCHEDULED })
  status!: ExamSessionStatus;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}