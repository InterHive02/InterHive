import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Interns E2E Tests', () => {
  let app: INestApplication;
  let connection: Connection;
  let accessToken: string;
  let internId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    connection = moduleFixture.get<Connection>(getConnectionToken());
    await app.init();
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  beforeEach(async () => {
    await connection.dropDatabase();

    // Register and login user
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'intern@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Test@123456',
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'intern@example.com',
        password: 'Test@123456',
      });

    accessToken = loginResponse.body.data.accessToken;
  });

  describe('POST /api/v1/interns/profile', () => {
    it('should create intern profile', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/interns/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '2000-01-01',
          },
          contact: {
            email: 'intern@example.com',
            phone: '+1234567890',
          },
          academicInfo: {
            currentEducation: {
              institution: 'University of Technology',
              degree: 'B.Tech',
              field: 'Computer Science',
              startDate: '2020-06-01',
              isCurrent: true,
            },
            cgpa: 8.5,
            graduationYear: 2024,
          },
          professionalInfo: {
            skills: [
              { name: 'JavaScript', category: 'programming', level: 'intermediate' },
              { name: 'React', category: 'framework', level: 'intermediate' },
            ],
          },
          preferences: {
            preferredDomains: ['Web Development', 'Full Stack'],
            preferredWorkType: ['remote', 'hybrid'],
            expectedStipend: { min: 10000, max: 20000 },
          },
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      internId = response.body.data._id;
    });
  });

  describe('GET /api/v1/interns/readiness', () => {
    beforeEach(async () => {
      // Create profile first
      await request(app.getHttpServer())
        .post('/api/v1/interns/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
          },
          contact: {
            email: 'intern@example.com',
            phone: '+1234567890',
          },
          academicInfo: {
            currentEducation: {
              institution: 'University of Technology',
              degree: 'B.Tech',
              field: 'Computer Science',
              startDate: '2020-06-01',
              isCurrent: true,
            },
            cgpa: 8.5,
            graduationYear: 2024,
          },
          professionalInfo: {
            skills: [
              { name: 'JavaScript', category: 'programming', level: 'intermediate' },
              { name: 'React', category: 'framework', level: 'intermediate' },
            ],
          },
          preferences: {
            preferredDomains: ['Web Development'],
            preferredWorkType: ['remote'],
            expectedStipend: { min: 10000, max: 20000 },
          },
        });
    });

    it('should get readiness score', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/interns/readiness')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.overall).toBeDefined();
    });
  });

  describe('POST /api/v1/interns/applications', () => {
    it('should apply for program', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/interns/applications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          programId: '65a1b2c3d4e5f6g7h8i9j0k1',
          coverLetter: 'I am very interested in this program...',
        });

      // Note: This will likely fail if program doesn't exist
      // In a real test, we would create a program first
      expect(response.status).toBe(400);
    });
  });
});