"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const database_providers_1 = require("./database.providers");
const database_seed_service_1 = require("./database-seed.service");
let memoryServer = null;
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async (configService) => {
                    let uri = configService.get('database.uri');
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
                        }
                        catch (e) {
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
                        w: isMemory ? 1 : 'majority',
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [...database_providers_1.databaseProviders, database_seed_service_1.DatabaseSeedService],
        exports: [...database_providers_1.databaseProviders, database_seed_service_1.DatabaseSeedService],
    })
], DatabaseModule);
