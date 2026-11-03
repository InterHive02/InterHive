import React, { useState, useEffect, useId } from 'react';
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
  TrendingUp,
  Check,
  ChevronDown,
  Calendar,
  Zap,
  Search,
  FileText,
  Send,
  AlertCircle,
  Code2,
  ThumbsUp,
  Calculator,
  DollarSign,
  ArrowUpRight
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
    document.title = 'For Companies | Hire Day-1 Productive Interns with InterHive';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Cut screening time by 70%. InterHive connects companies with pre-vetted, industry-ready interns trained on production code, Git workflows, and agile sprints.'
    );
  }, []);

  // -------------------------------------------------------------
  // CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------
  const [internCount, setInternCount] = useState<number>(3);
  const [mentorSalary, setMentorSalary] = useState<number>(120000); // Monthly salary in INR
  const [rampUpWeeks, setRampUpWeeks] = useState<number>(4); // Weeks of ramp-up / hand-holding

  // Calculations
  const hourlyRate = Math.round(mentorSalary / 160); // 160 work hours per month
  const screeningHoursPerIntern = 14; // Resume review, initial call, technical screen, coordination
  const mentorTrainingHoursPerWeek = 8; // Hours mentor spends hand-holding, fixing basic Git, debugging
  const totalTrainingHoursPerIntern = rampUpWeeks * mentorTrainingHoursPerWeek;
  const totalDevHoursLostPerIntern = screeningHoursPerIntern + totalTrainingHoursPerIntern;

  // Financial costs in traditional hiring
  const screeningCost = screeningHoursPerIntern * hourlyRate;
  const trainingCost = totalTrainingHoursPerIntern * hourlyRate;
  const rampUpStipendCost = Math.round((rampUpWeeks / 4) * 15000); // Avg stipend paid during unproductive ramp-up
  const traditionalCostPerIntern = screeningCost + trainingCost + rampUpStipendCost;
  const totalTraditionalExpense = traditionalCostPerIntern * internCount;
  const totalDevHoursLostCohort = totalDevHoursLostPerIntern * internCount;

  // InterHive advantage calculations
  // InterHive eliminates 90% of screening hours & 75% of basic ramp-up hand-holding
  const estimatedSavings = Math.round(totalTraditionalExpense * 0.72);
  const engineeringHoursSaved = Math.round(totalDevHoursLostCohort * 0.75);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // -------------------------------------------------------------
  // FAQ ACCORDION STATE
  // -------------------------------------------------------------
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // -------------------------------------------------------------
  // COMPANY INQUIRY FORM STATE
  // -------------------------------------------------------------
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    designation: '',
    industry: 'Software & IT',
    website: '',
    requiredSkills: '',
    internCount: '3 Interns',
    preferredProgram: 'Open to All Programs',
    requirements: '',
    consent: false,
  });

  // Keep form intern count in sync when calculator changes
  const handleApplyCalculatorCount = () => {
    const label = `${internCount} Intern${internCount > 1 ? 's' : ''}`;
    setFormData(prev => ({ ...prev, internCount: label }));
    scrollToSection('company-inquiry');
  };

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person name is required';
    if (!formData.email.trim()) {
      errors.email = 'Official work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid work email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Contact number is required';
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    if (!formData.requirements.trim()) {
      errors.requirements = 'Please briefly describe your hiring or tech stack requirements';
    } else if (formData.requirements.trim().length < 10) {
      errors.requirements = 'Please provide at least 10 characters';
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

  // Top 5 FAQs
  const faqs = [
    {
      q: 'How does InterHive verify that candidates are truly industry-ready?',
      a: 'We evaluate real GitHub repositories, merged pull requests, test coverage, and agile sprint performance—not rote memorization or MCQ quizzes. Candidates must demonstrate practical mastery in Git branching, clean code, error handling, and API integration before they are presented to companies.'
    },
    {
      q: 'Is there any upfront fee to review candidate profiles or interview them?',
      a: 'No. Exploring shortlisted candidates and conducting interviews is 100% free with zero upfront commitment. We only engage when you find a verified match that fits your engineering team.'
    },
    {
      q: 'How fast can we onboard interns?',
      a: 'Because our talent bench is continuously benchmarked and screened, companies typically review curated candidate repos within 48 hours and complete onboarding in 3 to 7 business days—compared to the 4 to 6 weeks required for traditional campus hiring.'
    },
    {
      q: 'How do our mentors monitor intern performance and attendance?',
      a: 'Through the InterHive Company Portal. You get live visibility into automated punch-in logs, sprint task status, submitted PR links, and milestone reviews without tedious manual micromanagement.'
    },
    {
      q: 'Can we convert top-performing interns to full-time employees (PPO)?',
      a: 'Yes! That is one of InterHive’s greatest strengths. You evaluate candidates over months of real sprint work, eliminating the guesswork and risk of standard full-time hiring.'
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
        {/* HERO SECTION: CRISP, EXECUTIVE & DATA-DRIVEN                 */}
        {/* ============================================================ */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFC] to-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Enterprise Talent Connect &bull; Zero Upfront Sourcing Fees</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Skip the 40-Day Hiring Cycle.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Hire Day-1 Productive Interns.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                InterHive pre-screens student developers on production Git repos, agile sprints, and real code benchmarks. Save senior engineering bandwidth and eliminate ramp-up lag.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => scrollToSection('roi-calculator')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Your Hiring Savings</span>
                </button>
                <button
                  onClick={() => scrollToSection('company-inquiry')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition"
                >
                  <span>Post Hiring Requirements</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Metric Highlights Strip */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-2xl mx-auto text-center">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">70%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Senior Dev Time Saved</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">3–7 Days</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Average Match Speed</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">97.8%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Attendance Compliance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: INTERACTIVE HIRING & TRAINING EXPENSE CALCULATOR    */}
        {/* ============================================================ */}
        <section id="roi-calculator" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Interactive ROI Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              See How Much You Spend Training Interns In-House
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Between resume screening, tech interviews, and 4+ weeks of senior developer handholding, unvetted interns cost far more than just their stipend.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-200/80">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Configure Your Hiring Parameters</h3>
              </div>

              {/* Slider 1: Number of Interns */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="interns-slider" className="font-semibold text-slate-700">Number of Interns Needed:</label>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg text-sm">
                    {internCount} {internCount === 1 ? 'Intern' : 'Interns'}
                  </span>
                </div>
                <input
                  id="interns-slider"
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={internCount}
                  onChange={e => setInternCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>1 Intern</span>
                  <span>5 Interns</span>
                  <span>10 Interns</span>
                  <span>15 Interns</span>
                </div>
              </div>

              {/* Slider 2: Senior Engineer / Mentor Salary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="salary-slider" className="font-semibold text-slate-700">Senior Dev / Mentor Monthly Salary:</label>
                  <span className="px-3 py-1 bg-slate-200 text-slate-800 font-bold rounded-lg text-sm">
                    {formatCurrency(mentorSalary)}/mo
                  </span>
                </div>
                <input
                  id="salary-slider"
                  type="range"
                  min="60000"
                  max="250000"
                  step="10000"
                  value={mentorSalary}
                  onChange={e => setMentorSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>₹60,000</span>
                  <span>₹1,20,000 (Avg)</span>
                  <span>₹2,50,000</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Implies ~{formatCurrency(hourlyRate)}/hr senior engineering bandwidth cost.
                </p>
              </div>

              {/* Slider 3: Ramp-up Handholding Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="rampup-slider" className="font-semibold text-slate-700">Weeks of Basic Training & Hand-Holding:</label>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg text-sm">
                    {rampUpWeeks} Weeks
                  </span>
                </div>
                <input
                  id="rampup-slider"
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={rampUpWeeks}
                  onChange={e => setRampUpWeeks(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>2 Weeks</span>
                  <span>4 Weeks (Standard)</span>
                  <span>8 Weeks</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Time spent explaining Git, basic debugging, environment setup, and architecture before the first clean PR.
                </p>
              </div>

              {/* Breakdown Summary Mini Box */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-800">What Traditional In-House Training Actually Costs:</p>
                <div className="flex justify-between">
                  <span>Resume screening & interview dev time ({screeningHoursPerIntern} hrs/intern):</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(screeningCost * internCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentor hand-holding ({totalTrainingHoursPerIntern} hrs/intern over {rampUpWeeks} wks):</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(trainingCost * internCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stipends paid during non-productive ramp-up:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(rampUpStipendCost * internCount)}</span>
                </div>
              </div>
            </div>

            {/* Right Output: The InterHive Impact (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  InterHive Impact Report
                </span>

                <div>
                  <p className="text-xs text-slate-400">Traditional Cost of In-House Sourcing & Training:</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 line-through decoration-rose-500/60 decoration-2">
                    {formatCurrency(totalTraditionalExpense)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Plus <span className="text-amber-400 font-semibold">{totalDevHoursLostCohort} senior engineering hours</span> drained away from shipping features.
                  </p>
                </div>

                {/* Net Savings Hero Box */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Your Estimated Savings</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                    {formatCurrency(estimatedSavings)}
                  </p>
                  <p className="text-xs text-slate-200">
                    &bull; <strong className="text-white">{engineeringHoursSaved} Hours</strong> of senior dev time reclaimed.<br />
                    &bull; Interns arrive with verified code, Git discipline, and day-1 productivity.
                  </p>
                </div>
              </div>

              {/* Action Button: Auto-sets count and scrolls to form */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleApplyCalculatorCount}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 group"
                >
                  <span>Hire {internCount} Pre-Trained {internCount === 1 ? 'Intern' : 'Interns'} Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Pre-fills inquiry form &bull; Zero recruitment obligation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: THE 3 CORE INTERHIVE PILLARS                       */}
        {/* ============================================================ */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Why Companies Choose InterHive
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Built to Save Your Engineering Team's Sanity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Verified Code, Not Inflated Resumes</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Review candidates based on real GitHub PRs, architecture test scores, and code quality benchmarks. No MCQ guesswork or theoretical buzzwords.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sprint & Git Discipline Built-In</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Candidates are pre-trained in Git branching, writing clean PR descriptions, addressing code reviews, and participating in daily standups.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Zero Ghosting & Full Transparency</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Track automated daily punch-in logs, sprint task velocity, and attendance via your company dashboard. InterHive platform mentors handle blockers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: STREAMLINED 3-STEP HIRING PROCESS                  */}
        {/* ============================================================ */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Turnkey Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              From Requirement to Onboarded Intern in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
              <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                STEP 01
              </span>
              <h3 className="text-base font-bold text-slate-900">Share Your Tech Stack</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tell us your required framework (React, Node, Python, Flutter, etc.), duration, and expected cohort size in under 2 minutes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
              <span className="text-xs font-black tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                STEP 02
              </span>
              <h3 className="text-base font-bold text-slate-900">Review Verified Repos in 48h</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive curated candidate dossiers with benchmark scorecards, live GitHub PRs, and problem-solving metrics. No resume spam.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
              <span className="text-xs font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                STEP 03
              </span>
              <h3 className="text-base font-bold text-slate-900">Interview & Onboard</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Conduct focused cultural or technical discussions with your top 2 candidates and start their engagement immediately.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS                         */}
        {/* ============================================================ */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">Quick answers for engineering and talent leads</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: HIGH-CONVERSION COMPANY INQUIRY FORM              */}
        {/* ============================================================ */}
        <section
          id="company-inquiry"
          className="py-16 bg-gradient-to-b from-[#EBF3FF] via-[#F0F5FF] to-[#F8FAFC] border-t border-blue-100"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Get Started
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tell Us What You Need
              </h2>
              <p className="text-sm text-slate-600">
                Share your requirements below and our talent team will respond within 24 business hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Hiring Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-slate-800">{formData.contactPerson}</span>. Our team will review your requirements for <span className="font-semibold text-slate-800">{formData.companyName}</span> and contact you at <span className="font-semibold text-slate-800">{formData.email}</span> shortly.
                  </p>
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
                        internCount: '3 Interns',
                        preferredProgram: 'Open to All Programs',
                        requirements: '',
                        consent: false,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs transition"
                  >
                    <span>Submit Another Requirement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Technologies"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.companyName
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.companyName && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Contact Person <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.contactPerson
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.contactPerson && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.contactPerson}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Official Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="priya@acmetech.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.email
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.phone
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Target Tech Stack / Roles
                      </label>
                      <input
                        type="text"
                        name="requiredSkills"
                        value={formData.requiredSkills}
                        onChange={handleInputChange}
                        placeholder="e.g. React, NestJS, Python, Flutter"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Headcount Needed
                      </label>
                      <select
                        name="internCount"
                        value={formData.internCount}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition bg-white"
                      >
                        <option value="1 Intern">1 Intern</option>
                        <option value="2 Interns">2 Interns</option>
                        <option value="3 Interns">3 Interns</option>
                        <option value="4-5 Interns">4 - 5 Interns</option>
                        <option value="6-10 Interns">6 - 10 Interns</option>
                        <option value="10+ Interns">10+ Interns</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Requirements & Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="requirements"
                      rows={3}
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Tell us about the roles, expected timeline (immediate/summer), remote/hybrid arrangements, etc."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                        formErrors.requirements
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.requirements && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.requirements}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600 leading-snug">
                        I agree to InterHive’s{' '}
                        <Link to="/privacy" className="text-blue-600 underline">Privacy Policy</Link>{' '}
                        and consent to being contacted regarding talent matching.
                      </span>
                    </label>
                    {formErrors.consent && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.consent}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Requirements...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Hiring Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Zero preliminary screening overhead &bull; Response guaranteed within 24 business hours
                  </p>
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
