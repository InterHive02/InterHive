import React, { useState } from 'react';
import { Users, Building2, BookOpen, Award, TrendingUp, Calendar, Activity, Bell, Settings } from 'lucide-react';
import { UserManagement } from '../components/user-management';
import { CompanyManagement } from '../components/company-management';
import { ProgramManagement } from '../components/program-management';
import { SystemSettings } from '../components/system-settings';
import { useAdmin } from '../hooks/use-admin';

type TabType = 'overview' | 'users' | 'companies' | 'programs' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { users, companies, programs, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage the entire InterHive platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {users?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {users?.filter(u => u.status === 'active').length || 0} active
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Companies</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {companies?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {companies?.filter(c => c.status === 'verified').length || 0} verified
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Programs</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {programs?.length || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {programs?.filter(p => p.status === 'published').length || 0} published
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Hires</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            142
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +12 this month
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'companies'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Companies
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'programs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Programs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Overview content */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    {/* Activity items */}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Stats</h3>
                  {/* Quick stats */}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={users || []}
              onEdit={(id) => console.log('Edit user:', id)}
              onDelete={(id) => console.log('Delete user:', id)}
              onActivate={(id) => console.log('Activate user:', id)}
              onSuspend={(id) => console.log('Suspend user:', id)}
              onRoleChange={(id, role) => console.log('Change role:', id, role)}
            />
          )}

          {activeTab === 'companies' && (
            <CompanyManagement
              companies={companies || []}
              onEdit={(id) => console.log('Edit company:', id)}
              onDelete={(id) => console.log('Delete company:', id)}
              onVerify={(id) => console.log('Verify company:', id)}
              onSuspend={(id) => console.log('Suspend company:', id)}
            />
          )}

          {activeTab === 'programs' && (
            <ProgramManagement
              programs={programs || []}
              onEdit={(id) => console.log('Edit program:', id)}
              onDelete={(id) => console.log('Delete program:', id)}
              onView={(id) => console.log('View program:', id)}
              onPublish={(id) => console.log('Publish program:', id)}
              onArchive={(id) => console.log('Archive program:', id)}
            />
          )}

          {activeTab === 'settings' && (
            <SystemSettings
              settings={{
                general: {
                  appName: 'InterHive',
                  appVersion: '1.0.0',
                  environment: 'development',
                  timezone: 'UTC',
                  language: 'en',
                },
                security: {
                  sessionTimeout: 60,
                  maxLoginAttempts: 5,
                  passwordPolicy: {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                  },
                  twoFactorAuth: false,
                },
                notifications: {
                  email: true,
                  push: true,
                  sms: false,
                  inApp: true,
                },
                integrations: {
                  emailProvider: 'sendgrid',
                  smsProvider: 'twilio',
                  storageProvider: 'cloudflare',
                },
                maintenance: {
                  maintenanceMode: false,
                  maintenanceMessage: '',
                },
              }}
              onSave={(settings) => console.log('Save settings:', settings)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
