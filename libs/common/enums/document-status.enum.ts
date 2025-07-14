export enum DocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ARCHIVED = 'archived',
}

export const DocumentStatusFlow = {
  [DocumentStatus.PENDING]: [DocumentStatus.UPLOADED],
  [DocumentStatus.UPLOADED]: [DocumentStatus.PROCESSING],
  [DocumentStatus.PROCESSING]: [
    DocumentStatus.PROCESSED,
    DocumentStatus.FAILED,
  ],
  [DocumentStatus.PROCESSED]: [DocumentStatus.COMPLETED],
  [DocumentStatus.COMPLETED]: [DocumentStatus.ARCHIVED],
  [DocumentStatus.FAILED]: [DocumentStatus.PENDING],
  [DocumentStatus.ARCHIVED]: [],
};
