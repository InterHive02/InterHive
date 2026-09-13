import React, { useState } from 'react';
import { User, Star, CheckCircle, XCircle, Mail, Phone, Award, TrendingUp } from 'lucide-react';

interface RecommendedInternsProps {
  interns: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
    skills: { name: string; level: string }[];
    readiness: number;
    matchScore: number;
    isVerified?: boolean;
    availability: string;
    preferredWorkType: string[];
  }[];
  onContact?: (id: string) => void;
  onShortlist?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const RecommendedInterns: React.FC<RecommendedInternsProps> = ({
  interns,
  onContact,
  onShortlist,
  onReject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'advanced':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredInterns = interns.filter((intern) => {
    const matchesSearch = intern.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.skills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || 
      intern.skills.some(s => s.level === filterLevel);
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Recommended Interns
        </h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {interns.length} candidates
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredInterns.map((intern) => (
          <div
            key={intern.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex flex-wrap items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {intern.profilePhoto ? (
                  <img
                    src={intern.profilePhoto}
                    alt={`${intern.firstName} ${intern.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {intern.firstName} {intern.lastName}
                  </h4>
                  {intern.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-lg dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Skills */}
                <div className="mt-1 flex flex-wrap gap-1">
                  {intern.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill.name}
                      className={`px-2 py-0.5 text-xs rounded-lg ${getSkillLevelColor(skill.level)}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                  {intern.skills.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                      +{intern.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Readiness:</span>
                    <span className={`font-semibold ${getReadinessColor(intern.readiness)}`}>
                      {intern.readiness}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Match:</span>
                    <span className={`font-semibold ${getMatchScoreColor(intern.matchScore)}`}>
                      {intern.matchScore}%
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Available: {intern.availability}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Work: {intern.preferredWorkType.join(', ')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {onContact && (
                  <button
                    onClick={() => onContact(intern.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </button>
                )}
                {onShortlist && (
                  <button
                    onClick={() => onShortlist(intern.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Shortlist
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(intern.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredInterns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No interns found</p>
          </div>
        )}
      </div>
    </div>
  );
};
