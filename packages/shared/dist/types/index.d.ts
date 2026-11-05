import { B as BaseEntity, U as UUID, C as ContactInfo, k as Education, l as Experience, S as Skill, a as URLString, A as Address, F as FileUpload, n as AssessmentType, m as SkillLevel } from '../pricing-payment.types-1ece83ef.js';
export { h as AcademicYear, s as AnalyticsEvent, d as ApiResponse, o as AssessmentStatus, p as BaseAssessmentResult, a8 as CampaignType, ai as CheckoutPreviewRequest, aj as CheckoutPreviewResponse, ac as CouponItem, ak as CreateOrderRequest, al as CreateOrderResponse, ad as DiscountCampaignItem, a3 as DiscountType, Z as DualTargetSectionConfig, E as Email, j as EmploymentType, Y as EqualOpportunitySectionConfig, R as FaqItem, V as FaqSectionConfig, O as FeatureCardItem, Q as FeaturesSectionConfig, G as Gender, H as HeroBackgroundConfig, z as HeroCtaButton, D as HeroSectionConfig, I as InternWorkflowStatus, K as JourneySectionConfig, J as JourneyStepItem, x as LandingFooterColumn, y as LandingFooterConfig, w as LandingNavbarConfig, v as LandingNavbarLink, a0 as LandingPageConfig, a2 as LandingRevisionItem, u as LandingSeoConfig, t as LandingThemeConfig, L as Location, a1 as MediaAssetItem, X as NewsletterSectionConfig, q as NotificationCategory, r as NotificationPriority, N as NotificationType, ae as OrderItem, a5 as OrderStatus, c as PaginatedResponse, b as PaginationParams, af as PaymentItem, a9 as PaymentPlanConfig, a4 as PaymentPlanType, a6 as PaymentStatus, P as PhoneNumber, aa as PricingHistoryEntry, ab as ProgramPricingItem, g as ProgramType, ah as ReferralInfo, ag as RefundItem, a7 as RefundStatus, an as RevenueAnalyticsOverview, $ as SectionMeta, _ as StickyCtaConfig, T as Timestamp, f as UserAccessLevel, e as UserRole, i as UserStatus, am as VerifyPaymentRequest, W as WhyUsCardItem, M as WhyUsSectionConfig } from '../pricing-payment.types-1ece83ef.js';

interface InternProfile extends BaseEntity {
    userId: UUID;
    personalInfo: {
        firstName: string;
        lastName: string;
        dateOfBirth?: Date;
        gender?: string;
        nationality?: string;
        profilePhoto?: string;
    };
    contact: ContactInfo;
    academicInfo: {
        currentEducation: Education;
        previousEducation?: Education[];
        cgpa?: number;
        graduationYear?: number;
    };
    professionalInfo: {
        experience: Experience[];
        skills: Skill[];
        certifications: Certification[];
        resume?: string;
        portfolio?: string;
        github?: string;
        linkedin?: string;
    };
    preferences: {
        preferredDomains: string[];
        preferredLocation: string[];
        preferredWorkType: ('remote' | 'hybrid' | 'onsite')[];
        expectedStipend: {
            min: number;
            max: number;
        };
        availability: {
            startDate: Date;
            duration: number;
        };
    };
    readinessScore: ReadinessScore;
    status: InternStatus;
    applications: InternApplication[];
    trainingEnrollments: TrainingEnrollment[];
    projects: ProjectParticipation[];
    createdAt: Date;
    updatedAt: Date;
}
interface ReadinessScore {
    overall: number;
    breakdown: {
        technicalSkills: number;
        projects: number;
        communication: number;
        problemSolving: number;
        industryWorkflow: number;
        teamCollaboration: number;
        leadership: number;
        adaptability: number;
    };
    lastUpdated: Date;
    history: ReadinessScoreHistory[];
}
interface ReadinessScoreHistory {
    score: number;
    breakdown: ReadinessScore['breakdown'];
    date: Date;
    event: string;
}
declare enum InternStatus {
    REGISTERED = "registered",
    ASSESSED = "assessed",
    TRAINING = "training",
    PROJECT = "project",
    READY = "ready",
    PLACED = "placed",
    COMPLETED = "completed",
    DROPPED = "dropped"
}
interface InternApplication {
    id: UUID;
    programId: UUID;
    programName: string;
    status: ApplicationStatus;
    appliedAt: Date;
    assessmentScore?: number;
    interviewDate?: Date;
    offerDetails?: OfferDetails;
}
declare enum ApplicationStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    ASSESSMENT = "assessment",
    INTERVIEW = "interview",
    OFFERED = "offered",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn"
}
interface OfferDetails {
    companyId: UUID;
    position: string;
    stipend: {
        amount: number;
        currency: string;
        period: 'monthly' | 'hourly' | 'stipend';
    };
    startDate: Date;
    duration: number;
    location: string;
    workType: 'remote' | 'hybrid' | 'onsite';
}
interface Certification {
    id: UUID;
    name: string;
    issuer: string;
    issuedDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: URLString;
    isVerified: boolean;
}
interface TrainingEnrollment {
    programId: UUID;
    enrollmentDate: Date;
    progress: number;
    completionStatus: 'not_started' | 'in_progress' | 'completed' | 'dropped';
    completionDate?: Date;
    modules: TrainingModuleProgress[];
}
interface TrainingModuleProgress {
    moduleId: UUID;
    status: 'locked' | 'in_progress' | 'completed';
    progress: number;
    score?: number;
    startedAt?: Date;
    completedAt?: Date;
}
interface ProjectParticipation {
    projectId: UUID;
    role: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'completed' | 'dropped';
    contributions: ProjectContribution[];
    evaluation?: InternProjectEvaluation;
}
interface ProjectContribution {
    id: UUID;
    taskId: UUID;
    description: string;
    status: 'pending' | 'in_progress' | 'review' | 'completed';
    submittedAt?: Date;
    feedback?: string;
}
interface InternProjectEvaluation {
    technicalSkills: number;
    communication: number;
    teamwork: number;
    problemSolving: number;
    punctuality: number;
    overall: number;
    comments: string;
    evaluatorId: UUID;
    evaluationDate: Date;
}

interface Company extends BaseEntity {
    userId: UUID;
    companyInfo: {
        name: string;
        legalName: string;
        registrationNumber: string;
        industry: string[];
        size: number;
        foundedYear: number;
        website: URLString;
        description: string;
        logo: string;
        coverImage?: string;
    };
    contact: {
        primaryContact: ContactInfo;
        hrContact: ContactInfo;
        technicalContact?: ContactInfo;
        address: Address;
    };
    requirements: CompanyRequirement[];
    hiring: HiringProcess[];
    collaborations: CompanyCollaboration[];
    ratings: CompanyRating[];
    status: CompanyStatus;
    subscription: CompanySubscription;
    createdAt: Date;
    updatedAt: Date;
}
interface CompanyRequirement {
    id: UUID;
    position: string;
    department: string;
    count: number;
    skills: Skill[];
    experience: {
        min: number;
        max: number;
    };
    education: {
        minDegree: string;
        preferredFields: string[];
    };
    responsibilities: string[];
    benefits: string[];
    stipend: {
        min: number;
        max: number;
        currency: string;
        period: 'monthly' | 'hourly' | 'stipend';
    };
    workType: 'remote' | 'hybrid' | 'onsite';
    location: string;
    duration: {
        min: number;
        max: number;
    };
    startDate: Date;
    applicationDeadline: Date;
    status: RequirementStatus;
}
declare enum RequirementStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    CLOSED = "closed",
    FILLED = "filled",
    CANCELLED = "cancelled"
}
interface HiringProcess {
    id: UUID;
    requirementId: UUID;
    stage: 'screening' | 'assessment' | 'interview' | 'offer' | 'hired';
    candidates: UUID[];
    selected?: UUID[];
    timeline: {
        startedAt: Date;
        screeningDeadline?: Date;
        assessmentDeadline?: Date;
        interviewDeadline?: Date;
        offerDeadline?: Date;
    };
    status: 'active' | 'completed' | 'cancelled';
}
interface CompanyCollaboration {
    id: UUID;
    type: 'training' | 'project' | 'hiring' | 'research';
    programId: UUID;
    status: 'pending' | 'active' | 'completed' | 'terminated';
    startDate: Date;
    endDate?: Date;
    terms: string;
    metrics: {
        internsHired: number;
        projectsCompleted: number;
        satisfactionScore: number;
    };
}
interface CompanyRating {
    id: UUID;
    internId: UUID;
    score: number;
    feedback: string;
    categories: {
        communication: number;
        technicalSkills: number;
        professionalism: number;
        punctuality: number;
        initiative: number;
    };
    createdAt: Date;
}
declare enum CompanyStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    INACTIVE = "inactive"
}
interface CompanySubscription {
    plan: 'basic' | 'premium' | 'enterprise' | 'custom';
    tier: number;
    startDate: Date;
    endDate: Date;
    features: string[];
    price: number;
    currency: string;
    status: 'active' | 'expired' | 'cancelled';
    autoRenew: boolean;
}

interface Project extends BaseEntity {
    id: UUID;
    companyId: UUID;
    title: string;
    description: string;
    category: string[];
    requiredSkills: Skill[];
    teamSize: {
        min: number;
        max: number;
    };
    duration: {
        weeks: number;
        startDate: Date;
        endDate: Date;
    };
    workType: 'remote' | 'hybrid' | 'onsite';
    tasks: ProjectTask[];
    deliverables: ProjectDeliverable[];
    resources: ProjectResource[];
    mentors: UUID[];
    status: ProjectStatus;
    phase: ProjectPhase;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}
interface ProjectTask {
    id: UUID;
    title: string;
    description: string;
    assignedTo?: UUID[];
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high' | 'critical';
    storyPoints: number;
    startDate: Date;
    endDate: Date;
    dependencies: UUID[];
    subtasks: ProjectSubtask[];
    comments: TaskComment[];
    attachments: FileUpload[];
}
declare enum TaskStatus {
    TO_DO = "to_do",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    COMPLETED = "completed",
    BLOCKED = "blocked"
}
interface ProjectSubtask {
    id: UUID;
    title: string;
    status: TaskStatus;
    assignedTo?: UUID;
}
interface TaskComment {
    id: UUID;
    authorId: UUID;
    content: string;
    attachments?: FileUpload[];
    createdAt: Date;
    updatedAt: Date;
    replies?: TaskComment[];
}
interface ProjectDeliverable {
    id: UUID;
    name: string;
    description: string;
    type: 'document' | 'code' | 'design' | 'presentation' | 'other';
    format: string;
    expectedBy: Date;
    submittedBy?: UUID;
    submittedAt?: Date;
    reviewStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
    feedback?: string;
}
interface ProjectResource {
    id: UUID;
    name: string;
    type: 'documentation' | 'tool' | 'api' | 'dataset' | 'template';
    url: string;
    description: string;
    accessLevel: 'public' | 'team' | 'restricted';
}
declare enum ProjectStatus {
    PLANNING = "planning",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PAUSED = "paused",
    CANCELLED = "cancelled"
}
declare enum ProjectPhase {
    INITIATION = "initiation",
    PLANNING = "planning",
    EXECUTION = "execution",
    MONITORING = "monitoring",
    CLOSURE = "closure"
}
interface ProjectEvaluation {
    projectId: UUID;
    evaluatorId: UUID;
    quality: number;
    innovation: number;
    teamwork: number;
    documentation: number;
    presentation: number;
    overall: number;
    strengths: string[];
    improvements: string[];
    feedback: string;
    evaluatedAt: Date;
}

interface Assessment extends BaseEntity {
    title: string;
    description: string;
    type: AssessmentType;
    category: string[];
    skillsAssessed: Skill[];
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    duration: number;
    totalScore: number;
    passingScore: number;
    questions: AssessmentQuestion[];
    status: 'draft' | 'published' | 'active' | 'archived';
    createdBy: UUID;
    createdAt: Date;
    updatedAt: Date;
}
interface AssessmentQuestion {
    id: UUID;
    type: 'multiple_choice' | 'multiple_select' | 'coding' | 'essay' | 'practical';
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    text: string;
    options?: AssessmentOption[];
    correctAnswer?: string | string[];
    explanation?: string;
    points: number;
    codeSnippet?: string;
    expectedOutput?: string;
    constraints?: string[];
}
interface AssessmentOption {
    id: UUID;
    text: string;
    isCorrect: boolean;
}
interface AssessmentSubmission {
    id: UUID;
    assessmentId: UUID;
    internId: UUID;
    startedAt: Date;
    completedAt?: Date;
    timeSpent: number;
    answers: AssessmentAnswer[];
    score: number;
    percentage: number;
    status: 'in_progress' | 'submitted' | 'evaluated' | 'expired';
    feedback?: AssessmentFeedback;
}
interface AssessmentAnswer {
    questionId: UUID;
    answer: string | string[] | any;
    isCorrect?: boolean;
    score?: number;
    feedback?: string;
    codeSubmission?: {
        language: string;
        code: string;
        output?: string;
        testResults?: TestResult[];
    };
}
interface TestResult {
    testCase: string;
    passed: boolean;
    expected: string;
    actual: string;
    message?: string;
}
interface AssessmentFeedback {
    overall: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: {
        questionId: UUID;
        feedback: string;
        suggestions: string[];
    }[];
}
interface AssessmentResult {
    id: UUID;
    assessmentId: UUID;
    internId: UUID;
    score: number;
    percentage: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    status: 'pass' | 'fail';
    feedback: AssessmentFeedback;
    skillsAssessment: {
        skillId: UUID;
        level: SkillLevel;
        confidence: number;
        questionsCorrect: number;
        totalQuestions: number;
    }[];
    recommendations: {
        skillId: UUID;
        currentLevel: SkillLevel;
        recommendedLevel: SkillLevel;
        learningResources: string[];
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export { Address, ApplicationStatus, Assessment, AssessmentAnswer, AssessmentFeedback, AssessmentOption, AssessmentQuestion, AssessmentResult, AssessmentSubmission, AssessmentType, BaseEntity, Certification, Company, CompanyCollaboration, CompanyRating, CompanyRequirement, CompanyStatus, CompanySubscription, ContactInfo, Education, Experience, FileUpload, HiringProcess, InternApplication, InternProfile, InternProjectEvaluation, InternStatus, OfferDetails, Project, ProjectContribution, ProjectDeliverable, ProjectEvaluation, ProjectParticipation, ProjectPhase, ProjectResource, ProjectStatus, ProjectSubtask, ProjectTask, ReadinessScore, ReadinessScoreHistory, RequirementStatus, Skill, SkillLevel, TaskComment, TaskStatus, TestResult, TrainingEnrollment, TrainingModuleProgress, URLString, UUID };
