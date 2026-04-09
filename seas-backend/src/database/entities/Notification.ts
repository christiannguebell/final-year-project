import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

export enum NotificationType {
  APPLICATION = 'application',
  PAYMENT = 'payment',
  EXAM = 'exam',
  RESULT = 'result',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel, default: NotificationChannel.IN_APP })
  channel!: NotificationChannel;

  @Column({ name: 'template_id', nullable: true })
  templateId!: string;

  @Column({ name: 'template_data', type: 'jsonb', nullable: true })
  templateData!: Record<string, any>;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status!: NotificationStatus;

  @Column({ nullable: true })
  link!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}