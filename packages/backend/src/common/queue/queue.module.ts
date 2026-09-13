import { Module, Global } from '@nestjs/common';
import { QueueService } from '../services/queue.service';

@Global()
@Module({
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
