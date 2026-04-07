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

export enum DocumentType {
  ID_CARD = 'id_card',
  PASSPORT = 'passport',
  PHOTO = 'photo',
  CERTIFICATE = 'certificate',
  TRANSCRIPT = 'transcript',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'application_id' })
  applicationId!: string;

  @ManyToOne(() => Application, (app) => app.documents)
  @JoinColumn({ name: 'application_id' })
  application!: Application;

  @Column({ type: 'enum', enum: DocumentType })
  type!: DocumentType;

  @Column()
  filename!: string;

  @Column({ name: 'file_path' })
  filePath!: string;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  status!: DocumentStatus;

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}