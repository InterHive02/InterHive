/**
 * Common shared types for InterHive platform
 */

export type UUID = string;
export type Email = string;
export type PhoneNumber = string;
export type URLString = string;
export type Timestamp = Date | string;

export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
}

export interface FileUpload {
  id: UUID;
  name: string;
  url: URLString;
  type: string;
  size: number;
  key: string;
  bucket: string;
  uploadedAt: Timestamp;
}

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  INTERN = 'intern',
  COMPANY = 'company',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export interface ContactInfo {
  email: Email;
  phone?: PhoneNumber;
  alternatePhone?: PhoneNumber;
  address?: Address;
  socialMedia?: {
    linkedin?: URLString;
    github?: URLString;
    twitter?: URLString;
    portfolio?: URLString;
  };
}

export interface Education {
  id: UUID;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  location?: string;
}

export interface Experience {
  id: UUID;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  location?: string;
  skills: string[];
  achievements?: string[];
}

export interface Skill {
  id: UUID;
  name: string;
  category: string;
  level: SkillLevel;
  yearsOfExperience?: number;
  isVerified?: boolean;
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum AssessmentType {
  TECHNICAL = 'technical',
  SOFT_SKILLS = 'soft_skills',
  APTITUDE = 'aptitude',
  BEHAVIORAL = 'behavioral',
  CODING = 'coding',
  PROJECT = 'project',
}

export enum AssessmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EVALUATED = 'evaluated',
  EXPIRED = 'expired',
}

export interface BaseAssessmentResult {
  score: number;
  percentage: number;
  grade?: string;
  feedback?: string;
  completedAt: Date;
  duration?: number; // in minutes
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface NotificationType {
  id: UUID;
  title: string;
  message: string;
  type: NotificationCategory;
  read: boolean;
  priority: NotificationPriority;
  createdAt: Timestamp;
  data?: Record<string, any>;
}

export enum NotificationCategory {
  SYSTEM = 'system',
  ASSESSMENT = 'assessment',
  TRAINING = 'training',
  PROJECT = 'project',
  MATCHING = 'matching',
  INTERVIEW = 'interview',
  HIRING = 'hiring',
  MESSAGE = 'message',
  REMINDER = 'reminder',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface AnalyticsEvent {
  id: UUID;
  userId: UUID;
  eventType: string;
  eventName: string;
  properties: Record<string, any>;
  timestamp: Timestamp;
  sessionId?: UUID;
  ip?: string;
  userAgent?: string;
}