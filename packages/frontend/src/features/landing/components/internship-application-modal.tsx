import React, { useState, useId } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  Upload,
  FileCheck,
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
  { country: 'Canada', code: '+1-CA', flag: '🇨🇦', minDigits: 10, maxDigits: 10, placeholder: '416 555 0199' },
  { country: 'Singapore', code: '+65', flag: '🇸🇬', minDigits: 8, maxDigits: 8, placeholder: '8123 4567' },
  { country: 'Australia', code: '+61', flag: '🇦🇺', minDigits: 9, maxDigits: 9, placeholder: '412 345 678' },
  { country: 'Germany', code: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 11, placeholder: '151 23456789' },
  { country: 'France', code: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9, placeholder: '6 12 34 56 78' },
  { country: 'Japan', code: '+81', flag: '🇯🇵', minDigits: 10, maxDigits: 10, placeholder: '90 1234 5678' },
  { country: 'Bangladesh', code: '+880', flag: '🇧🇩', minDigits: 10, maxDigits: 10, placeholder: '1712 345678' },
  { country: 'Nepal', code: '+977', flag: '🇳🇵', minDigits: 10, maxDigits: 10, placeholder: '984 1234567' },
  { country: 'Other', code: '+', flag: '🌐', minDigits: 7, maxDigits: 15, placeholder: 'Phone digits' },
];

// Resolve display dial code from internal country code (Canada uses +1-CA internally)
const getDisplayCode = (code: string) => code === '+1-CA' ? '+1' : code;

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
  'Cybersecurity',
  'Blockchain & Web3',
  'Other',
];

const WORKPLACE_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'Immediate (Within 1 week)', label: 'Immediate' },
  { value: 'Within 2-3 weeks', label: '2–3 Weeks' },
  { value: 'Next Month (Semester Break)', label: 'Next Month' },
  { value: 'Flexible / Discuss during interview', label: 'Flexible' },
  { value: 'Other', label: 'Other' },
];

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Next.js',
  'Tailwind CSS', 'SQL', 'MongoDB', 'Docker', 'AWS',
  'FastAPI', 'Figma', 'GraphQL', 'Git',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
  'Outside India / Other',
];

const DEGREE_OPTIONS = [
  'B.Tech / B.E.',
  'BCA (Computer Applications)',
  'MCA (Computer Applications)',
  'B.Sc Computer Science / IT',
  'M.Tech / M.E.',
  'MBA',
  'BBA',
  'B.Com',
  'B.Sc (Non-CS)',
  'Dual Degree / Integrated',
  'Diploma in Engineering',
  'Ph.D.',
  'Other',
];

const BRANCH_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Artificial Intelligence & Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Biotechnology',
  'Physics',
  'Mathematics & Statistics',
  'Commerce',
  'Management',
  'Not Applicable',
  'Other',
];

const SEMESTER_OPTIONS = [
  { value: '1st Semester', label: '1st Semester (1st Year)' },
  { value: '2nd Semester', label: '2nd Semester (1st Year)' },
  { value: '3rd Semester', label: '3rd Semester (2nd Year)' },
  { value: '4th Semester', label: '4th Semester (2nd Year)' },
  { value: '5th Semester', label: '5th Semester (3rd Year)' },
  { value: '6th Semester', label: '6th Semester (3rd Year)' },
  { value: '7th Semester', label: '7th Semester (4th Year)' },
  { value: '8th Semester', label: '8th Semester (4th Year)' },
  { value: 'Recent Graduate (Passout)', label: 'Recent Graduate / Passout' },
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
  const currentYear = new Date().getFullYear();
  const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  // Dynamic graduation years: last year to +5 years
  const GRADUATION_YEARS = Array.from({ length: 7 }, (_, i) => String(currentYear - 1 + i));

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation feedback states
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(COUNTRIES[0]);

  // Explicit unbundled consents
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDataProcessing, setAgreedToDataProcessing] = useState(false);
  const [confirmedLinkPublic, setConfirmedLinkPublic] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // "Other" expansion state
  const [otherDegreeText, setOtherDegreeText] = useState('');
  const [otherBranchText, setOtherBranchText] = useState('');
  const [otherStateText, setOtherStateText] = useState('');
  const [otherTrackText, setOtherTrackText] = useState('');
  const [otherAvailabilityText, setOtherAvailabilityText] = useState('');

  const fileInputId = useId();

  // Form Data
  const initialFormData = {
    // Step 1: Personal
    fullName: '',
    email: '',
    phone: '',
    gender: '', // Unselected by default for DPDP data minimisation
    city: '',
    state: 'Karnataka',
    pinCode: '',
    countryCode: '+91',

    // Step 2: Academic
    institution: '',
    degree: 'B.Tech / B.E.',
    branch: 'Computer Science & Engineering',
    semester: '6th Semester',
    graduationYear: String(currentYear + 1),
    cgpa: '',

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

  // ──────────────────── helpers ────────────────────

  const isOutsideIndia = formData.state === 'Outside India / Other';
  const isDegreeOther = formData.degree === 'Other';
  const isBranchOther = formData.branch === 'Other';
  const isAvailabilityOther = formData.availability === 'Other';
  const hasOtherTrack = formData.areasOfInterest.includes('Other');

  // Resolved values for submission (replace "Other" with user-typed text)
  const resolvedDegree = isDegreeOther ? otherDegreeText.trim() : formData.degree;
  const resolvedBranch = isBranchOther ? otherBranchText.trim() : formData.branch;
  const resolvedState = isOutsideIndia ? (otherStateText.trim() || 'Outside India / Other') : formData.state;
  const resolvedAvailability = isAvailabilityOther
    ? (otherAvailabilityText.trim() || 'Flexible / Discuss during interview')
    : formData.availability;
  const resolvedInterests = formData.areasOfInterest.map(t =>
    t === 'Other' ? (otherTrackText.trim() || 'Other') : t
  );

  // Strict Name Character Validation (Unicode-letter pattern supporting accented letters)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (/^[\p{L}\p{M}\s.'-]*$/u.test(rawVal)) {
      setNameError(null);
      setFormData(prev => ({ ...prev, fullName: rawVal }));
    } else {
      setNameError('Numbers and symbols are not allowed in name.');
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
      return;
    }
    if (!/^[\p{L}\p{M}\s.'-]$/u.test(e.key)) {
      e.preventDefault();
      setNameError('Numbers and symbols are not allowed in name.');
    }
  };

  // PIN Code validation (6-digit numeric for India, skipped for outside India)
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pinCode: digitsOnly }));
    if (digitsOnly.length > 0 && digitsOnly.length < 6) {
      setPinError('PIN code must be exactly 6 digits.');
    } else {
      setPinError(null);
    }
  };

  // Strict Phone Digits Validation
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
    const found = COUNTRIES.find(c => c.country === e.target.value) || COUNTRIES[0];
    setSelectedCountry(found);
    setFormData(prev => ({ ...prev, countryCode: getDisplayCode(found.code), phone: '' }));
    setPhoneError(null);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.areasOfInterest.includes(interest);
      if (exists) {
        return { ...prev, areasOfInterest: prev.areasOfInterest.filter(i => i !== interest) };
      } else {
        return { ...prev, areasOfInterest: [...prev.areasOfInterest, interest] };
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

  // Optional PDF file upload (max 2 MB)
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('PDF file size exceeds 2 MB limit.');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are accepted.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setFormData(prev => ({ ...prev, resumeUrl: base64Data }));
      setUploadedFileName(file.name);
      setConfirmedLinkPublic(true);
      toast.success(`Attached ${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
    };
    reader.readAsDataURL(file);
  };

  // ──────────────────── step validators ────────────────────

  const validateStep1 = () => {
    setErrorMessage(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage('Please enter your full official name (at least 2 characters).');
      return false;
    }
    if (formData.fullName.trim().length > 100) {
      setErrorMessage('Full name cannot exceed 100 characters.');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    // Strict Indian phone validation
    if (selectedCountry.code === '+91') {
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        setPhoneError('Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.');
        setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
        return false;
      }
    } else {
      if (formData.phone.length < selectedCountry.minDigits) {
        setPhoneError(`Phone number for ${selectedCountry.country} must be at least ${selectedCountry.minDigits} digits.`);
        setErrorMessage(`Please enter a valid phone number (${selectedCountry.minDigits} digits required).`);
        return false;
      }
    }

    if (!formData.city.trim()) {
      setErrorMessage('Please enter your current city.');
      return false;
    }

    // PIN code: required for India residents, optional for outside India
    if (!isOutsideIndia) {
      if (!formData.pinCode || formData.pinCode.length !== 6) {
        setPinError('Please enter a valid 6-digit PIN code.');
        setErrorMessage('Please enter your 6-digit PIN / Postal code.');
        return false;
      }
    } else if (formData.pinCode && formData.pinCode.length > 0 && formData.pinCode.length < 6) {
      setPinError('PIN code must be exactly 6 digits.');
      setErrorMessage('Please enter a valid PIN code.');
      return false;
    }

    // If state is outside India, require the custom text
    if (isOutsideIndia && !otherStateText.trim()) {
      setErrorMessage('Please specify your country / region since you selected "Outside India / Other".');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    setErrorMessage(null);

    if (!formData.institution.trim()) {
      setErrorMessage('Please enter your college or university name.');
      return false;
    }
    if (formData.institution.trim().length > 150) {
      setErrorMessage('Institution name cannot exceed 150 characters.');
      return false;
    }

    if (!formData.degree.trim()) {
      setErrorMessage('Please select your degree program.');
      return false;
    }
    if (isDegreeOther && !otherDegreeText.trim()) {
      setErrorMessage('Please specify your degree / qualification in the "Other" field.');
      return false;
    }
    if (isBranchOther && !otherBranchText.trim()) {
      setErrorMessage('Please specify your branch / specialization in the "Other" field.');
      return false;
    }

    // Cross-field validation: Recent graduate vs future graduation year
    const gradYearNum = parseInt(formData.graduationYear, 10);
    const isRecentGrad = formData.semester === 'Recent Graduate (Passout)';

    if (isRecentGrad && gradYearNum > currentYear) {
      setErrorMessage(`A recent graduate cannot have a future graduation year (${formData.graduationYear}). Please adjust your graduation year.`);
      return false;
    }

    if (!isRecentGrad && gradYearNum < currentYear - 1) {
      setErrorMessage(`Selected graduation year (${formData.graduationYear}) seems too far in the past. Please select 'Recent Graduate' or choose your expected graduation year.`);
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    setErrorMessage(null);

    if (!formData.skills.trim()) {
      setErrorMessage('Please enter at least one technical skill or select from the suggestions.');
      return false;
    }
    if (formData.areasOfInterest.length === 0) {
      setErrorMessage('Please choose at least one track or area of interest.');
      return false;
    }
    if (hasOtherTrack && !otherTrackText.trim()) {
      setErrorMessage('Please specify your track in the "Other" field below the track selector.');
      return false;
    }
    if (isAvailabilityOther && !otherAvailabilityText.trim()) {
      setErrorMessage('Please specify your availability in the "Other" field.');
      return false;
    }
    return true;
  };

  // Step 4 Validation & Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.resumeUrl.trim()) {
      setErrorMessage('Please provide a valid link to your Resume / CV or upload a PDF.');
      return;
    }

    if (!uploadedFileName && !confirmedLinkPublic) {
      setErrorMessage('Please confirm that your resume link permissions are set to "Anyone with the link can view".');
      return;
    }

    // Statement of purpose minimum 150 characters
    if (!formData.reasonForApplying.trim() || formData.reasonForApplying.trim().length < 150) {
      setErrorMessage(`Statement of purpose must be at least 150 characters (currently ${formData.reasonForApplying.trim().length}/150). Please elaborate on your goals and project interests.`);
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must review and agree to the Terms of Service.');
      return;
    }

    if (!agreedToDataProcessing) {
      setErrorMessage('You must consent to data processing under the DPDP Act to submit your application.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedSkills = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const fullPhoneNumber = `${getDisplayCode(selectedCountry.code)} ${formData.phone}`;

      await applicationsApi.submitApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: fullPhoneNumber,
        countryCode: getDisplayCode(selectedCountry.code),
        gender: formData.gender || undefined,
        city: formData.city.trim(),
        state: resolvedState,
        institution: formData.institution.trim(),
        degree: resolvedDegree,
        branch: resolvedBranch,
        semester: formData.semester,
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa.trim(),
        rollNumber: '',
        skills: parsedSkills.length > 0 ? parsedSkills : ['JavaScript', 'React'],
        areasOfInterest: resolvedInterests,
        internshipPreference: formData.internshipPreference,
        availability: resolvedAvailability,
        previousExperience: formData.previousExperience.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        linkedInUrl: formData.linkedInUrl.trim(),
        githubUrl: formData.githubUrl.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        reasonForApplying: formData.reasonForApplying.trim(),
        additionalInfo: formData.additionalInfo.trim(),
        consentTimestamp: new Date().toISOString(),
        consentVersion: 'v2026.1',
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
    setPinError(null);
    setAgreedToTerms(false);
    setAgreedToDataProcessing(false);
    setConfirmedLinkPublic(false);
    setUploadedFileName(null);
    setOtherDegreeText('');
    setOtherBranchText('');
    setOtherStateText('');
    setOtherTrackText('');
    setOtherAvailabilityText('');
  };

  const firstName = formData.fullName.trim().split(' ')[0] || 'Applicant';

  // ──────────────────── shared class helpers ────────────────────

  const inputCls = 'w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none';
  const selectCls = `${inputCls} cursor-pointer`;
  const labelCls = 'block text-[14px] font-semibold text-slate-800 dark:text-slate-200 mb-1.5';
  const hintCls = 'text-[12.5px] text-slate-500 dark:text-slate-400 mt-1';
  const errorHintCls = 'text-[12.5px] font-medium text-red-500 mt-1';
  const otherInputCls = `${inputCls} mt-2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Centered card */}
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

          {/* Form Title & Factual Subtitle */}
          <div className="pr-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary dark:text-primary-light">
                Applications open · {currentMonthYear} batch
              </span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">Reviewed within 7 days</span>
            </div>
            <h2 className="text-[28px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Internship Application
            </h2>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">
              Applications are reviewed on a rolling basis; you'll hear back within 7 days. Never pay to apply.
            </p>
          </div>

          {/* Hexagon Step Indicator */}
          {!isSubmitted && (
            <div className="mt-6">
              <div className="relative flex items-center justify-between">
                {/* Connecting thin line */}
                <div className="absolute left-[17px] right-[17px] top-[19px] -translate-y-1/2 h-[1.5px] bg-slate-200 dark:bg-slate-700 z-0" />

                {STEPS.map((step) => {
                  const isCurrent = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  const isUpcoming = currentStep < step.number;

                  return (
                    <div key={step.number} className="relative z-10 flex flex-col items-center group">
                      <button
                        type="button"
                        onClick={() => { if (isCompleted) setCurrentStep(step.number as any); }}
                        disabled={isUpcoming}
                        aria-label={`Step ${step.number}: ${step.name}`}
                        className={`w-[34px] h-[38px] flex items-center justify-center transition-colors duration-150 ${
                          isCompleted
                            ? 'bg-accent text-white cursor-pointer hover:opacity-90'
                            : isCurrent
                            ? 'bg-primary text-white shadow-xs cursor-default'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default'
                        }`}
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <span className="text-[13px] font-bold">{step.number}</span>
                        )}
                      </button>

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

              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                Step {currentStep} of 4. Fields marked <span className="text-red-500">*</span> are required.
              </p>
            </div>
          )}
        </div>

        {/* ================= ZONE 2: FORM BODY ================= */}
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
                We have received your application. The InterHive review team will assess your profile and respond within 7 days.
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
                <div role="alert" className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border-[1.5px] border-red-500 rounded-[10px] text-[12.5px] font-medium text-red-500">
                  {errorMessage}
                </div>
              )}

              {/* Grid: 2 columns, collapses under 600px */}
              <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-x-[16px] gap-y-[18px]">

                {/* ================= STEP 1: PERSONAL ================= */}
                {currentStep === 1 && (
                  <>
                    {/* Full Name */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.fullName}
                        onChange={handleNameChange}
                        onKeyDown={handleNameKeyDown}
                        placeholder="e.g. Ankit Yadav or Renée Müller"
                        aria-describedby="name-hint"
                        className={`w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:outline-none ${
                          nameError
                            ? 'border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/25'
                            : 'border-slate-200 dark:border-[#2D3347] focus:border-primary focus:ring-[3px] focus:ring-primary/25'
                        }`}
                      />
                      {nameError ? (
                        <p id="name-hint" className={errorHintCls}>{nameError}</p>
                      ) : (
                        <p id="name-hint" className={hintCls}>Letters only — no numbers or special symbols.</p>
                      )}
                    </div>

                    {/* Gender (Optional) */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>Gender (Optional)</label>
                      <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-2">
                        {GENDER_OPTIONS.map((opt) => {
                          const isSelected = formData.gender === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, gender: isSelected ? '' : opt.value })}
                              aria-pressed={isSelected}
                              className={`min-h-[44px] px-3.5 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center gap-2.5 cursor-pointer text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className="truncate">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelCls}>
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        required
                        maxLength={254}
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className={inputCls}
                      />
                      <p className={hintCls}>Review feedback delivered within 7 days.</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium">
                          {formData.phone.length}/{selectedCountry.maxDigits} digits
                        </span>
                      </div>

                      <div className={`flex min-h-[44px] rounded-[10px] border-[1.5px] bg-slate-50 dark:bg-[#12151E] transition-colors duration-150 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/25 ${
                        phoneError ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/25' : 'border-slate-200 dark:border-[#2D3347]'
                      }`}>
                        <select
                          value={selectedCountry.country}
                          onChange={handleCountryChange}
                          aria-label="Country dial code"
                          className="px-[12px] min-h-[44px] bg-transparent text-[14px] font-medium text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-[#2D3347] focus:outline-none cursor-pointer shrink-0"
                        >
                          {COUNTRIES.map(c => (
                            <option key={c.country} value={c.country} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                              {c.flag} {getDisplayCode(c.code)}
                            </option>
                          ))}
                        </select>

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
                        <p className={errorHintCls}>{phoneError}</p>
                      ) : (
                        <p className={hintCls}>
                          {selectedCountry.code === '+91' ? 'Must start with 6, 7, 8, or 9 — 10 digits.' : 'Numeric digits only.'}
                        </p>
                      )}
                    </div>

                    {/* Current City */}
                    <div>
                      <label className={labelCls}>
                        Current City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        value={formData.city}
                        onChange={e => {
                          if (/^[\p{L}\p{M}\s.'-]*$/u.test(e.target.value)) {
                            setFormData({ ...formData, city: e.target.value });
                          }
                        }}
                        placeholder="e.g. Bengaluru, Pune, Mumbai"
                        className={inputCls}
                      />
                    </div>

                    {/* PIN / Postal Code */}
                    <div>
                      <label className={labelCls}>
                        PIN / Postal Code{!isOutsideIndia && <span className="text-red-500"> *</span>}
                        {isOutsideIndia && <span className="text-slate-500 font-normal"> (Optional)</span>}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.pinCode}
                        onChange={handlePinChange}
                        placeholder={isOutsideIndia ? 'Postal code (if applicable)' : '6-digit PIN code'}
                        maxLength={6}
                        className={`w-full min-h-[44px] px-[12px] rounded-[10px] border-[1.5px] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:outline-none ${
                          pinError
                            ? 'border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/25'
                            : 'border-slate-200 dark:border-[#2D3347] focus:border-primary focus:ring-[3px] focus:ring-primary/25'
                        }`}
                      />
                      {pinError ? (
                        <p className={errorHintCls}>{pinError}</p>
                      ) : (
                        <p className={hintCls}>{isOutsideIndia ? 'Enter your local postal code.' : 'Must be exactly 6 digits (India).'}</p>
                      )}
                    </div>

                    {/* State / UT Dropdown */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        State / Union Territory <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={e => {
                          setFormData({ ...formData, state: e.target.value });
                          if (e.target.value !== 'Outside India / Other') setOtherStateText('');
                        }}
                        className={selectCls}
                      >
                        {INDIAN_STATES.map(st => (
                          <option key={st} value={st} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                            {st}
                          </option>
                        ))}
                      </select>
                      {/* Dynamic "Other" text field */}
                      {isOutsideIndia && (
                        <input
                          type="text"
                          required
                          maxLength={80}
                          value={otherStateText}
                          onChange={e => setOtherStateText(e.target.value)}
                          placeholder="Specify your country / region"
                          className={otherInputCls}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* ================= STEP 2: ACADEMIC ================= */}
                {currentStep === 2 && (
                  <>
                    {/* Institution */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        College / Institution Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={150}
                        value={formData.institution}
                        onChange={e => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. National Institute of Technology, Bengaluru"
                        className={inputCls}
                      />
                    </div>

                    {/* Degree */}
                    <div>
                      <label className={labelCls}>
                        Degree / Program <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.degree}
                        onChange={e => setFormData({ ...formData, degree: e.target.value })}
                        className={selectCls}
                      >
                        {DEGREE_OPTIONS.map(d => (
                          <option key={d} value={d} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                            {d}
                          </option>
                        ))}
                      </select>
                      {/* Dynamic "Other" field */}
                      {isDegreeOther && (
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={otherDegreeText}
                          onChange={e => setOtherDegreeText(e.target.value)}
                          placeholder="Specify your degree / qualification"
                          className={otherInputCls}
                        />
                      )}
                    </div>

                    {/* Branch */}
                    <div>
                      <label className={labelCls}>
                        Branch / Specialization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.branch}
                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                        className={selectCls}
                      >
                        {BRANCH_OPTIONS.map(b => (
                          <option key={b} value={b} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                            {b}
                          </option>
                        ))}
                      </select>
                      {/* Dynamic "Other" field */}
                      {isBranchOther && (
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={otherBranchText}
                          onChange={e => setOtherBranchText(e.target.value)}
                          placeholder="Specify your branch / specialization"
                          className={otherInputCls}
                        />
                      )}
                    </div>

                    {/* Current Semester */}
                    <div>
                      <label className={labelCls}>
                        Current Semester / Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.semester}
                        onChange={e => setFormData({ ...formData, semester: e.target.value })}
                        className={selectCls}
                      >
                        {SEMESTER_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <p className={hintCls}>Select "Recent Graduate" if you have already completed your degree.</p>
                    </div>

                    {/* Graduation Year */}
                    <div>
                      <label className={labelCls}>
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.graduationYear}
                        onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                        className={selectCls}
                      >
                        {GRADUATION_YEARS.map(year => (
                          <option key={year} value={year} className="bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100">
                            {year}{parseInt(year, 10) < currentYear ? ' (Passout)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* CGPA (Optional) */}
                    <div>
                      <label className={labelCls}>CGPA / Percentage</label>
                      <input
                        type="text"
                        value={formData.cgpa}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^(\d{0,2}(\.\d{0,2})?)?$/.test(val) || /^(\d{0,3})?%?$/.test(val)) {
                            setFormData({ ...formData, cgpa: val });
                          }
                        }}
                        placeholder="e.g. 8.5 or 85%"
                        maxLength={8}
                        className={inputCls}
                      />
                      <p className={hintCls}>Optional. Enter CGPA (e.g. 8.5) or percentage (e.g. 85%).</p>
                    </div>
                  </>
                )}

                {/* ================= STEP 3: TRACK & SKILLS ================= */}
                {currentStep === 3 && (
                  <>
                    {/* Track Selection */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        Target Track <span className="text-red-500">*</span>
                        <span className="text-slate-400 font-normal text-[12.5px] ml-1">(select all that apply)</span>
                      </label>
                      <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-2">
                        {TRACK_OPTIONS.map((track) => {
                          const isSelected = formData.areasOfInterest.includes(track);
                          return (
                            <button
                              key={track}
                              type="button"
                              onClick={() => toggleInterest(track)}
                              aria-pressed={isSelected}
                              className={`min-h-[44px] px-3.5 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center gap-2.5 cursor-pointer text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </span>
                              <span className="truncate">{track}</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Dynamic "Other" track field */}
                      {hasOtherTrack && (
                        <input
                          type="text"
                          required
                          maxLength={80}
                          value={otherTrackText}
                          onChange={e => setOtherTrackText(e.target.value)}
                          placeholder="Specify your area of interest"
                          className={otherInputCls}
                        />
                      )}
                    </div>

                    {/* Technical Skills */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        Technical Skills <span className="text-red-500">*</span>
                      </label>

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
                        maxLength={500}
                        value={formData.skills}
                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="Type skills separated by commas (e.g. React, TypeScript, Python)"
                        className={inputCls}
                      />

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

                    {/* Workplace Preference */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
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
                              aria-pressed={isSelected}
                              className={`min-h-[44px] px-3.5 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        Earliest Availability <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 min-[600px]:grid-cols-5 gap-2">
                        {AVAILABILITY_OPTIONS.map(opt => {
                          const isSelected = formData.availability === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, availability: opt.value })}
                              aria-pressed={isSelected}
                              className={`min-h-[44px] px-3 rounded-[10px] border-[1.5px] text-[14px] transition-colors duration-150 flex items-center gap-2 cursor-pointer text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary dark:text-primary-light font-semibold'
                                  : 'border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-slate-700 dark:text-slate-300 font-normal hover:border-slate-300'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className="truncate">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Dynamic "Other" availability field */}
                      {isAvailabilityOther && (
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={otherAvailabilityText}
                          onChange={e => setOtherAvailabilityText(e.target.value)}
                          placeholder="Specify your earliest availability (e.g. After 15th December)"
                          className={otherInputCls}
                        />
                      )}
                    </div>

                    {/* Past Experience */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>Past Experience or Projects</label>
                      <textarea
                        rows={3}
                        maxLength={600}
                        value={formData.previousExperience}
                        onChange={e => setFormData({ ...formData, previousExperience: e.target.value })}
                        placeholder="e.g. Built a full-stack dashboard with React and Node.js; completed a hackathon project on real-time data visualization."
                        className="w-full min-h-[80px] p-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none resize-none"
                      />
                      <div className="flex justify-between text-[12.5px] mt-1">
                        <span className={hintCls}>Optional — brief summary of prior projects or internships.</span>
                        <span className={`font-medium ${formData.previousExperience.length > 550 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}>
                          {formData.previousExperience.length}/600
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* ================= STEP 4: RESUME & SOP ================= */}
                {currentStep === 4 && (
                  <>
                    {/* Resume / CV */}
                    <div className="min-[600px]:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                          Resume / CV <span className="text-red-500">*</span>
                        </label>
                        <label
                          htmlFor={fileInputId}
                          className="text-[12.5px] font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload PDF (max 2 MB)</span>
                        </label>
                        <input
                          id={fileInputId}
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfUpload}
                          className="hidden"
                        />
                      </div>

                      {uploadedFileName ? (
                        <div className="flex items-center justify-between p-3 rounded-[10px] border-[1.5px] border-accent/40 bg-accent/5 text-[14px] text-slate-800 dark:text-slate-200">
                          <span className="flex items-center gap-2 font-medium">
                            <FileCheck className="w-4 h-4 text-accent" />
                            {uploadedFileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFileName(null);
                              setFormData(prev => ({ ...prev, resumeUrl: '' }));
                              setConfirmedLinkPublic(false);
                            }}
                            className="text-[12.5px] font-semibold text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <input
                          type="url"
                          inputMode="url"
                          required
                          maxLength={500}
                          value={formData.resumeUrl}
                          onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                          placeholder="https://drive.google.com/file/d/your-resume-link"
                          className={inputCls}
                        />
                      )}

                      {!uploadedFileName && (
                        <label className="flex items-start gap-2.5 mt-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={confirmedLinkPublic}
                            onChange={e => setConfirmedLinkPublic(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded-[4px] border-[1.5px] border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/25 cursor-pointer shrink-0"
                          />
                          <span className="text-[12.5px] text-slate-600 dark:text-slate-400">
                            I confirm that my Google Drive / cloud link is set to <strong>"Anyone with the link can view"</strong>.
                          </span>
                        </label>
                      )}
                    </div>

                    {/* GitHub */}
                    <div>
                      <label className={labelCls}>GitHub Profile</label>
                      <input
                        type="url"
                        inputMode="url"
                        maxLength={200}
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className={inputCls}
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className={labelCls}>LinkedIn Profile</label>
                      <input
                        type="url"
                        inputMode="url"
                        maxLength={200}
                        value={formData.linkedInUrl}
                        onChange={e => setFormData({ ...formData, linkedInUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className={inputCls}
                      />
                    </div>

                    {/* Portfolio */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>Portfolio or Live Demo</label>
                      <input
                        type="url"
                        inputMode="url"
                        maxLength={200}
                        value={formData.portfolioUrl}
                        onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.dev"
                        className={inputCls}
                      />
                    </div>

                    {/* Reason for Applying (SOP — min 150 chars) */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>
                        Why do you want to join InterHive? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        maxLength={2000}
                        value={formData.reasonForApplying}
                        onChange={e => setFormData({ ...formData, reasonForApplying: e.target.value })}
                        placeholder="Share your technical goals, what projects you hope to contribute to, and why you are interested in hands-on production experience (minimum 150 characters)..."
                        className="w-full min-h-[96px] p-[12px] rounded-[10px] border-[1.5px] border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-primary focus:ring-[3px] focus:ring-primary/25 focus:outline-none resize-none"
                      />
                      <div className="flex items-center justify-between text-[12.5px] mt-1">
                        <span className="text-slate-500 dark:text-slate-400">Explain your learning goals in detail.</span>
                        <span className={`font-semibold ${formData.reasonForApplying.trim().length >= 150 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {formData.reasonForApplying.trim().length} / 150 min
                        </span>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="min-[600px]:col-span-2">
                      <label className={labelCls}>Additional Notes (Optional)</label>
                      <input
                        type="text"
                        maxLength={300}
                        value={formData.additionalInfo}
                        onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
                        placeholder="Certifications, specific tech stack interests, or queries"
                        className={inputCls}
                      />
                    </div>

                    {/* Consent 1: Terms */}
                    <div className="min-[600px]:col-span-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToTerms}
                          onChange={e => setAgreedToTerms(e.target.checked)}
                          className="w-5 h-5 mt-0.5 rounded-[4px] border-[1.5px] border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/25 cursor-pointer shrink-0"
                        />
                        <span className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">
                          I have read and agree to the InterHive{' '}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                            Terms of Service
                          </a>{' '}
                          and internship program rules.
                        </span>
                      </label>
                    </div>

                    {/* Consent 2: DPDP */}
                    <div className="min-[600px]:col-span-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToDataProcessing}
                          onChange={e => setAgreedToDataProcessing(e.target.checked)}
                          className="w-5 h-5 mt-0.5 rounded-[4px] border-[1.5px] border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/25 cursor-pointer shrink-0"
                        />
                        <span className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">
                          I consent to InterHive processing my academic and contact details for internship evaluation under the Digital Personal Data Protection (DPDP) Act, 2023. Grievance Contact: Ankit Yadav (
                          <a href="mailto:interhive.info@gmail.com" className="text-primary hover:underline font-medium">
                            interhive.info@gmail.com
                          </a>
                          ). View{' '}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                            Privacy Policy
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

            <div>
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={() => { if (validateStep1()) setCurrentStep(2); }}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                >
                  Next: Academic
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => { if (validateStep2()) setCurrentStep(3); }}
                  className="min-h-[46px] px-6 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] transition-colors duration-150 cursor-pointer shadow-custom focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                >
                  Next: Skills & Track
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={() => { if (validateStep3()) setCurrentStep(4); }}
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
