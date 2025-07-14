import {
    Controller,
    Post,
    Get,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/enums/user-roles.enum';
import { ResponseMessages } from '@common/constants/response-messages';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Ingestion')
@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
    constructor(private ingestionService: IngestionService) { }

    @Post('upload')
    @ApiOperation({ summary: 'Upload and process document' })
    @ApiResponse({ status: 201, description: 'Document processed successfully' })
    @UseInterceptors(FileInterceptor('file'))
    @Roles(UserRole.EDITOR, UserRole.ADMIN)
    async uploadDocument(@UploadedFile() file: Express.Multer.File, @Req() req) {
        const result = await this.ingestionService.processDocument(
            file,
            req.user.sub,
        );
        return {
            message: ResponseMessages.DOCUMENT_PROCESSED,
            data: result,
        };
    }

    @Get('status/:id')
    @ApiOperation({ summary: 'Get processing status' })
    @ApiResponse({ status: 200, description: 'Processing status' })
    async getProcessingStatus(@Param('id') id: string) {
        const status = await this.ingestionService.getProcessingStatus(id);
        return {
            message: ResponseMessages.SUCCESS,
            data: status,
        };
    }

    @Get('documents')
    @ApiOperation({ summary: 'Get processed documents' })
    @ApiResponse({ status: 200, description: 'Processed documents' })
    async getProcessedDocuments(@Req() req) {
        const documents = await this.ingestionService.getProcessedDocuments(
            req.user.sub,
        );
        return {
            message: ResponseMessages.SUCCESS,
            data: documents,
        };
    }
}
