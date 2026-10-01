import React, { useState } from 'react';
import {
  X,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { applicationsApi } from '../../../api/endpoints/applications.api';
import { toast } from 'react-hot-toast';

interface InternshipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
}

interface CountryDialCode {
  country: string;
  code: string;
  flag: string;
  minDigits: number;
  maxDigits: number;
  placeholder: string;
}

const COUNTRIES: CountryDialCode[] = [
  { country: 'India', code: '+91', flag: '🇮🇳', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { country: 'United States', code: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10, placeholder: '202 555 0123' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 10, placeholder: '7911 123456' },
  { country: 'United Arab Emirates', code: '+971', flag: '🇦🇪', minDigits: 9, maxDigits: 9, placeholder: '50 123 4567' },
  { country: 'Canada', code: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10, placeholder: '416 555 0199' },
  { country: 'Singapore', code: '+65', flag: '🇸🇬', minDigits: 8, maxDigits: 8, placeholder: '8123 4567' },
  { country: 'Australia', code: '+61', flag: '🇦🇺', minDigits: 9, maxDigits: 9, placeholder: '412 345 678' },
  { country: 'Germany', code: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 11, placeholder: '151 23456789' },
  { country: 'France', code: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9, placeholder: '6 12 34 56 78' },
  { country: 'Japan', code: '+81', flag: '🇯🇵', minDigits: 10, maxDigits: 10, placeholder: '90 1234 5678' },
  { country: 'Bangladesh', code: '+880', flag: '🇧🇩', minDigits: 10, maxDigits: 10, placeholder: '1712 345678' },
  { country: 'Nepal', code: '+977', flag: '🇳🇵', minDigits: 10, maxDigits: 10, placeholder: '984 1234567' },
  { country: 'Other', code: '+', flag: '🌐', minDigits: 7, maxDigits: 15, placeholder: 'Phone digits' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const TRACK_OPTIONS = [
  'Full Stack Engineering',
  'Frontend Development',
  'Backend Systems',
  'AI & Machine Learning',
  'Data Science & Analytics',
  'UI/UX Design',
  'DevOps & Cloud',
  'Mobile App Development',
];

const WORKPLACE_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'Immediate (Within 1 week)', label: 'Immediate' },
  { value: 'Within 2-3 weeks', label: '2-3 weeks' },
  { value: 'Next Month (Semester Break)', label: 'Next Month' },
  { value: 'Flexible / Discuss during interview', label: 'Flexible' },
];

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Next.js',
  'Tailwind CSS', 'SQL', 'MongoDB', 'Docker', 'AWS',
  'FastAPI', 'Figma', 'GraphQL', 'Git'
];

const STEPS = [
  { number: 1, name: 'Personal' },
  { number: 2, name: 'Academic' },
  { number: 3, name: 'Skills & Track' },
  { number: 4, name: 'Resume & SOP' },
];

export const InternshipApplicationModal: React.FC<InternshipApplicationModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation feedback states
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(COUNTRIES[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form Data
  const initialFormData = {
    // Step 1: Personal
    fullName: '',
    email: '',
    phone: '',
    gender: 'male',
    city: '',
    state: '',
    countryCode: '+91',

    // Step 2: Academic
    institution: '',
    degree: 'B.Tech / B.E.',
    branch: 'Computer Science & Engineering',
    semester: '6th Semester (3rd Year)',
    graduationYear: '2026',
    cgpa: '',
    rollNumber: '',

    // Step 3: Domain & Skills
    skills: '',
    areasOfInterest: preselectedCategory ? [preselectedCategory] : ['Full Stack Engineering'],
    internshipPreference: 'remote' as 'remote' | 'hybrid' | 'onsite',
    availability: 'Immediate (Within 1 week)',
    previousExperience: '',

    // Step 4: Links & SOP
    resumeUrl: '',
    linkedInUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    reasonForApplying: '',
    additionalInfo: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  if (!isOpen) return null;

  // Strict Name Character Validation (Alphabetic, space, hyphens, periods only)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (/^[a-zA-Z\s.'-]*$/.test(rawVal)) {
      setNameError(null);
      setFormData(prev => ({ ...prev, fullName: rawVal }));
    } else {
      setNameError('Numbers and special symbols are not allowed in name.');
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
      return;
    }
    if (!/^[a-zA-Z\s.'-]$/.test(e.key)) {
      e.preventDefault();
      setNameError('Numbers and special symbols are not allowed in name.');
    }
  };

  // Strict Phone Digits Validation according to Selected Country
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    if (digitsOnly.length <= selectedCountry.maxDigits) {
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
      if (digitsOnly.length >= selectedCountry.minDigits) {
        setPhoneError(null);
      }
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0];
    setSelectedCountry(found);
    setFormData(prev => ({ ...prev, countryCode: found.code, phone: '' }));
    setPhoneError(null);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.areasOfInterest.includes(interest);
      if (exists) {
        return {
          ...prev,
          areasOfInterest: prev.areasOfInterest.filter(i => i !== interest),
        };
      } else {
        return {
          ...prev,
          areasOfInterest: [...prev.areasOfInterest, interest],
        };
      }
    });
  };

  // Skills chips helpers
  const currentSkillsList = formData.skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const addSkillPill = (skill: string) => {
    if (!currentSkillsList.includes(skill)) {
      const updated = currentSkillsList.length > 0 ? `${formData.skills}, ${skill}` : skill;
      setFormData(prev => ({ ...prev, skills: updated }));
    }
  };

  const removeSkillPill = (skillToRemove: string) => {
    const filtered = currentSkillsList.filter(s => s !== skillToRemove);
    setFormData(prev => ({ ...prev, skills: filtered.join(', ') }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMessage(null);
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage('Please enter your full official name.');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (formData.phone.length < selectedCountry.minDigits) {
      setPhoneError(`Phone number for ${selectedCountry.country} must be at least ${selectedCountry.minDigits} digits.`);
      setErrorMessage(`Please enter a valid phone number (${selectedCountry.minDigits} digits required).`);
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setErrorMessage(null);
    if (!formData.institution.trim()) {
      setErrorMessage('Please enter your college or university name.');
      return false;
    }
    if (!formData.degree.trim()) {
      setErrorMessage('Please select or specify your degree program.');
      return false;
    }
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    setErrorMessage(null);
    if (!formData.skills.trim()) {
      setErrorMessage('Please enter at least one technical skill or select from the tags.');
      return false;
    }
    if (formData.areasOfInterest.length === 0) {
      setErrorMessage('Please choose at least one track or area of interest.');
      return false;
    }
    return true;
  };

  // Step 4 Validation & Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.resumeUrl.trim()) {
      setErrorMessage('Please provide a valid link to your Resume / CV.');
      return;
    }

    if (!formData.reasonForApplying.trim() || formData.reasonForApplying.trim().length < 15) {
      setErrorMessage('Please share why you want to join this program (at least 15 characters).');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must review and agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedSkills = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const fullPhoneNumber = `${selectedCountry.code} ${formData.phone}`;

      await applicationsApi.submitApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: fullPhoneNumber,
        countryCode: selectedCountry.code,
        gender: formData.gender,
        city: formData.city.trim(),
        state: formData.state.trim(),
        institution: formData.institution.trim(),
        degree: formData.degree.trim(),
        branch: formData.branch.trim(),
        semester: formData.semester.trim(),
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa.trim(),
        rollNumber: formData.rollNumber.trim(),
        skills: parsedSkills.length > 0 ? parsedSkills : ['JavaScript', 'React'],
        areasOfInterest: formData.areasOfInterest,
        internshipPreference: formData.internshipPreference,
        availability: formData.availability,
        previousExperience: formData.previousExperience.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        linkedInUrl: formData.linkedInUrl.trim(),
        githubUrl: formData.githubUrl.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        reasonForApplying: formData.reasonForApplying.trim(),
        additionalInfo: formData.additionalInfo.trim(),
      });

      setIsSubmitted(true);
      toast.success('Internship application submitted successfully!');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit application. An active application may already exist for this email.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
    setErrorMessage(null);
    setNameError(null);
    setPhoneError(null);
    setAgreedToTerms(false);
  };

  const firstName = formData.fullName.trim().split(' ')[0] || 'Applicant';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Centered card: max 760px, 1px border, large radius (16px), subtle shadow */}
      <div className="relative w-full max-w-[760px] bg-surface dark:bg-surface-dark border border-slate-200 dark:border-[#2D3347] rounded-[16px] shadow-custom flex flex-col max-h-[92dvh] overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* ================= ZONE 1: HEADER ================= */}
        <div className="px-6 pt-6 pb-5 relative shrink-0 border-b border-slate-200 dark:border-[#2D3347]">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[10px] transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/25"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Form Title & Muted Subtitle */}
          <div className="pr-10">
            <h2 className="text-[28px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Internship Application
            </h2>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">
              Apply for engineering, AI, and design internships with structured PPO tracks.
            </p>
          </div>

          {/* Hexagon Step Indicator */}
          {!isSubmitted && (
            <div className="mt-6">
              {/* Desktop & Tablet Hexagon Stepper */}
              <div className="relative flex items-center justify-between">
                {/* Connecting thin line */}
                <div className="absolute left-[17px] right-[17px] top-[19px] -translate-y-1/2 h-[1.5px] bg-slate-200 dark:bg-slate-700 z-0" />

                {STEPS.map((step) => {
                  const isCurrent = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  const isUpcoming = currentStep < step.number;

                  return (
                    <div
                      key={step.number}
                      className="relative z-10 flex flex-col items-center group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isCompleted) setCurrentStep(step.number as any);
                        }}
                        disabled={isUpcoming}
                        aria-label={`Step ${step.number}: ${step.name}`}
                        className={`w-[34px] h-[38px] flex items-center justify-center transition-colors duration-150 ${
                          isCompleted
                            ? 'bg-accent text-white cursor-pointer hover:opacity-90'
                            : isCurrent
                            ? 'bg-primary text-white shadow-xs cursor-default'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default'
                        }`}
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <span className="text-[13px] font-bold">{step.number}</span>
                        )}
                      </button>

                      {/* Step Name: visible on tablet/desktop, mobile shows current step only */}
                      <span
                        className={`mt-1.5 text-[12.5px] transition-colors duration-150 ${
                          isCurrent
                            ? 'font-semibold text-primary dark:text-primary-light'
                            : isCompleted
                            ? 'font-medium text-slate-700 dark:text-slate-300'
                            : 'font-normal text-slate-400 dark:text-slate-500'
                        } hidden min-[600px]:inline-block`}
                      >
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile-only current step label */}
              <div className="min-[600px]:hidden mt-2 text-center">
                <span className="text-[12.5px] font-semibold text-primary dark:text-primary-light">
                  {STEPS[currentStep - 1].name}
                </span>
              </div>

              {/* Helper Line below Header */}
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                Step {currentStep} of 4. Fields marked <span className="text-red-500">*</span> are required.
              </p>
            </div>
          )}
        </div>

        {/* ================= ZONE 2: FORM BODY (2-Column Grid) ================= */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-10 px-4 animate-fade-in flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-[24px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Application Received, {firstName}!
              </h3>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                We have received your application and will review your profile with the committee shortly.
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="min-h-[46px] px-6 rounded-[12px] border-[1.5px] border-slate-200 dark:border-[#2D3347] text-slate-700 dark:text-slate-300 font-semibold text-[15px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer"
                >
                  Start over
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="application-form">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border-[1.5px] border-red-500 rounded-[10px] text-[12.5px] font-medium text-red-500">
                  {errorMessage}
                </div>
              )}

              {/* Grid: 2 columns with 16px col gap, 18px row gap, collapses under 600px */}
              <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-x-[16px] gap-y-[18px]">
                
                {/* ================= STEP 1: PERSONAL ================= */}
                {currentStep === 1 && (
                  <>
                    {/* Full Name (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleNameChange}
                        onKeyDown={handleNameKeyDown}
                        placeholder="e.g. John Doe"
                        className={`w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:outline-none ${
                          nameError
                            ? 'border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/25'
                            : 'border-slate-200 dark:border-[#2D3347] focus:border-primary focus:ring-[3px] focus:ring-primary/25'
                        }`}
                      />
                      {nameError ? (
                        <p className="text-[12.5px] font-medium text-red-500 mt-1">{nameError}</p>
                      ) : (
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Letters, spaces, and hyphens only.</p>
                      )}
                    </div>

                    {/* Gender (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-2">
                        {GENDER_OPTIONS.map((opt) => {
                          const isSelected = formData.gender === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, gender: opt.value })}
                              className={`min-h-[44px] px-3.5 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center gap-2.5 cursor-pointer text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className="truncate">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Official updates will be delivered here.</p>
                    </div>

                    {/* Phone field joined as one control with digit counter on label */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium">
                          {formData.phone.length}/{selectedCountry.maxDigits} digits
                        </span>
                      </div>

                      <div
                        className={`flex min-h-[44px] rounded-[10px] border-[1.5px] bg-slate-50 dark:bg-[#12151E] transition-colors duration-150 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/25 ${
                          phoneError ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/25' : 'border-slate-200 dark:border-[#2D3347]'
                        }`}
                      >
                        {/* Select on the left: flag + dial code, no gap, shared border */}
                        <select
                          value={selectedCountry.code}
                          onChange={handleCountryChange}
                          aria-label="Country dial code"
                          className="px-[12px] min-h-[44px] bg-transparent text-[14px] font-medium text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-[#2D3347] focus:outline-none cursor-pointer shrink-0"
                        >
                          {COUNTRIES.map(c => (
                            <option key={c.country + c.code} value={c.code} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>

                        {/* Digits input */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder={selectedCountry.placeholder}
                          className="flex-1 px-[12px] min-h-[44px] bg-transparent text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                        />
                      </div>

                      {phoneError ? (
                        <p className="text-[12.5px] font-medium text-red-500 mt-1">{phoneError}</p>
                      ) : (
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Numeric digits only.</p>
                      )}
                    </div>

                    {/* Current City */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Current City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => {
                          if (/^[a-zA-Z\s.-]*$/.test(e.target.value)) {
                            setFormData({ ...formData, city: e.target.value });
                          }
                        }}
                        placeholder="e.g. Bengaluru"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* State / Province */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={e => {
                          if (/^[a-zA-Z\s.-]*$/.test(e.target.value)) {
                            setFormData({ ...formData, state: e.target.value });
                          }
                        }}
                        placeholder="e.g. Karnataka"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* ================= STEP 2: ACADEMIC ================= */}
                {currentStep === 2 && (
                  <>
                    {/* Institution (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        College / Institution Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={e => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* Degree */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Degree / Program <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.degree}
                        onChange={e => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      >
                        <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                        <option value="BCA">BCA (Computer Applications)</option>
                        <option value="MCA">MCA (Computer Applications)</option>
                        <option value="B.Sc Computer Science / IT">B.Sc Computer Science / IT</option>
                        <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                        <option value="Dual Degree / Integrated">Dual Degree / Integrated</option>
                        <option value="Diploma in Engineering">Diploma in Engineering</option>
                        <option value="Other Degree">Other Degree</option>
                      </select>
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Branch / Specialization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.branch}
                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                        placeholder="e.g. Computer Science & Engineering"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* Current Semester */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Current Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.semester}
                        onChange={e => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      >
                        <option value="1st Semester">1st Semester (1st Yr)</option>
                        <option value="2nd Semester">2nd Semester (1st Yr)</option>
                        <option value="3rd Semester">3rd Semester (2nd Yr)</option>
                        <option value="4th Semester">4th Semester (2nd Yr)</option>
                        <option value="5th Semester">5th Semester (3rd Yr)</option>
                        <option value="6th Semester (3rd Year)">6th Semester (3rd Yr)</option>
                        <option value="7th Semester">7th Semester (4th Yr)</option>
                        <option value="8th Semester">8th Semester (4th Yr)</option>
                        <option value="Recent Graduate (2024-2025)">Recent Graduate</option>
                      </select>
                    </div>

                    {/* Graduation Year */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.graduationYear}
                        onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>

                    {/* CGPA */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        CGPA / Percentage
                      </label>
                      <input
                        type="text"
                        value={formData.cgpa}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^(\d{0,2}(\.\d{0,2})?)?$/.test(val) || /^(\d{0,3})?%?$/.test(val)) {
                            setFormData({ ...formData, cgpa: val });
                          }
                        }}
                        placeholder="e.g. 8.5 / 10"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Optional academic score.</p>
                    </div>

                    {/* Roll Number (Optional) */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Roll Number / Student ID
                      </label>
                      <input
                        type="text"
                        value={formData.rollNumber}
                        onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder="e.g. 21CS042"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Optional university registration number.</p>
                    </div>
                  </>
                )}

                {/* ================= STEP 3: TRACK & SKILLS ================= */}
                {currentStep === 3 && (
                  <>
                    {/* Track Selection (multi-choice with rounded-square marker) - spans 2 cols */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Target Track <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-2">
                        {TRACK_OPTIONS.map((track) => {
                          const isSelected = formData.areasOfInterest.includes(track);
                          return (
                            <button
                              key={track}
                              type="button"
                              onClick={() => toggleInterest(track)}
                              className={`min-h-[44px] px-3.5 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center gap-2.5 cursor-pointer text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </span>
                              <span className="truncate">{track}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technical Skills: Chips above input, input, suggested pills below (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Technical Skills <span className="text-red-500">*</span>
                      </label>

                      {/* Selected skills as small rounded chips with × button above input */}
                      {currentSkillsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {currentSkillsList.map(skill => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12.5px] font-medium bg-primary/10 text-primary dark:text-primary-light border border-primary/20"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => removeSkillPill(skill)}
                                aria-label={`Remove ${skill}`}
                                className="hover:text-red-500 focus:outline-none cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        value={formData.skills}
                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="Type skills separated by commas (e.g. React, TypeScript, Python)"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />

                      {/* Suggested skills as small outlined pills with a "+" prefix below input */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {SUGGESTED_SKILLS.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkillPill(skill)}
                            className="px-2.5 py-1 rounded-full text-[12.5px] border border-slate-200 dark:border-[#2D3347] bg-slate-50/50 dark:bg-[#12151E] text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors duration-150 cursor-pointer"
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Workplace Preference (Single choice pills with radio circles) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Workplace Preference <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {WORKPLACE_OPTIONS.map(opt => {
                          const isSelected = formData.internshipPreference === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, internshipPreference: opt.value as any })}
                              className={`min-h-[44px] px-3.5 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Availability (Single choice pills with radio circles) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Earliest Availability <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-2">
                        {AVAILABILITY_OPTIONS.map(opt => {
                          const isSelected = formData.availability === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, availability: opt.value })}
                              className={`min-h-[44px] px-3 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center gap-2 cursor-pointer text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className="truncate">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Past Experience (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Past Experience or Projects
                      </label>
                      <input
                        type="text"
                        value={formData.previousExperience}
                        onChange={e => setFormData({ ...formData, previousExperience: e.target.value })}
                        placeholder="e.g. Built full-stack dashboard, completed React hackathon"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">Brief summary of prior projects or internships.</p>
                    </div>
                  </>
                )}

                {/* ================= STEP 4: RESUME & SOP ================= */}
                {currentStep === 4 && (
                  <>
                    {/* Resume / CV Link (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Resume / CV Link <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        required
                        value={formData.resumeUrl}
                        onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/your-resume-link"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
                        Please ensure permissions are set to "Anyone with the link can view".
                      </p>
                    </div>

                    {/* GitHub Link */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* LinkedIn Link */}
                    <div>
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        value={formData.linkedInUrl}
                        onChange={e => setFormData({ ...formData, linkedInUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* Portfolio Link (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Portfolio or Live Demo
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        value={formData.portfolioUrl}
                        onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.dev"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* Reason for Applying (Textarea spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Why do you want to join InterHive? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.reasonForApplying}
                        onChange={e => setFormData({ ...formData, reasonForApplying: e.target.value })}
                        placeholder="Share your technical goals and what you hope to build during the program..."
                        className="w-full min-h-[80px] p-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Additional Info (spans 2 cols) */}
                    <div className="min-[600px]:col-span-2">
                      <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                        Additional Notes
                      </label>
                      <input
                        type="text"
                        value={formData.additionalInfo}
                        onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
                        placeholder="Any additional queries or notes for the committee"
                        className="w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none"
                      />
                    </div>

                    {/* Consent checkbox (20px checkbox, 14px text, primary links) */}
                    <div className="min-[600px]:col-span-2 pt-1">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToTerms}
                          onChange={e => setAgreedToTerms(e.target.checked)}
                          className="w-5 h-5 mt-0.5 rounded-[4px] border-[1.5px] border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/25 cursor-pointer shrink-0"
                        />
                        <span className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">
                          I certify that all details submitted are accurate and agree to InterHive evaluating my profile in accordance with the{' '}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            Privacy Policy
                          </a>{' '}
                          and{' '}
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            Terms of Service
                          </a>
                          .
                        </span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </form>
          )}
        </div>

        {/* ================= ZONE 3: FOOTER BAR ================= */}
        {!isSubmitted && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-[#2D3347] flex items-center justify-between gap-3 shrink-0 bg-surface dark:bg-surface-dark">
            {/* Back button (outlined) on the left */}
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep - 1) as any)}
                  className="min-h-[46px] px-5 rounded-[12px] border-[1.5px] border-slate-200 dark:border-[#2D3347] text-slate-700 dark:text-slate-300 font-semibold text-[15px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Primary Action on the right */}
            <div>
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                >
                  Next: Academic
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setCurrentStep(3);
                  }}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                >
                  Next: Skills & Track
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) setCurrentStep(4);
                  }}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                >
                  Next: Resume & Statement
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="submit"
                  form="application-form"
                  disabled={isSubmitting}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom disabled:opacity-60 focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit application'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
