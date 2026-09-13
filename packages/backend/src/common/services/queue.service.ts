import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BullQueue, { Queue, Job, JobOptions } from 'bull';
const Bull: any = (BullQueue as any).default || BullQueue;
import { EventEmitter2 } from '@nestjs/event-emitter';

interface QueueJob {
  id: string;
  name: string;
  data: any;
  options?: JobOptions;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private queues: Map<string, Queue> = new Map();
  private readonly defaultOptions: JobOptions = {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    timeout: 30000,
    removeOnComplete: true,
    removeOnFail: false,
  };

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    await this.initializeQueues();
  }

  private loggedQueueErrors: Set<string> = new Set();

  private async initializeQueues() {
    const redisConfig = {
      host: this.configService.get('redis.host', 'localhost'),
      port: this.configService.get('redis.port', 6379),
      password: this.configService.get('redis.password'),
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times: number) => Math.min(times * 1000, 15000),
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

  private setupQueueListeners(queue: Queue, name: string) {
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

  async addJob(queueName: string, jobName: string, data: any, options?: JobOptions): Promise<Job> {
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

  async addBulkJobs(queueName: string, jobs: QueueJob[]): Promise<Job[]> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const results = await queue.addBulk(
      jobs.map(job => ({
        name: job.name,
        data: job.data,
        opts: {
          ...this.defaultOptions,
          ...job.options,
        },
      })),
    );

    this.logger.debug(`${results.length} jobs added to queue ${queueName}`);
    return results;
  }

  async getJob(queueName: string, jobId: string): Promise<Job> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return await queue.getJob(jobId);
  }

  async removeJob(queueName: string, jobId: string): Promise<void> {
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

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.pause();
    this.logger.log(`Queue ${queueName} paused`);
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.resume();
    this.logger.log(`Queue ${queueName} resumed`);
  }

  async getQueueMetrics(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused,
    ] = await Promise.all([
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

  async cleanQueue(queueName: string, grace?: number, limit?: number): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await (queue as any).clean(grace || 86400000, limit || 1000);
    this.logger.log(`Queue ${queueName} cleaned`);
  }

  // Process registration
  registerProcessor(queueName: string, processor: (job: Job) => Promise<any>): void {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    queue.process(processor);
    this.logger.log(`Processor registered for queue ${queueName}`);
  }

  // Register multiple processors
  registerProcessors(processors: Record<string, (job: Job) => Promise<any>>): void {
    for (const [queueName, processor] of Object.entries(processors)) {
      this.registerProcessor(queueName, processor);
    }
  }
}