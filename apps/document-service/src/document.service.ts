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
import { PaginationUtil } from '@common/utils/pagination.util';
import { PaginationOptions } from '@common/interfaces/pagination.interface';
import { CreateDocumentDto, UpdateDocumentDto } from '@common/dto/document.dto';
import { DocumentStatus } from '@common/enums/document-status.enum';
import { FileUploadUtil } from '@common/utils/file-upload.util';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createDocument(
        createDocumentDto: CreateDocumentDto,
        userId: string,
    ): Promise<Document> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(ResponseMessages.NOT_FOUND);
        }

        const document = this.documentRepository.create({
            ...createDocumentDto,
            uploadedBy: user,
            status: DocumentStatus.PENDING,
        });

        return this.documentRepository.save(document);
    }

    async findById(id: string): Promise<Document> {
        const document = await this.documentRepository.findOne({
            where: { id },
            relations: ['uploadedBy'],
        });

        if (!document) {
            throw new NotFoundException(ResponseMessages.NOT_FOUND);
        }

        return document;
    }

    async findAll(options: PaginationOptions = {}) {
        const normalizedOptions = PaginationUtil.validateAndNormalize(options);
        const skip = PaginationUtil.getSkipValue(
            normalizedOptions.page,
            normalizedOptions.limit,
        );
        const take = PaginationUtil.getTakeValue(normalizedOptions.limit);

        const [documents, total] = await this.documentRepository.findAndCount({
            skip,
            take,
            relations: ['uploadedBy'],
            order: {
                [normalizedOptions.sortBy]: normalizedOptions.sortOrder,
            },
        });

        return PaginationUtil.createPaginationResponse(
            documents,
            total,
            normalizedOptions,
        );
    }

    async updateDocument(
        id: string,
        updateDocumentDto: UpdateDocumentDto,
    ): Promise<Document> {
        const document = await this.findById(id);
        Object.assign(document, updateDocumentDto);
        return this.documentRepository.save(document);
    }

    async deleteDocument(id: string): Promise<void> {
        const document = await this.findById(id);
        await this.documentRepository.remove(document);
    }

    async uploadDocument(
        id: string,
        file: Express.Multer.File,
    ): Promise<Document> {
        const document = await this.findById(id);

        if (!file) {
            throw new ConflictException('No file provided');
        }

        const uploadedFile = await FileUploadUtil.uploadFile(file);

        document.filePath = uploadedFile.path;
        document.fileSize = uploadedFile.size;
        document.mimeType = uploadedFile.mimeType;
        document.status = DocumentStatus.UPLOADED;

        return this.documentRepository.save(document);
    }

    async getDocumentsByUser(userId: string, options: PaginationOptions = {}) {
        const normalizedOptions = PaginationUtil.validateAndNormalize(options);
        const skip = PaginationUtil.getSkipValue(
            normalizedOptions.page,
            normalizedOptions.limit,
        );
        const take = PaginationUtil.getTakeValue(normalizedOptions.limit);

        const [documents, total] = await this.documentRepository.findAndCount({
            where: { uploadedBy: { id: userId } },
            skip,
            take,
            relations: ['uploadedBy'],
            order: {
                [normalizedOptions.sortBy]: normalizedOptions.sortOrder,
            },
        });

        return PaginationUtil.createPaginationResponse(
            documents,
            total,
            normalizedOptions,
        );
    }

    async getDocumentsByStatus(status: DocumentStatus, options: PaginationOptions = {}) {
        const normalizedOptions = PaginationUtil.validateAndNormalize(options);
        const skip = PaginationUtil.getSkipValue(
            normalizedOptions.page,
            normalizedOptions.limit,
        );
        const take = PaginationUtil.getTakeValue(normalizedOptions.limit);

        const [documents, total] = await this.documentRepository.findAndCount({
            where: { status },
            skip,
            take,
            relations: ['uploadedBy'],
            order: {
                [normalizedOptions.sortBy]: normalizedOptions.sortOrder,
            },
        });

        return PaginationUtil.createPaginationResponse(
            documents,
            total,
            normalizedOptions,
        );
    }
}
