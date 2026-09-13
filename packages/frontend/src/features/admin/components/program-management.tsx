import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, CheckCircle, XCircle, Clock, BookOpen, Users, Calendar, Award } from 'lucide-react';

interface ProgramManagementProps {
  programs: {
    id: string;
    title: string;
    description: string;
    type: 'training' | 'assessment' | 'project';
    status: 'draft' | 'published' | 'archived';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    duration: { min: number; max: number };
    category?: string;
    enrollments: number;
    completionRate?: number;
    createdAt: Date;
    createdBy: { firstName: string; lastName: string };
  }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onPublish?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export const ProgramManagement: React.FC<ProgramManagementProps> = ({
  programs,
  onEdit,
  onDelete,
  onView,
  onPublish,
  onArchive,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'assessment':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'project':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'expert':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'archived':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training':
        return <BookOpen className="w-4 h-4" />;
      case 'assessment':
        return <Award className="w-4 h-4" />;
      case 'project':
        return <Users className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Program Management
        </h3>
        <button className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium">
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="training">Training</option>
            <option value="assessment">Assessment</option>
            <option value="project">Project</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(program.type)}
                <span className={`px-2 py-0.5 text-xs rounded-lg ${getTypeColor(program.type)}`}>
                  {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                </span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg ${getStatusColor(program.status)}`}>
                {getStatusIcon(program.status)}
                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
              </span>
            </div>

            <h4 className="mt-2 font-semibold text-gray-900 dark:text-white line-clamp-1">
              {program.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {program.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 text-xs rounded-lg ${getLevelColor(program.level)}`}>
                {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {program.duration.min}-{program.duration.max} days
              </span>
              {program.category && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {program.category}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {program.enrollments}
                </span>
                {program.completionRate !== undefined && (
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {program.completionRate}%
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(program.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-1">
              {onView && (
                <button
                  onClick={() => onView(program.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(program.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {program.status === 'draft' && onPublish && (
                <button
                  onClick={() => onPublish(program.id)}
                  className="p-1.5 text-green-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              {program.status === 'published' && onArchive && (
                <button
                  onClick={() => onArchive(program.id)}
                  className="p-1.5 text-yellow-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(program.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No programs found</p>
        </div>
      )}
    </div>
  );
};
