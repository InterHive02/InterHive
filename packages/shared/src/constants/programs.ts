export const PROGRAM_TYPES = {
  ONE_YEAR: 'ONE_YEAR',
  TWO_YEAR: 'TWO_YEAR',
  THREE_YEAR: 'THREE_YEAR',
  FOUR_YEAR: 'FOUR_YEAR',
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
  ONE_YEAR: {
    id: 'ONE_YEAR',
    title: '1-Year Program',
    duration: '1 Academic Year',
    targetAcademicYear: 'Final Year',
    allowedAcademicYears: ['Final', '4th', 'Final Year', '4th Year'],
    shortDescription: 'A focused industry-readiness program for final-year students preparing for internships, placements and careers.',
    mainObjective: 'To make final-year students internship and placement ready.',
    summaryFocus: 'Internship + Placement Readiness',
    summaryTarget: '1 Quality Internship + Placement Guidance',
    badge: 'Final Year Focus',
    roadmap: [
      {
        yearLabel: 'Final Year',
        stageName: 'Placement & Internship Conversion',
        targetFocus: 'Industry-Oriented Training & Hiring Readiness',
        targetCount: '1 Quality Internship + Placement Preparation',
        activities: [
          'Industry-oriented technical training',
          'Company readiness preparation',
          'Placement-focused guidance',
          'Internship preparation & matching',
          '1 Quality Internship opportunity',
          'Resume & LinkedIn optimization',
          'Coding & technical interview preparation',
          'HR interview preparation',
          'Placement & hiring guidance',
        ],
      },
    ],
  },
  TWO_YEAR: {
    id: 'TWO_YEAR',
    title: '2-Year Program',
    duration: '2 Academic Years',
    targetAcademicYear: 'Third Year',
    allowedAcademicYears: ['3rd', '3rd Year', 'Third Year', 'Final', '4th', 'Final Year'],
    shortDescription: 'Start in your third year and build industry experience through training, internships and final-year placement preparation.',
    mainObjective: 'Progressive technical mastery and paid internship conversion.',
    summaryFocus: 'Industry Training + Internships + Paid Internship',
    summaryTarget: '2 Training/Internships (3rd Yr) + 1 Paid Internship (4th Yr)',
    badge: '3rd / Final Year',
    roadmap: [
      {
        yearLabel: 'Third Year',
        stageName: 'Industrial Training & Experience',
        targetFocus: 'Practical Skills & Industrial Exposure',
        targetCount: '2 Industry Training / Internship Opportunities',
        activities: [
          'Industrial training sprints',
          'Internship opportunities',
          'Practical & industry-grade projects',
          'Company workflow exposure',
          'Technical & professional skill development',
          'Internship guidance & mentor support',
        ],
      },
      {
        yearLabel: 'Final Year',
        stageName: 'Paid Internship & Hiring Conversion',
        targetFocus: 'Placement Preparation & Corporate Hires',
        targetCount: '1 High-Quality Paid Internship',
        activities: [
          'Advanced industry preparation',
          'Placement preparation',
          '1 High-quality Paid Internship',
          'Advanced technical & coding preparation',
          'Resume & LinkedIn optimization',
          'Mock interviews & HR preparation',
          'Hiring guidance & company referrals',
        ],
      },
    ],
  },
  THREE_YEAR: {
    id: 'THREE_YEAR',
    title: '3-Year Program',
    duration: '3 Academic Years',
    targetAcademicYear: 'Second Year',
    allowedAcademicYears: ['2nd', '2nd Year', 'Second Year', '3rd', '3rd Year', 'Final', 'Final Year'],
    shortDescription: 'Start from second year and progressively build industry exposure, practical skills, internships and placement readiness.',
    mainObjective: 'Early corporate exposure leading up to senior paid internships.',
    summaryFocus: 'Early Industry Exposure + Internships + Paid Internship',
    summaryTarget: '4 Industrial Internships (Y2 & Y3) + 1 Paid Internship (Y4)',
    badge: '2nd Year Onwards',
    roadmap: [
      {
        yearLabel: 'Second Year',
        stageName: 'Early Industry Exposure & Fundamentals',
        targetFocus: 'Basic Corporate Workflows & Skill Building',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Industrial training',
          'Internship opportunities',
          'Industrial visits & corporate tours',
          'Industry exposure & company workflow understanding',
          'Technical skill development & project building',
          'Professional communication',
        ],
      },
      {
        yearLabel: 'Third Year',
        stageName: 'Advanced Industrial Training & Sprints',
        targetFocus: 'Full-Stack Development & Real Projects',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Advanced industrial training',
          'Internships in tech domains',
          'Industrial visits & mentor sessions',
          'Industry projects',
          'Technical & professional skill advancement',
          'Placement-oriented preparation',
        ],
      },
      {
        yearLabel: 'Final Year',
        stageName: 'Paid Internship & Career Placement',
        targetFocus: 'Mock Interviews & Corporate Placement',
        targetCount: '1 High-Quality Paid Internship',
        activities: [
          'Advanced placement preparation',
          '1 High-quality Paid Internship',
          'Advanced technical & coding prep',
          'Resume & LinkedIn optimization',
          'Mock interviews & HR preparation',
          'Placement & hiring guidance',
        ],
      },
    ],
  },
  FOUR_YEAR: {
    id: 'FOUR_YEAR',
    title: '4-Year Program',
    duration: '4 Academic Years',
    targetAcademicYear: 'First Year',
    allowedAcademicYears: ['1st', '1st Year', 'First Year', '2nd', '3rd', 'Final', 'Final Year'],
    shortDescription: 'A complete four-year journey from foundation and company readiness to industry exposure, internships and placement preparation.',
    mainObjective: 'The complete end-to-end InterHive Industry-Readiness Journey.',
    summaryFocus: 'Complete Industry-Readiness Journey',
    summaryTarget: 'Foundation + 4 Industrial Internships + 1 Paid Internship',
    badge: 'Complete 4-Year Journey',
    roadmap: [
      {
        yearLabel: 'First Year',
        stageName: 'Foundation & Company Readiness (CRT)',
        targetFocus: 'Corporate Culture & Fundamental Skills',
        targetCount: 'Company Readiness & CRT Foundation',
        activities: [
          'Industry & company workflow introduction',
          'Understanding internships & recruiter expectations',
          'LinkedIn profile creation & networking basics',
          'Resume basics & professional communication',
          'Email etiquette & interview behavior',
          'Intro to technical skills & career roadmap',
          'Goal setting & personal branding',
        ],
      },
      {
        yearLabel: 'Second Year',
        stageName: 'Industry Exposure & Hands-On Projects',
        targetFocus: 'Practical Skill Building & Site Visits',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Industrial training & internship opportunities',
          'Industrial visits & tech company tours',
          'Practical projects & technical skill development',
          'Professional communication & teamwork',
          'Company workflow exposure',
        ],
      },
      {
        yearLabel: 'Third Year',
        stageName: 'Advanced Industry Preparation & Coding',
        targetFocus: 'Full-Stack Workflows & Technical Sprinting',
        targetCount: '2 Industrial Training / Internship Opportunities',
        activities: [
          'Advanced industrial training & domain internships',
          'Real-world industry projects & site visits',
          'Technical preparation & coding practice',
          'Resume improvement & LinkedIn optimization',
          'Placement preparation',
        ],
      },
      {
        yearLabel: 'Fourth Year',
        stageName: 'Paid Internship & Full-Time Placement',
        targetFocus: 'Corporate Hires & Mock Interviews',
        targetCount: '1 Paid Internship + Placement Readiness',
        activities: [
          '1 High-quality Paid Internship',
          'Advanced technical training & coding prep',
          'Placement preparation & resume finalization',
          'Mock interviews & HR interview prep',
          'Company-specific preparation & hiring guidance',
        ],
      },
    ],
  },
};

export const PROGRAM_ELIGIBILITY_MATRIX: Record<string, ProgramTypeKey> = {
  '1st': 'FOUR_YEAR',
  '1st Year': 'FOUR_YEAR',
  'First Year': 'FOUR_YEAR',
  '2nd': 'THREE_YEAR',
  '2nd Year': 'THREE_YEAR',
  'Second Year': 'THREE_YEAR',
  '3rd': 'TWO_YEAR',
  '3rd Year': 'TWO_YEAR',
  'Third Year': 'TWO_YEAR',
  'Final': 'ONE_YEAR',
  'Final Year': 'ONE_YEAR',
  '4th': 'ONE_YEAR',
  '4th Year': 'ONE_YEAR',
};

export const PROGRAM_DISCLAIMER =
  'Note: The specified number of internships and training opportunities are program targets and roadmap milestones designed to build maximum industry readiness, and do not constitute an unconditional guarantee of placement.';
