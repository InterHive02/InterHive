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
  HelpCircle,
  Terminal,
  Send,
  Zap
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';
import { applicationsApi } from '../../../api/endpoints/applications.api';

export const ForInternsPage: React.FC = () => {
  const navigate = useNavigate();

  // Page Modals
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
      'Prepare for internships with structured learning, practical projects, skill development, performance tracking, and relevant company connections through InterHive.'
    );
  }, []);

  // Timeline Step State
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  // Preview Dashboard Tab State
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
    preferredProgram: 'Need Guidance',
    careerGoal: '',
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    if (!formData.degree.trim()) errors.degree = 'Degree / Course is required';
    if (!formData.consent) errors.consent = 'You must agree to the privacy policy to submit';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await applicationsApi.submitInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        degree: formData.degree,
        currentYear: formData.currentYear,
        skills: formData.skills,
        preferredProgram: formData.preferredProgram,
        careerGoal: formData.careerGoal,
        consent: formData.consent,
      });

      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          college: '',
          degree: '',
          currentYear: '3rd Year',
          skills: '',
          preferredProgram: 'Need Guidance',
          careerGoal: '',
          consent: false,
        });
      } else {
        setSubmitError(response.data?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Server connection error. Please verify your internet and try again.';
      setSubmitError(msg);
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

  // Timeline Steps
  const timelineSteps = [
    {
      step: '01',
      title: 'Assess',
      tag: 'Skill Diagnostic',
      desc: 'Take an objective, domain-specific assessment evaluating fundamental coding, problem solving, and system intuition.',
      icon: Target,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      step: '02',
      title: 'Train',
      tag: 'Industry Sprints',
      desc: 'Participate in structured sprints covering production Git workflows, professional code reviews, and workplace expectations.',
      icon: BookOpen,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      step: '03',
      title: 'Build',
      tag: 'Hands-on Projects',
      desc: 'Develop real-world software modules, build pull requests, adhere to strict deadlines, and collaborate as an engineering team.',
      icon: Code,
      color: 'from-purple-600 to-pink-600',
    },
    {
      step: '04',
      title: 'Evaluate',
      tag: 'Rubric Review',
      desc: 'Receive comprehensive, multidimensional performance evaluations from experienced engineering managers and mentors.',
      icon: Award,
      color: 'from-pink-600 to-rose-600',
    },
    {
      step: '05',
      title: 'Connect',
      tag: 'Talent Matching',
      desc: 'Your verified skill profile and attendance record are matched with relevant verified company openings that fit your profile.',
      icon: Users,
      color: 'from-rose-600 to-amber-600',
    },
    {
      step: '06',
      title: 'Interview',
      tag: 'Company Rounds',
      desc: 'Enter targeted technical rounds with hiring partners having already demonstrated verifiable project artifacts.',
      icon: Briefcase,
      color: 'from-amber-600 to-emerald-600',
    },
    {
      step: '07',
      title: 'Potential Hire',
      tag: 'Career Transition',
      desc: 'Perform on live internship projects with clear pathways toward Pre-Placement Offers (PPOs) and full-time employment.',
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  // FAQ Items
  const faqList = [
    {
      q: 'What is InterHive?',
      a: 'InterHive is an Industry-Readiness & Talent Connect Platform. We bridge the critical gap between college education and employer expectations through structured preparation sprints, practical project simulations, verified attendance tracking, and connections with hiring partner companies.',
    },
    {
      q: 'Who can apply?',
      a: 'Any college student or recent graduate looking to enter technology and engineering domains can apply. We welcome students across 1st, 2nd, 3rd, and Final years, as well as recent graduates seeking practical industry experience.',
    },
    {
      q: 'How does InterHive prepare students for internships?',
      a: 'We move students beyond passive video tutorials into realistic engineering workflows. You will work on real code repositories, open GitHub pull requests, receive code review feedback, follow agile sprints, and attend professional workplace readiness sessions.',
    },
    {
      q: 'How is intern attendance and performance monitored?',
      a: 'InterHive provides dedicated dashboards where students clock daily task attendance, log sprint hours, submit assignment deliverables, and receive milestone scores. This verifiable track record gives hiring partners confidence in your workplace discipline.',
    },
    {
      q: 'How does company matching work?',
      a: 'Rather than blasting resumes blindly, InterHive matches your verified skill assessment scores, completed project demonstrations, and attendance reliability with specific technical requirements posted by our verified partner employers.',
    },
    {
      q: 'Are internships or job offers guaranteed?',
      a: 'No platform can honestly guarantee employment. Final hiring and internship selection decisions always rest entirely with the partner employers based on your technical merit, interview performance, and project contributions. InterHive provides the structured preparation, verified evidence, and company introductions to maximize your opportunities.',
    },
    {
      q: 'How can I get help choosing a program?',
      a: 'You can submit the student inquiry form below! Our student counseling team will review your current academic year, domain interests, and career goals to recommend whether our 1-Year, 2-Year, 3-Year, 4-Year, or direct 6-Month PPO Track is the optimal fit.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Header Navigation */}
      <PublicNavbar
        activePage="for-interns"
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* ============================================================== */}
      {/* SECTION 1: PREMIUM HERO SECTION                                */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden bg-gradient-to-br from-[#EBF3FF] via-[#F4F8FC] to-[#F3E8FF]">
        {/* Ambient Glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_0.8px,transparent_0.8px)] [background-size:26px_26px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs font-extrabold shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Industry-Readiness & Talent Connect Platform for Students</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                Don't Just Apply for Internships. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Become Industry-Ready.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                InterHive helps students bridge the gap between academic learning and industry expectations through structured preparation, practical projects, skill development, performance tracking, and connections with relevant companies.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('student-inquiry')}
                  className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-6 py-3.5 rounded-full bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200/90 font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>How InterHive Works</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-bold border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free Readiness Assessment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real GitHub Pull-Request Workflows</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Partner Company Connect</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (3D-Inspired Student Journey Progression) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Glass Card Preview */}
                <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl p-6 relative z-10 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/30">
                        IH
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-none">Student Career Workspace</h4>
                        <span className="text-[11px] text-slate-500 font-semibold">Active Track: PPO Engineering Sprint</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                      Verified Ready
                    </span>
                  </div>

                  {/* 4 Floating Progression Steps inside Card */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">1. Skill Diagnostic Score</div>
                          <div className="text-[10px] text-slate-500 font-medium">92% Technical Fundamentals</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-blue-600">Passed</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">2. Sprint Attendance Tracking</div>
                          <div className="text-[10px] text-slate-500 font-medium">98.4% On-Time Check-In Record</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-600">Active</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">3. Practical Pull Request</div>
                          <div className="text-[10px] text-slate-500 font-medium">Full Stack REST API + Auth Module</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-purple-600">Approved</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">4. Partner Company Connect</div>
                          <div className="text-[10px] text-slate-500 font-medium">Eligible for Corporate Internship</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600">Matched</span>
                    </div>
                  </div>

                  {/* Card Footer Progress Bar */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5">
                      <span>Overall Industry-Readiness</span>
                      <span className="text-blue-600 font-extrabold">94% Ready</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>

                {/* Subtle Floating Decorative Elements */}
                <div className="absolute -top-4 -right-4 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-lg flex items-center gap-2 z-20">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Verified Evidence</span>
                </div>

                <div className="absolute -bottom-4 -left-4 px-3.5 py-2 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-2 z-20">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold">Fast-Track PPO Hiring</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: THE PROBLEM STUDENTS FACE                           */}
      {/* ============================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-rose-600 tracking-widest uppercase">
            THE REALITY CHECK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Your Degree Is the Beginning. Industry Readiness Takes More.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            College teaches you theory, but engineering teams hire for production execution. Here is why the traditional path creates friction for ambitious students:
          </p>
        </div>

        {/* 6 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">1. Limited Practical Experience</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Syllabi focus heavily on semester examinations and theoretical concepts, leaving students without exposure to production Git branching, CI/CD, and real-world legacy codebases.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-bold text-rose-600">
              Impact: Struggles during initial engineering onboarding
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">2. Difficulty Finding Meaningful Internships</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Most internet job boards are saturated with certificate-selling schemes, unpaid data-entry tasks, or cold application portals where resumes vanish into black holes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-bold text-amber-600">
              Impact: Wasted summer months with zero career progress
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">3. Lack of Industry-Relevant Skills</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Modern tools like Docker, microservices, cloud APIs, and automated testing evolve exponentially faster than university curricula can update their standard textbooks.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-bold text-blue-600">
              Impact: Skills gap between campus projects and job specs
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">4. Limited Workplace & Interview Prep</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Students rarely receive authentic technical interview simulations, system design guidance, or feedback on professional asynchronous communication and workplace etiquette.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-bold text-indigo-600">
              Impact: High rejection rates at the final managerial rounds
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">5. Inability to Demonstrate Actual Performance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                A 2-page resume with generic todo-app projects does not prove reliability, work discipline, clean code architecture, or consistency under real development deadlines.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-bold text-purple-600">
              Impact: Recruiters cannot distinguish real talent from resume fluff
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">6. Uncertainty About Matching Companies</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Students often spend months sending blind applications to hundreds of organizations without understanding which companies genuinely value their specific technical strengths.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-bold text-emerald-600">
              Impact: Burnout and misplaced expectations
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: THE INTERHIVE SOLUTION                              */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
              THE COMPLETE ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              A Structured Journey from Student to Industry-Ready Talent.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              We replaced random guesswork with six interconnected pillars built directly into our platform:
            </p>
          </div>

          {/* 6 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6 font-bold shadow-xs">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">1. Skill Assessment</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Objective, diagnostic technical evaluations help students identify exactly where they excel and which specific competencies require targeted improvement before facing real interviewers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-extrabold text-blue-600">
                <span>Diagnostic analytics & gap reports</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 font-bold shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">2. Industry Preparation</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Structured learning tracks covering asynchronous professional communication, technical standards, code quality benchmarks, agile expectations, and realistic interview drills.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-extrabold text-indigo-600">
                <span>Practical workplace curriculum</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6 font-bold shadow-xs">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">3. Practical Projects</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Gain authentic hands-on experience through real-world-style engineering tasks, GitHub pull requests, merge conflict resolution, sprint deadlines, and collaborative team branches.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-extrabold text-purple-600">
                <span>Production repository artifacts</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-6 font-bold shadow-xs">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">4. Attendance & Progress Monitoring</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Daily attendance check-ins, assigned work status, deliverable completion, and sprint velocity are transparently tracked through our dedicated student and manager dashboards.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-extrabold text-rose-600">
                <span>Verifiable track record of discipline</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 font-bold shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">5. Performance Evaluation</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Detailed, rubric-based evaluations provide clear visibility into your technical output, collaboration, problem solving, and constructive areas for professional growth.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-extrabold text-emerald-600">
                <span>Transparent mentor feedback</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 font-bold shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">6. Company Connection</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Connect prepared candidates with suitable company opportunities based on actual verified skills, domain interests, program eligibility, and specific employer hiring needs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-extrabold text-amber-600">
                <span>Direct partner interview pipelines</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: HOW IT WORKS (RESPONSIVE INTERACTIVE TIMELINE)       */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            STRUCTURED MILESTONES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Your Journey with InterHive.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            From initial registration to potential corporate placement, follow a proven progression sequence:
          </p>
        </div>

        {/* Desktop Interactive Stepper (Horizontal) */}
        <div className="hidden lg:block space-y-8">
          <div className="grid grid-cols-7 gap-2 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs">
            {timelineSteps.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = activeTimelineStep === idx;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveTimelineStep(idx)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                      {step.step}
                    </span>
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h4 className="font-black text-xs leading-tight mb-0.5">{step.title}</h4>
                    <span className={`text-[10px] font-medium block truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {step.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Feature Box */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl flex items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-xs border border-blue-200">
                <span>Stage {timelineSteps[activeTimelineStep].step}</span>
                <span>•</span>
                <span>{timelineSteps[activeTimelineStep].tag}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {timelineSteps[activeTimelineStep].title}: {timelineSteps[activeTimelineStep].tag}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {timelineSteps[activeTimelineStep].desc}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTimelineStep((prev) => Math.max(0, prev - 1))}
                disabled={activeTimelineStep === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveTimelineStep((prev) => Math.min(timelineSteps.length - 1, prev + 1))}
                disabled={activeTimelineStep === timelineSteps.length - 1}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-40 hover:bg-blue-700 cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="lg:hidden space-y-4">
          {timelineSteps.map((step) => {
            const IconComp = step.icon;
            return (
              <div key={step.step} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Step {step.step}
                    </span>
                    <h4 className="font-black text-sm text-slate-900">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-center text-xs text-slate-600 font-medium max-w-3xl mx-auto">
          <strong>Program Transparency Note:</strong> InterHive prepares candidates, tracks verified performance, and facilitates connections. Final hiring selections and PPO awards depend entirely on the partner company's internal criteria and candidate performance.
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: BENEFITS FOR INTERNS                                */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
              STUDENT ADVANTAGES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything You Need to Prepare for the Real World.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              We provide concrete, measurable value designed to make you stand out to hiring managers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Industry-Readiness Preparation</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Transition from academic problem sets to writing production-ready code with clean architecture and error handling.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Practical Project Experience</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Build multi-tier applications with real databases, auth flows, and API integrations that showcase your genuine capabilities.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Skill Development & Upskilling</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Continuous guidance across modern engineering stacks: TypeScript, React, Node.js, cloud deployment, and system design.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Attendance & Task Tracking</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Document your commitment with transparent digital proof of attendance, milestone velocity, and daily sprint engagement.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Structured Feedback & Visibility</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Constructive evaluation rubrics from industry mentors highlighting your growth trajectory and coding strengths.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Resume & Interview Preparation</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Craft an outcome-driven technical portfolio backed by actual project code rather than unverified self-claimed bullet points.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Exposure to Professional Workflows</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Work in professional sprint boards, submit PR reviews, handle mentor comments, and experience authentic agile ceremonies.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Connections with Relevant Companies</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Direct introductions to hiring partners actively seeking prepared interns matching your exact verified skill profile.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">Clearer Pathway to PPO</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Demonstrate continuous value during corporate internships, dramatically increasing your conversion odds into a Pre-Placement Offer.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: PLATFORM EXPERIENCE PREVIEW                          */}
      {/* ============================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            INSIDE INTERHIVE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Your Progress. Your Skills. Your Next Step.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Experience the real intern workspace designed to showcase your development:
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'tasks', label: 'Tasks & Sprints', icon: Code },
            { id: 'attendance', label: 'Attendance Log', icon: Clock },
            { id: 'skills', label: 'Skill Matrix', icon: Target },
            { id: 'feedback', label: 'Performance Feedback', icon: Award },
          ].map((tab) => {
            const IconC = tab.icon;
            const isA = previewTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPreviewTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isA
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <IconC className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Preview Shell */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 md:p-8 overflow-hidden">
          {previewTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">Sprint Backlog & Code Tasks</h4>
                  <p className="text-xs text-slate-500 font-semibold">Track active pull requests, peer reviews, and milestone deliverables</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
                  Sprint 3 of 6
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">IN PROGRESS (1)</span>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-blue-600">
                      <span>TASK-104</span>
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">High</span>
                    </div>
                    <div className="text-xs font-black text-slate-800">Implement JWT Authentication with Refresh Rotation</div>
                    <div className="text-[10px] text-slate-500">PR #18 • 4 comments to resolve</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">UNDER REVIEW (1)</span>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600">
                      <span>TASK-102</span>
                      <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Review</span>
                    </div>
                    <div className="text-xs font-black text-slate-800">Database Index Optimization for Job Search Queries</div>
                    <div className="text-[10px] text-slate-500">Assigned Mentor: Senior Backend Lead</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">COMPLETED (3)</span>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600">
                      <span>TASK-098</span>
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Merged</span>
                    </div>
                    <div className="text-xs font-black text-slate-800">Setup Dockerized Microservices Environment</div>
                    <div className="text-[10px] text-slate-500">Verified by Automated CI Test Runner</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">Attendance & Punctuality Overview</h4>
                  <p className="text-xs text-slate-500 font-semibold">Verifiable digital proof of engagement provided to hiring partners</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Sprint Compliance:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                    98.4% On-Time
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-slate-900">42 / 44</div>
                  <div className="text-xs font-bold text-slate-500 mt-1">Days Attended</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-blue-600">168 hrs</div>
                  <div className="text-xs font-bold text-slate-500 mt-1">Sprint Hours Logged</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-emerald-600">0</div>
                  <div className="text-xs font-bold text-slate-500 mt-1">Unexcused Absences</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-indigo-600">100%</div>
                  <div className="text-xs font-bold text-slate-500 mt-1">Standup Participation</div>
                </div>
              </div>
            </div>
          )}

          {previewTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">Verified Technical Skill Matrix</h4>
                  <p className="text-xs text-slate-500 font-semibold">Competencies assessed through live code tests and practical project reviews</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-black">
                  4 Verified Badges
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">Full Stack REST APIs (Node/Express/Nest)</span>
                    <span className="text-blue-600 font-extrabold">94%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[94%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">React & Modern State Management</span>
                    <span className="text-indigo-600 font-extrabold">88%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-[88%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">Database Schema Design & Indexing</span>
                    <span className="text-purple-600 font-extrabold">91%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[91%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">Git Collaborative Branching & PR Reviews</span>
                    <span className="text-emerald-600 font-extrabold">96%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[96%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewTab === 'feedback' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">Sprint 3 Manager Evaluation Rubric</h4>
                  <p className="text-xs text-slate-500 font-semibold">Constructive mentor feedback based on real pull request audits</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                  Rating: 4.8 / 5.0
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    ML
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Engineering Manager Feedback</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Reviewed 2 days ago • Sprint Milestone 3</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  "Demonstrated exceptional progress on the authentication microservice. Code was modular, well-commented, and unit test coverage reached 89%. Excellent handling of async error middleware. Recommended for corporate internship interview round."
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS                           */}
      {/* ============================================================== */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            CLEAR ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 font-semibold">
            Clear, honest answers about how InterHive supports your career:
          </p>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 8: STUDENT CONVERSION & INQUIRY FORM                   */}
      {/* ============================================================== */}
      <section id="student-inquiry" className="py-20 bg-gradient-to-b from-[#EBF3FF] via-white to-[#F0F5FA] border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
              TAKE THE NEXT STEP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your Career Deserves More Than a Certificate.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Take the next step toward becoming industry-ready. Tell us about your goals, and let the InterHive team help you understand the right path forward.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl">
            {submitSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Inquiry Received Successfully!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
                  Thank you! The InterHive career counseling team will reach out to your email and phone within 24 hours to help you choose the best program pathway.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    to="/programs"
                    className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                  >
                    Explore Programs
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                
                {submitError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm font-medium">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Submission Error:</span>
                      {submitError}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.fullName ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul.sharma@college.edu"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.email ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.email}</p>}
                  </div>

                  {/* Mobile Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.phone ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.phone}</p>}
                  </div>

                  {/* College / University */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      College / University <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      placeholder="e.g. Delhi Technological University"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.college ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.college && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.college}</p>}
                  </div>

                  {/* Degree / Course */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Degree / Course <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.degree ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.degree && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.degree}</p>}
                  </div>

                  {/* Current Year / Semester */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Current Academic Stage <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.currentYear}
                      onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="1st Year">1st Year (B.Tech / BCA / Degree)</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year (Pre-Final)</option>
                      <option value="Final Year">Final Year (Immediate Placement)</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>

                  {/* Skills / Areas of Interest */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Skills or Areas of Interest
                    </label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. React, Python, Java, Cloud, DevOps"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Preferred Program */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Preferred Program
                    </label>
                    <select
                      value={formData.preferredProgram}
                      onChange={(e) => setFormData({ ...formData, preferredProgram: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="Free">Free Foundation Assessment & Courses</option>
                      <option value="Premium">6-Month Premium PPO Internship Track</option>
                      <option value="Need Guidance">Need Guidance on Best Fit</option>
                    </select>
                  </div>
                </div>

                {/* Career Goal / Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Career Goal or Specific Questions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    placeholder="Tell us what role you are targeting or ask any questions about our curriculum and corporate matching..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 leading-normal font-medium">
                      I agree to the InterHive{' '}
                      <Link to="/privacy" target="_blank" className="text-blue-600 underline font-bold">
                        Privacy Policy
                      </Link>{' '}
                      and authorize the team to contact me via email or phone regarding my career guidance.
                    </span>
                  </label>
                  {formErrors.consent && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.consent}</p>}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Student Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <Link
                    to="/programs"
                    className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span>Or Explore Detailed Programs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <PublicFooter
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Modals for parity */}
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
