import React from 'react';
import { ReadinessScoreCard } from '../components/readiness-score-card';
import { SkillBreakdown } from '../components/skill-breakdown';
import { ProjectProgress } from '../components/project-progress';
import { RecentActivity } from '../components/recent-activity';
import { useIntern } from '../../../api/hooks/use-intern';
import { useProject } from '../../../api/hooks/use-project';
import { useDashboard } from '../hooks/use-dashboard';
import { Search } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/common/loading-spinner';

export const InternDashboardPage: React.FC = () => {
  const { useReadiness, useProfile } = useIntern();
  const { useMyProjects } = useProject();
  const { useRecentActivities } = useDashboard();

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: readiness, isLoading: readinessLoading } = useReadiness();
  const { data: projects, isLoading: projectsLoading } = useMyProjects();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  const isLoading = profileLoading || readinessLoading || projectsLoading || activitiesLoading;

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  // Ensure readiness data has proper structure
  const readinessData = {
    overall: readiness?.overall || 0,
    breakdown: readiness?.breakdown || {
      technicalSkills: 0,
      projects: 0,
      communication: 0,
      problemSolving: 0,
      industryWorkflow: 0,
      teamCollaboration: 0,
      leadership: 0,
      adaptability: 0,
    },
  };

  const skillData = readinessData.breakdown
    ? Object.entries(readinessData.breakdown).map(([key, value]) => ({
        category: key.replace(/([A-Z])/g, ' $1').trim(),
        score: Number(value) || 0,
        fullMark: 100,
      }))
    : [
        { category: 'Technical Skills', score: 0, fullMark: 100 },
        { category: 'Problem Solving', score: 0, fullMark: 100 },
        { category: 'Communication', score: 0, fullMark: 100 },
        { category: 'Teamwork', score: 0, fullMark: 100 },
        { category: 'Tools', score: 0, fullMark: 100 },
      ];

  // Calculate summary stats
  const totalSkills = skillData.length;
  const skillsCompleted = skillData.filter(s => s.score >= 70).length;
  const activeTasksCount = projects?.filter(p => p.status === 'in_progress').length || 0;
  const upcomingDeadlinesCount = projects?.filter(p => {
    if (!p.duration?.endDate) return false;
    const deadline = new Date(p.duration.endDate);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length || 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Title & Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Intern Dashboard
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, {profile?.personalInfo?.firstName || 'Intern'}!
          </p>
        </div>

        {/* Secondary Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, projects, tasks..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 4 Top Summary KPI Cards */}
      <ReadinessScoreCard
        score={readinessData.overall}
        breakdown={readinessData.breakdown}
        trend={5}
        skillsCompleted={skillsCompleted}
        totalSkills={totalSkills}
        activeTasksCount={activeTasksCount}
        upcomingDeadlinesCount={upcomingDeadlinesCount}
      />

      {/* 3 Grid Cards: Project Progress, Recent Activity, Skill Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Project Progress (4 cols) */}
        <div className="lg:col-span-4">
          <ProjectProgress
            projects={projects?.map((p: any) => ({
              id: p.id || p._id,
              title: p.title || 'Untitled Project',
              progress: p.progress || 0,
              status: p.status || 'not_started',
              deadline: p.duration?.endDate,
            })) || []}
          />
        </div>

        {/* Recent Activity (4 cols) */}
        <div className="lg:col-span-4">
          <RecentActivity activities={activities || []} />
        </div>

        {/* Skill Breakdown Radar Chart (4 cols) */}
        <div className="lg:col-span-4">
          <SkillBreakdown skills={skillData} />
        </div>

      </div>

    </div>
  );
};