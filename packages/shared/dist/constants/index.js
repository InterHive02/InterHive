var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/constants/index.ts
var constants_exports = {};
__export(constants_exports, {
  ADMIN_PERMISSIONS: () => ADMIN_PERMISSIONS,
  ALL_PROGRAM_KEYS: () => ALL_PROGRAM_KEYS,
  APPLICATION_STATUS: () => APPLICATION_STATUS,
  ASSESSMENT_STATUS: () => ASSESSMENT_STATUS,
  ATTENDANCE_STATUS: () => ATTENDANCE_STATUS,
  AttendanceStatus: () => AttendanceStatus,
  COMPANY_PERMISSIONS: () => COMPANY_PERMISSIONS,
  COMPANY_STATUS: () => COMPANY_STATUS,
  DEFAULT_ROUTES: () => DEFAULT_ROUTES,
  DOMAIN_SKILLS: () => DOMAIN_SKILLS,
  HR_PERMISSIONS: () => HR_PERMISSIONS,
  INTERN_PERMISSIONS: () => INTERN_PERMISSIONS,
  INTERN_STATUS: () => INTERN_STATUS,
  MANAGER_PERMISSIONS: () => MANAGER_PERMISSIONS,
  MatchStatus: () => MatchStatus,
  PERMISSIONS: () => PERMISSIONS,
  PROGRAM_ACADEMIC_YEAR_MAP: () => PROGRAM_ACADEMIC_YEAR_MAP,
  PROGRAM_CONFIGS: () => PROGRAM_CONFIGS,
  PROGRAM_DISCLAIMER: () => PROGRAM_DISCLAIMER,
  PROGRAM_ELIGIBILITY_MATRIX: () => PROGRAM_ELIGIBILITY_MATRIX,
  PROGRAM_TYPES: () => PROGRAM_TYPES,
  PROJECT_STATUS: () => PROJECT_STATUS,
  ROLES: () => ROLES,
  ROLE_HIERARCHY: () => ROLE_HIERARCHY,
  ROLE_PERMISSIONS: () => ROLE_PERMISSIONS,
  SKILL_CATEGORIES: () => SKILL_CATEGORIES,
  SKILL_DEFINITIONS: () => SKILL_DEFINITIONS,
  TASK_STATUS: () => TASK_STATUS,
  getProgramConfig: () => getProgramConfig,
  isValidProgramType: () => isValidProgramType
});
module.exports = __toCommonJS(constants_exports);

// src/constants/roles.ts
var ROLES = {
  ADMIN: "admin",
  HR: "hr",
  MANAGER: "manager",
  STUDENT: "student",
  INTERN: "intern",
  COMPANY: "company",
  MENTOR: "mentor",
  EVALUATOR: "evaluator"
};
var ROLE_PERMISSIONS = {
  admin: ["*"],
  student: [
    "view_profile",
    "update_profile",
    "view_programs",
    "view_courses",
    "apply_internship"
  ],
  hr: [
    "view_interns",
    "manage_interns",
    "view_companies",
    "manage_companies",
    "view_assessments",
    "manage_assessments",
    "view_trainings",
    "manage_trainings",
    "view_reports",
    "manage_reports",
    "manage_users",
    "view_analytics"
  ],
  manager: [
    "view_interns",
    "manage_team_interns",
    "view_projects",
    "manage_projects",
    "view_assessments",
    "evaluate_interns",
    "view_trainings",
    "manage_team_training",
    "view_reports",
    "view_team_reports",
    "approve_leave"
  ],
  intern: [
    "view_profile",
    "update_profile",
    "view_assessments",
    "take_assessments",
    "view_trainings",
    "enroll_training",
    "view_projects",
    "submit_project",
    "view_opportunities",
    "apply_opportunities",
    "view_attendance",
    "manage_attendance",
    "view_communications",
    "send_messages"
  ],
  company: [
    "view_company_profile",
    "update_company_profile",
    "post_requirements",
    "view_applications",
    "review_applications",
    "view_matches",
    "schedule_interviews",
    "view_hire_interns",
    "view_analytics"
  ],
  mentor: [
    "view_projects",
    "manage_projects",
    "view_interns",
    "evaluate_interns",
    "view_trainings",
    "conduct_training",
    "view_communications",
    "send_messages"
  ],
  evaluator: [
    "view_assessments",
    "evaluate_assessments",
    "view_interns",
    "view_results",
    "provide_feedback"
  ]
};
var ROLE_HIERARCHY = {
  admin: 0,
  hr: 1,
  manager: 2,
  mentor: 3,
  evaluator: 4,
  company: 5,
  intern: 6
};
var DEFAULT_ROUTES = {
  admin: "/admin/dashboard",
  hr: "/hr/dashboard",
  manager: "/manager/dashboard",
  intern: "/dashboard",
  company: "/company/dashboard",
  mentor: "/mentor/dashboard",
  evaluator: "/evaluator/dashboard"
};

// src/constants/skills.ts
var SKILL_CATEGORIES = {
  PROGRAMMING_LANGUAGES: "programming_languages",
  FRAMEWORKS: "frameworks",
  DATABASES: "databases",
  DEVOPS: "devops",
  CLOUD: "cloud",
  SOFT_SKILLS: "soft_skills",
  DESIGN: "design",
  DATA_SCIENCE: "data_science",
  ML_AI: "ml_ai",
  BLOCKCHAIN: "blockchain",
  MOBILE: "mobile",
  WEB: "web",
  SECURITY: "security",
  NETWORKING: "networking"
};
var SKILL_DEFINITIONS = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    description: "Programming language for web development",
    levels: {
      beginner: "Basic syntax, variables, functions, loops",
      intermediate: "ES6+, async/await, closures, modules",
      advanced: "Design patterns, performance optimization, functional programming",
      expert: "Compiler internals, language design, ecosystem contribution"
    },
    relatedSkills: ["typescript", "react", "node"],
    prerequisites: [],
    subSkills: ["es6", "dom_manipulation", "async_programming", "functional_programming"]
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    description: "Typed superset of JavaScript",
    levels: {
      beginner: "Basic types, interfaces, functions",
      intermediate: "Advanced types, generics, decorators",
      advanced: "Type inference, conditional types, mapped types",
      expert: "Compiler API, language service, tooling"
    },
    relatedSkills: ["javascript", "react", "node"],
    prerequisites: ["javascript"],
    subSkills: ["types", "interfaces", "generics", "decorators"]
  },
  react: {
    id: "react",
    name: "React",
    category: SKILL_CATEGORIES.FRAMEWORKS,
    description: "UI library for building web applications",
    levels: {
      beginner: "Components, props, state, hooks basics",
      intermediate: "Context, advanced hooks, performance optimization",
      advanced: "Architecture patterns, custom hooks, suspense",
      expert: "Fiber architecture, concurrent mode, ecosystem contribution"
    },
    relatedSkills: ["typescript", "javascript", "nextjs", "redux"],
    prerequisites: ["javascript", "typescript"],
    subSkills: ["hooks", "context", "redux", "nextjs", "react_native"]
  },
  node: {
    id: "node",
    name: "Node.js",
    category: SKILL_CATEGORIES.FRAMEWORKS,
    description: "JavaScript runtime for server-side development",
    levels: {
      beginner: "Basic server, file system, modules",
      intermediate: "Express, middleware, database integration",
      advanced: "Streams, child processes, cluster, performance",
      expert: "V8 internals, native modules, ecosystem contribution"
    },
    relatedSkills: ["javascript", "typescript", "express", "mongodb"],
    prerequisites: ["javascript"],
    subSkills: ["express", "nestjs", "graphql", "microservices"]
  },
  mongodb: {
    id: "mongodb",
    name: "MongoDB",
    category: SKILL_CATEGORIES.DATABASES,
    description: "NoSQL document database",
    levels: {
      beginner: "CRUD operations, basic queries, indexing",
      intermediate: "Aggregation framework, schema design, performance",
      advanced: "Sharding, replication, backup strategies",
      expert: "Internals, performance tuning, driver development"
    },
    relatedSkills: ["node", "mongoose", "postgresql"],
    prerequisites: [],
    subSkills: ["mongoose", "aggregation", "indexing", "replication"]
  }
  // Add more skill definitions as needed
};
var DOMAIN_SKILLS = {
  "web_development": ["javascript", "typescript", "react", "node", "mongodb", "postgresql"],
  "full_stack": ["javascript", "typescript", "react", "node", "mongodb", "postgresql", "docker"],
  "frontend": ["javascript", "typescript", "react", "html", "css", "tailwind"],
  "backend": ["node", "python", "java", "mongodb", "postgresql", "docker"],
  "data_science": ["python", "pandas", "numpy", "scikit_learn", "sql", "matplotlib"],
  "devops": ["docker", "kubernetes", "aws", "jenkins", "terraform", "linux"]
};

// src/constants/status.ts
var INTERN_STATUS = {
  REGISTERED: "registered",
  ASSESSED: "assessed",
  TRAINING: "training",
  PROJECT: "project",
  READY: "ready",
  PLACED: "placed",
  COMPLETED: "completed",
  DROPPED: "dropped"
};
var COMPANY_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  INACTIVE: "inactive"
};
var PROJECT_STATUS = {
  PLANNING: "planning",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  PAUSED: "paused",
  CANCELLED: "cancelled"
};
var TASK_STATUS = {
  TO_DO: "to_do",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  COMPLETED: "completed",
  BLOCKED: "blocked"
};
var ASSESSMENT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  EVALUATED: "evaluated",
  EXPIRED: "expired"
};
var APPLICATION_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  ASSESSMENT: "assessment",
  INTERVIEW: "interview",
  OFFERED: "offered",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn"
};
var AttendanceStatus = /* @__PURE__ */ ((AttendanceStatus2) => {
  AttendanceStatus2["PRESENT"] = "present";
  AttendanceStatus2["ABSENT"] = "absent";
  AttendanceStatus2["LATE"] = "late";
  AttendanceStatus2["HALF_DAY"] = "half_day";
  AttendanceStatus2["ON_LEAVE"] = "on_leave";
  AttendanceStatus2["HOLIDAY"] = "holiday";
  return AttendanceStatus2;
})(AttendanceStatus || {});
var ATTENDANCE_STATUS = AttendanceStatus;
var MatchStatus = /* @__PURE__ */ ((MatchStatus2) => {
  MatchStatus2["PENDING"] = "pending";
  MatchStatus2["MATCHED"] = "matched";
  MatchStatus2["ACCEPTED"] = "accepted";
  MatchStatus2["REJECTED"] = "rejected";
  MatchStatus2["INTERVIEW_SCHEDULED"] = "interview_scheduled";
  MatchStatus2["OFFER_MADE"] = "offer_made";
  MatchStatus2["HIRED"] = "hired";
  MatchStatus2["EXPIRED"] = "expired";
  return MatchStatus2;
})(MatchStatus || {});

// src/constants/permissions.ts
var PERMISSIONS = {
  // User management
  CREATE_USER: "create_user",
  VIEW_USERS: "view_users",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",
  ACTIVATE_USER: "activate_user",
  SUSPEND_USER: "suspend_user",
  // Intern management
  VIEW_INTERNS: "view_interns",
  CREATE_INTERN: "create_intern",
  UPDATE_INTERN: "update_intern",
  DELETE_INTERN: "delete_intern",
  EVALUATE_INTERN: "evaluate_intern",
  VIEW_INTERN_READINESS: "view_intern_readiness",
  // Company management
  VIEW_COMPANIES: "view_companies",
  CREATE_COMPANY: "create_company",
  UPDATE_COMPANY: "update_company",
  DELETE_COMPANY: "delete_company",
  VERIFY_COMPANY: "verify_company",
  // Assessment management
  VIEW_ASSESSMENTS: "view_assessments",
  CREATE_ASSESSMENT: "create_assessment",
  UPDATE_ASSESSMENT: "update_assessment",
  DELETE_ASSESSMENT: "delete_assessment",
  TAKE_ASSESSMENT: "take_assessment",
  EVALUATE_ASSESSMENT: "evaluate_assessment",
  // Training management
  VIEW_TRAININGS: "view_trainings",
  CREATE_TRAINING: "create_training",
  UPDATE_TRAINING: "update_training",
  DELETE_TRAINING: "delete_training",
  ENROLL_TRAINING: "enroll_training",
  MANAGE_TRAINING_PROGRESS: "manage_training_progress",
  // Project management
  VIEW_PROJECTS: "view_projects",
  CREATE_PROJECT: "create_project",
  UPDATE_PROJECT: "update_project",
  DELETE_PROJECT: "delete_project",
  ASSIGN_PROJECT: "assign_project",
  SUBMIT_PROJECT_WORK: "submit_project_work",
  REVIEW_PROJECT_WORK: "review_project_work",
  // Matching & Hiring
  VIEW_OPPORTUNITIES: "view_opportunities",
  CREATE_OPPORTUNITY: "create_opportunity",
  APPLY_OPPORTUNITY: "apply_opportunity",
  VIEW_APPLICATIONS: "view_applications",
  REVIEW_APPLICATION: "review_application",
  SCHEDULE_INTERVIEW: "schedule_interview",
  MAKE_OFFER: "make_offer",
  // Analytics & Reports
  VIEW_ANALYTICS: "view_analytics",
  VIEW_REPORTS: "view_reports",
  GENERATE_REPORT: "generate_report",
  EXPORT_DATA: "export_data",
  // System management
  VIEW_SYSTEM_SETTINGS: "view_system_settings",
  UPDATE_SYSTEM_SETTINGS: "update_system_settings",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_BACKUP: "manage_backup"
};
var ADMIN_PERMISSIONS = Object.values(PERMISSIONS);
var HR_PERMISSIONS = [
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.CREATE_USER,
  PERMISSIONS.UPDATE_USER,
  PERMISSIONS.ACTIVATE_USER,
  PERMISSIONS.SUSPEND_USER,
  PERMISSIONS.VIEW_INTERNS,
  PERMISSIONS.CREATE_INTERN,
  PERMISSIONS.UPDATE_INTERN,
  PERMISSIONS.VIEW_COMPANIES,
  PERMISSIONS.CREATE_COMPANY,
  PERMISSIONS.UPDATE_COMPANY,
  PERMISSIONS.VERIFY_COMPANY,
  PERMISSIONS.VIEW_ASSESSMENTS,
  PERMISSIONS.EVALUATE_ASSESSMENT,
  PERMISSIONS.VIEW_TRAININGS,
  PERMISSIONS.VIEW_PROJECTS,
  PERMISSIONS.VIEW_OPPORTUNITIES,
  PERMISSIONS.VIEW_ANALYTICS,
  PERMISSIONS.VIEW_REPORTS,
  PERMISSIONS.GENERATE_REPORT
];
var MANAGER_PERMISSIONS = [
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.VIEW_INTERNS,
  PERMISSIONS.UPDATE_INTERN,
  PERMISSIONS.EVALUATE_INTERN,
  PERMISSIONS.VIEW_PROJECTS,
  PERMISSIONS.CREATE_PROJECT,
  PERMISSIONS.UPDATE_PROJECT,
  PERMISSIONS.ASSIGN_PROJECT,
  PERMISSIONS.REVIEW_PROJECT_WORK,
  PERMISSIONS.VIEW_TRAININGS,
  PERMISSIONS.ENROLL_TRAINING,
  PERMISSIONS.MANAGE_TRAINING_PROGRESS,
  PERMISSIONS.VIEW_REPORTS
];
var INTERN_PERMISSIONS = [
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.VIEW_INTERNS,
  PERMISSIONS.VIEW_ASSESSMENTS,
  PERMISSIONS.TAKE_ASSESSMENT,
  PERMISSIONS.VIEW_TRAININGS,
  PERMISSIONS.ENROLL_TRAINING,
  PERMISSIONS.MANAGE_TRAINING_PROGRESS,
  PERMISSIONS.VIEW_PROJECTS,
  PERMISSIONS.SUBMIT_PROJECT_WORK,
  PERMISSIONS.VIEW_OPPORTUNITIES,
  PERMISSIONS.APPLY_OPPORTUNITY
];
var COMPANY_PERMISSIONS = [
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.VIEW_COMPANIES,
  PERMISSIONS.UPDATE_COMPANY,
  PERMISSIONS.VIEW_OPPORTUNITIES,
  PERMISSIONS.CREATE_OPPORTUNITY,
  PERMISSIONS.VIEW_APPLICATIONS,
  PERMISSIONS.REVIEW_APPLICATION,
  PERMISSIONS.SCHEDULE_INTERVIEW,
  PERMISSIONS.MAKE_OFFER,
  PERMISSIONS.VIEW_ANALYTICS,
  PERMISSIONS.VIEW_REPORTS
];

// src/constants/programs.ts
var PROGRAM_TYPES = {
  ONE_YEAR: "ONE_YEAR",
  TWO_YEAR: "TWO_YEAR",
  THREE_YEAR: "THREE_YEAR",
  FOUR_YEAR: "FOUR_YEAR",
  PPO: "PPO"
};
var PROGRAM_CONFIGS = {
  FOUR_YEAR: {
    id: "FOUR_YEAR",
    title: "4-Year Program",
    duration: "4 Academic Years",
    targetAcademicYear: "1st Year Students Only (Batch 2030)",
    allowedAcademicYears: ["1st", "1st Year", "First Year", "2030"],
    shortDescription: "Exclusively for 1st-year students (Batch 2030). A complete 4-year degree-parallel transformation from engineering foundations to 4 industrial internships and full-time placement.",
    mainObjective: "Comprehensive 4-year industry readiness for 1st-year entrants, building progressive expertise each year.",
    summaryFocus: "Foundation + 4 Industrial Internships + Final Placement",
    summaryTarget: "4 Industrial Internships + 1 Paid Corporate Internship",
    badge: "1st Year Only (Batch 2030)",
    roadmap: [
      {
        yearLabel: "1st Year (2026-27)",
        stageName: "Foundation & Software Engineering Readiness",
        targetFocus: "Programming Fundamentals & Git Workflows",
        targetCount: "Company Readiness & Practical Skill Training",
        activities: [
          "Core data structures, algorithms & programming logic",
          "Modern full-stack fundamentals & responsive UI design",
          "Git, GitHub branching, pull requests & code reviews",
          "Clean code principles, linting & basic debugging",
          "1 Hands-on capstone project review with senior engineers"
        ]
      },
      {
        yearLabel: "2nd Year (2027-28)",
        stageName: "Industrial Training & Early Internships",
        targetFocus: "Full-Stack Sprints & Backend Microservices",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "RESTful APIs, database design (SQL & NoSQL) & Docker",
          "2 Industrial training & internship opportunities",
          "Live agile sprint ceremonies & ticket management",
          "Industry tech talks & architecture deep dives",
          "Professional portfolio & resume milestone audit"
        ]
      },
      {
        yearLabel: "3rd Year (2028-29)",
        stageName: "Advanced Corporate Sprints & Cloud",
        targetFocus: "Cloud Infrastructure & High-Scale Systems",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Container orchestration (Docker, Kubernetes) & AWS/GCP",
          "2 Advanced industrial training & domain internships",
          "System design, caching (Redis), message queues & security",
          "Mock technical interviews & system architecture reviews",
          "Targeted placement track preparation"
        ]
      },
      {
        yearLabel: "4th Year (2029-30)",
        stageName: "Paid Corporate Internship & Placement Conversion",
        targetFocus: "Full-Time Corporate Hires & PPO Transition",
        targetCount: "1 High-Quality Paid Internship + Placement Hires",
        activities: [
          "1 High-quality Paid Corporate Internship",
          "Advanced technical coding interviews & HR rounds",
          "Company-specific hiring drives & referrals",
          "Full-time placement & PPO offer finalization",
          "Graduation transition into professional engineering team"
        ]
      }
    ]
  },
  THREE_YEAR: {
    id: "THREE_YEAR",
    title: "3-Year Program",
    duration: "3 Academic Years",
    targetAcademicYear: "2nd Year Students Only (Batch 2029)",
    allowedAcademicYears: ["2nd", "2nd Year", "Second Year", "2029"],
    shortDescription: "Exclusively for 2nd-year students (Batch 2029). Progressively build corporate workflows, advanced full-stack skills, 4 industrial internships, and 4th-year paid placement.",
    mainObjective: "Progressive corporate development starting in 2nd year, leading to senior paid internships and full-time hiring.",
    summaryFocus: "Industrial Exposure + 4 Internships + Paid Internship",
    summaryTarget: "4 Industrial Internships (Y2 & Y3) + 1 Paid Internship (Y4)",
    badge: "2nd Year Only (Batch 2029)",
    roadmap: [
      {
        yearLabel: "2nd Year (2026-27)",
        stageName: "Core Specialization & Industrial Training",
        targetFocus: "Full-Stack Architectures & Database Systems",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Modern full-stack frameworks (React, Node.js, Python, TypeScript)",
          "2 Industrial training & internship sprints",
          "Git collaboration, pull-request audits & issue tracking",
          "Database optimization, indexing & API design",
          "Mentored live project building"
        ]
      },
      {
        yearLabel: "3rd Year (2027-28)",
        stageName: "Advanced Domain Internships & System Design",
        targetFocus: "Cloud Infrastructure, CI/CD & Architecture",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Advanced domain internships & corporate projects",
          "Docker containerization, cloud deployment & CI/CD pipelines",
          "System design fundamentals & algorithmic problem-solving",
          "Resume optimization, GitHub dossier & LinkedIn audit",
          "Placement readiness evaluation"
        ]
      },
      {
        yearLabel: "4th Year (2028-29)",
        stageName: "Paid Internship & Full-Time Placement",
        targetFocus: "Corporate Placement & PPO Offers",
        targetCount: "1 High-Quality Paid Corporate Internship",
        activities: [
          "1 High-quality Paid Corporate Internship",
          "Direct hiring drives with partner tech companies",
          "Technical interview rounds, system design & HR mocks",
          "Offer negotiation & full-time placement conversion"
        ]
      }
    ]
  },
  TWO_YEAR: {
    id: "TWO_YEAR",
    title: "2-Year Program",
    duration: "2 Academic Years",
    targetAcademicYear: "3rd Year Students Only (Batch 2028)",
    allowedAcademicYears: ["3rd", "3rd Year", "Third Year", "2028"],
    shortDescription: "Exclusively for 3rd-year students (Batch 2028). Fast-track industrial training and internships in your 3rd year, converting into a 4th-year high-quality paid corporate internship and PPO.",
    mainObjective: "Intensive 3rd-year corporate skill building converting to 4th-year paid internship and full-time placement.",
    summaryFocus: "3rd-Yr Training/Internships + 4th-Yr Paid Corporate Internship",
    summaryTarget: "2 Training/Internships (3rd Yr) + 1 Paid Corporate Internship (4th Yr)",
    badge: "3rd Year Only (Batch 2028)",
    roadmap: [
      {
        yearLabel: "3rd Year (2026-27)",
        stageName: "Industrial Training & Production Projects",
        targetFocus: "Production Workflows, Sprints & Clean Code",
        targetCount: "2 Industry Training / Internship Opportunities",
        activities: [
          "Production-grade full-stack / backend development",
          "2 Industry training & internship opportunities",
          "Real agile sprints, Jira/Linear ticketing & PR reviews",
          "System architecture, REST/GraphQL APIs & database indexing",
          "Technical mentor code audits & skill scorecards"
        ]
      },
      {
        yearLabel: "4th Year (2027-28)",
        stageName: "Paid Corporate Internship & Placement Conversion",
        targetFocus: "Paid Internship & Full-Time Corporate Placement",
        targetCount: "1 High-Quality Paid Corporate Internship",
        activities: [
          "1 High-quality Paid Corporate Internship at partner company",
          "Placement drives & direct employer matching",
          "Coding interview preparation (Data Structures, System Design)",
          "Mock interviews with industry tech leads",
          "PPO conversion and offer letter finalization"
        ]
      }
    ]
  },
  ONE_YEAR: {
    id: "ONE_YEAR",
    title: "1-Year Program",
    duration: "1 Academic Year",
    targetAcademicYear: "Final Year Students Only (Batch 2027)",
    allowedAcademicYears: ["Final", "Final Year", "4th Year", "4th", "2027"],
    shortDescription: "Exclusively for final-year students (Batch 2027). A focused industry-readiness and placement accelerator preparing graduating engineers for internships, interviews, and immediate corporate hiring.",
    mainObjective: "To make final-year students internship-ready and placement-ready before graduation.",
    summaryFocus: "Placement Preparation + 1 Quality Internship + Career Hiring",
    summaryTarget: "1 Quality Internship Opportunity + Placement Guidance",
    badge: "Final Year Only (Batch 2027)",
    roadmap: [
      {
        yearLabel: "Final Year (2026-27)",
        stageName: "Fast-Track Placement & Internship Conversion",
        targetFocus: "Hiring Preparation & Quality Corporate Internship",
        targetCount: "1 Quality Internship + Placement Guidance",
        activities: [
          "Industry-oriented technical training & production sprints",
          "1 Quality Corporate Internship opportunity with stipend",
          "Resume rebuild, GitHub dossier & LinkedIn optimization",
          "Coding interview preparation & system design reviews",
          "Mock technical & HR interviews with senior mentors",
          "Direct matching with partner companies hiring freshers"
        ]
      }
    ]
  },
  PPO: {
    id: "PPO",
    title: "PPO Program",
    duration: "8 Months (2 Mo InterHive Training + 6 Mo Company Internship)",
    targetAcademicYear: "Final Year Students Only (Batch 2027)",
    allowedAcademicYears: ["Final", "Final Year", "4th Year", "4th", "2027"],
    shortDescription: "Exclusively for final-year students (Batch 2027): 2 months of intensive training & readiness done by the InterHive platform, followed by an assured opportunity to get a 6-month corporate internship at any partner company leading directly to Pre-Placement Offers (PPO).",
    mainObjective: "To provide 2 months of structured training & industry readiness on the InterHive platform, followed by guaranteed opportunities to secure a 6-month corporate internship at any partner company for full-time PPO conversion.",
    summaryFocus: "2 Months Training by InterHive + 6 Months Internship Opportunity at Any Company",
    summaryTarget: "2 Mo InterHive Readiness Training + 6 Mo Corporate Internship Opportunity -> PPO",
    badge: "Final Year PPO (Batch 2027)",
    roadmap: [
      {
        yearLabel: "Month 1\u20132 (At InterHive)",
        stageName: "2 Months Training & Readiness by InterHive Platform",
        targetFocus: "Hands-On Industry Readiness, Production Codebases & Skill Verification at InterHive",
        targetCount: "InterHive Industry-Readiness Certification & Verified Scorecard",
        activities: [
          "2 Months of intensive training and industry readiness conducted directly on the InterHive platform",
          "Hands-on practical development with production codebases, Git workflows, clean code & Docker",
          "Daily standup tracking, punch-in logs, assignment evaluation & progress monitoring",
          "Weekly 1-on-1 code reviews & technical benchmark evaluations with senior engineering mentors",
          "Rigorous interview preparation: mock technical rounds, system design & resume optimization",
          "Official InterHive Industry-Readiness Certification verifying candidate readiness for company hiring"
        ]
      },
      {
        yearLabel: "Month 3\u20138 (At Partner Company)",
        stageName: "6 Months Corporate Internship Opportunity at Any Partner Company",
        targetFocus: "Assured Corporate Internship Placement, Real-World Engineering & Direct PPO Conversion",
        targetCount: "6-Month Corporate Internship + Pre-Placement Offer (PPO)",
        activities: [
          "Assured opportunity to get matched and placed for a 6-month internship at any partner company",
          "Direct deployment to live production engineering teams, client deliverables & agile sprints",
          "Monthly stipend paid directly to the student by the hiring company",
          "Continuous performance tracking and milestone feedback evaluated via the InterHive portal",
          "Formal Pre-Placement Offer (PPO) evaluation for immediate full-time employment upon graduation"
        ]
      }
    ]
  }
};
var PROGRAM_ACADEMIC_YEAR_MAP = {
  FOUR_YEAR: ["1st" /* FIRST_YEAR */],
  THREE_YEAR: ["2nd" /* SECOND_YEAR */],
  TWO_YEAR: ["3rd" /* THIRD_YEAR */],
  ONE_YEAR: ["Final" /* FINAL_YEAR */],
  PPO: ["Final" /* FINAL_YEAR */]
};
var PROGRAM_ELIGIBILITY_MATRIX = {
  // Input: Academic Year / String -> Recommended Program
  "1st": "FOUR_YEAR",
  "1st Year": "FOUR_YEAR",
  "First Year": "FOUR_YEAR",
  "2030": "FOUR_YEAR",
  "2nd": "THREE_YEAR",
  "2nd Year": "THREE_YEAR",
  "Second Year": "THREE_YEAR",
  "2029": "THREE_YEAR",
  "3rd": "TWO_YEAR",
  "3rd Year": "TWO_YEAR",
  "Third Year": "TWO_YEAR",
  "2028": "TWO_YEAR",
  "Final": "ONE_YEAR",
  "Final Year": "ONE_YEAR",
  "4th": "ONE_YEAR",
  "4th Year": "ONE_YEAR",
  "2027": "ONE_YEAR",
  // Program Key -> Allowed AcademicYears array (for validation in forms)
  FOUR_YEAR: ["1st" /* FIRST_YEAR */],
  THREE_YEAR: ["2nd" /* SECOND_YEAR */],
  TWO_YEAR: ["3rd" /* THIRD_YEAR */],
  ONE_YEAR: ["Final" /* FINAL_YEAR */],
  PPO: ["Final" /* FINAL_YEAR */]
};
var PROGRAM_DISCLAIMER = "Note: The specified number of internships and training opportunities are structured milestones designed to build verifiable industry readiness, and do not constitute an unconditional guarantee of placement.";
var ALL_PROGRAM_KEYS = ["FOUR_YEAR", "THREE_YEAR", "TWO_YEAR", "ONE_YEAR", "PPO"];
var getProgramConfig = (key) => {
  if (key && key in PROGRAM_CONFIGS) {
    return PROGRAM_CONFIGS[key];
  }
  return PROGRAM_CONFIGS.ONE_YEAR;
};
var isValidProgramType = (key) => {
  return typeof key === "string" && key in PROGRAM_CONFIGS;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ADMIN_PERMISSIONS,
  ALL_PROGRAM_KEYS,
  APPLICATION_STATUS,
  ASSESSMENT_STATUS,
  ATTENDANCE_STATUS,
  AttendanceStatus,
  COMPANY_PERMISSIONS,
  COMPANY_STATUS,
  DEFAULT_ROUTES,
  DOMAIN_SKILLS,
  HR_PERMISSIONS,
  INTERN_PERMISSIONS,
  INTERN_STATUS,
  MANAGER_PERMISSIONS,
  MatchStatus,
  PERMISSIONS,
  PROGRAM_ACADEMIC_YEAR_MAP,
  PROGRAM_CONFIGS,
  PROGRAM_DISCLAIMER,
  PROGRAM_ELIGIBILITY_MATRIX,
  PROGRAM_TYPES,
  PROJECT_STATUS,
  ROLES,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  SKILL_CATEGORIES,
  SKILL_DEFINITIONS,
  TASK_STATUS,
  getProgramConfig,
  isValidProgramType
});
//# sourceMappingURL=index.js.map