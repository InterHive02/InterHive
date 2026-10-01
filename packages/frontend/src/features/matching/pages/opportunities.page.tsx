import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { useMatching } from '../hooks/use-matching';

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'matched' | 'recommended' | 'applied'>('matched');
  const [searchTerm, setSearchTerm] = useState('');

  // PRD Company Matches matching Image 2 Bottom-Left 2
  const matchedCompanies = [
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
      status: 'Interview Round Scheduled',
      tab: 'matched',
    },
    {
      id: 'opp-infosys',
      company: 'Infosys',
      logoText: 'INFY',
      logoBg: 'bg-[#007CC3] text-white',
      role: 'Backend Developer Intern',
      location: 'Bangalore (Hybrid)',
      duration: '4 Months',
      stipend: '₹35,000 / month',
      matchScore: 78,
      skills: ['Node.js', 'NestJS', 'MongoDB', 'Microservices'],
      status: 'Shortlisted by Recruiter',
      tab: 'matched',
    },
    {
      id: 'opp-deloitte',
      company: 'Deloitte',
      logoText: 'DEL',
      logoBg: 'bg-black text-[#86BC25]',
      role: 'Data Analyst Intern',
      location: 'Remote',
      duration: '6 Months',
      stipend: '₹45,000 / month',
      matchScore: 72,
      skills: ['Python', 'SQL', 'Tableau', 'Pandas'],
      status: 'Skill Matched',
      tab: 'matched',
    },
    {
      id: 'opp-capgemini',
      company: 'Capgemini',
      logoText: 'CAP',
      logoBg: 'bg-[#0070AD] text-white',
      role: 'Cloud & DevOps Intern',
      location: 'Pune / Remote',
      duration: '4 Months',
      stipend: '₹38,000 / month',
      matchScore: 75,
      skills: ['AWS', 'Docker', 'Linux', 'Terraform'],
      status: 'Recommended',
      tab: 'recommended',
    },
    {
      id: 'opp-wipro',
      company: 'Wipro',
      logoText: 'WIP',
      logoBg: 'bg-slate-900 text-orange-400',
      role: 'Full Stack Web Intern',
      location: 'Hyderabad',
      duration: '4 Months',
      stipend: '₹35,000 / month',
      matchScore: 71,
      skills: ['React', 'Node.js', 'MySQL'],
      status: 'Recommended',
      tab: 'recommended',
    },
  ];

  const filtered = matchedCompanies.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'matched') return matchesSearch && c.tab === 'matched';
    if (activeTab === 'recommended') return matchesSearch && (c.tab === 'recommended' || c.tab === 'matched');
    if (activeTab === 'applied') return matchesSearch && c.id === 'opp-tata';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Company Matching
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Based on your skills and verified assessment performance, we match you with the best partner companies.
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

      {/* Tabs matching Image 2 Bottom-Left 2: Matched (3), Recommended (5), Applied (1) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('matched')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'matched'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Matched (3)
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'recommended'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Recommended (5)
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'applied'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Applied / In Pipeline (1)
        </button>
      </div>

      {/* Matching Cards Grid */}
      <div className="space-y-4">
        {filtered.map(opp => (
          <div
            key={opp.id}
            className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-blue-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl ${opp.logoBg} font-black text-xs flex items-center justify-center shrink-0 shadow-md`}>
                {opp.logoText}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {opp.company}
                  </h3>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {opp.matchScore}% Match
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {opp.status}
                  </span>
                </div>

                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {opp.role}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.duration}</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Stipend: {opp.stipend}
                  </span>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {opp.skills.map((skill, sIdx) => (
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
                <span>View Details & Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
