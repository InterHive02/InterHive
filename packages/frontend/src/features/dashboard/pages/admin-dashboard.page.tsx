import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard-header';
import { Users, Building2, Award, Activity, ArrowRight, ShieldAlert, CheckCircle, Server } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const systemMetrics = [
    { label: 'Total Registered Users', value: '1,420', icon: Users, sub: '1,150 Interns, 270 Partners', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Active Partner Companies', value: '46', icon: Building2, sub: '8 Pending Verification', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Placements Made', value: '312', icon: Award, sub: '92% Satisfaction Rate', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'System Health', value: '99.9%', icon: Activity, sub: 'All services operational', color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
  ];

  const recentRegistrations = [
    { id: '1', name: 'Vikram Mehta', email: 'vikram.m@gmail.com', role: 'Intern (Full Stack)', date: '10 mins ago', status: 'Active' },
    { id: '2', name: 'Innovate AI Labs', email: 'careers@innovateai.io', role: 'Company Partner', date: '35 mins ago', status: 'Pending Approval' },
    { id: '3', name: 'Sneha Reddy', email: 'sneha.r@outlook.com', role: 'Intern (Frontend)', date: '1 hour ago', status: 'Active' },
    { id: '4', name: 'Ananya Deshmukh', email: 'ananya@interhive.in', role: 'HR Evaluator', date: '3 hours ago', status: 'Active' },
  ];

  const systemAlerts = [
    { id: '1', title: 'MongoDB Cluster Healthy', desc: 'Primary replica latency < 2ms', type: 'success' },
    { id: '2', title: 'Email Verification Service', desc: 'Active via MailModule & SMTP', type: 'info' },
    { id: '3', title: 'Batch Placement Sync', desc: 'Scheduled for midnight 00:00 UTC', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeader
          title="Super Administrator Central"
          subtitle="System-wide management, platform analytics, partner onboarding, and access control."
        />
        <div className="flex items-center gap-2">
          <Link
            to="/admin/companies"
            className="px-3.5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50"
          >
            Review Companies
          </Link>
          <Link
            to="/admin/interns"
            className="px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
          >
            Manage Interns
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{stat.value}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">{stat.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Platform Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Registrations & Approvals */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Platform Activity</h3>
            <Link to="/admin/analytics" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Full Activity Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="pb-3 font-medium">User / Entity</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                {recentRegistrations.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-gray-600 dark:text-gray-300">{user.role}</td>
                    <td className="py-3 text-xs font-mono text-gray-400">{user.date}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health & Security Alerts */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Services Status</h3>
            <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Normal</span>
            </div>
          </div>

          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-750">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-6">{alert.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/admin/settings"
              className="block w-full text-center py-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              System Configuration & Maintenance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
