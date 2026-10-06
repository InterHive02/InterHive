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
  TASK_STATUS: () => TASK_STATUS
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
  FOUR_YEAR: "FOUR_YEAR"
};
var PROGRAM_CONFIGS = {
  ONE_YEAR: {
    id: "ONE_YEAR",
    title: "1-Year Program",
    duration: "1 Academic Year",
    targetAcademicYear: "Final Year",
    allowedAcademicYears: ["Final", "4th", "Final Year", "4th Year"],
    shortDescription: "A focused industry-readiness program for final-year students preparing for internships, placements and careers.",
    mainObjective: "To make final-year students internship and placement ready.",
    summaryFocus: "Internship + Placement Readiness",
    summaryTarget: "1 Quality Internship + Placement Guidance",
    badge: "Final Year Focus",
    roadmap: [
      {
        yearLabel: "Final Year",
        stageName: "Placement & Internship Conversion",
        targetFocus: "Industry-Oriented Training & Hiring Readiness",
        targetCount: "1 Quality Internship + Placement Preparation",
        activities: [
          "Industry-oriented technical training",
          "Company readiness preparation",
          "Placement-focused guidance",
          "Internship preparation & matching",
          "1 Quality Internship opportunity",
          "Resume & LinkedIn optimization",
          "Coding & technical interview preparation",
          "HR interview preparation",
          "Placement & hiring guidance"
        ]
      }
    ]
  },
  TWO_YEAR: {
    id: "TWO_YEAR",
    title: "2-Year Program",
    duration: "2 Academic Years",
    targetAcademicYear: "Third Year",
    allowedAcademicYears: ["3rd", "3rd Year", "Third Year", "Final", "4th", "Final Year"],
    shortDescription: "Start in your third year and build industry experience through training, internships and final-year placement preparation.",
    mainObjective: "Progressive technical mastery and paid internship conversion.",
    summaryFocus: "Industry Training + Internships + Paid Internship",
    summaryTarget: "2 Training/Internships (3rd Yr) + 1 Paid Internship (4th Yr)",
    badge: "3rd / Final Year",
    roadmap: [
      {
        yearLabel: "Third Year",
        stageName: "Industrial Training & Experience",
        targetFocus: "Practical Skills & Industrial Exposure",
        targetCount: "2 Industry Training / Internship Opportunities",
        activities: [
          "Industrial training sprints",
          "Internship opportunities",
          "Practical & industry-grade projects",
          "Company workflow exposure",
          "Technical & professional skill development",
          "Internship guidance & mentor support"
        ]
      },
      {
        yearLabel: "Final Year",
        stageName: "Paid Internship & Hiring Conversion",
        targetFocus: "Placement Preparation & Corporate Hires",
        targetCount: "1 High-Quality Paid Internship",
        activities: [
          "Advanced industry preparation",
          "Placement preparation",
          "1 High-quality Paid Internship",
          "Advanced technical & coding preparation",
          "Resume & LinkedIn optimization",
          "Mock interviews & HR preparation",
          "Hiring guidance & company referrals"
        ]
      }
    ]
  },
  THREE_YEAR: {
    id: "THREE_YEAR",
    title: "3-Year Program",
    duration: "3 Academic Years",
    targetAcademicYear: "Second Year",
    allowedAcademicYears: ["2nd", "2nd Year", "Second Year", "3rd", "3rd Year", "Final", "Final Year"],
    shortDescription: "Start from second year and progressively build industry exposure, practical skills, internships and placement readiness.",
    mainObjective: "Early corporate exposure leading up to senior paid internships.",
    summaryFocus: "Early Industry Exposure + Internships + Paid Internship",
    summaryTarget: "4 Industrial Internships (Y2 & Y3) + 1 Paid Internship (Y4)",
    badge: "2nd Year Onwards",
    roadmap: [
      {
        yearLabel: "Second Year",
        stageName: "Early Industry Exposure & Fundamentals",
        targetFocus: "Basic Corporate Workflows & Skill Building",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Industrial training",
          "Internship opportunities",
          "Industrial visits & corporate tours",
          "Industry exposure & company workflow understanding",
          "Technical skill development & project building",
          "Professional communication"
        ]
      },
      {
        yearLabel: "Third Year",
        stageName: "Advanced Industrial Training & Sprints",
        targetFocus: "Full-Stack Development & Real Projects",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Advanced industrial training",
          "Internships in tech domains",
          "Industrial visits & mentor sessions",
          "Industry projects",
          "Technical & professional skill advancement",
          "Placement-oriented preparation"
        ]
      },
      {
        yearLabel: "Final Year",
        stageName: "Paid Internship & Career Placement",
        targetFocus: "Mock Interviews & Corporate Placement",
        targetCount: "1 High-Quality Paid Internship",
        activities: [
          "Advanced placement preparation",
          "1 High-quality Paid Internship",
          "Advanced technical & coding prep",
          "Resume & LinkedIn optimization",
          "Mock interviews & HR preparation",
          "Placement & hiring guidance"
        ]
      }
    ]
  },
  FOUR_YEAR: {
    id: "FOUR_YEAR",
    title: "4-Year Program",
    duration: "4 Academic Years",
    targetAcademicYear: "First Year",
    allowedAcademicYears: ["1st", "1st Year", "First Year", "2nd", "3rd", "Final", "Final Year"],
    shortDescription: "A complete four-year journey from foundation and company readiness to industry exposure, internships and placement preparation.",
    mainObjective: "The complete end-to-end InterHive Industry-Readiness Journey.",
    summaryFocus: "Complete Industry-Readiness Journey",
    summaryTarget: "Foundation + 4 Industrial Internships + 1 Paid Internship",
    badge: "Complete 4-Year Journey",
    roadmap: [
      {
        yearLabel: "First Year",
        stageName: "Foundation & Company Readiness (CRT)",
        targetFocus: "Corporate Culture & Fundamental Skills",
        targetCount: "Company Readiness & CRT Foundation",
        activities: [
          "Industry & company workflow introduction",
          "Understanding internships & recruiter expectations",
          "LinkedIn profile creation & networking basics",
          "Resume basics & professional communication",
          "Email etiquette & interview behavior",
          "Intro to technical skills & career roadmap",
          "Goal setting & personal branding"
        ]
      },
      {
        yearLabel: "Second Year",
        stageName: "Industry Exposure & Hands-On Projects",
        targetFocus: "Practical Skill Building & Site Visits",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Industrial training & internship opportunities",
          "Industrial visits & tech company tours",
          "Practical projects & technical skill development",
          "Professional communication & teamwork",
          "Company workflow exposure"
        ]
      },
      {
        yearLabel: "Third Year",
        stageName: "Advanced Industry Preparation & Coding",
        targetFocus: "Full-Stack Workflows & Technical Sprinting",
        targetCount: "2 Industrial Training / Internship Opportunities",
        activities: [
          "Advanced industrial training & domain internships",
          "Real-world industry projects & site visits",
          "Technical preparation & coding practice",
          "Resume improvement & LinkedIn optimization",
          "Placement preparation"
        ]
      },
      {
        yearLabel: "Fourth Year",
        stageName: "Paid Internship & Full-Time Placement",
        targetFocus: "Corporate Hires & Mock Interviews",
        targetCount: "1 Paid Internship + Placement Readiness",
        activities: [
          "1 High-quality Paid Internship",
          "Advanced technical training & coding prep",
          "Placement preparation & resume finalization",
          "Mock interviews & HR interview prep",
          "Company-specific preparation & hiring guidance"
        ]
      }
    ]
  }
};
var PROGRAM_ELIGIBILITY_MATRIX = {
  "1st": "FOUR_YEAR",
  "1st Year": "FOUR_YEAR",
  "First Year": "FOUR_YEAR",
  "2nd": "THREE_YEAR",
  "2nd Year": "THREE_YEAR",
  "Second Year": "THREE_YEAR",
  "3rd": "TWO_YEAR",
  "3rd Year": "TWO_YEAR",
  "Third Year": "TWO_YEAR",
  "Final": "ONE_YEAR",
  "Final Year": "ONE_YEAR",
  "4th": "ONE_YEAR",
  "4th Year": "ONE_YEAR"
};
var PROGRAM_DISCLAIMER = "Note: The specified number of internships and training opportunities are program targets and roadmap milestones designed to build maximum industry readiness, and do not constitute an unconditional guarantee of placement.";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ADMIN_PERMISSIONS,
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
  TASK_STATUS
});
//# sourceMappingURL=index.js.map