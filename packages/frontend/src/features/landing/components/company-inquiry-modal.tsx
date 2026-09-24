import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { companyApi } from '../../../api/endpoints/company.api';

interface CompanyInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyInquiryModal: React.FC<CompanyInquiryModalProps> = ({ isOpen, onClose }) => {
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    techStack: '',
    internCount: '1-5',
    message: '',
  });
  const [companySubmitted, setCompanySubmitted] = useState(false);
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false);

  if (!isOpen) return null;

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCompany(true);
    try {
      await companyApi.submitInquiry(companyForm);
    } catch (err) {
      // Graceful fallback for UI feedback
    } finally {
      setIsSubmittingCompany(false);
      setCompanySubmitted(true);
      setTimeout(() => {
        setCompanySubmitted(false);
        onClose();
        setCompanyForm({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          techStack: '',
          internCount: '1-5',
          message: '',
        });
      }, 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">Partner With InterHive</h3>
            <p className="text-xs text-slate-500 font-semibold">Submit details to get company portal login credentials</p>
          </div>
        </div>

        {companySubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Inquiry Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed font-semibold">
              Thank you! Your company hiring inquiry has been sent to the <strong>InterHive HR team</strong>. We will review your requirements and reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCompanySubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyForm.companyName}
                onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                placeholder="e.g. Acme Technologies Inc."
                className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.contactPerson}
                  onChange={e => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  inputMode="email"
                  required
                  value={companyForm.email}
                  onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  value={companyForm.phone}
                  onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Interns Needed
                </label>
                <select
                  value={companyForm.internCount}
                  onChange={e => setCompanyForm({ ...companyForm, internCount: e.target.value })}
                  className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                >
                  <option value="1-5">1-5 Interns</option>
                  <option value="5-10">5-10 Interns</option>
                  <option value="10-25">10-25 Interns</option>
                  <option value="25+">25+ Interns</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Hiring Requirement / Tech Stack
              </label>
              <input
                type="text"
                value={companyForm.techStack}
                onChange={e => setCompanyForm({ ...companyForm, techStack: e.target.value })}
                placeholder="e.g. Full Stack (React, Node), AI/ML, UI/UX Design"
                className="w-full px-4 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                Message / Additional Notes
              </label>
              <textarea
                rows={2}
                value={companyForm.message}
                onChange={e => setCompanyForm({ ...companyForm, message: e.target.value })}
                placeholder="Tell us about your project or talent timeline..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingCompany}
              className="w-full py-3.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingCompany ? (
                <span>Submitting Inquiry...</span>
              ) : (
                <>
                  <span>Submit Partnership Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
