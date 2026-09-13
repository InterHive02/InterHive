import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, User, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { MatchScore } from '../components/match-score';
import { useMatching } from '../hooks/use-matching';
import { toast } from 'react-hot-toast';

export const MatchDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useMatch, acceptMatch, rejectMatch, scheduleInterview, makeOffer, hireIntern } = useMatching();

  const { data: match, isLoading } = useMatch(id || '');

  const handleAccept = () => {
    if (id) {
      acceptMatch(id);
    }
  };

  const handleReject = () => {
    if (id) {
      rejectMatch(id);
    }
  };

  const handleScheduleInterview = () => {
    if (id) {
      const date = prompt('Enter interview date (YYYY-MM-DD HH:MM):');
      if (date) {
        scheduleInterview({
          id,
          data: {
            interviewDate: new Date(date).toISOString(),
            interviewType: 'technical',
            meetingLink: prompt('Enter meeting link (optional):') || undefined,
          },
        });
      }
    }
  };

  const handleMakeOffer = () => {
    if (id) {
      const amount = prompt('Enter offer amount:');
      if (amount) {
        makeOffer({
          id,
          data: {
            amount: parseInt(amount),
            currency: 'INR',
            period: 'monthly',
            startDate: new Date().toISOString(),
            duration: 3,
            position: match?.requirement?.position || 'Intern',
            benefits: [],
          },
        });
      }
    }
  };

  const handleHire = () => {
    if (id) {
      hireIntern(id);
    }
  };

  if (isLoading || !match) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isCompany = match.companyId?.companyInfo?.name;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/opportunities')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Match Details
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {match.requirement?.position} at {match.companyId?.companyInfo?.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <MatchScore
              score={match.matchScore}
              breakdown={match.breakdown}
              size="lg"
            />
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {match.requirement?.position}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {match.requirement?.department || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Work Type</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {match.requirement?.workType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {match.requirement?.location || 'Remote'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stipend</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {match.requirement?.stipend 
                    ? `${match.requirement.stipend.currency} ${match.requirement.stipend.min}-${match.requirement.stipend.max} / ${match.requirement.stipend.period}`
                    : 'Competitive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {match.requirement?.duration 
                    ? `${match.requirement.duration.min}-${match.requirement.duration.max} months`
                    : '3-6 months'}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {match.requirement?.skills && match.requirement.skills.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {match.requirement.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                      ({skill.level})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Status
            </h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(match.status)}`}>
              {getStatusIcon(match.status)}
              {getStatusLabel(match.status)}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(match.createdAt).toLocaleDateString()}
                </span>
              </div>
              {match.acceptedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Accepted</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(match.acceptedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {match.hiredAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Hired</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(match.hiredAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          {(isCompany ? match.internId : match.companyId) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {isCompany 
                      ? `${match.internId?.firstName} ${match.internId?.lastName}`
                      : match.companyId?.companyInfo?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {isCompany ? match.internId?.email : match.companyId?.contact?.primaryContact?.email}
                  </span>
                </div>
                {match.requirement?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {match.requirement.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {match.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {match.status === 'accepted' && isCompany && (
            <button
              onClick={handleScheduleInterview}
              className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Schedule Interview
            </button>
          )}

          {match.status === 'interview_completed' && isCompany && (
            <button
              onClick={handleMakeOffer}
              className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Make Offer
            </button>
          )}

          {match.status === 'offer_made' && !isCompany && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Accept offer
                  acceptMatch(id!);
                }}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Accept Offer
              </button>
              <button
                onClick={() => {
                  // Reject offer
                  rejectMatch(id!);
                }}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject Offer
              </button>
            </div>
          )}

          {match.status === 'offer_accepted' && isCompany && (
            <button
              onClick={handleHire}
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Hire Intern
            </button>
          )}

          {match.interview?.meetingLink && (
            <a
              href={match.interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Join Interview
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'hired':
    case 'offer_accepted':
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    case 'accepted':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    case 'interview_scheduled':
    case 'interview_completed':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
    case 'offer_made':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'rejected':
    case 'offer_rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'hired':
    case 'offer_accepted':
    case 'accepted':
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
