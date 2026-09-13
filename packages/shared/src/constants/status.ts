export const INTERN_STATUS = {
  REGISTERED: 'registered',
  ASSESSED: 'assessed',
  TRAINING: 'training',
  PROJECT: 'project',
  READY: 'ready',
  PLACED: 'placed',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
} as const;

export type InternStatusType = typeof INTERN_STATUS[keyof typeof INTERN_STATUS];

export const COMPANY_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
} as const;

export type CompanyStatusType = typeof COMPANY_STATUS[keyof typeof COMPANY_STATUS];

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
} as const;

export type ProjectStatusType = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const TASK_STATUS = {
  TO_DO: 'to_do',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
} as const;

export type TaskStatusType = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const ASSESSMENT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  EVALUATED: 'evaluated',
  EXPIRED: 'expired',
} as const;

export type AssessmentStatusType = typeof ASSESSMENT_STATUS[keyof typeof ASSESSMENT_STATUS];

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ASSESSMENT: 'assessment',
  INTERVIEW: 'interview',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export type ApplicationStatusType = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  ON_LEAVE = 'on_leave',
  HOLIDAY = 'holiday',
}

export const ATTENDANCE_STATUS = AttendanceStatus;
export type AttendanceStatusType = AttendanceStatus;

export enum MatchStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  OFFER_MADE = 'offer_made',
  HIRED = 'hired',
  EXPIRED = 'expired',
}