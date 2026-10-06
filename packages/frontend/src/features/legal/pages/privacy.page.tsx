import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { PublicNavbar } from '../../landing/components/public-navbar';
import { PublicFooter } from '../../landing/components/public-footer';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <PublicNavbar
        onOpenInternshipModal={() => {}}
        onOpenCompanyModal={() => {}}
      />

      {/* Hero Header */}
      <section className="relative pt-16 pb-12 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection & Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2">
            Last Updated: October 2, 2026 · Effective Date: October 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 leading-relaxed text-sm">
        
        {/* Notice Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-black text-blue-900 block">Our Privacy Commitment</span>
            <p className="text-blue-800/90 font-medium">
              InterHive adheres to the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, the <strong>Information Technology Act, 2000</strong>, and global privacy standards. We process personal data solely for legitimate education, skill benchmarking, and employment preparation purposes. We never sell your personal information.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">1</span>
            <span>Who We Are (Data Fiduciary)</span>
          </h2>
          <p>
            This Privacy Policy applies to <strong>InterHive</strong> ("InterHive", "we", "us", or "our"), operating the website at <a href="https://interhive.in" className="text-blue-600 underline font-semibold">https://interhive.in</a>. InterHive connects students with structured engineering preparation, industry mentors, and hiring partner companies through our 6-Month PPO Track.
          </p>
          <p>
            For any queries regarding personal data processing, you can contact our designated Data Grievance Officer at <a href="mailto:interhive.info@gmail.com" className="text-blue-600 font-bold">interhive.info@gmail.com</a>.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">2</span>
            <span>Personal Data We Collect (Data Minimisation)</span>
          </h2>
          <p>
            In accordance with the principle of data minimisation, we only collect data that is strictly necessary to evaluate your eligibility, deliver training, and connect you with partner companies:
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="font-bold text-slate-900 text-xs block mb-1">A. Student / Candidate Information:</span>
              <ul className="text-xs space-y-1 list-disc pl-4 text-slate-600">
                <li><strong>Identity & Contact:</strong> Full name, email address, mobile number.</li>
                <li><strong>Academic Profile:</strong> College / University name, degree program, graduation semester.</li>
                <li><strong>Professional Credentials:</strong> Resume / CV link, technical skills, portfolio or GitHub / LinkedIn profile links.</li>
                <li><strong>Performance Data:</strong> Diagnostic assessment results, project code submissions, sprint attendance, and mentor feedback.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="font-bold text-slate-900 text-xs block mb-1">B. Partner Company & Employer Information:</span>
              <ul className="text-xs space-y-1 list-disc pl-4 text-slate-600">
                <li>Company name, business email, authorized representative name, phone number, and talent requirements.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="font-bold text-slate-900 text-xs block mb-1">C. Technical & Security Data:</span>
              <ul className="text-xs space-y-1 list-disc pl-4 text-slate-600">
                <li>IP address, browser type, and authentication credentials stored securely in browser <code>localStorage</code> (session access token and refresh token).</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <strong>What We Do NOT Collect:</strong> We do NOT ask for or store government identification numbers (Aadhaar, PAN), biometric data, or financial payment cards on our public intake forms.
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">3</span>
            <span>Lawful Grounds & Purposes of Processing</span>
          </h2>
          <p>We process personal data on the grounds of user consent and the performance of educational and matching services:</p>
          <ul className="text-xs space-y-2 list-disc pl-5">
            <li><strong>Intake & Verification:</strong> Evaluating candidate eligibility for cohort placement.</li>
            <li><strong>Skill Benchmarking:</strong> Administering objective aptitude, technical, and coding evaluations.</li>
            <li><strong>Company Matching:</strong> Presenting verified candidate profiles to partner companies looking for interns.</li>
            <li><strong>Internship Tracking:</strong> Supporting mentor reviews, attendance logging, and sprint progress tracking.</li>
            <li><strong>Credentialing:</strong> Generating verifiable Certificates of Completion with unique verification identifiers.</li>
            <li><strong>Transactional Communications:</strong> Sending application updates, interview schedules, and portal access details.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">4</span>
            <span>Third-Party Data Processors</span>
          </h2>
          <p>
            We engage vetted third-party service providers solely to operate our infrastructure. All partners are contractually required to maintain strict data protection safeguards:
          </p>
          <ul className="text-xs space-y-1.5 list-disc pl-5">
            <li><strong>Vercel Inc.:</strong> Frontend web hosting and Content Delivery Network (CDN).</li>
            <li><strong>Render Services Inc.:</strong> Cloud API backend hosting.</li>
            <li><strong>MongoDB Atlas:</strong> Encrypted cloud database storage (TLS in transit, AES-256 at rest).</li>
            <li><strong>Resend Technologies Inc.:</strong> Transactional email dispatch for account verification and notifications.</li>
            <li><strong>Google Fonts:</strong> Web typography rendering.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">5</span>
            <span>Data Retention & Erasure Schedule</span>
          </h2>
          <p>
            We retain personal data only for as long as necessary to fulfill the educational and career placement objectives outlined in this policy:
          </p>
          <ul className="text-xs space-y-2 list-disc pl-5">
            <li><strong>Active Students & Interns:</strong> Retained during the 6-month PPO Track and for 24 months post-completion to enable alumni verification and certificate lookups.</li>
            <li><strong>Unselected Applicants:</strong> Retained for 12 months for subsequent cohort consideration, or immediately deleted upon user request.</li>
            <li><strong>Right to Deletion:</strong> You may request complete erasure of your data at any time by emailing our Grievance Officer. We process complete deletion requests within 30 calendar days.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">6</span>
            <span>Your Rights as a Data Principal (DPDP Act, 2023)</span>
          </h2>
          <p>Under the Digital Personal Data Protection Act, you possess the following statutory rights:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-xs text-slate-900 block mb-0.5">Right to Access</span>
              <span className="text-[11px] text-slate-500">Request a summary of your personal data being processed.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-xs text-slate-900 block mb-0.5">Right to Correction</span>
              <span className="text-[11px] text-slate-500">Update inaccurate, incomplete, or out-of-date information.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-xs text-slate-900 block mb-0.5">Right to Erasure</span>
              <span className="text-[11px] text-slate-500">Request complete deletion of your profile and data.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-xs text-slate-900 block mb-0.5">Right of Grievance Redressal</span>
              <span className="text-[11px] text-slate-500">Timely resolution of data protection concerns within 30 days.</span>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">7</span>
            <span>Data Grievance Redressal Officer</span>
          </h2>
          <p>
            In compliance with the DPDP Act, 2023 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, our designated Grievance Officer details are:
          </p>
          
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <p><strong>Name:</strong> Ankit Yadav</p>
              <p><strong>Designation:</strong> Data Protection & Grievance Officer, InterHive</p>
              <p><strong>Email:</strong> <a href="mailto:interhive.info@gmail.com" className="text-blue-600 font-bold">interhive.info@gmail.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+918278314925" className="text-blue-600 font-bold">+91 82783 14925</a></p>
              <p><strong>Jurisdiction:</strong> India</p>
              <p><strong>Response Timeline:</strong> Within 30 days of ticket receipt.</p>
            </div>
        </section>

      </main>

      <PublicFooter
        onOpenInternshipModal={() => {}}
        onOpenCompanyModal={() => {}}
      />
    </div>
  );
};
