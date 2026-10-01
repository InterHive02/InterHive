import React, { useRef } from 'react';
import { useAuth } from '../../../api/hooks/use-auth';
import { useIntern } from '../../../api/hooks/use-intern';
import { Award, Download, CheckCircle2, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CertificatePage: React.FC = () => {
  const { user } = useAuth();
  const { useProfile } = useIntern();
  const { data: profile } = useProfile();
  const certificateRef = useRef<HTMLDivElement>(null);

  const studentName = profile?.personalInfo
    ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`.trim()
    : user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Ankit Soni';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Verified Credentials & Certificate
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Official certificate of completion for the 2-Month InterHive Industry Training Program.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D33] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certificate (PDF)</span>
          </button>
        </div>
      </div>

      {/* CERTIFICATE DISPLAY FRAME MATCHING REFERENCE IMAGE 2 */}
      <div className="flex justify-center">
        <div 
          ref={certificateRef}
          className="w-full max-w-4xl bg-[#FCFDFE] dark:bg-[#151829] rounded-[2.5rem] p-8 sm:p-14 border-8 border-double border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden text-center print:border-4 print:p-8"
        >
          
          {/* Subtle Watermark & Corner Ornaments */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-blue-600/30 rounded-tl-[2rem] pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-blue-600/30 rounded-tr-[2rem] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-blue-600/30 rounded-bl-[2rem] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-blue-600/30 rounded-br-[2rem] pointer-events-none" />
          
          {/* Background Radial Tint */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Certificate Header: InterHive Logo */}
          <div className="flex items-center justify-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/30">
              ih
            </div>
            <div className="text-left">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight block leading-none">
                Inter<span className="text-blue-600">Hive</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                From Intern to Industry
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-1 relative z-10 my-6">
            <span className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
              Official Verification Credential
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Certificate of Completion
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold italic mt-4 relative z-10">
            This is to certify that
          </p>

          {/* Student Recipient Name */}
          <div className="my-6 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight border-b-2 border-slate-300 dark:border-slate-700 pb-2 inline-block px-8 sm:px-16 font-serif">
              {studentName}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold max-w-xl mx-auto leading-relaxed relative z-10">
            has successfully completed the intensive curriculum, assessments, and verified project deliverables of the
          </p>

          {/* Program Title */}
          <div className="my-4 relative z-10">
            <span className="text-lg sm:text-2xl font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-6 py-2 rounded-2xl border border-blue-200 dark:border-blue-800/80 inline-block shadow-xs">
              Industry Training Program (2 Months)
            </span>
            <span className="block text-xs font-bold text-slate-400 mt-2">
              Track: Software Engineering & Enterprise Architecture
            </span>
          </div>

          {/* Issuance Date & Verification Code */}
          <div className="my-6 relative z-10 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Issued on: <strong>September 30, 2026</strong></span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ID: IH-2026-ITP-8842</span>
            </span>
          </div>

          {/* Signatures & Seal Section matching Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-8 border-t border-slate-200 dark:border-slate-800 mt-8 relative z-10">
            
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic font-bold text-xl text-slate-800 dark:text-slate-200">
                  Priyank Sood
                </span>
              </div>
              <div className="w-36 h-0.5 bg-slate-300 dark:bg-slate-700 mx-auto" />
              <span className="block text-[11px] font-black text-slate-900 dark:text-white">Priyank Sood</span>
              <span className="block text-[10px] text-slate-400 font-semibold">Program Head, InterHive</span>
            </div>

            {/* Official Center Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-1 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#1A1D33] flex flex-col items-center justify-center border border-purple-200 text-center p-1">
                  <Award className="w-6 h-6 text-purple-600 mb-0.5" />
                  <span className="text-[8px] font-black text-slate-900 dark:text-white uppercase leading-none">
                    VERIFIED
                  </span>
                  <span className="text-[7px] text-slate-400 font-bold leading-none mt-0.5">
                    INTERHIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic font-bold text-xl text-slate-800 dark:text-slate-200">
                  Ankit Yadav
                </span>
              </div>
              <div className="w-36 h-0.5 bg-slate-300 dark:bg-slate-700 mx-auto" />
              <span className="block text-[11px] font-black text-slate-900 dark:text-white">Ankit Yadav</span>
              <span className="block text-[10px] text-slate-400 font-semibold">Co-Founder, InterHive</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
