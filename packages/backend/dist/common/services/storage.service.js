"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto = __importStar(require("crypto"));
let StorageService = StorageService_1 = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.bucket = this.configService.get('cloudflare.r2.bucket');
        this.publicUrl = this.configService.get('cloudflare.r2.publicUrl');
        this.s3Client = new client_s3_1.S3Client({
            endpoint: this.configService.get('cloudflare.r2.endpoint'),
            region: 'auto',
            credentials: {
                accessKeyId: this.configService.get('cloudflare.r2.accessKeyId'),
                secretAccessKey: this.configService.get('cloudflare.r2.secretAccessKey'),
            },
        });
    }
    async uploadFile(file, fileName, contentType, folder = 'uploads') {
        try {
            const key = this.generateKey(folder, fileName);
            const buffer = typeof file === 'string' ? Buffer.from(file) : file;
            const command = new client_s3_1.PutObjectCommand({
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
        }
        catch (error) {
            this.logger.error(`Upload error: ${error.message}`);
            throw new common_1.BadRequestException('Failed to upload file');
        }
    }
    async uploadMultipleFiles(files, folder = 'uploads') {
        const results = [];
        for (const file of files) {
            const result = await this.uploadFile(file.buffer, file.fileName, file.contentType, folder);
            results.push(result);
        }
        return results;
    }
    async deleteFile(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.s3Client.send(command);
            this.logger.log(`File deleted: ${key}`);
        }
        catch (error) {
            this.logger.error(`Delete error: ${error.message}`);
            throw new common_1.BadRequestException('Failed to delete file');
        }
    }
    async getPresignedUrl(key, expiresIn = 3600) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        }
        catch (error) {
            this.logger.error(`Presigned URL error: ${error.message}`);
            throw new common_1.BadRequestException('Failed to generate presigned URL');
        }
    }
    async getFileUrl(key) {
        return `${this.publicUrl}/${key}`;
    }
    generateKey(folder, fileName) {
        const timestamp = Date.now();
        const random = crypto.randomBytes(8).toString('hex');
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-]/g, '_');
        return `${folder}/${timestamp}-${random}-${sanitizedFileName}`;
    }
    validateFileType(mimeType, allowedTypes) {
        return allowedTypes.includes(mimeType);
    }
    validateFileSize(size, maxSize) {
        return size <= maxSize;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
