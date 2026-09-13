import React, { useState } from 'react';
import { Save, Settings, Globe, Shield, Bell, Database, Users, Mail, Lock, Server, Palette, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../core/providers/theme.provider';

interface SystemSettingsProps {
  settings: {
    general: {
      appName: string;
      appVersion: string;
      environment: 'development' | 'staging' | 'production';
      timezone: string;
      language: string;
    };
    security: {
      sessionTimeout: number;
      maxLoginAttempts: number;
      passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
      };
      twoFactorAuth: boolean;
    };
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      inApp: boolean;
    };
    integrations: {
      emailProvider: string;
      smsProvider: string;
      storageProvider: string;
    };
    maintenance: {
      maintenanceMode: boolean;
      maintenanceMessage: string;
    };
  };
  onSave?: (settings: any) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onSave,
}) => {
  const { mode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'integrations' | 'maintenance'>('general');
  const [formData, setFormData] = useState(settings);

  const handleChange = (section: string, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleNestedChange = (section: string, subsection: string, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...prev[section as keyof typeof prev][subsection],
          [key]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'maintenance', label: 'Maintenance', icon: Server },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          App Name
        </label>
        <input
          type="text"
          value={formData.general.appName}
          onChange={(e) => handleChange('general', 'appName', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          App Version
        </label>
        <input
          type="text"
          value={formData.general.appVersion}
          onChange={(e) => handleChange('general', 'appVersion', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Environment
        </label>
        <select
          value={formData.general.environment}
          onChange={(e) => handleChange('general', 'environment', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Timezone
        </label>
        <select
          value={formData.general.timezone}
          onChange={(e) => handleChange('general', 'timezone', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
          <option value="Australia/Sydney">Australia/Sydney</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Language
        </label>
        <select
          value={formData.general.language}
          onChange={(e) => handleChange('general', 'language', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Theme Toggle */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme
        </label>
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          {mode === 'dark' ? (
            <>
              <Moon className="w-4 h-4" />
              Switch to Light Mode
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              Switch to Dark Mode
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          value={formData.security.sessionTimeout}
          onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          min={1}
          max={480}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Max Login Attempts
        </label>
        <input
          type="number"
          value={formData.security.maxLoginAttempts}
          onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          min={1}
          max={10}
        />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Password Policy
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Minimum Length
            </label>
            <input
              type="number"
              value={formData.security.passwordPolicy.minLength}
              onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min={6}
              max={20}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.security.passwordPolicy.requireUppercase}
              onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Require Uppercase Letter
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.security.passwordPolicy.requireLowercase}
              onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireLowercase', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Require Lowercase Letter
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.security.passwordPolicy.requireNumbers}
              onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Require Numbers
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.security.passwordPolicy.requireSpecialChars}
              onChange={(e) => handleNestedChange('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Require Special Characters
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <input
          type="checkbox"
          checked={formData.security.twoFactorAuth}
          onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Enable Two-Factor Authentication
        </label>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.notifications.email}
            onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.notifications.push}
            onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.notifications.sms}
            onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">In-App Notifications</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications within the app</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.notifications.inApp}
            onChange={(e) => handleChange('notifications', 'inApp', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Provider
        </label>
        <select
          value={formData.integrations.emailProvider}
          onChange={(e) => handleChange('integrations', 'emailProvider', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="sendgrid">SendGrid</option>
          <option value="ses">Amazon SES</option>
          <option value="smtp">SMTP</option>
          <option value="mailgun">Mailgun</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          SMS Provider
        </label>
        <select
          value={formData.integrations.smsProvider}
          onChange={(e) => handleChange('integrations', 'smsProvider', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="twilio">Twilio</option>
          <option value="vonage">Vonage</option>
          <option value="nexmo">Nexmo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Storage Provider
        </label>
        <select
          value={formData.integrations.storageProvider}
          onChange={(e) => handleChange('integrations', 'storageProvider', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="aws">AWS S3</option>
          <option value="cloudflare">Cloudflare R2</option>
          <option value="azure">Azure Blob</option>
          <option value="google">Google Cloud Storage</option>
        </select>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div>
          <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Maintenance Mode</h4>
          <p className="text-sm text-yellow-600 dark:text-yellow-300">
            Enable to put the platform in maintenance mode
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.maintenance.maintenanceMode}
            onChange={(e) => handleChange('maintenance', 'maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>

      {formData.maintenance.maintenanceMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Maintenance Message
          </label>
          <textarea
            value={formData.maintenance.maintenanceMessage}
            onChange={(e) => handleChange('maintenance', 'maintenanceMessage', e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="We're currently performing maintenance. Please check back later."
          />
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'maintenance':
        return renderMaintenanceSettings();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-48 bg-gray-50 dark:bg-gray-900/50 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
          <div className="flex md:flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full
                    ${activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h3>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
