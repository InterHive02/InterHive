import React from 'react';
import { Camera, Edit2, User } from 'lucide-react';

interface ProfileHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePhoto?: string;
    employeeId: string;
  };
  onEdit?: () => void;
  onUploadPhoto?: (file: File) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEdit,
  onUploadPhoto,
}) => {
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadPhoto) {
      onUploadPhoto(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="relative -mt-12">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
          </div>

          {onUploadPhoto && (
            <label className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          )}
        </div>

        {/* User Info */}
        <div className="mt-4 flex flex-wrap items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email} · {user.employeeId}
            </p>
          </div>

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
    </div>
  );
};
