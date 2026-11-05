import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  ChevronDown,
  Layers,
  Target,
  FileCheck,
  Building2,
  Check,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Terminal,
  Send,
  Zap,
  Code2
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';
import { applicationsApi } from '../../../api/endpoints/applications.api';

export const ForInternsPage: React.FC = () => {
  const navigate = useNavigate();

  // Modals
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // SEO setup
  useEffect(() => {
    document.title = 'For Interns | Become Industry-Ready with InterHive';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Bridge the gap between college theory and industry expectations. Work on real production code, receive 1-on-1 code reviews, and connect directly with hiring companies.'
    );
  }, []);

  // Dashboard Tab Preview State
  const [previewTab, setPreviewTab] = useState<'tasks' | 'attendance' | 'skills' | 'feedback'>('tasks');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Student Inquiry Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    currentYear: '3rd Year',
    skills: '',
    preferredProgram: 'PPO Program',
    careerGoal: '',
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectProgramAndScroll = (programName: string) => {
    setFormData(prev => ({ ...prev, preferredProgram: programName }));
    scrollToSection('student-inquiry');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.college.trim()) errors.college = 'College or University name is required';
    if (!formData.degree.trim()) errors.degree = 'Degree / Branch is required';
    if (!formData.consent) errors.consent = 'You must agree to the privacy policy to submit';

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

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await applicationsApi.submitInquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        degree: formData.degree.trim(),
        currentYear: formData.currentYear,
        skills: formData.skills.trim(),
        preferredProgram: formData.preferredProgram,
        careerGoal: formData.careerGoal.trim(),
        consent: formData.consent,
      });

      if (response.data && response.data.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(response.data?.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setSubmitError(
        err.response?.data?.message || 'Failed to submit inquiry. Please check your network and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5 Major Programs
  const programs = [
    {
      id: '4-Year Program',
      title: '4-Year Program',
      badge: '1st Year Only (Batch 2030)',
      duration: '4 Academic Years',
      description: 'Exclusively for 1st-year students (Batch 2030). A degree-parallel path from programming fundamentals to 4 industrial internships and full-time hiring before graduation.',
      idealFor: '1st Year Students Only (Batch 2030)',
      color: 'from-teal-600 to-emerald-600',
    },
    {
      id: '3-Year Program',
      title: '3-Year Program',
      badge: '2nd Year Only (Batch 2029)',
      duration: '3 Academic Years',
      description: 'Exclusively for 2nd-year students (Batch 2029). Build full-stack microservices, cloud deployments, 4 industrial internships, and 4th-year paid corporate placement.',
      idealFor: '2nd Year Students Only (Batch 2029)',
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: '2-Year Program',
      title: '2-Year Program',
      badge: '3rd Year Only (Batch 2028)',
      duration: '2 Academic Years',
      description: 'Exclusively for 3rd-year students (Batch 2028). Intensive 3rd-year industrial training and internships, converting into a 4th-year high-quality paid corporate internship and PPO.',
      idealFor: '3rd Year Students Only (Batch 2028)',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: '1-Year Program',
      title: '1-Year Program',
      badge: 'Final Year Only (Batch 2027)',
      duration: '1 Academic Year',
      description: 'Exclusively for final-year students (Batch 2027). A focused industry-readiness and placement accelerator for graduating engineers preparing for internships, interviews, and immediate corporate hiring.',
      idealFor: 'Final Year Students Only (Batch 2027)',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'PPO Program',
      title: 'PPO Program',
      badge: 'Final Year PPO (Batch 2027)',
      duration: '8 Months (2 Mo InterHive Training + 6 Mo Company Internship)',
      description: 'Exclusively for final-year students (Batch 2027). 2 months of training & readiness done by the InterHive platform, followed by an assured opportunity to get a 6-month corporate internship at any partner company leading directly to Pre-Placement Offers (PPO).',
      idealFor: 'Final Year Students Only (Batch 2027)',
      color: 'from-blue-700 to-blue-900',
      popular: true,
    },
  ];

  // Top 5 FAQs
  const faqs = [
    {
      q: 'Can I balance InterHive alongside college classes and semester exams?',
      a: 'Yes, 100%. The program is built specifically for college students. Tasks are sprint-based with flexible weekend schedules. During exam weeks, you can pause or adjust your sprint velocity without penalty.'
    },
    {
      q: 'Are students from non-Computer Science branches eligible?',
      a: 'Absolutely. What matters to hiring companies is your ability to write clean, working code and solve problems—not the branch stamped on your degree. Many of our highest-ranked candidates come from Mechanical, Civil, and Electrical streams.'
    },
    {
      q: 'How does InterHive connect me with companies?',
      a: 'Unlike job boards where your PDF resume gets lost among thousands of applicants, InterHive provides partnering hiring leads with verified GitHub code repositories, architecture benchmark scores, and sprint attendance logs. Companies review your actual output and interview you directly.'
    },
    {
      q: 'What happens when I get stuck on a technical blocker?',
      a: 'You are never on your own. You have access to dedicated platform technical mentors, live weekly code review sessions, and an active peer developer community to review pull requests and debug errors.'
    },
    {
      q: 'What kind of proof or certificate do I receive upon completion?',
      a: 'You receive a digitally verifiable InterHive Industry-Readiness Certificate with a unique credential ID and a permanent public portfolio link showcasing all merged PRs, project architectures, and benchmark ratings.'
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
        {/* HERO SECTION: INSPIRING, DIRECT & CRISP                      */}
        {/* ============================================================ */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFC] to-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Cohort Admissions Open &bull; Zero Cost Initial Evaluation</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Don't Just Apply for Internships.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Become Industry-Ready.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Tired of ghosted applications and fake certificate tasks? InterHive trains you through real production sprints, 1-on-1 code reviews, and introduces you to companies ready to hire.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => scrollToSection('student-inquiry')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Apply for Next Cohort</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('programs-grid')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>Explore the 5 Programs</span>
                </button>
              </div>

              {/* Key Highlights Strip */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-2xl mx-auto text-center">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">5 Programs</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">1-Year to PPO Track</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">100%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Practical Git Repos</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">Direct</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Company Intros</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: THE REALITY CHECK (COLLEGE VS INTERHIVE)           */}
        {/* ============================================================ */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              The Reality Gap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why 90% of College Applications Get Ignored
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold">
                Traditional Approach
              </div>
              <h3 className="text-base font-bold text-slate-900">Academic Syntax vs. Production Code</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Colleges teach outdated theory and syntax puzzles. Companies demand Git branching, TypeScript, Docker, clean APIs, and database migrations.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>InterHive: Production SaaS sprints</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold">
                Traditional Approach
              </div>
              <h3 className="text-base font-bold text-slate-900">Paper Certificates vs. Verified Repos</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tech leads laugh at generic PDF certificates from course platforms. They want to see merged Pull Requests, clean commits, and readable architecture.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>InterHive: Verified GitHub portfolio</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold">
                Traditional Approach
              </div>
              <h3 className="text-base font-bold text-slate-900">Getting Stuck Alone vs. Real Mentorship</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Spending days blocked on simple environment bugs causes burnout and self-doubt. You need real engineering feedback to progress quickly.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>InterHive: 1-on-1 code reviews & standups</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: THE 4-STEP PATH TO GETTING HIRED                  */}
        {/* ============================================================ */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Your Roadmap
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                How You Go From Student to Employable Engineer
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Skill Assessment & Track',
                  desc: 'Evaluate your current foundation and get mapped to the optimal track (MERN, Python/AI, Cloud/DevOps).',
                  icon: Terminal,
                },
                {
                  step: '02',
                  title: 'Real Production Sprints',
                  desc: 'Work on actual features, manage GitHub branches, write unit tests, and resolve issues under agile sprints.',
                  icon: Code2,
                },
                {
                  step: '03',
                  title: 'Code Reviews & Scorecard',
                  desc: 'Senior mentors review your pull requests, scoring code readability, architecture, and sprint velocity.',
                  icon: FileCheck,
                },
                {
                  step: '04',
                  title: 'Company Match & PPO',
                  desc: 'Verified companies review your public repository dossier and interview you directly for internships & PPOs.',
                  icon: Building2,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">
                        STEP {item.step}
                      </span>
                      <Icon className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: THE 5 OFFICIAL INTERHIVE PROGRAMS                  */}
        {/* ============================================================ */}
        <section id="programs-grid" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Structured Tracks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Choose the Program Built for Your Academic Year
            </h2>
            <p className="text-sm text-slate-500">Every track is tailored to fit your college curriculum without overwhelming you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 bg-white transition-all duration-200 shadow-xs hover:shadow-md ${
                  prog.popular ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {prog.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{prog.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{prog.description}</p>
                  <p className="text-[11px] font-semibold text-slate-500">Ideal for: {prog.idealFor}</p>
                </div>

                <button
                  onClick={() => selectProgramAndScroll(prog.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Apply for {prog.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: COMPACT DASHBOARD SNEAK PEEK                       */}
        {/* ============================================================ */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                Live Student Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Your Progress, Tasks & Attendance in One Place
              </h2>
            </div>

            {/* Dashboard Mockup Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Aarav Sharma</h4>
                    <p className="text-xs text-slate-500">Full Stack Track &bull; PPO Program Cohort</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    96% Attendance
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    Velocity: 92/100
                  </span>
                </div>
              </div>

              {/* Active Sprint Items */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Sprint Tasks & Pull Requests</p>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Implement JWT Auth Middleware & Role Guard</p>
                    <p className="text-slate-500">Branch: <code className="bg-slate-100 px-1 py-0.5 rounded">feature/auth-guards</code> &bull; 14 tests passing</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-semibold self-start sm:self-center">
                    PR In Review
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Database Indexing & PostgreSQL Connection Pooling</p>
                    <p className="text-slate-500">Mentor Note: Excellent query latency reduction by 64%</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold self-start sm:self-center">
                    Merged to Main
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: FREQUENTLY ASKED QUESTIONS                         */}
        {/* ============================================================ */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">Clear answers for students</p>
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
        {/* SECTION 7: 60-SECOND STUDENT APPLICATION / INQUIRY FORM       */}
        {/* ============================================================ */}
        <section
          id="student-inquiry"
          className="py-16 bg-gradient-to-b from-[#EBF3FF] via-[#F0F5FF] to-[#F8FAFC] border-t border-blue-100"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Apply for Next Cohort
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Start Your Industry-Readiness Journey
              </h2>
              <p className="text-sm text-slate-600">
                Takes under 60 seconds. Our student advisors will review your profile and reach out with your personalized path.
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
                    Application Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-slate-800">{formData.fullName}</span>. We have received your application for the <span className="font-semibold text-slate-800">{formData.preferredProgram}</span>. An InterHive advisor will contact you at <span className="font-semibold text-slate-800">{formData.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        college: '',
                        degree: '',
                        currentYear: '3rd Year',
                        skills: '',
                        preferredProgram: 'PPO Program',
                        careerGoal: '',
                        consent: false,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs transition"
                  >
                    <span>Submit Another Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.fullName
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
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
                        Mobile Number <span className="text-rose-500">*</span>
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
                        College / University <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder="e.g. Delhi Technological University"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.college
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.college && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.college}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Degree & Branch <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        placeholder="e.g. B.Tech Computer Science"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                          formErrors.degree
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.degree && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.degree}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Current Academic Year
                      </label>
                      <select
                        name="currentYear"
                        value={formData.currentYear}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition bg-white"
                      >
                        <option value="1st Year">1st Year (Batch 2030)</option>
                        <option value="2nd Year">2nd Year (Batch 2029)</option>
                        <option value="3rd Year">3rd Year (Batch 2028)</option>
                        <option value="4th Year">Final Year (Batch 2027)</option>
                        <option value="Recent Graduate">Recent Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Select Program Track <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="preferredProgram"
                        value={formData.preferredProgram}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition bg-white font-semibold text-blue-700"
                      >
                        <option value="4-Year Program">4-Year Program (1st Year Students Only — Batch 2030)</option>
                        <option value="3-Year Program">3-Year Program (2nd Year Students Only — Batch 2029)</option>
                        <option value="2-Year Program">2-Year Program (3rd Year Students Only — Batch 2028)</option>
                        <option value="1-Year Program">1-Year Program (Final Year Students Only — Batch 2027)</option>
                        <option value="PPO Program">PPO Program (Final Year Students Only — Batch 2027: 2 Mo InterHive + 6 Mo Company)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Known Skills / Interests
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="e.g. JavaScript, Python, React, None (Beginner)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Career Goal or Notes (Optional)
                    </label>
                    <textarea
                      name="careerGoal"
                      rows={2}
                      value={formData.careerGoal}
                      onChange={handleInputChange}
                      placeholder="e.g. Want to land a remote Full Stack developer internship or prepare for product-based company interviews..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
                    />
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
                        and consent to receiving guidance regarding my application.
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
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application for Evaluation</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Zero spam &bull; Free initial skill assessment &bull; Admissions advisor responds in 24h
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

export default ForInternsPage;
