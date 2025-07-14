import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '@database/entities/document.entity';
import { User } from '@database/entities/user.entity';
import { Repository } from 'typeorm';

describe('IngestionService', () => {
  let service: IngestionService;
  let documentRepo: Repository<Document>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<IngestionService>(IngestionService);
    documentRepo = module.get<Repository<Document>>(getRepositoryToken(Document));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if file not provided', async () => {
    await expect(service.processDocument(undefined as any, 'user-id')).rejects.toThrow();
  });
}); 