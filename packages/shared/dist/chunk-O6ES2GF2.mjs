// src/types/common.types.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "admin";
  UserRole2["HR"] = "hr";
  UserRole2["MANAGER"] = "manager";
  UserRole2["INTERN"] = "intern";
  UserRole2["COMPANY"] = "company";
  return UserRole2;
})(UserRole || {});
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

export {
  UserRole,
  UserStatus,
  Gender,
  EmploymentType,
  SkillLevel,
  AssessmentType,
  AssessmentStatus,
  NotificationCategory,
  NotificationPriority,
  InternStatus,
  ApplicationStatus,
  RequirementStatus,
  CompanyStatus,
  TaskStatus,
  ProjectStatus,
  ProjectPhase
};
//# sourceMappingURL=chunk-O6ES2GF2.mjs.map