import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '../../landing/components/public-navbar';
import { PublicFooter } from '../../landing/components/public-footer';

export const TermsPage: React.FC = () => {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Platform Agreement & Disclaimers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2">
            Last Updated: October 2, 2026 · Effective Date: October 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 leading-relaxed text-sm">
        
        {/* Section 1 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">1</span>
            <span>Acceptance of Terms</span>
          </h2>
          <p>
            Welcome to <strong>InterHive</strong> (<a href="https://interhive.in" className="text-blue-600 underline font-semibold">https://interhive.in</a>). By registering an account, submitting an application, or accessing any service on InterHive, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
          </p>
          <p>
            If you do not agree to these Terms, you must not access or use the InterHive platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">2</span>
            <span>The 6-Month PPO Track Structure</span>
          </h2>
          <p>
            InterHive operates a structured educational and career pathway:
          </p>
          <ul className="text-xs space-y-2 list-disc pl-5">
            <li><strong>Phase 1: 2-Month Industry Preparation at InterHive:</strong> Includes core engineering modules, system design, Git pull request workflows, professional communication, and objective benchmark assessments.</li>
            <li><strong>Phase 2: Company Matching & 4-Month Internship:</strong> Vetted candidates meeting benchmark scores are introduced to partner companies for live project internships.</li>
            <li><strong>Phase 3: Performance Review & PPO Consideration:</strong> Ongoing evaluations against agreed company rubrics determine full-time Pre-Placement Offer eligibility.</li>
          </ul>
        </section>

        {/* Section 3: Transparent Legal Disclaimer */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">3</span>
            <span>Performance-Based PPO Disclaimer</span>
          </h2>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-black">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Transparent Outcome Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              InterHive does NOT offer unconditional, automatic employment or placement guarantees without performance verification. Pre-Placement Offers (PPOs) are granted solely by partner companies based on:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Candidate's active attendance and completion of assigned sprint deliverables;</li>
              <li>Satisfaction of company-specific evaluation benchmarks and mentor ratings;</li>
              <li>Mutual agreement and standard employment terms between the candidate and the hiring employer.</li>
            </ul>
            <p>
              InterHive provides verified skill training, objective proctored assessments, and matching introductions, but the final hiring authority rests exclusively with the participating company.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">4</span>
            <span>Academic Integrity & User Conduct</span>
          </h2>
          <p>Users agree to maintain high standards of academic and professional honesty:</p>
          <ul className="text-xs space-y-2 list-disc pl-5">
            <li><strong>Assessment Integrity:</strong> Candidates must complete diagnostic assessments independently without unauthorized third-party proxy assistance or impersonation.</li>
            <li><strong>Plagiarism:</strong> Submissions, code repositories, and deliverables must represent original work or properly attributed open-source contributions.</li>
            <li><strong>Prohibited Actions:</strong> Users shall not reverse engineer, scrape, extract, or disrupt InterHive services or data.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">5</span>
            <span>Intellectual Property</span>
          </h2>
          <p>
            The InterHive name, branding, curriculum, platform architecture, and interface designs are the intellectual property of InterHive.
          </p>
          <p>
            Work product, code, and documentation generated by an intern during a company internship are subject to the specific intellectual property agreement executed between the candidate and the partner company.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">6</span>
            <span>Governing Law & Dispute Resolution</span>
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute or claim arising under or related to these Terms, the parties shall first attempt to resolve the matter through mutual good-faith consultation. If unresolved, the competent courts in India shall have exclusive jurisdiction.
          </p>
          <p>
            Contact for legal notifications: <a href="mailto:interhive.info@gmail.com" className="text-blue-600 font-bold">interhive.info@gmail.com</a>.
          </p>
        </section>

      </main>

      <PublicFooter
        onOpenInternshipModal={() => {}}
        onOpenCompanyModal={() => {}}
      />
    </div>
  );
};
