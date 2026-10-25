import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Edit2,
  Trash2,
  X,
  Sparkles,
  BarChart2,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AssessmentConfig {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  passingScore: number;
  questionsCount: number;
  status: 'active' | 'draft' | 'archived';
  completions: number;
  avgScore: number;
  sampleQuestions: { text: string; points: number }[];
}

export const AdminAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tests' | 'submissions'>('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<AssessmentConfig | null>(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Full-Stack Engineering',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    durationMinutes: 45,
    passingScore: 75,
    status: 'active' as 'active' | 'draft',
  });

  const [assessments, setAssessments] = useState<AssessmentConfig[]>([
    {
      id: 'asmt-aptitude',
      title: 'Aptitude & Critical Reasoning Diagnostic',
      category: 'General Aptitude',
      difficulty: 'Intermediate',
      durationMinutes: 45,
      passingScore: 70,
      questionsCount: 20,
      status: 'active',
      completions: 342,
      avgScore: 84,
      sampleQuestions: [
        { text: 'Time and work rate problem involving pipeline throughput', points: 5 },
        { text: 'Logical deduction sequence and pattern recognition', points: 5 },
        { text: 'Data sufficiency and analytical inference', points: 5 },
      ],
    },
    {
      id: 'asmt-technical',
      title: 'Full-Stack Architecture & Systems Diagnostic',
      category: 'Software Engineering',
      difficulty: 'Advanced',
      durationMinutes: 60,
      passingScore: 75,
      questionsCount: 25,
      status: 'active',
      completions: 289,
      avgScore: 78,
      sampleQuestions: [
        { text: 'REST vs GraphQL idempotency and caching strategies', points: 10 },
        { text: 'React 18 fiber architecture and concurrent rendering', points: 10 },
        { text: 'Database indexing B-Tree indexing vs hash index', points: 10 },
      ],
    },
    {
      id: 'asmt-hr',
      title: 'STAR Method Behavioral & Communication Review',
      category: 'Workplace Soft Skills',
      difficulty: 'Beginner',
      durationMinutes: 30,
      passingScore: 70,
      questionsCount: 15,
      status: 'active',
      completions: 215,
      avgScore: 88,
      sampleQuestions: [
        { text: 'Handling scope creep under tight sprint deadlines', points: 10 },
        { text: 'Resolving technical disagreements with senior architects', points: 10 },
      ],
    },
    {
      id: 'asmt-devops',
      title: 'Cloud Infrastructure & Kubernetes Benchmark',
      category: 'DevOps & SRE',
      difficulty: 'Advanced',
      durationMinutes: 45,
      passingScore: 80,
      questionsCount: 20,
      status: 'draft',
      completions: 0,
      avgScore: 0,
      sampleQuestions: [
        { text: 'Kubernetes ingress controller configuration and TLS termination', points: 10 },
        { text: 'CI/CD zero-downtime blue/green deployment strategy', points: 10 },
      ],
    },
  ]);

  const recentSubmissions = [
    { candidate: 'Rahul Sharma', email: 'rahul.s@example.com', test: 'Aptitude & Critical Reasoning', score: 90, passed: true, date: '15m ago' },
    { candidate: 'Priya Patel', email: 'priya.p@example.com', test: 'Full-Stack Architecture', score: 85, passed: true, date: '45m ago' },
    { candidate: 'Ankit Yadav', email: 'ankit.y@example.com', test: 'Full-Stack Architecture', score: 92, passed: true, date: '2h ago' },
    { candidate: 'Sneha Rao', email: 'sneha.r@example.com', test: 'STAR Method Behavioral', score: 72, passed: true, date: '3h ago' },
    { candidate: 'Vikas Kumar', email: 'vikas.k@example.com', test: 'Full-Stack Architecture', score: 62, passed: false, date: '5h ago' },
  ];

  const handleOpenAdd = () => {
    setEditingTest(null);
    setForm({
      title: '',
      category: 'Full-Stack Engineering',
      difficulty: 'Intermediate',
      durationMinutes: 45,
      passingScore: 75,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (test: AssessmentConfig) => {
    setEditingTest(test);
    setForm({
      title: test.title,
      category: test.category,
      difficulty: test.difficulty,
      durationMinutes: test.durationMinutes,
      passingScore: test.passingScore,
      status: test.status === 'archived' ? 'draft' : test.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (editingTest) {
      setAssessments((prev) =>
        prev.map((t) =>
          t.id === editingTest.id
            ? {
                ...t,
                title: form.title,
                category: form.category,
                difficulty: form.difficulty,
                durationMinutes: form.durationMinutes,
                passingScore: form.passingScore,
                status: form.status,
              }
            : t
        )
      );
      toast.success('Assessment updated successfully');
    } else {
      const newTest: AssessmentConfig = {
        id: `asmt-${Date.now()}`,
        title: form.title,
        category: form.category,
        difficulty: form.difficulty,
        durationMinutes: form.durationMinutes,
        passingScore: form.passingScore,
        questionsCount: 20,
        status: form.status,
        completions: 0,
        avgScore: 0,
        sampleQuestions: [
          { text: 'Core foundational principles question', points: 10 },
          { text: 'Practical debugging scenario', points: 10 },
        ],
      };
      setAssessments((prev) => [newTest, ...prev]);
      toast.success('Assessment benchmark created');
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setAssessments((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'active' ? 'draft' : 'active';
          toast.success(`Assessment set to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    setAssessments((prev) => prev.filter((t) => t.id !== id));
    toast.success('Assessment deleted');
  };

  const filteredTests = assessments.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Benchmark Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Configure diagnostic evaluations, question banks, and candidate passing rubrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/assessments')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview Student View
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Assessment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Benchmarks</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
            {assessments.filter((a) => a.status === 'active').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            {assessments.length} total in system
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Submissions</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
            {assessments.reduce((acc, curr) => acc + curr.completions, 0)}
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
            Across all candidate cohorts
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Pass Rate</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">87.2%</p>
          <span className="text-[11px] text-gray-500 mt-1 inline-block">Standardized scoring threshold</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Performing Domain</p>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 truncate">Full-Stack Arch</p>
          <span className="text-[11px] text-gray-500 mt-1 inline-block">78% average score</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-xs overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-700 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'tests' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Assessment Catalog ({assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'submissions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Recent Candidate Submissions
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'tests' ? (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assessments by title or category..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
                >
                  <option value="all">All Domains</option>
                  <option value="engineering">Software Engineering</option>
                  <option value="aptitude">General Aptitude</option>
                  <option value="soft skills">Workplace Soft Skills</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>

              {/* Assessment Cards */}
              <div className="space-y-3">
                {filteredTests.map((test) => {
                  const isExpanded = expandedId === test.id;
                  return (
                    <div
                      key={test.id}
                      className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{test.title}</h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                test.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                              }`}
                            >
                              {test.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{test.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} min
                            </span>
                            <span>•</span>
                            <span>Pass Threshold: {test.passingScore}%</span>
                            <span>•</span>
                            <span>{test.questionsCount} Questions</span>
                            <span>•</span>
                            <span>{test.completions} Submissions</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={() => handleToggleStatus(test.id)}
                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            title={test.status === 'active' ? 'Unpublish to draft' : 'Publish live'}
                          >
                            {test.status === 'active' ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(test)}
                            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            title="Edit Configuration"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : test.id)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? 'Hide Questions' : 'View Questions'}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Question Preview */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 text-xs">
                          <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                            Diagnostic Question Bank Samples
                          </p>
                          <div className="space-y-1.5">
                            {test.sampleQuestions.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="p-2.5 bg-gray-50 dark:bg-gray-750 rounded-lg flex items-center justify-between text-gray-700 dark:text-gray-300"
                              >
                                <span className="flex items-center gap-2">
                                  <FileQuestion className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span>{q.text}</span>
                                </span>
                                <span className="font-bold text-indigo-600 shrink-0">{q.points} Pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Submissions Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-750 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Assessment Benchmark</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentSubmissions.map((sub, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900 dark:text-white">{sub.candidate}</p>
                        <p className="text-[10px] text-gray-500">{sub.email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{sub.test}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">{sub.score}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            sub.passed
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                              : 'bg-red-50 text-red-600 dark:bg-red-950/40'
                          }`}
                        >
                          {sub.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{sub.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add / Edit Assessment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {editingTest ? 'Edit Assessment Benchmark' : 'Create New Assessment'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Distributed Systems Architecture Benchmark"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Domain Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Passing Threshold (%)</label>
                  <input
                    type="number"
                    value={form.passingScore}
                    onChange={(e) => setForm({ ...form, passingScore: parseInt(e.target.value) || 70 })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-primary rounded-xl shadow-xs">
                  {editingTest ? 'Save Changes' : 'Create Benchmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
