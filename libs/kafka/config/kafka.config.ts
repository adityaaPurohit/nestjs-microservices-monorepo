import { KafkaOptions, Transport } from '@nestjs/microservices';

export const getKafkaConfig = (): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID || 'user-doc-service',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    },
    consumer: {
      groupId: process.env.KAFKA_GROUP_ID || 'user-doc-group',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
});

export const KafkaTopics = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_PROCESSED: 'document.processed',
  DOCUMENT_FAILED: 'document.failed',
  INGESTION_TRIGGERED: 'ingestion.triggered',
  INGESTION_COMPLETED: 'ingestion.completed',
  INGESTION_FAILED: 'ingestion.failed',
};

export const KafkaEvents = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_PROCESSED: 'document.processed',
  DOCUMENT_FAILED: 'document.failed',
  INGESTION_TRIGGERED: 'ingestion.triggered',
  INGESTION_COMPLETED: 'ingestion.completed',
  INGESTION_FAILED: 'ingestion.failed',
};
