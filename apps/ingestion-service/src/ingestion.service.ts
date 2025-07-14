import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '@database/entities/document.entity';
import { User } from '@database/entities/user.entity';
import { ResponseMessages } from '@common/constants/response-messages';
import { DocumentStatus } from '@common/enums/document-status.enum';
import { FileUploadUtil } from '@common/utils/file-upload.util';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async processDocument(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new ConflictException('No file provided');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ResponseMessages.NOT_FOUND);
    }

    // Upload file
    const uploadedFile = await FileUploadUtil.uploadFile(file);

    // Create document record
    const document = this.documentRepository.create({
      title: file.originalname,
      filePath: uploadedFile.path,
      fileSize: uploadedFile.size,
      mimeType: uploadedFile.mimeType,
      status: DocumentStatus.PROCESSING,
      uploadedBy: user,
    });

    const savedDocument = await this.documentRepository.save(document);

    setTimeout(async () => {
      await this.documentRepository.update(savedDocument.id, {
        status: DocumentStatus.PROCESSED,
      });
    }, 5000);

    return {
      id: savedDocument.id,
      title: savedDocument.title,
      status: savedDocument.status,
      message: 'Document uploaded and processing started',
    };
  }

  async getProcessingStatus(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });

    if (!document) {
      throw new NotFoundException(ResponseMessages.NOT_FOUND);
    }

    return {
      id: document.id,
      title: document.title,
      status: document.status,
      uploadedAt: document.createdAt,
      processedAt: document.updatedAt,
    };
  }

  async getProcessedDocuments(userId: string) {
    const documents = await this.documentRepository.find({
      where: {
        uploadedBy: { id: userId },
        status: DocumentStatus.PROCESSED,
      },
      relations: ['uploadedBy'],
      order: { createdAt: 'DESC' },
    });

    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      status: doc.status,
      fileSize: doc.fileSize,
      uploadedAt: doc.createdAt,
      processedAt: doc.updatedAt,
    }));
  }
}
