import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import * as bcrypt from 'bcryptjs';

import { DatabaseSeedService } from './database-seed.service';

let memoryServer: any = null;

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        let uri = configService.get<string>('database.uri');

        const isMemory = process.env.USE_MEMORY_DB === 'true' || !uri;
        if (isMemory) {
          try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            if (!memoryServer) {
              console.log('⏳ Starting In-Memory MongoDB Server...');
              memoryServer = await MongoMemoryServer.create();
            }
            uri = memoryServer.getUri();
            console.log('🧠 In-Memory MongoDB Server active at:', uri);
          } catch (e) {
            console.error('⚠️ Could not start MongoMemoryServer:', e.message);
          }
        }

        return {
          uri,
          autoIndex: true,
          maxPoolSize: 10,
          minPoolSize: 2,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          heartbeatFrequencyMS: 10000,
          retryWrites: !isMemory,
          w: isMemory ? 1 : ('majority' as any),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...databaseProviders, DatabaseSeedService],
  exports: [...databaseProviders, DatabaseSeedService],
})
export class DatabaseModule {}