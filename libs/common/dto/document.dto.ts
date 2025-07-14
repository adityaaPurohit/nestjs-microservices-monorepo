import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Sample Document',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Document description (optional)',
    example: 'This is a sample document for testing',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Document title (optional)',
    example: 'Updated Document Title',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Document description (optional)',
    example: 'Updated document description',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Document status (optional)',
    example: 'PROCESSED',
    type: String,
    required: false,
    enum: ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'],
  })
  @IsOptional()
  @IsString()
  status?: string;
}

export class DocumentUploadDto {
  @ApiProperty({
    description: 'Document ID for file upload',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsString()
  documentId: string;

  @ApiProperty({
    description: 'File size in bytes (optional)',
    example: 1024000,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiProperty({
    description: 'File MIME type (optional)',
    example: 'application/pdf',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  mimeType?: string;
}
