import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  FileText,
  User,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { applicationsApi } from '../../../api/endpoints/applications.api';
import { toast } from 'react-hot-toast';

interface InternshipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
}

export const InternshipApplicationModal: React.FC<InternshipApplicationModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'portfolio'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
    institution: '',
    degree: '',
    semester: '',
    skills: '',
    areasOfInterest: preselectedCategory ? [preselectedCategory] : ['Software Engineering'],
    internshipPreference: 'remote' as 'remote' | 'hybrid' | 'onsite',
    previousExperience: '',
    resumeUrl: '',
    linkedInUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    reasonForApplying: '',
    additionalInfo: '',
  });

  if (!isOpen) return null;

  const availableInterests = [
    'Frontend Development',
    'Backend Systems',
    'Full Stack Engineering',
    'AI & Machine Learning',
    'Data Science & Analytics',
    'UI/UX Design',
    'DevOps & Cloud',
    'Mobile App Development',
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.areasOfInterest.includes(interest);
      if (exists) {
        return {
          ...prev,
          areasOfInterest: prev.areasOfInterest.filter(i => i !== interest),
        };
      } else {
        return {
          ...prev,
          areasOfInterest: [...prev.areasOfInterest, interest],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please complete all essential personal details.');
      setActiveTab('personal');
      return;
    }

    if (!formData.institution.trim() || !formData.degree.trim() || !formData.rollNumber.trim()) {
      setErrorMessage('Please fill in your academic information.');
      setActiveTab('personal');
      return;
    }

    if (!formData.resumeUrl.trim()) {
      setErrorMessage('Please provide a link to your Resume / CV.');
      setActiveTab('portfolio');
      return;
    }

    if (!formData.reasonForApplying.trim()) {
      setErrorMessage('Please share why you want to join this program.');
      setActiveTab('portfolio');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedSkills = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await applicationsApi.submitApplication({
        ...formData,
        skills: parsedSkills.length > 0 ? parsedSkills : ['JavaScript', 'React'],
      });

      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit application. An active application may already exist for this email.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/20 text-white backdrop-blur-xs">
              Official Application
            </span>
            <span className="text-blue-200 text-xs font-semibold">• Controlled Access</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Apply for InterHive Internship
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium max-w-lg">
            Complete candidate intake form. All applications are evaluated directly by the HR & technical review committee.
          </p>

          {/* Stepper Tabs */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                1. Personal & College
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'skills'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                2. Skills & Domain
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                3. Resume & Statement
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          {isSubmitted ? (
            <div className="text-center py-8 px-4 animate-in fade-in">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Application Received!</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Thank you, <strong>{formData.fullName}</strong>. Your internship application has been routed directly to the <strong>HR Review Dashboard</strong>.
              </p>
              
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-6 text-left max-w-md mx-auto text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> What Happens Next?
                </p>
                <p>1. The HR team reviews your resume, roll number verification, and qualifications.</p>
                <p>2. If shortlisted, you will receive an official interview schedule invitation via email.</p>
                <p>3. Upon selection, official login credentials will be generated and delivered to <strong>{formData.email}</strong>.</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
              >
                Back to Homepage
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: Personal & College Info */}
              {activeTab === 'personal' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. applicant@college.edu"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Roll Number / Student ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rollNumber}
                        onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder="e.g. 21CS042"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        College / Institution Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={e => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Degree / Course <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.degree}
                          onChange={e => setFormData({ ...formData, degree: e.target.value })}
                          placeholder="e.g. B.Tech CSE"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Current Sem / Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.semester}
                          onChange={e => setFormData({ ...formData, semester: e.target.value })}
                          placeholder="e.g. 6th Sem / 3rd Yr"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('skills')}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer"
                    >
                      Next: Skills & Preferences →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Skills & Areas of Interest */}
              {activeTab === 'skills' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Technical Skills (comma-separated) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. React.js, TypeScript, Node.js, Python, SQL"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Separate individual technologies with a comma.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Areas of Interest (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableInterests.map(interest => {
                        const isSelected = formData.areasOfInterest.includes(interest);
                        return (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '} {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Workplace Preference
                      </label>
                      <select
                        value={formData.internshipPreference}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            internshipPreference: e.target.value as any,
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white font-medium"
                      >
                        <option value="remote">Remote (Work from Anywhere)</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site / In-Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Previous Experience (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.previousExperience}
                        onChange={e =>
                          setFormData({ ...formData, previousExperience: e.target.value })
                        }
                        placeholder="e.g. 1 past internship, freelance web dev"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('personal')}
                      className="px-4 py-2 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('portfolio')}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer"
                    >
                      Next: Links & Statement →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Portfolio & Resume Statement */}
              {activeTab === 'portfolio' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resume / CV Link (Google Drive, Dropbox, or PDF link) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="url"
                        required
                        value={formData.resumeUrl}
                        onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/your-resume"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Please ensure link access permissions are set to "Anyone with link can view".</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.linkedInUrl}
                        onChange={e => setFormData({ ...formData, linkedInUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GitHub or Portfolio Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Why do you want to join this internship? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.reasonForApplying}
                      onChange={e => setFormData({ ...formData, reasonForApplying: e.target.value })}
                      placeholder="Tell us about your learning goals and why you are excited to become industry-ready..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Additional Information / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo}
                      onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
                      placeholder="Availability dates, certifications, or specific questions"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('skills')}
                      className="px-4 py-2 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-7 py-3 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Internship Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
