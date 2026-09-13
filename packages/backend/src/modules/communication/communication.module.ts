import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatGateway } from './gateways/chat.gateway';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    UsersModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService, ChatGateway],
  exports: [CommunicationService, ChatGateway],
})
export class CommunicationModule {}