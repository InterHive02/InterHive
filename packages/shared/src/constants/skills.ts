export const SKILL_CATEGORIES = {
  PROGRAMMING_LANGUAGES: 'programming_languages',
  FRAMEWORKS: 'frameworks',
  DATABASES: 'databases',
  DEVOPS: 'devops',
  CLOUD: 'cloud',
  SOFT_SKILLS: 'soft_skills',
  DESIGN: 'design',
  DATA_SCIENCE: 'data_science',
  ML_AI: 'ml_ai',
  BLOCKCHAIN: 'blockchain',
  MOBILE: 'mobile',
  WEB: 'web',
  SECURITY: 'security',
  NETWORKING: 'networking',
} as const;

export type SkillCategory = typeof SKILL_CATEGORIES[keyof typeof SKILL_CATEGORIES];

export interface SkillDefinition {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  levels: {
    beginner: string;
    intermediate: string;
    advanced: string;
    expert: string;
  };
  relatedSkills: string[];
  prerequisites: string[];
  subSkills: string[];
}

export const SKILL_DEFINITIONS: Record<string, SkillDefinition> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    description: 'Programming language for web development',
    levels: {
      beginner: 'Basic syntax, variables, functions, loops',
      intermediate: 'ES6+, async/await, closures, modules',
      advanced: 'Design patterns, performance optimization, functional programming',
      expert: 'Compiler internals, language design, ecosystem contribution',
    },
    relatedSkills: ['typescript', 'react', 'node'],
    prerequisites: [],
    subSkills: ['es6', 'dom_manipulation', 'async_programming', 'functional_programming'],
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    description: 'Typed superset of JavaScript',
    levels: {
      beginner: 'Basic types, interfaces, functions',
      intermediate: 'Advanced types, generics, decorators',
      advanced: 'Type inference, conditional types, mapped types',
      expert: 'Compiler API, language service, tooling',
    },
    relatedSkills: ['javascript', 'react', 'node'],
    prerequisites: ['javascript'],
    subSkills: ['types', 'interfaces', 'generics', 'decorators'],
  },
  react: {
    id: 'react',
    name: 'React',
    category: SKILL_CATEGORIES.FRAMEWORKS,
    description: 'UI library for building web applications',
    levels: {
      beginner: 'Components, props, state, hooks basics',
      intermediate: 'Context, advanced hooks, performance optimization',
      advanced: 'Architecture patterns, custom hooks, suspense',
      expert: 'Fiber architecture, concurrent mode, ecosystem contribution',
    },
    relatedSkills: ['typescript', 'javascript', 'nextjs', 'redux'],
    prerequisites: ['javascript', 'typescript'],
    subSkills: ['hooks', 'context', 'redux', 'nextjs', 'react_native'],
  },
  node: {
    id: 'node',
    name: 'Node.js',
    category: SKILL_CATEGORIES.FRAMEWORKS,
    description: 'JavaScript runtime for server-side development',
    levels: {
      beginner: 'Basic server, file system, modules',
      intermediate: 'Express, middleware, database integration',
      advanced: 'Streams, child processes, cluster, performance',
      expert: 'V8 internals, native modules, ecosystem contribution',
    },
    relatedSkills: ['javascript', 'typescript', 'express', 'mongodb'],
    prerequisites: ['javascript'],
    subSkills: ['express', 'nestjs', 'graphql', 'microservices'],
  },
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB',
    category: SKILL_CATEGORIES.DATABASES,
    description: 'NoSQL document database',
    levels: {
      beginner: 'CRUD operations, basic queries, indexing',
      intermediate: 'Aggregation framework, schema design, performance',
      advanced: 'Sharding, replication, backup strategies',
      expert: 'Internals, performance tuning, driver development',
    },
    relatedSkills: ['node', 'mongoose', 'postgresql'],
    prerequisites: [],
    subSkills: ['mongoose', 'aggregation', 'indexing', 'replication'],
  },
  // Add more skill definitions as needed
};

export const DOMAIN_SKILLS: Record<string, string[]> = {
  'web_development': ['javascript', 'typescript', 'react', 'node', 'mongodb', 'postgresql'],
  'full_stack': ['javascript', 'typescript', 'react', 'node', 'mongodb', 'postgresql', 'docker'],
  'frontend': ['javascript', 'typescript', 'react', 'html', 'css', 'tailwind'],
  'backend': ['node', 'python', 'java', 'mongodb', 'postgresql', 'docker'],
  'data_science': ['python', 'pandas', 'numpy', 'scikit_learn', 'sql', 'matplotlib'],
  'devops': ['docker', 'kubernetes', 'aws', 'jenkins', 'terraform', 'linux'],
};