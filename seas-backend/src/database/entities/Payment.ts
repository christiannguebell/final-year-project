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

export enum PaymentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'application_id' })
  applicationId!: string;

  @ManyToOne(() => Application, (app) => app.payments)
  @JoinColumn({ name: 'application_id' })
  application!: Application;

  @Column()
  amount!: number;

  @Column({ name: 'payment_date' })
  paymentDate!: Date;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId!: string;

  @Column({
    type: 'enum',
    enum: ['BANK_TRANSFER', 'MOBILE_MONEY', 'CASH'],
    default: 'BANK_TRANSFER'
  })
  method!: 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CASH';

  @Column({ name: 'receipt_file', nullable: true })
  receiptFile!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}