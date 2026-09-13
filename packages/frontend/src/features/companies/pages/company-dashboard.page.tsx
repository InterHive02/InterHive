import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Briefcase, TrendingUp, Award, Calendar, Plus } from 'lucide-react';
import { CompanyProfile } from '../components/company-profile';
import { TalentRequirements } from '../components/talent-requirements';
import { RecommendedInterns } from '../components/recommended-interns';
import { useCompany } from '../hooks/use-company';
import { useMatching } from '../../matching/hooks/use-matching';

export const CompanyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { useProfile, useRequirements, updateCompany } = useCompany();
  const { useMyMatches } = useMatching();

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: requirements, isLoading: requirementsLoading } = useRequirements(
    profile?.id || '',
    'published'
  );
  const { data: matches, isLoading: matchesLoading } = useMyMatches();

  const handleEditProfile = () => {
    navigate('/company/profile/edit');
  };

  const handleEditRequirement = (id: string) => {
    navigate(`/company/requirements/${id}/edit`);
  };

  const handleViewRequirement = (id: string) => {
    navigate(`/company/requirements/${id}`);
  };

  const handleCreateRequirement = () => {
    navigate('/company/requirements/create');
  };

  const handleContactIntern = (id: string) => {
    navigate(`/company/interns/${id}/contact`);
  };

  const isLoading = profileLoading || requirementsLoading || matchesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Please complete your company profile</p>
        <button
          onClick={() => navigate('/company/profile/create')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Building2 className="w-4 h-4" />
          Create Profile
        </button>
      </div>
    );
  }

  // Prepare company data
  const companyData = {
    id: profile.id,
    name: profile.companyInfo.name,
    legalName: profile.companyInfo.legalName,
    logo: profile.companyInfo.logo,
    coverImage: profile.companyInfo.coverImage,
    description: profile.companyInfo.description,
    industry: profile.companyInfo.industry,
    size: profile.companyInfo.size || 0,
    foundedYear: profile.companyInfo.foundedYear || new Date().getFullYear(),
    website: profile.companyInfo.website || '',
    location: profile.contact.primaryContact?.address?.city || 'Remote',
    contact: {
      email: profile.contact.primaryContact.email,
      phone: profile.contact.primaryContact.phone || '',
    },
    status: profile.status,
    rating: 4.5,
    totalHires: matches?.data?.filter((m: any) => m.status === 'hired').length || 0,
    createdAt: profile.createdAt,
  };

  // Prepare requirements data
  const requirementsData = requirements?.map((req: any) => ({
    id: req.id,
    position: req.position,
    department: req.department || '',
    count: req.count,
    skills: req.skills || [],
    experience: req.experience || { min: 0 },
    stipend: req.stipend || { min: 0, max: 0, currency: 'INR', period: 'monthly' },
    workType: req.workType || 'hybrid',
    location: req.location || 'Remote',
    duration: req.duration || { min: 3, max: 6 },
    startDate: req.startDate,
    applicationDeadline: req.applicationDeadline,
    status: req.status,
    applications: req.applications || 0,
  })) || [];

  // Prepare recommended interns
  const recommendedInterns = matches?.data
    ?.filter((m: any) => m.status === 'pending' && m.matchScore >= 70)
    .map((m: any) => ({
      id: m.internId.id,
      firstName: m.internId.firstName,
      lastName: m.internId.lastName,
      email: m.internId.email,
      phone: m.internId.phone,
      profilePhoto: m.internId.profilePhoto,
      skills: m.internId.skills || [],
      readiness: m.internId.readiness || 0,
      matchScore: m.matchScore,
      isVerified: m.internId.isVerified,
      availability: 'Immediate',
      preferredWorkType: ['remote'],
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your company profile and find the best talent
          </p>
        </div>
        <button
          onClick={handleCreateRequirement}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post Requirement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Requirements</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {requirements?.filter((r: any) => r.status === 'published').length || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Applicants</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {matches?.data?.length || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Interviews Scheduled</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {matches?.data?.filter((m: any) => m.status === 'interview_scheduled').length || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Hires Made</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {matches?.data?.filter((m: any) => m.status === 'hired').length || 0}
          </p>
        </div>
      </div>

      {/* Company Profile */}
      <CompanyProfile company={companyData} onEdit={handleEditProfile} />

      {/* Requirements & Interns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TalentRequirements
          requirements={requirementsData}
          onEdit={handleEditRequirement}
          onView={handleViewRequirement}
          onCreate={handleCreateRequirement}
        />

        <RecommendedInterns
          interns={recommendedInterns}
          onContact={handleContactIntern}
        />
      </div>
    </div>
  );
};
