import React, { useState, useEffect } from 'react';
import { Users, Calendar, Award, CheckCircle2, Clock, Video, Mail, Phone, ExternalLink, ChevronRight, X } from 'lucide-react';
import { useMatching } from '../../../api/hooks/use-matching';
import { toast } from 'react-hot-toast';

interface CompanyMatchesPageProps {
  initialTab?: 'matches' | 'interviews' | 'hires';
}

export const CompanyMatchesPage: React.FC<CompanyMatchesPageProps> = ({ initialTab = 'matches' }) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'interviews' | 'hires'>(initialTab);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const { useMyMatches } = useMatching();
  const { data: matchesData } = useMyMatches();
  const rawMatches = (matchesData as any)?.data || matchesData || [];

  const defaultMatches = [
    {
      id: 'm-01',
      internName: 'Vikram Mehta',
      role: 'Full-Stack Node & React Intern',
      email: 'vikram.m@gmail.com',
      score: 94,
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      status: 'Highly Matched',
      interviewDate: 'Tomorrow at 11:00 AM',
      meetLink: 'https://meet.google.com/hrc-qwer-tyu',
    },
    {
      id: 'm-02',
      internName: 'Sneha Reddy',
      role: 'Frontend UI/UX Intern',
      email: 'sneha.r@outlook.com',
      score: 91,
      skills: ['React', 'Tailwind CSS', 'Figma', 'Next.js'],
      status: 'Highly Matched',
      interviewDate: '14 Sep, 02:30 PM',
      meetLink: 'https://meet.google.com/sne-harr-uiw',
    },
    {
      id: 'm-03',
      internName: 'Rahul Sharma',
      role: 'Backend Systems & API Intern',
      email: 'rahul.s@gmail.com',
      score: 86,
      skills: ['NestJS', 'Docker', 'Redis', 'MongoDB'],
      status: 'Interview Scheduled',
      interviewDate: 'Today at 04:00 PM',
      meetLink: 'https://meet.google.com/int-rsh-dev',
    },
    {
      id: 'm-04',
      internName: 'Priya Patel',
      role: 'Data Science & Python Intern',
      email: 'priya.p@gmail.com',
      score: 88,
      skills: ['Python', 'Pandas', 'SQL', 'FastAPI'],
      status: 'Offer Accepted',
      interviewDate: 'Completed',
      offerStipend: '₹32,000 / mo',
    },
  ];

  const candidateList = Array.isArray(rawMatches) && rawMatches.length > 0 ? rawMatches : defaultMatches;

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Interview scheduled with ${selectedCandidate?.internName || 'candidate'}!`);
    setIsScheduleModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate Pipeline</h1>
          <p className="text-sm text-gray-500">Track matched interns, technical interview rounds, and accepted hires</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'matches'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Matches
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'interviews'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Interviews
          </button>
          <button
            onClick={() => setActiveTab('hires')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'hires'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Hires
          </button>
        </div>
      </div>

      {/* Tab 1: Matched Interns */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateList.map((c: any) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] hover:border-teal-500/50 transition-all shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.internName}</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{c.role}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                    {c.score}% Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(c.skills || []).map((s: string) => (
                    <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {c.email}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setIsScheduleModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Interviews */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateList.slice(0, 3).map((c: any) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.internName}</h3>
                    <p className="text-xs text-slate-500">{c.role}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Scheduled
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Session: <span className="text-indigo-600 dark:text-indigo-400">{c.interviewDate}</span>
                  </p>
                  <p className="text-slate-500">Format: 45 min live technical discussion & coding walkthrough</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={c.meetLink || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:underline"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Google Meet
                  </a>
                  <button
                    onClick={() => toast.success(`Interview marked completed for ${c.internName}!`)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Mark Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hires */}
      {activeTab === 'hires' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateList.slice(2, 4).map((c: any) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-[#121526] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.internName}</h3>
                    <p className="text-xs text-slate-500">{c.role}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Offer Accepted
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-xs space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Stipend Package: <span className="text-emerald-600 font-bold">{c.offerStipend || '₹30,000 / mo'}</span>
                  </p>
                  <p className="text-slate-500">Internship Duration: 6 Months • Full-Time Placement Track</p>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => toast.success(`Generated official agreement letter for ${c.internName}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    View Agreement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Candidate Interview</h3>
                <p className="text-xs text-slate-500">{selectedCandidate.internName} • {selectedCandidate.role}</p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interview Date *</label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Slot *</label>
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  Confirm & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
