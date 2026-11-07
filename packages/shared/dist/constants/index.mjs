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
    summaryTarget: "2 Mo InterHive Readiness Training + 6 Mo Corporate Internship Opportunity -> Assured PPO",
    badge: "Final Year Only (Batch 2027) \xB7 Fast-Track PPO",
    roadmap: [
      {
        yearLabel: "Stage 1 (Month 1\u20132)",
        stageName: "2 Months Training & Readiness by InterHive Platform",
        targetFocus: "Hands-on practical training, modern software engineering workflows & industry readiness conducted entirely on the InterHive platform",
        targetCount: "InterHive Industry-Ready Scorecard & Certified Competency Badge",
        activities: [
          "2 Months of intensive training and industry readiness conducted directly on the InterHive platform",
          "Production codebases, Git branch workflows, pull request reviews, clean code & Docker containerization",
          "Daily attendance tracking, standups, sprint assignments, code linting & continuous progress evaluation",
          "Weekly 1-on-1 mentor reviews with experienced engineering leads to address skill gaps",
          "Dedicated interview preparation: mock coding rounds, data structures, system design & resume elevation",
          "Official InterHive Industry-Readiness Certification verifying candidate is 100% prepared for corporate hiring"
        ]
      },
      {
        yearLabel: "Stage 2 (Month 3\u20138)",
        stageName: "6 Months Assured Corporate Internship at Any Partner Company",
        targetFocus: "Assured opportunity to intern at a partner company, work with real corporate teams, earn a monthly stipend & convert into a PPO",
        targetCount: "6-Month Corporate Internship + Pre-Placement Offer (PPO)",
        activities: [
          "Assured opportunity to get matched and placed for a 6-month corporate internship at any partner company",
          "Direct deployment to live corporate engineering teams, real client deliverables & production environments",
          "Earn a competitive monthly stipend paid directly to the student by the hiring partner company",
          "Continuous performance governance and milestone reporting evaluated through the InterHive dashboard",
          "Direct technical & HR review loops with corporate leadership for full-time Pre-Placement Offer (PPO) conversion",
          "Graduation transition into a permanent, full-time corporate role upon degree completion"
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

// src/constants/landing-cms.defaults.ts
var DEFAULT_LANDING_CMS_CONFIG = {
  version: 1,
  isPublished: true,
  publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
  publishedBy: "system@interhive.in",
  lastEditedBy: "System Default",
  theme: {
    primaryColor: "#2563eb",
    // blue-600
    secondaryColor: "#4f46e5",
    // indigo-600
    accentColor: "#9333ea",
    // purple-600
    surfaceColor: "#F0F5FA",
    textColor: "#0f172a",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "rounded-2xl",
    enableAnimations: true
  },
  seo: {
    metaTitle: "InterHive \u2014 Industry-Readiness & Talent Connect Platform",
    metaDescription: "From Campus Selection to Full-Time PPO. Practical industrial training, real projects, and paid corporate internships with direct PPO conversion.",
    metaKeywords: "internship, ppo, campus placement, engineering internships, tech careers, interhive",
    ogTitle: "InterHive \u2014 Talent Connect Platform",
    ogDescription: "Accelerate your career with real-world projects and direct company placements.",
    ogImage: "/interhive_full_bg.png",
    canonicalUrl: "https://interhive.in"
  },
  navbar: {
    brandName: "InterHive",
    logoUrl: "",
    links: [
      { label: "Programs", href: "#our-programs", isExternal: false, order: 1, isVisible: true },
      { label: "How It Works", href: "#how-it-works", isExternal: false, order: 2, isVisible: true },
      { label: "Why InterHive", href: "#why-interhive", isExternal: false, order: 3, isVisible: true },
      { label: "Features", href: "#features", isExternal: false, order: 4, isVisible: true },
      { label: "Opportunities", href: "#explore-opportunities", isExternal: false, order: 5, isVisible: true },
      { label: "FAQ", href: "#faq", isExternal: false, order: 6, isVisible: true }
    ],
    ctaButtonText: "Join PPO Track",
    ctaButtonLink: "modal_application",
    showCtaButton: true
  },
  footer: {
    brandName: "InterHive",
    tagline: "Bridging campus potential with verified industry engineering excellence.",
    copyrightText: "\xA9 2026 InterHive.in. All rights reserved.",
    columns: [
      {
        title: "Programs",
        links: [
          { label: "1-Year Program", href: "/programs" },
          { label: "2-Year Program", href: "/programs" },
          { label: "3-Year Program", href: "/programs" },
          { label: "4-Year Program", href: "/programs" },
          { label: "PPO Program", href: "/programs" }
        ]
      },
      {
        title: "Platform",
        links: [
          { label: "Assessment Diagnostic", href: "/login" },
          { label: "Corporate Portal", href: "/login" },
          { label: "Candidate Verification", href: "/login" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Contact Team", href: "/contact" },
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" }
        ]
      }
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
      { platform: "Twitter", url: "https://twitter.com", icon: "Twitter" },
      { platform: "GitHub", url: "https://github.com", icon: "Github" }
    ]
  },
  sectionsMeta: [
    { id: "hero", name: "Hero Section", order: 1, isVisible: true },
    { id: "journey", name: "PPO Journey (7-Step Stepper)", order: 2, isVisible: true },
    { id: "timelineCalculator", name: "Placement Timeline Calculator", order: 3, isVisible: true },
    { id: "programs", name: "Academic Readiness Programs (1-4 Yr & PPO)", order: 4, isVisible: true },
    { id: "stats", name: "Platform Stats Strip", order: 5, isVisible: true },
    { id: "partners", name: "Hiring Partners Ecosystem", order: 6, isVisible: true },
    { id: "whyUs", name: "Why InterHive / Trust & Differentiation", order: 7, isVisible: true },
    { id: "features", name: "Platform Feature Grid", order: 8, isVisible: true },
    { id: "opportunities", name: "Featured Roles & Opportunities", order: 9, isVisible: true },
    { id: "testimonials", name: "Verified Student Stories", order: 10, isVisible: true },
    { id: "equalOpportunity", name: "Equal Opportunity Guarantee", order: 11, isVisible: true },
    { id: "dualTarget", name: "For Students vs For Companies", order: 12, isVisible: true },
    { id: "faq", name: "Frequently Asked Questions", order: 13, isVisible: true },
    { id: "newsletter", name: "Cohort Alerts / Newsletter", order: 14, isVisible: true },
    { id: "companyBar", name: "Company Outreach Connect Bar", order: 15, isVisible: true },
    { id: "stickyCta", name: "Persistent Sticky Bottom CTA", order: 16, isVisible: true }
  ],
  hero: {
    badgeText: "6-Month Structured PPO Track: 2 Months Training + 4 Months Paid Corporate Internship",
    headlineMain: "From Campus Selection",
    headlineGradient: "to Full-Time PPO.",
    ppoDefinition: "PPO = Pre-Placement Offer: A confirmed job offer secured before your final college semester.",
    description: "Practical 2-month industrial training followed by 4-month paid corporate internships with direct PPO conversion. 100% free for all college students.",
    background: {
      type: "image",
      url: "/interhive_full_bg.png",
      opacity: 0.8,
      overlayGradient: "from-[#EBF3FF]/90 via-[#F4F8FC]/60 to-transparent"
    },
    featureBadges: [
      { title: "Industry Training", subtitle: "by InterHive", icon: "BookOpen" },
      { title: "Corporate", subtitle: "Matching", icon: "Building2" },
      { title: "Mentorship", subtitle: "& Real Projects", icon: "Users" },
      { title: "Paid Internship", subtitle: "& PPO Review", icon: "Briefcase" }
    ],
    ctaButtons: [
      { text: "Join the PPO Track", action: "modal_application", variant: "primary", isVisible: true },
      { text: "2-Min Track Quiz", action: "modal_quiz", variant: "secondary", isVisible: true },
      { text: "Watch Walkthrough", action: "modal_video", variant: "outline", isVisible: true }
    ],
    showcases: [
      {
        id: "fullstack",
        trackName: "PPO Track \u2014 Full Stack Engineering",
        curriculum: "Node.js, React, Microservices & System Design",
        badgeColor: "bg-blue-600",
        badgeInitial: "FS",
        progress: 60,
        currentStage: "Corporate Matching Sprint",
        currentStageDesc: "Completing full-stack production pull-request audits before hiring rounds.",
        modules: "12/12",
        projects: "5/5",
        tests: "8/8",
        stipend: "\u20B935,000 - \u20B945,000 / mo",
        ppoTarget: "\u20B910 - \u20B914 LPA Target"
      },
      {
        id: "cloud",
        trackName: "PPO Track \u2014 Cloud & DevOps Engineering",
        curriculum: "Docker, Kubernetes, AWS & CI/CD Pipelines",
        badgeColor: "bg-purple-600",
        badgeInitial: "CD",
        progress: 85,
        currentStage: "Production Internship Sprint",
        currentStageDesc: "Deploying automated infrastructure with mentor and code reviews.",
        modules: "10/10",
        projects: "4/4",
        tests: "10/10",
        stipend: "\u20B930,000 - \u20B940,000 / mo",
        ppoTarget: "\u20B99 - \u20B912 LPA Target"
      },
      {
        id: "aids",
        trackName: "PPO Track \u2014 Applied AI & Data Science",
        curriculum: "Python, PyTorch, LLMs, Vector DBs & ML APIs",
        badgeColor: "bg-emerald-600",
        badgeInitial: "AI",
        progress: 100,
        currentStage: "PPO Transition & Placement",
        currentStageDesc: "Graduation capstone submitted; preparing for full-time offer onboarding.",
        modules: "14/14",
        projects: "6/6",
        tests: "12/12",
        stipend: "\u20B940,000 - \u20B950,000 / mo",
        ppoTarget: "\u20B912 - \u20B916 LPA Target"
      }
    ]
  },
  journey: {
    tag: "STRUCTURED PATHWAY",
    title: "Your Journey to a PPO",
    subtitle: "A structured 6-month pathway designed for your success.",
    linkText: "See Detailed Program",
    linkUrl: "/programs",
    steps: [
      { stepNumber: "01", title: "Apply & Assessment", description: "Create your profile and complete AI + skill assessments.", badgeColor: "bg-blue-50", icon: "Target" },
      { stepNumber: "02", title: "Selection", description: "Qualified students enter the PPO Track.", badgeColor: "bg-purple-50", icon: "UserCheck" },
      { stepNumber: "03", title: "2-Month Training", description: "Industry-focused training, real projects and mentorship.", badgeColor: "bg-emerald-50", icon: "BookOpen" },
      { stepNumber: "04", title: "Company Matching", description: "Get matched with our partner companies.", badgeColor: "bg-amber-50", icon: "Building2" },
      { stepNumber: "05", title: "4-Month Company Internship", description: "Work on real-world projects at the partner company.", badgeColor: "bg-rose-50", icon: "Briefcase" },
      { stepNumber: "06", title: "Performance Evaluation", description: "Ongoing reviews and final evaluation.", badgeColor: "bg-indigo-50", icon: "TrendingUp" },
      { stepNumber: "07", title: "PPO", description: "Receive a Pre-Placement Offer based on performance.", badgeColor: "bg-blue-100", icon: "Trophy" }
    ],
    featurePills: [
      { icon: "Building2", title: "Verified Partner Network", desc: "Direct corporate internship scopes" },
      { icon: "Layers", title: "Industry-Ready Training", desc: "Hands-on, practical learning" },
      { icon: "Code", title: "Real Project Experience", desc: "Build a strong portfolio" },
      { icon: "Users", title: "Dedicated Mentorship", desc: "Guidance from industry experts" }
    ]
  },
  whyUs: {
    tag: "TRUST & DIFFERENTIATION",
    title: "Why InterHive?",
    subtitle: "Honest, outcome-driven preparation connecting motivated students with forward-thinking companies.",
    storyLinkText: "Learn our story",
    storyLinkUrl: "/about",
    cards: [
      {
        icon: "CheckCircle2",
        title: "Structured Readiness Assessment",
        description: "We do not just list roles \u2014 we help you prepare for them first.",
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600"
      },
      {
        icon: "Layers",
        title: "Curated, Matched Opportunities",
        description: "Roles matched to your actual skills, not a generic job board.",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600"
      },
      {
        icon: "Briefcase",
        title: "Real, Project-Based Experience",
        description: "Internships built around real work, so companies get interns who are actually ready to contribute.",
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600"
      }
    ]
  },
  features: {
    tag: "PLATFORM FOR A BETTER TOMORROW",
    headlineMain: "Everything You Need to",
    headlineGradient: "Build Your Career",
    cursiveText: "Real Projects. Real Experience. Real Growth.",
    cards: [
      {
        icon: "GraduationCap",
        title: "Internships",
        description: "Get hands-on experience with real-world projects from top companies.",
        linkUrl: "#explore-opportunities",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600"
      },
      {
        icon: "Briefcase",
        title: "Jobs",
        description: "Find full-time opportunities and kickstart your professional journey.",
        linkUrl: "#explore-opportunities",
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600"
      },
      {
        icon: "Building2",
        title: "Top Companies",
        description: "Work with the best. From startups to global tech giants.",
        linkUrl: "#",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600"
      },
      {
        icon: "TrendingUp",
        title: "Skill Development",
        description: "Access curated learning paths, workshops and resources.",
        linkUrl: "#",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600"
      }
    ]
  },
  equalOpportunity: {
    title: "100% Equal Opportunity \u2022 Merit & Practical Skills First",
    description: "Whether you are from a tier-1 institute or a tier-3 college, your practical assessment scores and demonstrated project work determine your company matching.",
    buttonText: "Start Free Assessment \u2192"
  },
  dualTarget: {
    studentCard: {
      tag: "FOR ASPIRING TALENT",
      title: "For Students",
      description: "Build real, job-ready skills and get matched to internships that actually lead somewhere.",
      buttonText: "Explore Internships",
      buttonLink: "#explore-opportunities",
      sublinkText: "View training tracks & programs \u2192",
      sublinkUrl: "/programs"
    },
    companyCard: {
      tag: "FOR HIRING PARTNERS",
      title: "For Companies",
      description: "Hire interns who have already been trained and assessed \u2014 not just resumes, but real, demonstrated skills.",
      buttonText: "Hire Interns",
      sublinkText: "Learn about hiring partnership \u2192",
      sublinkUrl: "/contact"
    }
  },
  faq: {
    tag: "COMMON QUESTIONS",
    title: "Frequently Asked Questions",
    subtitle: "Clear, honest answers about how InterHive works.",
    helpLinkText: "Reach out to our team",
    helpLinkUrl: "/contact",
    items: [
      {
        question: "Is InterHive free for students?",
        answer: "Yes. Creating an account, taking our readiness assessment, and applying for internships through InterHive is completely free for students. We are committed to keeping career development accessible to all learners."
      },
      {
        question: "How does the matching process work?",
        answer: "Instead of generic keyword matching, we evaluate your practical technical readiness and connect you directly with internships and companies looking for your specific skill profile.",
        linkText: "View our programs & tracks",
        linkUrl: "/programs"
      },
      {
        question: "What happens if I do not get placed?",
        answer: "If you are not matched right away, you receive actionable feedback on skill gaps along with recommended learning paths on our Programs page so you can level up and re-apply for upcoming cohorts.",
        linkText: "Explore learning paths",
        linkUrl: "/programs"
      },
      {
        question: "How are companies and interns verified on InterHive?",
        answer: "We review company postings to verify real project scopes and fair stipends. For candidates, our practical assessments evaluate fundamental engineering skills before connecting them with hiring partners."
      },
      {
        question: "Do I need prior experience to apply?",
        answer: "No prior internship or professional work experience is required. As long as you have learned core fundamentals in your domain, our readiness assessment helps you demonstrate that ability to employers."
      }
    ]
  },
  newsletter: {
    badge: "Placement & Batch Alerts",
    title: "Never Miss a New Cohort or Corporate Opening",
    subtitle: "Get instant email alerts when new internship roles, assessment windows, and hiring drives open for your college batch.",
    placeholder: "Enter your college email address",
    buttonText: "Get Role Alerts",
    successMessage: "You're subscribed! We'll alert you the moment new cohort roles open."
  },
  stickyCta: {
    title: "6-Month PPO Track",
    badge: "100% Free",
    subtitle: "2 Months Training + 4 Months Company Internship \u2022 Direct PPO Evaluation",
    buttonText: "Apply Free",
    isVisible: true
  }
};

// src/constants/pricing.defaults.ts
var DEFAULT_PROGRAM_PRICINGS = [
  {
    programKey: "ONE_YEAR",
    title: "1-Year Program",
    duration: "1 Academic Year",
    description: "Exclusively for final-year students (Batch 2027). A focused industry-readiness and placement accelerator preparing graduating engineers for internships, interviews, and immediate corporate hiring.",
    originalPrice: 7999,
    promotionalPrice: 5999,
    currency: "INR",
    isActive: true,
    taxPercentage: 0,
    taxIncluded: true,
    eligibilityBatch: "Final Year Students Only (Batch 2027)",
    features: [
      "1 Quality Corporate Internship opportunity with stipend",
      "Production agile sprints & code reviews",
      "Resume rebuild, GitHub dossier & LinkedIn audit",
      "Direct matchmaking with partner tech companies",
      "Mock technical & HR interview rounds"
    ],
    paymentPlans: [
      {
        id: "plan_1y_full",
        name: "Full One-Time Payment",
        type: "FULL",
        installmentsCount: 1,
        amountPerInstallment: 5999,
        intervalMonths: 0,
        description: "Complete program access in one single discounted payment"
      },
      {
        id: "plan_1y_inst",
        name: "2 Monthly Installments",
        type: "INSTALLMENT",
        installmentsCount: 2,
        amountPerInstallment: 3199,
        intervalMonths: 1,
        description: "Split into 2 flexible monthly payments (\u20B93,199 \xD7 2)"
      }
    ],
    pricingVersion: 1
  },
  {
    programKey: "TWO_YEAR",
    title: "2-Year Program",
    duration: "2 Academic Years",
    description: "Exclusively for 3rd-year students (Batch 2028). Fast-track industrial training and internships in your 3rd year, converting into a 4th-year high-quality paid corporate internship and confirmed PPO.",
    originalPrice: 14999,
    promotionalPrice: 10999,
    currency: "INR",
    isActive: true,
    taxPercentage: 0,
    taxIncluded: true,
    eligibilityBatch: "3rd Year Students Only (Batch 2028)",
    features: [
      "2 Industry training & internship opportunities in 3rd year",
      "1 High-quality Paid Corporate Internship in 4th year",
      "Real agile sprints, Jira ticketing & PR reviews",
      "System architecture, REST APIs & database indexing",
      "Placement drives & direct employer matchmaking"
    ],
    paymentPlans: [
      {
        id: "plan_2y_full",
        name: "Full One-Time Payment",
        type: "FULL",
        installmentsCount: 1,
        amountPerInstallment: 10999,
        intervalMonths: 0,
        description: "Best value for 2 full academic years"
      },
      {
        id: "plan_2y_annual",
        name: "Annual Payment",
        type: "ANNUAL",
        installmentsCount: 2,
        amountPerInstallment: 5999,
        intervalMonths: 12,
        description: "Pay yearly at beginning of each academic year (\u20B95,999 / year)"
      },
      {
        id: "plan_2y_inst",
        name: "4 Easy Installments",
        type: "INSTALLMENT",
        installmentsCount: 4,
        amountPerInstallment: 2999,
        intervalMonths: 3,
        description: "Quarterly payment plan (\u20B92,999 \xD7 4)"
      }
    ],
    pricingVersion: 1
  },
  {
    programKey: "THREE_YEAR",
    title: "3-Year Program",
    duration: "3 Academic Years",
    description: "Exclusively for 2nd-year students (Batch 2029). Progressively build corporate workflows, advanced full-stack skills, 4 industrial internships, and 4th-year paid corporate placement.",
    originalPrice: 21999,
    promotionalPrice: 15999,
    currency: "INR",
    isActive: true,
    taxPercentage: 0,
    taxIncluded: true,
    eligibilityBatch: "2nd Year Students Only (Batch 2029)",
    features: [
      "4 Industrial Internships across 2nd & 3rd year",
      "1 High-Quality Paid Corporate Internship in 4th year",
      "Cloud infrastructure, Docker, CI/CD pipelines & microservices",
      "Direct hiring drives with partner tech companies",
      "Pre-Placement Offer (PPO) conversion support"
    ],
    paymentPlans: [
      {
        id: "plan_3y_full",
        name: "Full One-Time Payment",
        type: "FULL",
        installmentsCount: 1,
        amountPerInstallment: 15999,
        intervalMonths: 0,
        description: "Save maximum with one-time payment for 3 academic years"
      },
      {
        id: "plan_3y_annual",
        name: "Annual Payment",
        type: "ANNUAL",
        installmentsCount: 3,
        amountPerInstallment: 5799,
        intervalMonths: 12,
        description: "Pay yearly at beginning of each academic year (\u20B95,799 \xD7 3)"
      },
      {
        id: "plan_3y_inst",
        name: "6 Bi-Monthly Installments",
        type: "INSTALLMENT",
        installmentsCount: 6,
        amountPerInstallment: 2999,
        intervalMonths: 2,
        description: "Flexible installment schedule (\u20B92,999 \xD7 6)"
      }
    ],
    pricingVersion: 1
  },
  {
    programKey: "FOUR_YEAR",
    title: "4-Year Program",
    duration: "4 Academic Years",
    description: "Exclusively for 1st-year students (Batch 2030). A complete 4-year degree-parallel transformation from engineering foundations to 4 industrial internships and final paid placement.",
    originalPrice: 29999,
    promotionalPrice: 21999,
    currency: "INR",
    isActive: true,
    taxPercentage: 0,
    taxIncluded: true,
    eligibilityBatch: "1st Year Students Only (Batch 2030)",
    features: [
      "Foundation + 4 Industrial Internships + 1 Paid Corporate Internship",
      "Core algorithms, system design, microservices & cloud deployment",
      "4 Years of continuous senior engineering mentorship",
      "100% Guaranteed corporate interview loops",
      "Pre-Placement Offer (PPO) finalization upon graduation"
    ],
    paymentPlans: [
      {
        id: "plan_4y_full",
        name: "Full One-Time Payment",
        type: "FULL",
        installmentsCount: 1,
        amountPerInstallment: 21999,
        intervalMonths: 0,
        description: "Complete 4-year degree-parallel track in one payment"
      },
      {
        id: "plan_4y_annual",
        name: "Annual Payment Plan",
        type: "ANNUAL",
        installmentsCount: 4,
        amountPerInstallment: 5999,
        intervalMonths: 12,
        description: "Pay once per academic year (\u20B95,999 \xD7 4)"
      },
      {
        id: "plan_4y_inst",
        name: "8 Semester Installments",
        type: "INSTALLMENT",
        installmentsCount: 8,
        amountPerInstallment: 3199,
        intervalMonths: 6,
        description: "Pay per semester over 4 years (\u20B93,199 \xD7 8)"
      }
    ],
    pricingVersion: 1
  },
  {
    programKey: "PPO",
    title: "PPO Program",
    duration: "8 Months (2 Mo InterHive + 6 Mo Company)",
    description: "Exclusively for final-year students (Batch 2027): 2 months intensive training & readiness done by the InterHive platform, followed by an assured opportunity to get a 6-month corporate internship at any partner company leading directly to Pre-Placement Offers (PPO).",
    originalPrice: 4999,
    promotionalPrice: 2999,
    currency: "INR",
    isActive: true,
    taxPercentage: 0,
    taxIncluded: true,
    eligibilityBatch: "Final Year Students Only (Batch 2027)",
    features: [
      "2 Months Training & Readiness by InterHive Platform",
      "Assured opportunity to get a 6-Month Corporate Internship at Any Partner Company",
      "Monthly corporate internship stipend paid directly by partner company",
      "InterHive Industry-Readiness Certification & Verified Benchmark Scorecard",
      "Direct PPO conversion for immediate full-time employment upon graduation"
    ],
    paymentPlans: [
      {
        id: "plan_ppo_full",
        name: "Full One-Time Fast-Track",
        type: "FULL",
        installmentsCount: 1,
        amountPerInstallment: 2999,
        intervalMonths: 0,
        description: "Immediate access to the 2-Month InterHive sprint and company matching"
      }
    ],
    pricingVersion: 1
  }
];
var DEFAULT_COUPONS = [
  {
    code: "INTERHIVE10",
    name: "General Platform Launch Offer",
    description: "10% discount across all program enrollments",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountAmount: 2e3,
    minOrderValue: 2e3,
    applicablePrograms: [],
    startDate: new Date(Date.now() - 7 * 864e5).toISOString(),
    expiryDate: new Date(Date.now() + 180 * 864e5).toISOString(),
    totalUsageLimit: 500,
    perUserLimit: 1,
    firstTimeOnly: false,
    allowStacking: false,
    isActive: true,
    isPaused: false
  },
  {
    code: "FIRSTBATCH",
    name: "First Batch Launch Discount",
    description: "20% special launch discount for early adopters",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscountAmount: 4e3,
    minOrderValue: 3e3,
    applicablePrograms: [],
    startDate: new Date(Date.now() - 7 * 864e5).toISOString(),
    expiryDate: new Date(Date.now() + 60 * 864e5).toISOString(),
    totalUsageLimit: 200,
    perUserLimit: 1,
    firstTimeOnly: true,
    allowStacking: false,
    isActive: true,
    isPaused: false
  },
  {
    code: "CAMPUS15",
    name: "College Partnership Campus Offer",
    description: "15% discount for partnered college students",
    discountType: "PERCENTAGE",
    discountValue: 15,
    maxDiscountAmount: 3e3,
    minOrderValue: 2500,
    applicablePrograms: [],
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    expiryDate: new Date(Date.now() + 90 * 864e5).toISOString(),
    totalUsageLimit: 300,
    perUserLimit: 1,
    firstTimeOnly: false,
    allowStacking: false,
    isActive: true,
    isPaused: false
  },
  {
    code: "ANKIT500",
    name: "Referral Campaign Flat Discount",
    description: "Flat \u20B9500 off on any program enrollment",
    discountType: "FIXED",
    discountValue: 500,
    maxDiscountAmount: 500,
    minOrderValue: 2500,
    applicablePrograms: [],
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    expiryDate: new Date(Date.now() + 120 * 864e5).toISOString(),
    totalUsageLimit: 100,
    perUserLimit: 1,
    firstTimeOnly: false,
    allowStacking: false,
    isActive: true,
    isPaused: false
  },
  {
    code: "DIWALI20",
    name: "Festival Special Discount",
    description: "20% festive discount on career accelerator tracks",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscountAmount: 4500,
    minOrderValue: 4e3,
    applicablePrograms: [],
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    expiryDate: new Date(Date.now() + 45 * 864e5).toISOString(),
    totalUsageLimit: 150,
    perUserLimit: 1,
    firstTimeOnly: false,
    allowStacking: false,
    isActive: true,
    isPaused: false
  },
  {
    code: "EARLY1000",
    name: "Early Bird Registration",
    description: "Flat \u20B91,000 instant discount on multi-year tracks",
    discountType: "FIXED",
    discountValue: 1e3,
    maxDiscountAmount: 1e3,
    minOrderValue: 7e3,
    applicablePrograms: ["TWO_YEAR", "THREE_YEAR", "FOUR_YEAR"],
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    expiryDate: new Date(Date.now() + 90 * 864e5).toISOString(),
    totalUsageLimit: 250,
    perUserLimit: 1,
    firstTimeOnly: false,
    allowStacking: false,
    isActive: true,
    isPaused: false
  }
];
var DEFAULT_CAMPAIGNS = [
  {
    name: "Early Bird Registration Campaign",
    description: "Automatic 15% discount for early enrollments",
    campaignType: "EARLY_BIRD",
    discountType: "PERCENTAGE",
    discountValue: 15,
    maxDiscount: 3500,
    minOrderValue: 5e3,
    eligiblePrograms: [],
    startDate: new Date(Date.now() - 3 * 864e5).toISOString(),
    endDate: new Date(Date.now() + 30 * 864e5).toISOString(),
    budgetCap: 1e5,
    isActive: false
    // Inactive by default so admin can toggle
  },
  {
    name: "First Batch Launch Offer",
    description: "Automatic 20% discount on initial cohort",
    campaignType: "LAUNCH",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscount: 5e3,
    minOrderValue: 5e3,
    eligiblePrograms: [],
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 45 * 864e5).toISOString(),
    budgetCap: 15e4,
    isActive: false
  }
];
export {
  ADMIN_PERMISSIONS,
  ALL_PROGRAM_KEYS,
  APPLICATION_STATUS,
  ASSESSMENT_STATUS,
  ATTENDANCE_STATUS,
  AttendanceStatus,
  COMPANY_PERMISSIONS,
  COMPANY_STATUS,
  DEFAULT_CAMPAIGNS,
  DEFAULT_COUPONS,
  DEFAULT_LANDING_CMS_CONFIG,
  DEFAULT_PROGRAM_PRICINGS,
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
};
//# sourceMappingURL=index.mjs.map