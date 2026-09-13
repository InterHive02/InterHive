import React from 'react';
import { User, Mail, Phone, Star, StarOff, Crown } from 'lucide-react';

interface ProjectCollaboratorsProps {
  collaborators: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
    role: 'mentor' | 'intern' | 'manager';
    isOnline?: boolean;
    rating?: number;
  }[];
}

export const ProjectCollaborators: React.FC<ProjectCollaboratorsProps> = ({ collaborators }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'mentor':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'manager':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'intern':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'manager') {
      return <Crown className="w-4 h-4" />;
    }
    return <User className="w-4 h-4" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Collaborators ({collaborators.length})
      </h3>

      <div className="space-y-3">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  {collaborator.profilePhoto ? (
                    <img
                      src={collaborator.profilePhoto}
                      alt={`${collaborator.firstName} ${collaborator.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-medium text-gray-500 dark:text-gray-400">
                      {collaborator.firstName[0]}{collaborator.lastName[0]}
                    </div>
                  )}
                </div>
                {collaborator.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {collaborator.firstName} {collaborator.lastName}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg ${getRoleColor(collaborator.role)}`}
                  >
                    {getRoleIcon(collaborator.role)}
                    {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{collaborator.email}</span>
                  {collaborator.phone && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <Phone className="w-3 h-3" />
                      <span>{collaborator.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {collaborator.rating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(collaborator.rating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {collaborator.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        ))}

        {collaborators.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No collaborators</p>
          </div>
        )}
      </div>
    </div>
  );
};
