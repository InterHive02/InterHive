import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  GraduationCap,
  Briefcase,
  Settings,
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useProfile } from '../hooks/use-profile';
import { useAuth } from '../../../api/hooks/use-auth';

// ─── Universal Profile Form Schema ──────────────────────────────
const profileSchema = z.object({
  // Personal / Representative Info
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),

  // Contact Info
  phone: z.string().optional(),
  alternatePhone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  socialMedia: z
    .object({
      linkedin: z.string().optional(),
      github: z.string().optional(),
      twitter: z.string().optional(),
      portfolio: z.string().optional(),
    })
    .optional(),

  // Role / Organizational Info (for Admin, HR, Manager, Company)
  position: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  skillsString: z.string().optional(),

  // Company Specific Details (for Company role)
  companyName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  companySize: z.string().optional(),
  foundedYear: z.string().optional(),

  // Emergency Contact (for staff & interns)
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Academic Info (for Interns)
  currentEducation: z
    .object({
      institution: z.string().optional(),
      degree: z.string().optional(),
      field: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isCurrent: z.boolean().optional(),
      grade: z.string().optional(),
    })
    .optional(),
  cgpa: z.string().optional(),
  graduationYear: z.string().optional(),

  // Professional Links (for Interns)
  resume: z.string().optional(),
  portfolio: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),

  // Preferences (for Interns)
  preferredDomains: z.string().optional(),
  preferredLocation: z.string().optional(),
  preferredWorkType: z.array(z.string()).optional(),
  expectedStipendMin: z.string().optional(),
  expectedStipendMax: z.string().optional(),
  availabilityStartDate: z.string().optional(),
  availabilityDuration: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Helper: format a Date-like value to YYYY-MM-DD for <input type="date">
const toDateStr = (d: any): string => {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return dt.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

// Collapsible Section Component
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {open && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
};

const inputCls =
  'mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { profile, updateProfile, isLoading, userRole } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = authUser?.role || userRole || 'intern';
  const isIntern = role === 'intern';
  const isCompany = role === 'company';
  const isStaff = ['admin', 'hr', 'manager'].includes(role);

  // Parse address whether object or string
  const rawAddress = profile?.contact?.address || profile?.address || authUser?.address;
  const initialAddress =
    typeof rawAddress === 'object' && rawAddress !== null
      ? rawAddress
      : {
          street: typeof rawAddress === 'string' ? rawAddress : '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        };

  const initialFirstName =
    profile?.personalInfo?.firstName || profile?.firstName || authUser?.firstName || '';
  const initialLastName =
    profile?.personalInfo?.lastName || profile?.lastName || authUser?.lastName || '';
  const initialPhone = profile?.contact?.phone || profile?.phone || authUser?.phone || '';
  const initialDob = toDateStr(
    profile?.personalInfo?.dateOfBirth || profile?.dateOfBirth || authUser?.dateOfBirth,
  );
  const initialGender =
    profile?.personalInfo?.gender || profile?.gender || authUser?.gender || '';
  const initialNationality =
    profile?.personalInfo?.nationality || profile?.nationality || '';

  const initialSkills = Array.isArray(profile?.skills)
    ? profile.skills.join(', ')
    : typeof profile?.skills === 'string'
    ? profile.skills
    : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      dateOfBirth: initialDob,
      gender: initialGender,
      nationality: initialNationality,

      phone: initialPhone,
      alternatePhone: profile?.contact?.alternatePhone || '',
      address: initialAddress,
      socialMedia: profile?.contact?.socialMedia || {},

      // Non-intern & Staff
      position: profile?.position || authUser?.position || '',
      department: profile?.department?.name || profile?.department || '',
      bio: profile?.bio || '',
      skillsString: initialSkills,

      // Company
      companyName: profile?.companyName || authUser?.companyName || '',
      industry: profile?.industry || '',
      website: profile?.website || '',
      companySize: profile?.companySize?.toString() || '',
      foundedYear: profile?.foundedYear?.toString() || '',

      // Emergency Contact
      emergencyContactName: profile?.emergencyContact?.name || '',
      emergencyContactRelation: profile?.emergencyContact?.relationship || '',
      emergencyContactPhone: profile?.emergencyContact?.phone || '',

      // Intern Academic
      currentEducation: {
        institution: profile?.academicInfo?.currentEducation?.institution || '',
        degree: profile?.academicInfo?.currentEducation?.degree || '',
        field: profile?.academicInfo?.currentEducation?.field || '',
        startDate: toDateStr(profile?.academicInfo?.currentEducation?.startDate),
        endDate: toDateStr(profile?.academicInfo?.currentEducation?.endDate),
        isCurrent: profile?.academicInfo?.currentEducation?.isCurrent ?? true,
        grade: profile?.academicInfo?.currentEducation?.grade || '',
      },
      cgpa: profile?.academicInfo?.cgpa?.toString() || '',
      graduationYear: profile?.academicInfo?.graduationYear?.toString() || '',

      // Intern Professional
      resume: profile?.professionalInfo?.resume || '',
      portfolio: profile?.professionalInfo?.portfolio || '',
      github: profile?.professionalInfo?.github || '',
      linkedin: profile?.professionalInfo?.linkedin || '',

      // Intern Preferences
      preferredDomains: profile?.preferences?.preferredDomains?.join(', ') || '',
      preferredLocation: profile?.preferences?.preferredLocation?.join(', ') || '',
      preferredWorkType: profile?.preferences?.preferredWorkType || [],
      expectedStipendMin: profile?.preferences?.expectedStipend?.min?.toString() || '',
      expectedStipendMax: profile?.preferences?.expectedStipend?.max?.toString() || '',
      availabilityStartDate: toDateStr(profile?.preferences?.availability?.startDate),
      availabilityDuration: profile?.preferences?.availability?.duration?.toString() || '',
    },
  });

  // Re-sync form defaultValues when profile data loads
  useEffect(() => {
    if (profile || authUser) {
      reset({
        firstName:
          profile?.personalInfo?.firstName || profile?.firstName || authUser?.firstName || '',
        lastName:
          profile?.personalInfo?.lastName || profile?.lastName || authUser?.lastName || '',
        dateOfBirth: toDateStr(
          profile?.personalInfo?.dateOfBirth || profile?.dateOfBirth || authUser?.dateOfBirth,
        ),
        gender: profile?.personalInfo?.gender || profile?.gender || authUser?.gender || '',
        nationality: profile?.personalInfo?.nationality || profile?.nationality || '',

        phone: profile?.contact?.phone || profile?.phone || authUser?.phone || '',
        alternatePhone: profile?.contact?.alternatePhone || '',
        address: initialAddress,
        socialMedia: profile?.contact?.socialMedia || {},

        position: profile?.position || authUser?.position || '',
        department: profile?.department?.name || profile?.department || '',
        bio: profile?.bio || '',
        skillsString: initialSkills,

        companyName: profile?.companyName || authUser?.companyName || '',
        industry: profile?.industry || '',
        website: profile?.website || '',
        companySize: profile?.companySize?.toString() || '',
        foundedYear: profile?.foundedYear?.toString() || '',

        emergencyContactName: profile?.emergencyContact?.name || '',
        emergencyContactRelation: profile?.emergencyContact?.relationship || '',
        emergencyContactPhone: profile?.emergencyContact?.phone || '',

        currentEducation: {
          institution: profile?.academicInfo?.currentEducation?.institution || '',
          degree: profile?.academicInfo?.currentEducation?.degree || '',
          field: profile?.academicInfo?.currentEducation?.field || '',
          startDate: toDateStr(profile?.academicInfo?.currentEducation?.startDate),
          endDate: toDateStr(profile?.academicInfo?.currentEducation?.endDate),
          isCurrent: profile?.academicInfo?.currentEducation?.isCurrent ?? true,
          grade: profile?.academicInfo?.currentEducation?.grade || '',
        },
        cgpa: profile?.academicInfo?.cgpa?.toString() || '',
        graduationYear: profile?.academicInfo?.graduationYear?.toString() || '',

        resume: profile?.professionalInfo?.resume || '',
        portfolio: profile?.professionalInfo?.portfolio || '',
        github: profile?.professionalInfo?.github || '',
        linkedin: profile?.professionalInfo?.linkedin || '',

        preferredDomains: profile?.preferences?.preferredDomains?.join(', ') || '',
        preferredLocation: profile?.preferences?.preferredLocation?.join(', ') || '',
        preferredWorkType: profile?.preferences?.preferredWorkType || [],
        expectedStipendMin: profile?.preferences?.expectedStipend?.min?.toString() || '',
        expectedStipendMax: profile?.preferences?.expectedStipend?.max?.toString() || '',
        availabilityStartDate: toDateStr(profile?.preferences?.availability?.startDate),
        availabilityDuration: profile?.preferences?.availability?.duration?.toString() || '',
      });
    }
  }, [profile, authUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);

      if (isIntern) {
        // Intern Profile payload
        const payload: any = {};

        payload.personalInfo = {
          firstName: data.firstName,
          lastName: data.lastName,
          ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
          ...(data.gender ? { gender: data.gender } : {}),
          ...(data.nationality ? { nationality: data.nationality } : {}),
        };

        payload.contact = {
          ...(data.phone ? { phone: data.phone } : {}),
          ...(data.alternatePhone ? { alternatePhone: data.alternatePhone } : {}),
          ...(data.address ? { address: data.address } : {}),
          ...(data.socialMedia ? { socialMedia: data.socialMedia } : {}),
        };

        if (data.currentEducation?.institution || data.currentEducation?.degree) {
          payload.academicInfo = {
            currentEducation: {
              institution: data.currentEducation.institution || '',
              degree: data.currentEducation.degree || '',
              field: data.currentEducation.field || '',
              ...(data.currentEducation.startDate
                ? { startDate: new Date(data.currentEducation.startDate) }
                : {}),
              ...(data.currentEducation.endDate
                ? { endDate: new Date(data.currentEducation.endDate) }
                : {}),
              isCurrent: data.currentEducation.isCurrent ?? true,
              ...(data.currentEducation.grade ? { grade: data.currentEducation.grade } : {}),
            },
            ...(data.cgpa ? { cgpa: parseFloat(data.cgpa) } : {}),
            ...(data.graduationYear ? { graduationYear: parseInt(data.graduationYear, 10) } : {}),
          };
        }

        const profLinks: any = {};
        if (data.resume) profLinks.resume = data.resume;
        if (data.portfolio) profLinks.portfolio = data.portfolio;
        if (data.github) profLinks.github = data.github;
        if (data.linkedin) profLinks.linkedin = data.linkedin;
        if (Object.keys(profLinks).length > 0) {
          payload.professionalInfo = profLinks;
        }

        const prefs: any = {};
        if (data.preferredDomains) {
          prefs.preferredDomains = data.preferredDomains
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
        if (data.preferredLocation) {
          prefs.preferredLocation = data.preferredLocation
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
        if (data.preferredWorkType && data.preferredWorkType.length > 0) {
          prefs.preferredWorkType = data.preferredWorkType;
        }
        if (data.expectedStipendMin || data.expectedStipendMax) {
          prefs.expectedStipend = {
            ...(data.expectedStipendMin ? { min: parseInt(data.expectedStipendMin, 10) } : {}),
            ...(data.expectedStipendMax ? { max: parseInt(data.expectedStipendMax, 10) } : {}),
          };
        }
        if (data.availabilityStartDate || data.availabilityDuration) {
          prefs.availability = {
            ...(data.availabilityStartDate
              ? { startDate: new Date(data.availabilityStartDate) }
              : {}),
            ...(data.availabilityDuration
              ? { duration: parseInt(data.availabilityDuration, 10) }
              : {}),
          };
        }
        if (Object.keys(prefs).length > 0) {
          payload.preferences = prefs;
        }

        await updateProfile(payload);
      } else {
        // Staff, Manager, Admin, Company User payload
        const userPayload: any = {
          firstName: data.firstName,
          lastName: data.lastName,
          ...(data.phone ? { phone: data.phone } : {}),
          ...(data.position ? { position: data.position } : {}),
          ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
          ...(data.gender ? { gender: data.gender } : {}),
          ...(data.address ? { address: data.address } : {}),
        };

        if (data.skillsString) {
          userPayload.skills = data.skillsString
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }

        if (
          data.emergencyContactName ||
          data.emergencyContactPhone ||
          data.emergencyContactRelation
        ) {
          userPayload.emergencyContact = {
            name: data.emergencyContactName,
            relationship: data.emergencyContactRelation,
            phone: data.emergencyContactPhone,
          };
        }

        await updateProfile(userPayload);
      }

      navigate('/profile');
    } catch (error) {
      // Handled in hook toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleHeader = () => {
    switch (role) {
      case 'admin':
        return { title: 'Edit Admin Profile', subtitle: 'System administrator credentials and personal details' };
      case 'hr':
        return { title: 'Edit HR Profile', subtitle: 'Human resources operations and contact details' };
      case 'manager':
        return { title: 'Edit Manager Profile', subtitle: 'Operations and team manager information' };
      case 'company':
        return { title: 'Edit Corporate Profile', subtitle: 'Company partner representative and organization info' };
      default:
        return { title: 'Edit Profile', subtitle: 'Manage your personal, contact, and academic profile' };
    }
  };

  const roleInfo = getRoleHeader();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{roleInfo.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{roleInfo.subtitle}</p>
      </div>

      <form className="space-y-5">
        {/* ─── Section 1: Personal / Representative Details ─── */}
        <Section
          title={isCompany ? 'Representative Details' : 'Personal Information'}
          icon={<User className="w-5 h-5 text-indigo-500" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First Name *</label>
              <input {...register('firstName')} className={inputCls} />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Last Name *</label>
              <input {...register('lastName')} className={inputCls} />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input type="date" {...register('dateOfBirth')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Gender</label>
              <select {...register('gender')} className={inputCls}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Nationality</label>
              <input {...register('nationality')} className={inputCls} placeholder="e.g. Indian" />
            </div>
          </div>
        </Section>

        {/* ─── Section 2: Contact Details ─── */}
        <Section
          title="Contact Details"
          icon={<Phone className="w-5 h-5 text-emerald-500" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number</label>
              <input {...register('phone')} className={inputCls} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className={labelCls}>Alternate Phone</label>
              <input
                {...register('alternatePhone')}
                className={inputCls}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pt-2">
            Address
          </p>
          <div>
            <label className={labelCls}>Street Address</label>
            <input {...register('address.street')} className={inputCls} placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input {...register('address.city')} className={inputCls} placeholder="Bengaluru" />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input {...register('address.state')} className={inputCls} placeholder="Karnataka" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Country</label>
              <input {...register('address.country')} className={inputCls} placeholder="India" />
            </div>
            <div>
              <label className={labelCls}>Zip Code</label>
              <input {...register('address.zipCode')} className={inputCls} placeholder="560001" />
            </div>
          </div>

          {isIntern && (
            <>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pt-2">
                Social Media
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>LinkedIn</label>
                  <input
                    {...register('socialMedia.linkedin')}
                    className={inputCls}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className={labelCls}>GitHub</label>
                  <input
                    {...register('socialMedia.github')}
                    className={inputCls}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className={labelCls}>Twitter / X</label>
                  <input
                    {...register('socialMedia.twitter')}
                    className={inputCls}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className={labelCls}>Portfolio Website</label>
                  <input
                    {...register('socialMedia.portfolio')}
                    className={inputCls}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </>
          )}
        </Section>

        {/* ─── Non-Intern / Staff Section: Organization & Professional ─── */}
        {(isStaff || isCompany) && (
          <Section
            title="Organization & Role Information"
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            defaultOpen={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Designation / Position</label>
                <input
                  {...register('position')}
                  className={inputCls}
                  placeholder={
                    role === 'admin'
                      ? 'System Administrator'
                      : role === 'hr'
                      ? 'Talent Acquisition Lead'
                      : role === 'manager'
                      ? 'Engineering Lead'
                      : 'Corporate Partner Representative'
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Department / Business Unit</label>
                <input
                  {...register('department')}
                  className={inputCls}
                  placeholder="Engineering / Operations"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Skills & Competencies (comma-separated)</label>
              <input
                {...register('skillsString')}
                className={inputCls}
                placeholder="Team Management, Mentoring, Full-Stack Architecture, Agile"
              />
            </div>

            {/* Emergency Contact */}
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pt-2">
              Emergency Contact
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Contact Name</label>
                <input
                  {...register('emergencyContactName')}
                  className={inputCls}
                  placeholder="Contact person"
                />
              </div>
              <div>
                <label className={labelCls}>Relationship</label>
                <input
                  {...register('emergencyContactRelation')}
                  className={inputCls}
                  placeholder="Spouse / Parent / Sibling"
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  {...register('emergencyContactPhone')}
                  className={inputCls}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </Section>
        )}

        {/* ─── Intern Section: Academic Info ─── */}
        {isIntern && (
          <Section
            title="Academic Information"
            icon={<GraduationCap className="w-5 h-5 text-amber-500" />}
            defaultOpen={true}
          >
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current Education
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Institution</label>
                <input
                  {...register('currentEducation.institution')}
                  className={inputCls}
                  placeholder="University name"
                />
              </div>
              <div>
                <label className={labelCls}>Degree</label>
                <input
                  {...register('currentEducation.degree')}
                  className={inputCls}
                  placeholder="B.Tech, B.Sc, etc."
                />
              </div>
              <div>
                <label className={labelCls}>Field of Study</label>
                <input
                  {...register('currentEducation.field')}
                  className={inputCls}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className={labelCls}>Grade / GPA</label>
                <input
                  {...register('currentEducation.grade')}
                  className={inputCls}
                  placeholder="8.5 / A+"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Date</label>
                <input
                  type="date"
                  {...register('currentEducation.startDate')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input type="date" {...register('currentEducation.endDate')} className={inputCls} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('currentEducation.isCurrent')}
                id="isCurrent"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isCurrent" className="text-sm text-gray-700 dark:text-gray-300">
                Currently studying here
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className={labelCls}>CGPA</label>
                <input {...register('cgpa')} className={inputCls} placeholder="8.5" />
              </div>
              <div>
                <label className={labelCls}>Expected Graduation Year</label>
                <input {...register('graduationYear')} className={inputCls} placeholder="2027" />
              </div>
            </div>
          </Section>
        )}

        {/* ─── Intern Section: Professional Links ─── */}
        {isIntern && (
          <Section
            title="Professional Information"
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Profile links & resume. Skills and experience can be managed from your profile page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Resume URL</label>
                <input
                  {...register('resume')}
                  className={inputCls}
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div>
                <label className={labelCls}>Portfolio URL</label>
                <input
                  {...register('portfolio')}
                  className={inputCls}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <label className={labelCls}>GitHub</label>
                <input
                  {...register('github')}
                  className={inputCls}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className={labelCls}>LinkedIn</label>
                <input
                  {...register('linkedin')}
                  className={inputCls}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </Section>
        )}

        {/* ─── Intern Section: Preferences ─── */}
        {isIntern && (
          <Section
            title="Preferences"
            icon={<Settings className="w-5 h-5 text-purple-500" />}
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Preferred Domains</label>
                <input
                  {...register('preferredDomains')}
                  className={inputCls}
                  placeholder="Web Dev, AI/ML, Data Science (comma-separated)"
                />
              </div>
              <div>
                <label className={labelCls}>Preferred Locations</label>
                <input
                  {...register('preferredLocation')}
                  className={inputCls}
                  placeholder="Bengaluru, Mumbai, Remote (comma-separated)"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Preferred Work Type</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {['remote', 'hybrid', 'onsite'].map((wt) => (
                  <label
                    key={wt}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      value={wt}
                      {...register('preferredWorkType')}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    {wt.charAt(0).toUpperCase() + wt.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Expected Stipend (Min ₹)</label>
                <input {...register('expectedStipendMin')} className={inputCls} placeholder="5000" />
              </div>
              <div>
                <label className={labelCls}>Expected Stipend (Max ₹)</label>
                <input
                  {...register('expectedStipendMax')}
                  className={inputCls}
                  placeholder="25000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Available From</label>
                <input type="date" {...register('availabilityStartDate')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Duration (months)</label>
                <input
                  {...register('availabilityDuration')}
                  className={inputCls}
                  placeholder="3"
                />
              </div>
            </div>
          </Section>
        )}
      </form>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};
