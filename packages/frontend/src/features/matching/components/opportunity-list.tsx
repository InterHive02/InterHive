import React, { useState } from 'react';
import { Search, Filter, Building2, MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  stipend: string;
  duration: string;
  skills: string[];
  matchScore: number;
  postedAt: Date;
  deadline?: Date;
}

interface OpportunityListProps {
  opportunities: Opportunity[];
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities,
  onApply,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'remote':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'hybrid':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'onsite':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || opp.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onViewDetails?.(opportunity.id)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {opportunity.companyLogo ? (
                    <img
                      src={opportunity.companyLogo}
                      alt={opportunity.company}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {opportunity.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {opportunity.company}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {opportunity.location}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-lg ${getTypeColor(opportunity.type)}`}
                  >
                    {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    {opportunity.stipend}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {opportunity.duration}
                  </span>
                </div>

                {/* Skills */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {opportunity.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {opportunity.skills.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                      +{opportunity.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {opportunity.matchScore > 0 && (
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getMatchScoreColor(opportunity.matchScore)}`}>
                      {opportunity.matchScore}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Match Score</p>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply?.(opportunity.id);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Apply Now
                  <ChevronRight className="w-4 h-4" />
                </button>
                {opportunity.deadline && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No opportunities found</p>
          </div>
        )}
      </div>
    </div>
  );
};
