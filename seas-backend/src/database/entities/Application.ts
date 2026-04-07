import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Program } from './Program';
import { AcademicRecord } from './AcademicRecord';
import { Document } from './Document';
import { Payment } from './Payment';
import { ExamAssignment } from './ExamAssignment';
import { Result } from './Result';

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'program_id' })
  programId!: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program!: Program;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.DRAFT })
  status!: ApplicationStatus;

  @Column({ nullable: true })
  personalStatement!: string;

  @OneToMany(() => AcademicRecord, (record) => record.application)
  academicRecords!: AcademicRecord[];

  @OneToMany(() => Document, (doc) => doc.application)
  documents!: Document[];

  @OneToMany(() => Payment, (payment) => payment.application)
  payments!: Payment[];

  @OneToMany(() => ExamAssignment, (assignment) => assignment.application)
  examAssignments!: ExamAssignment[];

  @OneToMany(() => Result, (result) => result.application)
  results!: Result[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}