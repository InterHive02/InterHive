export interface IAnalyticsQuery {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  month?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  department?: string;
}

export interface IReadinessAnalytics {
  overallAverage: number;
  byDepartment: {
    department: string;
    average: number;
    count: number;
  }[];
  distribution: {
    range: string;
    count: number;
  }[];
  topSkills: {
    skill: string;
    count: number;
    averageLevel: string;
  }[];
  trends: {
    date: Date;
    average: number;
    total: number;
  }[];
}

export interface ICompanyAnalytics {
  totalCompanies: number;
  byIndustry: {
    industry: string;
    count: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  hiringTrends: {
    month: string;
    year: number;
    requirements: number;
    hires: number;
  }[];
  satisfactionScore: number;
}

export interface IInternReadiness {
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
  history: {
    score: number;
    breakdown: any;
    date: Date;
    event: string;
  }[];
  recommendations: {
    category: string;
    currentScore: number;
    recommendation: string;
  }[];
  lastUpdated: Date;
}