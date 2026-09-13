"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
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
        frequency: process.env.BACKUP_FREQUENCY || '0 0 * * *',
        retention: parseInt(process.env.BACKUP_RETENTION || '30', 10),
        path: process.env.BACKUP_PATH || './backups',
    },
}));
