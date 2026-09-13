import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  rollNumber: string;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  areasOfInterest?: string[];

  @IsIn(['remote', 'hybrid', 'onsite'])
  @IsOptional()
  internshipPreference?: 'remote' | 'hybrid' | 'onsite';

  @IsString()
  @IsOptional()
  previousExperience?: string;

  @IsString()
  @IsNotEmpty()
  resumeUrl: string;

  @IsString()
  @IsOptional()
  linkedInUrl?: string;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  portfolioUrl?: string;

  @IsString()
  @IsNotEmpty()
  reasonForApplying: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}

export class ScheduleInterviewDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsIn(['online', 'offline'])
  @IsOptional()
  mode?: 'online' | 'offline';

  @IsString()
  @IsOptional()
  linkOrLocation?: string;

  @IsString()
  @IsOptional()
  interviewer?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddNoteDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdateStatusDto {
  @IsIn([
    'new',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'interview_completed',
    'selected',
    'rejected',
  ])
  status: string;
}
