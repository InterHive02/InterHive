import { AcademicYear } from '../types/common.types';

export const PROGRAM_TYPES = {
  ONE_YEAR: 'ONE_YEAR',
  TWO_YEAR: 'TWO_YEAR',
  THREE_YEAR: 'THREE_YEAR',
  FOUR_YEAR: 'FOUR_YEAR',
  PPO: 'PPO',
} as const;

export type ProgramTypeKey = typeof PROGRAM_TYPES[keyof typeof PROGRAM_TYPES];

export interface ProgramYearDetails {
  yearLabel: string;
  stageName: string;
  targetFocus: string;
  targetCount: string;
  activities: string[];
}

export interface ProgramConfig {
  id: ProgramTypeKey;
  title: string;
  duration: string;
  targetAcademicYear: string;
  allowedAcademicYears: string[];
  shortDescription: string;
  mainObjective: string;
  summaryFocus: string;
  summaryTarget: string;
  badge: string;
  roadmap: ProgramYearDetails[];
}

export const PROGRAM_CONFIGS: Record<ProgramTypeKey, ProgramConfig> = {
  FOUR_YEAR: {
    id: 'FOUR_YEAR',
    title: '4-Year Program',
    duration: '4 Academic Years',
    targetAcademicYear: '1st Year Students Only (Batch 2030)',
    allowedAcademicYears: ['1st', '1st Year', 'First Year', '2030'],
    shortDescription: 'Exclusively for 1st-year students (Batch 2030). A complete 4-year degree-parallel transformation from engineering foundations to 4 industrial internships and full-time placement.',
    mainObjective: 'Comprehensive 4-year industry readiness for 1st-year entrants, building progressive expertise each year.',
    summaryFocus: 'Foundation + 4 Industrial Internships + Final Placement',
    summaryTarget: '4 Industrial Internships + 1 Paid Corporate Internship',
    badge: '1st Year Only (Batch 2030)',
    roadmap: [
      {
        yearLabel: '1st Year (2026-27)',
        stageName: 'Foundation & Software Engineering Readiness',
        targetFocus: 'Programming Fundamentals & Git Workflows',
        targetCount: 'Company Readiness & Practical Skill Training',
        activities: [
          'Core data structures, algorithms & programming logic',
          'Modern full-stack fundamentals & responsive UI design',
          'Git, GitHub branching, pull requests & code reviews',
          'Clean code principles, linting & basic debugging',
          '1 Hands-on capstone project review with senior engineers',
        ],
      },
      {
        yearLabel: '2nd Year (2027-28)',
        stageName: 'Industrial Training & Early Internships',
        targetFocus: 'Full-Stack Sprints & Backend Microservices',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'RESTful APIs, database design (SQL & NoSQL) & Docker',
          '2 Industrial training & internship opportunities',
          'Live agile sprint ceremonies & ticket management',
          'Industry tech talks & architecture deep dives',
          'Professional portfolio & resume milestone audit',
        ],
      },
      {
        yearLabel: '3rd Year (2028-29)',
        stageName: 'Advanced Corporate Sprints & Cloud',
        targetFocus: 'Cloud Infrastructure & High-Scale Systems',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Container orchestration (Docker, Kubernetes) & AWS/GCP',
          '2 Advanced industrial training & domain internships',
          'System design, caching (Redis), message queues & security',
          'Mock technical interviews & system architecture reviews',
          'Targeted placement track preparation',
        ],
      },
      {
        yearLabel: '4th Year (2029-30)',
        stageName: 'Paid Corporate Internship & Placement Conversion',
        targetFocus: 'Full-Time Corporate Hires & PPO Transition',
        targetCount: '1 High-Quality Paid Internship + Placement Hires',
        activities: [
          '1 High-quality Paid Corporate Internship',
          'Advanced technical coding interviews & HR rounds',
          'Company-specific hiring drives & referrals',
          'Full-time placement & PPO offer finalization',
          'Graduation transition into professional engineering team',
        ],
      },
    ],
  },
  THREE_YEAR: {
    id: 'THREE_YEAR',
    title: '3-Year Program',
    duration: '3 Academic Years',
    targetAcademicYear: '2nd Year Students Only (Batch 2029)',
    allowedAcademicYears: ['2nd', '2nd Year', 'Second Year', '2029'],
    shortDescription: 'Exclusively for 2nd-year students (Batch 2029). Progressively build corporate workflows, advanced full-stack skills, 4 industrial internships, and 4th-year paid placement.',
    mainObjective: 'Progressive corporate development starting in 2nd year, leading to senior paid internships and full-time hiring.',
    summaryFocus: 'Industrial Exposure + 4 Internships + Paid Internship',
    summaryTarget: '4 Industrial Internships (Y2 & Y3) + 1 Paid Internship (Y4)',
    badge: '2nd Year Only (Batch 2029)',
    roadmap: [
      {
        yearLabel: '2nd Year (2026-27)',
        stageName: 'Core Specialization & Industrial Training',
        targetFocus: 'Full-Stack Architectures & Database Systems',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Modern full-stack frameworks (React, Node.js, Python, TypeScript)',
          '2 Industrial training & internship sprints',
          'Git collaboration, pull-request audits & issue tracking',
          'Database optimization, indexing & API design',
          'Mentored live project building',
        ],
      },
      {
        yearLabel: '3rd Year (2027-28)',
        stageName: 'Advanced Domain Internships & System Design',
        targetFocus: 'Cloud Infrastructure, CI/CD & Architecture',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Advanced domain internships & corporate projects',
          'Docker containerization, cloud deployment & CI/CD pipelines',
          'System design fundamentals & algorithmic problem-solving',
          'Resume optimization, GitHub dossier & LinkedIn audit',
          'Placement readiness evaluation',
        ],
      },
      {
        yearLabel: '4th Year (2028-29)',
        stageName: 'Paid Internship & Full-Time Placement',
        targetFocus: 'Corporate Placement & PPO Offers',
        targetCount: '1 High-Quality Paid Corporate Internship',
        activities: [
          '1 High-quality Paid Corporate Internship',
          'Direct hiring drives with partner tech companies',
          'Technical interview rounds, system design & HR mocks',
          'Offer negotiation & full-time placement conversion',
        ],
      },
    ],
  },
  TWO_YEAR: {
    id: 'TWO_YEAR',
    title: '2-Year Program',
    duration: '2 Academic Years',
    targetAcademicYear: '3rd Year Students Only (Batch 2028)',
    allowedAcademicYears: ['3rd', '3rd Year', 'Third Year', '2028'],
    shortDescription: 'Exclusively for 3rd-year students (Batch 2028). Fast-track industrial training and internships in your 3rd year, converting into a 4th-year high-quality paid corporate internship and PPO.',
    mainObjective: 'Intensive 3rd-year corporate skill building converting to 4th-year paid internship and full-time placement.',
    summaryFocus: '3rd-Yr Training/Internships + 4th-Yr Paid Corporate Internship',
    summaryTarget: '2 Training/Internships (3rd Yr) + 1 Paid Corporate Internship (4th Yr)',
    badge: '3rd Year Only (Batch 2028)',
    roadmap: [
      {
        yearLabel: '3rd Year (2026-27)',
        stageName: 'Industrial Training & Production Projects',
        targetFocus: 'Production Workflows, Sprints & Clean Code',
        targetCount: '2 Industry Training / Internship Opportunities',
        activities: [
          'Production-grade full-stack / backend development',
          '2 Industry training & internship opportunities',
          'Real agile sprints, Jira/Linear ticketing & PR reviews',
          'System architecture, REST/GraphQL APIs & database indexing',
          'Technical mentor code audits & skill scorecards',
        ],
      },
      {
        yearLabel: '4th Year (2027-28)',
        stageName: 'Paid Corporate Internship & Placement Conversion',
        targetFocus: 'Paid Internship & Full-Time Corporate Placement',
        targetCount: '1 High-Quality Paid Corporate Internship',
        activities: [
          '1 High-quality Paid Corporate Internship at partner company',
          'Placement drives & direct employer matching',
          'Coding interview preparation (Data Structures, System Design)',
          'Mock interviews with industry tech leads',
          'PPO conversion and offer letter finalization',
        ],
      },
    ],
  },
  ONE_YEAR: {
    id: 'ONE_YEAR',
    title: '1-Year Program',
    duration: '1 Academic Year',
    targetAcademicYear: 'Final Year Students Only (Batch 2027)',
    allowedAcademicYears: ['Final', 'Final Year', '4th Year', '4th', '2027'],
    shortDescription: 'Exclusively for final-year students (Batch 2027). A focused industry-readiness and placement accelerator preparing graduating engineers for internships, interviews, and immediate corporate hiring.',
    mainObjective: 'To make final-year students internship-ready and placement-ready before graduation.',
    summaryFocus: 'Placement Preparation + 1 Quality Internship + Career Hiring',
    summaryTarget: '1 Quality Internship Opportunity + Placement Guidance',
    badge: 'Final Year Only (Batch 2027)',
    roadmap: [
      {
        yearLabel: 'Final Year (2026-27)',
        stageName: 'Fast-Track Placement & Internship Conversion',
        targetFocus: 'Hiring Preparation & Quality Corporate Internship',
        targetCount: '1 Quality Internship + Placement Guidance',
        activities: [
          'Industry-oriented technical training & production sprints',
          '1 Quality Corporate Internship opportunity with stipend',
          'Resume rebuild, GitHub dossier & LinkedIn optimization',
          'Coding interview preparation & system design reviews',
          'Mock technical & HR interviews with senior mentors',
          'Direct matching with partner companies hiring freshers',
        ],
      },
    ],
  },
  PPO: {
    id: 'PPO',
    title: 'PPO Program',
    duration: '8 Months (2 Mo Training + 6 Mo Internship)',
    targetAcademicYear: 'Final Year Students Only (Batch 2027)',
    allowedAcademicYears: ['Final', 'Final Year', '4th Year', '4th', '2027'],
    shortDescription: 'Exclusively for final-year students (Batch 2027). 2 months intensive training & internship at InterHive followed by a 6-month corporate internship at a hiring partner company leading directly to Pre-Placement Offers (PPO).',
    mainObjective: 'Fast-track final-year talent through 2 months of structured InterHive training and 6 months of paid corporate internship at a partner company for full-time PPO conversion.',
    summaryFocus: '2 Mo InterHive Training + 6 Mo Corporate Internship',
    summaryTarget: '2 Mo Training (InterHive) + 6 Mo Internship (Company) -> PPO',
    badge: 'Final Year PPO (Batch 2027)',
    roadmap: [
      {
        yearLabel: 'Month 1–2 (At InterHive)',
        stageName: '2-Month Intensive Industrial Training & Internship at InterHive',
        targetFocus: 'Production Architecture, Agile Sprints & Code Audits',
        targetCount: 'InterHive Production Sprint Certification',
        activities: [
          '2 Months intensive training & internship conducted directly at InterHive',
          'Production codebases, Git branch management, clean architecture & Docker',
          'Daily standup tracking, punch-in logs & agile sprint ceremonies',
          'Weekly 1-on-1 pull-request reviews with senior engineering mentors',
          'Comprehensive technical benchmark scorecard and corporate matching review',
        ],
      },
      {
        yearLabel: 'Month 3–8 (At Partner Company)',
        stageName: '6-Month Corporate Internship at Hiring Partner Company',
        targetFocus: 'Real-World Production Engineering & Full-Time PPO Conversion',
        targetCount: '6-Month Paid Corporate Internship + PPO Evaluation',
        activities: [
          '6 Months paid full-time / hybrid corporate internship at matched partner company',
          'Direct deployment to production engineering teams and client deliverables',
          'Monthly stipend paid directly to the student by the corporate partner',
          'Continuous performance evaluations calibrated via InterHive company rubrics',
          'Formal Pre-Placement Offer (PPO) extension and full-time graduation onboarding',
        ],
      },
    ],
  },
};

export const PROGRAM_ACADEMIC_YEAR_MAP: Record<ProgramTypeKey, AcademicYear[]> = {
  FOUR_YEAR: [AcademicYear.FIRST_YEAR],
  THREE_YEAR: [AcademicYear.SECOND_YEAR],
  TWO_YEAR: [AcademicYear.THIRD_YEAR],
  ONE_YEAR: [AcademicYear.FINAL_YEAR],
  PPO: [AcademicYear.FINAL_YEAR],
};

export const PROGRAM_ELIGIBILITY_MATRIX: Record<string, any> = {
  // Input: Academic Year / String -> Recommended Program
  '1st': 'FOUR_YEAR',
  '1st Year': 'FOUR_YEAR',
  'First Year': 'FOUR_YEAR',
  '2030': 'FOUR_YEAR',
  '2nd': 'THREE_YEAR',
  '2nd Year': 'THREE_YEAR',
  'Second Year': 'THREE_YEAR',
  '2029': 'THREE_YEAR',
  '3rd': 'TWO_YEAR',
  '3rd Year': 'TWO_YEAR',
  'Third Year': 'TWO_YEAR',
  '2028': 'TWO_YEAR',
  'Final': 'ONE_YEAR',
  'Final Year': 'ONE_YEAR',
  '4th': 'ONE_YEAR',
  '4th Year': 'ONE_YEAR',
  '2027': 'ONE_YEAR',
  // Program Key -> Allowed AcademicYears array (for validation in forms)
  FOUR_YEAR: [AcademicYear.FIRST_YEAR],
  THREE_YEAR: [AcademicYear.SECOND_YEAR],
  TWO_YEAR: [AcademicYear.THIRD_YEAR],
  ONE_YEAR: [AcademicYear.FINAL_YEAR],
  PPO: [AcademicYear.FINAL_YEAR],
};

export const PROGRAM_DISCLAIMER =
  'Note: The specified number of internships and training opportunities are structured milestones designed to build verifiable industry readiness, and do not constitute an unconditional guarantee of placement.';

export const ALL_PROGRAM_KEYS: ProgramTypeKey[] = ['FOUR_YEAR', 'THREE_YEAR', 'TWO_YEAR', 'ONE_YEAR', 'PPO'];

export const getProgramConfig = (key?: string): ProgramConfig => {
  if (key && key in PROGRAM_CONFIGS) {
    return PROGRAM_CONFIGS[key as ProgramTypeKey];
  }
  return PROGRAM_CONFIGS.ONE_YEAR;
};

export const isValidProgramType = (key?: string): boolean => {
  return typeof key === 'string' && key in PROGRAM_CONFIGS;
};
