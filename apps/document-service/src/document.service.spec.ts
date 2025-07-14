import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '@database/entities/document.entity';
import { User } from '@database/entities/user.entity';
import { Repository } from 'typeorm';

describe('DocumentService', () => {
  let service: DocumentService;
  let documentRepo: Repository<Document>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
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
    service = module.get<DocumentService>(DocumentService);
    documentRepo = module.get<Repository<Document>>(getRepositoryToken(Document));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Example: test createDocument throws if user not found
  it('should throw if user not found when creating document', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    await expect(service.createDocument({ title: 'Doc' }, 'user-id')).rejects.toThrow();
  });
}); 