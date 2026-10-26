import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GitPullRequest,
  ExternalLink,
  User,
  Calendar,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { projectApi } from '../../../api/endpoints/project.api';
import { applicationsApi } from '../../../api/endpoints/applications.api';

export interface ManagerTaskItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  assignedInternId?: string;
  assignedInternName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'review_needed' | 'revision_requested' | 'completed';
  dueDate: string;
  submissionLink?: string;
  submissionNotes?: string;
  submittedAt?: string;
  managerFeedback?: string;
}

export const TeamTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<ManagerTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Available real projects & interns for assignment
  const [availableProjects, setAvailableProjects] = useState<{ id: string; title: string }[]>([]);
  const [availableInterns, setAvailableInterns] = useState<{ id: string; name: string }[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<ManagerTaskItem | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>('');
  const [newTaskAssigneeName, setNewTaskAssigneeName] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  // Initial load
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [projRes, appsRes] = await Promise.all([
        projectApi.getAll({ page: 1, limit: 20 }).catch(() => ({ data: { data: [] } })),
        applicationsApi.getApplications({ page: 1, limit: 30 }).catch(() => ({ data: { data: [] } })),
      ]);

      const pList: any[] = (projRes as any)?.data?.data || (projRes as any)?.data || [];
      const formattedProjects = pList.map((p: any) => ({
        id: p._id || p.id || 'p-1',
        title: p.title || 'Distributed Systems Lab',
      }));
      setAvailableProjects(
        formattedProjects.length > 0
          ? formattedProjects
          : [
              { id: 'proj-1', title: 'Distributed Event-Driven Microservices' },
              { id: 'proj-2', title: 'Full-Stack Talent Matching Engine' },
              { id: 'proj-3', title: 'Real-time WebSocket Chat Architecture' },
            ]
      );

      const aList: any[] = (appsRes as any)?.data?.data || (appsRes as any)?.data || [];
      const formattedInterns = aList.map((a: any) => ({
        id: a._id || a.id || 'u-1',
        name: a.fullName || `${a.firstName || 'Candidate'} ${a.lastName || ''}`.trim(),
      }));
      setAvailableInterns(
        formattedInterns.length > 0
          ? formattedInterns
          : [
              { id: 'int-1', name: 'Vikram Mehta' },
              { id: 'int-2', name: 'Sneha Reddy' },
              { id: 'int-3', name: 'Rahul Sharma' },
              { id: 'int-4', name: 'Ananya Sharma' },
            ]
      );

      // Load saved tasks from localStorage cache or seed with realistic operational tasks
      const savedTasks = localStorage.getItem('interhive_manager_tasks_store');
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch {
          initializeDefaultTasks();
        }
      } else {
        initializeDefaultTasks();
      }
    } catch (err) {
      console.warn('Error loading tasks context:', err);
      initializeDefaultTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultTasks = () => {
    const defaultList: ManagerTaskItem[] = [
      {
        id: 'task-101',
        projectId: 'proj-1',
        projectName: 'Distributed Event-Driven Microservices',
        title: 'Implement Redis Idempotency Guard on Webhook Ingestion',
        description: 'Ensure incoming partner lead events are deduplicated within a 5-minute rolling window using Redis SETNX.',
        assignedInternName: 'Vikram Mehta',
        priority: 'critical',
        status: 'review_needed',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        submissionLink: 'https://github.com/InterHive02/InterHive/pull/42',
        submissionNotes: 'Implemented distributed lock with auto-expiry. Unit test suite passes with 98% coverage.',
        submittedAt: 'Today at 10:15 AM',
      },
      {
        id: 'task-102',
        projectId: 'proj-2',
        projectName: 'Full-Stack Talent Matching Engine',
        title: 'Optimize Vector Embedding Similarity Pipeline for Resume Scoring',
        description: 'Compute cosine distance across 4 candidate skill vectors and cache top 10 scoring matches.',
        assignedInternName: 'Sneha Reddy',
        priority: 'high',
        status: 'in_progress',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Overdue
        submissionNotes: 'Working on dimension normalization in numpy benchmark.',
      },
      {
        id: 'task-103',
        projectId: 'proj-3',
        projectName: 'Real-time WebSocket Chat Architecture',
        title: 'Add Heartbeat Ping-Pong to Prevent Socket Dropouts',
        description: 'Configure 30-second ping interval to auto-reconnect mobile web clients under network throttle.',
        assignedInternName: 'Rahul Sharma',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        submissionLink: 'https://github.com/InterHive02/InterHive/pull/39',
        submissionNotes: 'Added client-side reconnection exponential backoff.',
        managerFeedback: 'Approved with honors. Clean implementation and verified in staging.',
      },
      {
        id: 'task-104',
        projectId: 'proj-1',
        projectName: 'Distributed Event-Driven Microservices',
        title: 'Design NestJS Guard for Premium Role Enforcement',
        description: 'Protect /evaluations and /tasks endpoints using JWT claim checking.',
        assignedInternName: 'Ananya Sharma',
        priority: 'high',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      },
    ];
    setTasks(defaultList);
    localStorage.setItem('interhive_manager_tasks_store', JSON.stringify(defaultList));
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const saveTasksState = (updated: ManagerTaskItem[]) => {
    setTasks(updated);
    localStorage.setItem('interhive_manager_tasks_store', JSON.stringify(updated));
  };

  // Create Task Action
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    const proj = availableProjects.find((p) => p.id === newTaskProjectId) || availableProjects[0] || {
      id: 'proj-1',
      title: 'Industrial Core Sprint',
    };

    const assignee = newTaskAssigneeName.trim() || availableInterns[0]?.name || 'Unassigned';

    const newTask: ManagerTaskItem = {
      id: `task-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.title,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || 'Complete technical deliverable according to engineering specifications.',
      assignedInternName: assignee,
      priority: newTaskPriority,
      status: 'in_progress',
      dueDate: newTaskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    };

    // Attempt backend persistence
    try {
      if (proj.id && proj.id.length === 24) {
        await projectApi.createTask(proj.id, {
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
        });
      }
    } catch (err) {
      console.warn('Backend task create sync fallback:', err);
    }

    const updated = [newTask, ...tasks];
    saveTasksState(updated);
    toast.success(`Task "${newTask.title}" assigned to ${assignee}!`);
    setIsCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  // Review Actions
  const handleApproveSubmission = (task: ManagerTaskItem) => {
    const updated = tasks.map((t) => {
      if (t.id === task.id) {
        return {
          ...t,
          status: 'completed' as const,
          managerFeedback: reviewFeedback.trim() || 'Deliverable verified and approved against sprint criteria.',
        };
      }
      return t;
    });
    saveTasksState(updated);
    toast.success(`Approved deliverable for "${task.title}"! Status updated to Completed.`);
    setSelectedTaskForReview(null);
    setReviewFeedback('');
  };

  const handleRequestRevision = (task: ManagerTaskItem) => {
    if (!reviewFeedback.trim()) {
      toast.error('Please provide constructive revision notes for the intern.');
      return;
    }
    const updated = tasks.map((t) => {
      if (t.id === task.id) {
        return {
          ...t,
          status: 'revision_requested' as const,
          managerFeedback: reviewFeedback.trim(),
        };
      }
      return t;
    });
    saveTasksState(updated);
    toast.success(`Revision requested for ${task.assignedInternName}. Feedback sent!`);
    setSelectedTaskForReview(null);
    setReviewFeedback('');
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedInternName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'completed';

      let matchesStatus = true;
      if (filterStatus === 'review_needed') matchesStatus = t.status === 'review_needed';
      else if (filterStatus === 'in_progress') matchesStatus = t.status === 'in_progress';
      else if (filterStatus === 'completed') matchesStatus = t.status === 'completed';
      else if (filterStatus === 'overdue') matchesStatus = isOverdue;

      let matchesPriority = true;
      if (filterPriority === 'critical') matchesPriority = t.priority === 'critical';
      else if (filterPriority === 'high') matchesPriority = t.priority === 'high' || t.priority === 'critical';
      else if (filterPriority === 'medium') matchesPriority = t.priority === 'medium';
      else if (filterPriority === 'low') matchesPriority = t.priority === 'low';

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  // KPIs
  const totalTasksCount = tasks.length;
  const reviewNeededCount = tasks.filter((t) => t.status === 'review_needed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress' || t.status === 'revision_requested').length;
  const overdueCount = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Task & Sprint Deliverables Management
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Create tasks, assign deliverables, review code submissions, and track overdue milestones.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Assign New Task
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Tasks</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalTasksCount}</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Assigned across cohorts</p>
        </div>

        <div className="bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-lg">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{reviewNeededCount}</p>
          <p className="text-xs text-amber-600/80 font-bold mt-1">Awaiting manager sign-off</p>
        </div>

        <div className="bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{inProgressCount}</p>
          <p className="text-xs text-blue-600 font-semibold mt-1">Actively being implemented</p>
        </div>

        <div className="bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Tasks</span>
            <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">{overdueCount}</p>
          <p className="text-xs text-red-500 font-bold mt-1">Requires manager follow-up</p>
        </div>
      </div>

      {/* Urgent Overdue Alert Banner */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-900 dark:text-red-200">
                {overdueCount} Task{overdueCount > 1 ? 's are' : ' is'} past deadline
              </p>
              <p className="text-[11px] text-red-700 dark:text-red-300">
                Please follow up with assigned interns or adjust story timelines to avoid sprint slips.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('overdue')}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Filter Overdue
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#121526] p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title, assigned intern, or project..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161A30] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="review_needed">Needs Review ({reviewNeededCount})</option>
            <option value="in_progress">In Progress</option>
            <option value="overdue">Overdue ({overdueCount})</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High & Critical</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
            const isReviewNeeded = task.status === 'review_needed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl bg-white dark:bg-[#121526] border transition-all shadow-2xs hover:shadow-xs ${
                  isReviewNeeded
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/10'
                    : isOverdue
                    ? 'border-red-300 dark:border-red-800/80 bg-red-50/10'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                          task.priority === 'critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : task.priority === 'medium'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {task.priority} Priority
                      </span>

                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {task.projectName}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      {task.description}
                    </p>

                    {task.managerFeedback && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-700 dark:text-slate-300 border-l-2 border-indigo-600">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Manager Note: </span>
                        {task.managerFeedback}
                      </div>
                    )}
                  </div>

                  {/* Right Metadata and CTA */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{task.assignedInternName}</span>
                      </div>

                      <span className="text-slate-300">•</span>

                      <div
                        className={`flex items-center gap-1 font-semibold ${
                          isOverdue ? 'text-red-600 font-bold' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Due {task.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : task.status === 'review_needed'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                            : task.status === 'revision_requested'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {task.status === 'review_needed'
                          ? 'Review Needed'
                          : task.status === 'revision_requested'
                          ? 'Revision Requested'
                          : task.status === 'completed'
                          ? 'Completed'
                          : 'In Progress'}
                      </span>

                      {task.status === 'review_needed' && (
                        <button
                          onClick={() => {
                            setSelectedTaskForReview(task);
                            setReviewFeedback(task.managerFeedback || '');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <GitPullRequest className="w-3.5 h-3.5" />
                          Review Work
                        </button>
                      )}

                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => {
                            setSelectedTaskForReview(task);
                            setReviewFeedback(task.managerFeedback || '');
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Details & Sign Off
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center bg-white dark:bg-[#121526] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No tasks found matching your filter</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or status filter.</p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <form
            onSubmit={handleCreateTask}
            className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Assign New Engineering Task
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Distributed Rate Limiter with Redis & Express"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Associated Project</label>
                  <select
                    value={newTaskProjectId}
                    onChange={(e) => setNewTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {availableProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Assign to Intern</label>
                  <select
                    value={newTaskAssigneeName}
                    onChange={(e) => setNewTaskAssigneeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {availableInterns.map((i) => (
                      <option key={i.id} value={i.name}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Priority Level</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical (Blocker)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Deliverable Instructions & Acceptance Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline architectural requirements, test coverage expectations, and pull request checklist..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
              >
                Confirm & Assign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Submission Modal */}
      {selectedTaskForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Intern Deliverable</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedTaskForReview.assignedInternName} • {selectedTaskForReview.projectName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTaskForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <p className="text-slate-400 font-semibold">Task Objective</p>
                <p className="text-slate-900 dark:text-white font-bold">{selectedTaskForReview.title}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{selectedTaskForReview.description}</p>
              </div>

              {selectedTaskForReview.submissionLink && (
                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">Pull Request / Branch</span>
                  </div>
                  <a
                    href={selectedTaskForReview.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Open PR <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {selectedTaskForReview.submissionNotes && (
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Intern's Submission Notes</label>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedTaskForReview.submissionNotes}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Manager Feedback & Evaluation Notes *
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive code review notes, performance feedback, or revision requirements..."
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleRequestRevision(selectedTaskForReview)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Request Revisions
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForReview(null)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveSubmission(selectedTaskForReview)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Sign Off
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
