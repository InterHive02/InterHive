import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  uri: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    autoIndex: boolean;
    maxPoolSize: number;
    minPoolSize: number;
    connectTimeoutMS: number;
    socketTimeoutMS: number;
    heartbeatFrequencyMS: number;
    retryWrites: boolean;
    w: string;
  };
  seed: boolean;
  seedPath: string;
  backup: {
    enabled: boolean;
    frequency: string;
    retention: number;
    path: string;
  };
}

export default registerAs('database', (): DatabaseConfig => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/interhive',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority',
  },
  seed: process.env.SEED_DATABASE === 'true',
  seedPath: process.env.SEED_PATH || './src/seeders',
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    frequency: process.env.BACKUP_FREQUENCY || '0 0 * * *', // Daily at midnight
    retention: parseInt(process.env.BACKUP_RETENTION || '30', 10), // 30 days
    path: process.env.BACKUP_PATH || './backups',
  },
}));