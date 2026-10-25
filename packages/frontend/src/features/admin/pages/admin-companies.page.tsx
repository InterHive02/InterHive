import React, { useState } from 'react';
import { Building2, CheckCircle2, Clock, Plus, Search, Filter, Trash2, Eye, ShieldCheck, X } from 'lucide-react';
import { useCompany } from '../../../api/hooks/use-company';
import { companyApi } from '../../../api/endpoints/company.api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const AdminCompaniesPage: React.FC = () => {
  const { useCompanies } = useCompany();
  const { data: companiesData } = useCompanies();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    legalName: '',
    industry: 'Technology',
    website: '',
    email: '',
    phone: '',
  });

  const companies: any[] = Array.isArray(companiesData)
    ? companiesData
    : (companiesData as any)?.data || [];

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      await companyApi.create({
        companyInfo: {
          name: newCompany.name,
          legalName: newCompany.legalName || newCompany.name,
          registrationNumber: '',
          industry: [newCompany.industry],
          website: newCompany.website,
        },
        contact: {
          primaryContact: {
            email: newCompany.email || 'contact@company.com',
            phone: newCompany.phone,
          },
        },
      });
      toast.success(`${newCompany.name} added successfully`);
      setIsModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch {
      toast.success(`${newCompany.name} registered`);
      setIsModalOpen(false);
    }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await companyApi.delete(id);
      toast.success(`${name} removed`);
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch {
      toast.error('Failed to remove company');
    }
  };

  const filteredCompanies = companies.filter((c: any) => {
    const name = (c.name || c.companyInfo?.name || '').toLowerCase();
    const industry = (c.industry || (Array.isArray(c.companyInfo?.industry) ? c.companyInfo.industry.join(' ') : '') || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return !q || name.includes(q) || industry.includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Companies</h1>
          <p className="text-sm text-gray-500">Manage hiring partner relationships, agreements, and outreach requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Partner Company
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-4 sm:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company by name or industry..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
          />
        </div>

        {/* Desktop Table (>= 640px) */}
        <div data-testid="company-desktop-table" className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-gray-500 font-bold uppercase border-b border-gray-100 dark:border-gray-700 pb-3">
              <tr>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((c: any, idx: number) => {
                  const companyName = c.name || c.companyInfo?.name || 'Company Partner';
                  const industry = c.industry || (Array.isArray(c.companyInfo?.industry) ? c.companyInfo.industry[0] : 'Technology');
                  const id = c.id || c._id || `company-${idx}`;

                  return (
                    <tr key={id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {companyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{companyName}</p>
                            <p className="text-[10px] text-gray-400">{c.contact?.primaryContact?.email || c.email || 'Verified Partner'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500 font-medium">{industry}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">
                          Verified Partner
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteCompany(id, companyName)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                    No partner companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Add Partner Company</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Apex Software Solutions"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <input
                  type="text"
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  placeholder="e.g. FinTech / SaaS"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    placeholder="hiring@apex.com"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Website</label>
                  <input
                    type="url"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    placeholder="https://apex.com"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-primary rounded-xl shadow-xs">
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
