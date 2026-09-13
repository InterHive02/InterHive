declare const ROLES: {
    readonly ADMIN: "admin";
    readonly HR: "hr";
    readonly MANAGER: "manager";
    readonly INTERN: "intern";
    readonly COMPANY: "company";
    readonly MENTOR: "mentor";
    readonly EVALUATOR: "evaluator";
};
type Role = typeof ROLES[keyof typeof ROLES];
declare const ROLE_PERMISSIONS: Record<Role, string[]>;
declare const ROLE_HIERARCHY: {
    readonly admin: 0;
    readonly hr: 1;
    readonly manager: 2;
    readonly mentor: 3;
    readonly evaluator: 4;
    readonly company: 5;
    readonly intern: 6;
};
declare const DEFAULT_ROUTES: {
    readonly admin: "/admin/dashboard";
    readonly hr: "/hr/dashboard";
    readonly manager: "/manager/dashboard";
    readonly intern: "/dashboard";
    readonly company: "/company/dashboard";
    readonly mentor: "/mentor/dashboard";
    readonly evaluator: "/evaluator/dashboard";
};

declare const SKILL_CATEGORIES: {
    readonly PROGRAMMING_LANGUAGES: "programming_languages";
    readonly FRAMEWORKS: "frameworks";
    readonly DATABASES: "databases";
    readonly DEVOPS: "devops";
    readonly CLOUD: "cloud";
    readonly SOFT_SKILLS: "soft_skills";
    readonly DESIGN: "design";
    readonly DATA_SCIENCE: "data_science";
    readonly ML_AI: "ml_ai";
    readonly BLOCKCHAIN: "blockchain";
    readonly MOBILE: "mobile";
    readonly WEB: "web";
    readonly SECURITY: "security";
    readonly NETWORKING: "networking";
};
type SkillCategory = typeof SKILL_CATEGORIES[keyof typeof SKILL_CATEGORIES];
interface SkillDefinition {
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
declare const SKILL_DEFINITIONS: Record<string, SkillDefinition>;
declare const DOMAIN_SKILLS: Record<string, string[]>;

declare const INTERN_STATUS: {
    readonly REGISTERED: "registered";
    readonly ASSESSED: "assessed";
    readonly TRAINING: "training";
    readonly PROJECT: "project";
    readonly READY: "ready";
    readonly PLACED: "placed";
    readonly COMPLETED: "completed";
    readonly DROPPED: "dropped";
};
type InternStatusType = typeof INTERN_STATUS[keyof typeof INTERN_STATUS];
declare const COMPANY_STATUS: {
    readonly PENDING: "pending";
    readonly VERIFIED: "verified";
    readonly ACTIVE: "active";
    readonly SUSPENDED: "suspended";
    readonly INACTIVE: "inactive";
};
type CompanyStatusType = typeof COMPANY_STATUS[keyof typeof COMPANY_STATUS];
declare const PROJECT_STATUS: {
    readonly PLANNING: "planning";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly PAUSED: "paused";
    readonly CANCELLED: "cancelled";
};
type ProjectStatusType = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];
declare const TASK_STATUS: {
    readonly TO_DO: "to_do";
    readonly IN_PROGRESS: "in_progress";
    readonly REVIEW: "review";
    readonly COMPLETED: "completed";
    readonly BLOCKED: "blocked";
};
type TaskStatusType = typeof TASK_STATUS[keyof typeof TASK_STATUS];
declare const ASSESSMENT_STATUS: {
    readonly PENDING: "pending";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly EVALUATED: "evaluated";
    readonly EXPIRED: "expired";
};
type AssessmentStatusType = typeof ASSESSMENT_STATUS[keyof typeof ASSESSMENT_STATUS];
declare const APPLICATION_STATUS: {
    readonly PENDING: "pending";
    readonly UNDER_REVIEW: "under_review";
    readonly ASSESSMENT: "assessment";
    readonly INTERVIEW: "interview";
    readonly OFFERED: "offered";
    readonly ACCEPTED: "accepted";
    readonly REJECTED: "rejected";
    readonly WITHDRAWN: "withdrawn";
};
type ApplicationStatusType = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    HALF_DAY = "half_day",
    ON_LEAVE = "on_leave",
    HOLIDAY = "holiday"
}
declare const ATTENDANCE_STATUS: typeof AttendanceStatus;
type AttendanceStatusType = AttendanceStatus;
declare enum MatchStatus {
    PENDING = "pending",
    MATCHED = "matched",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    INTERVIEW_SCHEDULED = "interview_scheduled",
    OFFER_MADE = "offer_made",
    HIRED = "hired",
    EXPIRED = "expired"
}

declare const PERMISSIONS: {
    readonly CREATE_USER: "create_user";
    readonly VIEW_USERS: "view_users";
    readonly UPDATE_USER: "update_user";
    readonly DELETE_USER: "delete_user";
    readonly ACTIVATE_USER: "activate_user";
    readonly SUSPEND_USER: "suspend_user";
    readonly VIEW_INTERNS: "view_interns";
    readonly CREATE_INTERN: "create_intern";
    readonly UPDATE_INTERN: "update_intern";
    readonly DELETE_INTERN: "delete_intern";
    readonly EVALUATE_INTERN: "evaluate_intern";
    readonly VIEW_INTERN_READINESS: "view_intern_readiness";
    readonly VIEW_COMPANIES: "view_companies";
    readonly CREATE_COMPANY: "create_company";
    readonly UPDATE_COMPANY: "update_company";
    readonly DELETE_COMPANY: "delete_company";
    readonly VERIFY_COMPANY: "verify_company";
    readonly VIEW_ASSESSMENTS: "view_assessments";
    readonly CREATE_ASSESSMENT: "create_assessment";
    readonly UPDATE_ASSESSMENT: "update_assessment";
    readonly DELETE_ASSESSMENT: "delete_assessment";
    readonly TAKE_ASSESSMENT: "take_assessment";
    readonly EVALUATE_ASSESSMENT: "evaluate_assessment";
    readonly VIEW_TRAININGS: "view_trainings";
    readonly CREATE_TRAINING: "create_training";
    readonly UPDATE_TRAINING: "update_training";
    readonly DELETE_TRAINING: "delete_training";
    readonly ENROLL_TRAINING: "enroll_training";
    readonly MANAGE_TRAINING_PROGRESS: "manage_training_progress";
    readonly VIEW_PROJECTS: "view_projects";
    readonly CREATE_PROJECT: "create_project";
    readonly UPDATE_PROJECT: "update_project";
    readonly DELETE_PROJECT: "delete_project";
    readonly ASSIGN_PROJECT: "assign_project";
    readonly SUBMIT_PROJECT_WORK: "submit_project_work";
    readonly REVIEW_PROJECT_WORK: "review_project_work";
    readonly VIEW_OPPORTUNITIES: "view_opportunities";
    readonly CREATE_OPPORTUNITY: "create_opportunity";
    readonly APPLY_OPPORTUNITY: "apply_opportunity";
    readonly VIEW_APPLICATIONS: "view_applications";
    readonly REVIEW_APPLICATION: "review_application";
    readonly SCHEDULE_INTERVIEW: "schedule_interview";
    readonly MAKE_OFFER: "make_offer";
    readonly VIEW_ANALYTICS: "view_analytics";
    readonly VIEW_REPORTS: "view_reports";
    readonly GENERATE_REPORT: "generate_report";
    readonly EXPORT_DATA: "export_data";
    readonly VIEW_SYSTEM_SETTINGS: "view_system_settings";
    readonly UPDATE_SYSTEM_SETTINGS: "update_system_settings";
    readonly VIEW_AUDIT_LOGS: "view_audit_logs";
    readonly MANAGE_BACKUP: "manage_backup";
};
type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
declare const ADMIN_PERMISSIONS: ("view_interns" | "view_companies" | "view_assessments" | "view_trainings" | "view_reports" | "view_analytics" | "view_projects" | "enroll_training" | "view_opportunities" | "view_applications" | "create_user" | "view_users" | "update_user" | "delete_user" | "activate_user" | "suspend_user" | "create_intern" | "update_intern" | "delete_intern" | "evaluate_intern" | "view_intern_readiness" | "create_company" | "update_company" | "delete_company" | "verify_company" | "create_assessment" | "update_assessment" | "delete_assessment" | "take_assessment" | "evaluate_assessment" | "create_training" | "update_training" | "delete_training" | "manage_training_progress" | "create_project" | "update_project" | "delete_project" | "assign_project" | "submit_project_work" | "review_project_work" | "create_opportunity" | "apply_opportunity" | "review_application" | "schedule_interview" | "make_offer" | "generate_report" | "export_data" | "view_system_settings" | "update_system_settings" | "view_audit_logs" | "manage_backup")[];
declare const HR_PERMISSIONS: ("view_interns" | "view_companies" | "view_assessments" | "view_trainings" | "view_reports" | "view_analytics" | "view_projects" | "view_opportunities" | "create_user" | "view_users" | "update_user" | "activate_user" | "suspend_user" | "create_intern" | "update_intern" | "create_company" | "update_company" | "verify_company" | "evaluate_assessment" | "generate_report")[];
declare const MANAGER_PERMISSIONS: ("view_interns" | "view_trainings" | "view_reports" | "view_projects" | "enroll_training" | "view_users" | "update_intern" | "evaluate_intern" | "manage_training_progress" | "create_project" | "update_project" | "assign_project" | "review_project_work")[];
declare const INTERN_PERMISSIONS: ("view_interns" | "view_assessments" | "view_trainings" | "view_projects" | "enroll_training" | "view_opportunities" | "view_users" | "take_assessment" | "manage_training_progress" | "submit_project_work" | "apply_opportunity")[];
declare const COMPANY_PERMISSIONS: ("view_companies" | "view_reports" | "view_analytics" | "view_opportunities" | "view_applications" | "view_users" | "update_company" | "create_opportunity" | "review_application" | "schedule_interview" | "make_offer")[];

export { ADMIN_PERMISSIONS, APPLICATION_STATUS, ASSESSMENT_STATUS, ATTENDANCE_STATUS, ApplicationStatusType, AssessmentStatusType, AttendanceStatus, AttendanceStatusType, COMPANY_PERMISSIONS, COMPANY_STATUS, CompanyStatusType, DEFAULT_ROUTES, DOMAIN_SKILLS, HR_PERMISSIONS, INTERN_PERMISSIONS, INTERN_STATUS, InternStatusType, MANAGER_PERMISSIONS, MatchStatus, PERMISSIONS, PROJECT_STATUS, Permission, ProjectStatusType, ROLES, ROLE_HIERARCHY, ROLE_PERMISSIONS, Role, SKILL_CATEGORIES, SKILL_DEFINITIONS, SkillCategory, SkillDefinition, TASK_STATUS, TaskStatusType };
