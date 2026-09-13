import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/profile-header';
import { PersonalInfo } from '../components/personal-info';
import { EducationSection } from '../components/education-section';
import { ExperienceSection } from '../components/experience-section';
import { SkillsSection } from '../components/skills-section';
import { DocumentsSection } from '../components/documents-section';
import { useProfile } from '../hooks/use-profile';

export const ViewProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading, uploadResume, deleteResume } = useProfile();

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Please complete your profile setup</p>
        <button
          onClick={() => navigate('/profile/edit')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Setup Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={{
          firstName: profile.personalInfo.firstName,
          lastName: profile.personalInfo.lastName,
          email: profile.contact.email,
          role: profile.role || 'intern',
          employeeId: profile.employeeId,
          profilePhoto: profile.personalInfo.profilePhoto,
        }}
        onEdit={() => navigate('/profile/edit')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfo
          data={{
            firstName: profile.personalInfo.firstName,
            lastName: profile.personalInfo.lastName,
            email: profile.contact.email,
            phone: profile.contact.phone,
            address: profile.contact.address,
            dateOfBirth: profile.personalInfo.dateOfBirth,
            gender: profile.personalInfo.gender,
          }}
        />

        <EducationSection
          education={profile.academicInfo.currentEducation}
        />

        <ExperienceSection
          experience={profile.professionalInfo.experience || []}
        />

        <SkillsSection
          skills={profile.professionalInfo.skills || []}
        />

        <DocumentsSection
          documents={profile.documents || []}
          onDownload={(id) => {
            // Handle download
          }}
        />
      </div>
    </div>
  );
};
