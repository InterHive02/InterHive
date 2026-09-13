import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get('cloudflare.r2.bucket');
    this.publicUrl = this.configService.get('cloudflare.r2.publicUrl');

    this.s3Client = new S3Client({
      endpoint: this.configService.get('cloudflare.r2.endpoint'),
      region: 'auto',
      credentials: {
        accessKeyId: this.configService.get('cloudflare.r2.accessKeyId'),
        secretAccessKey: this.configService.get('cloudflare.r2.secretAccessKey'),
      },
    });
  }

  async uploadFile(
    file: Buffer | string,
    fileName: string,
    contentType: string,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    try {
      const key = this.generateKey(folder, fileName);
      const buffer = typeof file === 'string' ? Buffer.from(file) : file;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      const url = `${this.publicUrl}/${key}`;
      this.logger.log(`File uploaded: ${key}`);

      return { url, key };
    } catch (error) {
      this.logger.error(`Upload error: ${error.message}`);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async uploadMultipleFiles(
    files: { buffer: Buffer | string; fileName: string; contentType: string }[],
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }[]> {
    const results = [];
    for (const file of files) {
      const result = await this.uploadFile(file.buffer, file.fileName, file.contentType, folder);
      results.push(result);
    }
    return results;
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
      this.logger.log(`File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Delete error: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Presigned URL error: ${error.message}`);
      throw new BadRequestException('Failed to generate presigned URL');
    }
  }

  async getFileUrl(key: string): Promise<string> {
    return `${this.publicUrl}/${key}`;
  }

  private generateKey(folder: string, fileName: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-]/g, '_');
    return `${folder}/${timestamp}-${random}-${sanitizedFileName}`;
  }

  validateFileType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }

  validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }
}