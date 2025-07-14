import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { UserRole } from '@common/enums/user-roles.enum';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: {
            createDocument: jest.fn().mockResolvedValue({ id: '1', title: 'Doc' }),
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();
    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a document', async () => {
    const req = { user: { sub: 'user-id' } };
    const dto = { title: 'Doc' };
    const result = await controller.createDocument(dto as any, req as any);
    expect(result.data).toEqual({ id: '1', title: 'Doc' });
  });
}); 