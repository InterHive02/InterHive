import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/profile-header';
import { PersonalInfo } from '../components/personal-info';
import { EducationSection } from '../components/education-section';
import { ExperienceSection } from '../components/experience-section';
import { SkillsSection } from '../components/skills-section';
import { DocumentsSection } from '../components/documents-section';
import { PhotoEditorModal } from '../components/photo-editor-modal';
import { useProfile } from '../hooks/use-profile';
import { useAuth } from '../../../api/hooks/use-auth';
import {
  Shield,
  Building2,
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Award,
  PhoneCall,
} from 'lucide-react';

export const ViewProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const {
    profile,
    isLoading,
    uploadProfilePhoto,
    isUploadingPhoto,
    userRole,
  } = useProfile();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Safe field fallbacks combining intern profile, user document & auth session
  const firstName =
    profile?.personalInfo?.firstName || profile?.firstName || authUser?.firstName || 'InterHive';
  const lastName =
    profile?.personalInfo?.lastName || profile?.lastName || authUser?.lastName || 'Member';
  const email =
    profile?.contact?.email || profile?.personalInfo?.email || profile?.email || authUser?.email || '';
  const role = authUser?.role || profile?.role || userRole || 'intern';
  const employeeId =
    profile?.employeeId ||
    authUser?.employeeId ||
    `${role.toUpperCase()}-${(authUser?.id || '8821').slice(-4)}`;
  const profilePhoto =
    profile?.personalInfo?.profilePhoto || profile?.profilePhoto || authUser?.profilePhoto;

  const phone = profile?.contact?.phone || profile?.phone || authUser?.phone || 'Not provided';
  const address =
    profile?.contact?.address ||
    profile?.address ||
    authUser?.address || {
      street: 'InterHive Enterprise Workspace',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
    };

  const position = profile?.position || authUser?.position;
  const department = profile?.department?.name || profile?.department;
  const skills = profile?.skills || profile?.professionalInfo?.skills;
  const emergencyContact = profile?.emergencyContact;

  const isStaffOrCompany = ['admin', 'hr', 'manager', 'company'].includes(role);

  const socialMedia = profile?.contact?.socialMedia || profile?.socialMedia;
  const hasSocialLinks =
    socialMedia?.linkedin ||
    socialMedia?.github ||
    socialMedia?.twitter ||
    socialMedia?.portfolio;

  const preferences = profile?.preferences;
  const hasPreferences =
    preferences?.preferredDomains?.length ||
    preferences?.preferredLocation?.length ||
    preferences?.preferredWorkType?.length ||
    preferences?.expectedStipend ||
    preferences?.availability;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <ProfileHeader
        user={{
          firstName,
          lastName,
          email,
          role,
          employeeId,
          profilePhoto,
        }}
        onEdit={() => navigate('/profile/edit')}
        onUploadPhoto={() => setIsPhotoModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfo
          data={{
            firstName,
            lastName,
            email,
            phone,
            address,
            dateOfBirth: profile?.personalInfo?.dateOfBirth || profile?.dateOfBirth,
            gender: profile?.personalInfo?.gender || profile?.gender,
          }}
        />

        {/* Role Credentials & Organization Card for Staff & Companies */}
        {isStaffOrCompany ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Role & Access Permissions
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {role} Access Tier
                    </p>
                    <p className="text-xs text-gray-500">
                      Security group & module privileges active
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Organization
                    </p>
                    <p className="text-xs text-gray-500">
                      {department ? `${department} · ` : ''}InterHive Global Placement Network
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                  {employeeId}
                </span>
              </div>

              {position && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Designation
                      </p>
                      <p className="text-xs text-gray-500">{position}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          profile?.academicInfo?.currentEducation && (
            <EducationSection education={profile.academicInfo.currentEducation} />
          )
        )}

        {/* Skills for Staff or Interns */}
        {skills && skills.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" /> Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s: any, i: number) => {
                const skillName = typeof s === 'string' ? s : s.name || s.id;
                return (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium border border-indigo-100 dark:border-indigo-900/50"
                  >
                    {skillName}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Emergency Contact for Staff / Intern */}
        {emergencyContact && (emergencyContact.name || emergencyContact.phone) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-500" /> Emergency Contact
            </h3>
            <div className="space-y-2 text-sm">
              {emergencyContact.name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {emergencyContact.name}
                    {emergencyContact.relationship ? ` (${emergencyContact.relationship})` : ''}
                  </span>
                </div>
              )}
              {emergencyContact.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {emergencyContact.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media Links */}
        {hasSocialLinks && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Social & Links
            </h3>
            <div className="space-y-3">
              {socialMedia?.linkedin && (
                <a
                  href={socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="truncate">{socialMedia.linkedin}</span>
                </a>
              )}
              {socialMedia?.github && (
                <a
                  href={socialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300"
                >
                  <Github className="w-4 h-4" />
                  <span className="truncate">{socialMedia.github}</span>
                </a>
              )}
              {socialMedia?.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-sky-500 hover:text-sky-600"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="truncate">{socialMedia.twitter}</span>
                </a>
              )}
              {socialMedia?.portfolio && (
                <a
                  href={socialMedia.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  <Globe className="w-4 h-4" />
                  <span className="truncate">{socialMedia.portfolio}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Internship Preferences */}
        {hasPreferences && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Internship Preferences
            </h3>
            <div className="space-y-3">
              {preferences?.preferredDomains?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Preferred Domains
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {preferences.preferredDomains.map((d: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {preferences?.preferredLocation?.length > 0 && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Preferred Locations
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {preferences.preferredLocation.join(', ')}
                    </p>
                  </div>
                </div>
              )}
              {preferences?.preferredWorkType?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {preferences.preferredWorkType.map((wt: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium capitalize"
                    >
                      {wt}
                    </span>
                  ))}
                </div>
              )}
              {preferences?.expectedStipend && (
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expected Stipend
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{preferences.expectedStipend.min?.toLocaleString() || '0'} — ₹
                      {preferences.expectedStipend.max?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              )}
              {preferences?.availability && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Availability</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {preferences.availability.startDate
                        ? `From ${new Date(
                            preferences.availability.startDate,
                          ).toLocaleDateString('en-IN')}`
                        : 'Flexible start'}
                      {preferences.availability.duration
                        ? ` · ${preferences.availability.duration} months`
                        : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {profile?.professionalInfo?.experience &&
          profile.professionalInfo.experience.length > 0 && (
            <ExperienceSection experience={profile.professionalInfo.experience} />
          )}

        {/* Documents Section */}
        {profile?.documents && profile.documents.length > 0 && (
          <DocumentsSection documents={profile.documents} />
        )}
      </div>

      {/* Photo Editor Modal with Rotate, Zoom, and Auto-Compression */}
      <PhotoEditorModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        isSaving={isUploadingPhoto}
        onSave={(file) => {
          uploadProfilePhoto(file);
          setIsPhotoModalOpen(false);
        }}
      />
    </div>
  );
};
