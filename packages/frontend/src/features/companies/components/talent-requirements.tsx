import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, Users, Briefcase, MapPin, Clock } from 'lucide-react';

interface TalentRequirementsProps {
  requirements: {
    id: string;
    position: string;
    department: string;
    count: number;
    skills: { id: string; name: string; level: string }[];
    experience: { min: number; max?: number };
    stipend: { min: number; max: number; currency: string; period: string };
    workType: 'remote' | 'hybrid' | 'onsite';
    location: string;
    duration: { min: number; max: number };
    startDate: Date;
    applicationDeadline?: Date;
    status: 'draft' | 'published' | 'closed' | 'filled' | 'cancelled';
    applications?: number;
  }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onCreate?: () => void;
}

export const TalentRequirements: React.FC<TalentRequirementsProps> = ({
  requirements,
  onEdit,
  onDelete,
  onView,
  onCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'filled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getWorkTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getWorkTypeColor = (type: string) => {
    switch (type) {
      case 'remote':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'hybrid':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'onsite':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch = req.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Talent Requirements
        </h3>
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Requirement
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRequirements.map((requirement) => (
          <div
            key={requirement.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {requirement.position}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-lg ${getStatusColor(requirement.status)}`}
                  >
                    {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                  </span>
                </div>
                {requirement.department && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {requirement.department}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {onView && (
                  <button
                    onClick={() => onView(requirement.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(requirement.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(requirement.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                {requirement.count} positions
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-lg ${getWorkTypeColor(requirement.workType)}`}
              >
                {getWorkTypeLabel(requirement.workType)}
              </span>
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                {requirement.location}
              </span>
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Briefcase className="w-4 h-4" />
                {requirement.stipend.currency} {requirement.stipend.min}-{requirement.stipend.max} / {requirement.stipend.period}
              </span>
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {requirement.duration.min}-{requirement.duration.max} months
              </span>
            </div>

            {/* Skills */}
            <div className="mt-2 flex flex-wrap gap-1">
              {requirement.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
                >
                  {skill.name}
                  <span className="ml-1 text-gray-400 dark:text-gray-500">
                    ({skill.level})
                  </span>
                </span>
              ))}
              {requirement.skills.length > 4 && (
                <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                  +{requirement.skills.length - 4} more
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>
                  Start Date: {new Date(requirement.startDate).toLocaleDateString()}
                </span>
                {requirement.applicationDeadline && (
                  <span>
                    Deadline: {new Date(requirement.applicationDeadline).toLocaleDateString()}
                  </span>
                )}
                {requirement.applications !== undefined && (
                  <span>
                    Applications: {requirement.applications}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredRequirements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No requirements found</p>
          </div>
        )}
      </div>
    </div>
  );
};
