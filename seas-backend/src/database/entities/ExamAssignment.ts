import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './Application';
import { ExamSession } from './ExamSession';
import { ExamCenter } from './ExamCenter';

@Entity('exam_assignments')
export class ExamAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'application_id' })
  applicationId!: string;

  @ManyToOne(() => Application, (app) => app.examAssignments)
  @JoinColumn({ name: 'application_id' })
  application!: Application;

  @Column({ name: 'session_id' })
  sessionId!: string;

  @ManyToOne(() => ExamSession)
  @JoinColumn({ name: 'session_id' })
  session!: ExamSession;

  @Column({ name: 'center_id' })
  centerId!: string;

  @ManyToOne(() => ExamCenter)
  @JoinColumn({ name: 'center_id' })
  center!: ExamCenter;

  @Column({ name: 'seat_number' })
  seatNumber!: string;

  @Column({ name: 'exam_time', nullable: true })
  examTime!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}