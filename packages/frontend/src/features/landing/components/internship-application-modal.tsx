import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  FileText,
  User,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  Code2,
  Check,
  ShieldCheck,
  Globe,
  Award,
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

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Next.js',
  'Tailwind CSS', 'SQL', 'MongoDB', 'Docker', 'AWS',
  'FastAPI', 'Figma', 'GraphQL', 'Git'
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
  const [formData, setFormData] = useState({
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
  });

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

  const addSkillPill = (skill: string) => {
    const currentList = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!currentList.includes(skill)) {
      const updated = currentList.length > 0 ? `${formData.skills}, ${skill}` : skill;
      setFormData(prev => ({ ...prev, skills: updated }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMessage(null);
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage('Please enter your full official name (letters only).');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92dvh]">
        {/* Sleek Executive Header */}
        <div className="bg-slate-900 px-6 py-5 text-white relative shrink-0 border-b border-slate-800">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Intake Cohort
            </span>
            <span className="text-slate-400 text-xs font-medium">Free Candidate Application</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            InterHive Internship Application
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-lg">
            Direct review by HR committee & industry mentors. Fast-track your career with production experience.
          </p>

          {/* Clean Stepper Indicators */}
          {!isSubmitted && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { step: 1, label: 'Personal', icon: User },
                  { step: 2, label: 'Academic', icon: GraduationCap },
                  { step: 3, label: 'Skills & Track', icon: Code2 },
                  { step: 4, label: 'Resume & SOP', icon: FileText },
                ].map(({ step, label, icon: Icon }) => {
                  const isActive = currentStep === step;
                  const isCompleted = currentStep > step;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        if (step < currentStep) setCurrentStep(step as any);
                      }}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isCompleted
                          ? 'text-emerald-400 hover:bg-slate-800/80 cursor-pointer'
                          : 'text-slate-500 cursor-default'
                      }`}
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full text-[11px] bg-white/10 shrink-0">
                        {isCompleted ? <Check className="w-3 h-3 text-emerald-400" /> : step}
                      </span>
                      <span className="hidden sm:inline truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          {isSubmitted ? (
            <div className="text-center py-8 px-4 animate-in fade-in">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Application Submitted!</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Thank you, <strong>{formData.fullName}</strong>. Your application has been logged into the{' '}
                <strong>InterHive Talent Evaluation Portal</strong>.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-6 text-left max-w-md mx-auto text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Next Evaluation Milestones:
                </p>
                <p>1. Academic verification and resume score review by technical lead.</p>
                <p>2. If shortlisted, interview call scheduled via email at <strong>{formData.email}</strong>.</p>
                <p>3. Once selected, your authenticated intern credentials will be provisioned directly.</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ================= STEP 1: PERSONAL DETAILS ================= */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Candidate Personal Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Please ensure name and contact details match your official government ID.</p>
                  </div>

                  {/* Full Name with strict alphabetical restriction */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleNameChange}
                        onKeyDown={handleNameKeyDown}
                        placeholder="e.g. John Doe (letters only)"
                        className={`w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-slate-50 border rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 ${
                          nameError ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-indigo-600'
                        }`}
                      />
                    </div>
                    {nameError ? (
                      <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {nameError}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">Accepts alphabetical letters and spaces only. No numbers permitted.</p>
                    )}
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GENDER_OPTIONS.map(opt => {
                        const isSelected = formData.gender === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: opt.value })}
                            className={`py-2 px-3 min-h-[44px] rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400'}`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email & Phone with Country Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          inputMode="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@college.edu or name@gmail.com"
                          className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Official evaluation status will be sent here.</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formData.phone.length}/{selectedCountry.maxDigits} digits
                        </span>
                      </div>
                      
                      <div className="flex rounded-xl shadow-2xs">
                        {/* Country code selector */}
                        <div className="relative shrink-0">
                          <select
                            value={selectedCountry.code}
                            onChange={handleCountryChange}
                            className="h-full pl-2.5 pr-6 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer appearance-none"
                            title="Select Country Dial Code"
                          >
                            {COUNTRIES.map(c => (
                              <option key={c.country + c.code} value={c.code}>
                                {c.flag} {c.code} ({c.country})
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▼</span>
                        </div>

                        {/* Digits only input */}
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            inputMode="numeric"
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder={selectedCountry.placeholder}
                            className={`w-full px-3 py-2.5 min-h-[44px] bg-slate-50 border rounded-r-xl text-base sm:text-sm font-mono font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 ${
                              phoneError ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-indigo-600'
                            }`}
                          />
                        </div>
                      </div>

                      {phoneError ? (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {phoneError}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1">Digits only without leading 0 or symbols.</p>
                      )}
                    </div>
                  </div>

                  {/* City & State Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={e => {
                            if (/^[a-zA-Z\s.-]*$/.test(e.target.value)) {
                              setFormData({ ...formData, city: e.target.value });
                            }
                          }}
                          placeholder="e.g. Bengaluru, Pune, Delhi"
                          className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
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
                        placeholder="e.g. Karnataka, Maharashtra"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Next Step Action */}
                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setCurrentStep(2);
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-indigo-500/25 active:scale-98"
                    >
                      <span>Next: Academic Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: ACADEMIC DETAILS ================= */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      Academic & College Education
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Tell us about your educational institution and program status.</p>
                  </div>

                  {/* College / Institution */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College / Institution Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={e => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. National Institute of Technology, BITS Pilani, etc."
                        className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Degree & Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Degree / Program <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.degree}
                        onChange={e => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                        <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                        <option value="MCA">MCA (Master of Computer Applications)</option>
                        <option value="B.Sc Computer Science / IT">B.Sc Computer Science / IT</option>
                        <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                        <option value="Dual Degree / Integrated M.Tech">Dual Degree / Integrated M.Tech</option>
                        <option value="Diploma in Engineering">Diploma in Engineering</option>
                        <option value="Other Degree">Other Degree</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Branch / Specialization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.branch}
                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                        placeholder="e.g. Computer Science, AI & ML, ECE, IT"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Current Semester & Graduation Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.semester}
                        onChange={e => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
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

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.graduationYear}
                        onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                        className="w-full px-3 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        <option value="2024">2024 (Passout)</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        CGPA / % (Optional)
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
                        placeholder="e.g. 8.5 / 10 or 85%"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Roll Number / Student ID (Optional under data minimisation) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Roll Number / Student Registration ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="e.g. 21CS042 or College Enrollment ID"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Helps expedite academic credential verification with partner colleges.</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Personal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) setCurrentStep(3);
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-indigo-500/25 active:scale-98"
                    >
                      <span>Next: Skills & Preferences</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: TRACK & SKILLS ================= */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-600" />
                      Technical Track & Skills
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Select your primary internship domain and highlight your key technical competencies.</p>
                  </div>

                  {/* Areas of Interest / Track */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Select Target Track (Select all that apply) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TRACK_OPTIONS.map(track => {
                        const isSelected = formData.areasOfInterest.includes(track);
                        return (
                          <button
                            key={track}
                            type="button"
                            onClick={() => toggleInterest(track)}
                            className={`p-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{track}</span>
                            {isSelected ? <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> : <span className="text-slate-400">+</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Skills Input + Suggested Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Technical Skills & Tools <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. React, TypeScript, Python, Node.js, SQL"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />

                    {/* Quick Add Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[11px] text-slate-400 self-center mr-1">Quick add:</span>
                      {SUGGESTED_SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkillPill(skill)}
                          className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 transition-all cursor-pointer"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Workplace Preference & Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Workplace Preference <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.internshipPreference}
                        onChange={e => setFormData({ ...formData, internshipPreference: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        <option value="remote">Remote (Work from Anywhere)</option>
                        <option value="hybrid">Hybrid (Flexible In-Office)</option>
                        <option value="onsite">On-site (Office Location)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Earliest Availability <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.availability}
                        onChange={e => setFormData({ ...formData, availability: e.target.value })}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      >
                        <option value="Immediate (Within 1 week)">Immediate (Within 1 week)</option>
                        <option value="Within 2-3 weeks">Within 2-3 weeks</option>
                        <option value="Next Month (Semester Break)">Next Month (Semester Break)</option>
                        <option value="Flexible / Discuss during interview">Flexible / To discuss</option>
                      </select>
                    </div>
                  </div>

                  {/* Previous Experience (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Past Internships or Independent Projects (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.previousExperience}
                      onChange={e => setFormData({ ...formData, previousExperience: e.target.value })}
                      placeholder="e.g. Built full-stack e-commerce project, freelance React developer, hackathon finalist"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Academic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep3()) setCurrentStep(4);
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-indigo-500/25 active:scale-98"
                    >
                      <span>Next: Resume & Statement</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: RESUME & SOP ================= */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Resume Link & Statement of Purpose
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Provide public cloud links to your resume, code repositories, and motivation statement.</p>
                  </div>

                  {/* Resume Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resume / CV Link (Google Drive, Dropbox, Notion, or PDF URL) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="url"
                        inputMode="url"
                        required
                        value={formData.resumeUrl}
                        onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/your-resume-link"
                        className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Ensure link sharing permission is set to <strong>"Anyone with the link can view"</strong>.
                    </p>
                  </div>

                  {/* GitHub & LinkedIn Profiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GitHub Profile / Repo Link (Optional)
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/your-username"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        LinkedIn Profile Link (Optional)
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        value={formData.linkedInUrl}
                        onChange={e => setFormData({ ...formData, linkedInUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/your-profile"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Portfolio or Live Project URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Personal Portfolio or Live Project Demo (Optional)
                    </label>
                    <input
                      type="url"
                      inputMode="url"
                      value={formData.portfolioUrl}
                      onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://yourportfolio.dev or live deployed app URL"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  {/* Statement of Purpose */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Why do you want to join the InterHive Internship? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.reasonForApplying}
                      onChange={e => setFormData({ ...formData, reasonForApplying: e.target.value })}
                      placeholder="Share your technical learning goals, why you want production experience, and how you plan to contribute..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                    />
                  </div>

                  {/* Additional notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Additional Notes or Questions (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo}
                      onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
                      placeholder="Specific tech stack interest, certifications, or queries"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  {/* Mandatory DPDP & Terms Consent */}
                  <div className="pt-2 pb-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                      <input
                        type="checkbox"
                        required
                        checked={agreedToTerms}
                        onChange={e => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                      />
                      <span>
                        I certify that all details submitted are accurate and consent to InterHive evaluating my profile in accordance with the{' '}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-indigo-600 underline hover:text-indigo-800"
                        >
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-indigo-600 underline hover:text-indigo-800"
                        >
                          Terms of Service
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  {/* Final Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Skills</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 min-h-[44px] rounded-full font-black text-sm text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Official Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
