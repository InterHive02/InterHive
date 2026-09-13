"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = __importDefault(require("bull"));
const Bull = bull_1.default.default || bull_1.default;
const event_emitter_1 = require("@nestjs/event-emitter");
let QueueService = QueueService_1 = class QueueService {
    constructor(configService, eventEmitter) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(QueueService_1.name);
        this.queues = new Map();
        this.defaultOptions = {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            timeout: 30000,
            removeOnComplete: true,
            removeOnFail: false,
        };
        this.loggedQueueErrors = new Set();
    }
    async onModuleInit() {
        await this.initializeQueues();
    }
    async initializeQueues() {
        const redisConfig = {
            host: this.configService.get('redis.host', 'localhost'),
            port: this.configService.get('redis.port', 6379),
            password: this.configService.get('redis.password'),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy: (times) => Math.min(times * 1000, 15000),
        };
        const queueNames = [
            'email',
            'notification',
            'assessment',
            'matching',
            'analytics',
            'report',
            'backup',
            'sync',
        ];
        for (const name of queueNames) {
            const queue = new Bull(name, {
                redis: redisConfig,
                defaultJobOptions: this.defaultOptions,
                settings: {
                    stalledInterval: 30000,
                    maxStalledCount: 3,
                    guardInterval: 5000,
                    retryProcessDelay: 5000,
                },
            });
            this.setupQueueListeners(queue, name);
            this.queues.set(name, queue);
            this.logger.log(`Queue initialized: ${name}`);
        }
    }
    async onModuleDestroy() {
        for (const [name, queue] of this.queues) {
            await queue.close();
            this.logger.log(`Queue closed: ${name}`);
        }
    }
    setupQueueListeners(queue, name) {
        queue.on('error', (error) => {
            const errMsg = error?.message || 'Connection error / Redis offline';
            if (!this.loggedQueueErrors.has(name)) {
                this.logger.warn(`Queue ${name} warning: ${errMsg} (Background task processing paused until Redis is connected)`);
                this.loggedQueueErrors.add(name);
            }
        });
        queue.on('waiting', (jobId) => {
            this.logger.debug(`Job ${jobId} waiting in queue ${name}`);
        });
        queue.on('active', (job) => {
            this.logger.debug(`Job ${job.id} active in queue ${name}`);
        });
        queue.on('stalled', (job) => {
            this.logger.warn(`Job ${job.id} stalled in queue ${name}`);
        });
        queue.on('progress', (job, progress) => {
            this.logger.debug(`Job ${job.id} progress: ${progress}%`);
        });
        queue.on('completed', (job, result) => {
            this.logger.log(`Job ${job.id} completed in queue ${name}`);
            this.eventEmitter.emit('queue.completed', { queue: name, job, result });
        });
        queue.on('failed', (job, error) => {
            this.logger.error(`Job ${job.id} failed in queue ${name}: ${error?.message || error}`);
            this.eventEmitter.emit('queue.failed', { queue: name, job, error });
        });
    }
    async addJob(queueName, jobName, data, options) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        const job = await queue.add(jobName, data, {
            ...this.defaultOptions,
            ...options,
        });
        this.logger.debug(`Job ${job.id} added to queue ${queueName}`);
        return job;
    }
    async addBulkJobs(queueName, jobs) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        const results = await queue.addBulk(jobs.map(job => ({
            name: job.name,
            data: job.data,
            opts: {
                ...this.defaultOptions,
                ...job.options,
            },
        })));
        this.logger.debug(`${results.length} jobs added to queue ${queueName}`);
        return results;
    }
    async getJob(queueName, jobId) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        return await queue.getJob(jobId);
    }
    async removeJob(queueName, jobId) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        const job = await queue.getJob(jobId);
        if (job) {
            await job.remove();
            this.logger.debug(`Job ${jobId} removed from queue ${queueName}`);
        }
    }
    async pauseQueue(queueName) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        await queue.pause();
        this.logger.log(`Queue ${queueName} paused`);
    }
    async resumeQueue(queueName) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        await queue.resume();
        this.logger.log(`Queue ${queueName} resumed`);
    }
    async getQueueMetrics(queueName) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        const [waiting, active, completed, failed, delayed, paused,] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
            queue.isPaused(),
        ]);
        return {
            name: queueName,
            waiting,
            active,
            completed,
            failed,
            delayed,
            paused,
            total: waiting + active + completed + failed + delayed,
        };
    }
    async getAllQueueMetrics() {
        const metrics = [];
        for (const [name] of this.queues) {
            metrics.push(await this.getQueueMetrics(name));
        }
        return metrics;
    }
    async cleanQueue(queueName, grace, limit) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        await queue.clean(grace || 86400000, limit || 1000);
        this.logger.log(`Queue ${queueName} cleaned`);
    }
    registerProcessor(queueName, processor) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        queue.process(processor);
        this.logger.log(`Processor registered for queue ${queueName}`);
    }
    registerProcessors(processors) {
        for (const [queueName, processor] of Object.entries(processors)) {
            this.registerProcessor(queueName, processor);
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        event_emitter_1.EventEmitter2])
], QueueService);
