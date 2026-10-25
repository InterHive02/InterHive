import React, { useState, useEffect } from 'react';
import { Shield, Server, Database, Key, Sparkles, BarChart2, Settings, Globe } from 'lucide-react';
import { LandingStatsEditor } from '../../../shared/components/common/landing-stats-editor';
import { LandingContentManager } from '../components/landing-content-manager';
import { SystemSettings } from '../components/system-settings';
import { toast } from 'react-hot-toast';

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'stats' | 'system' | 'health'>('content');

  const defaultSettings = {
    general: {
      appName: 'InterHive',
      appVersion: '1.2.0',
      environment: 'development' as const,
      timezone: 'Asia/Kolkata (UTC+05:30)',
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
      storageProvider: 's3',
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'System undergoing scheduled maintenance. Please check back shortly.',
    },
  };

  const [systemSettings, setSystemSettings] = useState(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('interhive_admin_system_settings');
      if (saved) {
        setSystemSettings(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSaveSystemSettings = (newSettings: any) => {
    setSystemSettings(newSettings);
    localStorage.setItem('interhive_admin_system_settings', JSON.stringify(newSettings));
    toast.success('System configuration saved successfully');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin System Settings</h1>
        <p className="text-sm text-gray-500">
          Governance configuration, landing page social proof, and infrastructure health
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 gap-4">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'content'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Landing Social Proof
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> Landing Metrics
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'system'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" /> System Policies
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'health'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" /> Infrastructure Health
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'content' && <LandingContentManager />}

      {activeTab === 'stats' && <LandingStatsEditor />}

      {activeTab === 'system' && (
        <SystemSettings settings={systemSettings} onSave={handleSaveSystemSettings} />
      )}

      {activeTab === 'health' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Backend NestJS Cluster</p>
                <p className="text-xs text-gray-500">Node.js runtime active on port 3000 • 0 restart incidents</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Running</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">MongoDB & Redis Storage</p>
                <p className="text-xs text-gray-500">Connection pools healthy • Primary replica latency &lt; 2ms</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Connected</span>
          </div>
        </div>
      )}
    </div>
  );
};
