import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MatchingService } from '../../src/modules/matching/matching.service';
import { SkillMatcher } from '../../src/modules/matching/algorithms/skill-matcher';
import { ReadinessScorer } from '../../src/modules/matching/algorithms/readiness-scorer';
import { UsersService } from '../../src/modules/users/users.service';
import { InternsService } from '../../src/modules/interns/interns.service';
import { CompaniesService } from '../../src/modules/companies/companies.service';
import { AssessmentsService } from '../../src/modules/assessments/assessments.service';
import { RedisService } from '../../src/common/redis/redis.service';
import { MailService } from '../../src/common/services/mail.service';
import { Match } from '../../src/modules/matching/schemas/match.schema';

describe('MatchingService', () => {
  let service: MatchingService;
  let mockMatchModel: any;
  let mockSkillMatcher: any;
  let mockReadinessScorer: any;
  let mockUsersService: any;
  let mockInternsService: any;

  beforeEach(async () => {
    mockMatchModel = {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      save: jest.fn().mockResolvedValue({}),
      exec: jest.fn().mockResolvedValue([]),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockResolvedValue(0),
    };

    mockSkillMatcher = {
      calculateMatch: jest.fn().mockResolvedValue(80),
      calculateExperienceMatch: jest.fn().mockResolvedValue(75),
      calculatePreferenceMatch: jest.fn().mockResolvedValue(70),
    };

    mockReadinessScorer = {
      calculateReadinessScore: jest.fn().mockReturnValue(75),
    };

    mockUsersService = {
      findById: jest.fn().mockResolvedValue({ data: { role: 'intern' } }),
    };

    mockInternsService = {
      getProfile: jest.fn().mockResolvedValue({
        data: {
          professionalInfo: {
            skills: [{ name: 'JavaScript', level: 'intermediate' }],
            experience: [],
          },
          preferences: {
            preferredDomains: ['Web Development'],
            preferredWorkType: ['remote'],
          },
        },
      }),
      getReadiness: jest.fn().mockResolvedValue({ data: { overall: 70 } }),
      updateStatus: jest.fn().mockResolvedValue({}),
    };

    mockCompaniesService = {
      getRequirements: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'req-id',
            companyId: 'company-id',
            skills: [{ name: 'JavaScript', level: 'intermediate' }],
            experience: { min: 1 },
            workType: 'remote',
            location: 'Remote',
            category: ['Web Development'],
          },
        ],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        {
          provide: getModelToken(Match.name),
          useValue: mockMatchModel,
        },
        {
          provide: SkillMatcher,
          useValue: mockSkillMatcher,
        },
        {
          provide: ReadinessScorer,
          useValue: mockReadinessScorer,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: InternsService,
          useValue: mockInternsService,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
        {
          provide: AssessmentsService,
          useValue: {},
        },
        {
          provide: RedisService,
          useValue: {},
        },
        {
          provide: MailService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  describe('findMatches', () => {
    it('should find matches for intern', async () => {
      const matchRequestDto = {
        minScore: 50,
      };

      mockUsersService.findById.mockResolvedValue({ data: { role: 'intern' } });
      mockMatchModel.save.mockResolvedValue({ _id: 'match-id', matchScore: 75 });

      const result = await service.findMatches('intern-id', matchRequestDto);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockSkillMatcher.calculateMatch).toHaveBeenCalled();
    });
  });

  describe('calculateMatchScore', () => {
    it('should calculate match score correctly', async () => {
      const intern = {
        professionalInfo: {
          skills: [{ name: 'JavaScript', level: 'intermediate' }],
          experience: [],
        },
        preferences: {
          preferredDomains: ['Web Development'],
          preferredWorkType: ['remote'],
        },
        userId: 'user-id',
      };

      const requirement = {
        skills: [{ name: 'JavaScript', level: 'intermediate' }],
        experience: { min: 1 },
        workType: 'remote',
        category: ['Web Development'],
      };

      const score = await service['calculateMatchScore'](intern, requirement);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('acceptMatch', () => {
    it('should accept match successfully', async () => {
      const mockMatch = {
        _id: 'match-id',
        internId: 'intern-id',
        companyId: 'company-id',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true),
      };

      mockMatchModel.findById.mockResolvedValue(mockMatch);

      const result = await service.acceptMatch('intern-id', 'match-id');

      expect(result.success).toBe(true);
      expect(mockMatch.status).toBe('accepted');
    });

    it('should throw forbidden for unauthorized user', async () => {
      const mockMatch = {
        _id: 'match-id',
        internId: 'other-intern-id',
        companyId: 'company-id',
        status: 'pending',
        save: jest.fn(),
      };

      mockMatchModel.findById.mockResolvedValue(mockMatch);

      await expect(service.acceptMatch('intern-id', 'match-id')).rejects.toThrow(
        'You are not authorized to accept this match',
      );
    });

    it('should throw bad request for non-pending match', async () => {
      const mockMatch = {
        _id: 'match-id',
        internId: 'intern-id',
        companyId: 'company-id',
        status: 'accepted',
        save: jest.fn(),
      };

      mockMatchModel.findById.mockResolvedValue(mockMatch);

      await expect(service.acceptMatch('intern-id', 'match-id')).rejects.toThrow(
        'Match is not in pending status',
      );
    });
  });
});