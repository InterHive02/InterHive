import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  CheckCircle2,
  Target,
  ShieldCheck,
  BarChart3,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Briefcase,
  TrendingUp,
  Check,
  ChevronDown,
  Calendar,
  Zap,
  Search,
  FileText,
  Send,
  AlertCircle,
  HelpCircle,
  Code2,
  GraduationCap,
  Award,
  ThumbsUp,
  Sliders,
  Compass,
  PhoneCall,
  Mail,
  UserCheck,
  Filter
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';
import { companyApi } from '../../../api/endpoints/company.api';

export const ForCompaniesPage: React.FC = () => {
  // Modals
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // SEO setup
  useEffect(() => {
    document.title = 'For Companies | Discover Industry-Ready Interns with InterHive';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'InterHive helps companies connect with prepared student talent, reduce repetitive screening effort, track internship progress, and identify promising candidates for future hiring.'
    );
  }, []);

  // Dashboard preview tab state
  const [previewTab, setPreviewTab] = useState<'pipeline' | 'tasks' | 'attendance' | 'evaluations'>('pipeline');

  // Active step for process flow
  const [activeStep, setActiveStep] = useState(0);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Company inquiry form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    designation: '',
    industry: 'Software & IT',
    website: '',
    requiredSkills: '',
    internCount: '1-5 Interns',
    preferredProgram: 'Open to All Programs',
    requirements: '',
    additionalMessage: '',
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person name is required';
    if (!formData.email.trim()) {
      errors.email = 'Official email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid work email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Contact number is required';
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    if (!formData.requirements.trim()) {
      errors.requirements = 'Please describe your hiring or internship requirements';
    } else if (formData.requirements.trim().length < 15) {
      errors.requirements = 'Please provide at least 15 characters describing your requirements';
    }
    if (!formData.consent) {
      errors.consent = 'You must agree to the privacy policy to submit';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const skillsArray = formData.requiredSkills
        ? formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      await companyApi.submitInquiry({
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        designation: formData.designation.trim() || undefined,
        techStack: formData.requiredSkills.trim() || undefined,
        requiredSkills: skillsArray,
        internCount: formData.internCount,
        preferredProgram: formData.preferredProgram,
        message: formData.requirements.trim(),
        website: formData.website.trim() || undefined,
        industry: formData.industry,
        additionalInfo: formData.additionalMessage.trim() || undefined,
      });

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Company inquiry submission error:', err);
      setSubmitError(
        err?.response?.data?.message ||
        'Unable to submit your hiring inquiry right now. Please try again or reach out to interhive.info@gmail.com directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Section 2: 8 Challenges vs Solutions
  const challenges = [
    {
      challenge: 'Unfiltered Resume Deluge',
      desc: 'HR teams sift through hundreds of unverified candidate profiles lacking practical software development context.',
      solution: 'Curated Benchmark Pipeline',
      solDesc: 'Every candidate undergoes standardized technical screening and objective problem-solving assessments before matching.',
      icon: Filter
    },
    {
      challenge: 'Exaggerated Portfolios',
      desc: 'Inflated resumes with buzzwords but zero verified code repos, actual deployment, or architectural understanding.',
      solution: 'Verified Git Repositories',
      solDesc: 'Inspect production-grade code, Pull Requests, code review comments, and real feature implementation history.',
      icon: Code2
    },
    {
      challenge: 'Engineering Team Burnout',
      desc: 'Senior developers spend 15+ hours weekly conducting basic screening interviews instead of shipping core features.',
      solution: '70% Screening Reduction',
      solDesc: 'Detailed candidate reports with benchmark scores, code quality grades, and problem-solving metrics provided upfront.',
      icon: Clock
    },
    {
      challenge: 'High Day-1 Handholding',
      desc: 'Interns lack basic workspace familiarity, Git workflows, clean code etiquette, and sprint communication.',
      solution: 'Industry-Ready Day One',
      solDesc: 'Students undergo structured preparation in agile sprints, ticketing systems, Git rebase/merge, and code reviews.',
      icon: Zap
    },
    {
      challenge: 'Zero Attendance & Activity Visibility',
      desc: 'Managers have no reliable way to track remote or hybrid interns without intrusive manual micromanagement.',
      solution: 'Live Activity Dashboard',
      solDesc: 'Automated daily punch-in logs, standup check-ins, PR milestones, and activity dashboards visible to mentors.',
      icon: Calendar
    },
    {
      challenge: 'Mid-Internship Dropouts & Ghosting',
      desc: 'Students abandon assignments mid-way or disconnect when facing technical roadblocks with no accountability.',
      solution: 'Active InterHive Mentorship',
      solDesc: 'Dedicated platform mentors run weekly check-ins, remove blockers, and uphold professional student commitments.',
      icon: ShieldCheck
    },
    {
      challenge: 'Subjective Performance Reviews',
      desc: 'End-of-term evaluations turn into vague impressions rather than measurable technical contributions.',
      solution: 'Calibrated Performance Rubrics',
      solDesc: 'Quantifiable scorecards assessing code cleanliness, task velocity, problem solving, teamwork, and documentation.',
      icon: BarChart3
    },
    {
      challenge: 'High-Risk PPO Guesswork',
      desc: 'Making full-time hiring decisions after short, superficial internships often leads to costly bad hires.',
      solution: 'Longitudinal Talent Data',
      solDesc: 'Review 6 to 12 months of actual performance, consistency, and culture alignment before extending a PPO.',
      icon: Target
    }
  ];

  // Section 3: 7 Advantages
  const advantages = [
    {
      title: 'Relevant Talent Discovery',
      badge: 'Precise Matching',
      desc: 'Share your exact tech stack requirements—whether React, NestJS, Python AI, Flutter, or Cloud DevOps. InterHive surfaces verified candidates ready to contribute.',
      icon: Search,
      color: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'More Efficient Screening',
      badge: 'Zero Fluff',
      desc: 'Skip generic preliminary trivia calls. Evaluate candidates directly by reviewing their real-world project commits, task velocity ratings, and code reviews.',
      icon: Filter,
      color: 'from-indigo-600 to-purple-600',
      lightBg: 'bg-indigo-50 text-indigo-700'
    },
    {
      title: 'Industry-Prepared Candidates',
      badge: 'Production Ready',
      desc: 'Candidates are trained under industry-simulated environments: writing unit tests, managing branches, documenting APIs, and communicating in standups.',
      icon: Layers,
      color: 'from-purple-600 to-pink-600',
      lightBg: 'bg-purple-50 text-purple-700'
    },
    {
      title: 'Attendance & Activity Visibility',
      badge: 'Real-Time Insights',
      desc: 'Centralized attendance logs, daily task check-ins, and leave workflows provide complete transparency into intern engagement without micromanagement.',
      icon: Calendar,
      color: 'from-amber-600 to-orange-600',
      lightBg: 'bg-amber-50 text-amber-700'
    },
    {
      title: 'Task & Performance Tracking',
      badge: 'Milestone Tracking',
      desc: 'Assign weekly deliverables, track sprint progress, review submitted PRs, and give structured milestone feedback in a dedicated company portal.',
      icon: BarChart3,
      color: 'from-emerald-600 to-teal-600',
      lightBg: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Structured Internship Management',
      badge: 'Turnkey Governance',
      desc: 'Standardized onboarding agreements, milestone sign-offs, mid-term evaluations, and completion certificates managed seamlessly in one unified platform.',
      icon: Building2,
      color: 'from-cyan-600 to-blue-600',
      lightBg: 'bg-cyan-50 text-cyan-700'
    },
    {
      title: 'Future Talent Pipeline (PPO Track)',
      badge: 'Low-Risk Hiring',
      desc: 'Evaluate high-potential students over 1 to 4 years of progressive projects. Convert your best performers into full-time hires with 100% confidence.',
      icon: Target,
      color: 'from-blue-700 to-indigo-800',
      lightBg: 'bg-blue-50 text-blue-800'
    }
  ];

  // Section 4: Workflow Comparison
  const comparisonItems = [
    {
      metric: 'Candidate Sourcing',
      traditional: 'Broad job postings; hundreds of irrelevant, unverified resumes to filter manually',
      interhive: 'Targeted discovery from a pre-screened talent bench benchmarked by technical competency',
    },
    {
      metric: 'Preliminary Screening',
      traditional: '2–3 weeks of initial phone screenings and basic technical assessments conducted by senior staff',
      interhive: 'Immediate access to verified project repos, code test scores, and comprehensive skill rubrics',
    },
    {
      metric: 'Workplace Readiness',
      traditional: 'Interns require 4–8 weeks of basic training on Git, issue tracking, and clean code principles',
      interhive: 'Candidates are pre-trained in agile workflows, PR reviews, documentation, and standups',
    },
    {
      metric: 'Daily Progress Visibility',
      traditional: 'Ad-hoc Slack messages, missed updates, and unrecorded attendance causing oversight friction',
      interhive: 'Built-in punch-in logs, automated daily standups, and real-time task progress dashboards',
    },
    {
      metric: 'Mentor Time Investment',
      traditional: 'Heavy time burden on senior developers dealing with basic conceptual blockers',
      interhive: 'InterHive platform mentors provide preliminary guidance; company mentors focus strictly on business logic',
    },
    {
      metric: 'Full-Time Conversion (PPO)',
      traditional: 'High-risk decisions based on short, subjective trial periods without concrete historical data',
      interhive: 'Confidently extend PPOs backed by months of documented sprint velocity and verified code quality',
    },
  ];

  // Section 5: 8-Step Process
  const steps = [
    {
      num: '01',
      title: 'Define Requirements',
      short: 'Specify your tech stack, duration, team size, and project scope.',
      detail: 'Share your exact hiring profile, tech stack preferences (e.g. MERN, Python, Go, DevOps), project timeline, and mentor availability. Our talent consultants tailor the matching criteria.',
      icon: Sliders
    },
    {
      num: '02',
      title: 'Discover Talent',
      short: 'Receive curated shortlists of pre-screened, benchmarked candidates.',
      detail: 'We surface candidates whose assessed skills and project portfolio directly align with your requirements. Zero cold sourcing or manual resume filtering required.',
      icon: Search
    },
    {
      num: '03',
      title: 'Review Candidates',
      short: 'Inspect verified code repos, assessment rubrics, and project demos.',
      detail: 'Examine candidates’ verified GitHub repositories, code architecture evaluations, sprint consistency scores, and real-time problem-solving assessment performance.',
      icon: FileText
    },
    {
      num: '04',
      title: 'Select Interns',
      short: 'Conduct focused interviews and finalize selected candidates seamlessly.',
      detail: 'Interview only the top-tier candidates who meet your team’s cultural and domain standards. Confirm your intern cohort with structured engagement terms.',
      icon: UserCheck
    },
    {
      num: '05',
      title: 'Monitor Progress',
      short: 'Track daily attendance, sprint commits, and project milestones.',
      detail: 'Utilize the InterHive Company Portal to review attendance compliance, task completions, and daily standup check-ins without burdensome micromanagement.',
      icon: Clock
    },
    {
      num: '06',
      title: 'Evaluate Performance',
      short: 'Provide structured feedback using standardized rubric scorecards.',
      detail: 'Conduct mid-term and milestone assessments across code quality, problem solving, independence, and teamwork using calibrated rubrics.',
      icon: BarChart3
    },
    {
      num: '07',
      title: 'Interview for Roles',
      short: 'Assess high performers for deeper project responsibilities or advanced tracks.',
      detail: 'Identify standout interns early and involve them in higher-impact engineering challenges or cross-functional team initiatives.',
      icon: Award
    },
    {
      num: '08',
      title: 'Consider for Hiring (PPO)',
      short: 'Extend Pre-Placement Offers to verified top performers with full confidence.',
      detail: 'Transition high-performing interns into permanent full-time team members. Eliminate recruitment overhead and onboard developers who already know your culture.',
      icon: Target
    }
  ];

  // Section 7: FAQs
  const faqs = [
    {
      q: 'How does InterHive screen and benchmark candidates before recommending them?',
      a: 'Every candidate undergoes a multi-layer evaluation: automated coding and problem-solving assessments, code quality and repository reviews, and practical project evaluations. We evaluate not just academic knowledge, but real-world engineering fundamentals including Git workflows, clean code, error handling, and API integration.'
    },
    {
      q: 'Is there any upfront financial commitment to explore or post hiring requirements?',
      a: 'No. Companies can submit their hiring and internship requirements to consult with our talent team at zero upfront cost. We discuss your needs, share benchmarked candidate profiles, and explain our flexible engagement models before you make any commitment.'
    },
    {
      q: 'Can we specify custom technology stacks, niche frameworks, or specific tools?',
      a: 'Yes, absolutely. Whether your engineering team works with modern full-stack frameworks (React, Next.js, Node.js, NestJS), cloud-native DevOps (Docker, Kubernetes, AWS), AI/ML (Python, PyTorch, LangChain), or mobile (Flutter, React Native), we match candidates specifically aligned with your stack.'
    },
    {
      q: 'How do our company mentors track day-to-day intern progress and attendance?',
      a: 'Company managers and mentors receive dedicated access to the InterHive Company Dashboard. You can monitor daily attendance punch-ins, sprint task status, submitted PR links, milestone achievements, and reviewer feedback in a single centralized interface.'
    },
    {
      q: 'What happens if an assigned intern is not meeting performance expectations?',
      a: 'InterHive maintains active mentorship support. If an intern encounters difficulties, our mentors provide targeted guidance to bridge the gap. If performance remains misaligned, our team facilitates structured realignment or replacement according to your agreement terms.'
    },
    {
      q: 'How does the Pre-Placement Offer (PPO) conversion process work?',
      a: 'As interns progress through structured milestones, managers accumulate an objective historical track record of their work quality, velocity, and communication. If you decide to extend a full-time offer (PPO), InterHive assists in coordinating the offer transition smoothly.'
    },
    {
      q: 'What internship programs and durations do you support?',
      a: 'InterHive supports five structured programs: 1-Year, 2-Year, 3-Year, 4-Year progressive programs, and dedicated PPO tracks. We also accommodate project-based or semester-long corporate internship cycles tailored to company hiring calendars.'
    },
    {
      q: 'How quickly can we onboard interns through InterHive?',
      a: 'Because our candidates are pre-screened and maintain active portfolios in our talent bench, companies can review shortlisted profiles and complete interviews within 3 to 7 business days, drastically faster than traditional 4 to 6-week campus drive cycles.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <PublicNavbar
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      <main>
        {/* ============================================================ */}
        {/* SECTION 1: PREMIUM HERO SECTION                               */}
        {/* ============================================================ */}
        <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFC] to-[#F8FAFC]">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-teal-400/5 blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                {/* Enterprise Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Enterprise Talent Partner &bull; Zero Preliminary Screening Overhead</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Meet Better-Prepared Talent.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                    Simplify Your Hiring.
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  InterHive helps companies connect with prepared student talent, reduce repetitive screening effort, track internship progress, and identify promising candidates for future hiring.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => scrollToSection('company-inquiry')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>Find Talent with InterHive</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200/90 shadow-sm transition-all duration-200 hover:text-blue-600 hover:border-blue-200"
                  >
                    <span>Explore How It Works</span>
                  </button>
                </div>

                {/* Key Metrics Strip */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">70%</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Screening Time Saved</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">97.8%</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Attendance Compliance</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">3-7 Days</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Average Match Speed</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive SaaS Pipeline Card */}
              <div className="lg:col-span-5 relative">
                {/* Glow behind card */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xl p-6 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">Live Talent Pipeline</h2>
                        <p className="text-xs text-slate-500">Curated & Benchmarked Profiles</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active Matching
                    </span>
                  </div>

                  {/* Pipeline Stage Indicators */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="font-bold text-slate-800">1,240+</p>
                      <p className="text-[10px] text-slate-500">Screened</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <p className="font-bold text-blue-700">94.6%</p>
                      <p className="text-[10px] text-blue-600">Task Velocity</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="font-bold text-emerald-700">97.8%</p>
                      <p className="text-[10px] text-emerald-600">Attendance</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <p className="font-bold text-purple-700">84%</p>
                      <p className="text-[10px] text-purple-600">PPO Rate</p>
                    </div>
                  </div>

                  {/* Sample Candidate Verified Card */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">Aarav Sharma</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                            Full-Stack (React / Node)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">3rd Year B.Tech &bull; 2-Year Program</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                          92/100
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Benchmark</p>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Docker', 'Git Flow'].map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-[11px] font-medium border border-slate-200 shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Verified Metrics Footer */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified GitHub Repos (14 PRs)
                      </span>
                      <span className="font-medium text-slate-700">Ready to Match</span>
                    </div>
                  </div>

                  {/* Secondary mini candidate card */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        PS
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Pooja Sundaram</p>
                        <p className="text-[11px] text-slate-500">Python / Data Eng &bull; 95/100 Benchmark</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      PPO Track
                    </span>
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>All candidates backed by objective rubric evaluations & verified code</span>
                  </div>
                </div>

                {/* Floating Metric Badge 1 */}
                <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white rounded-xl p-3 border border-slate-200 shadow-xl items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zero Screening Fatigue</p>
                    <p className="text-[11px] text-slate-500">Skip preliminary trivia calls</p>
                  </div>
                </div>

                {/* Floating Metric Badge 2 */}
                <div className="hidden sm:flex absolute -top-5 -right-6 bg-white rounded-xl p-3 border border-slate-200 shadow-xl items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">PPO Ready</p>
                    <p className="text-[11px] text-slate-500">Verified sprint velocity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: THE HIRING CHALLENGES COMPANIES FACE               */}
        {/* ============================================================ */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              The Hiring Reality
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hiring Interns Shouldn't Consume Your Entire Team's Time.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Traditional campus placement drives and open job boards flood hiring managers with unverified resumes, zero performance history, and heavy onboarding burdens. Here is how InterHive solves each friction point.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Problem Row */}
                    <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100/80">
                      <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wide mb-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>The Traditional Pain Point</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{item.challenge}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Solution Row */}
                    <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                      <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide mb-1">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>How InterHive Solves It</span>
                      </div>
                      <h4 className="text-sm font-bold text-blue-900">{item.solution}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.solDesc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: THE INTERHIVE ADVANTAGE                           */}
        {/* ============================================================ */}
        <section className="py-20 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Strategic Advantages
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                A More Structured Approach to Internship Hiring.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                InterHive bridges the divide between theoretical student qualifications and production engineering needs, delivering a complete management infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advantages.map((adv, idx) => {
                const Icon = adv.icon;
                return (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${adv.color} flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition duration-200`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${adv.lightBg}`}>
                          {adv.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {adv.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {adv.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-200/50 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                      <span>Explore this capability</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: BUSINESS BENEFITS & WORKFLOW COMPARISON            */}
        {/* ============================================================ */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Workflow Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Turn Internship Programs into a Smarter Talent Strategy.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Compare the friction of ad-hoc intern recruitment with InterHive’s unified talent infrastructure.
            </p>
          </div>

          {/* 4 Quantitative Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">70%</p>
              <h3 className="text-sm font-bold text-slate-900">Reduced Screening</h3>
              <p className="text-xs text-slate-500">Save senior engineering hours by reviewing pre-evaluated code.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">97.8%</p>
              <h3 className="text-sm font-bold text-slate-900">Attendance Compliance</h3>
              <p className="text-xs text-slate-500">Automated daily punch-in tracking & activity reporting.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">3.2x</p>
              <h3 className="text-sm font-bold text-slate-900">Faster Onboarding</h3>
              <p className="text-xs text-slate-500">Students pre-trained in Git, PR workflows & clean code etiquette.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-600">84%</p>
              <h3 className="text-sm font-bold text-slate-900">PPO Retention</h3>
              <p className="text-xs text-slate-500">Convert interns who already understand your codebase and culture.</p>
            </div>
          </div>

          {/* Workflow Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Detailed Workflow Comparison
              </h3>
              <span className="text-xs text-slate-500">Traditional vs. InterHive</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/50">
                    <th className="py-3.5 px-6 font-bold text-slate-900 w-1/4">Recruitment Stage</th>
                    <th className="py-3.5 px-6 font-bold text-rose-700 w-3/8 bg-rose-50/30">
                      Traditional Internship Workflow
                    </th>
                    <th className="py-3.5 px-6 font-bold text-blue-700 w-3/8 bg-blue-50/30">
                      With InterHive Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {comparisonItems.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 text-xs sm:text-sm">
                        {row.metric}
                      </td>
                      <td className="py-4 px-6 text-xs sm:text-sm text-slate-600 bg-rose-50/15">
                        <div className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">&times;</span>
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs sm:text-sm text-slate-700 bg-blue-50/15">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-800">{row.interhive}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: HOW IT WORKS PROCESS FLOW                          */}
        {/* ============================================================ */}
        <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                End-to-End Execution
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From Hiring Requirements to Potential Future Employees.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                An 8-step structured journey designed to eliminate operational friction for both hiring teams and candidates.
              </p>
            </div>

            {/* Stepper Navigation / Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-slate-50/60 hover:bg-white border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                          {step.num}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.short}</p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-200/60 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                      <span>{isSelected ? 'Currently Viewing' : 'Click to inspect'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Active Step Spotlight */}
            <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                    <span>Step {steps[activeStep].num} Deep Dive</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {steps[activeStep].detail}
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                  <button
                    onClick={() => scrollToSection('company-inquiry')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md shadow-blue-600/30"
                  >
                    <span>Discuss Your Requirements</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    Takes under 2 minutes &bull; Dedicated Talent Consultant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: COMPANY DASHBOARD PREVIEW                          */}
        {/* ============================================================ */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              Company Portal Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              More Visibility. Better-Informed Decisions.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Experience the centralized workspace where hiring managers and technical mentors track candidates, reviews, attendance, and sprint velocity.
            </p>
          </div>

          {/* Interactive Preview Container */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl overflow-hidden">
            {/* Top Bar Tabs */}
            <div className="bg-slate-100/80 p-3 sm:p-4 border-b border-slate-200 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'pipeline', label: 'Candidate Pipeline', icon: Users },
                  { id: 'tasks', label: 'Active Interns & Tasks', icon: Layers },
                  { id: 'attendance', label: 'Attendance & Compliance', icon: Calendar },
                  { id: 'evaluations', label: 'Evaluation Rubrics', icon: BarChart3 },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = previewTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>InterHive Enterprise Portal v2.4</span>
              </div>
            </div>

            {/* Tab 1: Candidate Pipeline Preview */}
            {previewTab === 'pipeline' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Pre-Screened Talent Matches</h3>
                    <p className="text-xs text-slate-500">Filtered by your requirements: React, Node.js & PostgreSQL</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    12 Matched Candidates Ready for Review
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Aarav Sharma',
                      role: 'Full Stack Developer',
                      skills: ['React', 'NestJS', 'PostgreSQL', 'Docker'],
                      score: 92,
                      program: '2-Year Program',
                      status: 'Interview Ready',
                    },
                    {
                      name: 'Sneha Patel',
                      role: 'Backend & Cloud Engineer',
                      skills: ['Node.js', 'Python', 'AWS', 'MongoDB'],
                      score: 95,
                      program: 'PPO Track',
                      status: 'Ready for Assignment',
                    },
                    {
                      name: 'Rohan Verma',
                      role: 'Frontend UI/UX Developer',
                      skills: ['React', 'TypeScript', 'Tailwind', 'Figma'],
                      score: 89,
                      program: '3-Year Program',
                      status: 'Interview Ready',
                    },
                    {
                      name: 'Ananya Roy',
                      role: 'AI / Data Science Engineer',
                      skills: ['Python', 'PyTorch', 'FastAPI', 'Pandas'],
                      score: 94,
                      program: '4-Year Program',
                      status: 'Shortlisted',
                    },
                  ].map((cand, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cand.name}</p>
                          <p className="text-xs text-slate-500">{cand.role} &bull; {cand.program}</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {cand.score}/100
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-700 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">{cand.status}</span>
                        <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                          View Code Repos &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Active Interns & Tasks Preview */}
            {previewTab === 'tasks' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Sprint Deliverables & PR Tracking</h3>
                    <p className="text-xs text-slate-500">Live view of current tasks, submitted pull requests, and review statuses</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Sprint #4 Active (88% Velocity)
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      task: 'Implement JWT Token Refresh & Role Middleware',
                      intern: 'Aarav Sharma',
                      pr: 'PR #42 (Clean Build, 14 Unit Tests Passing)',
                      status: 'Under Review',
                      badgeBg: 'bg-amber-100 text-amber-800',
                    },
                    {
                      task: 'Build Responsive Company Analytics Dashboard View',
                      intern: 'Rohan Verma',
                      pr: 'PR #39 (Merged into Main)',
                      status: 'Completed',
                      badgeBg: 'bg-emerald-100 text-emerald-800',
                    },
                    {
                      task: 'Containerize Backend Microservices with Docker Compose',
                      intern: 'Sneha Patel',
                      pr: 'PR #44 (Requested Review from Lead)',
                      status: 'In Review',
                      badgeBg: 'bg-blue-100 text-blue-800',
                    },
                  ].map((t, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-sm">{t.task}</p>
                        <p className="text-xs text-slate-500 font-medium">Assigned to: <span className="text-slate-800 font-semibold">{t.intern}</span> &bull; {t.pr}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 self-start sm:self-center ${t.badgeBg}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Attendance & Compliance Preview */}
            {previewTab === 'attendance' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Attendance & Activity Compliance</h3>
                    <p className="text-xs text-slate-500">Automated punch-in tracking, working hours, and standup completion rates</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Cohort Average: 97.8% On-Time
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <p className="text-2xl font-black text-slate-900">22 / 22</p>
                    <p className="text-xs font-semibold text-slate-600">Working Days Logged</p>
                    <p className="text-[10px] text-slate-400">100% Monthly Compliance</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <p className="text-2xl font-black text-blue-600">09:54 AM</p>
                    <p className="text-xs font-semibold text-slate-600">Average Standup Punch-In</p>
                    <p className="text-[10px] text-slate-400">Punctual Check-In Policy</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <p className="text-2xl font-black text-emerald-600">0 Missed</p>
                    <p className="text-xs font-semibold text-slate-600">Unexcused Absences</p>
                    <p className="text-[10px] text-slate-400">Formal Leave Approval Workflow</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3 text-xs text-blue-800">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>
                    Zero manual punch-in monitoring needed. InterHive automatically flags inactivity and provides weekly attendance summaries to your HR team.
                  </span>
                </div>
              </div>
            )}

            {/* Tab 4: Evaluation Rubrics Preview */}
            {previewTab === 'evaluations' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Standardized Performance Rubric Scorecard</h3>
                    <p className="text-xs text-slate-500">Objective criteria calibrated across engineering velocity, code quality, and teamwork</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    Calibrated Rubric v3.0
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { criteria: 'Code Cleanliness & Documentation', score: 95, notes: 'Follows SOLID principles, types all schemas, writes thorough docstrings' },
                    { criteria: 'Task Velocity & Sprint Completion', score: 92, notes: 'Consistently completes assigned user stories within estimated sprint bounds' },
                    { criteria: 'Problem Solving & Autonomy', score: 90, notes: 'Researches blockers independently before escalating to senior mentors' },
                    { criteria: 'Communication & Standup Participation', score: 96, notes: 'Proactive in daily standups; communicates pull request blockers immediately' },
                  ].map((rub, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>{rub.criteria}</span>
                        <span className="text-blue-600">{rub.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${rub.score}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-500">{rub.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 7: FREQUENTLY ASKED QUESTIONS                         */}
        {/* ============================================================ */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Employer Queries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions by Companies.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Clear answers to help your recruitment and engineering leads make confident decisions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 8: COMPANY CONVERSION INQUIRY SECTION                 */}
        {/* ============================================================ */}
        <section
          id="company-inquiry"
          className="py-20 bg-gradient-to-b from-[#EBF3FF] via-[#F0F5FF] to-[#F8FAFC] border-t border-blue-100"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Partner with InterHive
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Build Your Next Talent Pipeline with InterHive.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Tell us about your internship or hiring requirements. Our team can help you explore how InterHive can support your talent acquisition and internship management process.
              </p>

              {/* Dual Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const reqInput = document.getElementById('company-requirements-textarea');
                    reqInput?.focus();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition"
                >
                  Get Help from InterHive
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const reqInput = document.getElementById('company-requirements-textarea');
                    reqInput?.focus();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-2xs transition"
                >
                  Discuss Your Hiring Requirements
                </button>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10">
              {submitSuccess ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Hiring Inquiry Submitted Successfully!
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-900">{formData.contactPerson}</span>. Our enterprise talent team has received your hiring requirements for <span className="font-semibold text-slate-900">{formData.companyName}</span>.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-xs text-slate-600 space-y-1.5 text-left">
                    <p className="font-bold text-slate-800">What happens next?</p>
                    <p>&bull; An InterHive talent consultant reviews your required tech stack & headcount.</p>
                    <p>&bull; We reach out within 24 business hours to <span className="font-semibold text-slate-800">{formData.email}</span>.</p>
                    <p>&bull; We share shortlisted, benchmarked candidate profiles ready for your review.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        companyName: '',
                        contactPerson: '',
                        email: '',
                        phone: '',
                        designation: '',
                        industry: 'Software & IT',
                        website: '',
                        requiredSkills: '',
                        internCount: '1-5 Interns',
                        preferredProgram: 'Open to All Programs',
                        requirements: '',
                        additionalMessage: '',
                        consent: false,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
                  >
                    <span>Submit Another Requirement</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-6">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Technologies Pvt Ltd"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                          formErrors.companyName
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {formErrors.companyName && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.companyName}</p>
                      )}
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Person Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                          formErrors.contactPerson
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {formErrors.contactPerson && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.contactPerson}</p>
                      )}
                    </div>

                    {/* Official Work Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Official Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="priya@acmetech.com"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                          formErrors.email
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Phone / Mobile <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                          formErrors.phone
                            ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Designation / Role */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Designation / Role
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Head of Talent / Engineering Manager"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Industry Sector
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                      >
                        <option value="Software & IT">Software & IT / SaaS</option>
                        <option value="FinTech">FinTech & Banking</option>
                        <option value="E-Commerce">E-Commerce & Retail</option>
                        <option value="EdTech">EdTech</option>
                        <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                        <option value="AI & Data Science">AI & Data Science</option>
                        <option value="Manufacturing & Hardware">Manufacturing & Hardware</option>
                        <option value="Other">Other Industry</option>
                      </select>
                    </div>

                    {/* Company Website */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company Website (Optional)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://acmetech.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    {/* Required Skills / Tech Stack */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Target Tech Stack / Required Skills
                      </label>
                      <input
                        type="text"
                        name="requiredSkills"
                        value={formData.requiredSkills}
                        onChange={handleInputChange}
                        placeholder="e.g. React, NestJS, Python, AWS, Docker"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    {/* Expected Number of Interns */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Expected Headcount / Interns
                      </label>
                      <select
                        name="internCount"
                        value={formData.internCount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                      >
                        <option value="1-5 Interns">1 - 5 Interns</option>
                        <option value="6-15 Interns">6 - 15 Interns</option>
                        <option value="16-30 Interns">16 - 30 Interns</option>
                        <option value="30+ Interns">30+ Enterprise Cohort</option>
                      </select>
                    </div>

                    {/* Preferred Engagement / Program */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Preferred Program Track
                      </label>
                      <select
                        name="preferredProgram"
                        value={formData.preferredProgram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                      >
                        <option value="Open to All Programs">Open to All Programs</option>
                        <option value="1-Year Program">1-Year Program</option>
                        <option value="2-Year Program">2-Year Program</option>
                        <option value="3-Year Program">3-Year Program</option>
                        <option value="4-Year Program">4-Year Program</option>
                        <option value="PPO Program">PPO Program (Pre-Placement Offer)</option>
                      </select>
                    </div>
                  </div>

                  {/* Requirements Textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Internship & Hiring Requirements <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="company-requirements-textarea"
                      name="requirements"
                      rows={4}
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Describe the roles, project scopes, expected responsibilities, timeline, or remote/hybrid arrangement..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                        formErrors.requirements
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {formErrors.requirements && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.requirements}</p>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Additional Notes or Preferred Start Date (Optional)
                    </label>
                    <input
                      type="text"
                      name="additionalMessage"
                      value={formData.additionalMessage}
                      onChange={handleInputChange}
                      placeholder="e.g. Immediate start required / looking for summer cohort / specific stipend budget"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>

                  {/* Privacy Consent */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I confirm that I represent this organization and agree to InterHive’s{' '}
                        <Link to="/privacy" className="text-blue-600 underline font-medium">
                          Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link to="/terms" className="text-blue-600 underline font-medium">
                          Terms of Service
                        </Link>
                        . I consent to InterHive contacting me regarding talent matching.
                      </span>
                    </label>
                    {formErrors.consent && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Your Requirements...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Company Hiring Inquiry</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-3">
                      Zero preliminary screening overhead &bull; Response guaranteed within 24 business hours
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Modals for header/footer quick actions */}
      <InternshipApplicationModal
        isOpen={isInternshipModalOpen}
        onClose={() => setIsInternshipModalOpen(false)}
      />
      <CompanyInquiryModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
};

export default ForCompaniesPage;
