"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const database_providers_1 = require("./database.providers");
const bcrypt = __importStar(require("bcryptjs"));
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
                        connectionFactory: (connection) => {
                            connection.on('connected', async () => {
                                console.log('📊 MongoDB connected successfully');
                                try {
                                    const userCollection = connection.collection('users');
                                    const count = await userCollection.countDocuments();
                                    if (count === 0) {
                                        console.log('🌱 Seeding initial dummy accounts...');
                                        const dummyAccounts = [
                                            {
                                                employeeId: 'EMP0001',
                                                firstName: 'Super',
                                                lastName: 'Admin',
                                                email: 'admin@interhive.in',
                                                passwordPlain: 'Admin@123',
                                                role: 'admin',
                                                position: 'System Administrator',
                                                phone: '+91 9876543210',
                                                skills: ['System Administration', 'Security', 'NestJS', 'React'],
                                            },
                                            {
                                                employeeId: 'EMP0002',
                                                firstName: 'Sarah',
                                                lastName: 'HR',
                                                email: 'hr@interhive.in',
                                                passwordPlain: 'Hr@123',
                                                role: 'hr',
                                                position: 'HR Manager',
                                                phone: '+91 9876543211',
                                                skills: ['Talent Acquisition', 'Employee Relations', 'Onboarding'],
                                            },
                                            {
                                                employeeId: 'EMP0003',
                                                firstName: 'Alex',
                                                lastName: 'Manager',
                                                email: 'manager@interhive.in',
                                                passwordPlain: 'Manager@123',
                                                role: 'manager',
                                                position: 'Engineering Manager',
                                                phone: '+91 9876543212',
                                                skills: ['Team Leadership', 'Project Management', 'Agile'],
                                            },
                                            {
                                                employeeId: 'EMP0004',
                                                firstName: 'John',
                                                lastName: 'Intern',
                                                email: 'intern@interhive.in',
                                                passwordPlain: 'Intern@123',
                                                role: 'intern',
                                                position: 'Software Engineering Intern',
                                                phone: '+91 9876543213',
                                                skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB'],
                                            },
                                            {
                                                employeeId: 'EMP0005',
                                                firstName: 'TechCorp',
                                                lastName: 'Representative',
                                                email: 'company@interhive.in',
                                                passwordPlain: 'Company@123',
                                                role: 'company',
                                                position: 'Company Recruiter',
                                                phone: '+91 9876543214',
                                                skills: ['Hiring', 'Corporate Training'],
                                            },
                                        ];
                                        for (const acc of dummyAccounts) {
                                            const salt = await bcrypt.genSalt(10);
                                            const hashedPassword = await bcrypt.hash(acc.passwordPlain, salt);
                                            await userCollection.insertOne({
                                                employeeId: acc.employeeId,
                                                firstName: acc.firstName,
                                                lastName: acc.lastName,
                                                email: acc.email,
                                                password: hashedPassword,
                                                role: acc.role,
                                                position: acc.position,
                                                phone: acc.phone,
                                                skills: acc.skills,
                                                isActive: true,
                                                isVerified: true,
                                                preferences: {
                                                    theme: 'light',
                                                    notifications: { email: true, push: true, sms: false },
                                                },
                                                createdAt: new Date(),
                                                updatedAt: new Date(),
                                            });
                                        }
                                        console.log('✅ Dummy accounts created successfully!');
                                    }
                                }
                                catch (seedErr) {
                                    console.error('⚠️ Auto-seed error:', seedErr.message);
                                }
                            });
                            connection.on('error', (error) => {
                                console.error('❌ MongoDB connection error:', error);
                            });
                            connection.on('disconnected', () => {
                                console.warn('⚠️ MongoDB disconnected');
                            });
                            return connection;
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [...database_providers_1.databaseProviders],
        exports: [...database_providers_1.databaseProviders],
    })
], DatabaseModule);
