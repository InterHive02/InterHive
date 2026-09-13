import React from 'react';
import { Building2, Globe, Users, Calendar, Mail, Phone, MapPin, Award, Edit2 } from 'lucide-react';

interface CompanyProfileProps {
  company: {
    id: string;
    name: string;
    legalName?: string;
    logo?: string;
    coverImage?: string;
    description: string;
    industry: string[];
    size: number;
    foundedYear: number;
    website: string;
    location: string;
    contact: {
      email: string;
      phone: string;
    };
    status: string;
    rating?: number;
    totalHires?: number;
    createdAt: Date;
  };
  onEdit?: () => void;
}

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  company,
  onEdit,
}) => {
  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      'Software': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      'Finance': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      'Healthcare': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      'Education': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Consulting': 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return colors[industry] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover */}
      <div className="h-48 bg-gradient-to-r from-primary to-secondary relative">
        {company.coverImage && (
          <img
            src={company.coverImage}
            alt={company.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="px-6 pb-6 relative">
        {/* Logo & Header */}
        <div className="flex flex-wrap items-start justify-between -mt-12">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 shadow-lg">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {company.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {company.legalName || ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12">
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-lg ${getStatusColor(company.status)}`}>
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </span>
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {company.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Company Size</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {company.size}+ employees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Founded</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {company.foundedYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:text-primary-dark truncate max-w-[150px] block"
              >
                {new URL(company.website).hostname}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Hires</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {company.totalHires || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Industries</p>
          <div className="flex flex-wrap gap-2">
            {company.industry.map((industry) => (
              <span
                key={industry}
                className={`px-3 py-1 text-sm rounded-lg ${getIndustryColor(industry)}`}
              >
                {industry}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {company.contact.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {company.contact.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {company.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    case 'active':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};
