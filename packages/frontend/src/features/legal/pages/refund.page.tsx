import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ShieldCheck, CheckCircle2, HelpCircle, Mail, AlertTriangle, FileText } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to InterHive</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Commercial Terms
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900 border-b border-slate-800 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <RefreshCw className="w-3.5 h-3.5" />
            Transparent Commercial Standards
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            InterHive is committed to fair, transparent operations. Learn about our free-of-charge candidate intake model, corporate billing principles, and replacement guarantees.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Applies Globally & to India Operations</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Anti-Fraud / Student Fee Zero Notice */}
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h3 className="font-black text-white text-base">Candidates & Interns: 100% Free Policy</h3>
              <p className="text-slate-300 leading-relaxed">
                InterHive does <strong>not</strong> charge students or intern applicants any fees for application processing, technical evaluations, interview scheduling, or internship access. If any individual or agency demands payment claiming to represent InterHive, report them immediately to <a href="mailto:interhive.info@gmail.com" className="text-emerald-400 underline font-semibold">interhive.info@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Candidate Intake & Student Services */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">1. Candidate Services & Zero-Fee Model</h2>
          </div>
          <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              Candidate access to the InterHive talent platform—including application intake, technical assessments, progress analytics, and attendance tracking—is provided at zero financial cost to students.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
              <li>No registration fees, enrollment deposits, or security deposits are collected.</li>
              <li>No commissions or deductions are ever withheld from stipends paid by partner organizations.</li>
              <li>Because no fees are charged to candidates, candidate refund or chargeback claims are not applicable.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Corporate & Enterprise Talent Partnerships */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">2. Employer & Corporate Engagements</h2>
          </div>
          <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              InterHive provides verified technical talent sourcing and matching services to corporate partners under individual Master Services Agreements (MSAs) or customized Statements of Work (SOWs).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <h4 className="font-bold text-white text-sm">Engagement Retainers</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sourcing deposits or setup fees cover technical evaluation pipelines and candidate matching infrastructure. Specific refundability terms are explicitly stated in each executed corporate SOW.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <h4 className="font-bold text-white text-sm">Talent Replacement Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If an onboarded candidate departs or terminates during the initial 30 days of an internship due to unforeseen personal or academic reasons, InterHive provides a priority candidate rematch at no additional sourcing cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Cancellation Terms for Employers */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">3. Cancellation Notice & Process</h2>
          </div>
          <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              Corporate partners wishing to modify, pause, or cancel active hiring mandates must adhere to the following procedural guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Written Notice:</strong> Cancellation notices must be delivered via email to <a href="mailto:interhive.info@gmail.com" className="text-blue-400 underline">interhive.info@gmail.com</a> at least 14 business days before the scheduled cohort onboarding date.
              </li>
              <li>
                <strong className="text-slate-200">Work Delivered:</strong> Any candidates already interviewed, offer letters accepted, or onboarding credentials provisioned prior to cancellation notice remain subject to fulfillment terms.
              </li>
              <li>
                <strong className="text-slate-200">Billing Adjustments:</strong> Any eligible credits or agreed refunds are processed through the original payment method within 7 to 10 business days of mutual written agreement.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Contact & Inquiries */}
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">4. Billing Support & Contact Information</h2>
          </div>
          <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
            <p>
              For questions regarding invoices, partner agreements, or cancellation status, please reach out to our dedicated operations desk:
            </p>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 max-w-md space-y-1.5 text-xs">
              <p className="font-bold text-white">InterHive Commercial Operations</p>
              <p className="text-slate-300">Email: <a href="mailto:interhive.info@gmail.com" className="text-blue-400 underline">interhive.info@gmail.com</a></p>
              <p className="text-slate-300">Phone: <a href="tel:+918278314925" className="text-blue-400 underline">+91 82783 14925</a></p>
              <p className="text-slate-400">Response SLA: Within 24-48 business hours</p>
              <p className="text-slate-400">Location: India</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} InterHive. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/refund" className="text-blue-400 font-bold">Refund Policy</Link>
            <Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
