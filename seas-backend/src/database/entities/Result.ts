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
import { Application } from './Application';
import { ResultScore } from './ResultScore';

export enum ResultStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
}

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'application_id' })
  applicationId!: string;

  @ManyToOne(() => Application, (app) => app.results)
  @JoinColumn({ name: 'application_id' })
  application!: Application;

  @Column({ nullable: true })
  totalScore!: number;

  @Column({ nullable: true })
  rank!: number;

  @Column({ type: 'enum', enum: ResultStatus, default: ResultStatus.PENDING })
  status!: ResultStatus;

  @Column({ name: 'published_at', nullable: true })
  publishedAt!: Date;

  @OneToMany(() => ResultScore, (score) => score.result)
  scores!: ResultScore[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}