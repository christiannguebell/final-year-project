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

@Entity('academic_records')
export class AcademicRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'application_id' })
  applicationId!: string;

  @ManyToOne(() => Application, (app) => app.academicRecords)
  @JoinColumn({ name: 'application_id' })
  application!: Application;

  @Column()
  institution!: string;

  @Column()
  degree!: string;

  @Column({ name: 'start_date' })
  startDate!: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate!: Date;

  @Column({ nullable: true })
  grade!: string;

  @Column({ nullable: true })
  fieldOfStudy!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}