import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { useCompany } from '../../../api/hooks/use-company';
import { toast } from 'react-hot-toast';

export const CompanyRequirementsPage: React.FC = () => {
  const {
    useProfile,
    useRequirements,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    isCreatingRequirement,
  } = useCompany();

  const { data: profile } = useProfile();
  const companyId = profile?.id || profile?._id || 'company-default';
  const { data: requirementsData, refetch } = useRequirements(companyId);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newWorkType, setNewWorkType] = useState('Remote');
  const [newOpenings, setNewOpenings] = useState(2);
  const [newStipend, setNewStipend] = useState('₹25,000 - ₹35,000 / mo');
  const [newSkills, setNewSkills] = useState('React, Node.js, TypeScript');

  const defaultRequirements = [
    {
      id: 'req-01',
      _id: 'req-01',
      title: 'Frontend Developer Intern',
      department: 'Web Development',
      openings: 3,
      workType: 'Remote',
      stipend: '₹25,000 - ₹35,000 / mo',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      status: 'Active',
      applicantsCount: 24,
    },
    {
      id: 'req-02',
      _id: 'req-02',
      title: 'Data Science & ML Intern',
      department: 'Data & Analytics',
      openings: 2,
      workType: 'Hybrid',
      stipend: '₹30,000 - ₹40,000 / mo',
      skills: ['Python', 'PyTorch', 'Pandas', 'FastAPI'],
      status: 'Active',
      applicantsCount: 18,
    },
    {
      id: 'req-03',
      _id: 'req-03',
      title: 'Backend Node.js / NestJS Intern',
      department: 'Backend Engineering',
      openings: 4,
      workType: 'Remote',
      stipend: '₹28,000 - ₹38,000 / mo',
      skills: ['Node.js', 'NestJS', 'MongoDB', 'Redis'],
      status: 'Active',
      applicantsCount: 31,
    },
    {
      id: 'req-04',
      _id: 'req-04',
      title: 'UI/UX Product Design Intern',
      department: 'Product & Design',
      openings: 1,
      workType: 'Onsite',
      stipend: '₹22,000 - ₹30,000 / mo',
      skills: ['Figma', 'User Research', 'Design Systems'],
      status: 'Draft',
      applicantsCount: 16,
    },
  ];

  const fetched = Array.isArray(requirementsData)
    ? requirementsData
    : (requirementsData as any)?.data || [];

  const [localReqs, setLocalReqs] = useState<any[]>([]);

  const allRequirements = [
    ...localReqs,
    ...(fetched.length > 0 ? fetched : defaultRequirements),
  ];

  // Unique list by ID
  const uniqueRequirements = Array.from(
    new Map(allRequirements.map((item) => [item.id || item._id, item])).values(),
  );

  const filteredRequirements = uniqueRequirements.filter((req) => {
    const title = (req?.title || '').toLowerCase();
    const dept = (req?.department || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || title.includes(q) || dept.includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      (req?.status || 'Active').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setEditingReq(null);
    setNewTitle('');
    setNewDept('Engineering');
    setNewWorkType('Remote');
    setNewOpenings(2);
    setNewStipend('₹25,000 - ₹35,000 / mo');
    setNewSkills('React, Node.js, TypeScript');
    setIsPostModalOpen(true);
  };

  const handleOpenEditModal = (req: any) => {
    setEditingReq(req);
    setNewTitle(req.title || '');
    setNewDept(req.department || 'Engineering');
    setNewWorkType(req.workType || 'Remote');
    setNewOpenings(req.openings || 1);
    setNewStipend(req.stipend || '');
    setNewSkills(Array.isArray(req.skills) ? req.skills.join(', ') : req.skills || '');
    setIsPostModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this talent requirement?')) {
      try {
        deleteRequirement(id);
      } catch {}
      setLocalReqs((prev) => prev.filter((r) => (r.id || r._id) !== id));
      toast.success('Requirement removed successfully');
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a role title');
      return;
    }

    const skillsArray = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingReq) {
      const updated = {
        ...editingReq,
        title: newTitle.trim(),
        department: newDept,
        openings: Number(newOpenings) || 1,
        workType: newWorkType,
        stipend: newStipend,
        skills: skillsArray,
      };

      try {
        updateRequirement({
          id: editingReq.id || editingReq._id,
          data: updated,
        });
      } catch {}

      setLocalReqs((prev) =>
        prev.map((r) => ((r.id || r._id) === (editingReq.id || editingReq._id) ? updated : r)),
      );
      toast.success('Requirement updated successfully!');
    } else {
      const newReq = {
        id: `req-${Date.now()}`,
        _id: `req-${Date.now()}`,
        title: newTitle.trim(),
        department: newDept,
        openings: Number(newOpenings) || 1,
        workType: newWorkType,
        stipend: newStipend,
        skills: skillsArray,
        status: 'Active',
        applicantsCount: 0,
      };

      try {
        createRequirement({
          companyId: companyId || 'default-company',
          data: newReq as any,
        });
      } catch {}

      setLocalReqs((prev) => [newReq, ...prev]);
      toast.success('Hiring requirement posted successfully!');
    }

    setIsPostModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Talent Requirements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Post and manage job positions and internship roles for candidate matching
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post Requirement
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search positions by role or department..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none w-full sm:w-auto"
        >
          <option value="all">All Positions</option>
          <option value="active">Active Roles</option>
          <option value="draft">Draft Roles</option>
        </select>
      </div>

      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequirements.length > 0 ? (
          filteredRequirements.map((req: any) => {
            const reqId = req.id || req._id;
            const skills: string[] = Array.isArray(req.skills) ? req.skills : [];

            return (
              <div
                key={reqId}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] hover:border-teal-500/40 transition-all shadow-2xs space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {req.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {req.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        req.status === 'Draft'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                      }`}
                    >
                      {req.status || 'Active'}
                    </span>
                    <button
                      onClick={() => handleOpenEditModal(req)}
                      className="p-1 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Edit Requirement"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(reqId)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Delete Requirement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 rounded-md font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {req.workType || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    {req.openings || 1} Openings
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {req.stipend || 'Competitive'}
                  </span>
                  {req.applicantsCount !== undefined && (
                    <span className="ml-auto text-xs text-indigo-600 font-semibold">
                      {req.applicantsCount} Applicants
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-12 text-center text-sm text-gray-400 bg-white dark:bg-[#121526] rounded-2xl border border-gray-100 dark:border-gray-800">
            No talent requirements found. Click "Post Requirement" to create a new hiring role.
          </div>
        )}
      </div>

      {/* Post / Edit Requirement Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingReq ? 'Edit Talent Requirement' : 'Post Talent Requirement'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure candidate criteria to match pre-vetted interns.
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Node.js Developer Intern"
                  className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Work Type
                  </label>
                  <select
                    value={newWorkType}
                    onChange={(e) => setNewWorkType(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Openings
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newOpenings}
                    onChange={(e) => setNewOpenings(Number(e.target.value))}
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Stipend Range
                  </label>
                  <input
                    type="text"
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    placeholder="₹25,000 - ₹35,000 / mo"
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRequirement}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs disabled:opacity-50"
                >
                  {editingReq ? 'Update Position' : 'Post Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
