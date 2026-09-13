export const SKILL_CATEGORIES = {
  PROGRAMMING: 'Programming Languages',
  FRAMEWORKS: 'Frameworks & Libraries',
  DATABASES: 'Databases',
  CLOUD: 'Cloud & DevOps',
  SOFT_SKILLS: 'Soft Skills',
  DESIGN: 'Design',
  DATA: 'Data Science & Analytics',
  BLOCKCHAIN: 'Blockchain',
  MOBILE: 'Mobile Development',
  SECURITY: 'Security',
  NETWORKING: 'Networking',
} as const;

export type SkillCategory = typeof SKILL_CATEGORIES[keyof typeof SKILL_CATEGORIES];

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export type SkillLevel = typeof SKILL_LEVELS[keyof typeof SKILL_LEVELS];

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export const POPULAR_SKILLS = [
  { name: 'JavaScript', category: SKILL_CATEGORIES.PROGRAMMING },
  { name: 'TypeScript', category: SKILL_CATEGORIES.PROGRAMMING },
  { name: 'Python', category: SKILL_CATEGORIES.PROGRAMMING },
  { name: 'Java', category: SKILL_CATEGORIES.PROGRAMMING },
  { name: 'React', category: SKILL_CATEGORIES.FRAMEWORKS },
  { name: 'Node.js', category: SKILL_CATEGORIES.FRAMEWORKS },
  { name: 'Next.js', category: SKILL_CATEGORIES.FRAMEWORKS },
  { name: 'MongoDB', category: SKILL_CATEGORIES.DATABASES },
  { name: 'PostgreSQL', category: SKILL_CATEGORIES.DATABASES },
  { name: 'AWS', category: SKILL_CATEGORIES.CLOUD },
  { name: 'Docker', category: SKILL_CATEGORIES.CLOUD },
  { name: 'Git', category: SKILL_CATEGORIES.CLOUD },
];
