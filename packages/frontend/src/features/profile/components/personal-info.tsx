import React from 'react';
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

interface PersonalInfoProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    dateOfBirth?: Date;
    gender?: string;
  };
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ data }) => {
  const formatDate = (date?: Date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Personal Information
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {data.firstName} {data.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{data.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {data.phone || 'Not provided'}
            </p>
          </div>
        </div>

        {data.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {data.address.street && `${data.address.street}, `}
                {data.address.city && `${data.address.city}, `}
                {data.address.state && `${data.address.state} `}
                {data.address.zipCode && `${data.address.zipCode}`}
                {data.address.country && `, ${data.address.country}`}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(data.dateOfBirth)}
            </p>
          </div>
        </div>

        {data.gender && (
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
