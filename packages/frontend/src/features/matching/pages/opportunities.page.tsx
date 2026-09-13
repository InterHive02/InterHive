import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OpportunityList } from '../components/opportunity-list';
import { useMatching } from '../hooks/use-matching';
import { toast } from 'react-hot-toast';

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { useMyMatches } = useMatching();

  const { data: matches, isLoading } = useMyMatches();

  const opportunities = matches?.data?.map((match: any) => ({
    id: match.id,
    title: match.requirement?.position || 'Position',
    company: match.companyId?.companyInfo?.name || 'Company',
    companyLogo: match.companyId?.companyInfo?.logo,
    location: match.requirement?.location || 'Remote',
    type: match.requirement?.workType || 'hybrid',
    stipend: match.requirement?.stipend 
      ? `${match.requirement.stipend.currency} ${match.requirement.stipend.min}-${match.requirement.stipend.max}`
      : 'Competitive',
    duration: match.requirement?.duration 
      ? `${match.requirement.duration.min}-${match.requirement.duration.max} months`
      : '3-6 months',
    skills: match.requirement?.skills?.map((s: any) => s.name) || [],
    matchScore: match.matchScore || 0,
    postedAt: match.createdAt,
    deadline: match.requirement?.applicationDeadline,
  })) || [];

  const handleApply = (id: string) => {
    // Navigate to application form or apply directly
    navigate(`/opportunities/${id}/apply`);
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
