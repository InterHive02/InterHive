// src/types/common.types.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "admin";
  UserRole2["HR"] = "hr";
  UserRole2["MANAGER"] = "manager";
  UserRole2["STUDENT"] = "student";
  UserRole2["INTERN"] = "intern";
  UserRole2["COMPANY"] = "company";
  return UserRole2;
})(UserRole || {});
var UserAccessLevel = /* @__PURE__ */ ((UserAccessLevel2) => {
  UserAccessLevel2["BASIC"] = "BASIC";
  UserAccessLevel2["PREMIUM"] = "PREMIUM";
  return UserAccessLevel2;
})(UserAccessLevel || {});
var InternWorkflowStatus = /* @__PURE__ */ ((InternWorkflowStatus2) => {
  InternWorkflowStatus2["FREE"] = "FREE";
  InternWorkflowStatus2["APPLIED"] = "APPLIED";
  InternWorkflowStatus2["INTERVIEW"] = "INTERVIEW";
  InternWorkflowStatus2["SELECTED"] = "SELECTED";
  InternWorkflowStatus2["ACTIVE"] = "ACTIVE";
  InternWorkflowStatus2["COMPLETED"] = "COMPLETED";
  InternWorkflowStatus2["REVOKED"] = "REVOKED";
  return InternWorkflowStatus2;
})(InternWorkflowStatus || {});
var ProgramType = /* @__PURE__ */ ((ProgramType2) => {
  ProgramType2["ONE_YEAR"] = "ONE_YEAR";
  ProgramType2["TWO_YEAR"] = "TWO_YEAR";
  ProgramType2["THREE_YEAR"] = "THREE_YEAR";
  ProgramType2["FOUR_YEAR"] = "FOUR_YEAR";
  return ProgramType2;
})(ProgramType || {});
var AcademicYear = /* @__PURE__ */ ((AcademicYear2) => {
  AcademicYear2["FIRST_YEAR"] = "1st";
  AcademicYear2["SECOND_YEAR"] = "2nd";
  AcademicYear2["THIRD_YEAR"] = "3rd";
  AcademicYear2["FINAL_YEAR"] = "Final";
  return AcademicYear2;
})(AcademicYear || {});
var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["ACTIVE"] = "active";
  UserStatus2["INACTIVE"] = "inactive";
  UserStatus2["SUSPENDED"] = "suspended";
  UserStatus2["PENDING"] = "pending";
  return UserStatus2;
})(UserStatus || {});
var Gender = /* @__PURE__ */ ((Gender2) => {
  Gender2["MALE"] = "male";
  Gender2["FEMALE"] = "female";
  Gender2["OTHER"] = "other";
  Gender2["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
  return Gender2;
})(Gender || {});
var EmploymentType = /* @__PURE__ */ ((EmploymentType2) => {
  EmploymentType2["FULL_TIME"] = "full-time";
  EmploymentType2["PART_TIME"] = "part-time";
  EmploymentType2["CONTRACT"] = "contract";
  EmploymentType2["INTERNSHIP"] = "internship";
  EmploymentType2["FREELANCE"] = "freelance";
  return EmploymentType2;
})(EmploymentType || {});
var SkillLevel = /* @__PURE__ */ ((SkillLevel2) => {
  SkillLevel2["BEGINNER"] = "beginner";
  SkillLevel2["INTERMEDIATE"] = "intermediate";
  SkillLevel2["ADVANCED"] = "advanced";
  SkillLevel2["EXPERT"] = "expert";
  return SkillLevel2;
})(SkillLevel || {});
var AssessmentType = /* @__PURE__ */ ((AssessmentType2) => {
  AssessmentType2["TECHNICAL"] = "technical";
  AssessmentType2["SOFT_SKILLS"] = "soft_skills";
  AssessmentType2["APTITUDE"] = "aptitude";
  AssessmentType2["BEHAVIORAL"] = "behavioral";
  AssessmentType2["CODING"] = "coding";
  AssessmentType2["PROJECT"] = "project";
  return AssessmentType2;
})(AssessmentType || {});
var AssessmentStatus = /* @__PURE__ */ ((AssessmentStatus2) => {
  AssessmentStatus2["PENDING"] = "pending";
  AssessmentStatus2["IN_PROGRESS"] = "in_progress";
  AssessmentStatus2["COMPLETED"] = "completed";
  AssessmentStatus2["EVALUATED"] = "evaluated";
  AssessmentStatus2["EXPIRED"] = "expired";
  return AssessmentStatus2;
})(AssessmentStatus || {});
var NotificationCategory = /* @__PURE__ */ ((NotificationCategory2) => {
  NotificationCategory2["SYSTEM"] = "system";
  NotificationCategory2["ASSESSMENT"] = "assessment";
  NotificationCategory2["TRAINING"] = "training";
  NotificationCategory2["PROJECT"] = "project";
  NotificationCategory2["MATCHING"] = "matching";
  NotificationCategory2["INTERVIEW"] = "interview";
  NotificationCategory2["HIRING"] = "hiring";
  NotificationCategory2["MESSAGE"] = "message";
  NotificationCategory2["REMINDER"] = "reminder";
  return NotificationCategory2;
})(NotificationCategory || {});
var NotificationPriority = /* @__PURE__ */ ((NotificationPriority2) => {
  NotificationPriority2["LOW"] = "low";
  NotificationPriority2["MEDIUM"] = "medium";
  NotificationPriority2["HIGH"] = "high";
  NotificationPriority2["URGENT"] = "urgent";
  return NotificationPriority2;
})(NotificationPriority || {});

// src/types/intern.types.ts
var InternStatus = /* @__PURE__ */ ((InternStatus2) => {
  InternStatus2["REGISTERED"] = "registered";
  InternStatus2["ASSESSED"] = "assessed";
  InternStatus2["TRAINING"] = "training";
  InternStatus2["PROJECT"] = "project";
  InternStatus2["READY"] = "ready";
  InternStatus2["PLACED"] = "placed";
  InternStatus2["COMPLETED"] = "completed";
  InternStatus2["DROPPED"] = "dropped";
  return InternStatus2;
})(InternStatus || {});
var ApplicationStatus = /* @__PURE__ */ ((ApplicationStatus2) => {
  ApplicationStatus2["PENDING"] = "pending";
  ApplicationStatus2["UNDER_REVIEW"] = "under_review";
  ApplicationStatus2["ASSESSMENT"] = "assessment";
  ApplicationStatus2["INTERVIEW"] = "interview";
  ApplicationStatus2["OFFERED"] = "offered";
  ApplicationStatus2["ACCEPTED"] = "accepted";
  ApplicationStatus2["REJECTED"] = "rejected";
  ApplicationStatus2["WITHDRAWN"] = "withdrawn";
  return ApplicationStatus2;
})(ApplicationStatus || {});

// src/types/company.types.ts
var RequirementStatus = /* @__PURE__ */ ((RequirementStatus2) => {
  RequirementStatus2["DRAFT"] = "draft";
  RequirementStatus2["PUBLISHED"] = "published";
  RequirementStatus2["CLOSED"] = "closed";
  RequirementStatus2["FILLED"] = "filled";
  RequirementStatus2["CANCELLED"] = "cancelled";
  return RequirementStatus2;
})(RequirementStatus || {});
var CompanyStatus = /* @__PURE__ */ ((CompanyStatus2) => {
  CompanyStatus2["PENDING"] = "pending";
  CompanyStatus2["VERIFIED"] = "verified";
  CompanyStatus2["ACTIVE"] = "active";
  CompanyStatus2["SUSPENDED"] = "suspended";
  CompanyStatus2["INACTIVE"] = "inactive";
  return CompanyStatus2;
})(CompanyStatus || {});

// src/types/project.types.ts
var TaskStatus = /* @__PURE__ */ ((TaskStatus2) => {
  TaskStatus2["TO_DO"] = "to_do";
  TaskStatus2["IN_PROGRESS"] = "in_progress";
  TaskStatus2["REVIEW"] = "review";
  TaskStatus2["COMPLETED"] = "completed";
  TaskStatus2["BLOCKED"] = "blocked";
  return TaskStatus2;
})(TaskStatus || {});
var ProjectStatus = /* @__PURE__ */ ((ProjectStatus2) => {
  ProjectStatus2["PLANNING"] = "planning";
  ProjectStatus2["IN_PROGRESS"] = "in_progress";
  ProjectStatus2["COMPLETED"] = "completed";
  ProjectStatus2["PAUSED"] = "paused";
  ProjectStatus2["CANCELLED"] = "cancelled";
  return ProjectStatus2;
})(ProjectStatus || {});
var ProjectPhase = /* @__PURE__ */ ((ProjectPhase2) => {
  ProjectPhase2["INITIATION"] = "initiation";
  ProjectPhase2["PLANNING"] = "planning";
  ProjectPhase2["EXECUTION"] = "execution";
  ProjectPhase2["MONITORING"] = "monitoring";
  ProjectPhase2["CLOSURE"] = "closure";
  return ProjectPhase2;
})(ProjectPhase || {});

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

// src/utils/validators.ts
var Validators = class {
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  static isPhoneNumber(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
  static isUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
  static isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  static isDateString(date) {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
  static isPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
  static isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return strongRegex.test(password);
  }
  static isUrlSafeString(str) {
    return /^[a-zA-Z0-9_-]+$/.test(str);
  }
  static isAlphaNumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
  }
  static isValidName(name) {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s']+$/.test(name);
  }
  static isValidSkillLevel(level) {
    return ["beginner", "intermediate", "advanced", "expert"].includes(level);
  }
  static isValidEnum(value, enumType) {
    return Object.values(enumType).includes(value);
  }
  static isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
  static isPositiveNumber(value) {
    return typeof value === "number" && value > 0;
  }
  static isValidRange(min, max, value) {
    return value >= min && value <= max;
  }
  static isValidPercentage(value) {
    return value >= 0 && value <= 100;
  }
  static isValidScore(value) {
    return value >= 0 && value <= 10;
  }
  static isValidDateRange(startDate, endDate) {
    return startDate < endDate;
  }
  static isValidFileType(mimeType) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/json",
      "text/csv"
    ];
    return allowed.includes(mimeType);
  }
  static isValidFileSize(size, maxSizeInMB = 5) {
    return size <= maxSizeInMB * 1024 * 1024;
  }
  static sanitizeString(input) {
    return input.trim().replace(/[<>]/g, "");
  }
  static sanitizeEmail(email) {
    return email.trim().toLowerCase();
  }
  static capitalizeWords(str) {
    return str.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
  }
  static truncateString(str, maxLength = 100) {
    if (str.length <= maxLength)
      return str;
    return str.substring(0, maxLength) + "...";
  }
};

// src/utils/formatters.ts
var Formatters = class {
  static formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  static formatDateTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static formatTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static formatRelativeTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1e3);
    if (diffInSeconds < 60)
      return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592e3)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536e3)
      return `${Math.floor(diffInSeconds / 2592e3)} months ago`;
    return `${Math.floor(diffInSeconds / 31536e3)} years ago`;
  }
  static formatCurrency(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }
  static formatPhoneNumber(phone) {
    if (!phone)
      return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  }
  static formatReadabilityScore(score) {
    if (score >= 90)
      return "Excellent";
    if (score >= 75)
      return "Good";
    if (score >= 60)
      return "Average";
    if (score >= 40)
      return "Below Average";
    return "Needs Improvement";
  }
  static getScoreColor(score) {
    if (score >= 75)
      return "green";
    if (score >= 50)
      return "yellow";
    return "red";
  }
  static formatFileSize(bytes) {
    if (bytes === 0)
      return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
  static formatDuration(minutes) {
    if (minutes < 60)
      return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0)
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours}h ${mins}m`;
  }
  static formatSkillLevel(level) {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }
  static formatStatus(status) {
    return status.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  static truncateString(str, maxLength = 100) {
    if (!str)
      return "";
    if (str.length <= maxLength)
      return str;
    return str.substring(0, maxLength) + "...";
  }
  static capitalizeFirstLetter(str) {
    if (!str)
      return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static toSlug(str) {
    return str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
  }
  static generateCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// src/utils/helpers.ts
var Helpers = class {
  static generateId() {
    return crypto.randomUUID();
  }
  static generateCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  static generateSlug(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
  }
  static calculateAge(dateOfBirth) {
    const today = /* @__PURE__ */ new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dateOfBirth.getDate()) {
      age--;
    }
    return age;
  }
  static getDaysBetweenDates(date1, date2) {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diff / (1e3 * 3600 * 24));
  }
  static getBusinessDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6)
        count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  static isValidPhone(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
  static maskEmail(email) {
    if (!email)
      return "";
    const [local, domain] = email.split("@");
    if (local.length <= 3)
      return `${local.slice(0, 1)}***@${domain}`;
    return `${local.slice(0, 3)}***@${domain}`;
  }
  static maskPhone(phone) {
    if (!phone)
      return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 4)
      return "****";
    return `****${cleaned.slice(-4)}`;
  }
  static calculatePercentage(value, total) {
    if (total === 0)
      return 0;
    return Math.round(value / total * 100);
  }
  static average(numbers) {
    if (numbers.length === 0)
      return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  }
  static weightedAverage(values, weights) {
    if (values.length !== weights.length || values.length === 0) {
      throw new Error("Invalid input arrays");
    }
    const sum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    return sum / totalWeight;
  }
  static chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  static groupBy(array, key) {
    return array.reduce((acc, item) => {
      const group = String(item[key]);
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, {});
  }
  static sortBy(array, key, order = "asc") {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal)
        return order === "asc" ? -1 : 1;
      if (aVal > bVal)
        return order === "asc" ? 1 : -1;
      return 0;
    });
  }
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  static isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  static pick(obj, keys) {
    const result = {};
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }
  static omit(obj, keys) {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }
  static getEnumValues(enumType) {
    return Object.values(enumType);
  }
  static getEnumKeys(enumType) {
    return Object.keys(enumType);
  }
  static debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  static throttle(fn, limit) {
    let inThrottle = false;
    return function(...args) {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};
export {
  ADMIN_PERMISSIONS,
  APPLICATION_STATUS,
  ASSESSMENT_STATUS,
  ATTENDANCE_STATUS,
  AcademicYear,
  ApplicationStatus,
  AssessmentStatus,
  AssessmentType,
  AttendanceStatus,
  COMPANY_PERMISSIONS,
  COMPANY_STATUS,
  CompanyStatus,
  DEFAULT_ROUTES,
  DOMAIN_SKILLS,
  EmploymentType,
  Formatters,
  Gender,
  HR_PERMISSIONS,
  Helpers,
  INTERN_PERMISSIONS,
  INTERN_STATUS,
  InternStatus,
  InternWorkflowStatus,
  MANAGER_PERMISSIONS,
  MatchStatus,
  NotificationCategory,
  NotificationPriority,
  PERMISSIONS,
  PROGRAM_CONFIGS,
  PROGRAM_DISCLAIMER,
  PROGRAM_ELIGIBILITY_MATRIX,
  PROGRAM_TYPES,
  PROJECT_STATUS,
  ProgramType,
  ProjectPhase,
  ProjectStatus,
  ROLES,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  RequirementStatus,
  SKILL_CATEGORIES,
  SKILL_DEFINITIONS,
  SkillLevel,
  TASK_STATUS,
  TaskStatus,
  UserAccessLevel,
  UserRole,
  UserStatus,
  Validators
};
//# sourceMappingURL=index.mjs.map