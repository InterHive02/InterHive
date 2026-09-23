import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Ban, CheckCircle, MoreVertical, User, Mail, Phone, Calendar, Shield } from 'lucide-react';

interface UserManagementProps {
  users: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    employeeId: string;
    profilePhoto?: string;
    lastLogin?: Date;
    createdAt: Date;
    isVerified: boolean;
  }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onActivate?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onRoleChange?: (id: string, role: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onEdit,
  onDelete,
  onActivate,
  onSuspend,
  onRoleChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'hr':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'manager':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'company':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'suspended':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'suspended':
        return <Ban className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleOptions = ['all', 'admin', 'hr', 'manager', 'intern', 'company'];
  const statusOptions = ['all', 'active', 'inactive', 'suspended'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          User Management
        </h3>
        <button className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {roleOptions.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Stacked Card View (< 640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 rounded-full object-cover max-w-full h-auto shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg shrink-0 ${getStatusColor(user.status)}`}>
                {getStatusIcon(user.status)}
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 text-xs rounded-lg font-semibold ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.isVerified && <span className="text-green-500 font-bold">✓</span>}
              </div>

              <div className="flex items-center gap-1.5">
                {onRoleChange && (
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className="px-2 py-1 min-h-[36px] text-xs border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="intern">Intern</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(user.id)}
                    aria-label="Edit user"
                    className="p-2 min-h-[36px] min-w-[36px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {user.status !== 'suspended' ? (
                  onSuspend && (
                    <button
                      onClick={() => onSuspend(user.id)}
                      aria-label="Suspend user"
                      className="p-2 min-h-[36px] min-w-[36px] text-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/30"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  onActivate && (
                    <button
                      onClick={() => onActivate(user.id)}
                      aria-label="Activate user"
                      className="p-2 min-h-[36px] min-w-[36px] text-green-600 rounded-lg bg-green-50 dark:bg-green-900/30"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Last Login</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Joined</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-full object-cover max-w-full h-auto"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-lg ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.isVerified && (
                    <span className="ml-1 text-xs text-green-500">✓</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {onRoleChange && (
                      <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user.id, e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="intern">Intern</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {user.status === 'active' ? (
                      onSuspend && (
                        <button
                          onClick={() => onSuspend(user.id)}
                          className="p-1.5 text-yellow-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )
                    ) : (
                      onActivate && (
                        <button
                          onClick={() => onActivate(user.id)}
                          className="p-1.5 text-green-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
