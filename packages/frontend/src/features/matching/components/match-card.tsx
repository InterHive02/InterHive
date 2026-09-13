import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Calendar, Award, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { MatchScore } from './match-score';

interface MatchCardProps {
  match: {
    id: string;
    matchScore: number;
    breakdown: {
      skillMatch: number;
      readinessMatch: number;
      experienceMatch: number;
      preferenceMatch: number;
    };
    status: 'pending' | 'accepted' | 'rejected' | 'interview_scheduled' | 'interview_completed' | 'offer_made' | 'offer_accepted' | 'offer_rejected' | 'hired' | 'expired';
    intern?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      profilePhoto?: string;
      skills: string[];
      readiness: number;
    };
    company?: {
      id: string;
      name: string;
      logo?: string;
      industry: string[];
    };
    requirement?: {
      position: string;
      department: string;
    };
    interview?: {
      scheduledDate: Date;
      type: string;
      meetingLink?: string;
    };
    offer?: {
      amount: number;
      currency: string;
      period: string;
      position: string;
    };
    createdAt: Date;
  };
  role: 'intern' | 'company';
  onAction?: (action: string, matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  role,
  onAction,
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'accepted':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'offer_made':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hired':
      case 'accepted':
      case 'offer_accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
      case 'offer_rejected':
        return <XCircle className="w-4 h-4" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
  };

  const handleAction = (action: string) => {
    onAction?.(action, match.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {role === 'intern' ? (
              match.company?.logo ? (
                <img
                  src={match.company.logo}
                  alt={match.company.name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              )
            ) : (
              match.intern?.profilePhoto ? (
                <img
                  src={match.intern.profilePhoto}
                  alt={`${match.intern.firstName} ${match.intern.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              )
            )}
            <div>
              {role === 'intern' ? (
                <>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {match.company?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {match.requirement?.position}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {match.intern?.firstName} {match.intern?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {match.intern?.skills.slice(0, 3).join(', ')}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${getStatusColor(match.status)}`}
            >
              {getStatusIcon(match.status)}
              {getStatusLabel(match.status)}
            </span>
          </div>
        </div>

        {/* Match Score */}
        <div className="mt-4">
          <MatchScore
            score={match.matchScore}
            breakdown={match.breakdown}
          />
        </div>

        {/* Details */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Match Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(match.createdAt).toLocaleDateString()}
            </p>
          </div>
          {match.interview && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Interview</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(match.interview.scheduledDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {match.offer && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Offer</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {match.offer.currency} {match.offer.amount} / {match.offer.period}
              </p>
            </div>
          )}
          {role === 'intern' && match.intern?.readiness && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Readiness</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {match.intern.readiness}%
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
          {match.status === 'pending' && (
            <>
              <button
                onClick={() => handleAction('accept')}
                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {match.status === 'accepted' && role === 'company' && (
            <button
              onClick={() => handleAction('schedule_interview')}
              className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
            >
              Schedule Interview
            </button>
          )}
          {match.status === 'interview_completed' && role === 'company' && (
            <button
              onClick={() => handleAction('make_offer')}
              className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Make Offer
            </button>
          )}
          {match.status === 'offer_made' && role === 'intern' && (
            <>
              <button
                onClick={() => handleAction('accept_offer')}
                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                Accept Offer
              </button>
              <button
                onClick={() => handleAction('reject_offer')}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject Offer
              </button>
            </>
          )}
          {match.status === 'offer_accepted' && role === 'company' && (
            <button
              onClick={() => handleAction('hire')}
              className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
            >
              Hire Intern
            </button>
          )}
          {match.interview?.meetingLink && (
            <a
              href={match.interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Join Meeting
            </a>
          )}
          <button
            onClick={() => navigate(`/opportunities/${match.id}`)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
