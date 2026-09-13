import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { CompanyProfile } from '../components/company-profile';
import { useCompany } from '../hooks/use-company';
import { toast } from 'react-hot-toast';

export const CompanyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { useProfile, updateCompany } = useCompany();
  const { data: profile, isLoading } = useProfile();

  const handleSave = async () => {
    try {
      await updateCompany({ id: profile.id, data: profile });
      toast.success('Profile updated successfully');
      navigate('/company/dashboard');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const companyData = {
    id: profile.id,
    name: profile.companyInfo.name,
    legalName: profile.companyInfo.legalName,
    logo: profile.companyInfo.logo,
    coverImage: profile.companyInfo.coverImage,
    description: profile.companyInfo.description,
    industry: profile.companyInfo.industry,
    size: profile.companyInfo.size || 0,
    foundedYear: profile.companyInfo.foundedYear || new Date().getFullYear(),
    website: profile.companyInfo.website || '',
    location: profile.contact.primaryContact?.address?.city || 'Remote',
    contact: {
      email: profile.contact.primaryContact.email,
      phone: profile.contact.primaryContact.phone || '',
    },
    status: profile.status,
    rating: 4.5,
    totalHires: 0,
    createdAt: profile.createdAt,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/company/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage your company information
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <CompanyProfile company={companyData} />
    </div>
  );
};
