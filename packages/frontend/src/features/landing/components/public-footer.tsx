import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

interface PublicFooterProps {
  onOpenInternshipModal: () => void;
  onOpenCompanyModal: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onOpenInternshipModal,
  onOpenCompanyModal,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-lg">
                H
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Inter<span className="text-blue-500">Hive</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              From Intern to Industry. Connecting talent with real-world opportunities worldwide.
            </p>
          </div>

          {/* For Students Column */}
          <div>
            <h5 className="text-sm font-black text-white mb-4">For Students</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
              <li>
                <Link to="/programs" className="text-slate-300 hover:text-blue-400 hover:underline transition-all block">
                  Explore Internships
                </Link>
              </li>
              <li>
                <Link to="/programs#readiness" className="text-slate-300 hover:text-blue-400 hover:underline transition-all block">
                  Readiness Assessment
                </Link>
              </li>
              <li>
                <button 
                  onClick={onOpenInternshipModal} 
                  className="text-slate-300 hover:text-blue-400 hover:underline transition-all text-left cursor-pointer block"
                >
                  Internship Application
                </button>
              </li>
            </ul>
          </div>

          {/* For Companies Column */}
          <div>
            <h5 className="text-sm font-black text-white mb-4">For Companies</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
              <li>
                <button 
                  onClick={onOpenCompanyModal} 
                  className="text-slate-300 hover:text-blue-400 hover:underline transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Hire Trained Interns</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCompanyModal} 
                  className="text-slate-300 hover:text-blue-400 hover:underline transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Employer Credentials</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-blue-400 rounded border border-blue-500/30">
                    Partner Portal
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div>
            <h5 className="text-sm font-black text-white mb-4">Contact & Support</h5>
            <p className="text-xs text-slate-400 font-medium mb-3">Have questions? Reach out to our team:</p>
            <a href="mailto:interhive.info@gmail.com" className="text-xs font-extrabold text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4" />
              <span>interhive.info@gmail.com</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <span>Visit Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p>&copy; {new Date().getFullYear()} InterHive Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
