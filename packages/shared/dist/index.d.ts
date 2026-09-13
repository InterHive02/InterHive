import { Email, PhoneNumber, UUID } from './types/index.js';
export { Address, AnalyticsEvent, ApiResponse, ApplicationStatus, Assessment, AssessmentAnswer, AssessmentFeedback, AssessmentOption, AssessmentQuestion, AssessmentResult, AssessmentStatus, AssessmentSubmission, AssessmentType, BaseAssessmentResult, BaseEntity, Certification, Company, CompanyCollaboration, CompanyRating, CompanyRequirement, CompanyStatus, CompanySubscription, ContactInfo, Education, EmploymentType, Experience, FileUpload, Gender, HiringProcess, InternApplication, InternProfile, InternProjectEvaluation, InternStatus, Location, NotificationCategory, NotificationPriority, NotificationType, OfferDetails, PaginatedResponse, PaginationParams, Project, ProjectContribution, ProjectDeliverable, ProjectEvaluation, ProjectParticipation, ProjectPhase, ProjectResource, ProjectStatus, ProjectSubtask, ProjectTask, ReadinessScore, ReadinessScoreHistory, RequirementStatus, Skill, SkillLevel, TaskComment, TaskStatus, TestResult, Timestamp, TrainingEnrollment, TrainingModuleProgress, URLString, UserRole, UserStatus } from './types/index.js';
export { ADMIN_PERMISSIONS, APPLICATION_STATUS, ASSESSMENT_STATUS, ATTENDANCE_STATUS, ApplicationStatusType, AssessmentStatusType, AttendanceStatus, AttendanceStatusType, COMPANY_PERMISSIONS, COMPANY_STATUS, CompanyStatusType, DEFAULT_ROUTES, DOMAIN_SKILLS, HR_PERMISSIONS, INTERN_PERMISSIONS, INTERN_STATUS, InternStatusType, MANAGER_PERMISSIONS, MatchStatus, PERMISSIONS, PROJECT_STATUS, Permission, ProjectStatusType, ROLES, ROLE_HIERARCHY, ROLE_PERMISSIONS, Role, SKILL_CATEGORIES, SKILL_DEFINITIONS, SkillCategory, SkillDefinition, TASK_STATUS, TaskStatusType } from './constants/index.js';

declare class Validators {
    static isEmail(email: string): email is Email;
    static isPhoneNumber(phone: string): phone is PhoneNumber;
    static isUUID(id: string): id is UUID;
    static isURL(url: string): boolean;
    static isDateString(date: string): boolean;
    static isPassword(password: string): boolean;
    static isStrongPassword(password: string): boolean;
    static isUrlSafeString(str: string): boolean;
    static isAlphaNumeric(str: string): boolean;
    static isValidName(name: string): boolean;
    static isValidSkillLevel(level: string): boolean;
    static isValidEnum<T extends Record<string, any>>(value: any, enumType: T): value is T[keyof T];
    static isNonEmptyString(value: any): boolean;
    static isPositiveNumber(value: any): boolean;
    static isValidRange(min: number, max: number, value: number): boolean;
    static isValidPercentage(value: number): boolean;
    static isValidScore(value: number): boolean;
    static isValidDateRange(startDate: Date, endDate: Date): boolean;
    static isValidFileType(mimeType: string): boolean;
    static isValidFileSize(size: number, maxSizeInMB?: number): boolean;
    static sanitizeString(input: string): string;
    static sanitizeEmail(email: string): string;
    static capitalizeWords(str: string): string;
    static truncateString(str: string, maxLength?: number): string;
}

declare class Formatters {
    static formatDate(date: Date | string): string;
    static formatDateTime(date: Date | string): string;
    static formatTime(date: Date | string): string;
    static formatRelativeTime(date: Date | string): string;
    static formatCurrency(amount: number, currency?: string): string;
    static formatPhoneNumber(phone: string): string;
    static formatReadabilityScore(score: number): string;
    static getScoreColor(score: number): string;
    static formatFileSize(bytes: number): string;
    static formatDuration(minutes: number): string;
    static formatSkillLevel(level: string): string;
    static formatStatus(status: string): string;
    static truncateString(str: string, maxLength?: number): string;
    static capitalizeFirstLetter(str: string): string;
    static toSlug(str: string): string;
    static generateCode(length?: number): string;
}

declare class Helpers {
    static generateId(): UUID;
    static generateCode(length?: number): string;
    static generateSlug(text: string): string;
    static calculateAge(dateOfBirth: Date): number;
    static getDaysBetweenDates(date1: Date, date2: Date): number;
    static getBusinessDays(startDate: Date, endDate: Date): number;
    static isValidEmail(email: string): boolean;
    static isValidPhone(phone: string): boolean;
    static maskEmail(email: string): string;
    static maskPhone(phone: string): string;
    static calculatePercentage(value: number, total: number): number;
    static average(numbers: number[]): number;
    static weightedAverage(values: number[], weights: number[]): number;
    static chunkArray<T>(array: T[], chunkSize: number): T[][];
    static groupBy<T>(array: T[], key: keyof T): Record<string, T[]>;
    static sortBy<T>(array: T[], key: keyof T, order?: 'asc' | 'desc'): T[];
    static deepClone<T>(obj: T): T;
    static isEmptyObject(obj: any): boolean;
    static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
    static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
    static getEnumValues<T extends Record<string, any>>(enumType: T): T[keyof T][];
    static getEnumKeys<T extends Record<string, any>>(enumType: T): (keyof T)[];
    static debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void;
    static throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void;
}

export { Email, Formatters, Helpers, PhoneNumber, UUID, Validators };
