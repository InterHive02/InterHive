import React, { useState } from 'react';
import { X, BookOpen, Users, ShieldCheck, Download, Copy, Check, Calendar, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export type ResourceModalType = 'resume' | 'masterclass' | 'interview' | null;

interface FreeResourcesModalProps {
  type: ResourceModalType;
  onClose: () => void;
}

export const FreeResourcesModal: React.FC<FreeResourcesModalProps> = ({ type, onClose }) => {
  const [copiedResume, setCopiedResume] = useState(false);
  const [reservedClassId, setReservedClassId] = useState<string | null>(null);
  const [activePrepTab, setActivePrepTab] = useState<'dsa' | 'web' | 'behavioral'>('dsa');

  if (!type) return null;

  const resumeTemplateText = `# [YOUR FULL NAME]
Nagpur, Maharashtra, India | +91 98765 43210 | student@example.com
LinkedIn: linkedin.com/in/yourname | GitHub: github.com/yourhandle | Portfolio: yourportfolio.dev

## TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL (PostgreSQL), HTML5, CSS3
- Frameworks & Libraries: React, Node.js, Express, NestJS, Tailwind CSS, Redux Toolkit
- Developer Tools: Git, GitHub, Docker, Postman, Linux/Unix, Vercel, Vite
- Concepts: REST APIs, Microservices, Data Structures & Algorithms, Object-Oriented Design

## PROJECTS
### High-Performance Inventory Management System
- Architected a responsive inventory portal using React and TypeScript, managing 1,200+ SKU records with real-time stock alerts.
- Built RESTful API microservices in Node.js and PostgreSQL with indexed queries, reducing dashboard load latency by 42%.
- Integrated JWT authentication and role-based access control (Admin, Intern, Manager).
- Tech Stack: React, TypeScript, Node.js, PostgreSQL, Tailwind CSS

### Real-Time Collaborative Workspace
- Developed a web application facilitating real-time document editing and instant messaging via WebSockets.
- Designed clean MongoDB schemas and implemented optimistic UI updates for zero-lag typing experience.
- Tech Stack: React, Socket.io, Express, MongoDB

## EDUCATION
Bachelor of Technology (B.Tech) in Computer Science & Engineering
Nagpur Institute of Technology | 2022 - 2026 | CGPA: 8.4 / 10.0

## ACHIEVEMENTS & CERTIFICATIONS
- Top 10% in InterHive National Technical Diagnostic Assessment
- Solved 250+ LeetCode problems (Array, Dynamic Programming, Binary Trees)
`;

  const handleCopyResume = () => {
    navigator.clipboard.writeText(resumeTemplateText);
    setCopiedResume(true);
    toast.success('Resume template copied to clipboard!');
    setTimeout(() => setCopiedResume(false), 3000);
  };

  const handleDownloadResume = () => {
    const blob = new Blob([resumeTemplateText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'InterHive_Standard_Tech_Resume.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded InterHive Tech Resume Template!');
  };

  const masterclasses = [
    {
      id: 'mc-1',
      title: 'Architecting Scalable Microservices & APIs',
      speaker: 'Priya Sharma (Staff Engineer @ TechCorp)',
      time: 'Saturday, 6:00 PM – 7:30 PM IST',
      badge: 'Live Coding',
      description: 'Step-by-step breakdown of decoupling monolithic code, writing clean Docker files, and designing database indexes for high throughput.',
    },
    {
      id: 'mc-2',
      title: 'Cracking Product Company Technical Interviews',
      speaker: 'Arun Nair (Engineering Lead @ CloudScale)',
      time: 'Wednesday, 7:00 PM – 8:15 PM IST',
      badge: 'Live Q&A',
      description: 'What hiring managers look for in college GitHub repositories, live whiteboard problem solving, and behavioral STAR answers.',
    },
    {
      id: 'mc-3',
      title: 'Mastering Modern React & State Management',
      speaker: 'Aditi Deshmukh (Senior Frontend Architect)',
      time: 'Sunday, 5:00 PM – 6:30 PM IST',
      badge: 'Interactive',
      description: 'Custom React hooks, render optimization, server components, and production-ready enterprise frontend best practices.',
    },
  ];

  const prepQuestions = {
    dsa: [
      {
        q: 'Two Sum & Sliding Window Optimal Patterns',
        hint: 'Use a Hash Map for O(N) lookup instead of brute force O(N²). For variable sliding window, maintain left and right pointers and shrink window on constraint violation.',
      },
      {
        q: 'Inverting a Binary Tree & Level Order Traversal',
        hint: 'Use Breadth-First Search (Queue) for level-by-level processing, or simple recursive DFS swapping left and right child pointers.',
      },
      {
        q: 'Detecting a Cycle in a Linked List (Floyd Cycle Finding)',
        hint: 'Use slow pointer (1 step) and fast pointer (2 steps). If they meet, a cycle exists in O(N) time and O(1) space.',
      },
    ],
    web: [
      {
        q: 'How does the JavaScript Event Loop handle Promises vs setTimeout?',
        hint: 'Promises belong to the Microtask Queue which executes immediately after the current call stack clears, before Macrotasks (like setTimeout or setInterval) are dequeued.',
      },
      {
        q: 'Database Normalization vs Denormalization',
        hint: 'Normalization (3NF) reduces redundant data and prevents write anomalies. Denormalization is favored in high-read analytical or microservice environments to avoid costly JOINs.',
      },
      {
        q: 'Optimizing React Component Renders',
        hint: 'Leverage useMemo for expensive calculations, useCallback for stable function references passed to memoized children, and correct key props.',
      },
    ],
    behavioral: [
      {
        q: 'The STAR Method for Behavioral Interviews',
        hint: 'Situation (set context), Task (what was your responsibility), Action (what specific steps did YOU take), Result (quantifiable outcome e.g. improved speed by 30%).',
      },
      {
        q: '"Tell me about a time you faced a difficult bug under a deadline."',
        hint: 'Highlight systematic debugging (reproducing in sandbox, checking server logs, isolating components) rather than panic. Focus on learning and post-mortem.',
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151829] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {type === 'resume' && <BookOpen className="w-5 h-5" />}
              {type === 'masterclass' && <Users className="w-5 h-5" />}
              {type === 'interview' && <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                {type === 'resume' && 'Standard Tech Resume Template & Guide'}
                {type === 'masterclass' && 'Free Weekly Corporate Masterclasses'}
                {type === 'interview' && 'Essential Tech Interview Preparation Kit'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {type === 'resume' && 'ATS-friendly, proven format optimized for tech & software roles.'}
                {type === 'masterclass' && 'Direct live sessions with senior engineers and hiring partners.'}
                {type === 'interview' && 'Curated questions, structural formulas, and domain checklists.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* CONTENT: RESUME GUIDE */}
          {type === 'resume' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-300 space-y-2">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block">💡 3 Rules of High-Converting Tech Resumes:</span>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Single Page Only:</strong> Undergrads should never exceed 1 page. Recruiters spend 6 seconds per resume.</li>
                  <li><strong>Action + Metric Formula:</strong> "Reduced query latency by 42% by indexing PostgreSQL tables" vs. "Wrote SQL queries".</li>
                  <li><strong>Live Project Links:</strong> Every major project must have working GitHub code and a live deployed demo URL.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Template Preview (Markdown):</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyResume}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedResume ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadResume}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .md</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto border border-slate-800">
                  <pre className="whitespace-pre-wrap">{resumeTemplateText}</pre>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT: MASTERCLASSES */}
          {type === 'masterclass' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                As an InterHive student member, you have complimentary access to all live Saturday and Wednesday engineering masterclasses.
              </p>

              <div className="space-y-3">
                {masterclasses.map((mc) => {
                  const isReserved = reservedClassId === mc.id;
                  return (
                    <div
                      key={mc.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                              {mc.badge}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {mc.time}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{mc.title}</h4>
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mt-0.5">
                            {mc.speaker}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setReservedClassId(mc.id);
                            toast.success(`Seat reserved for "${mc.title}"! We sent a calendar invite to your registered email.`);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            isReserved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {isReserved ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>{isReserved ? 'Seat Reserved' : 'Reserve Free Seat'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {mc.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTENT: INTERVIEW PREP KIT */}
          {type === 'interview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setActivePrepTab('dsa')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    activePrepTab === 'dsa'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  DSA & Problem Solving
                </button>
                <button
                  onClick={() => setActivePrepTab('web')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    activePrepTab === 'web'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Web & Architecture
                </button>
                <button
                  onClick={() => setActivePrepTab('behavioral')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                    activePrepTab === 'behavioral'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Behavioral & HR (STAR)
                </button>
              </div>

              <div className="space-y-3">
                {prepQuestions[activePrepTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Code2 className="w-4 h-4" />
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.q}</h5>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-[#121526] border border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Key Approach: </strong>
                      {item.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#121526] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Included free with your registered student account.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
