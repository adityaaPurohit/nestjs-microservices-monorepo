import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as path from 'path';
import * as fs from 'fs';

// Add Express types for Multer
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

export interface UploadedFile {
  path: string;
  size: number;
  mimeType: string;
  originalName: string;
}

export class FileUploadUtil {
  private static uploadDest = process.env.UPLOAD_DEST || './uploads';
  private static maxFileSize = parseInt(
    process.env.MAX_FILE_SIZE || '10485760',
  );
  private static allowedFileTypes = (
    process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,txt'
  ).split(',');

  static getMulterConfig(): MulterOptions {
    this.ensureUploadDirectory();

    return {
      dest: this.uploadDest,
      limits: {
        fileSize: this.maxFileSize,
        files: 1,
      },
      fileFilter: (req, file, callback) => {
        const fileExtension = path
          .extname(file.originalname)
          .toLowerCase()
          .substring(1);

        if (this.allowedFileTypes.includes(fileExtension)) {
          callback(null, true);
        } else {
          callback(
            new Error(`File type ${fileExtension} is not allowed`),
            false,
          );
        }
      },
    };
  }

  private static ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDest)) {
      fs.mkdirSync(this.uploadDest, { recursive: true });
    }
  }

  static async uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    this.ensureUploadDirectory();

    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(this.uploadDest, uniqueFileName);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      path: filePath,
      size: file.size,
      mimeType: file.mimetype,
      originalName: file.originalname,
    };
  }

  static generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    return `${baseName}_${timestamp}_${randomString}${extension}`;
  }

  static getFileUrl(fileName: string): string {
    return `${process.env.API_BASE_URL || 'http://localhost:3000'}/uploads/${fileName}`;
  }

  static validateFileSize(fileSize: number): boolean {
    return fileSize <= this.maxFileSize;
  }

  static getAllowedFileTypes(): string[] {
    return [...this.allowedFileTypes];
  }

  static getMaxFileSize(): number {
    return this.maxFileSize;
  }
}
