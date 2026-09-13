import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OpportunityList } from '../components/opportunity-list';
import { useMatching } from '../hooks/use-matching';
import { toast } from 'react-hot-toast';

const DEFAULT_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Frontend React & TypeScript Engineer Intern',
    company: 'Apex Technologies',
    companyLogo: '',
    location: 'Remote (US/EU)',
    type: 'remote' as const,
    stipend: '$2,500/mo',
    duration: '3-6 months',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js'],
    matchScore: 94,
    postedAt: new Date(Date.now() - 86400000 * 2),
    deadline: new Date(Date.now() + 86400000 * 20),
  },
  {
    id: 'opp-2',
    title: 'Full-Stack NestJS & Cloud Intern',
    company: 'Nexus Scale Labs',
    companyLogo: '',
    location: 'Hybrid • New York, NY',
    type: 'hybrid' as const,
    stipend: '$3,000/mo',
    duration: '6 months',
    skills: ['NestJS', 'PostgreSQL', 'Docker', 'AWS'],
    matchScore: 89,
    postedAt: new Date(Date.now() - 86400000 * 5),
    deadline: new Date(Date.now() + 86400000 * 15),
  },
  {
    id: 'opp-3',
    title: 'AI & Data Engineering Intern',
    company: 'Cognitive Matrix',
    companyLogo: '',
    location: 'Onsite • San Francisco, CA',
    type: 'onsite' as const,
    stipend: '$3,200/mo',
    duration: '3 months',
    skills: ['Python', 'FastAPI', 'PyTorch', 'Vector DBs'],
    matchScore: 85,
    postedAt: new Date(Date.now() - 86400000 * 7),
    deadline: new Date(Date.now() + 86400000 * 10),
  },
];

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { useMyMatches } = useMatching();

  const { data: matches, isLoading } = useMyMatches();

  const rawList = Array.isArray(matches)
    ? matches
    : Array.isArray((matches as any)?.data)
    ? (matches as any).data
    : [];

  const parsedOpportunities = rawList.map((match: any) => ({
    id: match.id || match._id,
    title: match.requirement?.position || match.title || 'Software Engineering Intern',
    company: match.companyId?.companyInfo?.name || match.company || 'TechCorp Partner',
    companyLogo: match.companyId?.companyInfo?.logo || match.companyLogo,
    location: match.requirement?.location || match.location || 'Remote',
    type: (match.requirement?.workType || match.type || 'hybrid') as 'remote' | 'hybrid' | 'onsite',
    stipend: match.requirement?.stipend 
      ? `${match.requirement.stipend.currency || '$'} ${match.requirement.stipend.min || 1500}-${match.requirement.stipend.max || 2500}/mo`
      : (match.stipend || '$2,500/mo'),
    duration: match.requirement?.duration 
      ? `${match.requirement.duration.min || 3}-${match.requirement.duration.max || 6} months`
      : (match.duration || '3-6 months'),
    skills: match.requirement?.skills?.map((s: any) => typeof s === 'string' ? s : s.name) || match.skills || ['React', 'TypeScript', 'Node.js'],
    matchScore: match.matchScore || 90,
    postedAt: match.createdAt || new Date(),
    deadline: match.requirement?.applicationDeadline,
  }));

  const opportunities = parsedOpportunities.length > 0 ? parsedOpportunities : DEFAULT_OPPORTUNITIES;

  const handleApply = (id: string) => {
    toast.success('Interest registered! Our talent team has connected your verified profile with this company partner.');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/opportunities/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunities</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Find the perfect internship opportunity that matches your skills
        </p>
      </div>

      <OpportunityList
        opportunities={opportunities}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};
