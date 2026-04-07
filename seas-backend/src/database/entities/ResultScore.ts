import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Result } from './Result';

@Entity('result_scores')
export class ResultScore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'result_id' })
  resultId!: string;

  @ManyToOne(() => Result, (result) => result.scores)
  @JoinColumn({ name: 'result_id' })
  result!: Result;

  @Column()
  subject!: string;

  @Column({ nullable: true })
  score!: number;

  @Column({ nullable: true })
  maxScore!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}