import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import * as bcrypt from 'bcryptjs';

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
          connectionFactory: (connection) => {
            connection.on('connected', async () => {
              console.log('📊 MongoDB connected successfully');

              // Auto-seed dummy accounts if database is empty
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
              } catch (seedErr) {
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
      inject: [ConfigService],
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}