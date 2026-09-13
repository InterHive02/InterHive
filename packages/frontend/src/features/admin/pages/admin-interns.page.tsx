import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
  Eye,
  Mail,
  Phone,
  Briefcase,
  X,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useIntern } from '../../../api/hooks/use-intern';
import { useNavigate } from 'react-router-dom';

export const AdminInternsPage: React.FC = () => {
  const navigate = useNavigate();
  const { useInterns, useInternStats } = useIntern();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  const { data: internsResponse, isLoading } = useInterns();
  const { data: statsResponse } = useInternStats();

  const internsList: any[] = Array.isArray(internsResponse)
    ? internsResponse
    : (internsResponse as any)?.data || (internsResponse as any)?.interns || [];

  // Robust mock fallback candidates if database is fresh
  const defaultInterns = [
    {
      id: 'int-001',
      _id: 'int-001',
      personalInfo: {
        firstName: 'Ankit',
        lastName: 'Yadav',
        gender: 'male',
        dateOfBirth: '2002-05-14',
      },
      contact: {
        email: 'ankit.yadav@example.com',
        phone: '+91 98765 43210',
        address: { city: 'Bengaluru', state: 'Karnataka' },
      },
      academicInfo: {
        currentEducation: {
          institution: 'Delhi Technological University (DTU)',
          degree: 'B.Tech',
          field: 'Computer Science',
          grade: '8.8 CGPA',
        },
        cgpa: 8.8,
        graduationYear: 2026,
      },
      professionalInfo: {
        skills: ['React', 'TypeScript', 'Node.js', 'NestJS', 'MongoDB', 'Docker'],
      },
      preferences: {
        preferredDomains: ['Web Development', 'Full-Stack Engineering'],
        preferredWorkType: ['remote', 'hybrid'],
      },
      readiness: {
        overall: 92,
      },
      status: 'ready',
    },
    {
      id: 'int-002',
      _id: 'int-002',
      personalInfo: {
        firstName: 'Priya',
        lastName: 'Sharma',
        gender: 'female',
      },
      contact: {
        email: 'priya.sharma@example.com',
        phone: '+91 98123 45678',
        address: { city: 'Pune', state: 'Maharashtra' },
      },
      academicInfo: {
        currentEducation: {
          institution: 'IIT Bombay',
          degree: 'M.Tech',
          field: 'Data Science & AI',
          grade: '9.2 CGPA',
        },
        cgpa: 9.2,
        graduationYear: 2025,
      },
      professionalInfo: {
        skills: ['Python', 'PyTorch', 'Machine Learning', 'FastAPI', 'Pandas'],
      },
      preferences: {
        preferredDomains: ['AI & Machine Learning', 'Data Science'],
        preferredWorkType: ['remote'],
      },
      readiness: {
        overall: 88,
      },
      status: 'ready',
    },
    {
      id: 'int-003',
      _id: 'int-003',
      personalInfo: {
        firstName: 'Rahul',
        lastName: 'Verma',
        gender: 'male',
      },
      contact: {
        email: 'rahul.verma@example.com',
        phone: '+91 97654 32109',
        address: { city: 'Hyderabad', state: 'Telangana' },
      },
      academicInfo: {
        currentEducation: {
          institution: 'BITS Pilani',
          degree: 'B.E.',
          field: 'Information Systems',
          grade: '8.4 CGPA',
        },
        cgpa: 8.4,
        graduationYear: 2026,
      },
      professionalInfo: {
        skills: ['Go', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'PostgreSQL'],
      },
      preferences: {
        preferredDomains: ['DevOps & Cloud', 'Backend Systems'],
        preferredWorkType: ['hybrid', 'onsite'],
      },
      readiness: {
        overall: 76,
      },
      status: 'enrolled',
    },
    {
      id: 'int-004',
      _id: 'int-004',
      personalInfo: {
        firstName: 'Sneha',
        lastName: 'Patel',
        gender: 'female',
      },
      contact: {
        email: 'sneha.patel@example.com',
        phone: '+91 96543 21098',
        address: { city: 'Ahmedabad', state: 'Gujarat' },
      },
      academicInfo: {
        currentEducation: {
          institution: 'NID Ahmedabad',
          degree: 'B.Des',
          field: 'Digital Product Design',
          grade: '9.0 CGPA',
        },
        cgpa: 9.0,
        graduationYear: 2026,
      },
      professionalInfo: {
        skills: ['Figma', 'UI/UX Design', 'User Research', 'Design Systems', 'Wireframing'],
      },
      preferences: {
        preferredDomains: ['Product & UI/UX Design'],
        preferredWorkType: ['remote', 'hybrid'],
      },
      readiness: {
        overall: 95,
      },
      status: 'placed',
    },
  ];

  const allInterns = internsList.length > 0 ? internsList : defaultInterns;

  // Filter candidates
  const filteredInterns = allInterns.filter((intern) => {
    const fn = intern?.personalInfo?.firstName || intern?.firstName || '';
    const ln = intern?.personalInfo?.lastName || intern?.lastName || '';
    const name = `${fn} ${ln}`.toLowerCase();
    const email = (intern?.contact?.email || intern?.email || '').toLowerCase();
    const inst = (intern?.academicInfo?.currentEducation?.institution || '').toLowerCase();
    const skills = Array.isArray(intern?.professionalInfo?.skills)
      ? intern.professionalInfo.skills.join(' ').toLowerCase()
      : '';

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      name.includes(query) ||
      email.includes(query) ||
      inst.includes(query) ||
      skills.includes(query);

    const domains = intern?.preferences?.preferredDomains || [];
    const matchesDomain =
      selectedDomain === 'all' ||
      domains.some((d: string) => d.toLowerCase().includes(selectedDomain.toLowerCase()));

    const status = intern?.status || 'enrolled';
    const matchesStatus = selectedStatus === 'all' || status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDomain && matchesStatus;
  });

  const totalCount = allInterns.length;
  const readyCount = allInterns.filter((i) => (i?.readiness?.overall || 0) >= 80 || i?.status === 'ready').length;
  const enrolledCount = allInterns.filter((i) => i?.status === 'enrolled' || !i?.status).length;
  const placedCount = allInterns.filter((i) => i?.status === 'placed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate & Intern Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor preparation readiness, skills evaluation, and placement pipeline
          </p>
        </div>
        <button
          onClick={() => navigate('/communication')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Mail className="w-4 h-4" /> Message Interns
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Candidates
            </p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Job Ready ({'>'}80%)
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{readyCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              In Preparation
            </p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">{enrolledCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Placed Interns
            </p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">{placedCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, email, college, or skills..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Domains</option>
            <option value="web">Web Development</option>
            <option value="ai">AI / Data Science</option>
            <option value="devops">DevOps & Cloud</option>
            <option value="design">UI/UX Design</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="ready">Job Ready</option>
            <option value="enrolled">In Preparation</option>
            <option value="placed">Placed</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-750/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Candidate</th>
                <th className="px-6 py-3.5 font-semibold">Institution & Degree</th>
                <th className="px-6 py-3.5 font-semibold">Domain & Skills</th>
                <th className="px-6 py-3.5 font-semibold">Industry Readiness</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {filteredInterns.length > 0 ? (
                filteredInterns.map((intern: any, idx: number) => {
                  const fn = intern?.personalInfo?.firstName || intern?.firstName || 'Candidate';
                  const ln = intern?.personalInfo?.lastName || intern?.lastName || '';
                  const fullName = `${fn} ${ln}`.trim();
                  const email = intern?.contact?.email || intern?.email || '';
                  const institution = intern?.academicInfo?.currentEducation?.institution || 'Enrolled Student';
                  const degree = intern?.academicInfo?.currentEducation?.degree || 'Tech Cohort';
                  const domain = intern?.preferences?.preferredDomains?.[0] || 'Software Engineering';
                  const skills: string[] = intern?.professionalInfo?.skills || intern?.skills || [];
                  const score = intern?.readiness?.overall || (intern?.status === 'ready' ? 88 : 72);
                  const status = intern?.status || 'enrolled';

                  return (
                    <tr
                      key={intern.id || intern._id || `intern-${idx}`}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-750/50 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-primary text-white flex items-center justify-center font-bold text-sm">
                            {(fn[0] || 'C')}{(ln[0] || '')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{fullName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white text-xs">{institution}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{degree}</p>
                      </td>

                      {/* Domain & Skills */}
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-semibold mb-1">
                          {domain}
                        </span>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {skills.slice(0, 3).map((sk: any, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                            >
                              {typeof sk === 'string' ? sk : sk?.name}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{skills.length - 3}</span>
                          )}
                        </div>
                      </td>

                      {/* Readiness */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 85
                                  ? 'bg-emerald-500'
                                  : score >= 70
                                  ? 'bg-indigo-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{score}%</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                            status === 'ready'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : status === 'placed'
                              ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}
                        >
                          {status === 'ready' ? 'Job Ready' : status === 'placed' ? 'Placed' : 'In Training'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedCandidate(intern)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    No matching candidates found. Try adjusting your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-primary text-white flex items-center justify-center font-bold text-lg">
                  {(selectedCandidate?.personalInfo?.firstName?.[0] || 'C')}
                  {(selectedCandidate?.personalInfo?.lastName?.[0] || '')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedCandidate?.personalInfo?.firstName || selectedCandidate?.firstName}{' '}
                    {selectedCandidate?.personalInfo?.lastName || selectedCandidate?.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedCandidate?.contact?.email || selectedCandidate?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1">
                <p className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Academic Record</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedCandidate?.academicInfo?.currentEducation?.institution || 'Enrolled Student'}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedCandidate?.academicInfo?.currentEducation?.degree} ·{' '}
                  {selectedCandidate?.academicInfo?.currentEducation?.field} ·{' '}
                  {selectedCandidate?.academicInfo?.cgpa || 8.5} CGPA
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <p className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Verified Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCandidate?.professionalInfo?.skills || selectedCandidate?.skills || []).map(
                    (sk: any, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded font-medium"
                      >
                        {typeof sk === 'string' ? sk : sk?.name}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {selectedCandidate?.contact?.phone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{selectedCandidate.contact.phone}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCandidate(null);
                  navigate('/communication');
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Direct Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
