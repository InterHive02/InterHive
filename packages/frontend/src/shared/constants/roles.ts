export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  INTERN: 'intern',
  COMPANY: 'company',
  MENTOR: 'mentor',
  EVALUATOR: 'evaluator',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  hr: 'HR Manager',
  manager: 'Manager',
  intern: 'Intern',
  company: 'Company',
  mentor: 'Mentor',
  evaluator: 'Evaluator',
};

export const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-red-500 text-white',
  hr: 'bg-purple-500 text-white',
  manager: 'bg-blue-500 text-white',
  intern: 'bg-green-500 text-white',
  company: 'bg-orange-500 text-white',
  mentor: 'bg-indigo-500 text-white',
  evaluator: 'bg-pink-500 text-white',
};

export const DEFAULT_ROLE = ROLES.INTERN;

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 0,
  hr: 1,
  manager: 2,
  mentor: 3,
  evaluator: 4,
  company: 5,
  intern: 6,
};
