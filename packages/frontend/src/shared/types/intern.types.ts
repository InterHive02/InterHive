export interface InternProfile {
  id: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    profilePhoto?: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
  academicInfo: {
    currentEducation: {
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate?: Date;
      isCurrent: boolean;
      grade?: string;
    };
    previousEducation?: {
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate: Date;
      grade?: string;
    }[];
    cgpa?: number;
    graduationYear?: number;
  };
  professionalInfo: {
    experience: {
      company: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
      description?: string;
      skills?: string[];
    }[];
    skills: {
      id: string;
      name: string;
      category: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      yearsOfExperience?: number;
      isVerified?: boolean;
    }[];
    certifications?: {
      id: string;
      name: string;
      issuer: string;
      issuedDate: Date;
      expiryDate?: Date;
      credentialId?: string;
      credentialUrl?: string;
      isVerified: boolean;
    }[];
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
  status: 'registered' | 'assessed' | 'training' | 'project' | 'ready' | 'placed' | 'completed' | 'dropped';
  createdAt: Date;
  updatedAt: Date;
}

export interface InternReadiness {
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
  history: {
    score: number;
    breakdown: any;
    date: Date;
    event: string;
  }[];
}

export interface InternApplication {
  id: string;
  userId: string;
  programId: string;
  coverLetter?: string;
  status: 'pending' | 'under_review' | 'assessment' | 'interview' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  assessmentScore?: number;
  interviewDate?: Date;
  offerDetails?: {
    companyId: string;
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
  };
  createdAt: Date;
  updatedAt: Date;
}
