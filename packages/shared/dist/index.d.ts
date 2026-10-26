import { Email, PhoneNumber, UUID } from './types/index.js';
export { AcademicYear, Address, AnalyticsEvent, ApiResponse, ApplicationStatus, Assessment, AssessmentAnswer, AssessmentFeedback, AssessmentOption, AssessmentQuestion, AssessmentResult, AssessmentStatus, AssessmentSubmission, AssessmentType, BaseAssessmentResult, BaseEntity, Certification, Company, CompanyCollaboration, CompanyRating, CompanyRequirement, CompanyStatus, CompanySubscription, ContactInfo, Education, EmploymentType, Experience, FileUpload, Gender, HiringProcess, InternApplication, InternProfile, InternProjectEvaluation, InternStatus, InternWorkflowStatus, Location, NotificationCategory, NotificationPriority, NotificationType, OfferDetails, PaginatedResponse, PaginationParams, ProgramType, Project, ProjectContribution, ProjectDeliverable, ProjectEvaluation, ProjectParticipation, ProjectPhase, ProjectResource, ProjectStatus, ProjectSubtask, ProjectTask, ReadinessScore, ReadinessScoreHistory, RequirementStatus, Skill, SkillLevel, TaskComment, TaskStatus, TestResult, Timestamp, TrainingEnrollment, TrainingModuleProgress, URLString, UserAccessLevel, UserRole, UserStatus } from './types/index.js';
export { ADMIN_PERMISSIONS, ALL_PROGRAM_KEYS, APPLICATION_STATUS, ASSESSMENT_STATUS, ATTENDANCE_STATUS, ApplicationStatusType, AssessmentStatusType, AttendanceStatus, AttendanceStatusType, COMPANY_PERMISSIONS, COMPANY_STATUS, CompanyStatusType, DEFAULT_ROUTES, DOMAIN_SKILLS, HR_PERMISSIONS, INTERN_PERMISSIONS, INTERN_STATUS, InternStatusType, MANAGER_PERMISSIONS, MatchStatus, PERMISSIONS, PROGRAM_CONFIGS, PROGRAM_DISCLAIMER, PROGRAM_ELIGIBILITY_MATRIX, PROGRAM_TYPES, PROJECT_STATUS, Permission, ProgramConfig, ProgramTypeKey, ProgramYearDetails, ProjectStatusType, ROLES, ROLE_HIERARCHY, ROLE_PERMISSIONS, Role, SKILL_CATEGORIES, SKILL_DEFINITIONS, SkillCategory, SkillDefinition, TASK_STATUS, TaskStatusType, getProgramConfig, isValidProgramType } from './constants/index.js';

interface LandingThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string;
    enableAnimations: boolean;
}
interface LandingSeoConfig {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonicalUrl: string;
}
interface LandingNavbarLink {
    label: string;
    href: string;
    isExternal?: boolean;
    order: number;
    isVisible: boolean;
}
interface LandingNavbarConfig {
    brandName: string;
    logoUrl?: string;
    links: LandingNavbarLink[];
    ctaButtonText: string;
    ctaButtonLink: string;
    showCtaButton: boolean;
}
interface LandingFooterColumn {
    title: string;
    links: Array<{
        label: string;
        href: string;
        isExternal?: boolean;
    }>;
}
interface LandingFooterConfig {
    brandName: string;
    tagline: string;
    copyrightText: string;
    columns: LandingFooterColumn[];
    socialLinks: Array<{
        platform: string;
        url: string;
        icon: string;
    }>;
}
interface HeroBackgroundConfig {
    type: 'image' | 'gradient' | 'color';
    url: string;
    opacity: number;
    overlayGradient: string;
}
interface HeroCtaButton {
    text: string;
    action: 'modal_application' | 'modal_quiz' | 'modal_video' | 'link';
    targetUrl?: string;
    variant: 'primary' | 'secondary' | 'outline';
    isVisible: boolean;
}
interface HeroSectionConfig {
    badgeText: string;
    headlineMain: string;
    headlineGradient: string;
    ppoDefinition: string;
    description: string;
    background: HeroBackgroundConfig;
    featureBadges: Array<{
        title: string;
        subtitle: string;
        icon: string;
    }>;
    ctaButtons: HeroCtaButton[];
    showcases: Array<{
        id: string;
        trackName: string;
        curriculum: string;
        badgeInitial: string;
        badgeColor: string;
        progress: number;
        activeStep?: number;
        currentStage: string;
        currentStageDesc: string;
        modules: string;
        projects: string;
        tests: string;
        stipend: string;
        ppoTarget: string;
    }>;
}
interface JourneyStepItem {
    stepNumber: string;
    title: string;
    description: string;
    badgeColor: string;
    icon: string;
}
interface JourneySectionConfig {
    tag: string;
    title: string;
    subtitle: string;
    linkText: string;
    linkUrl: string;
    steps: JourneyStepItem[];
    featurePills: Array<{
        icon: string;
        title: string;
        desc: string;
    }>;
}
interface WhyUsCardItem {
    icon: string;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
}
interface WhyUsSectionConfig {
    tag: string;
    title: string;
    subtitle: string;
    cards: WhyUsCardItem[];
    storyLinkText: string;
    storyLinkUrl: string;
}
interface FeatureCardItem {
    icon: string;
    title: string;
    description: string;
    linkUrl: string;
    iconBg: string;
    iconColor: string;
}
interface FeaturesSectionConfig {
    tag: string;
    headlineMain: string;
    headlineGradient: string;
    cards: FeatureCardItem[];
    cursiveText: string;
}
interface FaqItem {
    question: string;
    answer: string;
    linkText?: string;
    linkUrl?: string;
}
interface FaqSectionConfig {
    tag: string;
    title: string;
    subtitle: string;
    items: FaqItem[];
    helpLinkText: string;
    helpLinkUrl: string;
}
interface NewsletterSectionConfig {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
    successMessage: string;
}
interface EqualOpportunitySectionConfig {
    title: string;
    description: string;
    buttonText: string;
}
interface DualTargetSectionConfig {
    studentCard: {
        tag: string;
        title: string;
        description: string;
        buttonText: string;
        buttonLink: string;
        sublinkText: string;
        sublinkUrl: string;
    };
    companyCard: {
        tag: string;
        title: string;
        description: string;
        buttonText: string;
        sublinkText: string;
        sublinkUrl: string;
    };
}
interface StickyCtaConfig {
    title: string;
    badge: string;
    subtitle: string;
    buttonText: string;
    isVisible: boolean;
}
interface SectionMeta {
    id: string;
    name: string;
    order: number;
    isVisible: boolean;
}
interface LandingPageConfig {
    _id?: string;
    version: number;
    isPublished: boolean;
    publishedAt?: string;
    publishedBy?: string;
    lastEditedBy?: string;
    updatedAt?: string;
    theme: LandingThemeConfig;
    seo: LandingSeoConfig;
    navbar: LandingNavbarConfig;
    footer: LandingFooterConfig;
    sectionsMeta: SectionMeta[];
    hero: HeroSectionConfig;
    journey: JourneySectionConfig;
    whyUs: WhyUsSectionConfig;
    features: FeaturesSectionConfig;
    equalOpportunity: EqualOpportunitySectionConfig;
    dualTarget: DualTargetSectionConfig;
    faq: FaqSectionConfig;
    newsletter: NewsletterSectionConfig;
    stickyCta: StickyCtaConfig;
}
interface MediaAssetItem {
    _id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
    altText: string;
    uploadedBy?: string;
    createdAt: string;
}
interface LandingRevisionItem {
    _id: string;
    version: number;
    notes?: string;
    publishedBy?: string;
    publishedAt: string;
    config: LandingPageConfig;
}

declare const DEFAULT_LANDING_CMS_CONFIG: LandingPageConfig;

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

export { DEFAULT_LANDING_CMS_CONFIG, DualTargetSectionConfig, Email, EqualOpportunitySectionConfig, FaqItem, FaqSectionConfig, FeatureCardItem, FeaturesSectionConfig, Formatters, Helpers, HeroBackgroundConfig, HeroCtaButton, HeroSectionConfig, JourneySectionConfig, JourneyStepItem, LandingFooterColumn, LandingFooterConfig, LandingNavbarConfig, LandingNavbarLink, LandingPageConfig, LandingRevisionItem, LandingSeoConfig, LandingThemeConfig, MediaAssetItem, NewsletterSectionConfig, PhoneNumber, SectionMeta, StickyCtaConfig, UUID, Validators, WhyUsCardItem, WhyUsSectionConfig };
