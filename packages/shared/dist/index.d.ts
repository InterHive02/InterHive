import { E as Email, P as PhoneNumber, U as UUID } from './pricing-payment.types-1ece83ef.js';
export { aw as ALL_PROGRAM_KEYS, h as AcademicYear, A as Address, s as AnalyticsEvent, d as ApiResponse, o as AssessmentStatus, n as AssessmentType, p as BaseAssessmentResult, B as BaseEntity, a8 as CampaignType, ai as CheckoutPreviewRequest, aj as CheckoutPreviewResponse, C as ContactInfo, ac as CouponItem, ak as CreateOrderRequest, al as CreateOrderResponse, ad as DiscountCampaignItem, a3 as DiscountType, Z as DualTargetSectionConfig, k as Education, j as EmploymentType, Y as EqualOpportunitySectionConfig, l as Experience, R as FaqItem, V as FaqSectionConfig, O as FeatureCardItem, Q as FeaturesSectionConfig, F as FileUpload, G as Gender, H as HeroBackgroundConfig, z as HeroCtaButton, D as HeroSectionConfig, I as InternWorkflowStatus, K as JourneySectionConfig, J as JourneyStepItem, x as LandingFooterColumn, y as LandingFooterConfig, w as LandingNavbarConfig, v as LandingNavbarLink, a0 as LandingPageConfig, a2 as LandingRevisionItem, u as LandingSeoConfig, t as LandingThemeConfig, L as Location, a1 as MediaAssetItem, X as NewsletterSectionConfig, q as NotificationCategory, r as NotificationPriority, N as NotificationType, ae as OrderItem, a5 as OrderStatus, at as PROGRAM_ACADEMIC_YEAR_MAP, as as PROGRAM_CONFIGS, av as PROGRAM_DISCLAIMER, au as PROGRAM_ELIGIBILITY_MATRIX, ao as PROGRAM_TYPES, c as PaginatedResponse, b as PaginationParams, af as PaymentItem, a9 as PaymentPlanConfig, a4 as PaymentPlanType, a6 as PaymentStatus, aa as PricingHistoryEntry, ar as ProgramConfig, ab as ProgramPricingItem, g as ProgramType, ap as ProgramTypeKey, aq as ProgramYearDetails, ah as ReferralInfo, ag as RefundItem, a7 as RefundStatus, an as RevenueAnalyticsOverview, $ as SectionMeta, S as Skill, m as SkillLevel, _ as StickyCtaConfig, T as Timestamp, a as URLString, f as UserAccessLevel, e as UserRole, i as UserStatus, am as VerifyPaymentRequest, W as WhyUsCardItem, M as WhyUsSectionConfig, ax as getProgramConfig, ay as isValidProgramType } from './pricing-payment.types-1ece83ef.js';
export { ApplicationStatus, Assessment, AssessmentAnswer, AssessmentFeedback, AssessmentOption, AssessmentQuestion, AssessmentResult, AssessmentSubmission, Certification, Company, CompanyCollaboration, CompanyRating, CompanyRequirement, CompanyStatus, CompanySubscription, HiringProcess, InternApplication, InternProfile, InternProjectEvaluation, InternStatus, OfferDetails, Project, ProjectContribution, ProjectDeliverable, ProjectEvaluation, ProjectParticipation, ProjectPhase, ProjectResource, ProjectStatus, ProjectSubtask, ProjectTask, ReadinessScore, ReadinessScoreHistory, RequirementStatus, TaskComment, TaskStatus, TestResult, TrainingEnrollment, TrainingModuleProgress } from './types/index.js';
export { ADMIN_PERMISSIONS, APPLICATION_STATUS, ASSESSMENT_STATUS, ATTENDANCE_STATUS, ApplicationStatusType, AssessmentStatusType, AttendanceStatus, AttendanceStatusType, COMPANY_PERMISSIONS, COMPANY_STATUS, CompanyStatusType, DEFAULT_CAMPAIGNS, DEFAULT_COUPONS, DEFAULT_LANDING_CMS_CONFIG, DEFAULT_PROGRAM_PRICINGS, DEFAULT_ROUTES, DOMAIN_SKILLS, HR_PERMISSIONS, INTERN_PERMISSIONS, INTERN_STATUS, InternStatusType, MANAGER_PERMISSIONS, MatchStatus, PERMISSIONS, PROJECT_STATUS, Permission, ProjectStatusType, ROLES, ROLE_HIERARCHY, ROLE_PERMISSIONS, Role, SKILL_CATEGORIES, SKILL_DEFINITIONS, SkillCategory, SkillDefinition, TASK_STATUS, TaskStatusType } from './constants/index.js';

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
