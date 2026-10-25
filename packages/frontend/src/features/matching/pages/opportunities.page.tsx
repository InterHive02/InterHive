import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2, Search, Briefcase, Target, ExternalLink } from 'lucide-react';
import { useMatching } from '../hooks/use-matching';

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { useMyMatches } = useMatching();
  const [activeTab, setActiveTab] = useState<'matched' | 'recommended' | 'applied'>('recommended');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: matchesData, isLoading } = useMyMatches();
  const myMatches: any[] = (matchesData as any)?.data || (Array.isArray(matchesData) ? matchesData : []);

  // Standard verified corporate openings in the InterHive network
  const availableOpportunities = [
    {
      id: 'opp-tata',
      company: 'Tata Technologies',
      logoText: 'TATA',
      logoBg: 'bg-[#004B87] text-white',
      role: 'Software Engineering Intern',
      location: 'Remote',
      duration: '4 Months',
      stipend: '₹40,000 / month',
      matchScore: 85,
      skills: ['Python', 'React', 'PostgreSQL', 'Docker'],
      status: 'Open for Application',
      tab: 'recommended',
    },
    {
      id: 'opp-infosys',
      company: 'Infosys BPM',
      logoText: 'INFY',
      logoBg: 'bg-[#007CC3] text-white',
      role: 'Backend Developer Intern',
      location: 'Bangalore (Hybrid)',
      duration: '4 Months',
      stipend: '₹35,000 / month',
      matchScore: 78,
      skills: ['Node.js', 'NestJS', 'MongoDB', 'Microservices'],
      status: 'Open for Application',
      tab: 'recommended',
    },
    {
      id: 'opp-deloitte',
      company: 'Deloitte Digital',
      logoText: 'DEL',
      logoBg: 'bg-black text-[#86BC25]',
      role: 'Data Analyst & Insights Intern',
      location: 'Remote',
      duration: '6 Months',
      stipend: '₹45,000 / month',
      matchScore: 72,
      skills: ['Python', 'SQL', 'Tableau', 'Pandas'],
      status: 'Open for Application',
      tab: 'recommended',
    },
    {
      id: 'opp-capgemini',
      company: 'Capgemini Tech',
      logoText: 'CAP',
      logoBg: 'bg-[#0070AD] text-white',
      role: 'Cloud & DevOps Intern',
      location: 'Pune / Remote',
      duration: '4 Months',
      stipend: '₹38,000 / month',
      matchScore: 75,
      skills: ['AWS', 'Docker', 'Linux', 'Terraform'],
      status: 'Open for Application',
      tab: 'recommended',
    },
    {
      id: 'opp-wipro',
      company: 'Wipro Digital',
      logoText: 'WIP',
      logoBg: 'bg-slate-900 text-orange-400',
      role: 'Full Stack Web Intern',
      location: 'Hyderabad',
      duration: '4 Months',
      stipend: '₹35,000 / month',
      matchScore: 71,
      skills: ['React', 'Node.js', 'MySQL'],
      status: 'Open for Application',
      tab: 'recommended',
    },
  ];

  // Map user matches
  const appliedList = myMatches.filter((m: any) => m.status === 'applied' || m.status === 'interview_scheduled' || m.status === 'accepted');
  const matchedList = myMatches.filter((m: any) => m.status === 'pending' || m.matchScore >= 75);

  const displayList = activeTab === 'applied' 
    ? appliedList 
    : activeTab === 'matched' 
    ? (matchedList.length > 0 ? matchedList : availableOpportunities.slice(0, 2))
    : availableOpportunities;

  const filtered = displayList.filter((c: any) => {
    const compName = c.company?.name || c.company || '';
    const roleName = c.requirement?.title || c.role || '';
    return compName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Corporate Placement Opportunities
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Verified corporate requisitions with guaranteed paid internship stipends and PPO potential.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search roles or companies..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Dynamic Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'recommended'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Open Requisitions ({availableOpportunities.length})
        </button>
        <button
          onClick={() => setActiveTab('matched')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'matched'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          AI Matched ({matchedList.length > 0 ? matchedList.length : 2})
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'applied'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Applied / Pipeline ({appliedList.length})
        </button>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white dark:bg-[#151829] border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeTab === 'applied' ? 'No Active Applications Yet' : 'No Opportunities Match Search'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'applied' 
                ? 'Explore the Open Requisitions tab to view partner opportunities and submit your profile.'
                : 'Try clearing your search query to see all verified corporate requisitions.'}
            </p>
          </div>
        ) : (
          filtered.map((opp: any) => {
            const companyName = opp.company?.name || opp.company || 'Partner Enterprise';
            const roleName = opp.requirement?.title || opp.role || 'Software Engineering Intern';
            const locationText = opp.requirement?.location || opp.location || 'Remote';
            const durationText = opp.requirement?.duration || opp.duration || '4 Months';
            const stipendText = opp.requirement?.stipend || opp.stipend || 'Competitive Stipend';
            const matchScore = opp.matchScore || 80;
            const skillsList = opp.skills || opp.requirement?.skills || ['Technical Foundations', 'Git', 'Agile'];
            const logoBg = opp.logoBg || 'bg-indigo-600 text-white';
            const logoText = opp.logoText || companyName.slice(0, 2).toUpperCase();
            const statusLabel = opp.status || 'Active Requisition';

            return (
              <div
                key={opp.id}
                className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-blue-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${logoBg} font-black text-xs flex items-center justify-center shrink-0 shadow-md`}>
                    {logoText}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {companyName}
                      </h3>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {matchScore}% Match
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        {statusLabel}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {roleName}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{locationText}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{durationText}</span>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Stipend: {stipendText}
                      </span>
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {skillsList.map((skill: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => navigate(`/opportunities/${opp.id}`)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Role & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
