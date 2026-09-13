import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Matching E2E Tests', () => {
  let app: INestApplication;
  let connection: Connection;
  let internAccessToken: string;
  let companyAccessToken: string;

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

    // Create intern
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'intern@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Test@123456',
        role: 'intern',
      });

    const internLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'intern@example.com',
        password: 'Test@123456',
      });
    internAccessToken = internLogin.body.data.accessToken;

    // Create intern profile
    await request(app.getHttpServer())
      .post('/api/v1/interns/profile')
      .set('Authorization', `Bearer ${internAccessToken}`)
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

    // Create company user
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'company@example.com',
        firstName: 'Company',
        lastName: 'Admin',
        password: 'Test@123456',
        role: 'company',
      });

    const companyLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'company@example.com',
        password: 'Test@123456',
      });
    companyAccessToken = companyLogin.body.data.accessToken;

    // Create company profile
    await request(app.getHttpServer())
      .post('/api/v1/companies')
      .set('Authorization', `Bearer ${companyAccessToken}`)
      .send({
        companyInfo: {
          name: 'Tech Corp',
          legalName: 'Tech Corporation Pvt Ltd',
          registrationNumber: 'TC123456',
          industry: ['Technology', 'Software'],
          description: 'Leading technology company',
        },
        contact: {
          primaryContact: {
            email: 'hr@techcorp.com',
            phone: '+1234567890',
          },
        },
      });

    // Create requirement
    await request(app.getHttpServer())
      .post(`/api/v1/companies/${companyLogin.body.data.user.id}/requirements`)
      .set('Authorization', `Bearer ${companyAccessToken}`)
      .send({
        position: 'Frontend Developer',
        count: 2,
        skills: [
          { id: 'javascript', name: 'JavaScript', category: 'programming', level: 'intermediate' },
          { id: 'react', name: 'React', category: 'framework', level: 'intermediate' },
        ],
        stipend: {
          min: 15000,
          max: 25000,
          currency: 'INR',
          period: 'monthly',
        },
        workType: 'remote',
        duration: {
          min: 3,
          max: 6,
        },
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'published',
      });
  });

  describe('POST /api/v1/matching/find-matches', () => {
    it('should find matches for intern', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/matching/find-matches')
        .set('Authorization', `Bearer ${internAccessToken}`)
        .send({
          minScore: 50,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/matching/my-matches', () => {
    it('should get intern matches', async () => {
      // First, find matches
      await request(app.getHttpServer())
        .post('/api/v1/matching/find-matches')
        .set('Authorization', `Bearer ${internAccessToken}`)
        .send({
          minScore: 50,
        });

      const response = await request(app.getHttpServer())
        .get('/api/v1/matching/my-matches')
        .set('Authorization', `Bearer ${internAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });
});