import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle, XCircle, Building2, Globe, Users, Calendar, Mail, Phone } from 'lucide-react';

interface CompanyManagementProps {
  companies: {
    id: string;
    name: string;
    legalName: string;
    logo?: string;
    industry: string[];
    size: number;
    website: string;
    email: string;
    phone: string;
    status: 'pending' | 'verified' | 'active' | 'suspended' | 'inactive';
    createdAt: Date;
    requirements: number;
    hires: number;
  }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onVerify?: (id: string) => void;
  onSuspend?: (id: string) => void;
}

export const CompanyManagement: React.FC<CompanyManagementProps> = ({
  companies,
  onEdit,
  onDelete,
  onVerify,
  onSuspend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'suspended':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'suspended':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const allIndustries = Array.from(
    new Set(companies.flatMap(c => c.industry))
  );

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    const matchesIndustry = filterIndustry === 'all' || company.industry.includes(filterIndustry);
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Company Management
        </h3>
        <button className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
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
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Industries</option>
            {allIndustries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Stacked Card View (< 640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 rounded-lg object-cover max-w-full h-auto shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {company.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {company.legalName}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg shrink-0 ${getStatusColor(company.status)}`}>
                {getStatusIcon(company.status)}
                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span>{company.requirements} Reqs</span>
                <span>•</span>
                <span>{company.hires} Hires</span>
              </div>
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(company.id)}
                    aria-label="Edit company"
                    className="p-2 min-h-[36px] min-w-[36px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {company.status === 'pending' && onVerify && (
                  <button
                    onClick={() => onVerify(company.id)}
                    aria-label="Verify company"
                    className="p-2 min-h-[36px] min-w-[36px] text-green-600 rounded-lg bg-green-50 dark:bg-green-900/30"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {company.status !== 'suspended' ? (
                  onSuspend && (
                    <button
                      onClick={() => onSuspend(company.id)}
                      aria-label="Suspend company"
                      className="p-2 min-h-[36px] min-w-[36px] text-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/30"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  onVerify && (
                    <button
                      onClick={() => onVerify(company.id)}
                      aria-label="Restore company"
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
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Company</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Industry</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Requirements</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Hires</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Joined</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-lg object-cover max-w-full h-auto"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {company.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {company.legalName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {company.industry.slice(0, 2).map(industry => (
                      <span
                        key={industry}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
                      >
                        {industry}
                      </span>
                    ))}
                    {company.industry.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{company.industry.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${getStatusColor(company.status)}`}>
                    {getStatusIcon(company.status)}
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {company.requirements}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {company.hires}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {new Date(company.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(company.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {company.status === 'pending' && onVerify && (
                      <button
                        onClick={() => onVerify(company.id)}
                        className="p-1.5 text-green-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {company.status !== 'suspended' ? (
                      onSuspend && (
                        <button
                          onClick={() => onSuspend(company.id)}
                          className="p-1.5 text-yellow-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )
                    ) : (
                      onVerify && (
                        <button
                          onClick={() => onVerify(company.id)}
                          className="p-1.5 text-green-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(company.id)}
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

      {filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No companies found</p>
        </div>
      )}
    </div>
  );
};
