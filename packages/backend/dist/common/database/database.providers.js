"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (connection) => connection,
        inject: [(0, mongoose_1.getConnectionToken)()],
    },
    {
        provide: 'DB_HEALTH_CHECK',
        useFactory: (connection) => ({
            isConnected: () => connection.readyState === 1,
            getStatus: () => ({
                readyState: connection.readyState,
                host: connection.host,
                port: connection.port,
                name: connection.name,
            }),
        }),
        inject: [(0, mongoose_1.getConnectionToken)()],
    },
];
