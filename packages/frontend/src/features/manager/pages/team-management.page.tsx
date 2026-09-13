import React, { useState } from 'react';
import { Users, UserCheck, Search, Filter, Mail, Phone, Plus, CheckCircle2, Shield, ArrowUpRight, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const TeamManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSprint, setSelectedSprint] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberTrack, setNewMemberTrack] = useState('Full-Stack Engineering');

  const [members, setMembers] = useState([
    {
      id: 'tm-01',
      name: 'Vikram Mehta',
      email: 'vikram.m@gmail.com',
      track: 'Full-Stack Engineering',
      sprint: 'Sprint 3/4',
      progress: 88,
      mentor: 'Aditya Varma',
      status: 'Ready for Placement',
    },
    {
      id: 'tm-02',
      name: 'Sneha Reddy',
      email: 'sneha.r@outlook.com',
      track: 'Frontend UI Systems',
      sprint: 'Sprint 2/4',
      progress: 65,
      mentor: 'Pooja Nair',
      status: 'Active Sprint',
    },
    {
      id: 'tm-03',
      name: 'Rahul Sharma',
      email: 'rahul.s@gmail.com',
      track: 'Backend & Cloud Infra',
      sprint: 'Sprint 4/4',
      progress: 92,
      mentor: 'Siddharth Roy',
      status: 'Ready for Placement',
    },
    {
      id: 'tm-04',
      name: 'Priya Patel',
      email: 'priya.p@gmail.com',
      track: 'Data Engineering',
      sprint: 'Sprint 1/4',
      progress: 35,
      mentor: 'Kiran Rao',
      status: 'Active Sprint',
    },
    {
      id: 'tm-05',
      name: 'Aman Verma',
      email: 'aman.v@gmail.com',
      track: 'DevOps & Site Reliability',
      sprint: 'Sprint 3/4',
      progress: 78,
      mentor: 'Siddharth Roy',
      status: 'Active Sprint',
    },
  ]);

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.track.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSprint = selectedSprint === 'all' || m.sprint.includes(selectedSprint);
    return matchesSearch && matchesSprint;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM = {
      id: `tm-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      track: newMemberTrack,
      sprint: 'Sprint 1/4',
      progress: 10,
      mentor: 'Aditya Varma',
      status: 'Active Sprint',
    };

    setMembers(prev => [newM, ...prev]);
    toast.success(`Allocated ${newMemberName} to sprint team!`);
    setIsAddModalOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team & Cohort Management</h1>
          <p className="text-sm text-gray-500">Monitor intern sprint tracks, milestone completions, and mentor allocations</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Intern
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team member by name, track, or email..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-900 dark:text-white"
          />
        </div>
        <select
          value={selectedSprint}
          onChange={(e) => setSelectedSprint(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-900 dark:text-white"
        >
          <option value="all">All Sprints</option>
          <option value="Sprint 1">Sprint 1</option>
          <option value="Sprint 2">Sprint 2</option>
          <option value="Sprint 3">Sprint 3</option>
          <option value="Sprint 4">Sprint 4</option>
        </select>
      </div>

      {/* Roster Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Intern</th>
                <th className="py-3.5 px-4">Specialization Track</th>
                <th className="py-3.5 px-4">Sprint Progress</th>
                <th className="py-3.5 px-4">Assigned Mentor</th>
                <th className="py-3.5 px-4">Placement Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</div>
                    <div className="text-slate-400">{m.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {m.track}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{m.progress}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{m.sprint}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {m.mentor}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        m.status === 'Ready for Placement'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toast.success(`Viewing evaluation report for ${m.name}`)}
                      className="px-3 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Intern Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Allocate Intern to Team</h3>
                <p className="text-xs text-slate-500">Add an enrolled candidate to active sprint monitoring.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Aniket Joshi"
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. aniket.j@gmail.com"
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Engineering Track</label>
                <select
                  value={newMemberTrack}
                  onChange={(e) => setNewMemberTrack(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Full-Stack Engineering">Full-Stack Engineering</option>
                  <option value="Frontend UI Systems">Frontend UI Systems</option>
                  <option value="Backend & Cloud Infra">Backend & Cloud Infra</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="DevOps & Site Reliability">DevOps & Site Reliability</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
