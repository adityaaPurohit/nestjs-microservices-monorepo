import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Entity('documents')
@Index(['status'])
@Index(['uploadedBy'])
@Index(['createdAt'])
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 255 })
  originalName: string;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ length: 500 })
  filePath: string;

  @Column({ length: 500, nullable: true })
  fileUrl: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  processingError: string;

  @Column({ nullable: true })
  processedAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'uploadedBy' })
  uploadedBy: User;

  @Column({ type: 'uuid' })
  uploadedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  getFileSizeInMB(): number {
    return this.fileSize / (1024 * 1024);
  }

  isProcessed(): boolean {
    return this.status === DocumentStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === DocumentStatus.FAILED;
  }

  canTransitionTo(newStatus: DocumentStatus): boolean {
    const allowedTransitions = {
      [DocumentStatus.PENDING]: [DocumentStatus.PROCESSING],
      [DocumentStatus.PROCESSING]: [
        DocumentStatus.COMPLETED,
        DocumentStatus.FAILED,
      ],
      [DocumentStatus.COMPLETED]: [DocumentStatus.ARCHIVED],
      [DocumentStatus.FAILED]: [DocumentStatus.PENDING],
      [DocumentStatus.ARCHIVED]: [],
    };

    return allowedTransitions[this.status]?.includes(newStatus) || false;
  }
}
