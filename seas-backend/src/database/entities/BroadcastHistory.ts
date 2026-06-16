import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum BroadcastChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  BOTH = 'both',
}

@Entity('broadcast_history')
export class BroadcastHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'enum', enum: BroadcastChannel, default: BroadcastChannel.IN_APP })
  channel!: BroadcastChannel;

  @Column({ name: 'target_audience', nullable: true })
  targetAudience!: string;

  @Column({ name: 'recipient_count', default: 0 })
  recipientCount!: number;

  @Column({ name: 'email_sent_count', default: 0 })
  emailSentCount!: number;

  @Column({ name: 'sent_by' })
  sentBy!: string;

  @Column({ type: 'jsonb', nullable: true })
  filters!: Record<string, any>;

  @Column({ nullable: true })
  templateId!: string;

  @Column({ type: 'jsonb', nullable: true })
  templateData!: Record<string, any>;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt!: Date;
}
