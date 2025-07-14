import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/enums/user-roles.enum';
import { ResponseMessages } from '@common/constants/response-messages';
import { PaginationOptions } from '@common/interfaces/pagination.interface';
import { CreateDocumentDto, UpdateDocumentDto } from '@common/dto/document.dto';
import { DocumentStatus } from '@common/enums/document-status.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Document')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new document',
    description: 'Create a new document entry (Editor/Admin only)'
  })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Document created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Document created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            title: { type: 'string', example: 'Sample Document' },
            description: { type: 'string', example: 'This is a sample document' },
            status: { type: 'string', example: 'PENDING' },
            uploadedBy: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Editor/Admin access required' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error' 
  })
  @Roles(UserRole.EDITOR, UserRole.ADMIN)
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req,
  ) {
    const document = await this.documentService.createDocument(
      createDocumentDto,
      req.user.sub,
    );
    return {
      message: ResponseMessages.DOCUMENT_CREATED,
      data: document,
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all documents',
    description: 'Retrieve paginated list of all documents'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Items per page (default: 10)',
    example: 10
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of documents retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                  title: { type: 'string', example: 'Sample Document' },
                  description: { type: 'string', example: 'This is a sample document' },
                  status: { type: 'string', example: 'PENDING' },
                  filePath: { type: 'string', example: '/uploads/document.pdf' },
                  fileSize: { type: 'number', example: 1024000 },
                  mimeType: { type: 'string', example: 'application/pdf' },
                  uploadedBy: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                  createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
                }
              }
            },
            total: { type: 'number', example: 25 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 3 }
          }
        }
      }
    }
  })
  async getAllDocuments(@Query() query: PaginationOptions) {
    const result = await this.documentService.findAll(query);
    return {
      message: ResponseMessages.SUCCESS,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get document by ID',
    description: 'Retrieve detailed information about a specific document'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Document ID (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Document details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            title: { type: 'string', example: 'Sample Document' },
            description: { type: 'string', example: 'This is a sample document' },
            status: { type: 'string', example: 'PENDING' },
            filePath: { type: 'string', example: '/uploads/document.pdf' },
            fileSize: { type: 'number', example: 1024000 },
            mimeType: { type: 'string', example: 'application/pdf' },
            uploadedBy: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found' 
  })
  async getDocumentById(@Param('id') id: string) {
    const document = await this.documentService.findById(id);
    return {
      message: ResponseMessages.SUCCESS,
      data: document,
    };
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update document',
    description: 'Update document information (Editor/Admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Document ID (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Document updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Document updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            title: { type: 'string', example: 'Updated Document Title' },
            description: { type: 'string', example: 'Updated document description' },
            status: { type: 'string', example: 'PROCESSED' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Editor/Admin access required' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error' 
  })
  @Roles(UserRole.EDITOR, UserRole.ADMIN)
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const document = await this.documentService.updateDocument(
      id,
      updateDocumentDto,
    );
    return {
      message: ResponseMessages.DOCUMENT_UPDATED,
      data: document,
    };
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete document',
    description: 'Permanently delete a document (Editor/Admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Document ID (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Document deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Document deleted successfully' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Editor/Admin access required' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found' 
  })
  @Roles(UserRole.EDITOR, UserRole.ADMIN)
  async deleteDocument(@Param('id') id: string) {
    await this.documentService.deleteDocument(id);
    return {
      message: ResponseMessages.DOCUMENT_DELETED,
    };
  }

  @Post(':id/upload')
  @ApiOperation({ 
    summary: 'Upload document file',
    description: 'Upload a file for an existing document (Editor/Admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Document ID (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file to upload (PDF, DOC, DOCX, TXT, etc.)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Document uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Document uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            title: { type: 'string', example: 'Sample Document' },
            filePath: { type: 'string', example: '/uploads/document.pdf' },
            fileSize: { type: 'number', example: 1024000 },
            mimeType: { type: 'string', example: 'application/pdf' },
            status: { type: 'string', example: 'PENDING' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Editor/Admin access required' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid file format or size' 
  })
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.EDITOR, UserRole.ADMIN)
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const document = await this.documentService.uploadDocument(id, file);
    return {
      message: ResponseMessages.DOCUMENT_UPLOADED,
      data: document,
    };
  }
}
