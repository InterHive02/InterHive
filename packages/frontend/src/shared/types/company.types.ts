export interface Company {
  id: string;
  companyInfo: {
    name: string;
    legalName: string;
    registrationNumber: string;
    industry: string[];
    size?: number;
    foundedYear?: number;
    website?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  };
  contact: {
    primaryContact: {
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
    hrContact?: {
      email?: string;
      phone?: string;
    };
    technicalContact?: {
      email?: string;
      phone?: string;
    };
  };
  status: 'pending' | 'verified' | 'active' | 'suspended' | 'inactive';
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise' | 'custom';
    tier: number;
    startDate?: Date;
    endDate?: Date;
    features: string[];
    price: number;
    currency: string;
    status: 'active' | 'expired' | 'cancelled';
    autoRenew: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyRequirement {
  id: string;
  companyId: string;
  position: string;
  department?: string;
  count: number;
  skills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  experience: {
    min: number;
    max?: number;
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
  location?: string;
  duration: {
    min: number;
    max: number;
  };
  startDate: Date;
  applicationDeadline?: Date;
  status: 'draft' | 'published' | 'closed' | 'filled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
