import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (connection: Connection) => connection,
    inject: [getConnectionToken()],
  },
  {
    provide: 'DB_HEALTH_CHECK',
    useFactory: (connection: Connection) => ({
      isConnected: () => connection.readyState === 1,
      getStatus: () => ({
        readyState: connection.readyState,
        host: connection.host,
        port: connection.port,
        name: connection.name,
      }),
    }),
    inject: [getConnectionToken()],
  },
];