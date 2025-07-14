import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { UserRole } from '@common/enums/user-roles.enum';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            processDocument: jest.fn().mockResolvedValue({ id: '1', title: 'Doc' }),
            getProcessingStatus: jest.fn().mockResolvedValue({ status: 'processed' }),
            getProcessedDocuments: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();
    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process a document', async () => {
    const req = { user: { sub: 'user-id' } };
    const file = { originalname: 'file.txt' };
    const result = await controller.uploadDocument(file as any, req as any);
    expect(result.data).toEqual({ id: '1', title: 'Doc' });
  });
}); 